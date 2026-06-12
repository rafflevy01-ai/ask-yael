import React, { useState, useEffect, useRef } from "react";

const NOTIF_DATA = [
  { number: "+972 54 321 4567", time: "18:32" },
  { number: "+33 6 12 34 56 78", time: "19:15" },
  { number: "+972 52 876 5432", time: "20:07" },
  { number: "+972 58 234 5678", time: "21:44" },
  { number: "+972 50 111 2233", time: "22:18" },
];

const CARD_HEIGHT = 100; // px per card (approx)
const GAP = 10;
const SLOT = CARD_HEIGHT + GAP;
const MAX_VISIBLE = 3;

let uid = 0;

function NotifCard({ data, slot, opacity, entering, exiting }) {
  const top = entering ? -CARD_HEIGHT - GAP : exiting ? MAX_VISIBLE * SLOT : slot * SLOT;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: `${top}px`,
        opacity: exiting ? 0 : opacity,
        transition: "top 0.45s cubic-bezier(0.34,1.1,0.64,1), opacity 0.45s ease",
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderRadius: "18px",
        padding: "12px 14px",
        boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.6), 0 4px 20px rgba(0,0,0,0.07)",
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

// Each card: { id, data, slot (0=top), entering, exiting }
export default function NotifStack() {
  const [cards, setCards] = useState([]);
  const indexRef = useRef(0);
  const timerRef = useRef(null);

  function addCard() {
    const data = NOTIF_DATA[indexRef.current % NOTIF_DATA.length];
    indexRef.current++;
    const id = ++uid;

    // Insert new card as entering (slot 0), shift all others down
    setCards((prev) => {
      const shifted = prev.map((c) => ({ ...c, slot: c.slot + 1, entering: false, exiting: c.slot >= MAX_VISIBLE - 1 }));
      return [{ id, data, slot: 0, entering: true, exiting: false }, ...shifted];
    });

    // After one frame: stop entering flag for new card
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setCards((prev) => prev.map((c) => (c.id === id ? { ...c, entering: false } : c)));
      })
    );

    // After transition: remove exited cards
    setTimeout(() => {
      setCards((prev) => prev.filter((c) => !c.exiting));
    }, 500);
  }

  useEffect(() => {
    // Seed immediately then loop
    addCard();
    timerRef.current = setInterval(addCard, 2200);
    return () => clearInterval(timerRef.current);
  }, []);

  const opacities = [1, 0.65, 0.3];

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {cards.map((card) => (
        <NotifCard
          key={card.id}
          data={card.data}
          slot={card.slot}
          opacity={opacities[card.slot] ?? 0}
          entering={card.entering}
          exiting={card.exiting}
        />
      ))}
    </div>
  );
}