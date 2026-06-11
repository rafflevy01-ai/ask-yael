import React from "react";
import HeroSection from "@/components/HeroSection";
import ProofBar from "@/components/ProofBar";
import ProblemSection from "@/components/ProblemSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ProofBar />
      <ProblemSection />
    </main>
  );
}