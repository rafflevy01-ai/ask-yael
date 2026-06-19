import React from "react";

const FLAGS = {
  he: "🇮🇱",
  en: "🇬🇧",
  fr: "🇫🇷",
};

const LANGS = {
  he: { flag: FLAGS.he, label: "עברית" },
  en: { flag: FLAGS.en, label: "English" },
  fr: { flag: FLAGS.fr, label: "Français" },
};

function LanguageSwitcher() {
  return (
    <div style={{ width: "100%", maxWidth: "320px", margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      {/* Selected language */}
      <div style={{
        background: "#FFFFFF",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: "16px",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 4px 20px rgba(13,71,255,0.12)",
        marginBottom: "10px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "22px", lineHeight: 1 }}>{LANGS.he.flag}</span>
          <span style={{ fontSize: "18px", fontWeight: 500, color: "#0D0D0D" }}>{LANGS.he.label}</span>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </div>

      {/* Dropdown */}
      <div style={{
        background: "#FFFFFF",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: "16px",
        padding: "8px",
        boxShadow: "0 8px 30px rgba(13,71,255,0.14)",
      }}>
        {["en", "fr"].map((key) => (
          <div key={key} style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "13px 14px",
            borderRadius: "11px",
          }}>
            <span style={{ fontSize: "22px", lineHeight: 1 }}>{LANGS[key].flag}</span>
            <span style={{ fontSize: "18px", fontWeight: 500, color: "#0D0D0D" }}>{LANGS[key].label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MultiLingualSection() {
  return (
    <section data-multilingual style={{
      width: "100%",
      padding: "80px 40px",
      background: "radial-gradient(120% 90% at 50% 0%, #2E6BFF 0%, #1E54E8 35%, #0F3FCB 70%, #0B33A8 100%)",
      borderTop: "1px solid rgba(0,0,0,0.06)",
    }}>
      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        gap: "clamp(40px, 6vw, 100px)",
        flexWrap: "wrap",
      }}>
        {/* LEFT — Text */}
        <div className="ml-text" style={{ flex: "1 1 360px", minWidth: 0 }}>
          <span style={{
            fontFamily: "Inter, sans-serif", fontSize: "11px", textTransform: "uppercase",
            letterSpacing: "0.12em", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "16px",
          }}>Multi Lingual</span>
          <h2 style={{
            fontFamily: "Inter, sans-serif", fontWeight: 300,
            fontSize: "clamp(2rem, 3.5vw, 2.8rem)", color: "#FFFFFF",
            letterSpacing: "-0.04em", lineHeight: 1.15, margin: "0 0 18px",
          }}>Yael speaks three languages.</h2>
          <p style={{
            fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "16px",
            color: "rgba(255,255,255,0.78)", lineHeight: 1.65, margin: 0, maxWidth: "440px",
          }}>
            Every patient is answered in Hebrew, English, or French — automatically detected from the first words they speak. No menus, no language barriers.
          </p>
        </div>

        {/* RIGHT — Switcher */}
        <div className="ml-card" style={{ flex: "1 1 320px", minWidth: 0 }}>
          <LanguageSwitcher />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          [data-multilingual] { padding: 56px 20px !important; }
          [data-multilingual] h2 { font-size: 1.8rem !important; }
        }
      `}</style>
    </section>
  );
}