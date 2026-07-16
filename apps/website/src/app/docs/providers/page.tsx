import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import DocsLayout from "../docs-layout";

export const metadata: Metadata = {
  title: "Providers — Kairo",
  description:
    "Configure AI providers for Kairo CLI. Set up OpenAI, Anthropic, Groq, NVIDIA, Ollama, Custom endpoints, or the Kairo Gateway — with step-by-step setup guides.",
  openGraph: {
    title: "Providers — Kairo",
    description:
      "Configure AI providers for Kairo CLI. Set up OpenAI, Anthropic, Groq, NVIDIA, Ollama, Custom endpoints, or the Kairo Gateway — with step-by-step setup guides.",
    images: "/opengraph-image.png",
  },
};

interface Provider {
  id: string;
  name: string;
  description: string;
  models: string[];
  apiKeyEnv: string;
  setup: string[];
  icon: string;
}

const PROVIDERS: Provider[] = [
  {
    id: "openai",
    name: "OpenAI",
    description: "GPT-4o, o-series, and more from OpenAI.",
    models: ["gpt-4o", "gpt-4o-mini", "o3", "o4-mini"],
    apiKeyEnv: "OPENAI_API_KEY",
    setup: [
      "Get your API key from platform.openai.com",
      "Run kairo setup and select option 1 (OpenAI)",
      "Enter your API key when prompted",
    ],
    icon: "OpenAI",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    description: "Claude models from Anthropic for advanced reasoning.",
    models: ["claude-sonnet-4-5", "claude-opus-4", "claude-haiku-4", "claude-sonnet-4"],
    apiKeyEnv: "ANTHROPIC_API_KEY",
    setup: [
      "Get your API key from console.anthropic.com",
      "Run kairo setup and select option 2 (Anthropic)",
      "Enter your API key when prompted",
    ],
    icon: "Anthropic",
  },
  {
    id: "groq",
    name: "Groq",
    description: "Fast inference with Llama, Mixtral, and more via Groq.",
    models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"],
    apiKeyEnv: "GROQ_API_KEY",
    setup: [
      "Get your API key from console.groq.com",
      "Run kairo setup and select option 3 (Groq)",
      "Enter your Groq API key when prompted",
    ],
    icon: "Groq",
  },
  {
    id: "nvidia",
    name: "NVIDIA",
    description: "NVIDIA NIM microservices for accelerated AI inference.",
    models: ["meta/llama-3.3-70b-instruct", "meta/llama-3.1-405b-instruct", "mistralai/mistral-7b-instruct-v0.3"],
    apiKeyEnv: "NVIDIA_API_KEY",
    setup: [
      "Get your API key from build.nvidia.com",
      "Run kairo setup and select option 4 (NVIDIA)",
      "Enter your NVIDIA API key when prompted",
    ],
    icon: "NVIDIA",
  },
  {
    id: "ollama",
    name: "Ollama (Local)",
    description: "Run models locally on your machine with Ollama.",
    models: ["llama3.2", "llama3.1", "mistral", "codellama", "phi-4"],
    apiKeyEnv: "None (local)",
    setup: [
      "Install Ollama from ollama.ai",
      "Pull a model: ollama pull llama3.2",
      "Run kairo setup and select option 5 (Ollama)",
      "Select your model when prompted",
    ],
    icon: "Local",
  },
  {
    id: "custom",
    name: "Custom Endpoint",
    description: "Connect to any OpenAI-compatible API endpoint.",
    models: ["User-defined"],
    apiKeyEnv: "User-provided",
    setup: [
      "Run kairo setup and select option 6 (Custom)",
      "Enter the base URL of your OpenAI-compatible API",
      "Enter your API key and model name when prompted",
    ],
    icon: "Custom",
  },
  {
    id: "kairo-gateway",
    name: "Kairo Gateway",
    description: "Use Kairo's free AI gateway — no API key required.",
    models: ["Gateway-configured"],
    apiKeyEnv: "None (fetched from gateway)",
    setup: [
      "Log in to your Kairo account: kairo login",
      "Run kairo setup and select option 7 (Kairo Gateway)",
      "Provider credentials are fetched automatically from the website",
    ],
    icon: "Gateway",
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
                          className="rounded-lg bg-cyan-500/10 px-2.5 py-1 font-mono text-xs text-cyan-500 dark:text-cyan-400"
                        >
                          {model}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* API Key */}
                  <div className="mt-4">
                    <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                      API Key
                    </div>
                    <code className="rounded bg-muted px-2 py-1 font-mono text-xs text-foreground">
                      {provider.apiKeyEnv}
                    </code>
                  </div>

                  {/* Setup */}
                  <div className="mt-4">
                    <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                      Setup
                    </div>
                    <div className="space-y-2">
                      {provider.setup.map((step, i) => (
                        <div
                          key={step}
                          className="flex items-start gap-3 text-sm"
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-[10px] font-medium text-cyan-500 dark:text-cyan-400">
                            {i + 1}
                          </span>
                          {step.startsWith("kairo") || step.startsWith("Run") || step.startsWith("Pull") || step.startsWith("Install") ? (
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
              <div className="rounded-xl border border-cyan-500/10 bg-cyan-500/5 p-5">
                <h3 className="text-sm font-semibold text-cyan-400">
                  Switching Providers
                </h3>
                <p className="mt-2 text-sm text-cyan-400/80">
                  You can switch providers at any time by running <code className="rounded bg-violet-500/10 px-1.5 py-0.5 font-mono text-xs">kairo setup</code>.
                  Kairo will use the new provider for all subsequent commands. Previous conversations
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
