import { useEffect, useRef } from "react";

export default function ShadertoyBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    let app;
    const loadShadertoy = async () => {
      const { default: ShadertoyBackground } = await import("threejs-components/build/backgrounds/shadertoy.min.js");
      app = ShadertoyBackground(canvasRef.current);
    };
    loadShadertoy();

    return () => {
      if (app && typeof app.dispose === "function") app.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}