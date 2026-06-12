import React, { useState, useEffect, useRef } from "react";

const NOTIF_DATA = [
  { number: "+972 54 321 4567", time: "18:32" },
  { number: "+33 6 12 34 56 78", time: "19:15" },
  { number: "+972 52 876 5432", time: "20:07" },
  { number: "+972 58 234 5678", time: "21:44" },
  { number: "+972 50 111 2233", time: "22:18" },
];

// iOS stacking: newer card sits ON TOP of older card, slightly peeking behind
const PEEK = 28; // px of older card visible below newer card
let uid = 0;

function NotifCard({ data, index, total, entering, exiting }) {
  // index 0 = newest (top), index 1 = older (slightly behind/below)
  const scale = 1 - index * 0.04;
  const translateY = entering ? -120 : exiting ? -120 : index * PEEK;
  const opacity = entering ? 0 : exiting ? 0 : index === 0 ? 1 : 0.75;
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
        transition: entering || exiting
          ? "transform 0.42s cubic-bezier(0.34,1.1,0.64,1), opacity 0.35s ease"
          : "transform 0.42s cubic-bezier(0.34,1.1,0.64,1), opacity 0.35s ease",
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(32px) saturate(180%)",
        WebkitBackdropFilter: "blur(32px) saturate(180%)",
        borderRadius: "20px",
        padding: "12px 14px",
        boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.7), 0 6px 24px rgba(0,0,0,0.10)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "5px" }}>
        <div style={{
          width: "18px", height: "18px", background: "#34c759", borderRadius: "5px",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.73a16 16 0 006.72 6.72l1.06-1.16a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
          </svg>
        </div>
        <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(60,60,67,0.6)", flex: 1 }}>Phone</span>
        <span style={{ fontSize: "12px", fontWeight: 400, color: "rgba(60,60,67,0.4)" }}>{data.time}</span>
        <span style={{ fontSize: "14px", color: "rgba(60,60,67,0.3)", marginLeft: "4px" }}>›</span>
      </div>
      <div style={{ fontSize: "14px", fontWeight: 600, color: "#000" }}>Missed Call</div>
      <div style={{ fontSize: "13px", fontWeight: 400, color: "#3c3c3c", marginTop: "1px" }}>
        New Patient · {data.number}
      </div>
      <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
        <div style={{ flex: 1, height: "28px", background: "rgba(0,0,0,0.05)", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 500, color: "#007aff" }}>
          Call Back
        </div>
        <div style={{ flex: 1, height: "28px", background: "rgba(0,0,0,0.05)", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 500, color: "#007aff" }}>
          Message
        </div>
      </div>
    </div>
  );
}

export default function NotifStack() {
  // cards[0] = newest on top, cards[1] = older behind
  const [cards, setCards] = useState([]);
  const [entering, setEntering] = useState(null); // id of entering card
  const indexRef = useRef(0);

  function addCard() {
    const data = NOTIF_DATA[indexRef.current % NOTIF_DATA.length];
    indexRef.current++;
    const id = ++uid;

    // Add new card as "entering" (slides in from top)
    setEntering(id);
    setCards((prev) => [{ id, data }, ...prev.slice(0, 1)]);

    // Next frame: clear entering flag so it transitions to resting position
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setEntering(null))
    );
  }

  useEffect(() => {
    // Seed first card immediately, then loop
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
          exiting={false}
        />
      ))}
    </div>
  );
}