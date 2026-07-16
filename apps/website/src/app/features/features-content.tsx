"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import TerminalWindow from "@/components/terminal-window";

/* ───────────────────────────────────────────────
   Feature data — grouped into narrative arcs
   ─────────────────────────────────────────────── */

interface Feature {
  title: string;
  tagline: string;
  description: string;
  lines: { type: "command" | "output" | "system"; text: string; delay: number }[];
}

const CORE_FEATURES: Feature[] = [
  {
    title: "Terminal-Native",
    tagline: "Where you already work",
    description:
      "No new IDE, no web dashboard, no context switching. Kairo lives in your terminal and works alongside your existing tools and workflows — not instead of them.",
    lines: [
      { type: "command" as const, text: "kairo --task \"review src/auth.ts\"", delay: 200 },
      { type: "system" as const, text: "Analyzing src/auth.ts...", delay: 300 },
      { type: "system" as const, text: "Found 3 potential issues:", delay: 200 },
      { type: "system" as const, text: "  1. Unhandled token refresh", delay: 150 },
      { type: "system" as const, text: "  2. Missing rate limiting", delay: 150 },
      { type: "system" as const, text: "  3. Weak session validation", delay: 150 },
      { type: "output" as const, text: "  \u2713 Review complete", delay: 300 },
    ],
  },
  {
    title: "Session Awareness",
    tagline: "Context that persists",
    description:
      "Kairo remembers everything you've discussed. Pick up conversations where you left off, without repeating yourself or losing context between sessions.",
    lines: [
      { type: "command" as const, text: "kairo", delay: 200 },
      { type: "system" as const, text: "\u250C\u2500 Kairo Setup \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500", delay: 300 },
      { type: "system" as const, text: "\u2502  Continuing previous session", delay: 200 },
      { type: "system" as const, text: "\u2502  Last topic: Refactoring auth service", delay: 200 },
      { type: "system" as const, text: "\u2502  12 prior messages in context", delay: 200 },
      { type: "system" as const, text: "\u2514\u2500 Ready for follow-up questions", delay: 300 },
    ],
  },
  {
    title: "Streaming Responses",
    tagline: "No waiting around",
    description:
      "Results stream in as they're generated — token by token. You see the answer forming in real time, with zero-compromise latency.",
    lines: [
      { type: "command" as const, text: "kairo", delay: 200 },
      { type: "system" as const, text: "\u2502 Kairo \u2014 gpt-4o", delay: 300 },
      { type: "system" as const, text: "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500", delay: 100 },
      { type: "system" as const, text: "", delay: 100 },
      { type: "system" as const, text: "function useDebounce<T>(value: T, delay: number) {", delay: 150 },
      { type: "system" as const, text: "  const [debounced, setDebounced] = useState(value);", delay: 100 },
      { type: "system" as const, text: "", delay: 80 },
      { type: "system" as const, text: "  // ... streaming tokens ...", delay: 200 },
    ],
  },
];

const ECOSYSTEM_FEATURES: Feature[] = [
  {
    title: "Multi-Provider AI",
    tagline: "Choose your engine",
    description:
      "Bring your own API keys and pick from OpenAI, Anthropic, Groq, NVIDIA, or run local models with Ollama. No vendor lock-in.",
    lines: [
      { type: "command" as const, text: "kairo setup", delay: 200 },
      { type: "system" as const, text: "\u250C\u2500 Kairo Setup \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500", delay: 200 },
      { type: "system" as const, text: "\u2502  Select AI Provider:", delay: 200 },
      { type: "system" as const, text: "\u2502    1. OpenAI", delay: 150 },
      { type: "system" as const, text: "\u2502    2. Anthropic", delay: 150 },
      { type: "system" as const, text: "\u2514\u2500 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500", delay: 200 },
      { type: "system" as const, text: "\u2713 Provider set to: anthropic", delay: 300 },
    ],
  },
  {
    title: "Git Integration",
    tagline: "Version control superpowers",
    description:
      "Review diffs, generate commit messages, analyze PRs, and automate git workflows — all from a single terminal command.",
    lines: [
      { type: "command" as const, text: "kairo --task \"review the git diff\"", delay: 200 },
      { type: "system" as const, text: "\u2502 Kairo \u2014 gpt-4o", delay: 300 },
      { type: "system" as const, text: "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500", delay: 150 },
      { type: "system" as const, text: "2 files changed, +45/-12 lines", delay: 200 },
      { type: "system" as const, text: "", delay: 100 },
      { type: "system" as const, text: "Suggestions:", delay: 150 },
      { type: "system" as const, text: "  \u2022 Add error boundary to UserProfile", delay: 150 },
      { type: "system" as const, text: "  \u2022 Move API call to separate service", delay: 150 },
    ],
  },
  {
    title: "Extensible Architecture",
    tagline: "Built for customization",
    description:
      "Custom provider support lets you connect to any OpenAI-compatible API. Bring your own models, endpoints, and infrastructure.",
    lines: [
      { type: "command" as const, text: "kairo setup", delay: 200 },
      { type: "system" as const, text: "\u250C\u2500 Kairo Setup \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500", delay: 200 },
      { type: "system" as const, text: "\u2502  Select AI Provider:", delay: 200 },
      { type: "system" as const, text: "\u2502    6. Custom Endpoint", delay: 200 },
      { type: "system" as const, text: "\u2502", delay: 100 },
      { type: "system" as const, text: "\u2502  Enter base URL: https://api.example.com/v1", delay: 200 },
      { type: "system" as const, text: "\u2514\u2500 Custom provider configured", delay: 300 },
    ],
  },
];

const TRUST_FEATURES: Feature[] = [
  {
    title: "Privacy by Design",
    tagline: "Your code stays yours",
    description:
      "Local models via Ollama, no telemetry by default, and full control over your data. Kairo is built with privacy at its core — not as an afterthought.",
    lines: [
      { type: "command" as const, text: "kairo setup", delay: 200 },
      { type: "system" as const, text: "\u250C\u2500 Kairo Setup \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500", delay: 200 },
      { type: "system" as const, text: "\u2502    5. Ollama (Local)", delay: 200 },
      { type: "system" as const, text: "\u2502  All AI processing runs on your machine", delay: 200 },
      { type: "system" as const, text: "\u2514\u2500 No API key required", delay: 300 },
    ],
  },
  {
    title: "Open Source",
    tagline: "MIT licensed & transparent",
    description:
      "Fully open source. Audit the code, contribute features, and build on top of it. The community shapes the roadmap — not a product team.",
    lines: [
      { type: "command" as const, text: "npm install -g @abhilov/kairo", delay: 200 },
      { type: "system" as const, text: "+ @abhilov/kairo@latest", delay: 300 },
      { type: "system" as const, text: "✓ Installed successfully", delay: 150 },
      { type: "command" as const, text: "kairo --version", delay: 200 },
      { type: "output" as const, text: "v1.2.0", delay: 150 },
    ],
  },
];

/* ───────────────────────────────────────────────
   Shared animation config
   ─────────────────────────────────────────────── */

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

/* ───────────────────────────────────────────────
   Helpers
   ─────────────────────────────────────────────── */

function useSafeMotion() {
  const prefersReducedMotion = useReducedMotion();
  return {
    prefersReducedMotion,
    fadeUp: (delay = 0) => ({
      initial: prefersReducedMotion ? {} : { opacity: 0, y: 20 },
      whileInView: prefersReducedMotion ? {} : { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-60px" as const },
      transition: { duration: 0.5, delay: prefersReducedMotion ? 0 : delay, ease: easeOutExpo },
    }),
  };
}

function FeatureGroupLabel({ text, index }: { text: string; index: number }) {
  const { prefersReducedMotion, fadeUp } = useSafeMotion();
  return (
    <motion.div {...fadeUp(prefersReducedMotion ? 0 : 0.1 + index * 0.05)}>
      <div className="flex items-center gap-3 mb-8 sm:mb-10">
        <span className="h-px flex-1 bg-border" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/50 select-none">
          {text}
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>
    </motion.div>
  );
}

function FeatureCard({
  feature,
  index,
  sectionIndex,
}: {
  feature: Feature;
  index: number;
  sectionIndex: number;
}) {
  const { prefersReducedMotion, fadeUp } = useSafeMotion();
  const isReversed = index % 2 === 1;

  return (
    <motion.div
      {...fadeUp(prefersReducedMotion ? 0 : 0.1 + sectionIndex * 0.05 + index * 0.04)}
    >
      <div          className="grid gap-8 sm:gap-12 items-center sm:grid-cols-2"
      >
        {/* Content */}
        <div className={isReversed ? "sm:col-start-2" : ""}>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-0.5 text-[11px] font-medium text-muted-foreground/70">
            <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
            {feature.tagline}
          </div>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {feature.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {feature.description}
          </p>
        </div>

        {/* Terminal */}
        <div className={isReversed ? "sm:col-start-1" : ""}>
          <TerminalWindow
            title={`kairo — ${feature.title.toLowerCase()}`}
            lines={feature.lines}
            typingSpeed={15}
          />
        </div>
      </div>
    </motion.div>
  );
}

function FeatureSection({
  label,
  features,
  sectionIndex,
}: {
  label: string;
  features: Feature[];
  sectionIndex: number;
}) {
  return (
    <div className="mb-16 sm:mb-24 last:mb-0">
      <FeatureGroupLabel text={label} index={sectionIndex} />
      <div className="space-y-10 sm:space-y-16">
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.title}
            feature={feature}
            index={index}
            sectionIndex={sectionIndex}
          />
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────
   Main component
   ─────────────────────────────────────────────── */

export default function FeaturesContent() {
  const { fadeUp } = useSafeMotion();

  return (
    <div className="relative">
      {/* Persistent background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-noise opacity-[0.015]" />
        <div className="absolute inset-0 bg-grid opacity-[0.015] dark:opacity-[0.025]" />
      </div>

      {/* ── Page header ── */}
      <section className="relative pt-28 pb-12 sm:pt-36 sm:pb-16">
        <div className="pointer-events-none absolute top-[-10%] left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-b from-cyan-500/5 to-transparent blur-3xl dark:from-cyan-500/8" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)}>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Features
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Every feature is a command. No bloated UI, no context switching — just
              your terminal and AI.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Features sections ── */}
      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <FeatureSection label="Core Experience" features={CORE_FEATURES} sectionIndex={0} />
          <FeatureSection label="Ecosystem & Integrations" features={ECOSYSTEM_FEATURES} sectionIndex={1} />
          <FeatureSection label="Trust & Transparency" features={TRUST_FEATURES} sectionIndex={2} />
        </div>
      </section>
    </div>
  );
}
