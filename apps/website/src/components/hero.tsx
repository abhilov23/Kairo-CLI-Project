"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";
import InstallCommand from "@/components/install-command";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface Line {
  text: string;
  color?: string;
  prompt?: boolean;
  delay?: number;
}

const CLI_BANNER = [
  { text: "╭──────────────────────────────────────────────╮", color: "cyan" },
  { text: "│                                              │", color: "cyan" },
  { text: "│           KairoCLI — gpt-4o                  │", color: "cyan", delay: 200 },
  { text: "│                                              │", color: "cyan" },
  { text: "╰──────────────────────────────────────────────╯", color: "cyan" },
];

const FEATURES: { cmd: string; lines: Line[] }[] = [
  {
    cmd: "kairo",
    lines: [
      { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", color: "dim" },
      { text: "  Type /help for commands. Type exit to quit.", color: "green" },
      { text: "", delay: 200 },
      { text: " ❯ ~/project ", color: "cyan", prompt: true },
      { text: "explain the auth middleware", color: "white" },
      { text: "", delay: 300 },
      { text: " ┃ Kairo", color: "blue" },
      { text: " ────────────────────────────────────────────────", color: "blue_dim" },
      { text: " The auth middleware validates JWT tokens from the", color: "white" },
      { text: " Authorization header. It checks:", color: "white" },
      { text: "  • Token expiry", color: "white" },
      { text: "  • Signature validity", color: "white" },
      { text: "  • User existence in DB", color: "white" },
      { text: "", delay: 200 },
      { text: " Want me to review the implementation?", color: "white" },
      { text: "", delay: 400 },
      { text: " ❯ ~/project ", color: "cyan", prompt: true },
    ],
  },
  {
    cmd: 'kairo --task "review src/auth.ts"',
    lines: [
      { text: "Analyzing src/auth.ts...", color: "yellow" },
      { text: "", delay: 400 },
      { text: "Found 3 issues:", color: "white" },
      { text: "", delay: 100 },
      { text: "  1. Unhandled token refresh     [high]", color: "red" },
      { text: "  2. Weak password validation    [med]", color: "yellow" },
      { text: "  3. Missing rate limiting       [low]", color: "dim" },
      { text: "", delay: 200 },
      { text: "  ┃ Kairo", color: "blue" },
      { text: "  ────────────────────────────────────────────────", color: "blue_dim" },
      { text: "  The high-severity issue is critical:", color: "white" },
      { text: "  Token refresh isn't handled, causing silent", color: "white" },
      { text: "  401 errors after expiry.", color: "white" },
      { text: "", delay: 200 },
      { text: "  \u2713 Review complete.", color: "green" },
      { text: "", delay: 300 },
      { text: " ❯ ~/project ", color: "cyan", prompt: true },
    ],
  },
  {
    cmd: "kairo --task \"deploy api\"",
    lines: [
      { text: "Planning deployment for API service...", color: "yellow" },
      { text: "", delay: 300 },
      { text: " Steps:", color: "white" },
      { text: "  1. Build Docker image", color: "white" },
      { text: "  2. Run database migrations", color: "white" },
      { text: "  3. Deploy to production", color: "white" },
      { text: "", delay: 200 },
      { text: " ✓ Building Docker image...", color: "green" },
      { text: " ✓ Running migrations...", color: "green" },
      { text: " ✓ Deploying...", color: "green" },
      { text: "", delay: 300 },
      { text: " ┃ Kairo", color: "blue" },
      { text: " ────────────────────────────────────────────────", color: "blue_dim" },
      { text: " API v2.1.0 deployed successfully.", color: "white" },
      { text: " Endpoint: https://api.example.com", color: "white" },
      { text: " Took 47s", color: "dim" },
      { text: "", delay: 400 },
      { text: " ❯ ~/project ", color: "cyan", prompt: true },
    ],
  },
];

const COLORS: Record<string, string> = {
  cyan: "text-cyan-400",
  green: "text-emerald-400",
  blue: "text-blue-400",
  blue_dim: "text-blue-400/50",
  red: "text-red-400",
  yellow: "text-yellow-400",
  white: "text-gray-200",
  dim: "text-gray-500",
};

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const [featureIndex, setFeatureIndex] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [typedChars, setTypedChars] = useState<Record<number, number>>({});
  const [showCursor, setShowCursor] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(0);

  const feature = FEATURES[featureIndex];

  const runDemo = useCallback((index: number) => {
    setFeatureIndex(index);
    setVisibleLines(0);
    setTypedChars({});
    setShowCursor(true);
    setShowBanner(false);
    setBannerVisible(0);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timers: ReturnType<typeof setTimeout>[] = [];

    // Animate banner first
    for (let i = 0; i <= CLI_BANNER.length; i++) {
      timers.push(setTimeout(() => {
        if (!cancelled) setBannerVisible(i);
      }, i * 80 + 300));
    }

    timers.push(setTimeout(() => {
      if (!cancelled) setShowBanner(true);
    }, CLI_BANNER.length * 80 + 500));

    // Animate feature lines
    timers.push(setTimeout(() => {
      if (cancelled) return;
      let lineIdx = 0;

      const typeLine = () => {
        if (cancelled || lineIdx >= feature.lines.length) return;
        setVisibleLines(lineIdx + 1);
        setTypedChars((prev) => ({ ...prev, [lineIdx]: 0 }));

        const line = feature.lines[lineIdx];
        const speed = line.prompt ? 10 : 15;

        for (let i = 0; i <= line.text.length; i++) {
          const charIndex = i;
          timers.push(setTimeout(() => {
            if (!cancelled) {
              setTypedChars((prev) => ({ ...prev, [lineIdx]: charIndex }));
            }
          }, (charIndex + 1) * speed));
        }

        lineIdx++;
        const nextDelay = line.delay ?? 80;
        timers.push(setTimeout(typeLine, nextDelay + line.text.length * speed + 200));
      };

      timers.push(setTimeout(typeLine, 200));
    }, CLI_BANNER.length * 80 + 600));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [featureIndex, feature.lines]);

  // Auto-cycle through features
  useEffect(() => {
    if (!showBanner || prefersReducedMotion) return;
    const t = setTimeout(() => {
      setFeatureIndex((i) => (i + 1) % FEATURES.length);
    }, 8000);
    return () => clearTimeout(t);
  }, [showBanner, featureIndex, prefersReducedMotion]);

  // Blinking cursor
  useEffect(() => {
    const t = setInterval(() => setShowCursor((c) => !c), 530);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-[0.03] dark:opacity-[0.04]" />
        <div className="absolute top-[-15%] left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-cyan-500/5 to-transparent blur-3xl dark:from-cyan-500/8" />
        <div className="absolute bottom-0 left-1/4 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-t from-cyan-500/3 to-transparent blur-3xl dark:from-cyan-500/5" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Label */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3.5 py-1"
          >
            <Sparkle className="h-3 w-3 text-cyan-500" />
            <span className="text-xs font-medium text-muted-foreground">
              AI teammate for your terminal
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            <span className="text-foreground">Your terminal, </span>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              supercharged.
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Code review, debugging, deployment — all from your CLI.
            No tabs. No context switching. Just you and AI.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button
              asChild
              size="lg"
              className="h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90 px-6 text-sm font-medium shadow-sm"
            >
              <a href="#install">
                Get started
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="h-11 rounded-xl px-6 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <a href="https://github.com/abhilov23/Kairo-CLI-Project" target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
            </Button>
          </motion.div>

          {/* Install */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-5 w-full max-w-md"
          >
            <InstallCommand command="npm install -g @abhilov/kairo" />
          </motion.div>

          {/* Terminal Hero */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="relative mt-14 w-full max-w-3xl"
          >
            {/* Glow */}
            <div className="absolute -inset-6 rounded-3xl bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent opacity-60 blur-2xl" />

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
                  {feature.cmd} — kairo
                </span>
                <div className="ml-auto w-[56px]" />
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6 font-mono text-sm leading-relaxed min-h-[340px] text-left">
                {/* CLI Banner */}
                <AnimatePresence mode="wait">
                  <div key={`banner-${featureIndex}`}>
                    {CLI_BANNER.slice(0, bannerVisible).map((line, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`${COLORS[line.color ?? "white"]} whitespace-pre`}
                      >
                        {line.text}
                        {i === CLI_BANNER.length - 1 && showCursor && (
                          <span className="ml-0.5 inline-block h-4 w-2 bg-cyan-400/70 animate-pulse" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>

                {/* Feature lines */}
                {showBanner && feature.lines.map((line, idx) => (
                  <div key={idx} className={`${COLORS[line.color ?? "white"]} whitespace-pre min-h-[1.3em]`}>
                    {idx < visibleLines && (
                      <>
                        {line.prompt && (
                          <span className="text-cyan-400 select-none"> ❯ </span>
                        )}
                        {line.text.slice(0, typedChars[idx] ?? line.text.length)}
                        {idx === visibleLines - 1 && idx < feature.lines.length - 1 && (
                          <span className={`ml-0.5 inline-block h-4 w-2 ${showCursor ? "bg-cyan-400/70" : "bg-transparent"}`} />
                        )}
                      </>
                    )}
                  </div>
                ))}

                {/* End cursor */}
                {showBanner && visibleLines >= feature.lines.length && (
                  <span className={`ml-0.5 inline-block h-4 w-2 ${showCursor ? "bg-cyan-400/70" : "bg-transparent"}`} />
                )}
              </div>
            </div>

            {/* Feature tabs */}
            <div className="mt-4 flex gap-1.5 justify-center">
              {FEATURES.map((f, i) => (
                <button
                  key={i}
                  onClick={() => runDemo(i)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-mono transition-all ${
                    featureIndex === i
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                      : "text-gray-500 hover:text-gray-300 border border-transparent"
                  }`}
                >
                  {f.cmd}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
