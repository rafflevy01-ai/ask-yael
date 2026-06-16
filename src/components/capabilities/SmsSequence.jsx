import { useState, useEffect } from "react";

const SMS = [
  { body: "New appointment:\nDavid Cohen — Tue 14:30 — Cleaning", sender: "Yael · just now" },
  { body: "New patient registered:\nSarah Lévy — HMO: Clalit", sender: "Yael · just now" },
];

export default function SmsSequence() {
  const [visible, setVisible] = useState([true, false]);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setVisible([true, true]);
    }, 3000);

    const t2 = setTimeout(() => {
      setVisible([false, false]);
      setCycle((p) => p + 1);
    }, 5500);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [cycle]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "4px 0" }}>
      {SMS.map((sms, i) => (
        <div key={i} style={{
          background: "#FFFFFF", borderRadius: "12px", padding: "12px 14px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          opacity: visible[i] ? 1 : 0,
          transform: visible[i] ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
          border: "1px solid rgba(0,0,0,0.06)",
        }}>
          <div style={{
            fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "12px",
            color: "#0D0D0D", lineHeight: 1.5, whiteSpace: "pre-line",
          }}>
            {sms.body}
          </div>
          <div style={{
            fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px",
            color: "#B8B1A8", marginTop: "6px",
          }}>
            {sms.sender}
          </div>
        </div>
      ))}
    </div>
  );
}