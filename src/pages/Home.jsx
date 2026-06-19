import React from "react";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SalaryCostSection from "@/components/SalaryCostSection";
import HearYaelSection from "@/components/HearYaelSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import MultiLingualSection from "@/components/MultiLingualSection";
import CapabilitiesSection from "@/components/CapabilitiesSection";
import FaqSection from "@/components/FaqSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ProblemSection />
      <SalaryCostSection />
      <HearYaelSection />
      <HowItWorksSection />
      <MultiLingualSection />
      <CapabilitiesSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </main>
  );
}