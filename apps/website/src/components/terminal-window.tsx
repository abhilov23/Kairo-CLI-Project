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
  typingSpeed = 15,
  prompt = "~/kairo",
}: TerminalWindowProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [typedChars, setTypedChars] = useState<Record<number, number>>({});
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setVisibleLines(0);
    setTypedChars({});
    setIsComplete(false);

    let currentLine = 0;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;

    const typeLine = () => {
      if (cancelled || currentLine >= lines.length) return;

      const line = lines[currentLine];
      const delay = line.delay ?? 600;

      timeouts.push(setTimeout(() => {
        if (cancelled) return;

        setVisibleLines(currentLine + 1);
        setTypedChars((prev) => ({ ...prev, [currentLine]: 0 }));

        for (let i = 0; i <= line.text.length; i++) {
          const ci = i;
          timeouts.push(setTimeout(() => {
            if (!cancelled) setTypedChars((prev) => ({ ...prev, [currentLine]: ci }));
          }, (ci + 1) * typingSpeed));
        }

        currentLine++;
        if (currentLine < lines.length) {
          const nextDelay = lines[currentLine]?.delay ?? 600;
          timeouts.push(setTimeout(typeLine, nextDelay + line.text.length * typingSpeed + 200));
        } else {
          timeouts.push(setTimeout(() => { if (!cancelled) setIsComplete(true); }, 800));
        }
      }, 0));
    };

    timeouts.push(setTimeout(typeLine, 300));

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [lines, typingSpeed]);

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border/50 bg-[#0d1117] shadow-sm", className)}>
      <div className="flex items-center gap-2 border-b border-border/20 bg-[#161b22] px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/70" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
          <div className="h-3 w-3 rounded-full bg-emerald-500/70" />
        </div>
        <span className="ml-auto text-xs text-muted-foreground/50 font-mono">{title}</span>
        <div className="ml-auto w-[52px]" />
      </div>

      <div className="overflow-x-auto p-4 sm:p-5 font-mono text-sm leading-relaxed">
        {lines.map((line, i) => (
          <div
            key={i}
            className={cn(
              "min-h-[1.5em]",
              line.type === "output" && "text-muted-foreground/80",
              line.type === "system" && "text-emerald-400/70",
              line.type === "command" && "text-foreground",
            )}
          >
            {i < visibleLines && (
              <>
                {line.type === "command" && (
                  <span className="text-emerald-400 select-none">
                    {prompt} <span className="text-muted-foreground/40">$</span>{" "}
                  </span>
                )}
                {line.text.slice(0, typedChars[i] ?? line.text.length)}
                {i === visibleLines - 1 && !isComplete && (
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
