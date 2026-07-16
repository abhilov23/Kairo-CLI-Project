"use client";

import { motion } from "framer-motion";
import { LampContainer } from "@/components/ui/lamp";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const ROADMAP_ITEMS = [
  {
    title: "MCP Integrations",
    description: "Connect Kairo to any MCP server. Tools, databases, APIs.",
    command: "kairo mcp connect postgres",
    output: [
      "✓ MCP server connected: postgres@local",
      "  Available tools: query, schema, explain",
      "",
      "  → Run: kairo db \"show me tables\"",
    ],
    spanFull: false,
  },
  {
    title: "GitHub Integration",
    description: "PR review, issue triage, CI analysis from your terminal.",
    command: "kairo gh pr review #142",
    output: [
      "Analyzing PR #142 (3 commits, +89/-12)...",
      "",
      "  Issues found: 2",
      "  → Missing input validation in auth.ts",
      "  → Unused import in utils.ts",
      "",
      "  \u2713 Resolved with suggested fixes",
    ],
    spanFull: false,
  },
  {
    title: "PostgreSQL Agent",
    description: "Query your database in plain English.",
    command: 'kairo db "show me users who signed up this week"',
    output: [
      "Generated SQL:",
      "",
      "  SELECT name, email, created_at",
      "  FROM users",
      "  WHERE created_at > now() - interval '7 days'",
      "  ORDER BY created_at DESC",
      "",
      "  Result: 247 users",
    ],
    spanFull: true,
  },
  {
    title: "Multi-Agent Workflows",
    description: "Spawn parallel agents for complex tasks.",
    command: "",
    output: [
      "┌─ kairo/plan ──────────────────",
      "│  Analyzing auth module...",
      "│  Found 4 improvement areas",
      "└───────────────────────────────",
      "",
      "┌─ kairo/test ──────────────────",
      "│  Generating test suite...",
      "│  12 tests written",
      "└───────────────────────────────",
    ],
    spanFull: false,
  },
  {
    title: "Autonomous Tasks",
    description: "Set a goal. Kairo executes it.",
    command: 'kairo run "refactor auth module"',
    output: [
      "╭─ Autonomous execution ────────",
      "│  Goal: Refactor auth module",
      "│  Status: In progress",
      "│",
      "│  ✓ Analyzed current structure",
      "│  ✓ Created new service layer",
      "│  ✓ Migrated JWT logic",
      "│  → Running tests...",
      "╰───────────────────────────────",
    ],
    spanFull: true,
  },
];

export default function FutureVision() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-neutral-50 dark:bg-[#080808]">
      {/* Background — violet radial glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-dot-grid opacity-[0.03] dark:opacity-[0.04]" />
        <div className="absolute top-1/4 left-1/2 h-[700px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-b from-cyan-500/[0.04] to-transparent blur-3xl dark:from-cyan-500/5" />
      </div>

      {/* Lamp header */}
      <div className="[--background:#fafafa] dark:[--background:#080808]">
      <LampContainer className="!min-h-[500px] !bg-transparent">
        <motion.div
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="flex flex-col items-center pt-12 sm:pt-16"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/10 bg-cyan-500/5 px-3 py-1 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-xs font-medium text-cyan-500">Coming soon</span>
          </div>
          <div className="flex justify-center w-full max-w-4xl">
            <TypewriterEffect
              words={[
                { text: "The", className: "text-neutral-900 dark:text-white" },
                { text: "future", className: "text-neutral-900 dark:text-white" },
                { text: "of", className: "text-neutral-900 dark:text-white" },
                { text: "terminal", className: "bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent dark:text-transparent" },
                { text: "AI.", className: "bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent dark:text-transparent" },
              ]}
              className="text-3xl sm:text-4xl font-bold tracking-tight text-center"
              cursorClassName="bg-cyan-400"
            />
          </div>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-neutral-500 dark:text-neutral-400 text-center">
            Kairo is evolving. Here&apos;s what&apos;s on the roadmap — capabilities that will
            make your terminal the most powerful tool on your machine.
          </p>
        </motion.div>
      </LampContainer>
      </div>

      {/* Roadmap grid */}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 -mt-40 z-10">
        <div className="grid gap-5 sm:grid-cols-2">
          {ROADMAP_ITEMS.map((item, index) => (
            <motion.div
              key={item.title}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.5,
                delay: prefersReducedMotion ? 0 : index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={item.spanFull ? "sm:col-span-2 lg:col-span-2" : ""}
            >
              <div className="relative h-full rounded-2xl">
                <GlowingEffect
                  blur={0}
                  borderWidth={1}
                  spread={30}
                  inactiveZone={0.7}
                  proximity={50}
                  glow={false}
                  disabled={false}
                  className="rounded-2xl"
                />
                <div className="relative h-full p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0d1117] transition-all duration-300">
                  {/* Title & description */}
                  <h3 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {item.description}
                  </p>

                  {/* Terminal preview */}
                  <div className="mt-5 rounded-xl border border-white/5 bg-[#0d1117] overflow-hidden">
                    <div className="flex items-center gap-1 border-b border-white/5 bg-[#161b22] px-3 py-1.5">
                      <div className="h-2 w-2 rounded-full bg-red-500/60" />
                      <div className="h-2 w-2 rounded-full bg-yellow-500/60" />
                      <div className="h-2 w-2 rounded-full bg-emerald-500/60" />
                      <span className="ml-2 text-[10px] text-neutral-600 font-mono">
                        {item.command ? item.command.split(" ")[0] : "kairo"} — roadmap
                      </span>
                    </div>
                    <div className="p-4 font-mono text-xs leading-relaxed">
                      {item.command && (
                        <div className="text-emerald-400/80 mb-1">
                          <span className="text-neutral-500">$ </span>
                          {item.command}
                        </div>
                      )}
                      {item.output.map((line, li) => (
                        <div
                          key={li}
                          className={
                            line.startsWith("→")
                              ? "text-cyan-400/70"
                              : line.startsWith("✓") || line.startsWith("Result")
                              ? "text-emerald-400/60"
                              : line.startsWith("│") || line.startsWith("╰") || line.startsWith("╭")
                              ? "text-neutral-300"
                              : "text-neutral-500"
                          }
                        >
                          {line || "\u00A0"}
                        </div>
                      ))}
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse" }}
                        className="inline-block h-3 w-1.5 bg-emerald-400/70 mt-0.5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
