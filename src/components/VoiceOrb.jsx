import { useRef, useEffect } from "react";

const AMPLITUDE_BASE = 30;
const AMPLITUDE_MIN = 22;
const AMPLITUDE_MAX = 38;
const FREQUENCY = 1.4;
const PHASE_SPEED = 0.022;

const LANG_THEMES = {
  en: {
    stops: ["#5BB8D4", "#1A7FA8", "#0D5C7A"],
    glow: "rgba(91, 184, 212, 0.6)",
  },
  fr: {
    stops: ["#A78BFA", "#7C3AED", "#5B21B6"],
    glow: "rgba(167, 139, 250, 0.6)",
  },
  he: {
    stops: ["#6EE7B7", "#059669", "#065F46"],
    glow: "rgba(110, 231, 183, 0.6)",
  },
};

const SIZE = 280;

export default function VoiceOrb({ activeLang = "en" }) {
  const canvasRef = useRef(null);
  const phaseRef = useRef(0);
  const langRef = useRef(activeLang);
  const targetColorsRef = useRef(LANG_THEMES[activeLang]);
  const currentColorsRef = useRef(LANG_THEMES[activeLang]);

  useEffect(() => {
    langRef.current = activeLang;
    targetColorsRef.current = LANG_THEMES[activeLang];
  }, [activeLang]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    canvas.style.width = SIZE + "px";
    canvas.style.height = SIZE + "px";
    ctx.scale(dpr, dpr);

    let animId;

    const lerp = (a, b, t) => a + (b - a) * t;

    const lerpColors = (from, to, t) => ({
      stops: to.stops.map((c, i) => {
        const fromC = from.stops[i] || from.stops[0];
        return lerpColor(fromC, c, t);
      }),
      glow: lerpColor(from.glow, to.glow, t),
    });

    const lerpColor = (c1, c2, t) => {
      const parse = (c) => {
        const r = parseInt(c.slice(1, 3), 16);
        const g = parseInt(c.slice(3, 5), 16);
        const b = parseInt(c.slice(5, 7), 16);
        return [r, g, b];
      };
      if (c1.startsWith("rgba")) {
        const m = c1.match(/[\d.]+/g);
        const m2 = c2.match(/[\d.]+/g);
        return `rgba(${Math.round(lerp(+m[0], +m2[0], t))}, ${Math.round(lerp(+m[1], +m2[1], t))}, ${Math.round(lerp(+m[2], +m2[2], t))}, ${lerp(+m[3], +m2[3], t).toFixed(2)})`;
      }
      const [r1, g1, b1] = parse(c1);
      const [r2, g2, b2] = parse(c2);
      return `rgb(${Math.round(lerp(r1, r2, t))}, ${Math.round(lerp(g1, g2, t))}, ${Math.round(lerp(b1, b2, t))})`;
    };

    const draw = (time) => {
      ctx.clearRect(0, 0, SIZE, SIZE);

      phaseRef.current += PHASE_SPEED;
      const phase = phaseRef.current;

      // Breathing amplitude
      const breathCycle = Math.sin(time * 0.0018) * 0.5 + 0.5;
      const amplitude = AMPLITUDE_MIN + breathCycle * (AMPLITUDE_MAX - AMPLITUDE_MIN);

      // Color crossfade (500ms)
      const crossfadeT = Math.min(1, (targetColorsRef.current !== currentColorsRef.current
        ? 0.05 : 1));
      currentColorsRef.current = lerpColors(
        currentColorsRef.current,
        targetColorsRef.current,
        crossfadeT
      );

      const colors = currentColorsRef.current;
      const centerY = SIZE / 2;

      // Build gradient for ribbon
      const grad = ctx.createLinearGradient(0, 0, SIZE, 0);
      grad.addColorStop(0, colors.stops[0]);
      grad.addColorStop(0.5, colors.stops[1]);
      grad.addColorStop(1, colors.stops[2]);

      // Wave path function
      const getWaveY = (x) => {
        return centerY + Math.sin(x / SIZE * Math.PI * 2 * FREQUENCY + phase) * amplitude;
      };

      // Layer 1 — wide outer glow
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, getWaveY(0));
      for (let x = 1; x <= SIZE; x++) {
        ctx.lineTo(x, getWaveY(x));
      }
      ctx.strokeStyle = colors.glow;
      ctx.lineWidth = 22;
      ctx.shadowBlur = 16;
      ctx.shadowColor = colors.glow;
      ctx.stroke();
      ctx.restore();

      // Layer 2 — mid color ribbon
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, getWaveY(0));
      for (let x = 1; x <= SIZE; x++) {
        ctx.lineTo(x, getWaveY(x));
      }
      ctx.strokeStyle = grad;
      ctx.lineWidth = 10;
      ctx.shadowBlur = 8;
      ctx.shadowColor = colors.stops[1];
      ctx.stroke();
      ctx.restore();

      // Layer 3 — sharp bright core
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, getWaveY(0));
      for (let x = 1; x <= SIZE; x++) {
        ctx.lineTo(x, getWaveY(x));
      }
      ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 0;
      ctx.stroke();
      ctx.restore();

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div style={{ position: "relative", width: SIZE, height: SIZE, marginBottom: "28px" }}>
      {/* Sphere shell */}
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
        }}>

        {/* Canvas wave layer */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: SIZE,
            height: SIZE,
          }}
        />

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
        style={{
          position: "absolute",
          bottom: "-18px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          backgroundColor: "#0A0A0A",
          border: "3px solid #FFFFFF",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
          transition: "transform 0.15s ease",
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "translateX(-50%) scale(1.05)"}
        onMouseLeave={e => e.currentTarget.style.transform = "translateX(-50%) scale(1)"}>
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transform: "rotate(-30deg)" }}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </button>
    </div>
  );
}