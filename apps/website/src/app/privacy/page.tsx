import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "Privacy Policy — Kairo",
  description: "Privacy policy for Kairo CLI.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHeader title="Privacy Policy" description="How Kairo handles your data." />
        <section className="pb-20 sm:pb-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Data Collection</h2>
                <p>
                  Kairo CLI runs locally on your machine. Your code and conversations
                  are processed by the AI provider you configure (OpenAI, Anthropic, etc.).
                  Kairo does not collect telemetry, usage data, or personally identifiable
                  information by default.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <h2 className="text-lg font-semibold text-foreground">API Keys</h2>
                <p>
                  API keys are stored locally in your configuration file
                  (~/.terminal-agent/config.json). They are never sent to Kairo servers
                  unless you use the website gateway feature, in which case they are
                  transmitted securely and not stored.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Website Data</h2>
                <p>
                  When you create an account on the Kairo website, we store your email,
                  profile information, and session metadata (provider, model, token usage).
                  This data is used solely to provide the dashboard and sync features.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
