import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SMS_BODY = `Hi Sarah, your appointment is confirmed.
Date: Wednesday 18 Jun · 10:00
Doctor: Dr. Cohen
Treatment: Checkup
Please let us know 24h in advance if you need to cancel.
— Yael`;

const NOTIF = {
  title: "AskYael · now",
  subtitle: "New appointment booked",
  body: "Patient: Sarah Lévy · Wed 18 Jun · 10:00 · Dr. Cohen · Checkup",
};

const fadeVariants = {
  enter: { opacity: 0, y: 10, scale: 0.97 },
  center: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.97 },
};

export default function SmsStaffPatient() {
  const [view, setView] = useState(0); // 0 = SMS, 1 = Notification

  useEffect(() => {
    const interval = setInterval(() => {
      setView((p) => (p + 1) % 2);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const label = view === 0 ? "SMS to patient" : "Notification to clinic";

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", height: "100%", minHeight: "260px",
      padding: "12px 0",
    }}>

      {/* Label */}
      <motion.span
        key={`label-${view}`}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "9px",
          textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B6B6B",
          marginBottom: "16px",
        }}
      >
        {label}
      </motion.span>

      {/* Fixed-size content container to prevent layout shift */}
      <div style={{
        position: "relative", width: "100%", maxWidth: "280px",
        height: "180px", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <AnimatePresence mode="wait">
          {view === 0 ? (
            <motion.div
              key="sms"
              variants={fadeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: "absolute", width: "100%", display: "flex", justifyContent: "center" }}
            >
              <div style={{
                background: "#34C759",
                borderRadius: "16px 16px 4px 16px",
                padding: "14px 16px",
                maxWidth: "260px",
                width: "100%",
              }}>
                <div style={{
                  fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "12px",
                  color: "#FFFFFF", lineHeight: 1.55, whiteSpace: "pre-line",
                }}>
                  {SMS_BODY}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="notif"
              variants={fadeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: "absolute", width: "100%", display: "flex", justifyContent: "center" }}
            >
              <div style={{
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                borderRadius: "16px",
                padding: "14px 16px",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                display: "flex", gap: "10px", alignItems: "flex-start",
                maxWidth: "280px",
                width: "100%",
              }}>
                {/* App icon */}
                <div style={{
                  width: "26px", height: "26px", borderRadius: "6px",
                  background: "#FAFAFA", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ color: "#FFF", fontSize: "12px", fontWeight: 700, lineHeight: 1 }}>Y</span>
                </div>
                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "10px",
                    color: "#FAFAFA", marginBottom: "3px",
                  }}>
                    {NOTIF.title}
                  </div>
                  <div style={{
                    fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "11px",
                    color: "#FAFAFA", lineHeight: 1.35, marginBottom: "2px",
                  }}>
                    {NOTIF.subtitle}
                  </div>
                  <div style={{
                    fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px",
                    color: "#B8B8B8", lineHeight: 1.35,
                  }}>
                    {NOTIF.body}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}