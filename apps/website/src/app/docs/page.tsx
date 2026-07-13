import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import DocsLayout from "./docs-layout";

export const metadata: Metadata = {
  title: "Documentation — Kairo",
  description:
    "Learn how to install, configure, and use Kairo CLI. Complete documentation with guides, API references, and examples.",
  openGraph: {
    title: "Documentation — Kairo",
    description:
      "Learn how to install, configure, and use Kairo CLI. Complete documentation with guides, API references, and examples.",
    images: "/opengraph-image.png",
  },
};

function TerminalBlock({ command, lines }: { command: string; lines: string[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/50 bg-[#0d1117] shadow-sm">
      <div className="flex items-center gap-2 border-b border-white/5 bg-[#161b22] px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
        </div>
        <span className="ml-auto text-[10px] text-white/30 font-mono">terminal</span>
        <div className="ml-auto w-[52px]" />
      </div>
      <div className="p-4 font-mono text-sm leading-relaxed">
        <div>
          <span className="text-white/30">$ </span>
          <span className="text-white/90">{command}</span>
        </div>
        {lines.map((line, i) => (
          <div key={i} className={line.startsWith("OK") ? "text-emerald-400/70" : "text-white/50"}>
            {line || "\u00A0"}
          </div>
        ))}
        <span className="inline-block h-3.5 w-2 animate-pulse bg-emerald-400/60 mt-0.5" />
      </div>
    </div>
  );
}

function CommandRow({ cmd, desc }: { cmd: string; desc: string }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border/40 bg-card/30 p-4 transition-colors hover:border-muted-foreground/20">
      <code className="shrink-0 rounded-lg bg-muted px-3 py-1 font-mono text-sm text-foreground">
        {cmd}
      </code>
      <span className="text-sm text-muted-foreground">{desc}</span>
    </div>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-amber-500/10 bg-amber-500/5 p-4">
      <p className="text-sm text-amber-400/90">{children}</p>
    </div>
  );
}

const QUICK_COMMANDS = [
  { cmd: "kairo chat", desc: "Start an AI chat session" },
  { cmd: "kairo models", desc: "List available AI models" },
  { cmd: "kairo config", desc: "View or update configuration" },
  { cmd: "kairo help", desc: "Display help information" },
];

const EXAMPLES = [
  {
    title: "Code Review",
    cmd: "kairo review src/components/button.tsx",
    desc: "Review a specific file for bugs, security issues, and improvement suggestions.",
  },
  {
    title: "Debug Help",
    cmd: "kairo explain",
    desc: "Get an explanation of the last error or exception with context from your codebase.",
  },
  {
    title: "Architecture",
    cmd: "kairo chat",
    desc: "Discuss design patterns, architecture decisions, and get AI-powered suggestions.",
  },
  {
    title: "Refactoring",
    cmd: "kairo fix src/utils/api.ts",
    desc: "Automatically apply suggested fixes and refactoring to your code.",
  },
];

const FAQS = [
  {
    q: "Do I need an API key?",
    a: "Yes. Kairo uses your own AI provider API keys. You can configure them with kairo config.",
  },
  {
    q: "Is Kairo free?",
    a: "Kairo itself is free and open source. You only pay for the AI API usage from your chosen provider.",
  },
  {
    q: "Can I use it offline?",
    a: "Yes, with local models via Ollama or LM Studio. Set your provider to use local models.",
  },
  {
    q: "Does Kairo store my code?",
    a: "No. Your code is processed locally and sent only to the AI provider you configure. We don't store your code.",
  },
  {
    q: "Which platforms are supported?",
    a: "Kairo works on macOS, Linux, and Windows (via WSL or native).",
  },
];

const TROUBLESHOOTING = [
  {
    issue: "Command not found",
    solution: "Ensure Node.js 18+ is installed and npm global packages are in your PATH.",
  },
  {
    issue: "API key errors",
    solution: "Run kairo config to verify your provider and API key settings.",
  },
  {
    issue: "Slow responses",
    solution: "Check your internet connection or try a different AI provider with lower latency.",
  },
];

export default function DocsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <DocsLayout>
          <article className="max-w-none">
            {/* Introduction */}
            <section id="introduction">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Introduction
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Kairo is an AI-powered CLI that brings intelligent development
                workflows directly to your terminal. This documentation covers
                everything from installation to advanced usage.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Current version", value: "v0.1.0" },
                  { label: "License", value: "MIT" },
                  { label: "Last updated", value: "June 2025" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-border/40 bg-card/30 p-4">
                    <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      {item.label}
                    </div>
                    <div className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Installation */}
            <section id="installation" className="mt-16">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Installation
              </h2>
              <p className="mt-3 text-muted-foreground">
                Install Kairo globally using npm. Works on macOS, Linux, and Windows.
              </p>
              <div className="mt-6 space-y-4">
                <TerminalBlock
                  command="npm install -g kairo-cli"
                  lines={["+ kairo-cli@latest", "OK Installed successfully"]}
                />
                <InfoBox>
                  <strong>Prerequisites:</strong> Node.js 18+ is required. Verify
                  your Node version with <code className="text-amber-300">node --version</code>.
                </InfoBox>
              </div>
            </section>

            {/* Quick Start */}
            <section id="quick-start" className="mt-16">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Quick Start
              </h2>
              <p className="mt-3 text-muted-foreground">
                Once installed, set up your AI provider and start chatting with Kairo.
              </p>
              <div className="mt-6 space-y-4">
                <TerminalBlock
                  command="kairo config set provider anthropic"
                  lines={["OK Provider set to: anthropic"]}
                />
                <TerminalBlock
                  command="kairo config set api_key sk-ant-..."
                  lines={["OK API key configured"]}
                />
                <TerminalBlock
                  command="kairo chat"
                  lines={[
                    "~ Kairo - I'm ready",
                    "|",
                    "|  What are we building today?",
                    "~ Type your message to begin",
                  ]}
                />
              </div>

              <div className="mt-8 space-y-3">
                <h3 className="text-sm font-semibold tracking-tight text-foreground">
                  Essential commands
                </h3>
                {QUICK_COMMANDS.map((item) => (
                  <CommandRow key={item.cmd} cmd={item.cmd} desc={item.desc} />
                ))}
              </div>
            </section>

            {/* Examples */}
            <section id="examples" className="mt-16">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Examples
              </h2>
              <p className="mt-3 text-muted-foreground">
                Common use cases to get you started with Kairo.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {EXAMPLES.map((example) => (
                  <div
                    key={example.title}
                    className="rounded-xl border border-border/40 bg-card/30 p-5 transition-colors hover:border-muted-foreground/20"
                  >
                    <h3 className="text-sm font-semibold text-foreground">
                      {example.title}
                    </h3>
                    <code className="mt-2 block rounded-lg bg-muted px-3 py-2 font-mono text-sm text-emerald-400">
                      $ {example.cmd}
                    </code>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {example.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="mt-16">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Frequently Asked Questions
              </h2>
              <div className="mt-6 space-y-3">
                {FAQS.map((faq) => (
                  <details
                    key={faq.q}
                    className="group rounded-xl border border-border/40 bg-card/30 transition-colors hover:border-muted-foreground/20 open:bg-card/50"
                  >
                    <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium text-foreground">
                      {faq.q}
                      <svg
                        className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </summary>
                    <div className="border-t border-border/20 px-5 py-4">
                      <p className="text-sm text-muted-foreground">{faq.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>

            {/* Troubleshooting */}
            <section id="troubleshooting" className="mt-16 mb-16">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Troubleshooting
              </h2>
              <div className="mt-6 space-y-3">
                {TROUBLESHOOTING.map((item) => (
                  <div
                    key={item.issue}
                    className="rounded-xl border border-border/40 bg-card/30 p-5"
                  >
                    <h3 className="text-sm font-semibold text-red-400">
                      {item.issue}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {item.solution}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </article>
        </DocsLayout>
      </main>
      <Footer />
    </>
  );
}
