"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { GitHubIcon } from "@/components/auth-icons";
import AuthBrandPanel from "@/components/auth-brand-panel";
import { signIn } from "next-auth/react";
import { Loader2, Mail, Lock, Eye, EyeOff, User } from "lucide-react";

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.25, 0, 1] as const },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: [0.25, 0.25, 0, 1] as const },
  },
};

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name || undefined, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.details?.[0] || data.error || "Something went wrong");
        return;
      }

      // Auto sign in after successful signup
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created. Please sign in.");
        window.location.href = "/login";
      } else {
        // Full page navigation to ensure server reads the fresh session cookie
        window.location.href = "/dashboard";
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col lg:flex-row">
      {/* Global background effects */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-grid opacity-[0.015] dark:opacity-[0.025]" />
        <div className="absolute inset-0 bg-noise" />
      </div>

      {/* Brand Panel */}
      <AuthBrandPanel />

      {/* Form Panel */}
      <div className="relative flex flex-1 items-center justify-center bg-background p-6 sm:p-10 lg:p-14">
        {/* Subtle spotlight for form side */}
        <div className="pointer-events-none absolute -left-32 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-violet-500/[0.02] blur-3xl dark:bg-violet-500/[0.03]" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 w-full max-w-sm"
        >
          {/* Logo (mobile only) */}
          <motion.div variants={fadeUp} className="flex items-center gap-2.5 mb-10 lg:hidden">
            <Image
              src="/logo.png"
              alt="Kairo"
              width={36}
              height={36}
              className="rounded-lg invert dark:invert-0"
              style={{ width: "auto", height: "auto" }}
            />
            <span className="text-sm font-semibold tracking-tight text-foreground">
              Kairo
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div variants={fadeUp}>
            <h1 className="text-[28px] font-bold tracking-tight text-foreground leading-none">
              Create your account
            </h1>
            <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">
              Start shipping faster with Kairo.
            </p>
          </motion.div>

          {/* Email/Password Form */}
          <motion.div variants={fadeUp} className="mt-6">
            <form onSubmit={handleSignup} className="space-y-3">
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  placeholder="Name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground/40 transition-colors focus:border-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground/40 transition-colors focus:border-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                <input
                  id="signup-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password (min. 8 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground/40 transition-colors focus:border-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {error && (
                <p className="text-xs text-destructive">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Create account"
                )}
              </button>
            </form>
          </motion.div>

          {/* Divider */}
          <motion.div variants={fadeUp} className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground/50">
                Or continue with
              </span>
            </div>
          </motion.div>

          {/* OAuth Buttons */}
          <motion.div variants={fadeUp} className="space-y-2.5">
            <button
              type="button"
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              aria-label="Sign up with GitHub"
              className="group relative w-full inline-flex items-center justify-center gap-2.5 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-muted/50 hover:border-muted-foreground/20 active:scale-[0.98]"
            >
              <GitHubIcon className="h-4 w-4" />
              <span>Continue with GitHub</span>
            </button>
          </motion.div>

          {/* Toggle */}
          <motion.p
            variants={fadeIn}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
            >
              Sign in
            </a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
