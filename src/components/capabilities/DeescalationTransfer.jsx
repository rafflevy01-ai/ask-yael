import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Phone, User } from "lucide-react";

const STATES = [
  { label: "Patient frustrated", color: "#F1F5F9", textColor: "#64748B", duration: 1000 },
  { label: "Transferring...", color: "#FEF3C7", textColor: "#D97706", duration: 900 },
  { label: "Connected to staff", color: "#DCFCE7", textColor: "#16A34A", duration: 1900 },
];

const TOTAL_CYCLE = STATES.reduce((sum, s) => sum + s.duration, 0);

export default function DeescalationTransfer() {
  const [stage, setStage] = useState(0);
  const [lineProgress, setLineProgress] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    let frameId;
    let stageStart = performance.now();
    let prevProgress = 0;

    const run = (timestamp) => {
      const elapsed = timestamp - stageStart;

      if (stage === 0) {
        // Line stays at 0, dot still on left
        setLineProgress(0);
        if (elapsed >= STATES[0].duration) {
          setStage(1);
          stageStart = timestamp;
          prevProgress = 0;
        }
      } else if (stage === 1) {
        // Line draws from 0 to ~47% (0.9s out of total draw time of 1.9s ≈ 47%)
        const progress = Math.min((elapsed / STATES[1].duration) * 0.47, 0.47);
        setLineProgress(progress);
        if (elapsed >= STATES[1].duration) {
          setStage(2);
          stageStart = timestamp;
          prevProgress = 0.47;
        }
      } else if (stage === 2) {
        // Line completes drawing: 47% → 100% over 1.9s
        const progress = Math.min(prevProgress + (elapsed / STATES[2].duration) * 0.53, 1);
        setLineProgress(progress);
        if (elapsed >= STATES[2].duration) {
          setStage(0);
          stageStart = timestamp;
          setLineProgress(0);
        }
      }

      frameId = requestAnimationFrame(run);
    };

    frameId = requestAnimationFrame(run);
    return () => cancelAnimationFrame(frameId);
  }, [stage]);

  const currentState = STATES[stage];
  const dotX = `${lineProgress * 100}%`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
      }}
    >
      {/* Row: Patient node → track → Staff node */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0px",
          width: "100%",
          maxWidth: "260px",
        }}
      >
        {/* Left: Patient */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "5px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "#FEF2F2",
              border: "2px solid #FCA5A5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Phone size={14} strokeWidth={2} color="#EF4444" />
          </div>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#EF4444",
            }}
          >
            Patient
          </span>
        </div>

        {/* Track */}
        <div
          style={{
            flex: 1,
            height: "4px",
            background: "#E2E8F0",
            borderRadius: "2px",
            position: "relative",
            margin: "0 4px",
          }}
        >
          {/* Animated gradient fill */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: `${lineProgress * 100}%`,
              borderRadius: "2px",
              background: "linear-gradient(to right, #EF4444, #22C55E)",
              transition: "none",
            }}
          />
          {/* Sliding dot */}
          <motion.div
            animate={{ left: dotX }}
            transition={{ duration: 0.05, ease: "linear" }}
            style={{
              position: "absolute",
              top: "50%",
              transform: "translate(-50%, -50%)",
              left: dotX,
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#FFFFFF",
              border: "2px solid #0D0D0D",
            }}
          />
        </div>

        {/* Right: Staff */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "5px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "#F0FDF4",
              border: "2px solid #86EFAC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <User size={14} strokeWidth={2} color="#22C55E" />
          </div>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#16A34A",
            }}
          >
            Staff
          </span>
        </div>
      </div>

      {/* Status badge */}
      <motion.div
        key={stage}
        initial={{ opacity: 0, y: 3, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        style={{
          padding: "5px 14px",
          borderRadius: "999px",
          background: currentState.color,
        }}
      >
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "10px",
            color: currentState.textColor,
            letterSpacing: "-0.01em",
          }}
        >
          {currentState.label}
        </span>
      </motion.div>
    </div>
  );
}