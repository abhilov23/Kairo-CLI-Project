"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Image from "next/image";

const TERMINAL_LINES = [
  { text: "$ kairo chat", type: "prompt" },
  { text: "╭─ Welcome back, alex", type: "response" },
  { text: "│", type: "response" },
  { text: "│  Resume where you left off?", type: "response" },
  { text: "│  • Reviewing src/api/auth.ts", type: "response" },
  { text: "│  • Refactoring user service", type: "response" },
  { text: "╰─ Type a message to continue", type: "response" },
];

const FEATURES = [
  "Persistent session memory across devices",
  "Multi-provider AI access (OpenAI, Anthropic, etc.)",
  "Open-source & MIT licensed",
];

export default function AuthBrandPanel() {
  const [visibleLines, setVisibleLines] = useState(1);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev < TERMINAL_LINES.length) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 180);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between overflow-hidden bg-[#0a0a0a] p-10 xl:p-14">
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-[0.03]" />
      <div className="absolute inset-0 bg-noise" />

      {/* Spotlights */}
      <div className="absolute top-[-25%] left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl" />
      <div className="absolute bottom-[-15%] right-[-10%] h-[450px] w-[450px] rounded-full bg-gradient-to-b from-cyan-500/5 to-transparent blur-3xl" />

      {/* Glow line at panel edge */}
      <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-cyan-500/15 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <div className="absolute -inset-1 rounded-xl bg-white/5 blur-sm" />
            <Image
              src="/logo.png"
              alt="Kairo"
              width={36}
              height={36}
              className="relative rounded-lg"
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white/90">
            Kairo
          </span>
        </motion.div>

        {/* Terminal showcase */}
        <div className="flex-1 flex items-center justify-center -my-10">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.25, 0.25, 0, 1] }}
            className="w-full max-w-lg"
          >
            {/* Terminal window */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden shadow-2xl shadow-black/20 backdrop-blur-sm">
              {/* Window header */}
              <div className="flex items-center gap-1.5 border-b border-white/[0.04] px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/50" />
                </div>
                <span className="ml-auto text-[10px] text-white/15 font-mono tracking-wider uppercase select-none">
                  kairo — terminal
                </span>
              </div>

              {/* Terminal output */}
              <div className="p-5 xl:p-6 font-mono text-sm leading-relaxed space-y-1 min-h-[240px]">
                {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    className={
                      line.type === "prompt"
                        ? "text-white/90"
                        : "text-emerald-400/60"
                    }
                  >
                    {line.text}
                  </motion.div>
                ))}
                {visibleLines >= TERMINAL_LINES.length && (
                  <span
                    className={`inline-block h-4 w-[7px] bg-emerald-400/70 ml-0.5 align-middle transition-opacity duration-100 ${
                      showCursor ? "opacity-100" : "opacity-0"
                    }`}
                  />
                )}
              </div>
            </div>

            {/* Feature highlights */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mt-10 space-y-3"
            >
              {FEATURES.map((feature) => (
                <motion.div
                  key={feature}
                  variants={itemVariants}
                  className="flex items-center gap-3 text-sm text-white/35"
                >
                  <span className="flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/10 shrink-0">
                    <Check className="h-3 w-3 text-emerald-400/70" />
                  </span>
                  <span>{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-xs text-white/15 font-mono"
        >
          codebuff — cli · {new Date().getFullYear()}
        </motion.p>
      </div>
    </div>
  );
}
