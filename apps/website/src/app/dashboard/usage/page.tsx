"use client";

import { useState, useEffect } from "react";
import { Loader2, BarChart3, TrendingUp, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/dashboard/fade-in";

interface UsageStat {
  provider: string;
  totalTokens: number;
  sessionCount: number;
}

interface DailyUsage {
  date: string;
  tokens: number;
}

const PROVIDER_COLORS: Record<string, { bar: string; bg: string; text: string; light: string }> = {
  openai: { bar: "bg-emerald-500", bg: "bg-emerald-500/10", text: "text-emerald-500", light: "bg-emerald-500/20" },
  anthropic: { bar: "bg-violet-500", bg: "bg-violet-500/10", text: "text-violet-500", light: "bg-violet-500/20" },
  groq: { bar: "bg-orange-500", bg: "bg-orange-500/10", text: "text-orange-500", light: "bg-orange-500/20" },
  nvidia: { bar: "bg-blue-500", bg: "bg-blue-500/10", text: "text-blue-500", light: "bg-blue-500/20" },
  ollama: { bar: "bg-neutral-500", bg: "bg-neutral-500/10", text: "text-neutral-400", light: "bg-neutral-500/20" },
  custom: { bar: "bg-cyan-500", bg: "bg-cyan-500/10", text: "text-cyan-500", light: "bg-cyan-500/20" },
};

export default function UsagePage() {
  const [usage, setUsage] = useState<UsageStat[]>([]);
  const [daily, setDaily] = useState<DailyUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Usage — Kairo";
  }, []);

  useEffect(() => {
    async function fetchUsage() {
      try {
        const res = await fetch("/api/sessions?limit=100");
        if (res.ok) {
          const data = await res.json();
          const sessions = (data.sessions ?? []).filter((s: any) => s.provider !== "cli-login");

          const byProvider: Record<string, UsageStat> = {};
          const byDay: Record<string, number> = {};

          for (const s of sessions) {
            if (!byProvider[s.provider]) {
              byProvider[s.provider] = {
                provider: s.provider,
                totalTokens: 0,
                sessionCount: 0,
              };
            }
            byProvider[s.provider].totalTokens += s.tokenCount ?? 0;
            byProvider[s.provider].sessionCount += 1;

            const day = new Date(s.createdAt).toISOString().split("T")[0];
            byDay[day] = (byDay[day] ?? 0) + (s.tokenCount ?? 0);
          }

          setUsage(Object.values(byProvider));
          setDaily(
            Object.entries(byDay)
              .map(([date, tokens]) => ({ date, tokens }))
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
          );
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchUsage();
  }, []);

  const totalTokensAll = usage.reduce((sum, u) => sum + u.totalTokens, 0);
  const maxTokens = Math.max(...daily.map((d) => d.tokens), 1);
  const maxProviderTokens = Math.max(...usage.map((u) => u.totalTokens), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-violet-500/60" />
          <p className="text-xs text-muted-foreground/40">Loading usage data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Header ────────────────────────────────────────── */}
      <FadeIn delay={0}>
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6">
          <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-violet-500/8 blur-3xl" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
              <BarChart3 className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Usage
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Token usage across all providers.
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ── Total Usage Stat ─────────────────────────────── */}
      <FadeIn delay={150}>
      <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5">
        <div className="pointer-events-none absolute -left-4 -top-4 h-24 w-24 rounded-full bg-amber-500/5 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10">
            <TrendingUp className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
              Total Tokens Used
            </p>
            <p className="mt-0.5 text-3xl font-bold tracking-tight text-amber-500">
              {totalTokensAll.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      </FadeIn>

      {/* ── By Provider ───────────────────────────────────── */}
      <FadeIn delay={300}>
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-violet-500/10">
            <Activity className="h-3 w-3 text-violet-500" />
          </div>
          <h2 className="text-sm font-semibold text-foreground">
            By Provider
          </h2>
        </div>

        {usage.length === 0 ? (
          <div className="relative overflow-hidden rounded-xl border border-dashed border-border bg-card/30 p-8 text-center">
            <div className="pointer-events-none absolute -right-12 -top-12 h-24 w-24 rounded-full bg-violet-500/5 blur-2xl" />
            <div className="relative mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-dashed border-muted-foreground/20 bg-background/50">
              <BarChart3 className="h-5 w-5 text-muted-foreground/30" />
            </div>
            <p className="text-sm text-muted-foreground">
              No usage data yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {usage.map((stat) => {
              const colors = PROVIDER_COLORS[stat.provider] ?? PROVIDER_COLORS.anthropic;
              const percentage = (stat.totalTokens / maxProviderTokens) * 100;
              return (
                <div key={stat.provider} className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={cn("h-2 w-2 rounded-full", colors.bar)} />
                      <span className="text-sm font-medium text-foreground capitalize">
                        {stat.provider}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">
                        {stat.totalTokens.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground/40">tokens</span>
                      <span className="text-muted-foreground/30">·</span>
                      <span className="text-muted-foreground/60">
                        {stat.sessionCount} session{stat.sessionCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700 ease-out group-hover:opacity-90",
                        colors.bar,
                      )}
                      style={{ width: `${Math.max(percentage, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      </FadeIn>

      {/* ── Daily Usage ──────────────────────────────────── */}
      <FadeIn delay={450}>
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-amber-500/10">
            <TrendingUp className="h-3 w-3 text-amber-500" />
          </div>
          <h2 className="text-sm font-semibold text-foreground">
            Daily Usage
          </h2>
        </div>

        {daily.length === 0 ? (
          <div className="relative overflow-hidden rounded-xl border border-dashed border-border bg-card/30 p-8 text-center">
            <div className="pointer-events-none absolute -right-12 -top-12 h-24 w-24 rounded-full bg-amber-500/5 blur-2xl" />
            <div className="relative mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-dashed border-muted-foreground/20 bg-background/50">
              <BarChart3 className="h-5 w-5 text-muted-foreground/30" />
            </div>
            <p className="text-sm text-muted-foreground">
              No daily usage data yet.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-end gap-1" style={{ height: 140 }}>
              {daily.map((d, i) => {
                const height = Math.max((d.tokens / maxTokens) * 100, d.tokens > 0 ? 3 : 0);
                const isMax = d.tokens === maxTokens;
                return (
                  <div
                    key={d.date}
                    className="group/chart relative flex flex-1 flex-col items-center justify-end"
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1.5 text-xs text-background opacity-0 transition-opacity duration-200 group-hover/chart:opacity-100 shadow-lg z-10">
                      {d.tokens.toLocaleString()} tokens
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                    </div>

                    {/* Bar */}
                    <div
                      className={cn(
                        "w-full rounded-t-sm bg-gradient-to-t from-violet-600/70 to-violet-500/60 transition-all duration-500 hover:from-violet-500 hover:to-violet-400",
                        isMax && "from-amber-500/80 to-amber-400/60 hover:from-amber-500 hover:to-amber-400",
                      )}
                      style={{ height: `${height}%`, minHeight: d.tokens > 0 ? 4 : 0 }}
                    />

                    {/* Label */}
                    <span className="mt-1.5 text-[9px] text-muted-foreground/30 truncate w-full text-center select-none">
                      {new Date(d.date + "T00:00:00").toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
      </FadeIn>
    </div>
  );
}
