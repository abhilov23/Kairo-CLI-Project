import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import DocsLayout from "../docs-layout";

export const metadata: Metadata = {
  title: "Providers — Kairo",
  description:
    "Configure AI providers for Kairo CLI. Set up OpenAI, Anthropic, Google Gemini, or local models via Ollama — with step-by-step setup guides.",
  openGraph: {
    title: "Providers — Kairo",
    description:
      "Configure AI providers for Kairo CLI. Set up OpenAI, Anthropic, Google Gemini, or local models via Ollama — with step-by-step setup guides.",
    images: "/opengraph-image.png",
  },
};

interface Provider {
  id: string;
  name: string;
  description: string;
  models: string[];
  setup: string[];
  icon: string;
}

const PROVIDERS: Provider[] = [
  {
    id: "openai",
    name: "OpenAI",
    description: "GPT-4o, o-series, and more from OpenAI.",
    models: ["gpt-4o", "gpt-4o-mini", "o3", "o4-mini"],
    setup: [
      "Get your API key from platform.openai.com",
      "kairo config set provider openai",
      "kairo config set api_key sk-...",
    ],
    icon: "OpenAI",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    description: "Claude models from Anthropic for advanced reasoning.",
    models: ["claude-sonnet-4", "claude-opus-4", "claude-haiku-4"],
    setup: [
      "Get your API key from console.anthropic.com",
      "kairo config set provider anthropic",
      "kairo config set api_key sk-ant-...",
    ],
    icon: "Anthropic",
  },
  {
    id: "google",
    name: "Google",
    description: "Gemini models from Google AI.",
    models: ["gemini-2.5-pro", "gemini-2.5-flash"],
    setup: [
      "Get your API key from aistudio.google.com",
      "kairo config set provider google",
      "kairo config set api_key AIza...",
    ],
    icon: "Google",
  },
  {
    id: "local",
    name: "Local Models",
    description: "Run models locally via Ollama or LM Studio.",
    models: ["llama-3", "mistral", "codellama", "phi-4"],
    setup: [
      "Install Ollama (ollama.ai) or LM Studio",
      "ollama pull llama3",
      "kairo config set provider local",
      "kairo config set model llama3",
    ],
    icon: "Local",
  },
];

export default function ProvidersPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <DocsLayout>
          <article>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Providers
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Kairo works with multiple AI providers. Choose the one that fits
              your needs and budget.
            </p>

            {/* Provider cards */}
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {PROVIDERS.map((provider) => (
                <section
                  key={provider.id}
                  id={provider.id}
                  className="rounded-2xl border border-border/40 bg-card/30 p-6 transition-colors hover:border-muted-foreground/20"
                >
                  {/* Provider header */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background text-xs font-semibold tracking-tight text-foreground">
                      {provider.icon.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-foreground">
                        {provider.name}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {provider.description}
                      </p>
                    </div>
                  </div>

                  {/* Available Models */}
                  <div className="mt-5">
                    <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                      Available Models
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {provider.models.map((model) => (
                        <span
                          key={model}
                          className="rounded-lg bg-violet-500/10 px-2.5 py-1 font-mono text-xs text-violet-500 dark:text-violet-400"
                        >
                          {model}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Setup */}
                  <div className="mt-5">
                    <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                      Setup
                    </div>
                    <div className="space-y-2">
                      {provider.setup.map((step, i) => (
                        <div
                          key={step}
                          className="flex items-start gap-3 text-sm"
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-[10px] font-medium text-violet-500 dark:text-violet-400">
                            {i + 1}
                          </span>
                          {step.startsWith("kairo") || step.startsWith("ollama") ? (
                            <code className="rounded bg-[#0d1117] px-2 py-0.5 font-mono text-xs text-emerald-400/90">
                              $ {step}
                            </code>
                          ) : (
                            <span className="text-muted-foreground text-xs leading-relaxed">{step}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              ))}
            </div>

            {/* Switching Providers notice */}
            <section className="mt-8 mb-16">
              <div className="rounded-xl border border-violet-500/10 bg-violet-500/5 p-5">
                <h3 className="text-sm font-semibold text-violet-400">
                  Switching Providers
                </h3>
                <p className="mt-2 text-sm text-violet-400/80">
                  You can switch providers at any time. Kairo will use the new
                  provider for all subsequent commands. Previous conversations
                  are preserved.
                </p>
              </div>
            </section>
          </article>
        </DocsLayout>
      </main>
      <Footer />
    </>
  );
}
