import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import PageHeader from "@/components/page-header";
import Footer from "@/components/footer";
import ContactForm from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the Kairo team. Report bugs, request features, ask questions, or contribute to the open-source project on GitHub.",
  openGraph: {
    title: "Contact — Kairo",
    description:
      "Get in touch with the Kairo team. Report bugs, request features, ask questions, or contribute to the open-source project on GitHub.",
    images: "/opengraph-image.png",
  },
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHeader
          title="Contact"
          description="Have a question, suggestion, or just want to say hi?"
        />

        <section className="pb-20 sm:pb-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-grid opacity-[0.02] dark:opacity-[0.03]" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-5">
              {/* Contact methods */}
              <div className="lg:col-span-2 space-y-3">
                <h2 className="text-sm font-semibold text-foreground">
                  Other ways to reach us
                </h2>
                {[
                  {
                    label: "GitHub Issues",
                    href: "https://github.com/abhilov23/Kairo-CLI-Project/issues",
                    desc: "Report bugs or request features",
                  },
                  {
                    label: "GitHub Discussions",
                    href: "https://github.com/abhilov23/Kairo-CLI-Project/discussions",
                    desc: "Ask questions and share ideas",
                  },
                  {
                    label: "npm Package",
                    href: "https://www.npmjs.com/package/@abhilov/kairo",
                    desc: "Check the latest release",
                  },
                ].map((method) => (
                  <a
                    key={method.label}
                    href={method.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl border border-border bg-card p-4 transition-colors hover:border-muted-foreground/20"
                  >
                    <h3 className="text-sm font-medium text-foreground">
                      {method.label}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {method.desc}
                    </p>
                  </a>
                ))}
              </div>

              {/* Contact form */}
              <div className="lg:col-span-3">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
