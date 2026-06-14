import React from "react";

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
    "radial-gradient(circle at 30% 30%, #A7F3D0, #047857)",
    "radial-gradient(circle at 70% 60%, #6EE7B7, #065F46)",
    "radial-gradient(circle at 50% 80%, #34D399, #064E3B)",
    "radial-gradient(circle at 20% 70%, #D1FAE5, #059669)",
  ],
};

const BLOBS = [
  { size: 140, top: -20, left: -10, dx: 50, dy: 40, duration: 6, delay: 0 },
  { size: 160, top: 40, left: 50, dx: -45, dy: -35, duration: 7, delay: 0.8 },
  { size: 120, top: 60, left: -30, dx: 40, dy: -45, duration: 5, delay: 1.6 },
  { size: 150, top: -10, left: 60, dx: -40, dy: 38, duration: 6.5, delay: 2.4 },
  { size: 110, top: 20, left: 20, dx: -35, dy: 42, duration: 8, delay: 3.2 },
];

const blobKeyframes = BLOBS.map((b, i) => `
  @keyframes blobFloat${i} {
    0%   { transform: translate(0, 0) rotate(0deg) scale(1); }
    25%  { transform: translate(${b.dx}px, ${b.dy}px) rotate(15deg) scale(1.15); }
    50%  { transform: translate(${b.dx * 0.4}px, ${-b.dy * 0.6}px) rotate(-8deg) scale(0.9); }
    75%  { transform: translate(${-b.dx * 0.8}px, ${-b.dy * 0.3}px) rotate(5deg) scale(1.1); }
    100% { transform: translate(0, 0) rotate(0deg) scale(1); }
  }
`).join("\n");

export default function VoiceOrb({ activeLang = "en", isPlaying = false, onPhoneClick }) {
  const theme = LANG_THEMES[activeLang];

  return (
    <div
      style={{
        position: "relative",
        width: SIZE,
        height: SIZE,
        marginBottom: "28px",
        transform: isPlaying ? "scale(1.06)" : "scale(1)",
        transition: "transform 0.8s ease-in-out",
      }}>
      <style>{blobKeyframes}</style>

      {/* Sphere shell with animated blobs clipped inside */}
      <div
        style={{
          width: SIZE,
          height: SIZE,
          borderRadius: "50%",
          overflow: "hidden",
          position: "absolute",
          top: 0,
          left: 0,
          background: "radial-gradient(circle at 38% 32%, #F0F7F6 0%, #C8DDD8 45%, #8FB8B2 100%)",
          transform: isPlaying ? "scale(1.04)" : "scale(1)",
          transition: "transform 0.8s ease-in-out",
          pointerEvents: "none",
        }}>

        {/* Animated gradient blobs with crossfade */}
        {BLOBS.map((blob, i) => (
          <div
            key={`${activeLang}-${i}`}
            style={{
              position: "absolute",
              width: blob.size,
              height: blob.size,
              top: `${blob.top}%`,
              left: `${blob.left}%`,
              borderRadius: "50%",
              background: theme[i],
              opacity: 0.65,
              filter: "blur(22px)",
              animation: `blobFloat${i} ${blob.duration}s ease-in-out ${blob.delay}s infinite`,
              pointerEvents: "none",
            }}
          />
        ))}

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
          width: SIZE,
          height: SIZE,
          borderRadius: "50%",
          background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.4) 0%, transparent 30%)",
          pointerEvents: "none",
        }}
      />

      {/* Phone button */}
      <button
        onClick={onPhoneClick}
        style={{
          position: "absolute",
          bottom: "-18px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          backgroundColor: isPlaying ? "#E53E3E" : "#0A0A0A",
          border: "3px solid #FFFFFF",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
          transition: "transform 0.15s ease, background-color 0.3s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateX(-50%) scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateX(-50%) scale(1)")}>
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </button>
    </div>
  );
}