import React from "react";
import { useLanguage } from "@/lib/LanguageContext";

const RECEPTIONIST_IMG = "https://media.base44.com/images/public/6a2ab0818c0d050752d1521b/73b565a12_empowered-business-woman-office.jpg";
const CLIENT_IMG = "https://media.base44.com/images/public/6a2ab0818c0d050752d1521b/6446599f2_girl-student-is-talking-phone-home-conversation-phone.jpg";

function PersonPane({ img, objectPosition, tag, isRtl }) {
  return (
    <div style={{ position: "relative", flex: 1, minHeight: 0, overflow: "hidden" }}>
      <img
        src={img}
        alt={tag}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition }}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.35) 100%)" }} />
      <span dir={isRtl ? "rtl" : "ltr"} style={{
        position: "absolute", top: "10px", [isRtl ? "right" : "left"]: "12px",
        fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "10px",
        letterSpacing: "0.08em", textTransform: "uppercase", color: "#FFFFFF",
        background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)",
        padding: "4px 9px", borderRadius: "999px",
      }}>
        {tag}
      </span>
    </div>
  );
}

export default function AttendanceReminderCard() {
  const { t, isRtl } = useLanguage();
  const tp = t.problem;

  return (
    <div className="ps-card" style={{ background: "#0D0D0D", position: "relative" }}>
      {/* Split images */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
        <PersonPane img={RECEPTIONIST_IMG} objectPosition="center 25%" tag={tp.remindReceptionist} isRtl={isRtl} />
        <PersonPane img={CLIENT_IMG} objectPosition="center 30%" tag={tp.remindClient} isRtl={isRtl} />
      </div>

      {/* Center connecting call animation */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 3 }}>
        <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "44px", height: "44px", borderRadius: "50%", background: "rgba(52,199,89,0.35)", animation: "arc-ring 1.8s ease-out infinite" }} />
        <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "44px", height: "44px", borderRadius: "50%", background: "rgba(52,199,89,0.25)", animation: "arc-ring 1.8s ease-out infinite", animationDelay: "0.9s" }} />
        <div style={{ position: "relative", width: "44px", height: "44px", borderRadius: "50%", background: "#34c759", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(0,0,0,0.35)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.73a16 16 0 006.72 6.72l1.06-1.16a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
        </div>
      </div>

      {/* Top label overlay */}
      <div style={{ position: "relative", zIndex: 2, padding: "24px 28px 0" }}>
        <span style={{ fontFamily: "Inter,sans-serif", fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.85)", display: "block", marginBottom: "8px" }}>
          {tp.remindLabel}
        </span>
        <div style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: "clamp(1.8rem,4vw,2.6rem)", color: "#FFFFFF", letterSpacing: "-0.05em", lineHeight: 1, marginBottom: "4px" }}>
          {tp.remindTitle}
        </div>
        <p style={{ fontFamily: "Inter,sans-serif", fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.85)", margin: 0, maxWidth: "240px" }}>
          {tp.remindSub}
        </p>
      </div>

      {/* Bottom reminder pills */}
      <div style={{ position: "absolute", bottom: "20px", left: "20px", right: "20px", zIndex: 3, display: "flex", flexDirection: "column", gap: "8px" }}>
        <ReminderPill tag={tp.remindDayBefore} msg={tp.remindDayBeforeMsg} isRtl={isRtl} />
        <ReminderPill tag={tp.remindSameDay} msg={tp.remindSameDayMsg} isRtl={isRtl} />
      </div>

      <style>{`
        @keyframes arc-ring {
          0% { transform: translate(-50%,-50%) scale(1); opacity: 0.8; }
          100% { transform: translate(-50%,-50%) scale(2.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function ReminderPill({ tag, msg, isRtl }) {
  return (
    <div dir={isRtl ? "rtl" : "ltr"} style={{
      background: "rgba(255,255,255,0.94)", backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)", borderRadius: "12px", padding: "8px 11px",
      boxShadow: "0 4px 14px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", gap: "8px",
      textAlign: isRtl ? "right" : "left",
    }}>
      <span style={{ fontFamily: "Inter,sans-serif", fontWeight: 700, fontSize: "9px", letterSpacing: "0.04em", textTransform: "uppercase", color: "#1a8a3c", flexShrink: 0, whiteSpace: "nowrap" }}>
        {tag}
      </span>
      <span style={{ width: "1px", alignSelf: "stretch", background: "rgba(0,0,0,0.1)", flexShrink: 0 }} />
      <span style={{ fontFamily: "Inter,sans-serif", fontWeight: 400, fontSize: "10.5px", color: "#0D0D0D", lineHeight: 1.4, flex: 1, minWidth: 0 }}>
        {msg}
      </span>
    </div>
  );
}