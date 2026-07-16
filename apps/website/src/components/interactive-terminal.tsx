"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface TerminalLine {
  type: "command" | "output" | "system";
  text: string;
  delay: number;
}

const DEMO_SESSIONS: Record<string, { command: string; lines: TerminalLine[] }> = {
  review: {
    command: "kairo --task \"review src/auth.ts\"",
    lines: [
      { type: "command" as const, text: "kairo --task \"review src/auth.ts\"", delay: 200 },
      { type: "system" as const, text: "┃ Kairo — gpt-4o", delay: 400 },
      { type: "system" as const, text: "────────────────────────────────────────────────", delay: 80 },
      { type: "system" as const, text: "Found 3 issues:", delay: 300 },
      { type: "system" as const, text: "  1. Unhandled token refresh  [high]", delay: 150 },
      { type: "system" as const, text: "  2. Weak password validation  [med]", delay: 150 },
      { type: "system" as const, text: "  3. Missing rate limiting    [low]", delay: 150 },
      { type: "system" as const, text: "", delay: 80 },
      { type: "system" as const, text: "✓ Review complete", delay: 300 },
    ],
  },
  debug: {
    command: "kairo --task \"explain this error\"",
    lines: [
      { type: "command" as const, text: "kairo --task \"explain this error\"", delay: 200 },
      { type: "system" as const, text: "┃ Kairo — gpt-4o", delay: 300 },
      { type: "system" as const, text: "────────────────────────────────────────────────", delay: 80 },
      { type: "system" as const, text: "TypeError: Cannot read properties", delay: 200 },
      { type: "system" as const, text: "of undefined (reading 'map')", delay: 150 },
      { type: "system" as const, text: "", delay: 80 },
      { type: "system" as const, text: "Root cause:", delay: 250 },
      { type: "system" as const, text: "  API response is empty. Data.map()", delay: 200 },
      { type: "system" as const, text: "  called on undefined.", delay: 150 },
      { type: "system" as const, text: "", delay: 80 },
      { type: "system" as const, text: "Fix: data ?? []", delay: 250 },
    ],
  },
  git: {
    command: "kairo --task \"review git diff\"",
    lines: [
      { type: "command" as const, text: "kairo --task \"review git diff\"", delay: 200 },
      { type: "system" as const, text: "┃ Kairo — gpt-4o", delay: 300 },
      { type: "system" as const, text: "────────────────────────────────────────────────", delay: 80 },
      { type: "system" as const, text: "2 files changed, +45/-12 lines", delay: 250 },
      { type: "system" as const, text: "", delay: 80 },
      { type: "system" as const, text: "Suggested commit message:", delay: 250 },
      { type: "system" as const, text: "  feat: add error boundary to", delay: 150 },
      { type: "system" as const, text: "  UserProfile component", delay: 150 },
    ],
  },
  chat: {
    command: "kairo",
    lines: [
      { type: "command" as const, text: "kairo", delay: 200 },
      { type: "system" as const, text: "┃ Kairo — gpt-4o", delay: 300 },
      { type: "system" as const, text: "────────────────────────────────────────────────", delay: 60 },
      { type: "system" as const, text: "  I can help you with:", delay: 200 },
      { type: "system" as const, text: "  • Code review & debugging", delay: 150 },
      { type: "system" as const, text: "  • Architecture discussions", delay: 150 },
      { type: "system" as const, text: "  • Git workflows & automation", delay: 150 },
      { type: "system" as const, text: "  • Database design & queries", delay: 150 },
      { type: "system" as const, text: "", delay: 60 },
      { type: "system" as const, text: "  Type /help for commands. Type exit to quit.", delay: 300 },
    ],
  },
};

type SessionKey = keyof typeof DEMO_SESSIONS;

export default function InteractiveTerminal() {
  const prefersReducedMotion = useReducedMotion();
  const [activeSession, setActiveSession] = useState<SessionKey>("chat");
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [typedChars, setTypedChars] = useState<Record<number, number>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const runSession = (key: SessionKey) => {
    if (isAnimating) return;
    setActiveSession(key);
    setVisibleLines(0);
    setTypedChars({});
    setIsComplete(false);
    setIsAnimating(true);
  };

  // Terminal animation
  useEffect(() => {
    const session = DEMO_SESSIONS[activeSession];
    if (!session) return;

    const lines = session.lines;
    let currentLine = 0;
    const charTimeouts: ReturnType<typeof setTimeout>[] = [];
    let isCancelled = false;

    const startTyping = () => {
      if (isCancelled || currentLine >= lines.length) {
        setIsAnimating(false);
        return;
      }

      const lineDelay = lines[currentLine]?.delay ?? 200;

      const lineTimeout = setTimeout(() => {
        if (isCancelled) return;

        setVisibleLines(() => currentLine + 1);
        setTypedChars((prev) => ({ ...prev, [currentLine]: 0 }));

        const line = lines[currentLine];
        const typingSpeed = line.type === "command" ? 20 : 12;

        for (let i = 0; i <= line.text.length; i++) {
          const charIndex = i;
          charTimeouts.push(
            setTimeout(
              () => {
                if (!isCancelled) {
                  setTypedChars((prev) => ({ ...prev, [currentLine]: charIndex }));
                }
              },
              (charIndex + 1) * typingSpeed,
            ),
          );
        }

        currentLine++;
        if (currentLine < lines.length) {
          charTimeouts.push(setTimeout(startTyping, 100));
        } else {
          setIsAnimating(false);
          setTimeout(() => {
            if (!isCancelled) setIsComplete(true);
          }, 800);
        }
      }, lineDelay);

      charTimeouts.push(lineTimeout);
    };

    const initialTimeout = setTimeout(startTyping, 300);
    return () => {
      isCancelled = true;
      clearTimeout(initialTimeout);
      charTimeouts.forEach(clearTimeout);
    };
  }, [activeSession]);

  const session = DEMO_SESSIONS[activeSession];

  const SESSION_KEYS: { key: SessionKey; label: string }[] = [
    { key: "chat", label: "Chat" },
    { key: "review", label: "Review" },
    { key: "debug", label: "Debug" },
    { key: "git", label: "Git" },
  ];

  return (
    <section className="relative py-24 sm:py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-noise" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-[0.02] dark:opacity-[0.03]" />
        <div className="absolute top-1/3 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-cyan-500/5 to-transparent blur-3xl dark:from-cyan-500/8" />
      </div>

      <TracingBeam className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Experience it live.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">
            See Kairo in action. Choose a workflow and watch it execute in real time.
          </p>
        </motion.div>

        {/* Demo selector */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5 flex gap-1 rounded-xl border border-border bg-card p-1 w-fit mx-auto"
        >
          {SESSION_KEYS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => runSession(key)}
              disabled={isAnimating}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                activeSession === key
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              } ${isAnimating ? "cursor-not-allowed opacity-50" : ""}`}
            >
              {label}
            </button>
          ))}
        </motion.div>

        {/* Terminal */}
        <motion.div
          key={activeSession}
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          {/* Glow */}
          <div className="absolute -inset-6 rounded-3xl bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent opacity-60 blur-2xl" />

          {/* Terminal window */}
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-[#0d1117] shadow-2xl">
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-white/5 bg-[#161b22] px-5 py-3">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/70" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/70" />
              </div>
              <span className="ml-auto text-xs text-white/40 font-mono">
                {session.command} — kairo
              </span>
              <div className="ml-auto w-[56px]" />
            </div>

            {/* Content */}
            <div className="p-5 sm:p-7 font-mono text-sm leading-relaxed min-h-[300px] sm:min-h-[320px]">
              {session.lines.map((line, lineIndex) => (
                <div
                  key={lineIndex}
                  className={
                    line.type === "output"
                      ? "text-white/60"
                      : line.type === "system"
                      ? "text-emerald-400/70"
                      : "text-white/90"
                  }
                >
                  {lineIndex < visibleLines && (
                    <>
                      {line.type === "command" && (
                        <span className="text-emerald-400 select-none">
                          ~/kairo{" "}
                          <span className="text-white/30">$</span>{" "}
                        </span>
                      )}
                      {line.text.slice(0, typedChars[lineIndex] ?? 0)}
                      {lineIndex === visibleLines - 1 &&
                        !isComplete &&
                        lineIndex === session.lines.length - 1 && (
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                            className="ml-0.5 inline-block h-4 w-2 bg-emerald-400/70"
                          />
                        )}
                    </>
                  )}
                </div>
              ))}

              {isComplete && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse" }}
                  className="ml-0.5 inline-block h-4 w-2 bg-emerald-400/70"
                />
              )}
            </div>
          </div>
        </motion.div>
        </TracingBeam>
    </section>
  );
}
