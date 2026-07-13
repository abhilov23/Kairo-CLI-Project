"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkle } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const WORKFLOWS = [
  {
    title: "Code Review",
    beforeSteps: [
      "Copy code",
      "Open ChatGPT",
      "Paste & wait",
      "Copy back",
      "Apply manually",
    ],
    command: "kairo review .",
    output: [
      "Analyzing staged changes...",
      "Found 3 issues:",
      "  → Unhandled token refresh  [high]",
      "  → Weak password validation  [med]",
      "  → Missing rate limiting    [low]",
      "Run: kairo fix to apply",
    ],
  },
  {
    title: "Debugging",
    beforeSteps: [
      "Copy error message",
      "Search Stack Overflow",
      "Try random fixes",
      "Repeat",
      "Lose context",
    ],
    command: "kairo explain",
    output: [
      "TypeError: Cannot read properties",
      "of undefined (reading 'map')",
      "",
      "Root cause:",
      "  API response is empty.",
      "Fix: data ?? []",
    ],
  },
  {
    title: "Architecture",
    beforeSteps: [
      "Whiteboard ideas",
      "Write RFC docs",
      "PR comments",
      "Lose context",
      "Start over",
    ],
    command: "kairo chat",
    output: [
      "╭─ Continuing previous session...",
      "│  Last topic: Refactoring auth",
      "│  You asked about token management",
      "╰─ Ready for follow-up",
      "",
      "  7 prior messages in context",
    ],
  },
  {
    title: "Git Workflows",
    beforeSteps: [
      "Read git log",
      "Write commit message",
      "Push",
      "Check CI",
      "Fix, repeat",
    ],
    command: "kairo review .",
    output: [
      "Reviewing staged changes...",
      "+45 / -12 lines across 2 files",
      "",
      "Suggested commit message:",
      "  feat: add error boundary",
      "  to UserProfile component",
      "Run: kairo commit",
    ],
  },
];

export default function WorkflowDemo() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-neutral-50 dark:bg-[#080808]">
      {/* Dot grid background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-dot-grid opacity-[0.03] dark:opacity-[0.04]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
            Less switching.
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-violet-200 bg-clip-text text-transparent">
              More shipping.
            </span>
          </h2>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-neutral-500 dark:text-neutral-400">
            Stop copying code between tools. Kairo brings AI to your terminal,
            so you never leave the command line.
          </p>
        </motion.div>

        {/* Workflow cards */}
        <div className="space-y-8">
          {WORKFLOWS.map((workflow, index) => (
            <motion.div
              key={workflow.title}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.5,
                delay: prefersReducedMotion ? 0 : index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-col lg:flex-row gap-5 items-stretch"
            >
              {/* Left side — Before (40%) */}
              <div className="lg:w-[40%] flex flex-col justify-center rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0d1117] p-6 sm:p-8">
                {/* Label */}
                <div className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 w-fit mb-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-red-400">
                    Without Kairo
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white mb-4">
                  {workflow.title}
                </h3>

                {/* Steps flow */}
                <div className="space-y-2">
                  {workflow.beforeSteps.map((step, si) => (
                    <div key={si} className="flex items-center gap-3">
                      <span className="text-red-400/50 text-xs font-mono shrink-0">
                        {si > 0 ? "→" : " "}
                      </span>
                      <span className="text-sm text-neutral-400 dark:text-neutral-500">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow connector (desktop) */}
              <div className="hidden lg:flex items-center justify-center lg:w-[5%]">
                <ArrowRight className="h-5 w-5 text-neutral-300 dark:text-neutral-600" />
              </div>

              {/* Right side — After (60%) */}
              <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, x: 40 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.6,
                  delay: prefersReducedMotion ? 0 : 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="lg:w-[55%]"
              >
                <div className="relative h-full rounded-2xl">
                  {/* Violet radial glow behind card */}
                  <div className="absolute -inset-4 bg-violet-500/[0.03] dark:bg-violet-500/5 rounded-3xl blur-2xl pointer-events-none" />

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

                  <div className="relative rounded-2xl border-x border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0d1117] border-t-2 border-t-violet-500 p-6 sm:p-8">
                    {/* Label */}
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 w-fit mb-4">
                      <Sparkle className="h-3 w-3 text-green-400" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-green-400">
                        With Kairo
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white mb-4">
                      {workflow.title}
                    </h3>

                    {/* Terminal */}
                    <div className="rounded-xl border border-white/5 bg-[#0d1117] overflow-hidden">
                      <div className="flex items-center gap-1.5 border-b border-white/5 bg-[#161b22] px-3 py-1.5">
                        <div className="h-2 w-2 rounded-full bg-red-500/60" />
                        <div className="h-2 w-2 rounded-full bg-yellow-500/60" />
                        <div className="h-2 w-2 rounded-full bg-emerald-500/60" />
                        <span className="ml-2 text-[10px] text-neutral-600 font-mono">kairo</span>
                      </div>
                      <div className="p-4 font-mono text-sm leading-relaxed">
                        <div className="text-emerald-400/80 mb-1">
                          <span className="text-neutral-500">$ </span>
                          {workflow.command}
                        </div>
                        {workflow.output.map((line, li) => (
                          <div
                            key={li}
                            className={
                              line.startsWith("→")
                                ? "text-violet-400/70"
                                : line.startsWith("Run:")
                                ? "text-emerald-400/60"
                                : line.startsWith("│") || line.startsWith("╰") || line.startsWith("╭")
                                ? "text-neutral-300"
                                : "text-neutral-400"
                            }
                          >
                            {line || "\u00A0"}
                          </div>
                        ))}
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse" }}
                          className="inline-block h-4 w-2 bg-emerald-400/70 mt-0.5"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
