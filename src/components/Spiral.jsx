import { useEffect, useRef } from "react";

const SIZE = 800;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

export default function Spiral({
  totalDots = 600,
  dotRadius = 2,
  duration = 3,
  dotColor = "#FFFFFF",
  margin = 2,
  innerGap = 0.3,
  minOpacity = 0.3,
  maxOpacity = 1,
  minScale = 0.5,
  maxScale = 1.5,
  style = {},
}) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const CENTER = SIZE / 2;
    const MAX_RADIUS = CENTER - margin - dotRadius;

    svg.innerHTML = "";

    for (let i = 0; i < totalDots; i++) {
      const frac = innerGap + (1 - innerGap) * (i / totalDots);
      const radius = MAX_RADIUS * frac;
      const theta = i * GOLDEN_ANGLE;
      const x = CENTER + radius * Math.cos(theta);
      const y = CENTER + radius * Math.sin(theta);

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", x.toString());
      circle.setAttribute("cy", y.toString());
      circle.setAttribute("r", dotRadius.toString());
      circle.setAttribute("fill", dotColor);
      circle.setAttribute("opacity", "0");

      // Radius animation
      const animR = document.createElementNS("http://www.w3.org/2000/svg", "animate");
      animR.setAttribute("attributeName", "r");
      animR.setAttribute("values", `${dotRadius * minScale};${dotRadius * maxScale};${dotRadius * minScale}`);
      animR.setAttribute("dur", `${duration}s`);
      animR.setAttribute("begin", `${frac * duration}s`);
      animR.setAttribute("repeatCount", "indefinite");
      animR.setAttribute("calcMode", "spline");
      animR.setAttribute("keySplines", "0.4 0 0.6 1;0.4 0 0.6 1");
      circle.appendChild(animR);

      // Opacity animation
      const animO = document.createElementNS("http://www.w3.org/2000/svg", "animate");
      animO.setAttribute("attributeName", "opacity");
      animO.setAttribute("values", `${minOpacity};${maxOpacity};${minOpacity}`);
      animO.setAttribute("dur", `${duration}s`);
      animO.setAttribute("begin", `${frac * duration}s`);
      animO.setAttribute("repeatCount", "indefinite");
      animO.setAttribute("calcMode", "spline");
      animO.setAttribute("keySplines", "0.4 0 0.6 1;0.4 0 0.6 1");
      circle.appendChild(animO);

      svg.appendChild(circle);
    }
  }, [totalDots, dotRadius, duration, dotColor, margin, minOpacity, maxOpacity, minScale, maxScale]);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0, ...style }}>
      <svg
        ref={svgRef}
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          height: "100%",
          maxWidth: "800px",
        }}
      />
    </div>
  );
}