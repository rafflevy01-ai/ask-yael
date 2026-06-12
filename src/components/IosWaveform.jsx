import React, { useRef, useEffect } from "react";

const BARS = Array.from({ length: 18 }, (_, i) => ({
  minH: 4 + (i % 5) * 2,
  maxH: 14 + Math.sin(i * 0.8) * 12 + (i % 3) * 6,
  delay: i * 0.07,
  duration: 0.5 + (i % 4) * 0.15,
}));

export default function IosWaveform({ active = true, calming = false }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const bars = containerRef.current.querySelectorAll(".wf-bar");
    const state = !active ? "paused" : calming ? "calm" : "active";

    bars.forEach((bar, i) => {
      const b = BARS[i];
      if (state === "active") {
        bar.style.animation = `wf-pulse ${b.duration}s ${b.delay}s ease-in-out infinite alternate`;
        bar.style.height = `${b.maxH}px`;
        bar.style.opacity = "0.9";
      } else if (state === "calm") {
        bar.style.animation = `wf-pulse ${b.duration * 1.4}s ${b.delay * 1.3}s ease-in-out infinite alternate`;
        bar.style.height = `${b.minH + 4}px`;
        bar.style.opacity = "0.5";
      } else {
        bar.style.animation = "none";
        bar.style.height = `${b.minH}px`;
        bar.style.opacity = "0.15";
      }
    });
  }, [active, calming]);

  return (
    <>
      <style>{`
        @keyframes wf-pulse {
          0%   { transform: scaleY(0.25); }
          100% { transform: scaleY(1); }
        }
      `}</style>
      <div
        ref={containerRef}
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: "2px",
          height: "44px",
          padding: "0 8px",
          borderRadius: "12px",
          background: "rgba(118,118,128,0.06)",
        }}
      >
        {BARS.map((b, i) => (
          <div
            key={i}
            className="wf-bar"
            style={{
              width: "3px",
              height: `${b.minH}px`,
              borderRadius: "9999px",
              background: "#FF4500",
              transformOrigin: "bottom center",
              transition: "opacity 0.6s ease, height 0.4s ease",
            }}
          />
        ))}
      </div>
    </>
  );
}