import { useRef, useEffect } from "react";

const DOT_RADIUS = 2.5;
const DOT_SPACING = 36;
const MAX_WAVE_DISTANCE = 180;
const WAVE_SPEED = 0.015;
const WAVE_AMPLITUDE = 1.4;
const BASE_OPACITY = 0.15;
const PEAK_OPACITY = 0.55;

export default function InteractiveDotGrid() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const autoWaveRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animId;

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    canvas.addEventListener("mousemove", handleMouse);
    canvas.addEventListener("mouseleave", handleLeave);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      autoWaveRef.current += WAVE_SPEED;
      const t = autoWaveRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      const cols = Math.ceil(w / DOT_SPACING) + 1;
      const rows = Math.ceil(h / DOT_SPACING) + 1;
      const offsetX = DOT_SPACING / 2;
      const offsetY = DOT_SPACING / 2;

      for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
          const cx = col * DOT_SPACING + offsetX;
          const cy = row * DOT_SPACING + offsetY;

          // Autonomous gentle wave
          const wave = Math.sin(cx * 0.008 + t) * Math.cos(cy * 0.006 + t * 1.3) * 0.5;
          const autoScale = 1 + wave * WAVE_AMPLITUDE;
          const autoAlpha = BASE_OPACITY + wave * 0.12;

          // Mouse interaction ripple
          const dx = cx - mx;
          const dy = cy - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          let mouseInfluence = 0;

          if (dist < MAX_WAVE_DISTANCE) {
            mouseInfluence = Math.cos((dist / MAX_WAVE_DISTANCE) * Math.PI * 2 + t * 3) * 0.5 + 0.5;
            mouseInfluence *= 1 - dist / MAX_WAVE_DISTANCE;
          }

          const radius = DOT_RADIUS * (autoScale + mouseInfluence * 0.8);
          const alpha = Math.min(PEAK_OPACITY, autoAlpha + mouseInfluence * 0.4);

          // Color interpolation: base blue -> accent cyan based on wave
          const colorMix = (autoScale - 1) * 0.5 + mouseInfluence * 0.3;
          const r = Math.round(59 + colorMix * 30);
          const g = Math.round(130 + colorMix * 50);
          const b = Math.round(246 + colorMix * 10);

          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouse);
      canvas.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "auto",
      }}
    />
  );
}