"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const TREE_LINES = [
  { indent: 0, text: "Kairo Architecture", type: "title" as const },
  { indent: 0, text: "├── core/", type: "folder" as const },
  { indent: 1, text: "├── session-manager", type: "file" as const, desc: "persistent context" },
  { indent: 1, text: "├── context-engine", type: "file" as const, desc: "codebase awareness" },
  { indent: 1, text: "└── command-router", type: "file" as const, desc: "plugin dispatch" },
  { indent: 0, text: "├── providers/", type: "folder" as const },
  { indent: 1, text: "├── openai       [gpt-4o]", type: "file" as const },
  { indent: 1, text: "├── anthropic    [claude]", type: "file" as const },
  { indent: 1, text: "├── google       [gemini]", type: "file" as const },
  { indent: 1, text: "└── local        [ollama]", type: "file" as const },
  { indent: 0, text: "├── integrations/", type: "folder" as const },
  { indent: 1, text: "├── git          [vcs]", type: "file" as const },
  { indent: 1, text: "├── github       [prs, issues]", type: "file" as const },
  { indent: 1, text: "├── postgresql   [queries]", type: "file" as const },
  { indent: 1, text: "└── mcp          [protocol]", type: "file" as const, badge: "soon" as const },
  { indent: 0, text: "└── tools/", type: "folder" as const },
  { indent: 1, text: "  ├── review     [audit]", type: "file" as const },
  { indent: 1, text: "  ├── explain    [debug]", type: "file" as const },
  { indent: 1, text: "  ├── fix        [auto]", type: "file" as const },
  { indent: 1, text: "  └── chat       [interactive]", type: "file" as const },
];

const FEATURES = [
  {
    label: "AI Providers",
    count: "4+",
    description: "OpenAI, Anthropic, Google, local models",
  },
  {
    label: "Integrations",
    count: "12+",
    description: "Git, GitHub, PostgreSQL, MCP, APIs",
  },
  {
    label: "Commands",
    count: "8+",
    description: "Review, explain, fix, chat, config, agents",
  },
  {
    label: "Open Source",
    count: "MIT",
    description: "Fully auditable, community-driven",
  },
];

export default function ArchitectureDiagram() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-noise" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-[0.02] dark:opacity-[0.03]" />
        <div className="absolute top-1/2 right-0 h-[400px] w-[500px] -translate-y-1/2 rounded-full bg-gradient-to-l from-violet-500/5 to-transparent blur-3xl dark:from-violet-500/8" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 sm:mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Designed for extensibility.
          </h2>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">
            Kairo&apos;s modular architecture means it grows with you. Add providers, connect
            integrations, and extend with custom tools.
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-5 lg:gap-16 items-start">
          {/* Terminal tree */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3 relative"
          >
            {/* Glow behind terminal */}
            <div className="absolute -inset-6 rounded-3xl bg-gradient-to-b from-violet-500/5 via-transparent to-transparent opacity-60 blur-2xl" />

            {/* Terminal */}
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-[#0d1117] shadow-2xl">
              {/* Header */}
              <div className="flex items-center gap-2 border-b border-white/5 bg-[#161b22] px-5 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/70" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/70" />
                </div>
                <span className="ml-auto text-xs text-white/40 font-mono">
                  tree kairo/ — architecture
                </span>
                <div className="ml-auto w-[56px]" />
              </div>

              {/* Tree content */}
              <div className="p-5 sm:p-7 font-mono text-sm leading-relaxed">
                {TREE_LINES.map((line, i) => (
                  <div
                    key={i}
                    className={`${
                      line.type === "title"
                        ? "text-white/90 font-semibold text-base mb-1.5"
                        : line.type === "folder"
                        ? "text-white/70"
                        : "text-white/50"
                    }`}
                  >
                    {"  ".repeat(line.indent)}
                    {line.text}
                    {line.type === "file" && line.desc && (
                      <span className="text-white/25 ml-2"># {line.desc}</span>
                    )}
                    {line.type === "file" && line.badge === "soon" && (
                      <span className="ml-2 inline-flex items-center rounded-full border border-violet-500/20 bg-violet-500/10 px-1.5 py-0.5 text-[10px] font-medium text-violet-400 uppercase tracking-wider">
                        Soon
                      </span>
                    )}
                  </div>
                ))}

                {/* Blinking cursor */}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse" }}
                  className="inline-block h-4 w-2 bg-emerald-400/70 mt-1"
                />
              </div>
            </div>
          </motion.div>

          {/* Stats grid */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-3">
            {FEATURES.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.1 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-muted-foreground/20"
              >
                <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {stat.count}
                </div>
                <div className="mt-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground/70">
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
