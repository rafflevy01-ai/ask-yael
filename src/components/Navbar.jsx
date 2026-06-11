import React, { useState } from "react";

const LANGUAGES = ["EN", "FR", "עב"];

export default function Navbar() {
  const [activeLang, setActiveLang] = useState("EN");

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "#fdfcfc",
        borderBottom: "1px solid #e5e5e5",
        height: "64px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          width: "100%",
          margin: "0 auto",
          padding: "0 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: "14px",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "#000000",
          }}
        >
          Ask Yael
        </span>

        {/* Right cluster */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {/* Language switcher */}
          <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
            {LANGUAGES.map((lang, i) => (
              <span key={lang} style={{ display: "flex", alignItems: "center" }}>
                <button
                  onClick={() => setActiveLang(lang)}
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: activeLang === lang ? 700 : 400,
                    fontSize: "14px",
                    color: activeLang === lang ? "#000000" : "#00000080",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0 4px",
                    lineHeight: 1,
                  }}
                >
                  {lang}
                </button>
                {i < LANGUAGES.length - 1 && (
                  <span style={{ color: "#00000030", margin: "0 4px", fontSize: "14px" }}>|</span>
                )}
              </span>
            ))}
          </div>

          {/* CTA Button */}
          <a
            href="#book-demo"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: "15px",
              color: "#ffffff",
              backgroundColor: "#000000",
              borderRadius: "9999px",
              height: "36px",
              padding: "0 16px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              whiteSpace: "nowrap",
              border: "none",
              cursor: "pointer",
            }}
          >
            Book a Free Demo
          </a>
        </div>
      </div>
    </nav>
  );
}