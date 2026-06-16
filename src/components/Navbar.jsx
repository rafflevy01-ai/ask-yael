import React, { useState } from "react";

const LANGUAGES = ["EN", "FR", "עב"];

export default function Navbar() {
  const [activeLang, setActiveLang] = useState("עב");

  return (
    <nav
      className="askyael-navbar"
      style={{
        position: "sticky",
        top: "20px",
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
        padding: "0 16px",
        pointerEvents: "none",
      }}>
      <div
        className="navbar-pill"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "28px",
          backgroundColor: "#73C2FB",
          borderRadius: "9999px",
          padding: "8px 28px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          pointerEvents: "auto",
          maxWidth: "100%",
        }}>

        {/* AskYael text — left */}
        <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
          <span style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "15px",
            color: "#FFFFFF",
            letterSpacing: "-0.02em",
          }}>AskYael</span>
        </a>

        {/* Language switcher — center */}
        <div className="nav-lang-switcher" style={{ display: "flex", alignItems: "center", gap: "0", flexShrink: 0 }}>
          {LANGUAGES.map((lang, i) =>
            <span key={lang} style={{ display: "flex", alignItems: "center" }}>
              <button
                onClick={() => setActiveLang(lang)}
                dir={lang === "עב" ? "rtl" : "ltr"}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: activeLang === lang ? 600 : 400,
                  fontSize: "13px",
                  color: activeLang === lang ? "#FFFFFF" : "rgba(255,255,255,0.5)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0 3px",
                  lineHeight: 1,
                  textAlign: "center",
                  transition: "color 0.15s ease",
                }}>
                {lang}
              </button>
              {i < LANGUAGES.length - 1 &&
                <span style={{ color: "rgba(255,255,255,0.2)", margin: "0 2px", fontSize: "13px" }}>|</span>
              }
            </span>
          )}
        </div>

        <style>{`
          @media (max-width: 767px) {
            .nav-lang-switcher { display: none !important; }
            .navbar-pill { gap: 14px !important; padding: 8px 18px !important; }
          }
          @supports (top: env(safe-area-inset-top)) {
            nav.askyael-navbar { top: max(20px, env(safe-area-inset-top)) !important; }
          }
        `}</style>

        {/* CTA Button — right */}
        <a
          href="#book-demo"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "13px",
            color: "#000000",
            backgroundColor: "#FFFFFF",
            borderRadius: "9999px",
            height: "32px",
            padding: "0 16px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
            border: "none",
            cursor: "pointer",
            transition: "opacity 0.15s ease",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          Book a Free Demo
        </a>
      </div>
    </nav>
  );
}