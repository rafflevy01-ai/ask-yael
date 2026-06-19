import React from "react";

const LANGS = {
  he: { flag: "🇮🇱", label: "עברית" },
  en: { flag: "🇬🇧", label: "English" },
  fr: { flag: "🇫🇷", label: "Français" },
};

export default function MultiLingualCard() {
  return (
    <div className="ps-card" style={{ background: "linear-gradient(180deg, #2E6BFF 0%, #1E54E8 45%, #0F3FCB 100%)" }}>
      <div className="ps-card-top">
        <span className="ps-card-label" style={{ color: "rgba(255,255,255,0.7)" }}>Multi Lingual</span>
        <div style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: "clamp(1.8rem,4vw,2.6rem)", color: "#FFFFFF", letterSpacing: "-0.05em", lineHeight: 1, marginBottom: "8px" }}>
          Three languages.
        </div>
        <p style={{ fontFamily: "Inter,sans-serif", fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.75)", margin: 0 }}>
          Hebrew, English &amp; French — detected automatically
        </p>
      </div>

      <div className="ps-card-visual" style={{ padding: "0 28px 28px", justifyContent: "flex-end" }}>
        {/* Selected language */}
        <div style={{
          background: "#FFFFFF", borderRadius: "14px", padding: "14px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          boxShadow: "0 4px 18px rgba(0,0,0,0.18)", marginBottom: "10px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px", lineHeight: 1 }}>{LANGS.he.flag}</span>
            <span style={{ fontFamily: "Inter,sans-serif", fontSize: "16px", fontWeight: 500, color: "#0D0D0D" }}>{LANGS.he.label}</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </div>

        {/* Dropdown */}
        <div style={{
          background: "rgba(255,255,255,0.95)", borderRadius: "14px", padding: "6px",
          boxShadow: "0 8px 26px rgba(0,0,0,0.2)",
        }}>
          {["en", "fr"].map((key) => (
            <div key={key} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "12px 14px", borderRadius: "10px",
            }}>
              <span style={{ fontSize: "20px", lineHeight: 1 }}>{LANGS[key].flag}</span>
              <span style={{ fontFamily: "Inter,sans-serif", fontSize: "16px", fontWeight: 500, color: "#0D0D0D" }}>{LANGS[key].label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}