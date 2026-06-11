import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

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


const orbs = [
  { width: 600, height: 600, color: "rgba(4,71,255,0.10)", top: "-15%", left: "-10%", duration: 14, x: [0, 50, 20, 0], y: [0, 30, -20, 0] },
  { width: 450, height: 450, color: "rgba(255,71,4,0.08)", bottom: "-10%", right: "-8%", duration: 11, x: [0, -40, -10, 0], y: [0, -30, 20, 0] },
  { width: 300, height: 300, color: "rgba(100,200,150,0.07)", top: "40%", left: "60%", duration: 17, x: [0, 30, -20, 0], y: [0, -40, 10, 0] },
  { width: 250, height: 250, color: "rgba(200,100,255,0.06)", top: "20%", right: "15%", duration: 13, x: [0, -20, 30, 0], y: [0, 25, -15, 0] },
];

export default function HeroSection() {
  const typed = useTypewriter(PHRASES);

  return (
    <section
      className="hero-section"
      style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        width: "100%",
        backgroundColor: "#fdfcfc",
      }}>

      {/* Animated background orbs */}
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            width: orb.width,
            height: orb.height,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            top: orb.top,
            left: orb.left,
            bottom: orb.bottom,
            right: orb.right,
            pointerEvents: "none",
            zIndex: 0,
          }}
          animate={{ x: orb.x, y: orb.y }}
          transition={{ duration: orb.duration, repeat: Infinity, ease: "easeInOut", repeatType: "loop" }}
        />
      ))}

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

        {/* Headline */}
        <h1
          className="hero-headline"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: "clamp(2rem, 5vw, 4rem)",
            color: "#000000",
            letterSpacing: "-0.96px",
            lineHeight: 1.15,
            margin: 0,
            display: "block",

          }}>
          <span style={{ display: "block" }}>Meet Yael,</span>
          <span style={{ display: "block" }}>your front desk on autopilot.</span>
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
        @media (max-width: 768px) {
          .hero-content {
            padding: 60px 24px !important;
            align-items: center !important;
            text-align: center !important;
          }
          .hero-content > div {
            align-items: center !important;
          }
          .hero-content a[href="#book-demo"] {
            height: 36px !important;
          }
        }
      `}</style>
    </section>
  );
}