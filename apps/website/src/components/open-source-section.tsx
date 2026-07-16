"use client";

import { motion } from "framer-motion";
import { GitFork, Terminal, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export default function OpenSourceSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative py-24 sm:py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-[0.02] dark:opacity-[0.03]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Built in the open.
              <br />
              <span className="text-gradient-accent">For the community.</span>
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground max-w-md">
              Kairo is MIT licensed and built entirely in public. Audit the code,
              contribute features, and help shape the roadmap. No corporate agenda — just great developer tools.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
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
                  View on GitHub
                </a>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="default"
                className="h-10 rounded-xl px-5 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <a
                  href="https://www.npmjs.com/package/@abhilov/kairo"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Terminal className="mr-1.5 h-4 w-4" />
                  npm Package
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Terminal visual */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Glow */}
            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-t from-cyan-500/5 to-transparent opacity-40 blur-xl" />
            <div className="relative overflow-hidden rounded-2xl border border-border bg-[#0d1117] shadow-sm">
              {/* Terminal header */}
              <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
                </div>
                <span className="ml-auto text-[10px] text-white/30 font-mono">
                  github.com/abhilov23/Kairo-CLI-Project
                </span>
                <div className="ml-auto w-[56px]" />
              </div>

              {/* Terminal content */}
              <div className="p-5 font-mono text-sm leading-relaxed text-white/80">
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-white/5">
                  <Star className="h-4 w-4 text-yellow-400/80" />
                  <span className="text-white/30 text-xs">Star us on GitHub</span>
                </div>
                <div>
                  <span className="text-white/30">$ </span>
                  <span className="text-white/90">git clone https://github.com/abhilov23/Kairo-CLI-Project</span>
                </div>
                <div className="text-emerald-400/60">Cloning into &apos;Kairo-CLI-Project&apos;...</div>
                <div className="text-emerald-400/60">Receiving objects: 100% (2.3 MB)</div>
                <div className="mt-3">
                  <span className="text-white/30">$ </span>
                  <span className="text-white/90">cd Kairo-CLI-Project</span>
                </div>
                <div>
                  <span className="text-white/30">$ </span>
                  <span className="text-white/90">npm install</span>
                </div>
                <div className="text-emerald-400/60">✓ Dependencies installed</div>
                <div className="mt-3 pt-3 border-t border-white/5">
                  <span className="text-white/30">$ </span>
                  <span className="text-emerald-400">kairo</span>
                </div>
                <div className="text-emerald-400/80 font-semibold">┃ Kairo — gpt-4o</div>
                <div className="text-white/50">────────────────────────────────────────────────</div>
                <div className="text-white/90">  Let&apos;s build something great.</div>
                <div className="inline-block h-3.5 w-2 animate-pulse bg-emerald-400/70 mt-1" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
