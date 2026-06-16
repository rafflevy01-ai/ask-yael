import React, { useState, useEffect } from "react";

const LANGUAGES = ["EN", "FR", "עב"];

export default function Navbar() {
  const [activeLang, setActiveLang] = useState("עב");
  const [overHero, setOverHero] = useState(true);

  useEffect(() => {
    const hero = document.querySelector("[data-hero-section]");
    if (!hero) return;
    const obs = new IntersectionObserver(
      ([entry]) => setOverHero(entry.isIntersecting),
      { threshold: 0.15 }
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  const textColor    = overHero ? "#FFFFFF"                  : "#0D0D0D";
  const subColor     = overHero ? "rgba(255,255,255,0.5)"    : "#B8B1A8";
  const divColor     = overHero ? "rgba(255,255,255,0.18)"   : "#E5E5E5";
  const navBg        = overHero ? "transparent"              : "rgba(253,252,252,0.92)";
  const btnBg        = overHero ? "rgba(255,255,255,0.14)"   : "#000000";
  const btnBorder    = overHero ? "rgba(255,255,255,0.22)"   : "transparent";

  return (
    <nav
      className="askyael-navbar"
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
        backdropFilter: overHero ? "none" : "blur(16px)",
        WebkitBackdropFilter: overHero ? "none" : "blur(16px)",
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
          letterSpacing: "-0.02em",
          color: textColor,
          transition: "color 0.3s ease",
        }}>
          <span style={{ fontWeight: 400 }}>Ask</span>
          <span style={{ fontWeight: 700 }}>Yael</span>
        </span>
      </a>

      {/* Center — language switcher */}
      <div className="nav-lang-switcher" style={{ display: "flex", alignItems: "center" }}>
        {LANGUAGES.map((lang, i) => (
          <span key={lang} style={{ display: "flex", alignItems: "center" }}>
            <button
              onClick={() => setActiveLang(lang)}
              dir={lang === "עב" ? "rtl" : "ltr"}
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: activeLang === lang ? 500 : 400,
                fontSize: "13px",
                color: activeLang === lang ? textColor : subColor,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0 4px",
                lineHeight: 1,
                transition: "color 0.3s ease",
              }}
            >
              {lang}
            </button>
            {i < LANGUAGES.length - 1 && (
              <span style={{ color: divColor, margin: "0 2px", fontSize: "12px", transition: "color 0.3s ease" }}>|</span>
            )}
          </span>
        ))}
      </div>

      {/* Right — CTA */}
      <a
        href="#book-demo"
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          fontSize: "13px",
          color: "#FFFFFF",
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
        Book a Free Demo
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
