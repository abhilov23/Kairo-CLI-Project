import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "Changelog — Kairo",
  description: "Release history and changelog for Kairo CLI.",
};

const RELEASES = [
  {
    version: "v1.2.0",
    date: "July 2026",
    changes: [
      "Kairo Gateway: use Kairo-provided AI from CLI without your own API key",
      "Web chat with free gateway and custom API key modes",
      "Dashboard session detail pages with full conversation view",
      "Fixed token count accuracy by subtracting restored context baseline",
      "Session messages now stored and viewable on the website",
    ],
  },
  {
    version: "v1.1.0",
    date: "June 2026",
    changes: [
      "Added CLI login via device code flow",
      "Session sync between CLI and website dashboard",
      "Dashboard with usage tracking and session history",
      "Usage graph with daily and per-provider breakdown",
      "Profile page with avatar upload",
    ],
  },
  {
    version: "v1.0.0",
    date: "June 2026",
    changes: [
      "Initial public release",
      "Multi-provider AI support (OpenAI, Anthropic, Groq, NVIDIA, Ollama)",
      "Interactive chat mode with tool execution",
      "Task mode for non-interactive automation",
      "Git integration and code review tools",
      "Agent spawning for parallel task execution",
      "Session persistence across restarts",
      "Web dashboard with authentication",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHeader title="Changelog" description="What's new in Kairo CLI." />
        <section className="pb-20 sm:pb-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {RELEASES.map((release) => (
                <div
                  key={release.version}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">
                      {release.version}
                    </h2>
                    <span className="text-xs text-muted-foreground">
                      {release.date}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {release.changes.map((change) => (
                      <li
                        key={change}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-500/50" />
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
