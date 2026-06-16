import { useState, useEffect, useRef } from "react";
import { Phone, AlertTriangle, ArrowLeftRight, Check } from "lucide-react";

const STEPS = [
  {
    icon: Phone,
    label: "Patient calling",
    bg: "#FCEBEB", border: "#F09595", iconColor: "#A32D2D",
  },
  {
    icon: AlertTriangle,
    label: "Yael detects",
    bg: "#FDF3E0", border: "#FAC775", iconColor: "#8A5A00",
  },
  {
    icon: ArrowLeftRight,
    label: "Transferring",
    bg: "#EEF2FF", border: "#A5B4FC", iconColor: "#3730A3",
  },
  {
    icon: Check,
    label: "Resolved",
    bg: "#EAF3DE", border: "#97C459", iconColor: "#27500A",
  },
];

const STEP_DELAY = 900;
const FINAL_PAUSE = 1500;
const TOTAL = STEPS.length * STEP_DELAY + FINAL_PAUSE;

const CIRCLE = 36;
const CONNECTOR_W = 40;

export default function DeescalationTransfer() {
  const [progress, setProgress] = useState(0); // 0 to TOTAL
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const run = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;

      if (elapsed >= TOTAL) {
        startRef.current = ts;
        setProgress(0);
      } else {
        setProgress(elapsed);
      }

      rafRef.current = requestAnimationFrame(run);
    };

    rafRef.current = requestAnimationFrame(run);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Determine activation state for each step
  const stepsState = STEPS.map((_, i) => {
    const start = i * STEP_DELAY;
    const end = start + STEP_DELAY;
    if (progress < start) return 0; // not yet
    if (progress >= end) return 1; // completed
    return (progress - start) / STEP_DELAY; // animating (0→1)
  });

  // Connector progress for each of the 3 connectors
  const connectorProgress = [0, 1, 2].map((i) => {
    const start = (i + 1) * STEP_DELAY - 300; // start drawing 300ms before next step
    const end = (i + 1) * STEP_DELAY;
    if (progress < start) return 0;
    if (progress >= end) return 1;
    return (progress - start) / (end - start);
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0px",
        padding: "20px 0",
        width: "100%",
        maxWidth: "500px",
        margin: "0 auto",
      }}
    >
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const state = stepsState[i];
        const isActive = state > 0;
        const isAnimating = state > 0 && state < 1;
        const isLast = i === STEPS.length - 1;

        // Circle scale: pops up during activation, settles at 1
        const scale = isAnimating ? 1 + 0.15 * Math.sin(state * Math.PI) : isActive ? 1 : 0.92;
        const opacity = isActive ? 1 : 0.35;

        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "0px" }}>
            {/* Step node */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                flexShrink: 0,
              }}
            >
              {/* Circle */}
              <div
                style={{
                  width: `${CIRCLE}px`,
                  height: `${CIRCLE}px`,
                  borderRadius: "50%",
                  background: isActive ? step.bg : "#F1F5F9",
                  border: `2px solid ${isActive ? step.border : "#E2E8F0"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${scale})`,
                  transition: "transform 0.3s ease, background 0.3s ease, border-color 0.3s ease",
                }}
              >
                <Icon
                  size={14}
                  strokeWidth={2.2}
                  color={isActive ? step.iconColor : "#CBD5E1"}
                  style={{ transition: "color 0.3s ease" }}
                />
              </div>

              {/* Label */}
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: isActive ? 600 : 400,
                  fontSize: "9px",
                  color: isActive ? "#0D0D0D" : "#CBD5E1",
                  textAlign: "center",
                  lineHeight: 1.3,
                  maxWidth: "64px",
                  transition: "color 0.3s ease, font-weight 0.3s ease",
                }}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div
                style={{
                  width: `${CONNECTOR_W}px`,
                  height: "2px",
                  background: "#E2E8F0",
                  borderRadius: "1px",
                  position: "relative",
                  overflow: "hidden",
                  flexShrink: 0,
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: `${connectorProgress[i] * 100}%`,
                    background: step.border,
                    borderRadius: "1px",
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}