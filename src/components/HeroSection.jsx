import React, { useState } from "react";
import VoiceOrb from "./VoiceOrb";
import TabSwitcher from "./TabSwitcher";

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState("en");

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        backgroundColor: "#F7F7F5",
      }}>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 32px 0" }}>

        {/* ─── TWO-COLUMN ROW ─── */}
        <div
          style={{
            display: "flex",
            gap: "5%",
            alignItems: "flex-start",
            marginBottom: "40px",
          }}>

          {/* LEFT — headline + buttons */}
          <div style={{ flex: "0 0 55%", minWidth: 0 }}>
            <h1
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 300,
                fontSize: "clamp(1.9rem, 3.8vw, 3rem)",
                color: "#0A0A0A",
                letterSpacing: "-0.025em",
                lineHeight: 1.15,
                margin: 0,
              }}>
              Meet Yael.<br />
              Your front desk on autopilot.
            </h1>

            <div style={{ display: "flex", gap: "16px", marginTop: "28px" }}>
              <a
                href="#book-demo"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "15px",
                  color: "#FFFFFF",
                  backgroundColor: "#0A0A0A",
                  borderRadius: "999px",
                  padding: "14px 36px",
                  display: "inline-flex",
                  alignItems: "center",
                  textDecoration: "none",
                  border: "none",
                  cursor: "pointer",
                  minWidth: "200px",
                  justifyContent: "center",
                  transition: "opacity 0.15s ease",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                Book a Free Demo
              </a>

              <a
                href="#how-it-works"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "15px",
                  color: "#0A0A0A",
                  backgroundColor: "transparent",
                  borderRadius: "999px",
                  padding: "14px 36px",
                  display: "inline-flex",
                  alignItems: "center",
                  textDecoration: "none",
                  border: "1px solid #0A0A0A",
                  cursor: "pointer",
                  minWidth: "200px",
                  justifyContent: "center",
                  transition: "opacity 0.15s ease",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                See How It Works
              </a>
            </div>
          </div>

          {/* RIGHT — description */}
          <div style={{ flex: "0 0 40%", minWidth: 0, alignSelf: "flex-end" }}>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: "16px",
                color: "#555555",
                lineHeight: 1.6,
                margin: 0,
              }}>
              Yael answers every call in Hebrew, French, or English — booking appointments,
              registering new patients, and handling emergencies, 24/7, so your team never has to.
            </p>
          </div>
        </div>

        {/* ─── DEMO CARD ─── */}
        <div
          style={{
            backgroundColor: "#EEECEA",
            border: "1px solid #E0DDD9",
            borderRadius: "16px",
            padding: "36px 32px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>

          <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

          <VoiceOrb activeLang={activeTab} />

        </div>
      </div>


    </section>
  );
}