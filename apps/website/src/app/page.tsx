import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import InteractiveTerminal from "@/components/interactive-terminal";
import WorkflowDemo from "@/components/workflow-demo";
import ArchitectureDiagram from "@/components/architecture-diagram";
import BentoFeatures from "@/components/bento-features";
import FutureVision from "@/components/future-vision";
import OpenSourceSection from "@/components/open-source-section";
import CTASection from "@/components/cta-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <InteractiveTerminal />
        <WorkflowDemo />
        <ArchitectureDiagram />
        <BentoFeatures />
        <FutureVision />
        <OpenSourceSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
