import React, { useState, useEffect, useRef, useCallback } from "react";

const NOTIF_DATA = [
  { number: "+972 54 321 4567", time: "18:32" },
  { number: "+33 6 12 34 56 78", time: "19:15" },
  { number: "+972 52 876 5432", time: "20:07" },
  { number: "+972 58 234 5678", time: "21:44" },
  { number: "+972 50 111 2233", time: "22:18" },
];

const GAP = 10;
const OPACITIES = [1, 0.75, 0.45];

let idCounter = 0;

function Card({ data, topOffset, opacity, zIndex, entering, onHeightChange, cardId }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(() => {
      if (ref.current) onHeightChange(cardId, ref.current.offsetHeight);
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [cardId, onHeightChange]);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(40px) saturate(180%)",
        WebkitBackdropFilter: "blur(40px) saturate(180%)",
        borderRadius: "20px",
        padding: "12px 14px",
        boxSizing: "border-box",
        boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.6), 0 4px 24px rgba(0,0,0,0.06)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
        transition: "top 0.42s cubic-bezier(0.34,1.1,0.64,1), opacity 0.42s ease",
        top: entering ? "-80px" : `${topOffset}px`,
        opacity: entering ? 0 : opacity,
        zIndex,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
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
      <div style={{ fontSize: "15px", fontWeight: 600, color: "#000000" }}>Missed Call</div>
      <div style={{ fontSize: "15px", fontWeight: 400, color: "#3c3c3c", marginTop: "1px" }}>
        New Patient · {data.number}
      </div>
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
}

export default function NotifStack() {
  // cards[0] = top (newest), cards[2] = bottom (oldest)
  const [cards, setCards] = useState([]);
  const [heights, setHeights] = useState({});
  const [visible, setVisible] = useState(false);
  // tracks which card is "exiting" (fading out before recycling)
  const [exitingId, setExitingId] = useState(null);

  const wrapperRef = useRef(null);
  const indexRef = useRef(0);
  const startedRef = useRef(false);
  const cardsRef = useRef(cards);
  cardsRef.current = cards;

  const onHeightChange = useCallback((id, h) => {
    setHeights((prev) => (prev[id] === h ? prev : { ...prev, [id]: h }));
  }, []);

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

  useEffect(() => {
    if (!visible) return;

    function cycle() {
      const current = cardsRef.current;

      if (current.length < 3) {
        // Just add a new card at the top
        const data = NOTIF_DATA[indexRef.current % NOTIF_DATA.length];
        indexRef.current++;
        const id = ++idCounter;
        setCards((prev) => [{ id, data, entering: true }, ...prev.slice(0, 2)]);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            setCards((prev) =>
              prev.map((c) => (c.id === id ? { ...c, entering: false } : c))
            );
          })
        );
      } else {
        // Step 1: fade out the bottom card
        const bottomCard = current[current.length - 1];
        setExitingId(bottomCard.id);

        // Step 2: after fade-out, recycle it to the top with new data
        setTimeout(() => {
          const data = NOTIF_DATA[indexRef.current % NOTIF_DATA.length];
          indexRef.current++;
          const recycledId = ++idCounter;

          setExitingId(null);
          setCards((prev) => {
            // Remove bottom card, prepend recycled one as entering
            const rest = prev.slice(0, 2);
            return [{ id: recycledId, data, entering: true }, ...rest];
          });

          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              setCards((prev) =>
                prev.map((c) => (c.id === recycledId ? { ...c, entering: false } : c))
              );
            })
          );
        }, 420); // matches transition duration
      }
    }

    // Seed with first card immediately
    cycle();
    const interval = setInterval(cycle, 2500);
    return () => clearInterval(interval);
  }, [visible]);

  function getTopOffset(index) {
    let top = 0;
    for (let i = 0; i < index; i++) {
      top += (heights[cards[i]?.id] ?? 120) + GAP;
    }
    return top;
  }

  const totalHeight = cards.reduce((sum, c, i) => {
    return sum + (heights[c.id] ?? 120) + (i < cards.length - 1 ? GAP : 0);
  }, 0);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "relative",
        width: "340px",
        minHeight: "120px",
        height: Math.max(totalHeight, 120) + "px",
        pointerEvents: "none",
        transition: "height 0.42s cubic-bezier(0.34,1.1,0.64,1)",
      }}
    >
      {cards.map((card, i) => {
        const isExiting = card.id === exitingId;
        return (
          <Card
            key={card.id}
            cardId={card.id}
            data={card.data}
            entering={card.entering}
            topOffset={getTopOffset(i)}
            opacity={isExiting ? 0 : (OPACITIES[i] ?? 0.3)}
            zIndex={cards.length - i}
            onHeightChange={onHeightChange}
          />
        );
      })}
    </div>
  );
}