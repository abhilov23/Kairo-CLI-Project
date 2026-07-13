import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CTASection from "@/components/cta-section";
import AboutContent from "./about-content";

export const metadata: Metadata = {
  title: "About — Kairo",
  description:
    "The story behind Kairo — the AI-powered terminal tool built for developers, by developers. Learn about our mission, values, and the team.",
  openGraph: {
    title: "About — Kairo",
    description:
      "The story behind Kairo — the AI-powered terminal tool built for developers, by developers. Learn about our mission, values, and the team.",
    images: "/opengraph-image.png",
  },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <AboutContent />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
