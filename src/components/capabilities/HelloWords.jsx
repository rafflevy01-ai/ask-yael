import React, { useState, useEffect } from "react";

// Apple-style vertical "Hello" word preloader. Greetings scroll up smoothly;
// the word in the center is fully highlighted, the others fade out toward the
// top and bottom — mimicking the iOS welcome / Words Preloader effect.

const GREETINGS = [
  "Hola", "Olá", "Ciao", "Bonjour", "Hello",
  "Selam", "Привет", "Hej", "你好", "Hallo",
  ":)Halo", "Merhaba", "Hujambo", "Xin chào", "नमस्ते",
];

const ROW_HEIGHT = 56; // px per word
const VISIBLE = 5; // odd number — center row is highlighted

export default function HelloWords() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % GREETINGS.length);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  const half = Math.floor(VISIBLE / 2);

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
        {Array.from({ length: VISIBLE }).map((_, row) => {
          const offset = row - half; // -2 .. 0 .. +2
          const wordIndex = (index + offset + GREETINGS.length * 2) % GREETINGS.length;
          const distance = Math.abs(offset);
          const isCenter = offset === 0;

          // Fade + shrink the further a row is from center.
          const opacity = isCenter ? 1 : distance === 1 ? 0.45 : 0.18;
          const scale = isCenter ? 1 : distance === 1 ? 0.78 : 0.62;

          return (
            <div
              key={`${row}-${wordIndex}`}
              style={{
                position: "absolute",
                top: `${row * ROW_HEIGHT}px`,
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
                color: isCenter ? "#0D0D0D" : "#1d1d1f",
                opacity,
                transform: `scale(${scale})`,
                transition: "opacity 0.5s ease, transform 0.5s ease, color 0.5s ease",
              }}
            >
              {GREETINGS[wordIndex].replace(":)", "")}
            </div>
          );
        })}
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