import React from "react";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#0D0D0D", padding: "56px 40px 40px", color: "#FFFFFF" }}>
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
            color: "#FFFFFF",
          }}>
            <span style={{ fontWeight: 400 }}>Ask</span>
            <span style={{ fontWeight: 700 }}>Yael</span>
          </span>
          <span style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: "12px",
            color: "rgba(255,255,255,0.45)",
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
            color: "rgba(255,255,255,0.4)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}>
            Contact
          </span>
          <a href="tel:+972533382900" style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: "13px",
            color: "rgba(255,255,255,0.75)",
            textDecoration: "none",
            transition: "color 0.15s",
          }}>
            +972 53-338-2900
          </a>
          <a href="mailto:AskYael@gmail.com" style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: "13px",
            color: "rgba(255,255,255,0.75)",
            textDecoration: "none",
            transition: "color 0.15s",
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
            color: "rgba(255,255,255,0.4)",
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
              color: "rgba(255,255,255,0.75)",
              textDecoration: "none",
            }}>
              LinkedIn
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: "13px",
              color: "rgba(255,255,255,0.75)",
              textDecoration: "none",
            }}>
              Facebook
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: "13px",
              color: "rgba(255,255,255,0.75)",
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
        borderTop: "1px solid rgba(255,255,255,0.08)",
        display: "flex", justifyContent: "space-between",
        fontFamily: "Inter, sans-serif",
        fontSize: "11px",
        color: "rgba(255,255,255,0.3)",
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