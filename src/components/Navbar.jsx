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
        alignItems: "center"
      }}>
      
      <div
        style={{
          maxWidth: "1440px",
          width: "100%",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }} className="navbar-inner">
        
        {/* Logo */}
        <span
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 400,
            fontSize: "16px",
            letterSpacing: "-0.02em",
            color: "#000000"
          }}>
          AskYael
        </span>

        {/* Right cluster */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {/* Language switcher */}
          <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
            {LANGUAGES.map((lang, i) =>
            <span key={lang} style={{ display: "flex", alignItems: "center" }}>
                <button
                onClick={() => setActiveLang(lang)}
                dir={lang === "עב" ? "rtl" : "ltr"}
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
                  textAlign: "center"
                }}>
                  {lang}
                </button>
                {i < LANGUAGES.length - 1 &&
              <span style={{ color: "#00000030", margin: "0 4px", fontSize: "14px" }}>|</span>
              }
              </span>
            )}
          </div>

          {/* CTA Button */}
          <a
            href="#book-demo"
            className="navbar-cta"
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
              cursor: "pointer"
            }}>
            
            Book a Free Demo
          </a>
        </div>
      </div>
      <style>{`
        @media (min-width: 768px) {
          .navbar-inner { padding: 0 48px !important; }
        }
        @media (min-width: 768px) and (max-width: 1024px) {
          .navbar-inner { padding: 0 32px !important; }
        }
        @media (max-width: 480px) {
          .navbar-cta { display: none !important; }
          .navbar-inner { padding: 0 16px !important; }
        }
      `}</style>
    </nav>);

}