import React from "react";
import HeroSection from "@/components/HeroSection";
import ProofBar from "@/components/ProofBar";
import ProblemSection from "@/components/ProblemSection";
import HearYaelSection from "@/components/HearYaelSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CapabilitiesSection from "@/components/CapabilitiesSection";
import FaqSection from "@/components/FaqSection";
import SectionDividers, { SectionDivider } from "@/components/SectionDividers";

export default function Home() {
  return (
    <main>
      <SectionDividers />
      <HeroSection />
      <ProofBar />
      <SectionDivider />
      <ProblemSection />
      <SectionDivider />
      <HearYaelSection />
      <SectionDivider />
      <HowItWorksSection />
      <SectionDivider />
      <CapabilitiesSection />
      <SectionDivider />
      <FaqSection />
    </main>
  );
}