import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "he", label: "עב" },
];

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const [overHero, setOverHero] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.querySelector("[data-hero-section]");
      if (!hero) return;
      const heroBottom = hero.offsetTop + hero.offsetHeight;
      setOverHero(window.scrollY < heroBottom - 64);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const textColor    = overHero ? "#FFFFFF"                  : "#0D0D0D";
  const subColor     = overHero ? "rgba(255,255,255,0.5)"    : "#6B6B6B";
  const divColor     = overHero ? "rgba(255,255,255,0.18)"   : "#E5E5E5";
  const navBg        = overHero ? "transparent" : "#FFFFFF";
  const btnBg        = overHero ? "rgba(255,255,255,0.14)" : "#0D0D0D";
  const btnColor     = overHero ? "#FFFFFF" : "#FFFFFF";
  const btnBorder    = overHero ? "rgba(255,255,255,0.22)" : "transparent";

  return (
    <nav
      className="askyael-navbar"
      dir="ltr"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 48px",
        height: "64px",
        backgroundColor: navBg,
        borderBottom: overHero ? "none" : "1px solid rgba(0,0,0,0.06)",
        transition: "background-color 0.3s ease, border-color 0.3s ease",
        pointerEvents: "auto",
      }}
    >
      {/* Left — wordmark */}
      <a href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
        <span style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "16px",
          letterSpacing: "-0.04em",
          color: textColor,
          transition: "color 0.3s ease",
        }}>
          <span style={{ fontWeight: 400 }}>Ask</span>
          <span style={{ fontWeight: 700 }}>Yael</span>
        </span>
      </a>

      {/* Center — language switcher */}
      <div className="nav-lang-switcher" style={{ display: "flex", alignItems: "center" }}>
        {LANGUAGES.map(({ code, label }, i) => (
          <span key={code} style={{ display: "flex", alignItems: "center" }}>
            <button
              onClick={() => setLang(code)}
              dir={code === "he" ? "rtl" : "ltr"}
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: lang === code ? 500 : 400,
                fontSize: "13px",
                color: lang === code ? textColor : subColor,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0 4px",
                lineHeight: 1,
                transition: "color 0.3s ease",
              }}
            >
              {label}
            </button>
            {i < LANGUAGES.length - 1 && (
              <span style={{ color: divColor, margin: "0 2px", fontSize: "12px", transition: "color 0.3s ease" }}>|</span>
            )}
          </span>
        ))}
      </div>

      {/* Right — CTA */}
      <a
        href="https://calendly.com/rafflevy01/30min"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          fontSize: "13px",
          color: btnColor,
          backgroundColor: btnBg,
          border: `1px solid ${btnBorder}`,
          borderRadius: "9999px",
          height: "36px",
          padding: "0 20px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          textDecoration: "none",
          whiteSpace: "nowrap",
          flexShrink: 0,
          backdropFilter: overHero ? "blur(8px)" : "none",
          WebkitBackdropFilter: overHero ? "blur(8px)" : "none",
          transition: "background-color 0.3s ease, border-color 0.3s ease",
          cursor: "pointer",
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
      >
        {t.nav.cta}
      </a>

      <style>{`
        @media (max-width: 767px) {
          .nav-lang-switcher { display: none !important; }
          nav.askyael-navbar { padding: 0 20px !important; height: 56px !important; }
        }
        @supports (top: env(safe-area-inset-top)) {
          nav.askyael-navbar { padding-top: env(safe-area-inset-top) !important; }
        }
      `}</style>
    </nav>
  );
}