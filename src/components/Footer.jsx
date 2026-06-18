import React from "react";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid rgba(0,0,0,0.06)", padding: "56px 40px 40px" }}>
      <div style={{
        maxWidth: "1080px", margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        flexWrap: "wrap", gap: "48px",
      }}>

        {/* Logo + tagline */}
        <div style={{ minWidth: "160px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "18px",
            letterSpacing: "-0.04em",
            color: "#0D0D0D",
          }}>
            <span style={{ fontWeight: 400 }}>Ask</span>
            <span style={{ fontWeight: 700 }}>Yael</span>
          </span>
          <span style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: "12px",
            color: "#888888",
            lineHeight: 1.6,
          }}>
            AI voice receptionist for clinics.
          </span>
        </div>

        {/* Contact */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "11px",
            color: "#B0B0B0",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}>
            Contact
          </span>
          <a href="tel:+972533382900" style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: "13px",
            color: "#555555",
            textDecoration: "none",
          }}>
            +972 53-338-2900
          </a>
          <a href="mailto:AskYael@gmail.com" style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: "13px",
            color: "#555555",
            textDecoration: "none",
          }}>
            AskYael@gmail.com
          </a>
        </div>

        {/* Social */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "11px",
            color: "#B0B0B0",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}>
            Social
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: "13px",
              color: "#555555",
              textDecoration: "none",
            }}>
              LinkedIn
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: "13px",
              color: "#555555",
              textDecoration: "none",
            }}>
              Facebook
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: "13px",
              color: "#555555",
              textDecoration: "none",
            }}>
              Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        maxWidth: "1080px", margin: "40px auto 0",
        paddingTop: "20px",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        display: "flex", justifyContent: "space-between",
        fontFamily: "Inter, sans-serif",
        fontSize: "11px",
        color: "#B0B0B0",
      }}>
        <span>&copy; {new Date().getFullYear()} AskYael</span>
        <span>All rights reserved</span>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer { padding: 40px 20px !important; }
          footer > div { gap: 32px !important; flex-direction: column !important; align-items: center !important; text-align: center !important; }
        }
      `}</style>
    </footer>
  );
}