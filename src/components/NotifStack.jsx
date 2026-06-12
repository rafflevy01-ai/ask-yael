import React, { useState, useEffect, useRef } from "react";

const NOTIF_DATA = [
  { number: "+972 54 321 4567", time: "18:32" },
  { number: "+33 6 12 34 56 78", time: "19:15" },
  { number: "+972 52 876 5432", time: "20:07" },
  { number: "+972 58 234 5678", time: "21:44" },
  { number: "+972 50 111 2233", time: "22:18" },
];

// Stack positions
const POSITIONS = [
  { transform: "translateY(0) scale(1)",    zIndex: 3, opacity: 1    }, // pos 0 — top
  { transform: "translateY(9px) scale(0.95)", zIndex: 2, opacity: 0.85 }, // pos 1
  { transform: "translateY(16px) scale(0.90)", zIndex: 1, opacity: 0.6  }, // pos 2
];

let idCounter = 0;

export default function NotifStack() {
  const [cards, setCards] = useState([]);
  const [visible, setVisible] = useState(false);
  const wrapperRef = useRef(null);
  const indexRef = useRef(0);
  const startedRef = useRef(false);

  // IntersectionObserver to start animation when section is visible
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Start cycling once visible
  useEffect(() => {
    if (!visible) return;

    function addCard() {
      const data = NOTIF_DATA[indexRef.current % NOTIF_DATA.length];
      indexRef.current++;
      const id = ++idCounter;
      setCards((prev) => [{ id, data, entering: true }, ...prev.slice(0, 2)]);
      // Remove entering flag after one frame so transition fires
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === id ? { ...c, entering: false } : c))
          );
        })
      );
    }

    // First card immediately
    addCard();
    const interval = setInterval(addCard, 2500);
    return () => clearInterval(interval);
  }, [visible]);

  return (
    <div
      ref={wrapperRef}
      style={{ position: "relative", width: "340px", height: "220px", pointerEvents: "none" }}
    >
      {cards.map((card, i) => {
        const pos = card.entering ? null : POSITIONS[i];
        const style = card.entering
          ? {
              transform: "translateY(-80px) scale(1)",
              opacity: 0,
              zIndex: 3,
            }
          : pos
          ? { transform: pos.transform, opacity: pos.opacity, zIndex: pos.zIndex }
          : { opacity: 0, transform: "translateY(16px) scale(0.90)", zIndex: 0 };

        return (
          <div
            key={card.id}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              background: "rgba(255,255,255,0.82)",
              backdropFilter: "blur(40px) saturate(180%)",
              WebkitBackdropFilter: "blur(40px) saturate(180%)",
              borderRadius: "20px",
              padding: "12px 14px",
              boxSizing: "border-box",
              boxShadow:
                "inset 0 0 0 0.5px rgba(255,255,255,0.6), 0 4px 24px rgba(0,0,0,0.06)",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
              transition:
                "transform 0.42s cubic-bezier(0.34,1.1,0.64,1), opacity 0.42s ease",
              ...style,
            }}
          >
            {/* Row 1 — header */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  background: "#34c759",
                  borderRadius: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.73a16 16 0 006.72 6.72l1.06-1.16a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
              </div>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(60,60,67,0.6)", flex: 1 }}>Phone</span>
              <span style={{ fontSize: "12px", fontWeight: 400, color: "rgba(60,60,67,0.4)" }}>{card.data.time}</span>
              <span style={{ fontSize: "14px", color: "rgba(60,60,67,0.3)", marginLeft: "4px" }}>›</span>
            </div>

            {/* Row 2 */}
            <div style={{ fontSize: "15px", fontWeight: 600, color: "#000000" }}>Missed Call</div>

            {/* Row 3 */}
            <div style={{ fontSize: "15px", fontWeight: 400, color: "#3c3c3c", marginTop: "1px" }}>
              New Patient · {card.data.number}
            </div>

            {/* Row 4 — actions */}
            <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
              <div style={{ flex: 1, height: "32px", background: "rgba(0,0,0,0.05)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 500, color: "#007aff" }}>
                Call Back
              </div>
              <div style={{ flex: 1, height: "32px", background: "rgba(0,0,0,0.05)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 500, color: "#007aff" }}>
                Message
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}