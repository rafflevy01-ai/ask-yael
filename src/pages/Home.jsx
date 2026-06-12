import React from "react";
import HeroSection from "@/components/HeroSection";
import ProofBar from "@/components/ProofBar";
import ProblemSection from "@/components/ProblemSection";
import HearYaelSection from "@/components/HearYaelSection";
import HowItWorksSection from "@/components/HowItWorksSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ProofBar />
      <ProblemSection />
      <HearYaelSection />
      <HowItWorksSection />
    </main>
  );
}