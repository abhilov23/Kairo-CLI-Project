"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description: string;
  className?: string;
}

export default function PageHeader({
  title,
  description,
  className,
}: PageHeaderProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className={cn(
        "relative pt-28 pb-16 sm:pt-36 sm:pb-20",
        className,
      )}
    >
      {/* Subtle background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-[0.02] dark:opacity-[0.03]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
