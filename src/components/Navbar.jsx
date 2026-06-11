import React, { useState, useEffect } from "react";

const LANGUAGES = [
  { code: "EN", label: "Switch to English" },
  { code: "FR", label: "Switch to French" },
  { code: "עב", label: "Switch to Hebrew" },
];

export default function Navbar() {
  const [activeLang, setActiveLang] = useState("EN");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        backgroundColor: scrolled ? "rgba(255,255,255,0.8)" : "transparent",
      }}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 md:px-10 h-[72px]">
        {/* Brand */}
        <a
          href="/"
          className="text-[#0A0A0A] font-semibold tracking-[1.2px] uppercase text-[20px] leading-none select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C49A] rounded"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Ask Yael
        </a>

        {/* Right cluster */}
        <div className="flex items-center gap-6 md:gap-8">
          {/* Language switcher */}
          <div className="hidden sm:flex items-center gap-0 text-[14px] leading-[1.5]" role="group" aria-label="Language selector">
            {LANGUAGES.map((lang, i) => (
              <span key={lang.code} className="flex items-center">
                <button
                  onClick={() => setActiveLang(lang.code)}
                  aria-label={lang.label}
                  className={`transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C49A] rounded px-1 ${
                    activeLang === lang.code
                      ? "font-bold text-[#0A0A0A]"
                      : "font-medium text-[#0A0A0A]/50 hover:text-[#0A0A0A]/80"
                  }`}
                >
                  {lang.code}
                </button>
                {i < LANGUAGES.length - 1 && (
                  <span className="text-[#0A0A0A]/20 mx-1.5 select-none" aria-hidden="true">|</span>
                )}
              </span>
            ))}
          </div>

          {/* CTA */}
          <a
            href="#book-demo"
            className="inline-flex items-center justify-center rounded-full bg-[#00C49A] text-[#003D30] font-bold text-[16px] tracking-[1px] px-7 min-h-[48px] transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C49A] focus-visible:ring-offset-2"
          >
            Book a Free Demo
          </a>
        </div>
      </div>
    </nav>
  );
}