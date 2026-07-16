"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Loader2, Terminal, History } from "lucide-react";
import SessionCard from "@/components/dashboard/session-card";
import { FadeIn } from "@/components/dashboard/fade-in";

interface Session {
  id: string;
  title: string;
  provider: string;
  model: string;
  tokenCount: number;
  workspace: string | null;
  createdAt: string;
}

const STATIC_PILLS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
];

const PROVIDER_LABELS: Record<string, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  groq: "Groq",
  nvidia: "NVIDIA",
  ollama: "Ollama",
  custom: "Custom",
};

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState<string>("all");
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Build provider pills from data + known labels
  const availableProviders = [...new Set(sessions.map((s) => s.provider))];
  const providerPills = [
    ...STATIC_PILLS,
    ...Object.keys(PROVIDER_LABELS)
      .filter((p) => availableProviders.includes(p))
      .map((p) => ({ value: p, label: PROVIDER_LABELS[p] })),
    ...availableProviders
      .filter((p) => !PROVIDER_LABELS[p])
      .map((p) => ({ value: p, label: p.charAt(0).toUpperCase() + p.slice(1) })),
  ];

  useEffect(() => {
    document.title = "Sessions — Kairo";
  }, []);

  // Initial fetch
  useEffect(() => {
    async function loadInitial() {
      try {
        setLoading(true);
        const res = await fetch("/api/sessions?limit=20");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setSessions(data.sessions ?? []);
        setCursor(data.nextCursor);
        setHasMore(!!data.nextCursor);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    loadInitial();
  }, []);

  async function loadMore() {
    if (!cursor) return;
    try {
      setLoadingMore(true);
      const res = await fetch(`/api/sessions?cursor=${cursor}&limit=20`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setSessions((prev) => [...prev, ...(data.sessions ?? [])]);
      setCursor(data.nextCursor);
      setHasMore(!!data.nextCursor);
    } catch {
      // silently fail
    } finally {
      setLoadingMore(false);
    }
  }

  // Client-side filtering
  const filtered = sessions.filter((s) => {
    const matchesSearch =
      !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.provider.toLowerCase().includes(search.toLowerCase()) ||
      s.model.toLowerCase().includes(search.toLowerCase());

    const matchesProvider =
      providerFilter === "all" || s.provider === providerFilter;

    return matchesSearch && matchesProvider;
  });

  return (
    <div className="space-y-6">
      {/* ── Header ────────────────────────────────────────── */}
      <FadeIn delay={0}>
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6">
          <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-violet-500/8 blur-3xl" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
              <History className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Sessions
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Browse all your Kairo sessions.
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ── Search + Filter Pills ─────────────────────────── */}
      <FadeIn delay={150}>
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
          <input
            type="text"
            placeholder="Search sessions by title, provider, or model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/30 transition-all duration-200 focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/15 focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-muted-foreground/40 mr-1" />
          {providerPills.map((pill) => {
            const isActive = providerFilter === pill.value;
            const isDisabled =
              pill.value !== "all" && !availableProviders.includes(pill.value);
            return (
              <button
                key={pill.value}
                onClick={() => !isDisabled && setProviderFilter(pill.value)}
                disabled={isDisabled}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-violet-500/10 text-violet-500 ring-1 ring-violet-500/20"
                    : isDisabled
                      ? "text-muted-foreground/20 cursor-not-allowed"
                      : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 ring-1 ring-transparent hover:ring-border"
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>
      </FadeIn>

      {/* ── Sessions List ─────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-violet-500/60" />
            <p className="text-xs text-muted-foreground/40">Loading sessions...</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="relative overflow-hidden rounded-xl border border-dashed border-border bg-card/30 p-12 text-center">
          <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-violet-500/5 blur-2xl" />
          <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-muted-foreground/20 bg-background/50">
            <Terminal className="h-6 w-6 text-muted-foreground/30" />
          </div>
          <p className="text-sm text-muted-foreground">
            {sessions.length === 0
              ? "No sessions yet. Start a session in your terminal to see it here."
              : "No sessions match your search."}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <p className="text-xs text-muted-foreground/40">
                {filtered.length} session{filtered.length !== 1 ? "s" : ""}
                {providerFilter !== "all"
                  ? ` with ${providerPills.find((p) => p.value === providerFilter)?.label ?? providerFilter}`
                  : ""}
                {search ? ` matching "${search}"` : ""}
              </p>
            </div>
            {filtered.map((s, i) => (
              <SessionCard
                key={s.id}
                id={s.id}
                title={s.title}
                provider={s.provider}
                model={s.model}
                tokenCount={s.tokenCount}
                workspace={s.workspace}
                createdAt={s.createdAt}
                index={i}
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-4">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-5 py-2.5 text-sm text-muted-foreground transition-all duration-200 hover:text-foreground hover:border-violet-500/30 hover:shadow-[0_0_20px_-8px_rgba(139,92,246,0.12)] disabled:opacity-50"
              >
                {loadingMore ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Load more"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
