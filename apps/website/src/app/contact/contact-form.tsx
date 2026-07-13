"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const prefersReducedMotion = useReducedMotion();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus("success");
    setTimeout(() => {
      setStatus("idle");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  const isFormValid =
    formData.name.trim() &&
    formData.email.trim() &&
    formData.subject.trim() &&
    formData.message.trim();

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-border bg-card p-6"
      >
        <h2 className="text-sm font-semibold text-foreground">
          Send us a message
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          We&apos;ll get back to you as soon as possible.
        </p>

        <div className="mt-5 space-y-4">
          {(["name", "email", "subject"] as const).map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-xs font-medium text-foreground mb-1"
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                id={field}
                type={field === "email" ? "email" : "text"}
                required
                value={formData[field]}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, [field]: e.target.value }))
                }
                placeholder={
                  field === "name"
                    ? "Your name"
                    : field === "email"
                      ? "you@example.com"
                      : "What's this about?"
                }
                className="block w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/10 transition-colors"
                disabled={status === "sending"}
              />
            </div>
          ))}

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-xs font-medium text-foreground mb-1"
            >
              Message
            </label>
            <textarea
              id="message"
              required
              rows={4}
              value={formData.message}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, message: e.target.value }))
              }
              placeholder="Tell us more..."
              className="block w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/10 transition-colors resize-y min-h-[100px]"
              disabled={status === "sending"}
            />
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            disabled={!isFormValid || status === "sending"}
            size="default"
            className="h-9 w-full rounded-lg bg-foreground text-background hover:bg-foreground/90 disabled:opacity-40 text-sm font-medium"
          >
            {status === "idle" && (
              <>
                Send Message
                <Send className="ml-1.5 h-3.5 w-3.5" />
              </>
            )}
            {status === "sending" && (
              <>
                <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-background border-t-transparent mr-1.5" />
                Sending...
              </>
            )}
            {status === "success" && (
              <>
                <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
                Message sent!
              </>
            )}
            {status === "error" && (
              <>
                <AlertCircle className="mr-1.5 h-3.5 w-3.5 text-red-400" />
                Something went wrong.
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
