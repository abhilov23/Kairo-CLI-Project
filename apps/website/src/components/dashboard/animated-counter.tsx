"use client";

import { useEffect, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  delay?: number;
  formatter?: (value: number) => string;
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 1200,
  delay = 0,
  formatter,
  className,
}: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      let startTime: number | null = null;
      let rafId: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic: smooth deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(eased * value));

        if (progress < 1) {
          rafId = requestAnimationFrame(animate);
        }
      };

      rafId = requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [value, duration, delay]);

  return (
    <span className={className}>
      {formatter ? formatter(display) : display.toLocaleString()}
    </span>
  );
}
