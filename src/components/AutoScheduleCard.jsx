import React from "react";
import { useLanguage } from "@/lib/LanguageContext";

// Self-contained booking rows (no external assets). Names are neutral
// placeholders that read naturally in any of the supported languages.
const SLOTS = [
  { time: "09:00", name: "Daniel R." },
  { time: "10:30", name: "Maya L." },
  { time: "12:00", name: "Noa B." },
  { time: "14:15", name: "Yossi K." },
  { time: "16:00", name: "Sarah T." },
];

export default function AutoScheduleCard() {
  const { t } = useLanguage();
  const tp = t.problem;

  return (
    <div className="ps-card" style={{ background: "linear-gradient(180deg, #95C7C9 0%, #BCDDDE 50%, #FFFFFF 100%)" }}>
      <div className="ps-card-top">
        <span className="ps-card-label" style={{ color: "rgba(255,255,255,0.7)" }}>{tp.scheduleLabel}</span>
        <div style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: "clamp(1.8rem,4vw,2.6rem)", color: "#FFFFFF", letterSpacing: "-0.05em", lineHeight: 1, marginBottom: "8px" }}>
          {tp.scheduleTitle}
        </div>
        <p style={{ fontFamily: "Inter,sans-serif", fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.75)", margin: 0 }}>
          {tp.scheduleSub}
        </p>
      </div>

      <div className="ps-card-visual" style={{ padding: "0 20px 20px", justifyContent: "flex-end" }}>
        <div dir="ltr" style={{
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: "0 6px 24px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.06)",
          background: "#FFFFFF",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', Inter, sans-serif",
        }}>
          {/* Calendar header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 14px", borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#0D0D0D" }}>Today</span>
            <span style={{
              fontSize: "10px", fontWeight: 600, letterSpacing: "0.04em",
              textTransform: "uppercase", color: "#1a8a3c",
              background: "rgba(52,199,89,0.14)", borderRadius: "999px", padding: "3px 8px",
            }}>Auto-booked</span>
          </div>

          {/* Slots */}
          <div style={{ padding: "6px 0" }}>
            {SLOTS.map((slot, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "9px 14px",
                borderBottom: i < SLOTS.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
              }}>
                <span style={{ fontSize: "11px", fontWeight: 500, color: "rgba(60,60,67,0.5)", width: "40px", flexShrink: 0 }}>
                  {slot.time}
                </span>
                <div style={{
                  flex: 1, minWidth: 0,
                  background: "rgba(0,122,255,0.08)",
                  borderLeft: "3px solid #007aff",
                  borderRadius: "6px",
                  padding: "6px 10px",
                }}>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#0D0D0D" }}>{slot.name}</span>
                </div>
                <div style={{
                  width: "16px", height: "16px", borderRadius: "50%",
                  background: "#34c759", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
