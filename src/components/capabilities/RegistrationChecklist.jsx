import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const STEPS = [
  "Name collected",
  "Teudat Zehut verified",
  "Date of birth confirmed",
  "HMO verified",
  "Appointment booked",
];

export default function RegistrationChecklist() {
  const [active, setActive] = useState(-1);
  const cycleRef = useRef(null);

  useEffect(() => {
    let step = -1;
    let timer;

    const run = () => {
      step = -1;
      setActive(-1);

      const advance = (i) => {
        if (i >= STEPS.length) {
          // All done, pause then reset
          timer = setTimeout(() => run(), 1500);
          return;
        }
        timer = setTimeout(() => {
          setActive(i);
          advance(i + 1);
        }, 800);
      };

      timer = setTimeout(() => advance(0), 400);
    };

    run();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: "12px",
      padding: "8px 0", maxWidth: "400px", margin: "0 auto", width: "100%",
    }}>
      {STEPS.map((step, i) => {
        const done = i <= active;
        const isCurrent = i === active;
        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: "12px",
          }}>
            {/* Circle */}
            <motion.div
              animate={{
                backgroundColor: done ? "#0D0D0D" : "#F4F1EE",
                borderColor: done ? "#0D0D0D" : "#E0E0E0",
              }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: "22px", height: "22px", borderRadius: "50%",
                border: "1.5px solid",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: done ? 1 : 0, opacity: done ? 1 : 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <Check size={12} strokeWidth={3} color="#FFFFFF" />
              </motion.div>
            </motion.div>
            {/* Label */}
            <motion.span
              animate={{
                color: done ? "#0D0D0D" : "#B8B1A8",
                fontWeight: done ? 600 : 400,
              }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                letterSpacing: "-0.01em",
              }}
            >
              {step}
            </motion.span>
          </div>
        );
      })}
    </div>
  );
}