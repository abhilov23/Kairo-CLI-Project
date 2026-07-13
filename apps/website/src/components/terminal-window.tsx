"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TerminalLine {
  type: "command" | "output" | "system";
  text: string;
  delay?: number;
}

interface TerminalWindowProps {
  title?: string;
  lines: TerminalLine[];
  className?: string;
  typingSpeed?: number;
  prompt?: string;
}

export default function TerminalWindow({
  title = "terminal",
  lines,
  className,
  typingSpeed = 30,
  prompt = "~/kairo",
}: TerminalWindowProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [typedChars, setTypedChars] = useState<Record<number, number>>({});
  const [isComplete, setIsComplete] = useState(false);

  // Start animation
  useEffect(() => {
    const totalDelay = lines.reduce((sum, line) => sum + (line.delay ?? 800), 0);
    let currentLine = 0;
    const charTimeouts: ReturnType<typeof setTimeout>[] = [];
    let isCancelled = false;

    const startTyping = () => {
      if (isCancelled || currentLine >= lines.length) return;

      const lineDelay = lines[currentLine]?.delay ?? 800;

      const lineTimeout = setTimeout(() => {
        if (isCancelled) return;

        setVisibleLines(() => currentLine + 1);
        setTypedChars((prev) => ({ ...prev, [currentLine]: 0 }));

        // Type out characters
        const line = lines[currentLine];
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
          charTimeouts.push(setTimeout(startTyping, totalDelay / lines.length + 300));
        } else {
          setTimeout(() => {
            if (!isCancelled) setIsComplete(true);
          }, 1000);
        }
      }, lineDelay);

      charTimeouts.push(lineTimeout);
    };

    const initialTimeout = setTimeout(startTyping, 500);
    return () => {
      isCancelled = true;
      clearTimeout(initialTimeout);
      charTimeouts.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTotalTypedChars = (lineIndex: number) => {
    return typedChars[lineIndex] ?? 0;
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/50 bg-[#0d1117] shadow-sm",
        className,
      )}
    >
      {/* Window header */}
      <div className="flex items-center gap-2 border-b border-border/20 bg-[#161b22] px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/70" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
          <div className="h-3 w-3 rounded-full bg-emerald-500/70" />
        </div>
        <span className="ml-auto text-xs text-muted-foreground/50 font-mono">
          {title}
        </span>
        <div className="ml-auto w-[52px]" /> {/* Spacer for centering */}
      </div>

      {/* Terminal content */}
      <div className="overflow-x-auto p-4 sm:p-5 font-mono text-sm leading-relaxed">
        {lines.map((line, lineIndex) => (
          <div
            key={lineIndex}
            className={cn(
              "min-h-[1.5em]",
              line.type === "output" && "text-muted-foreground/80",
              line.type === "system" && "text-emerald-400/70",
              line.type === "command" && "text-foreground",
            )}
          >
            {lineIndex < visibleLines && (
              <>
                {line.type === "command" && (
                  <span className="text-emerald-400 select-none">
                    {prompt}{" "}
                    <span className="text-muted-foreground/40">$</span>{" "}
                  </span>
                )}
                {line.text.slice(0, getTotalTypedChars(lineIndex))}
                {lineIndex === visibleLines - 1 &&
                  !isComplete &&
                  lineIndex === lines.length - 1 && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                      className="ml-0.5 inline-block h-4 w-2 bg-foreground/70"
                    />
                  )}
              </>
            )}
          </div>
        ))}

        {/* Blinking cursor at end */}
        {isComplete && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse" }}
            className="ml-0.5 inline-block h-4 w-2 bg-emerald-400/70"
          />
        )}
      </div>
    </div>
  );
}
