import { useState, useEffect } from "react";

const FIELDS = ["Name", "Date of Birth", "HMO", "Reason for visit"];
const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B"];

export default function DataPillsSequence() {
  const [visible, setVisible] = useState([false, false, false, false]);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    setVisible([false, false, false, false]);
    const timers = FIELDS.map((_, i) =>
      setTimeout(() => {
        setVisible((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, i * 400)
    );

    const reset = setTimeout(() => {
      setCycle((p) => p + 1);
    }, 3500);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(reset);
    };
  }, [cycle]);

  return (
    <div style={{ padding: "8px 0" }}>
      <span style={{
        fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px",
        color: "#6B6B6B", display: "block", marginBottom: "12px",
      }}>
        Collected during the call
      </span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {FIELDS.map((field, i) => (
          <span key={i} style={{
            fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "11px",
            padding: "6px 12px", borderRadius: "999px",
            background: COLORS[i], color: "#FFFFFF",
            opacity: visible[i] ? 1 : 0,
            transform: visible[i] ? "scale(1)" : "scale(0.9)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}>
            {field}
          </span>
        ))}
      </div>
    </div>
  );
}