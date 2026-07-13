"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";
import TerminalWindow from "@/components/terminal-window";
import InstallCommand from "@/components/install-command";
import { Spotlight } from "@/components/ui/spotlight";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const HERO_LINES = [
  { type: "command" as const, text: "kairo review src/auth.ts", delay: 300 },
  { type: "system" as const, text: "Analyzing src/auth.ts...", delay: 400 },
  { type: "system" as const, text: "", delay: 100 },
  { type: "system" as const, text: "Found 3 issues:", delay: 300 },
  { type: "system" as const, text: "  1. Unhandled token refresh  [high]", delay: 200 },
  { type: "system" as const, text: "  2. Weak password validation  [med]", delay: 200 },
  { type: "system" as const, text: "  3. Missing rate limiting    [low]", delay: 200 },
  { type: "system" as const, text: "", delay: 100 },
  { type: "system" as const, text: "Run kairo fix to apply changes", delay: 400 },
];

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = prefersReducedMotion
    ? undefined
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
          },
        },
      };

  const itemVariants = prefersReducedMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6 },
        },
      };

  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      {/* Aceternity Spotlight */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#7c3aed" />

      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-[0.03] dark:opacity-[0.04]" />
        <div className="absolute top-[-15%] left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-violet-500/5 to-transparent blur-3xl dark:from-violet-500/8" />
        <div className="absolute bottom-0 left-1/4 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-t from-violet-500/3 to-transparent blur-3xl dark:from-violet-500/5" />
      </div>

      {/* Aceternity BackgroundBeams */}
      <div className="absolute inset-0 opacity-30 dark:opacity-40">
        <BackgroundBeams />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial={prefersReducedMotion ? undefined : "hidden"}
          animate={prefersReducedMotion ? undefined : "visible"}
          className="flex flex-col items-center text-center"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3.5 py-1"
          >
            <Sparkle className="h-3 w-3 text-violet-500" />
            <span className="text-xs font-medium text-muted-foreground">
              AI teammate for your terminal
            </span>
          </motion.div>

          {/* Headline */}
          <TypewriterEffect
            words={[
              { text: "Stop", className: "text-foreground" },
              { text: "switching", className: "text-foreground" },
              { text: "tabs.", className: "text-foreground" },
              { text: "Start", className: "text-foreground" },
              { text: "shipping.", className: "text-gradient-accent" },
            ]}
            className="max-w-5xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] tracking-tight"
            cursorClassName="bg-violet-400"
          />

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Kairo brings AI-powered code review, debugging, and architecture
            directly to your terminal. No new tools. No context switching.
            Just you and your AI teammate.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
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
              <a href="https://github.com/abhilov23/KairoCLI" target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
            </Button>
          </motion.div>

          {/* Install Command */}
          <motion.div
            variants={itemVariants}
            className="mt-6 w-full max-w-sm"
          >
            <InstallCommand />
          </motion.div>

          {/* Terminal Demo */}
          <motion.div
            variants={itemVariants}
            className="mt-16 w-full max-w-3xl"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-t from-violet-500/5 to-transparent opacity-50 blur-xl" />
              <div className="relative">
                <TerminalWindow title="kairo — demo" lines={HERO_LINES} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
