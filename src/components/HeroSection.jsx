import React, { useState, useEffect, useRef } from "react";
import BrandLogo from "./BrandLogo";
import InteractiveDotGrid from "./InteractiveDotGrid";

const PHRASES = [
  "never misses a call.",
  "books every appointment.",
  "runs without a front desk.",
];

const CHAR_SPEED = 45;
const HOLD_MS   = 1800;
const ERASE_SPEED = 28;

function useTypewriter(phrases) {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);
  const timeout = useRef(null);

  useEffect(() => {
    const phrase = phrases[phraseIdx];

    if (typing) {
      if (displayed.length < phrase.length) {
        timeout.current = setTimeout(() => {
          setDisplayed(phrase.slice(0, displayed.length + 1));
        }, CHAR_SPEED);
      } else {
        timeout.current = setTimeout(() => setTyping(false), HOLD_MS);
      }
    } else {
      if (displayed.length > 0) {
        timeout.current = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, ERASE_SPEED);
      } else {
        setPhraseIdx((i) => (i + 1) % phrases.length);
        setTyping(true);
      }
    }

    return () => clearTimeout(timeout.current);
  }, [displayed, typing, phraseIdx, phrases]);

  return displayed;
}


export default function HeroSection() {
  const typed = useTypewriter(PHRASES);

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        width: "100%",
        backgroundColor: "#FFFFFF",
        background: "linear-gradient(180deg, #FFFFFF 0%, #F8FBFF 40%, #F3F8FD 100%)",
      }}>

      {/* Interactive dot grid */}
      <InteractiveDotGrid />

      <div
        className="hero-content"
        style={{
          maxWidth: "680px",
          width: "100%",
          margin: "0 auto",
          padding: "80px 48px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}>

        {/* Logo */}
        <div style={{ width: "clamp(5.5rem, 12vw, 10rem)", height: "clamp(5.5rem, 12vw, 10rem)" }}>
          <BrandLogo color="#3B82F6" />
        </div>

        {/* Headline */}
        <h1
          className="hero-headline"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(2rem, 5vw, 4rem)",
            color: "#1e293b",
            letterSpacing: "-0.96px",
            lineHeight: 1.15,
            margin: 0,
            display: "block",
          }}>
          <span style={{ display: "block" }}>Meet Yael.</span>
          <span style={{ display: "block" }}>Your front desk on autopilot.</span>
        </h1>

        {/* Typewriter */}
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
            color: "#3B82F6",
            marginTop: "16px",
            height: "1.4em",
          }}>
          She {typed}
          <span
            style={{
              display: "inline-block",
              width: "2px",
              height: "1.1em",
              backgroundColor: "#3B82F6",
              marginLeft: "2px",
              verticalAlign: "text-bottom",
              animation: "blink 0.8s step-end infinite",
            }}
          />
        </div>

        {/* Subline */}
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: "16px",
            color: "#64748b",
            lineHeight: 1.6,
            maxWidth: "54ch",
            marginTop: "24px",
            marginBottom: 0,
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
              backgroundColor: "#3B82F6",
              borderRadius: "9999px",
              height: "44px",
              padding: "0 24px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 16px rgba(59,130,246,0.25)",
              transition: "box-shadow 0.2s ease, transform 0.15s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = "0 4px 24px rgba(59,130,246,0.35)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = "0 2px 16px rgba(59,130,246,0.25)";
              e.currentTarget.style.transform = "translateY(0)";
            }}>
            Book a Free Demo
          </a>

          {/* Proof line */}
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: "13px",
              color: "#94a3b8",
              margin: 0,
            }}>
            Live at Les Experts Netanya · 0 missed calls since deployment
          </p>
        </div>
      </div>

      {/* Keyframe for cursor blink */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        @media (min-width: 769px) {
          .hero-content { max-width: 900px !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .hero-content { padding: 60px 32px !important; }
        }
        @media (max-width: 768px) {
          .hero-headline {
            text-wrap: balance !important;
            font-size: clamp(1.6rem, 6vw, 2.2rem) !important;
          }
          .hero-content {
            padding: 48px 20px !important;
            align-items: center !important;
            text-align: center !important;
          }
          .hero-content > div {
            align-items: center !important;
          }
          .hero-content a[href="#book-demo"] {
            height: 40px !important;
            font-size: 14px !important;
          }
        }
      `}</style>
    </section>
  );
}