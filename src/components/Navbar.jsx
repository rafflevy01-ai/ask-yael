import React, { useState } from "react";

const LANGUAGES = ["EN", "FR", "עב"];

export default function Navbar() {
  const [activeLang, setActiveLang] = useState("עב");

  return (
    <nav
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
        style={{
          display: "flex",
          alignItems: "center",
          gap: "28px",
          backgroundColor: "#E0FFFF",
          borderRadius: "9999px",
          padding: "8px 28px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          pointerEvents: "auto",
        }}>

        {/* AskYael text — left */}
        <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
          <span style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "15px",
            color: "#0D0D0D",
            letterSpacing: "-0.02em",
          }}>AskYael</span>
        </a>

        {/* Language switcher — center */}
        <div style={{ display: "flex", alignItems: "center", gap: "0", flexShrink: 0 }}>
          {LANGUAGES.map((lang, i) =>
            <span key={lang} style={{ display: "flex", alignItems: "center" }}>
              <button
                onClick={() => setActiveLang(lang)}
                dir={lang === "עב" ? "rtl" : "ltr"}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: activeLang === lang ? 600 : 400,
                  fontSize: "13px",
                  color: activeLang === lang ? "#0D0D0D" : "rgba(0,0,0,0.4)",
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
                <span style={{ color: "rgba(0,0,0,0.15)", margin: "0 2px", fontSize: "13px" }}>|</span>
              }
            </span>
          )}
        </div>

        {/* CTA Button — right */}
        <a
          href="#book-demo"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "13px",
            color: "#FFFFFF",
            backgroundColor: "#0D0D0D",
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