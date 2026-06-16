import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, AlertTriangle, ArrowLeftRight, Check } from "lucide-react";

const STEPS = [
  {
    icon: Phone,
    label: "Patient calling",
    subtitle: "+972 54 123 4567 · Frustrated",
    bg: "#FCEBEB",
    border: "#F09595",
    iconColor: "#A32D2D",
  },
  {
    icon: AlertTriangle,
    label: "Yael detects frustration",
    subtitle: "Sentiment threshold reached",
    bg: "#FDF3E0",
    border: "#FAC775",
    iconColor: "#8A5A00",
  },
  {
    icon: ArrowLeftRight,
    label: "Transferring call",
    subtitle: "Routing to Dr. Cohen",
    bg: "#EEF2FF",
    border: "#A5B4FC",
    iconColor: "#3730A3",
  },
  {
    icon: Check,
    label: "Resolved",
    subtitle: "Patient connected to staff",
    bg: "#EAF3DE",
    border: "#97C459",
    iconColor: "#27500A",
  },
];

const STEP_DELAY = 900; // ms between each step appearance
const CONNECTOR_DELAY = 450; // ms after step appears before connector draws
const FINAL_HOLD = 2200; // ms to hold step 4 before resetting

// Total cycle: 3 * STEP_DELAY + FINAL_HOLD = 2700 + 2200 = 4900ms
const TOTAL_CYCLE = (STEPS.length - 1) * STEP_DELAY + FINAL_HOLD;

export default function DeescalationTransfer() {
  const [activeSteps, setActiveSteps] = useState([]); // { index, connectorDone }
  const cycleRef = useRef(null);
  const startRef = useRef(0);

  useEffect(() => {
    let frameId;
    let stepsState = [];

    const run = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;

      // Determine which steps should be active
      const newSteps = [];
      for (let i = 0; i < STEPS.length; i++) {
        const appearTime = i * STEP_DELAY;
        if (elapsed >= appearTime) {
          const connectorDone = elapsed >= appearTime + CONNECTOR_DELAY;
          newSteps.push({ index: i, connectorDone });
        }
      }

      // Check if sequence changed
      const changed =
        newSteps.length !== stepsState.length ||
        newSteps.some((s, i) => s.connectorDone !== stepsState[i]?.connectorDone);

      if (changed) {
        stepsState = newSteps;
        setActiveSteps([...newSteps]);
      }

      // Reset cycle
      if (elapsed >= TOTAL_CYCLE) {
        startRef.current = timestamp;
        stepsState = [];
        setActiveSteps([]);
      }

      frameId = requestAnimationFrame(run);
    };

    frameId = requestAnimationFrame(run);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const maxIndex = activeSteps.length > 0 ? activeSteps[activeSteps.length - 1].index : -1;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0px",
        padding: "4px 0",
        maxWidth: "280px",
        margin: "0 auto",
        width: "100%",
      }}
    >
      {STEPS.map((step, i) => {
        const active = activeSteps.find((s) => s.index === i);
        const isVisible = !!active;
        const connectorDone = active?.connectorDone || false;
        const isLast = i === STEPS.length - 1;
        const isDimmed = maxIndex > i;

        const Icon = step.icon;

        return (
          <div key={i} style={{ position: "relative" }}>
            <AnimatePresence>
              {isVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: isDimmed ? 0.25 : 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    paddingBottom: isLast ? "0px" : "0px",
                  }}
                >
                  {/* Circle icon */}
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      minWidth: "32px",
                      borderRadius: "50%",
                      background: step.bg,
                      border: `2px solid ${step.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={13} strokeWidth={2.5} color={step.iconColor} />
                  </div>

                  {/* Label + subtitle */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 500,
                        fontSize: "11px",
                        color: "#0D0D0D",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.4,
                      }}
                    >
                      {step.label}
                    </span>
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 400,
                        fontSize: "10px",
                        color: "#999999",
                        lineHeight: 1.4,
                      }}
                    >
                      {step.subtitle}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Connector line */}
            {!isLast && isVisible && (
              <div
                style={{
                  marginLeft: "15px",
                  width: "2px",
                  height: "16px",
                  background: "#E2E8F0",
                  borderRadius: "1px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  initial={{ height: "0%" }}
                  animate={{ height: connectorDone ? "100%" : "0%" }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    background: step.border,
                    borderRadius: "1px",
                  }}
                />
              </div>
            )}

            {/* Connector placeholder when not visible */}
            {!isLast && !isVisible && (
              <div
                style={{
                  marginLeft: "15px",
                  width: "2px",
                  height: "16px",
                  background: "transparent",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}