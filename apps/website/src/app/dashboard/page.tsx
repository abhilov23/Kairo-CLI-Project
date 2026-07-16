import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SessionCard from "@/components/dashboard/session-card";
import { AnimatedCounter } from "@/components/dashboard/animated-counter";
import { FadeIn } from "@/components/dashboard/fade-in";
import {
  Activity,
  Zap,
  ShieldCheck,
  Terminal,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard — Kairo",
  description: "Your Kairo session history and activity overview.",
};

const statCards = [
  {
    label: "Total Sessions",
    icon: Activity,
    gradient: "from-violet-500/20 via-violet-500/5 to-transparent",
    borderGlow: "group-hover:border-violet-500/30",
    iconBg: "bg-violet-500/10 text-violet-500",
  },
  {
    label: "Tokens Used",
    icon: Zap,
    gradient: "from-amber-500/20 via-amber-500/5 to-transparent",
    borderGlow: "group-hover:border-amber-500/30",
    iconBg: "bg-amber-500/10 text-amber-500",
  },
  {
    label: "Account Status",
    icon: ShieldCheck,
    gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    borderGlow: "group-hover:border-emerald-500/30",
    iconBg: "bg-emerald-500/10 text-emerald-500",
  },
];

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  const recentSessions = await prisma.kairoSession.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const totalSessions = await prisma.kairoSession.count({
    where: { userId },
  });
  const totalTokens = await prisma.kairoSession.aggregate({
    where: { userId },
    _sum: { tokenCount: true },
  });

  const rawTokens = totalTokens._sum.tokenCount ?? 0;
  const statColors = [
    "text-violet-500",
    "text-amber-500",
    "text-emerald-500",
  ];

  return (
    <div className="space-y-8">
      {/* ── Header ────────────────────────────────────────── */}
      <FadeIn delay={0}>
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6">
          {/* Subtle radial glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="relative">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Your Kairo activity at a glance.
            </p>
          </div>
        </div>
      </FadeIn>

      {/* ── Stats Grid ────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-3">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-[0_0_32px_-12px_rgba(139,92,246,0.12)] ${card.borderGlow}`}
            >
              {/* Gradient overlay */}
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />

              {/* Content */}
              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
                    {card.label}
                  </p>
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.iconBg} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <p
                  className={`mt-3 text-2xl font-bold tracking-tight ${statColors[i]}`}
                >
                  {i === 0 ? (
                    <AnimatedCounter value={totalSessions} delay={0} />
                  ) : i === 1 ? (
                    <AnimatedCounter
                      value={rawTokens}
                      delay={150}
                    />
                  ) : (
                    <FadeIn delay={300}>Active</FadeIn>
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Recent Sessions ───────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-500/10">
              <Terminal className="h-3 w-3 text-violet-500" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">
              Recent Sessions
            </h2>
          </div>
          {totalSessions > 10 && (
            <a
              href="/dashboard/sessions"
              className="group inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-violet-500"
            >
              View all
              <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
          )}
        </div>

        {recentSessions.length === 0 ? (
          <div className="relative overflow-hidden rounded-xl border border-dashed border-border bg-card/30 p-12 text-center">
            {/* Decorative elements */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-violet-500/5 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-amber-500/5 blur-2xl" />

            <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-muted-foreground/20 bg-background/50">
              <Terminal className="h-7 w-7 text-muted-foreground/30" />
            </div>
            <p className="text-sm font-medium text-foreground">
              No sessions yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground/60 max-w-sm mx-auto">
              Start a Kairo session in your terminal to see your activity here.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-xs text-muted-foreground/60 font-mono">
              <span className="text-emerald-500/80">$</span>
              <span>kairo chat</span>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {recentSessions.map((s, i) => (
              <SessionCard
                key={s.id}
                id={s.id}
                title={s.title}
                provider={s.provider}
                model={s.model}
                tokenCount={s.tokenCount}
                workspace={s.workspace}
                createdAt={s.createdAt.toISOString()}
                index={i}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
