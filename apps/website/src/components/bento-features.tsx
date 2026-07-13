"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import TerminalWindow from "@/components/terminal-window";
import { BentoGrid } from "@/components/ui/bento-grid";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const ITEMS = [
  {
    title: "Code review",
    subtitle: "Spot issues before they ship",
    description:
      "Kairo reviews your code for bugs, security vulnerabilities, and performance issues — all from a single command.",
    lines: [
      { type: "command" as const, text: "kairo review src/auth.ts", delay: 200 },
      { type: "system" as const, text: "Analyzing src/auth.ts...", delay: 400 },
      { type: "system" as const, text: "", delay: 100 },
      { type: "system" as const, text: "Found 3 issues:", delay: 300 },
      { type: "system" as const, text: "  1. Unhandled token refresh  [high]", delay: 200 },
      { type: "system" as const, text: "  2. Weak password validation  [med]", delay: 200 },
      { type: "system" as const, text: "  3. Missing rate limiting    [low]", delay: 200 },
      { type: "system" as const, text: "", delay: 100 },
      { type: "system" as const, text: "Run kairo fix to apply changes", delay: 300 },
    ],
    className: "md:col-span-2 md:row-span-1 lg:row-span-2",
  },
  {
    title: "Debugging",
    subtitle: "Errors explained instantly",
    description:
      "Paste an error and Kairo explains what went wrong — with context from your codebase.",
    lines: [
      { type: "command" as const, text: "kairo explain", delay: 200 },
      { type: "system" as const, text: "TypeError: Cannot read properties", delay: 300 },
      { type: "system" as const, text: "of undefined (reading 'map')", delay: 150 },
      { type: "system" as const, text: "", delay: 100 },
      { type: "system" as const, text: "The API response is empty.", delay: 300 },
      { type: "system" as const, text: "Add a fallback: data ?? []", delay: 250 },
    ],
    className: "",
  },
  {
    title: "Git automation",
    subtitle: "Smarter version control",
    description:
      "Generate commit messages, review diffs, and analyze branches without leaving the terminal.",
    lines: [
      { type: "command" as const, text: "kairo review .", delay: 200 },
      { type: "system" as const, text: "Reviewing staged changes...", delay: 300 },
      { type: "system" as const, text: "+45 / -12 lines across 2 files", delay: 300 },
      { type: "system" as const, text: "", delay: 100 },
      { type: "system" as const, text: "Suggested commit:", delay: 200 },
      { type: "system" as const, text: "  feat: add error boundary to", delay: 200 },
      { type: "system" as const, text: "  UserProfile component", delay: 200 },
    ],
    className: "",
  },
  {
    title: "Multiple providers",
    subtitle: "Bring your own AI",
    description:
      "Works with OpenAI, Anthropic, Google, and local models. You choose what powers your workflow.",
    lines: [
      { type: "command" as const, text: "kairo config set provider anthropic", delay: 200 },
      { type: "system" as const, text: "✓ Provider set to: anthropic", delay: 300 },
      { type: "command" as const, text: "kairo config set model claude-sonnet-4", delay: 200 },
      { type: "system" as const, text: "✓ Model set: claude-sonnet-4-20250514", delay: 300 },
    ],
    className: "",
  },
  {
    title: "Session memory",
    subtitle: "Context that persists",
    description:
      "Kairo remembers what you've discussed. Resume conversations, reference past work, never repeat yourself.",
    lines: [
      { type: "command" as const, text: "kairo chat", delay: 200 },
      { type: "system" as const, text: "╭─ Continuing previous session", delay: 300 },
      { type: "system" as const, text: "│  Last topic: Refactoring auth", delay: 200 },
      { type: "system" as const, text: "│  You asked about token management", delay: 200 },
      { type: "system" as const, text: "╰─ Ready for follow-up", delay: 300 },
    ],
    className: "",
  },
  {
    title: "Open source",
    subtitle: "MIT licensed & transparent",
    description:
      "Audit the code, contribute features, and build on top of Kairo. The community shapes the roadmap.",
    lines: [
      { type: "command" as const, text: "npm install -g @abhilov/kairo", delay: 200 },
      { type: "system" as const, text: "+ @abhilov/kairo@latest", delay: 300 },
      { type: "system" as const, text: "✓ Installed", delay: 200 },
      { type: "command" as const, text: "kairo --version", delay: 200 },
      { type: "output" as const, text: "v0.1.0", delay: 200 },
    ],
    className: "",
  },
];

export default function BentoFeatures() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="features" className="relative py-24 sm:py-32 bg-neutral-50 dark:bg-background transition-colors duration-300">
      {/* Background — dot grid + violet radial glow for light mode */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-dot-grid opacity-[0.03] dark:opacity-[0.02]" />
        <div className="absolute top-1/3 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-violet-500/[0.04] to-transparent blur-3xl dark:from-violet-500/[0.03]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-left"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            See it in action.
          </h2>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">
            Every feature is a command. No bloated UI, no context switching — just
            your terminal and AI.
          </p>
        </motion.div>

        {/* Bento grid with GlowingEffect */}
        <BentoGrid className="gap-4">
          {ITEMS.map((item, index) => (
            <motion.div
              key={item.title}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className={item.className}
            >
              <div className="relative h-full rounded-2xl">
                <GlowingEffect
                  blur={0}
                  borderWidth={1}
                  spread={30}
                  inactiveZone={0.7}
                  proximity={40}
                  glow={false}
                  disabled={false}
                  className="rounded-2xl"
                />
                <div
                  className={`relative h-full rounded-2xl border p-5 sm:p-6 transition-all duration-200 overflow-hidden
                    bg-white border-neutral-200 shadow-sm
                    hover:shadow-md hover:border-neutral-300
                    dark:bg-card dark:border-border dark:hover:border-muted-foreground/20 dark:hover:shadow-none`}
                >
                  {/* Content */}
                  <div className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    {item.subtitle}
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground mb-4">
                    {item.description}
                  </p>

                  {/* Terminal — always dark, no clipping */}
                  <div className="min-h-[200px] overflow-hidden">
                    <TerminalWindow
                      title={`kairo — ${item.title.toLowerCase()}`}
                      lines={item.lines}
                      typingSpeed={15}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </BentoGrid>

        {/* Bottom link */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 text-center"
        >
          <Button
            asChild
            variant="ghost"
            size="default"
            className="h-9 rounded-lg text-sm text-muted-foreground hover:text-foreground"
          >
            <a href="/features">
              Explore all features
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
