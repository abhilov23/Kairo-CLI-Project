import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import DocsLayout from "../docs-layout";

export const metadata: Metadata = {
  title: "Configuration — Kairo",
  description:
    "Complete configuration guide for Kairo CLI. Set providers, models, API keys, environment variables, and customize your development workflow.",
  openGraph: {
    title: "Configuration — Kairo",
    description:
      "Complete configuration guide for Kairo CLI. Set providers, models, API keys, environment variables, and customize your development workflow.",
    images: "/opengraph-image.png",
  },
};

interface ConfigOption {
  key: string;
  description: string;
  type: string;
  default?: string;
  values?: string[];
  isEnv?: boolean;
}

const CONFIG_OPTIONS: ConfigOption[] = [
  {
    key: "provider",
    description: "The AI provider to use for chat and commands.",
    type: "string",
    default: "openai",
    values: ["openai", "anthropic", "google", "local"],
  },
  {
    key: "model",
    description: "The specific AI model to use.",
    type: "string",
    default: "gpt-4o",
    values: ["gpt-4o", "claude-sonnet-4", "gemini-pro", "custom"],
  },
  {
    key: "api_key",
    description: "Your API key for the configured provider.",
    type: "string (secret)",
    default: "—",
  },
  {
    key: "temperature",
    description: "Response creativity (0 = deterministic, 2 = very creative).",
    type: "number",
    default: "0.7",
    values: ["0.0 – 2.0"],
  },
  {
    key: "max_tokens",
    description: "Maximum tokens in the AI response.",
    type: "number",
    default: "4096",
    values: ["128 – 65536"],
  },
  {
    key: "theme",
    description: "Terminal UI theme.",
    type: "string",
    default: "dark",
    values: ["dark", "light", "system"],
  },
  {
    key: "editor",
    description: "Default editor for file operations.",
    type: "string",
    default: "$EDITOR",
    values: ["vim", "nvim", "code", "cursor"],
  },
  {
    key: "KAIRO_API_KEY",
    description: "Environment variable for API key (overrides config).",
    type: "env",
    isEnv: true,
  },
  {
    key: "KAIRO_PROVIDER",
    description: "Environment variable for provider selection.",
    type: "env",
    isEnv: true,
  },
];

const CONFIG_COMMANDS = [
  {
    title: "View all config",
    cmd: "kairo config list",
    desc: "Display all current configuration values.",
  },
  {
    title: "Set a value",
    cmd: "kairo config set provider anthropic",
    desc: "Set a configuration key to a new value.",
  },
  {
    title: "Get a value",
    cmd: "kairo config get model",
    desc: "Display the value of a specific configuration key.",
  },
  {
    title: "Use environment variables",
    cmd: "export KAIRO_API_KEY=sk-...",
    desc: "Override config values with environment variables.",
  },
];

export default function ConfigPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <DocsLayout>
          <article>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Configuration
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Configure Kairo to work with your preferred AI providers and
              customize its behavior.
            </p>

            {/* Quick Reference Table */}
            <section id="quick-reference" className="mt-10">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Quick Reference
              </h2>
              <div className="mt-4 overflow-hidden rounded-xl border border-border/40">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/40 bg-muted/50">
                        <th className="px-4 py-3 text-left font-medium text-foreground">Key</th>
                        <th className="px-4 py-3 text-left font-medium text-foreground hidden sm:table-cell">Description</th>
                        <th className="px-4 py-3 text-left font-medium text-foreground">Type</th>
                        <th className="px-4 py-3 text-left font-medium text-foreground">Default</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CONFIG_OPTIONS.map((option) => (
                        <tr
                          key={option.key}
                          className="border-b border-border/20 last:border-0 transition-colors hover:bg-muted/20"
                        >
                          <td className="px-4 py-3">
                            <code className="rounded bg-violet-500/10 px-1.5 py-0.5 font-mono text-xs text-violet-500 dark:text-violet-400">
                              {option.key}
                            </code>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                            {option.description}
                          </td>
                          <td className="px-4 py-3">
                            <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                              {option.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                            {option.default || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Config Commands */}
            <section id="usage" className="mt-12">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Configuration Commands
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {CONFIG_COMMANDS.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-border/40 bg-card/30 p-5 transition-colors hover:border-muted-foreground/20"
                  >
                    <h3 className="text-sm font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <div className="mt-2 overflow-hidden rounded-lg border border-border/30 bg-[#0d1117]">
                      <div className="px-3.5 py-2 font-mono text-sm text-emerald-400/80">
                        <span className="text-white/30">$ </span>
                        {item.cmd}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Environment Variables */}
            <section id="environment" className="mt-12 mb-16">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Environment Variables
              </h2>
              <p className="mt-3 text-muted-foreground">
                You can configure Kairo using environment variables. These take
                precedence over config file values.
              </p>
              <div className="mt-4 overflow-hidden rounded-xl border border-border/40">
                <div className="px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground bg-muted/50">
                  .env example
                </div>
                <div className="divide-y divide-border/20">
                  {[
                    "KAIRO_API_KEY=sk-your-api-key",
                    "KAIRO_PROVIDER=anthropic",
                    "KAIRO_MODEL=claude-sonnet-4",
                    "KAIRO_TEMPERATURE=0.3",
                  ].map((line) => (
                    <div
                      key={line}
                      className="px-4 py-2.5 font-mono text-sm text-emerald-400/80"
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </article>
        </DocsLayout>
      </main>
      <Footer />
    </>
  );
}
