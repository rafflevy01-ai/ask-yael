import React from "react";
import { motion } from "framer-motion";

const LANG_THEMES = {
  he: [
    "radial-gradient(circle at 30% 30%, #A7F3D0, #047857)",
    "radial-gradient(circle at 70% 60%, #6EE7B7, #065F46)",
    "radial-gradient(circle at 50% 80%, #34D399, #064E3B)",
    "radial-gradient(circle at 20% 70%, #D1FAE5, #059669)",
  ],
  fr: [
    "radial-gradient(circle at 30% 30%, #C4B5FD, #6D28D9)",
    "radial-gradient(circle at 70% 60%, #A78BFA, #5B21B6)",
    "radial-gradient(circle at 50% 80%, #8B5CF6, #4C1D95)",
    "radial-gradient(circle at 20% 70%, #DDD6FE, #7C3AED)",
  ],
  en: [
    "radial-gradient(circle at 30% 30%, #7DD4EC, #1A6A8A)",
    "radial-gradient(circle at 70% 60%, #5BB8D4, #0D5C7A)",
    "radial-gradient(circle at 50% 80%, #22A6C2, #0F4C6A)",
    "radial-gradient(circle at 20% 70%, #A5EAF7, #1A7FA8)",
  ],
};

const MINI_BLOBS = [
  { size: 30, top: -5, left: 0, dx: 8, dy: 6, duration: 4, delay: 0 },
  { size: 35, top: 15, left: 50, dx: -7, dy: -5, duration: 5, delay: 0.6 },
  { size: 25, top: 30, left: -10, dx: 6, dy: -7, duration: 3.5, delay: 1.2 },
];

const ORB_SIZE = 48;

export default function MiniLanguageOrb({ langKey, isActive }) {
  const theme = LANG_THEMES[langKey];

  return (
    <motion.div
      animate={isActive ? { scale: 1.15 } : { scale: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{
        position: "relative",
        width: ORB_SIZE,
        height: ORB_SIZE,
      }}
    >
      {/* Sphere shell */}
      <div
        style={{
          width: ORB_SIZE,
          height: ORB_SIZE,
          borderRadius: "50%",
          overflow: "hidden",
          position: "absolute",
          top: 0,
          left: 0,
          background:
            "radial-gradient(circle at 38% 32%, #F0F7F6 0%, #C8DDD8 45%, #8FB8B2 100%)",
        }}
      >
        {MINI_BLOBS.map((blob, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: 0.55,
              x: [0, blob.dx, blob.dx * -0.4, -blob.dx * 0.6, 0],
              y: [0, blob.dy, -blob.dy * 0.5, -blob.dy * 0.3, 0],
              scale: [1, 1.1, 0.95, 1.05, 1],
            }}
            transition={{
              x: {
                duration: blob.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: blob.delay,
              },
              y: {
                duration: blob.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: blob.delay,
              },
              scale: {
                duration: blob.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: blob.delay,
              },
            }}
            style={{
              position: "absolute",
              width: blob.size,
              height: blob.size,
              top: `${blob.top}%`,
              left: `${blob.left}%`,
              borderRadius: "50%",
              background: theme[i % theme.length],
              filter: "blur(8px)",
            }}
          />
        ))}

        {/* Inner shadow for depth */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            boxShadow:
              "inset 0 0 12px rgba(0,0,0,0.05), inset 0 1px 3px rgba(255,255,255,0.25)",
          }}
        />
      </div>

      {/* Specular highlight */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: ORB_SIZE,
          height: ORB_SIZE,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.35) 0%, transparent 28%)",
          pointerEvents: "none",
        }}
      />
    </motion.div>
  );
}