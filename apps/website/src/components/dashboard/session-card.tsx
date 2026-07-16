"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Cpu, FileText, Terminal, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface SessionCardProps {
  id?: string;
  title: string;
  provider: string;
  model: string;
  tokenCount: number;
  workspace?: string | null;
  createdAt: string;
  index?: number;
}

function timeAgo(dateString: string): string {
  const now = Date.now();
  const date = new Date(dateString).getTime();
  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(dateString).toLocaleDateString();
}

const PROVIDER_STYLES: Record<string, { bg: string; dot: string }> = {
  openai: { bg: "bg-emerald-500/10 text-emerald-500", dot: "bg-emerald-500" },
  anthropic: { bg: "bg-violet-500/10 text-violet-500", dot: "bg-violet-500" },
  groq: { bg: "bg-orange-500/10 text-orange-500", dot: "bg-orange-500" },
  nvidia: { bg: "bg-blue-500/10 text-blue-500", dot: "bg-blue-500" },
  ollama: { bg: "bg-neutral-500/10 text-neutral-400", dot: "bg-neutral-400" },
  custom: { bg: "bg-cyan-500/10 text-cyan-500", dot: "bg-cyan-500" },
  "cli-login": { bg: "bg-rose-500/10 text-rose-500", dot: "bg-rose-500" },
};

export default function SessionCard({
  id,
  title,
  provider,
  model,
  tokenCount,
  workspace,
  createdAt,
  index = 0,
}: SessionCardProps) {
  const style = PROVIDER_STYLES[provider.toLowerCase()] ?? {
    bg: "bg-violet-500/10 text-violet-500",
    dot: "bg-violet-500",
  };

  const card = (
    <div className="p-4 pl-[17px]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-medium text-foreground group-hover:text-violet-500/90 transition-colors duration-200">
            {title}
          </h3>

          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium",
                style.bg,
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
              <Cpu className="h-2.5 w-2.5" />
              {provider}/{model}
            </span>

            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/60">
              <Zap className="h-2.5 w-2.5" />
              {tokenCount.toLocaleString()} tokens
            </span>

            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/60">
              <Clock className="h-2.5 w-2.5" />
              {timeAgo(createdAt)}
            </span>
          </div>

          {workspace && (
            <div className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground/40">
              <Terminal className="h-2.5 w-2.5 shrink-0" />
              <span className="truncate">{workspace}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: 0.7 + index * 0.06,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-violet-500/20 hover:shadow-[0_0_24px_-8px_rgba(139,92,246,0.15)]"
    >
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-0.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          style.dot,
        )}
      />
      {id ? (
        <Link href={`/dashboard/sessions/${id}`} className="block cursor-pointer">
          {card}
        </Link>
      ) : (
        card
      )}
    </motion.div>
  );
}
