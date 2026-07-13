import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CTASection from "@/components/cta-section";
import FeaturesContent from "./features-content";

export const metadata: Metadata = {
  title: "Features — Kairo",
  description:
    "Explore all features of Kairo CLI — terminal-native AI, multiple providers, Git integration, session awareness, and more.",
  openGraph: {
    title: "Features — Kairo",
    description:
      "Explore all features of Kairo CLI — terminal-native AI, multiple providers, Git integration, session awareness, and more.",
    images: "/opengraph-image.png",
  },
};

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <FeaturesContent />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
