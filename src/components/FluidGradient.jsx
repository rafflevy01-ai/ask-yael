import { useMemo } from "react";
import { motion } from "framer-motion";

const COLORS = ["#0DB8A9", "#6EDDD6", "#D4F5F2", "#F0FFFE"];

const BLOBS = [
  { size: 380, x: "15%", y: "20%", duration: 18, delay: 0 },
  { size: 280, x: "65%", y: "55%", duration: 22, delay: 2 },
  { size: 340, x: "40%", y: "10%", duration: 20, delay: 5 },
  { size: 240, x: "75%", y: "25%", duration: 16, delay: 8 },
  { size: 300, x: "20%", y: "65%", duration: 24, delay: 3 },
];

export default function FluidGradient() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {/* Blurred blobs */}
      {BLOBS.map((blob, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            width: blob.size,
            height: blob.size,
            borderRadius: "50%",
            background: COLORS[i % COLORS.length],
            opacity: 0.35,
            filter: "blur(80px)",
            left: blob.x,
            top: blob.y,
          }}
          animate={{
            x: ["-60px", "80px", "-40px", "60px", "-60px"],
            y: ["-40px", "60px", "-80px", "40px", "-40px"],
            scale: [1, 1.12, 0.95, 1.08, 1],
          }}
          transition={{
            duration: blob.duration,
            delay: blob.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Subtle noise overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(13,184,169,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(110,221,214,0.05) 0%, transparent 60%), radial-gradient(ellipse at 40% 80%, rgba(212,245,242,0.06) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}