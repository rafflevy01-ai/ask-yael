import React from "react";

const LANGS = {
  he: { flag: "🇮🇱", label: "עברית" },
  en: { flag: "🇬🇧", label: "English" },
  fr: { flag: "🇫🇷", label: "Français" },
};

export default function MultiLingualCard() {
  return (
    <div className="ps-card" style={{ background: "linear-gradient(180deg, #6F9CFF 0%, #4E80FF 50%, #356BFA 100%)" }}>
      <div className="ps-card-top">
        <span className="ps-card-label" style={{ color: "rgba(255,255,255,0.8)" }}>Multi Lingual</span>
        <div style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: "clamp(1.8rem,4vw,2.6rem)", color: "#FFFFFF", letterSpacing: "-0.05em", lineHeight: 1, marginBottom: "6px" }}>
          Three languages.
        </div>
        <p style={{ fontFamily: "Inter,sans-serif", fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.8)", margin: 0 }}>
          Hebrew, English &amp; French — detected automatically
        </p>
      </div>

      {/* Centered iOS-style picker */}
      <div className="ps-card-visual" style={{ padding: "0 28px 28px", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: "100%", maxWidth: "270px" }}>
          {/* Selected language */}
          <div style={{
            background: "rgba(255,255,255,0.96)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            borderRadius: "14px", padding: "14px 16px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            boxShadow: "0 2px 12px rgba(16,43,107,0.12), 0 0 0 0.5px rgba(16,43,107,0.06)", marginBottom: "9px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
              <span style={{ fontSize: "19px", lineHeight: 1 }}>{LANGS.he.flag}</span>
              <span style={{ fontFamily: "Inter,sans-serif", fontSize: "15px", fontWeight: 500, color: "#0D0D0D" }}>{LANGS.he.label}</span>
            </div>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </div>

          {/* Dropdown */}
          <div style={{
            background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            borderRadius: "14px", padding: "5px",
            boxShadow: "0 4px 18px rgba(16,43,107,0.14), 0 0 0 0.5px rgba(16,43,107,0.05)",
          }}>
            {["en", "fr"].map((key) => (
              <div key={key} style={{
                display: "flex", alignItems: "center", gap: "11px",
                padding: "11px 13px", borderRadius: "10px",
              }}>
                <span style={{ fontSize: "19px", lineHeight: 1 }}>{LANGS[key].flag}</span>
                <span style={{ fontFamily: "Inter,sans-serif", fontSize: "15px", fontWeight: 500, color: "#0D0D0D" }}>{LANGS[key].label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}