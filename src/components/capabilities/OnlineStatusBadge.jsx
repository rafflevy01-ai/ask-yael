import { useState, useEffect } from "react";

const MESSAGES = [
  "Available now",
  "Answering in Hebrew",
  "Answering in French",
  "Answering in English",
  "No missed calls \u00b7 ever",
];

export default function OnlineStatusBadge() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
        setVisible(true);
      }, 400);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: "10px", padding: "24px 0 8px",
    }}>
      {/* Green pill badge */}
      <div style={{
        display: "flex", alignItems: "center", gap: "8px",
        background: "#F4F1EE", border: "1px solid #000000",
        borderRadius: "999px", padding: "6px 16px",
      }}>
        {/* Pulsing green dot */}
        <span style={{
          width: 8, height: 8, borderRadius: "50%", background: "#000000",
          display: "inline-block", flexShrink: 0,
          animation: "pulse-green 1.3s ease-in-out infinite",
        }} />
        <span style={{
          fontFamily: "Inter, sans-serif", fontWeight: 600,
          fontSize: "12px", color: "#000000",
        }}>
          Yael is online
        </span>
      </div>

      {/* Rotating subtitle */}
      <span style={{
        fontFamily: "Inter, sans-serif", fontWeight: 400,
        fontSize: "11px", color: "#B8B1A8",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease",
        minHeight: "16px",
      }}>
        {MESSAGES[msgIndex]}
      </span>

      <style>{`
        @keyframes pulse-green {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
      `}</style>
    </div>
  );
}