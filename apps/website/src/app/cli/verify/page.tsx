import { VerifyClient } from "./client";

export default function VerifyPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4">
      {/* Grid background */}
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      {/* Noise overlay */}
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.015]" />
      {/* Violet spotlight */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-violet-500/[0.03] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-violet-500/[0.02] blur-3xl" />

      <div className="relative z-10 w-full max-w-sm">
        <VerifyClient />
      </div>

      <p className="relative z-10 mt-8 text-center text-xs text-muted-foreground/40">
        KairoCLI &mdash; Your AI teammate in the terminal
      </p>
    </div>
  );
}
