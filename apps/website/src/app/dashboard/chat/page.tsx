"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Loader2,
  Zap,
  Globe,
  Key,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
} from "lucide-react";
import { FadeIn } from "@/components/dashboard/fade-in";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [mode, setMode] = useState<"free" | "own">("free");
  const [ownKey, setOwnKey] = useState("");
  const [ownModel, setOwnModel] = useState("");
  const [ownBaseURL, setOwnBaseURL] = useState("");
  const [error, setError] = useState("");
  const [usage, setUsage] = useState<{
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  } | null>(null);
  const [showConfig, setShowConfig] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    document.title = "Chat — Kairo";
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || streaming) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const assistantMsg: ChatMessage = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    setStreaming(true);
    setError("");
    setUsage(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          mode,
          ...(mode === "own"
            ? {
                apiKey: ownKey,
                model: ownModel || undefined,
                baseURL: ownBaseURL || undefined,
              }
            : {}),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === "delta") {
              setMessages((prev) => {
                const next = [...prev];
                const last = next[next.length - 1];
                if (last?.role === "assistant") {
                  next[next.length - 1] = { ...last, content: last.content + data.content };
                }
                return next;
              });
            } else if (data.type === "done") {
              setUsage(data.usage);
            } else if (data.type === "error") {
              setError(data.message);
            }
          } catch {
            // skip malformed
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setStreaming(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col gap-0">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
            <MessageSquare className="h-5 w-5 text-violet-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">Chat</h1>
            <p className="text-xs text-muted-foreground">
              {mode === "free" ? "Free gateway chat" : "Using your own provider"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {usage && (
            <div className="flex items-center gap-1.5 rounded-md bg-muted/50 px-2.5 py-1.5 text-[11px] text-muted-foreground">
              <Zap className="h-3 w-3" />
              {usage.total_tokens.toLocaleString()} tokens
            </div>
          )}

          <button
            onClick={() => setShowConfig(!showConfig)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors",
              mode === "own"
                ? "border-violet-500/30 bg-violet-500/10 text-violet-500"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {mode === "free" ? <Globe className="h-3 w-3" /> : <Key className="h-3 w-3" />}
            {mode === "free" ? "Free" : "My Key"}
          </button>
        </div>
      </div>

      {/* Config panel */}
      {showConfig && (
        <FadeIn delay={0}>
          <div className="mt-3 rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">Chat Mode</span>
              <button
                onClick={() => {
                  setMode(mode === "free" ? "own" : "free");
                  setError("");
                }}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {mode === "free" ? (
                  <>
                    <ToggleLeft className="h-4 w-4" />
                    Switch to own key
                  </>
                ) : (
                  <>
                    <ToggleRight className="h-4 w-4 text-violet-500" />
                    Switch to free
                  </>
                )}
              </button>
            </div>

            {mode === "free" ? (
              <p className="text-xs text-muted-foreground/70">
                Using the free chat gateway configured on the server.
              </p>
            ) : (
              <div className="space-y-2">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground">API Key</label>
                  <input
                    type="password"
                    value={ownKey}
                    onChange={(e) => setOwnKey(e.target.value)}
                    placeholder="sk-..."
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground">Model</label>
                    <input
                      type="text"
                      value={ownModel}
                      onChange={(e) => setOwnModel(e.target.value)}
                      placeholder="gpt-4o-mini"
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground">Base URL</label>
                    <input
                      type="text"
                      value={ownBaseURL}
                      onChange={(e) => setOwnBaseURL(e.target.value)}
                      placeholder="https://api.openai.com/v1"
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </FadeIn>
      )}

      {/* Messages */}
      <div
        ref={listRef}
        className="mt-4 flex-1 space-y-4 overflow-y-auto rounded-xl border border-border bg-card p-4"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Bot className="mb-3 h-10 w-10 text-muted-foreground/20" />
            <p className="text-sm text-muted-foreground/50">
              Send a message to start chatting.
            </p>
            <p className="mt-1 text-xs text-muted-foreground/30">
              {mode === "free"
                ? "Using the free gateway provider."
                : "Using your own API key."}
            </p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  msg.role === "user"
                    ? "bg-violet-500/10 text-violet-500"
                    : "bg-emerald-500/10 text-emerald-500",
                )}
              >
                {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div
                className={cn(
                  "max-w-[80%] rounded-xl px-4 py-2.5 text-sm whitespace-pre-wrap break-words",
                  msg.role === "user"
                    ? "bg-violet-500/10 text-foreground"
                    : "bg-muted/30 text-foreground border border-border/40",
                )}
              >
                {msg.content || (i === messages.length - 1 && streaming ? (
                  <span className="inline-flex gap-0.5">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/30" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/30 [animation-delay:0.1s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/30 [animation-delay:0.2s]" />
                  </span>
                ) : (
                  "(no content)"
                ))}
              </div>
            </div>
          ))
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {error}
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mt-3 flex shrink-0 gap-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          disabled={streaming}
          className="min-h-[44px] flex-1 resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-violet-500/50 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || streaming}
          className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-xl bg-violet-500 text-white transition-colors hover:bg-violet-600 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {streaming ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </form>
    </div>
  );
}
