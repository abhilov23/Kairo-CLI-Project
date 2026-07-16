import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import DocsLayout from "../docs-layout";

export const metadata: Metadata = {
  title: "Commands — Kairo",
  description:
    "Complete command reference for Kairo CLI. Learn every command — kairo, kairo setup, kairo doctor, kairo help, kairo --task — with usage, options, and examples.",
  openGraph: {
    title: "Commands — Kairo",
    description:
      "Complete command reference for Kairo CLI. Learn every command — kairo, kairo setup, kairo doctor, kairo help, kairo --task — with usage, options, and examples.",
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
    name: "kairo (default)",
    description: "Start an interactive AI chat session. Kairo's default mode — just run kairo with no arguments.",
    usage: "kairo [options]",
    options: [
      { flag: "--model", description: "Override the configured model" },
      { flag: "--task <text>", description: "Run a single non-interactive task" },
    ],
    examples: ["kairo", "kairo --model gpt-4o"],
  },
  {
    id: "setup",
    name: "kairo setup",
    description: "Interactive wizard to configure your AI provider, model, and API key.",
    usage: "kairo setup",
    examples: ["kairo setup"],
  },
  {
    id: "doctor",
    name: "kairo doctor",
    description: "Check your CLI configuration and diagnose issues with providers, API keys, and model connectivity.",
    usage: "kairo doctor",
    examples: ["kairo doctor"],
  },
  {
    id: "help",
    name: "kairo help",
    description: "Display help information about Kairo CLI commands and options.",
    usage: "kairo help",
    examples: ["kairo help"],
  },
  {
    id: "version",
    name: "kairo --version",
    description: "Display the installed version of Kairo CLI.",
    usage: "kairo --version",
    examples: ["kairo --version"],
  },
  {
    id: "task",
    name: "kairo --task",
    description: "Run a single task non-interactively and exit. Useful for scripting and automation.",
    usage: "kairo --task <prompt>",
    examples: ["kairo --task \"review the current git diff\"", "kairo --task \"explain this error: $(cat error.log)\""],
  },
];

function OptionTag({ flag }: { flag: string }) {
  return (
    <code className="shrink-0 rounded-md bg-cyan-500/10 px-2 py-0.5 font-mono text-xs text-cyan-500 dark:text-cyan-400">
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

            {/* Interactive commands */}
            <section id="interactive" className="mt-10 mb-16">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Interactive Mode
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                While in an active chat session, type these commands at the prompt:
              </p>
              <div className="mt-4 overflow-hidden rounded-xl border border-border/40">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/40 bg-muted/50">
                      <th className="px-4 py-3 text-left font-medium text-foreground">Command</th>
                      <th className="px-4 py-3 text-left font-medium text-foreground">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["/help", "Show available interactive commands and tools"],
                      ["/tools", "List available tools (read file, git, etc.)"],
                      ["/login", "Log in to your Kairo account"],
                      ["/logout", "Clear cached authentication session"],
                      ["/whoami", "Show current auth session info"],
                      ["/clear", "Clear chat memory for a fresh start"],
                      ["clear / cls", "Clear the terminal screen"],
                      ["exit", "Exit Kairo CLI"],
                    ].map(([cmd, desc]) => (
                      <tr key={cmd} className="border-b border-border/20 last:border-0 transition-colors hover:bg-muted/20">
                        <td className="px-4 py-3">
                          <code className="rounded bg-cyan-500/10 px-1.5 py-0.5 font-mono text-xs text-cyan-500 dark:text-cyan-400">
                            {cmd}
                          </code>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </article>
        </DocsLayout>
      </main>
      <Footer />
    </>
  );
}
