import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import DocsLayout from "../docs-layout";

export const metadata: Metadata = {
  title: "Configuration — Kairo",
  description:
    "Configure Kairo CLI using the setup wizard. Set providers, models, API keys, and environment variables.",
  openGraph: {
    title: "Configuration — Kairo",
    description:
      "Configure Kairo CLI using the setup wizard. Set providers, models, API keys, and environment variables.",
    images: "/opengraph-image.png",
  },
};

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
              Configure Kairo through the interactive setup wizard or environment variables.
            </p>

            {/* Setup Wizard */}
            <section id="quick-reference" className="mt-10">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Setup Wizard
              </h2>
              <p className="mt-3 text-muted-foreground">
                The recommended way to configure Kairo is through the interactive setup wizard:
              </p>
              <div className="mt-4 overflow-hidden rounded-xl border border-border/50 bg-[#0d1117] shadow-sm">
                <div className="flex items-center gap-2 border-b border-white/5 bg-[#161b22] px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                  </div>
                  <span className="ml-auto text-[10px] text-white/30 font-mono">terminal</span>
                </div>
                <div className="p-4 font-mono text-sm leading-relaxed">
                  <div><span className="text-white/30">$ </span><span className="text-white/90">kairo setup</span></div>
                  <div className="text-white/50 mt-1">{'\u250C\u2500 Kairo Setup \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500'} </div>
                  <div className="text-white/50">  Select AI Provider:</div>
                  <div className="text-white/50">    <span className="text-emerald-400">1.</span> OpenAI</div>
                  <div className="text-white/50">    <span className="text-emerald-400">2.</span> Anthropic</div>
                  <div className="text-white/50">    <span className="text-emerald-400">3.</span> Groq</div>
                  <div className="text-white/50">    <span className="text-emerald-400">4.</span> NVIDIA</div>
                  <div className="text-white/50">    <span className="text-emerald-400">5.</span> Ollama (local)</div>
                  <div className="text-white/50">    <span className="text-emerald-400">6.</span> Custom</div>
                  <div className="text-white/50">    <span className="text-emerald-400">7.</span> Kairo Gateway</div>
                  <div className="text-white/30 mt-1">{'\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500'}</div>
                  <div className="text-emerald-400/70 mt-1">{'\u2713'} Provider set to: openai</div>
                  <div><span className="text-white/30">$ </span><span className="text-white/50">Enter model (default: gpt-4o): </span><span className="animate-pulse text-emerald-400/70">{'\u258C'}</span></div>
                </div>
              </div>
            </section>

            {/* Usage */}
            <section id="usage" className="mt-12">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Configuration File
              </h2>
              <p className="mt-3 text-muted-foreground">
                Configuration is stored in <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">~/.terminal-agent/config.json</code>.
                Kairo manages this file automatically through <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">kairo setup</code>.
              </p>
              <div className="mt-4 overflow-hidden rounded-xl border border-border/50 bg-[#0d1117] shadow-sm">
                <div className="flex items-center gap-2 border-b border-white/5 bg-[#161b22] px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                  </div>
                  <span className="ml-auto text-[10px] text-white/30 font-mono">~/.terminal-agent/config.json</span>
                </div>
                <div className="p-4 font-mono text-sm leading-relaxed text-emerald-400/80">
                  <div><span className="text-white/50">{'{'}</span></div>
                  <div className="pl-4"><span className="text-cyan-400/80">"provider"</span>: <span className="text-amber-400/80">"openai"</span>,</div>
                  <div className="pl-4"><span className="text-cyan-400/80">"model"</span>: <span className="text-amber-400/80">"gpt-4o"</span>,</div>
                  <div className="pl-4"><span className="text-cyan-400/80">"apiKey"</span>: <span className="text-amber-400/80">"sk-..."</span>,</div>
                  <div className="pl-4"><span className="text-cyan-400/80">"baseUrl"</span>: <span className="text-amber-400/80">"https://api.openai.com/v1"</span>,</div>
                  <div><span className="text-white/50">{'}'}</span></div>
                </div>
              </div>
            </section>

            {/* Environment Variables */}
            <section id="environment" className="mt-12 mb-16">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Environment Variables
              </h2>
              <p className="mt-3 text-muted-foreground">
                API keys can also be set via environment variables. These take
                precedence over config file values.
              </p>
              <div className="mt-4 overflow-hidden rounded-xl border border-border/40">
                <div className="px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground bg-muted/50">
                  Provider API Keys
                </div>
                <div className="divide-y divide-border/20">
                  {[
                    ["OPENAI_API_KEY", "sk-...", "OpenAI"],
                    ["ANTHROPIC_API_KEY", "sk-ant-...", "Anthropic"],
                    ["GROQ_API_KEY", "gsk_...", "Groq"],
                    ["NVIDIA_API_KEY", "nvapi-...", "NVIDIA"],
                  ].map(([key, example, provider]) => (
                    <div key={key} className="flex items-center gap-4 px-4 py-2.5">
                      <code className="rounded bg-cyan-500/10 px-1.5 py-0.5 font-mono text-xs text-cyan-500 dark:text-cyan-400">
                        {key}
                      </code>
                      <span className="font-mono text-xs text-emerald-400/60">{example}</span>
                      <span className="ml-auto text-[11px] text-muted-foreground">{provider}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-amber-500/10 bg-amber-500/5 p-4">
                <p className="text-sm text-amber-400/90">
                  <strong>Note:</strong> Ollama and Kairo Gateway do not require environment variable API keys.
                  Ollama runs locally, and Gateway credentials are fetched from the Kairo website when logged in.
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
