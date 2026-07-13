"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Terminal, ArrowRight, CheckCircle2, Loader2, KeyRound } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export function VerifyClient() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "confirming" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleConfirm = useCallback(async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    setStatus("confirming");
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/device/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_code: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 401) {
          throw new Error("You need to log in first. Please log in and try again.");
        }
        throw new Error(data.error_description ?? "Invalid code or already used");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }, [code]);

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/[0.04] to-transparent p-8 text-center backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        >
          <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-emerald-400" />
        </motion.div>
        <h2 className="mb-2 text-xl font-semibold tracking-tight text-foreground">
          Device Authorized!
        </h2>
        <p className="text-sm text-muted-foreground/70">
          Your KairoCLI is now connected. You can close this page and return to your terminal.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="rounded-xl border border-border/40 bg-gradient-to-b from-background to-muted/20 p-8 backdrop-blur-sm"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
          <Terminal className="h-5 w-5 text-violet-400" />
        </div>
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          Connect KairoCLI
        </h1>
        <p className="mt-1 text-sm text-muted-foreground/60">
          Enter the pairing code shown in your terminal to authorize this device.
        </p>
      </motion.div>

      {/* Code input */}
      <motion.div variants={fadeUp} className="mb-4">
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground/50 uppercase tracking-wider">
          Pairing Code
        </label>
        <div className="relative">
          <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/30" />
          <input
            type="text"
            placeholder="e.g. ABCD-EFGH"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
            className="w-full rounded-xl border border-border/50 bg-muted/30 px-10 py-3 text-center font-mono text-lg tracking-[0.2em] text-foreground placeholder:font-sans placeholder:text-sm placeholder:text-muted-foreground/30 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-colors"
            autoFocus
            spellCheck={false}
          />
        </div>
      </motion.div>

      {/* Error message */}
      {status === "error" && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          variants={fadeUp}
          className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm text-red-400"
        >
          {errorMsg}
        </motion.div>
      )}

      {/* Submit button */}
      <motion.div variants={fadeUp}>
        <button
          onClick={handleConfirm}
          disabled={status === "confirming" || !code.trim()}
          className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-violet-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status === "confirming" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Authorizing...
            </>
          ) : (
            <>
              Authorize
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </motion.div>

      {/* Footer note */}
      <motion.p variants={fadeUp} className="mt-4 text-center text-xs text-muted-foreground/30">
        Your pairing code expires in 10 minutes
      </motion.p>
    </motion.div>
  );
}
