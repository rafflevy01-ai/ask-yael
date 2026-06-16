import React from "react";
import HeroSection from "@/components/HeroSection";
import ProofBar from "@/components/ProofBar";
import ProblemSection from "@/components/ProblemSection";
import HearYaelSection from "@/components/HearYaelSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CapabilitiesSection from "@/components/CapabilitiesSection";
import FaqSection from "@/components/FaqSection";
import CtaSection from "@/components/CtaSection";
import CalendlySection from "@/components/CalendlySection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ProofBar />
      <ProblemSection />
      <HearYaelSection />
      <HowItWorksSection />
      <CapabilitiesSection />
      <FaqSection />
      <CtaSection />
      <CalendlySection />
    </main>
  );
}