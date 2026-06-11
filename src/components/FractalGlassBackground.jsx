import React, { useEffect, useRef, useCallback } from "react";

// Self-contained replication of Framer's FractalGlassEffect technique
// Uses backdrop-filter columns + mix-blend-mode overlay (same as original source)
// + smooth mouse-tracking ambient light using hero's extracted color palette

const COLUMN_COUNT = 14;

// Hero palette (extracted from HeroSection)
const BLUE_GLOW   = "rgba(4,71,255,0.13)";
const ORANGE_GLOW = "rgba(255,71,4,0.09)";
const GREEN_GLOW  = "rgba(100,200,150,0.07)";

export default function FractalGlassBackground({ sectionRef }) {
  const lightRef = useRef(null);
  const rafRef   = useRef(null);
  const target   = useRef({ x: 0.5, y: 0.4 });
  const current  = useRef({ x: 0.5, y: 0.4 });

  // Smooth lerp towards mouse/touch position
  const animateLight = useCallback(() => {
    current.current.x += (target.current.x - current.current.x) * 0.04;
    current.current.y += (target.current.y - current.current.y) * 0.04;

    if (lightRef.current) {
      const x = current.current.x * 100;
      const y = current.current.y * 100;
      lightRef.current.style.background = `
        radial-gradient(ellipse 60% 60% at ${x}% ${y}%,
          ${BLUE_GLOW} 0%,
          rgba(255,71,4,0.05) 50%,
          transparent 75%
        ),
        radial-gradient(ellipse 35% 35% at ${100 - x}% ${100 - y}%,
          ${ORANGE_GLOW} 0%,
          transparent 65%
        )
      `;
    }

    rafRef.current = requestAnimationFrame(animateLight);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animateLight);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animateLight]);

  // Attach mouse/touch listeners directly to the hero section element
  useEffect(() => {
    const el = sectionRef?.current;
    if (!el) return;

    const onMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      target.current.x = (e.clientX - rect.left) / rect.width;
      target.current.y = (e.clientY - rect.top)  / rect.height;
    };

    const onTouchMove = (e) => {
      if (!e.touches[0]) return;
      const rect = el.getBoundingClientRect();
      target.current.x = (e.touches[0].clientX - rect.left) / rect.width;
      target.current.y = (e.touches[0].clientY - rect.top)  / rect.height;
    };

    el.addEventListener("mousemove", onMouseMove, { passive: true });
    el.addEventListener("touchmove",  onTouchMove,  { passive: true });
    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("touchmove",  onTouchMove);
    };
  }, [sectionRef]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Mouse-tracking ambient light layer */}
      <div
        ref={lightRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          willChange: "background",
        }}
      />

      {/* Slow-drifting green accent orb (complement to hero orbs) */}
      <div
        style={{
          position: "absolute",
          width: 380,
          height: 380,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${GREEN_GLOW} 0%, transparent 70%)`,
          top: "35%",
          left: "38%",
          animation: "fg-orb 19s ease-in-out infinite",
          zIndex: 0,
        }}
      />

      {/* Fractal glass columns — exact technique from Framer source */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "row",
          opacity: 0.45,
          mixBlendMode: "overlay",
          zIndex: 2,
        }}
      >
        {Array.from({ length: COLUMN_COUNT }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: "100%",
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
              background: `linear-gradient(90deg,
                rgba(255,255,255,0.07) 0%,
                rgba(255,255,255,0.00) 20%,
                rgba(0,0,0,0.02) 50%,
                rgba(0,0,0,0.05) 80%,
                rgba(255,255,255,0.07) 100%)`,
              borderRight: "1px solid rgba(255,255,255,0.07)",
              borderLeft:  "1px solid rgba(255,255,255,0.03)",
              boxShadow:   "inset 1px 0 1px rgba(255,255,255,0.05)",
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes fg-orb {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(30px,-25px) scale(1.07); }
          66%      { transform: translate(-18px,20px) scale(0.96); }
        }
      `}</style>
    </div>
  );
}