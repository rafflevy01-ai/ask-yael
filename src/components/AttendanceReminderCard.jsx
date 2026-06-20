import React from "react";
import { useLanguage } from "@/lib/LanguageContext";

function ReminderRow({ tag, msg, isRtl }) {
  return (
    <div dir="ltr" style={{
      background: "rgba(250,250,252,0.94)", backdropFilter: "blur(40px) saturate(200%)",
      WebkitBackdropFilter: "blur(40px) saturate(200%)",
      borderRadius: "14px", padding: "10px 12px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
      width: "100%", maxWidth: "320px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "7px" }}>
        <div style={{ width: "20px", height: "20px", background: "#34c759", borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.73a16 16 0 006.72 6.72l1.06-1.16a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
        </div>
        <span style={{ fontSize: "10px", fontWeight: 600, color: "rgba(60,60,67,0.55)", letterSpacing: "0.05em", textTransform: "uppercase", flex: 1 }}>{tag}</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "10px", fontWeight: 600, color: "#1a8a3c" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#1a8a3c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </span>
      </div>
      <div dir={isRtl ? "rtl" : "ltr"} style={{
        fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "11.5px",
        color: "#0D0D0D", lineHeight: 1.45, textAlign: isRtl ? "right" : "left",
      }}>
        {msg}
      </div>
    </div>
  );
}

export default function AttendanceReminderCard() {
  const { t, isRtl } = useLanguage();
  const tp = t.problem;

  return (
    <div className="ps-card" style={{ background: "linear-gradient(180deg, #3A5A8C 0%, #5C7FB3 45%, #EAF0F7 100%)" }}>
      <div className="ps-card-top">
        <span className="ps-card-label" style={{ color: "rgba(255,255,255,0.7)" }}>{tp.remindLabel}</span>
        <div style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: "clamp(1.8rem,4vw,2.6rem)", color: "#FFFFFF", letterSpacing: "-0.05em", lineHeight: 1, marginBottom: "4px" }}>
          {tp.remindTitle}
        </div>
        <p style={{ fontFamily: "Inter,sans-serif", fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.75)", margin: 0 }}>
          {tp.remindSub}
        </p>
      </div>

      <div className="ps-card-visual" style={{ justifyContent: "center", alignItems: "center", gap: "12px", paddingBottom: "28px" }}>
        <ReminderRow tag={tp.remindDayBefore} msg={tp.remindDayBeforeMsg} isRtl={isRtl} />
        <ReminderRow tag={tp.remindSameDay} msg={tp.remindSameDayMsg} isRtl={isRtl} />
      </div>
    </div>
  );
}