"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface InstallCommandProps {
  command?: string;
  className?: string;
  variant?: "default" | "compact";
}

export default function InstallCommand({
  command = "npm install -g @abhilov/kairo",
  className,
  variant = "default",
}: InstallCommandProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = command;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border/50 bg-card transition-all hover:border-border/80",
        variant === "compact" ? "inline-flex" : "w-full",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center",
          variant === "compact"
            ? "gap-2 px-3 py-1.5"
            : "gap-3 px-4 py-3 sm:px-5 sm:py-4",
        )}
      >
        {/* Dollar sign */}
        <span
          className={cn(
            "select-none font-mono text-muted-foreground",
            variant === "compact" ? "text-xs" : "text-sm sm:text-base",
          )}
        >
          $
        </span>

        {/* Command text */}
        <code
          className={cn(
            "flex-1 font-mono text-foreground",
            variant === "compact" ? "text-xs" : "text-sm sm:text-base",
          )}
        >
          {command}
        </code>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className={cn(
            "flex shrink-0 items-center justify-center rounded-lg transition-all",
            "text-muted-foreground hover:text-foreground",
            copied && "text-emerald-500 hover:text-emerald-500",
            variant === "compact" ? "h-6 w-6" : "h-8 w-8",
          )}
          aria-label={copied ? "Copied" : "Copy command"}
        >
          {copied ? (
            <Check className={variant === "compact" ? "h-3.5 w-3.5" : "h-4 w-4"} />
          ) : (
            <Copy className={variant === "compact" ? "h-3.5 w-3.5" : "h-4 w-4"} />
          )}
        </button>
      </div>

      {/* Copy success indicator */}
      {copied && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm transition-opacity">
          <span className="flex items-center gap-2 text-sm font-medium text-emerald-500">
            <Check className="h-4 w-4" />
            Copied to clipboard
          </span>
        </div>
      )}
    </div>
  );
}
