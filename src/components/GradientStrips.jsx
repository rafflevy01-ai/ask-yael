import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const BAR_COLORS = [
  { from: "rgba(100, 140, 255, 0.35)", to: "rgba(100, 140, 255, 0)" },
  { from: "rgba(120, 100, 240, 0.35)", to: "rgba(120, 100, 240, 0)" },
  { from: "rgba(160, 80, 220, 0.35)", to: "rgba(160, 80, 220, 0)" },
  { from: "rgba(180, 60, 200, 0.35)", to: "rgba(180, 60, 200, 0)" },
  { from: "rgba(200, 80, 170, 0.28)", to: "rgba(200, 80, 170, 0)" },
  { from: "rgba(220, 100, 140, 0.28)", to: "rgba(220, 100, 140, 0)" },
  { from: "rgba(220, 100, 140, 0.28)", to: "rgba(220, 100, 140, 0)" },
  { from: "rgba(200, 80, 170, 0.28)", to: "rgba(200, 80, 170, 0)" },
  { from: "rgba(180, 60, 200, 0.35)", to: "rgba(180, 60, 200, 0)" },
  { from: "rgba(160, 80, 220, 0.35)", to: "rgba(160, 80, 220, 0)" },
  { from: "rgba(120, 100, 240, 0.35)", to: "rgba(120, 100, 240, 0)" },
  { from: "rgba(100, 140, 255, 0.35)", to: "rgba(100, 140, 255, 0)" },
];

// hill curve: highest in center, tapers to edges
function hillHeight(i, total) {
  const t = total - 1;
  if (t === 0) return 1;
  return Math.sin((Math.PI * i) / t);
}

// wave: two humps
function waveHeight(i, total) {
  const t = total - 1;
  if (t === 0) return 1;
  return Math.abs(Math.sin((2 * Math.PI * i) / t));
}

export default function GradientStrips({
  shape = "hill",
  maxHeightPercent = 70,
}) {
  const [barCount, setBarCount] = useState(15);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1280) setBarCount(15);
      else if (w >= 768) setBarCount(10);
      else setBarCount(6);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const heightFn = shape === "wave" ? waveHeight : hillHeight;
  const colorsLen = BAR_COLORS.length;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {Array.from({ length: barCount }).map((_, i) => {
        const h = heightFn(i, barCount);
        const colorIdx = Math.round((i / (barCount - 1)) * (colorsLen - 1));
        const { from, to } = BAR_COLORS[colorIdx];

        return (
          <motion.div
            key={i}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{
              duration: 0.9,
              delay: 0.08 * Math.abs(i - (barCount - 1) / 2),
              ease: [0.25, 0.1, 0.25, 1],
            }}
            style={{
              position: "absolute",
              bottom: 0,
              left: `${(i / barCount) * 100}%`,
              width: `${100 / barCount}%`,
              height: `${h * maxHeightPercent}%`,
              background: `linear-gradient(to top, ${from}, ${to})`,
            }}
          />
        );
      })}
    </div>
  );
}