import React from "react";

const NOTIF_STEPS = [
  {
    step: 0,
    type: "incoming-call",
    appIcon: (
      <div style={{
        width: "20px", height: "20px", background: "#34c759", borderRadius: "5px",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.73a16 16 0 006.72 6.72l1.06-1.16a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
        </svg>
      </div>
    ),
    appName: "Phone",
    timestamp: "now",
    title: "David Cohen",
    subtitle: "Yael answering in Hebrew...",
    buttons: [
      { label: "Decline", bg: "rgba(235,77,61,0.18)", color: "#eb4d3d" },
      { label: "Accept", bg: "rgba(52,199,89,0.18)", color: "#34c759", icon: "accept" },
    ],
  },
  {
    step: 1,
    type: "sms-banner",
    appIcon: (
      <div style={{
        width: "20px", height: "20px", background: "#007aff", borderRadius: "5px",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      </div>
    ),
    appName: "Yael",
    timestamp: "now",
    title: "Patient Found",
    subtitle: "David Cohen — returning patient. Last visit: March 2026",
    buttons: null,
    isSms: true,
  },
  {
    step: 2,
    type: "sms-banner",
    appIcon: (
      <div style={{
        width: "20px", height: "20px", background: "#34c759", borderRadius: "5px",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    ),
    appName: "Yael",
    timestamp: "now",
    title: "Appointment Confirmed",
    subtitle: "Thursday 15 July at 10:00 — SMS sent to patient",
    buttons: null,
    isSms: true,
  },
  {
    step: 3,
    type: "sms-banner",
    appIcon: (
      <div style={{
        width: "20px", height: "20px", background: "#5856d6", borderRadius: "5px",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 4v6h-6" />
          <path d="M1 20v-6h6" />
          <path d="M3.51 9a9 9 0 0114.85-3.36L23 10" />
          <path d="M1 14l4.64 4.36A9 9 0 0020.49 15" />
        </svg>
      </div>
    ),
    appName: "Yael",
    timestamp: "now",
    title: "CRM Synced",
    subtitle: "Appointment logged in clinic system — no double entry needed",
    buttons: null,
    isSms: true,
  },
  {
    step: 4,
    type: "sms-banner",
    appIcon: (
      <div style={{
        width: "20px", height: "20px", background: "#ff9500", borderRadius: "5px",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      </div>
    ),
    appName: "Messages",
    timestamp: "now",
    title: "Clinic Staff Notified",
    subtitle: "Booking logged. Full summary sent to your team.",
    buttons: null,
    isSms: true,
  },
];

export { NOTIF_STEPS };

const cardBase = {
  background: "rgba(250,250,252,0.94)",
  backdropFilter: "blur(40px) saturate(200%)",
  WebkitBackdropFilter: "blur(40px) saturate(200%)",
  borderRadius: "16px",
  padding: "14px 16px",
  boxShadow: "0 2px 12px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",
  boxSizing: "border-box",
  maxWidth: "340px",
  minHeight: "124px",
  display: "flex",
  flexDirection: "column",
};

function CardHeader({ appIcon, appName, timestamp }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
      {appIcon}
      <span style={{ fontSize: "12px", fontWeight: 500, color: "rgba(60,60,67,0.55)", flex: 1, letterSpacing: "-0.01em" }}>
        {appName}
      </span>
      <span style={{ fontSize: "11px", fontWeight: 400, color: "rgba(60,60,67,0.4)" }}>
        {timestamp}
      </span>
    </div>
  );
}

function AcceptIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34c759" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.73a16 16 0 006.72 6.72l1.06-1.16a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

export default function IosNotifCard({ stepIndex, visible = true, cardStyle }) {
  if (stepIndex < 0 || stepIndex >= NOTIF_STEPS.length) return null;
  const data = NOTIF_STEPS[stepIndex];

  return (
    <div
      style={{
        ...cardBase,
        ...cardStyle,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.7s ease",
        pointerEvents: "none",
      }}
    >
      <CardHeader appIcon={data.appIcon} appName={data.appName} timestamp={data.timestamp} />

      {data.type === "incoming-call" && (
        <>
          <div style={{ fontSize: "15px", fontWeight: 600, color: "#000", lineHeight: 1.25, marginBottom: "2px" }}>
            {data.title}
          </div>
          <div style={{ fontSize: "13px", fontWeight: 400, color: "rgba(60,60,67,0.65)", lineHeight: 1.25, marginBottom: "6px", flex: 1 }}>
            {data.subtitle}
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{
              flex: 1, height: "28px", background: data.buttons[0].bg,
              borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: "13px", fontWeight: 500, color: data.buttons[0].color }}>{data.buttons[0].label}</span>
            </div>
            <div style={{
              flex: 1, height: "28px", background: data.buttons[1].bg,
              borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px",
            }}>
              {data.buttons[1].icon === "accept" && <AcceptIcon />}
              <span style={{ fontSize: "13px", fontWeight: 500, color: data.buttons[1].color }}>{data.buttons[1].label}</span>
            </div>
          </div>
        </>
      )}

      {data.type === "notification" && (
        <>
          <div style={{ fontSize: "15px", fontWeight: 600, color: "#000", lineHeight: 1.25, marginBottom: "2px" }}>
            {data.title}
          </div>
          <div style={{ fontSize: "13px", fontWeight: 400, color: "rgba(60,60,67,0.65)", lineHeight: 1.25, flex: 1 }}>
            {data.subtitle}
          </div>
        </>
      )}

      {data.type === "sms-banner" && (
        <div style={{
          background: "rgba(118,118,128,0.08)", borderRadius: "10px", padding: "10px 12px", marginTop: "2px", flex: 1,
        }}>
          <div style={{ fontSize: "15px", fontWeight: 600, color: "#000", lineHeight: 1.25, marginBottom: "2px" }}>
            {data.title}
          </div>
          <div style={{ fontSize: "13px", fontWeight: 400, color: "rgba(60,60,67,0.65)", lineHeight: 1.25 }}>
            {data.subtitle}
          </div>
        </div>
      )}
    </div>
  );
}