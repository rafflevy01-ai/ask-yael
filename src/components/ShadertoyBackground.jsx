import { useEffect, useRef } from "react";
import ShadertoyBackgroundInit from "https://cdn.jsdelivr.net/npm/threejs-components@0.0.23/build/backgrounds/shadertoy.min.js";

export default function ShadertoyBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const app = ShadertoyBackgroundInit(canvasRef.current);
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