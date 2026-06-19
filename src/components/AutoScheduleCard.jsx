import React, { useState } from "react";

const CALENDAR_IMG = "https://media.base44.com/images/public/6a2ab0818c0d050752d1521b/670cd3c0b_Booking_calendar_with_names_li_Nano_Banana_2_49359-removebg-preview.png";

export default function AutoScheduleCard() {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="ps-card" style={{ background: "linear-gradient(180deg, #95C7C9 0%, #BCDDDE 50%, #FFFFFF 100%)" }}>
      <div className="ps-card-top">
        <span className="ps-card-label" style={{ color: "rgba(255,255,255,0.7)" }}>Always On The Calendar</span>
        <div style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: "clamp(1.8rem,4vw,2.6rem)", color: "#FFFFFF", letterSpacing: "-0.05em", lineHeight: 1, marginBottom: "8px" }}>
          Written down for you.
        </div>
        <p style={{ fontFamily: "Inter,sans-serif", fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.75)", margin: 0 }}>
          Every appointment logged automatically
        </p>
      </div>

      <div className="ps-card-visual" style={{ padding: "0 20px 20px", justifyContent: "flex-end" }}>
        <div style={{
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 6px 24px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.06)",
          background: "#FFFFFF",
        }}>
          <img
            src={CALENDAR_IMG}
            alt="Clinic booking calendar automatically filled by Yael"
            onLoad={() => setImgLoaded(true)}
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              objectFit: "cover",
              opacity: imgLoaded ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}