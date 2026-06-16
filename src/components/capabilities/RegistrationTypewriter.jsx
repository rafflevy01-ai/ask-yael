import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

const FIELDS = [
  { label: "Name", value: "David Cohen" },
  { label: "Teudat Zehut", value: "031-456789" },
  { label: "Date of birth", value: "15/03/1985" },
  { label: "HMO", value: "Clalit" },
  { label: "Appointment", value: "Wed 18 Jun 10:00" },
];

const CHAR_DELAY = 55;
const FIELD_PAUSE = 400;
const CYCLE_PAUSE = 2000;

export default function RegistrationTypewriter() {
  const [visibleFields, setVisibleFields] = useState([]);
  const cycleRef = useRef(null);

  useEffect(() => {
    let timers = [];

    const run = () => {
      setVisibleFields([]);
      const fields = FIELDS.map((f) => ({ ...f, typedValue: "", done: false }));

      const schedule = (delay, fn) => {
        const t = setTimeout(fn, delay);
        timers.push(t);
        return t;
      };

      let cumulative = 400;

      FIELDS.forEach((field, fi) => {
        // Show label
        schedule(cumulative, () => {
          setVisibleFields((prev) => [...prev, { ...field, typedValue: "", done: false }]);
        });

        // Type each character
        for (let ci = 0; ci < field.value.length; ci++) {
          const charIndex = ci;
          schedule(cumulative + (charIndex + 1) * CHAR_DELAY, () => {
            setVisibleFields((prev) =>
              prev.map((f, i) =>
                i === fi ? { ...f, typedValue: field.value.slice(0, charIndex + 1) } : f
              )
            );
          });
        }

        const doneTime = cumulative + (field.value.length + 1) * CHAR_DELAY;
        schedule(doneTime, () => {
          setVisibleFields((prev) =>
            prev.map((f, i) => (i === fi ? { ...f, done: true } : f))
          );
        });

        cumulative = doneTime + FIELD_PAUSE;
      });

      // Restart cycle
      schedule(cumulative + CYCLE_PAUSE, () => run());
    };

    run();
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: "5px",
      padding: "0", maxWidth: "340px", margin: "0 auto", width: "100%",
      minHeight: "130px",
    }}>
      {visibleFields.map((field, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "12px",
        }}>
          {/* Label */}
          <span style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: "11px",
            color: "#999999",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}>
            {field.label}
          </span>

          {/* Value + checkmark */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: "11px",
              color: "#0D0D0D",
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
              textAlign: "right",
            }}>
              {field.typedValue}
              {!field.done && (
                <motion.span
                  animate={{ opacity: [0, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                  style={{
                    display: "inline-block",
                    width: "1px",
                    height: "13px",
                    background: "#0D0D0D",
                    marginLeft: "1px",
                    verticalAlign: "middle",
                  }}
                />
              )}
            </span>

            {/* Checkmark */}
            <AnimatePresence>
              {field.done && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    width: "18px", height: "18px", borderRadius: "50%",
                    background: "#C5E8FF",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Check size={10} strokeWidth={3} color="#0D0D0D" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
}