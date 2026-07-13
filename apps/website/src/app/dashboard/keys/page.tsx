"use client";

import { useState, useEffect } from "react";
import { Key, Loader2, Check, Shield, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/dashboard/fade-in";

interface ApiKeyEntry {
  id: string;
  provider: string;
  label: string | null;
  createdAt: string;
}

const PROVIDER_OPTIONS = [
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "groq", label: "Groq" },
  { value: "nvidia", label: "NVIDIA" },
  { value: "ollama", label: "Ollama" },
];

const PROVIDER_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  openai: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    border: "border-emerald-500/20",
    glow: "shadow-emerald-500/10",
  },
  anthropic: {
    bg: "bg-violet-500/10",
    text: "text-violet-500",
    border: "border-violet-500/20",
    glow: "shadow-violet-500/10",
  },
  groq: {
    bg: "bg-orange-500/10",
    text: "text-orange-500",
    border: "border-orange-500/20",
    glow: "shadow-orange-500/10",
  },
  nvidia: {
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    border: "border-blue-500/20",
    glow: "shadow-blue-500/10",
  },
  ollama: {
    bg: "bg-neutral-500/10",
    text: "text-neutral-400",
    border: "border-neutral-500/20",
    glow: "shadow-neutral-500/5",
  },
};

export default function KeysPage() {
  const [keys, setKeys] = useState<ApiKeyEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "API Keys — Kairo";
  }, []);

  useEffect(() => {
    async function fetchKeys() {
      try {
        const res = await fetch("/api/config/sync");
        if (res.ok) {
          const data = await res.json();
          setKeys(data.apiKeys ?? []);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchKeys();
  }, []);

  const configuredProviders = new Set(keys.map((k) => k.provider));
  const unconfiguredProviders = PROVIDER_OPTIONS.filter(
    (p) => !configuredProviders.has(p.value),
  );

  return (
    <div className="space-y-6">
      {/* ── Header ────────────────────────────────────────── */}
      <FadeIn delay={0}>
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6">
          <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-violet-500/8 blur-3xl" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
              <Shield className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                API Keys
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Manage your provider API keys. Keys are hashed and never stored in
                plaintext.
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-violet-500/60" />
            <p className="text-xs text-muted-foreground/40">Loading keys...</p>
          </div>
        </div>
      ) : (
        <>
          {/* ── Configured Providers ─────────────────────── */}
          <FadeIn delay={150}>
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500/10">
                <Check className="h-3 w-3 text-emerald-500" />
              </div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                Configured Providers
              </h2>
            </div>

            {keys.length === 0 ? (
              <div className="relative overflow-hidden rounded-xl border border-dashed border-border bg-card/30 p-8 text-center">
                <div className="pointer-events-none absolute -right-12 -top-12 h-24 w-24 rounded-full bg-violet-500/5 blur-2xl" />
                <div className="relative mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-dashed border-muted-foreground/20 bg-background/50">
                  <Key className="h-5 w-5 text-muted-foreground/30" />
                </div>
                <p className="text-sm text-muted-foreground">
                  No API keys configured yet. Add keys using the KairoCLI setup command.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {keys.map((k) => {
                  const colors = PROVIDER_COLORS[k.provider] ?? PROVIDER_COLORS.anthropic;
                  return (
                    <div
                      key={k.id}
                      className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-violet-500/20 hover:shadow-[0_0_24px_-8px_rgba(139,92,246,0.12)]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-bold transition-transform duration-200 group-hover:scale-110",
                              colors.bg,
                              colors.text,
                              colors.border,
                            )}
                          >
                            {k.provider.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {k.label ||
                                k.provider.charAt(0).toUpperCase() +
                                  k.provider.slice(1)}
                            </p>
                            <p className="text-xs text-muted-foreground/60">
                              Added{" "}
                              {new Date(k.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
                          <Check className="h-4 w-4 text-emerald-500" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
          </FadeIn>

          {/* ── Available Providers ──────────────────────── */}
          {unconfiguredProviders.length > 0 && (
            <FadeIn delay={300}>
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-muted">
                  <Plus className="h-3 w-3 text-muted-foreground/60" />
                </div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                  Available Providers
                </h2>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {unconfiguredProviders.map((p) => {
                  const colors = PROVIDER_COLORS[p.value] ?? PROVIDER_COLORS.anthropic;
                  return (
                    <div
                      key={p.value}
                      className="group relative overflow-hidden rounded-xl border border-dashed border-border bg-card/30 p-4 transition-all duration-300 hover:border-violet-500/20 hover:bg-card/50"
                    >
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-violet-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="relative flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-xl border border-dashed text-sm",
                            colors.text.replace("text-", "text-").replace(colors.text.split("-")[1], "muted-foreground/30"),
                            "border-muted-foreground/10",
                          )}
                        >
                          <Key className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground/60">
                            {p.label}
                          </p>
                          <p className="text-xs text-muted-foreground/40">
                            Run{" "}
                            <code className="rounded bg-muted px-1 py-0.5 text-[10px] font-mono">
                              kairo setup
                            </code>{" "}
                            to configure
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
            </FadeIn>
          )}
        </>
      )}
    </div>
  );
}
