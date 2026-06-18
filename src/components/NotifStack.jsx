import React, { useState, useEffect, useRef } from "react";

const NOTIF_DATA = [
  { number: "+972 54 321 4567", time: "18:32" },
  { number: "+33 6 12 34 56 78", time: "19:15" },
  { number: "+972 52 876 5432", time: "20:07" },
  { number: "+972 58 234 5678", time: "21:44" },
  { number: "+972 50 111 2233", time: "22:18" },
];

const MAX_CARDS = 2;
const PEEK = 18; // px each older card peeks below the one above it
let uid = 0;

function NotifCard({ data, index, total, entering }) {
  // index 0 = newest (top), higher index = older (further back)
  const scale = 1 - index * 0.03;
  const translateY = entering ? -140 : index * PEEK;
  const opacity = entering ? 0 : Math.max(0, 1 - index * 0.18);
  const zIndex = total - index;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        transform: `translateY(${translateY}px) scale(${scale})`,
        transformOrigin: "top center",
        opacity,
        zIndex,
        transition: "transform 0.45s cubic-bezier(0.34,1.1,0.64,1), opacity 0.38s ease",
        background: "rgba(250,250,252,0.94)",
        backdropFilter: "blur(40px) saturate(200%)",
        WebkitBackdropFilter: "blur(40px) saturate(200%)",
        borderRadius: "16px",
        padding: "11px 14px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
        <div style={{
          width: "16px", height: "16px", background: "#34c759", borderRadius: "4px",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.73a16 16 0 006.72 6.72l1.06-1.16a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
          </svg>
        </div>
        <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(60,60,67,0.55)", flex: 1, letterSpacing: "0.01em" }}>PHONE</span>
        <span style={{ fontSize: "11px", fontWeight: 400, color: "rgba(60,60,67,0.4)" }}>{data.time}</span>
      </div>

      {/* Title + body */}
      <div style={{ fontSize: "13px", fontWeight: 600, color: "#000", lineHeight: 1.35 }}>Missed Call</div>
      <div style={{ fontSize: "13px", fontWeight: 400, color: "rgba(60,60,67,0.75)", marginTop: "1px", lineHeight: 1.35 }}>
        {data.number}
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "7px", marginTop: "9px" }}>
        <div style={{
          flex: 1, height: "26px", background: "rgba(118,118,128,0.12)",
          borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "12px", fontWeight: 500, color: "#007aff",
        }}>
          Call Back
        </div>
        <div style={{
          flex: 1, height: "26px", background: "rgba(118,118,128,0.12)",
          borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "12px", fontWeight: 500, color: "#007aff",
        }}>
          Message
        </div>
      </div>
    </div>
  );
}

export default function NotifStack() {
  const [cards, setCards] = useState([]);
  const [entering, setEntering] = useState(null);
  const indexRef = useRef(0);

  function addCard() {
    const data = NOTIF_DATA[indexRef.current % NOTIF_DATA.length];
    indexRef.current++;
    const id = ++uid;

    setEntering(id);
    setCards((prev) => [{ id, data }, ...prev.slice(0, MAX_CARDS - 1)]);

    requestAnimationFrame(() =>
      requestAnimationFrame(() => setEntering(null))
    );
  }

  useEffect(() => {
    addCard();
    const interval = setInterval(addCard, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {cards.map((card, i) => (
        <NotifCard
          key={card.id}
          data={card.data}
          index={i}
          total={cards.length}
          entering={card.id === entering}
        />
      ))}
    </div>
  );
}