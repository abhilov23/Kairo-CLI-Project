"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Cpu,
  Zap,
  Clock,
  Terminal,
  Bot,
  User,
  Loader2,
  KeyRound,
  ShieldCheck,
  Globe,
} from "lucide-react";
import { FadeIn } from "@/components/dashboard/fade-in";

interface Message {
  role: string;
  content: string;
  tool_calls?: { function: { name: string } }[];
}

interface SessionDetail {
  id: string;
  title: string;
  provider: string;
  model: string;
  tokenCount: number;
  workspace: string | null;
  messages: Message[] | null;
  createdAt: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString();
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  const isTool = msg.role === "tool";
  const isSystem = msg.role === "system";

  if (isSystem) return null;

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          isUser
            ? "bg-violet-500/10 text-violet-500"
            : isTool
              ? "bg-amber-500/10 text-amber-500"
              : "bg-emerald-500/10 text-emerald-500"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : isTool ? <Terminal className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${
          isUser
            ? "bg-violet-500/10 text-foreground"
            : isTool
              ? "bg-amber-500/5 text-muted-foreground border border-amber-500/10"
              : "bg-muted/30 text-foreground border border-border/40"
        }`}
      >
        {msg.tool_calls && msg.tool_calls.length > 0 && (
          <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium text-amber-500/80">
            <Terminal className="h-3 w-3" />
            called {msg.tool_calls.map((tc) => tc.function.name).join(", ")}
          </div>
        )}
        <div className="whitespace-pre-wrap break-words">{msg.content || "(no content)"}</div>
      </div>
    </div>
  );
}

export default function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/sessions/${id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Session not found");
          throw new Error("Failed to load session");
        }
        const data = await res.json();
        setSession(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-violet-500/60" />
          <p className="text-xs text-muted-foreground/40">Loading session...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-sm text-muted-foreground">{error || "Session not found"}</p>
        <button
          onClick={() => router.push("/dashboard/sessions")}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sessions
        </button>
      </div>
    );
  }

  const isLogin = session.provider === "cli-login";

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.push("/dashboard/sessions")}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sessions
      </button>

      {/* Header */}
      <FadeIn delay={0}>
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6">
          <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-violet-500/8 blur-3xl" />
          <div className="relative flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                isLogin ? "bg-rose-500/10" : "bg-violet-500/10"
              }`}
            >
              {isLogin ? (
                <KeyRound className={`h-5 w-5 text-rose-500`} />
              ) : (
                <Bot className={`h-5 w-5 text-violet-500`} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold tracking-tight text-foreground truncate">
                {isLogin ? "CLI Login" : session.title}
              </h1>
              {isLogin && (
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Device authentication via KairoCLI
                </p>
              )}
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Metadata panel */}
      <FadeIn delay={100}>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50">
                Provider
              </p>
              <div className="flex items-center gap-1.5 text-sm text-foreground">
                <Cpu className="h-3.5 w-3.5 text-muted-foreground/60" />
                {session.provider}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50">
                Model
              </p>
              <p className="text-sm text-foreground">{session.model}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50">
                Tokens
              </p>
              <div className="flex items-center gap-1.5 text-sm text-foreground">
                <Zap className="h-3.5 w-3.5 text-muted-foreground/60" />
                {session.tokenCount.toLocaleString()}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50">
                Created
              </p>
              <div className="flex items-center gap-1.5 text-sm text-foreground">
                <Clock className="h-3.5 w-3.5 text-muted-foreground/60" />
                {formatDate(session.createdAt)}
              </div>
            </div>
          </div>
          {session.workspace && (
            <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground/60 border-t border-border/40 pt-3">
              <Terminal className="h-3.5 w-3.5" />
              {session.workspace}
            </div>
          )}
        </div>
      </FadeIn>

      {/* Login details for cli-login sessions */}
      {isLogin && (
        <FadeIn delay={150}>
          <div className="rounded-xl border border-rose-500/10 bg-rose-500/[0.02] p-5">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="h-4 w-4 text-rose-500" />
              <h2 className="text-sm font-semibold text-foreground">Authentication Details</h2>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <KeyRound className="h-3.5 w-3.5 text-muted-foreground/50" />
                <span>Authenticated via KairoCLI device code flow</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-muted-foreground/50" />
                <span>Session synced from terminal at {session.workspace || "unknown location"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-muted-foreground/50" />
                <span>Authentication time: {formatDate(session.createdAt)}</span>
              </div>
            </div>
          </div>
        </FadeIn>
      )}

      {/* Chat display */}
      {!isLogin && session.messages && session.messages.length > 0 && (
        <FadeIn delay={200}>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border/40 bg-muted/20 px-4 py-2.5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
                Conversation
              </h2>
            </div>
            <div className="space-y-4 p-4 max-h-[600px] overflow-y-auto">
              {session.messages
                .filter((m) => m.role !== "system")
                .map((msg, i) => (
                  <MessageBubble key={i} msg={msg} />
                ))}
            </div>
          </div>
        </FadeIn>
      )}

      {!isLogin && (!session.messages || session.messages.length === 0) && (
        <FadeIn delay={200}>
          <div className="rounded-xl border border-dashed border-border bg-card/30 p-12 text-center">
            <Bot className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              No conversation messages saved for this session.
            </p>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
