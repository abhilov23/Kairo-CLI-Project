"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, GitFork, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MovingBorderButton } from "@/components/ui/moving-border";
import { Vortex } from "@/components/ui/vortex";
import InstallCommand from "@/components/install-command";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export default function CTASection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="install" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Vortex Background */}
      <Vortex
        particleCount={400}
        rangeY={100}
        baseHue={180}
        baseSpeed={0.3}
        rangeSpeed={1.2}
        baseRadius={1}
        rangeRadius={2}
        backgroundColor="transparent"
        containerClassName="absolute inset-0"
        className="opacity-40 dark:opacity-60"
      />

      {/* Background grid overlay */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.02] dark:opacity-[0.03] z-[1]" />
      <div className="absolute top-1/2 left-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-cyan-500/5 to-transparent blur-3xl dark:from-cyan-500/8 z-[1]" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Your AI teammate is{" "}
            <span className="text-gradient-accent">one install away.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-muted-foreground">
            Install Kairo in one command. No account required. Works on macOS, Linux, and Windows.
          </p>

          <div className="mt-8 mx-auto max-w-md">
            <InstallCommand />
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <MovingBorderButton
              as="a"
              href="/signup"
              borderRadius="0.75rem"
              className="h-11 rounded-xl bg-foreground/[0.05] text-foreground text-sm font-medium px-6 backdrop-blur-xl border-0 hover:bg-foreground/10 transition-colors"
              containerClassName="!h-11 !w-auto"
              borderClassName="bg-[radial-gradient(#06b6d4_40%,transparent_60%)]"
            >
              <span className="inline-flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                Get started
                <ArrowRight className="h-4 w-4" />
              </span>
            </MovingBorderButton>
            <Button
              asChild
              variant="ghost"
              size="default"
              className="h-11 rounded-xl px-6 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <a
                href="https://github.com/abhilov23/Kairo-CLI-Project"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitFork className="mr-1.5 h-4 w-4" />
                View on GitHub
              </a>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="default"
              className="h-11 rounded-xl px-6 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <a href="/docs">
                <BookOpen className="mr-1.5 h-4 w-4" />
                Read the docs
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
