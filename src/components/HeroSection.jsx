import React from "react";

export default function HeroSection() {
  return (
    <section className="hero-section min-h-screen flex items-center justify-center">
      <div className="hero-content w-full max-w-[1440px] mx-auto px-6 md:px-10 py-32 flex flex-col items-center text-center">

        {/* Headline */}
        <h1
          className="font-bold text-[#0E1B18] leading-[1.1] tracking-tight max-w-4xl"
          style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
        >
          Your clinic never misses a call again.
        </h1>

        {/* Subline */}
        <p
          className="mt-6 text-[#5C6B68] leading-[1.65] max-w-2xl"
          style={{ fontSize: "clamp(1rem, 1.8vw, 1.25rem)" }}
        >
          Yael answers every call in Hebrew, French, or English. Books appointments. Registers new patients. Handles emergencies. 24/7 — your front desk without a desk.
        </p>

        {/* CTA */}
        <a
          href="#book-demo"
          className="mt-10 inline-flex items-center justify-center rounded-full bg-[#00C49A] text-[#003D30] font-bold text-[16px] tracking-[0.5px] px-9 min-h-[52px] transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C49A] focus-visible:ring-offset-2"
        >
          Book a Free Demo
        </a>

        {/* Proof line */}
        <p
          className="mt-5 text-[#5C6B68]/70 italic text-[13px] tracking-wide"
          style={{ fontFamily: "'Fragment Mono', 'Courier New', ui-monospace, monospace" }}
        >
          Live at Les Experts Netanya · 0 missed calls since deployment
        </p>

      </div>
    </section>
  );
}