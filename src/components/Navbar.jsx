import React, { useState } from "react";

const LANGUAGES = ["EN", "FR", "עב"];

export default function Navbar() {
  const [activeLang, setActiveLang] = useState("EN");

  return (
    <nav
      style={{
        position: "sticky",
        top: "20px",
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
        padding: "0 16px",
      }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          backgroundColor: "#1A1A1A",
          borderRadius: "9999px",
          padding: "10px 24px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        }}>

        {/* Logo */}
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <img
            src="https://media.base44.com/images/public/6a2ab0818c0d050752d1521b/5a3f8037f_davinci__img1_re_create_this_exact_logo.svg"
            alt="AskYael"
            style={{ height: "20px", width: "auto", display: "block", filter: "brightness(0) invert(1)" }}
          />
          <span style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "15px",
            color: "#FFFFFF",
            letterSpacing: "-0.02em",
          }}>AskYael</span>
        </a>

        {/* Separator */}
        <div style={{ width: "1px", height: "18px", background: "rgba(255,255,255,0.25)" }} />

        {/* Language switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
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

        {/* CTA Button */}
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