"use client";

import { motion } from "framer-motion";
import { ArrowRight, GitFork, Sparkle, Terminal, Shield, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const VALUES = [
  {
    title: "Terminal-First",
    description:
      "The terminal is the most powerful interface for developers. We build tools that live where you work, not tools that pull you away.",
    icon: Terminal,
  },
  {
    title: "Privacy by Design",
    description:
      "Your code belongs to you. Local processing, no telemetry by default, full transparency in everything we build.",
    icon: Shield,
  },
  {
    title: "Open by Default",
    description:
      "MIT licensed and built in public. We succeed when our users succeed — no corporate agenda, just great developer tools.",
    icon: GitFork,
  },
  {
    title: "Quality Over Hype",
    description:
      "Every feature passes a simple test: would we use it ourselves? No bloated features, no gimmicks, no shortcuts.",
    icon: Sparkle,
  },
];

const TIMELINE = [
  {
    year: "Q1 2025",
    title: "The idea",
    description:
      "The frustration of context-switching between terminal and AI chat inspired the first prototype. Built in a weekend, refined over months.",
  },
  {
    year: "Q2 2025",
    title: "Initial release",
    description:
      "First public release on npm with basic chat and OpenAI integration. Thousands of developers installed within the first week.",
  },
  {
    year: "Q3 2025",
    title: "Multi-provider support",
    description:
      "Added Anthropic, Google, and local model support. Introduced the plugin architecture that makes Kairo extensible.",
  },
  {
    year: "Q4 2025",
    title: "Git integration",
    description:
      "Launched git-aware features — automated code review, commit message generation, and branch analysis.",
  },
  {
    year: "2026 & beyond",
    title: "The road ahead",
    description:
      "Session memory, cloud sync, MCP integrations, and multi-agent workflows. The best is yet to come.",
  },
];

const STATS = [
  { label: "GitHub stars", value: "2.3k+" },
  { label: "Weekly downloads", value: "12k+" },
  { label: "AI providers", value: "4+" },
  { label: "MIT licensed", value: "100%" },
];

const TEAM = [
  {
    initials: "AL",
    name: "Abhilov L.",
    role: "Creator & lead developer",
  },
  {
    initials: "??",
    name: "You?",
    role: "Contributors welcome",
    open: true,
  },
];

export default function AboutContent() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative">
      {/* Background grid — persistent */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-grid opacity-[0.02] dark:opacity-[0.03]" />
      </div>

      {/* ── Section: Page Header ── */}
      <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-20">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              About
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              We&apos;re building the AI-powered terminal tool that developers deserve.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Section: Mission ── */}
      <section className="relative py-16 sm:py-24">
        {/* Glow */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-cyan-500/5 to-transparent blur-3xl dark:from-cyan-500/8" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-[1.1]">
              AI for the command line.
              <br />
              <span className="text-gradient-accent">Nothing less. Nothing more.</span>
            </h2>
            <div className="mx-auto mt-6 max-w-2xl space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              <p>
                We believe the terminal is the most underrated interface in
                modern development. While the world rushed to build AI chat
                interfaces and web dashboards, we asked a simpler question: why
                not bring AI directly to the command line?
              </p>
              <p>
                Kairo is our answer. No new IDE to learn, no browser tab to open,
                no context to switch. Just you, your terminal, and your AI
                teammate.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Section: Stats ── */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
            {STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: prefersReducedMotion ? 0 : index * 0.05 }}
                className="flex flex-col items-center justify-center bg-card px-6 py-8 text-center"
              >
                <span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {stat.value}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section: Values ── */}
      <section className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8">
              Our values
            </h3>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {VALUES.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                  whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="group rounded-2xl border border-border bg-card p-6 sm:p-7 transition-all duration-300 hover:border-muted-foreground/20 hover:shadow-sm"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background group-hover:border-cyan-500/20 group-hover:bg-cyan-500/5 transition-colors">
                    <Icon className="h-4 w-4 text-muted-foreground group-hover:text-cyan-500 transition-colors" />
                  </div>
                  <h4 className="mt-4 text-base font-semibold tracking-tight text-foreground">
                    {value.title}
                  </h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section: Timeline ── */}
      <section className="relative py-16 sm:py-24">
        {/* Glow */}
        <div className="pointer-events-none absolute top-1/2 right-0 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-gradient-to-b from-violet-500/5 to-transparent blur-3xl dark:from-violet-500/8" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8">
              Our story
            </h3>
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />

            <div className="space-y-10">
              {TIMELINE.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                  whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex gap-6 pl-10"
                >
                  {/* Dot */}
                  <div className="absolute left-0 top-1 flex h-[30px] w-[30px] items-center justify-center">
                    <div className="h-3 w-3 rounded-full border-2 border-violet-500/50 bg-background" />
                  </div>

                  <div className="flex-1">
                    <span className="inline-flex items-center rounded-full border border-violet-500/10 bg-violet-500/5 px-2.5 py-0.5 text-xs font-medium text-violet-600 dark:text-violet-400">
                      {item.year}
                    </span>
                    <h4 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground max-w-xl">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section: Team ── */}
      <section className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8">
              Team
            </h3>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {TEAM.map((member, index) => (
              <motion.div
                key={member.name}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className={`rounded-2xl border border-border bg-card p-6 transition-all duration-300 ${
                  member.open
                    ? "border-dashed border-violet-500/30 hover:border-violet-500/50 hover:bg-violet-500/[0.02]"
                    : "hover:border-muted-foreground/20"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold tracking-tight ${
                      member.open
                        ? "border border-dashed border-violet-500/40 bg-violet-500/5 text-violet-500"
                        : "bg-foreground text-background"
                    }`}
                  >
                    {member.initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {member.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section: Community ── */}
      <section className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="grid items-center gap-10 p-8 sm:p-10 lg:grid-cols-2">
              {/* Left — content */}
              <div>
                <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  Join the community
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Kairo is built by developers, for developers. Open source,
                  community-driven, and always looking for contributors.
                  Every pull request, issue, and discussion shapes the future.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    asChild
                    size="default"
                    className="h-10 rounded-xl bg-foreground text-background hover:bg-foreground/90 px-5 text-sm font-medium shadow-sm"
                  >
                    <a
                      href="https://github.com/abhilov23/Kairo-CLI-Project"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GitFork className="mr-1.5 h-4 w-4" />
                      Contribute on GitHub
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    size="default"
                    className="h-10 rounded-xl px-5 text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    <a href="/contact">
                      <MessageCircle className="mr-1.5 h-4 w-4" />
                      Get in touch
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Right — terminal visual */}
              <div className="overflow-hidden rounded-xl border border-border/50 bg-[#0a0a0a] shadow-sm">
                <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
                  </div>
                  <span className="ml-auto text-[10px] text-white/30 font-mono">
                    github.com/abhilov23/KairoCLI
                  </span>
                  <div className="ml-auto w-[56px]" />
                </div>
                <div className="p-4 font-mono text-xs leading-relaxed sm:text-sm">
                  <div>
                    <span className="text-white/30">$ </span>
                    <span className="text-white/90">gh pr review</span>
                  </div>
                  <div className="text-emerald-400/60 mt-1">
                    # Kairo CLI — PR #42
                  </div>
                  <div className="text-white/60 mt-1">
                    ╭─ <span className="text-emerald-400/80">alex</span> wants to merge 3 commits
                  </div>
                  <div className="text-white/60">
                    │
                  </div>
                  <div className="text-white/60">
                    │  feat: add session persistence
                  </div>
                  <div className="text-white/60">
                    │  fix: handle rate limiting
                  </div>
                  <div className="text-white/60">
                    │  chore: update dependencies
                  </div>
                  <div className="text-white/60">
                    ╰─ <span className="text-cyan-400/80">kairo --task</span> to check
                  </div>
                  <div className="inline-block h-3.5 w-2 animate-pulse bg-emerald-400/60 mt-2" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
