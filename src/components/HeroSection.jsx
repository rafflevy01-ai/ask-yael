import React, { useState, useEffect, useRef } from "react";
import BrandLogo from "./BrandLogo";

const PHRASES = [
  "never misses a call.",
  "books every appointment.",
  "runs without a front desk.",
];

const CHAR_SPEED = 45;   // ms per character typed
const HOLD_MS   = 1800;  // ms to hold after fully typed
const ERASE_SPEED = 28;  // ms per character erased

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
      className="hero-section"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        width: "100%",
        backgroundColor: "transparent",
      }}>

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
          <BrandLogo color="#000000" />
        </div>

        {/* Headline */}
        <h1
          className="hero-headline"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(2rem, 5vw, 4rem)",
            color: "#000000",
            letterSpacing: "-0.96px",
            lineHeight: 1.15,
            margin: 0,
            display: "block",

          }}>
          <span style={{ display: "block" }}>Meet Yael.</span>
          <span style={{ display: "block" }}>Your front desk on autopilot.</span>
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
              backgroundColor: "#000000",
              borderRadius: "9999px",
              height: "40px",
              padding: "0 20px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              border: "none",
              cursor: "pointer",
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
              color: "#a59f97",
              margin: 0,
            }}>
            Live at Les Experts Netanya · 0 missed calls since deployment
          </p>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
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
            height: 36px !important;
            font-size: 14px !important;
          }
        }
      `}</style>
    </section>
  );
}