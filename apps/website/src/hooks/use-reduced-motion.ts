"use client";

import { useReducedMotion as fmUseReducedMotion } from "framer-motion";

export function useReducedMotion(): boolean {
  try {
    return fmUseReducedMotion() ?? false;
  } catch {
    return false;
  }
}
