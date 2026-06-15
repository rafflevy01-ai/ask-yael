import { useState, useEffect } from "react";

const PILLS = [
  { key: "FR", label: "FR", color: "#3B82F6" },
  { key: "HE", label: "עב", color: "#8B5CF6" },
  { key: "EN", label: "EN", color: "#10B981" },
];

export default function LanguagePills() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((p) => (p + 1) % PILLS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", padding: "8px 0" }}>
      {PILLS.map((pill, i) => (
        <div key={pill.key} style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "8px 16px", borderRadius: "999px",
          background: i === active ? "#0D0D0D" : "transparent",
          border: i === active ? "none" : "1px solid #E5E5E5",
          color: i === active ? "#FFFFFF" : "#888888",
          fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "13px",
          transition: "all 0.4s ease",
          minWidth: "120px", justifyContent: "center",
        }}>
          <span style={{
            width: "7px", height: "7px", borderRadius: "50%",
            background: i === active ? "#FFFFFF" : pill.color,
            transition: "background 0.4s ease",
          }} />
          {pill.label}
        </div>
      ))}
    </div>
  );
}