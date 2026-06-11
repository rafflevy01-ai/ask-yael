import React from "react";

export default function HeroSection() {
  return (
    <section className="hero-section" style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center" }}>
      <div
        className="hero-content"
        style={{
          maxWidth: "1440px",
          width: "100%",
          margin: "0 auto",
          padding: "80px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}>
        
        {/* Headline */}
        <h1
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: "clamp(36px, 5vw, 48px)",
            color: "#000000",
            letterSpacing: "-0.96px",
            lineHeight: 1.08,
            margin: 0,
            maxWidth: "14ch"
          }} className="text-4xl">
          
          Your clinic never misses a call again.
        </h1>

        {/* Subline */}
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: "16px",
            color: "#777169",
            lineHeight: 1.5,
            maxWidth: "54ch",
            marginTop: "24px",
            marginBottom: 0
          }}>
          
          Yael answers every call in Hebrew, French, or English. Books appointments. Registers new patients. Handles emergencies. 24/7 — your front desk without a desk.
        </p>

        {/* CTA */}
        <div style={{ marginTop: "36px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <a
            href="#book-demo"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: "15px",
              color: "#ffffff",
              backgroundColor: "#000000",
              borderRadius: "9999px",
              height: "40px",
              padding: "0 20px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              border: "none",
              cursor: "pointer"
            }}>
            
            Book a Free Demo
          </a>

          {/* Proof line */}
          <p
            style={{
              fontFamily: "'Geist Mono', 'Courier New', ui-monospace, monospace",
              fontSize: "13px",
              color: "#a59f97",
              margin: 0
            }}>
            
            Live at Les Experts Netanya · 0 missed calls since deployment
          </p>
        </div>
      </div>
    </section>);

}