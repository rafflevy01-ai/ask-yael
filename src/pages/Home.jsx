import React, { useState } from "react";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import HearYaelSection from "@/components/HearYaelSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CapabilitiesSection from "@/components/CapabilitiesSection";
import FaqSection from "@/components/FaqSection";
import CtaSection from "@/components/CtaSection";
import VoiceDemoSection from "@/components/VoiceDemoSection";

export default function Home() {
  const [activeLang, setActiveLang] = useState("he");

  return (
    <main>
      <HeroSection activeLang={activeLang} onLangChange={setActiveLang} />
      <ProblemSection />
      <VoiceDemoSection activeLang={activeLang} onLangChange={setActiveLang} />
      <HearYaelSection />
      <HowItWorksSection />
      <CapabilitiesSection />
      <FaqSection />
      <CtaSection />
    </main>
  );
}