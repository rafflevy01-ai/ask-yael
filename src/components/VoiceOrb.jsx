import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const SIZE = 280;

const LANG_THEMES = {
  en: [
    "radial-gradient(circle at 30% 30%, #7DD4EC, #1A6A8A)",
    "radial-gradient(circle at 70% 60%, #5BB8D4, #0D5C7A)",
    "radial-gradient(circle at 50% 80%, #22A6C2, #0F4C6A)",
    "radial-gradient(circle at 20% 70%, #A5EAF7, #1A7FA8)",
  ],
  fr: [
    "radial-gradient(circle at 30% 30%, #C4B5FD, #6D28D9)",
    "radial-gradient(circle at 70% 60%, #A78BFA, #5B21B6)",
    "radial-gradient(circle at 50% 80%, #8B5CF6, #4C1D95)",
    "radial-gradient(circle at 20% 70%, #DDD6FE, #7C3AED)",
  ],
  he: [
    "radial-gradient(circle at 30% 30%, #bcd4f0, #2b6bb5)",
    "radial-gradient(circle at 70% 60%, #5b93d6, #2562aa)",
    "radial-gradient(circle at 50% 80%, #000000, #1f5299)",
    "radial-gradient(circle at 20% 70%, #1E1E1E, #2b6bb5)",
  ],
};

const BLOBS = [
  { size: 140, top: -20, left: -10, dx: 50, dy: 40, duration: 6, delay: 0 },
  { size: 160, top: 40, left: 50, dx: -45, dy: -35, duration: 7, delay: 0.8 },
  { size: 120, top: 60, left: -30, dx: 40, dy: -45, duration: 5, delay: 1.6 },
  { size: 150, top: -10, left: 60, dx: -40, dy: 38, duration: 6.5, delay: 2.4 },
  { size: 110, top: 20, left: 20, dx: -35, dy: 42, duration: 8, delay: 3.2 },
];

function blobKeyframes(blob) {
  return {
    x: [0, blob.dx, blob.dx * 0.4, -blob.dx * 0.8, 0],
    y: [0, blob.dy, -blob.dy * 0.6, -blob.dy * 0.3, 0],
    rotate: [0, 15, -8, 5, 0],
    scale: [1, 1.15, 0.9, 1.1, 1],
  };
}

const shellBg = "radial-gradient(circle at 38% 32%, #F0F7F6 0%, #C8DDD8 45%, #8FB8B2 100%)";

export default function VoiceOrb({ activeLang = "en", isPlaying = false, onPhoneClick, size = SIZE }) {
  const theme = LANG_THEMES[activeLang];
  const scale = size / SIZE;

  return (
    <motion.div
      style={{
        position: "relative",
        width: size,
        height: size,
        marginBottom: 28 * scale,
      }}
      animate={isPlaying ? {
        scale: [1, 1.07, 0.97, 1.05, 0.98, 1.04, 1, 1.06, 0.99, 1],
        rotate: [0, 1.5, -1, 0.8, -1.3, 0.5, -0.8, 1, 0],
      } : {
        scale: 1,
        rotate: 0,
      }}
      transition={isPlaying ? {
        duration: 3.2,
        repeat: Infinity,
        ease: "easeInOut",
      } : {
        duration: 0.8,
        ease: "easeInOut",
      }}
    >
      {/* Sphere shell with animated blobs clipped inside */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          overflow: "hidden",
          position: "absolute",
          top: 0,
          left: 0,
          background: shellBg,
          pointerEvents: "none",
        }}
      >
        {/* Animated gradient blobs with crossfade on language switch */}
        <AnimatePresence mode="sync">
          {BLOBS.map((blob, i) => (
            <motion.div
              key={`${activeLang}-${i}`}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 0.65,
                ...blobKeyframes(blob),
              }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 0.6, ease: "easeInOut" },
                x: { duration: blob.duration, repeat: Infinity, ease: "easeInOut", delay: blob.delay },
                y: { duration: blob.duration, repeat: Infinity, ease: "easeInOut", delay: blob.delay },
                rotate: { duration: blob.duration, repeat: Infinity, ease: "easeInOut", delay: blob.delay },
                scale: { duration: blob.duration, repeat: Infinity, ease: "easeInOut", delay: blob.delay },
              }}
              style={{
                position: "absolute",
                width: blob.size * scale,
                height: blob.size * scale,
                top: `${blob.top}%`,
                left: `${blob.left}%`,
                borderRadius: "50%",
                background: theme[i],
                filter: "blur(22px)",
                pointerEvents: "none",
              }}
            />
          ))}
        </AnimatePresence>

        {/* Inner shadow for depth */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            boxShadow: "inset 0 0 40px rgba(0,0,0,0.06), inset 0 2px 8px rgba(255,255,255,0.3)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Specular highlight on top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: size,
          height: size,
          borderRadius: "50%",
          background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.4) 0%, transparent 30%)",
          pointerEvents: "none",
        }}
      />

      {/* Phone button */}
      <motion.button
        onClick={onPhoneClick}
        style={{
          position: "absolute",
          bottom: "-18px",
          left: "50%",
          x: "-50%",
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          backgroundColor: isPlaying ? "#E53E3E" : "#000000",
          border: "3px solid #FFFFFF",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.15 }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </motion.button>
    </motion.div>
  );
}