import React, { useState, useEffect, useRef } from "react";

// Apple-style vertical "Hello" word preloader. The whole strip glides upward
// continuously; the word crossing the center is highlighted, the rest fade and
// shrink toward the top and bottom — mimicking the iOS Words Preloader effect.

const GREETINGS = [
  "Hola", "Olá", "Ciao", "Bonjour", "Hello",
  "Selam", "Привет", "Hej", "你好", "Hallo",
  "Halo", "Merhaba", "Hujambo", "Xin chào", "नमस्ते",
];

const ROW_HEIGHT = 56; // px per word
const VISIBLE = 5; // odd — center row is highlighted
const STEP_MS = 1600; // time to advance one word

export default function HelloWords() {
  const [progress, setProgress] = useState(0); // continuous, in "rows"
  const rafRef = useRef();
  const startRef = useRef();

  useEffect(() => {
    const tick = (now) => {
      if (startRef.current == null) startRef.current = now;
      const elapsed = now - startRef.current;
      setProgress(elapsed / STEP_MS);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const half = Math.floor(VISIBLE / 2);
  const base = Math.floor(progress);
  const frac = progress - base; // 0..1 within current step

  // Render a couple extra rows above/below so words enter/exit smoothly.
  const rows = [];
  for (let row = -1; row <= VISIBLE; row++) {
    const offset = row - half; // logical slot relative to center
    const wordIndex = (base + offset + GREETINGS.length * 4) % GREETINGS.length;

    // Continuous distance from the center line (accounts for sub-row progress).
    const dist = Math.abs(offset - frac + 0); // shifts as strip glides
    const centerDist = Math.abs(offset - frac);

    const opacity = Math.max(0, 1 - centerDist * 0.42);
    const scale = Math.max(0.55, 1 - centerDist * 0.16);
    const isCenter = centerDist < 0.5;

    rows.push(
      <div
        key={`${row}-${wordIndex}`}
        style={{
          position: "absolute",
          top: `${(row - frac) * ROW_HEIGHT}px`,
          left: 0,
          right: 0,
          height: `${ROW_HEIGHT}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
          fontWeight: isCenter ? 600 : 500,
          fontSize: "30px",
          letterSpacing: "-0.02em",
          color: "#0D0D0D",
          opacity,
          transform: `scale(${scale})`,
          willChange: "top, opacity, transform",
        }}
      >
        {GREETINGS[wordIndex]}
      </div>
    );
  }

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "100%",
      minHeight: `${ROW_HEIGHT * VISIBLE}px`,
      background: "#FFFFFF",
      borderRadius: "14px",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{ position: "relative", width: "100%", height: `${ROW_HEIGHT * VISIBLE}px` }}>
        {rows}
      </div>

      {/* Top & bottom fade masks for the iOS depth look */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "30%",
        background: "linear-gradient(to bottom, #FFFFFF 0%, rgba(255,255,255,0) 100%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "30%",
        background: "linear-gradient(to top, #FFFFFF 0%, rgba(255,255,255,0) 100%)",
        pointerEvents: "none",
      }} />
    </div>
  );
}