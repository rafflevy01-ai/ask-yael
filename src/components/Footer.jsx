import React from "react";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid rgba(0,0,0,0.06)", padding: "48px 40px 40px" }}>
      <div style={{ maxWidth: "1080px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "32px" }}>

        {/* Logo */}
        <div style={{ minWidth: "140px" }}>
          <span style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            letterSpacing: "-0.04em",
            color: "#0D0D0D",
          }}>
            <span style={{ fontWeight: 400 }}>Ask</span>
            <span style={{ fontWeight: 700 }}>Yael</span>
          </span>
        </div>

        {/* Contact */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "12px",
            color: "#6B6B6B",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}>
            Contact
          </span>
          <a href="tel:+972533382900" style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: "13px",
            color: "#0D0D0D",
            textDecoration: "none",
          }}>
            +972 53-338-2900
          </a>
          <a href="mailto:AskYael@gmail.com" style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: "13px",
            color: "#0D0D0D",
            textDecoration: "none",
          }}>
            AskYael@gmail.com
          </a>
        </div>

        {/* Social */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "12px",
            color: "#6B6B6B",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}>
            Follow
          </span>
          <div style={{ display: "flex", gap: "16px" }}>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: "13px",
              color: "#0D0D0D",
              textDecoration: "none",
            }}>
              LinkedIn
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: "13px",
              color: "#0D0D0D",
              textDecoration: "none",
            }}>
              Facebook
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: "13px",
              color: "#0D0D0D",
              textDecoration: "none",
            }}>
              Instagram
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer { padding: 40px 20px !important; }
        }
      `}</style>
    </footer>
  );
}