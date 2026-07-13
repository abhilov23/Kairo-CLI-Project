import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import DocsLayout from "../docs-layout";

export const metadata: Metadata = {
  title: "Commands — Kairo",
  description:
    "Complete command reference for Kairo CLI. Learn every command — kairo chat, review, explain, fix, config, and more — with usage, options, and examples.",
  openGraph: {
    title: "Commands — Kairo",
    description:
      "Complete command reference for Kairo CLI. Learn every command — kairo chat, review, explain, fix, config, and more — with usage, options, and examples.",
    images: "/opengraph-image.png",
  },
};

interface Command {
  id: string;
  name: string;
  description: string;
  usage: string;
  options?: { flag: string; description: string }[];
  examples: string[];
}

const COMMANDS: Command[] = [
  {
    id: "chat",
    name: "kairo chat",
    description: "Start an interactive AI chat session in your terminal.",
    usage: "kairo chat [options]",
    options: [
      { flag: "--provider", description: "Specify AI provider" },
      { flag: "--model", description: "Specify model to use" },
      { flag: "--file, -f", description: "Include file context" },
      { flag: "--session", description: "Resume previous session" },
    ],
    examples: ["kairo chat", "kairo chat --provider anthropic", "kairo chat --file src/app.tsx"],
  },
  {
    id: "models",
    name: "kairo models",
    description: "List all available AI models from configured providers.",
    usage: "kairo models [options]",
    options: [
      { flag: "--provider", description: "Filter by provider" },
      { flag: "--local", description: "Show only local models" },
    ],
    examples: ["kairo models", "kairo models --provider openai"],
  },
  {
    id: "config",
    name: "kairo config",
    description: "View, set, or update Kairo configuration.",
    usage: "kairo config [command] [key] [value]",
    options: [
      { flag: "set", description: "Set a configuration value" },
      { flag: "get", description: "Get a configuration value" },
      { flag: "list", description: "List all configuration" },
      { flag: "--global", description: "Edit global config" },
    ],
    examples: ["kairo config list", "kairo config set provider openai", "kairo config get model"],
  },
  {
    id: "review",
    name: "kairo review",
    description: "Review code for bugs, security issues, and improvements.",
    usage: "kairo review <path> [options]",
    options: [
      { flag: "--staged", description: "Review staged git changes" },
      { flag: "--format", description: "Output format (json, markdown)" },
    ],
    examples: ["kairo review src/", "kairo review --staged"],
  },
  {
    id: "explain",
    name: "kairo explain",
    description: "Explain code, errors, or concepts with AI context.",
    usage: "kairo explain [query]",
    examples: ["kairo explain", "kairo explain how authentication works"],
  },
  {
    id: "fix",
    name: "kairo fix",
    description: "Automatically apply AI-suggested fixes to your code.",
    usage: "kairo fix <path> [options]",
    options: [
      { flag: "--dry-run", description: "Preview changes without applying" },
      { flag: "--interactive", description: "Review each change before applying" },
    ],
    examples: ["kairo fix src/auth.ts", "kairo fix src/ --dry-run"],
  },
];

function OptionTag({ flag }: { flag: string }) {
  return (
    <code className="shrink-0 rounded-md bg-violet-500/10 px-2 py-0.5 font-mono text-xs text-violet-500 dark:text-violet-400">
      {flag}
    </code>
  );
}

export default function CommandsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <DocsLayout>
          <article>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Commands
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Complete reference for all Kairo CLI commands.
            </p>

            <div className="mt-10 space-y-5">
              {COMMANDS.map((cmd) => (
                <section key={cmd.id} id={cmd.id}>
                  <div className="rounded-2xl border border-border/40 bg-card/30 p-6 transition-colors hover:border-muted-foreground/20">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-semibold text-foreground">
                          {cmd.name}
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {cmd.description}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full border border-border/40 bg-muted/50 px-3 py-0.5 text-[11px] font-medium text-muted-foreground">
                        Command
                      </span>
                    </div>

                    {/* Usage */}
                    <div className="mt-5">
                      <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                        Usage
                      </div>
                      <div className="overflow-hidden rounded-lg border border-border/30 bg-[#0d1117]">
                        <div className="px-4 py-2.5 font-mono text-sm text-emerald-400/80">
                          <span className="text-white/30">$ </span>
                          {cmd.usage}
                        </div>
                      </div>
                    </div>

                    {/* Options */}
                    {cmd.options && cmd.options.length > 0 && (
                      <div className="mt-5">
                        <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                          Options
                        </div>
                        <div className="space-y-1.5">
                          {cmd.options.map((opt) => (
                            <div
                              key={opt.flag}
                              className="flex items-start gap-3 rounded-lg bg-muted/30 px-3.5 py-2 text-sm"
                            >
                              <OptionTag flag={opt.flag} />
                              <span className="text-muted-foreground">
                                {opt.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Examples */}
                    <div className="mt-5">
                      <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                        Examples
                      </div>
                      <div className="space-y-1.5">
                        {cmd.examples.map((example) => (
                          <code
                            key={example}
                            className="block rounded-lg bg-muted/50 px-3.5 py-2 font-mono text-sm text-muted-foreground"
                          >
                            $ {example}
                          </code>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </article>
        </DocsLayout>
      </main>
      <Footer />
    </>
  );
}
