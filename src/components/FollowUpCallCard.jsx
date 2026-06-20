import React from "react";
import { useLanguage } from "@/lib/LanguageContext";

export default function FollowUpCallCard() {
  const { t, isRtl } = useLanguage();
  const tp = t.problem;

  return (
    <div className="ps-card" style={{ background: "linear-gradient(180deg, #2C5F4E 0%, #3E7A63 45%, #EAF2EE 100%)" }}>
      <div className="ps-card-top">
        <span className="ps-card-label" style={{ color: "rgba(255,255,255,0.7)" }}>{tp.followLabel}</span>
        <div style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: "clamp(1.8rem,4vw,2.6rem)", color: "#FFFFFF", letterSpacing: "-0.05em", lineHeight: 1, marginBottom: "4px" }}>
          {tp.followTitle}
        </div>
        <p style={{ fontFamily: "Inter,sans-serif", fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.75)", margin: 0 }}>
          {tp.followSub}
        </p>
      </div>

      <div className="ps-card-visual" style={{ justifyContent: "center", alignItems: "center", gap: "12px", paddingBottom: "28px" }}>
        {/* Outgoing call banner */}
        <div dir="ltr" style={{
          background: "rgba(250,250,252,0.94)", backdropFilter: "blur(40px) saturate(200%)",
          WebkitBackdropFilter: "blur(40px) saturate(200%)",
          borderRadius: "16px", padding: "11px 14px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
          width: "100%", maxWidth: "320px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "30px", height: "30px", background: "#34c759", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.73a16 16 0 006.72 6.72l1.06-1.16a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "rgba(60,60,67,0.55)", letterSpacing: "0.04em", textTransform: "uppercase" }}>{tp.followCallStatus}</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#000", lineHeight: 1.3 }}>{tp.followCalling}</div>
              <div style={{ fontSize: "12px", fontWeight: 400, color: "rgba(60,60,67,0.6)" }}>{tp.followNumber}</div>
            </div>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#34c759", animation: "fuc-pulse 1.4s ease-in-out infinite", flexShrink: 0 }} />
          </div>
        </div>

        {/* Yael's message bubble */}
        <div style={{ width: "100%", maxWidth: "320px", display: "flex", justifyContent: isRtl ? "flex-end" : "flex-start" }}>
          <div dir={isRtl ? "rtl" : "ltr"} style={{
            background: "#FFFFFF",
            borderRadius: isRtl ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
            padding: "10px 13px", maxWidth: "90%",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "12px",
            color: "#0D0D0D", lineHeight: 1.5,
            textAlign: isRtl ? "right" : "left",
          }}>
            {tp.followMsg}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fuc-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}