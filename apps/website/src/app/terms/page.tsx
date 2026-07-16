import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "Terms of Service — Kairo",
  description: "Terms of service for Kairo CLI.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHeader title="Terms of Service" description="Terms governing the use of Kairo CLI." />
        <section className="pb-20 sm:pb-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <h2 className="text-lg font-semibold text-foreground">License</h2>
                <p>
                  Kairo CLI is open source software released under the MIT license.
                  You are free to use, modify, and distribute it in accordance with
                  the license terms.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Disclaimer</h2>
                <p>
                  Kairo CLI is provided &quot;as is&quot; without warranty of any kind.
                  The authors are not liable for any damages arising from its use.
                  AI-generated code should always be reviewed before production use.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Third-Party Services</h2>
                <p>
                  Kairo CLI integrates with third-party AI providers (OpenAI, Anthropic, etc.).
                  Your use of those services is subject to their respective terms and policies.
                  Kairo is not affiliated with these providers.
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
