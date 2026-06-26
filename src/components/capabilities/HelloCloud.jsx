import React from "react";

// Multilingual "Hello" word-cloud, centered big word with smaller greetings scattered around.
const WORDS = [
  { text: "你好", top: "14%", left: "30%", size: 15 },
  { text: "Bonjour", top: "20%", left: "62%", size: 17 },
  { text: "Xin chào", top: "32%", left: "74%", size: 14 },
  { text: "Hola", top: "34%", left: "42%", size: 14 },
  { text: "Hujambo", top: "44%", left: "16%", size: 14 },
  { text: "Olá", top: "58%", left: "76%", size: 14 },
  { text: "Ciao", top: "68%", left: "40%", size: 15 },
  { text: "Merhaba", top: "76%", left: "64%", size: 14 },
  { text: "Hallo", top: "80%", left: "20%", size: 14 },
  { text: "Halo", top: "86%", left: "46%", size: 14 },
];

export default function HelloCloud() {
  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "100%",
      minHeight: "200px",
      background: "#FFFFFF",
      borderRadius: "14px",
      overflow: "hidden",
    }}>
      {WORDS.map((w, i) => (
        <span key={i} style={{
          position: "absolute",
          top: w.top,
          left: w.left,
          transform: "translate(-50%, -50%)",
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          fontSize: `${w.size}px`,
          color: "#C8C4BD",
          whiteSpace: "nowrap",
        }}>
          {w.text}
        </span>
      ))}
      <span style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontFamily: "Inter, sans-serif",
        fontWeight: 600,
        fontSize: "clamp(28px, 6vw, 40px)",
        color: "#0D0D0D",
        letterSpacing: "-0.03em",
      }}>
        Hello
      </span>
    </div>
  );
}