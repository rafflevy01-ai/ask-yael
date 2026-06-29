import React, { useState, useEffect, useRef } from "react";

// Light, polished patient-recognition animation that mirrors HelloWords in
// look & feel: a soft scanning sweep over an abstract avatar, then a clean
// "identified" state with the matched patient details — looping forever.

const PATIENTS = [
  { name: "Sarah Cohen", id: "ID 4821" },
  { name: "David Levi", id: "ID 7390" },
  { name: "Maya Adler", id: "ID 1265" },
];

const CYCLE_MS = 3600; // full scan → match → reset loop

export default function PatientScan() {
  const [phase, setPhase] = useState("scanning"); // scanning | matched
  const [patientIdx, setPatientIdx] = useState(0);
  const timers = useRef([]);

  useEffect(() => {
    const run = () => {
      setPhase("scanning");
      timers.current.push(setTimeout(() => setPhase("matched"), 1900));
      timers.current.push(setTimeout(() => {
        setPatientIdx((i) => (i + 1) % PATIENTS.length);
      }, CYCLE_MS));
    };
    run();
    const interval = setInterval(run, CYCLE_MS);
    return () => {
      clearInterval(interval);
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  const patient = PATIENTS[patientIdx];
  const matched = phase === "matched";

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "100%",
      minHeight: "190px",
      background: "#FFFFFF",
      borderRadius: "14px",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "14px",
    }}>
      {/* Avatar + scan frame */}
      <div style={{ position: "relative", width: "72px", height: "72px" }}>
        {/* corner brackets */}
        {[
          { top: 0, left: 0, borderTop: true, borderLeft: true },
          { top: 0, right: 0, borderTop: true, borderRight: true },
          { bottom: 0, left: 0, borderBottom: true, borderLeft: true },
          { bottom: 0, right: 0, borderBottom: true, borderRight: true },
        ].map((c, i) => (
          <div key={i} style={{
            position: "absolute",
            width: "14px",
            height: "14px",
            top: c.top, left: c.left, right: c.right, bottom: c.bottom,
            borderTop: c.borderTop ? "2px solid" : "none",
            borderBottom: c.borderBottom ? "2px solid" : "none",
            borderLeft: c.borderLeft ? "2px solid" : "none",
            borderRight: c.borderRight ? "2px solid" : "none",
            borderColor: matched ? "#22c55e" : "#0D0D0D",
            borderRadius: "3px",
            transition: "border-color 0.4s ease",
          }} />
        ))}

        {/* avatar circle */}
        <div style={{
          position: "absolute",
          inset: "10px",
          borderRadius: "9999px",
          background: "linear-gradient(135deg, #f5f5f5 0%, #ececec 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" fill={matched ? "#0D0D0D" : "#c8c8c8"} style={{ transition: "fill 0.4s ease" }} />
            <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" fill={matched ? "#0D0D0D" : "#c8c8c8"} style={{ transition: "fill 0.4s ease" }} />
          </svg>

          {/* scanning sweep */}
          {!matched && (
            <div style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: "30%",
              background: "linear-gradient(to bottom, rgba(13,13,13,0) 0%, rgba(13,13,13,0.18) 50%, rgba(13,13,13,0) 100%)",
              animation: "patient-scan 1.5s ease-in-out infinite",
            }} />
          )}

          {/* match check */}
          {matched && (
            <div style={{
              position: "absolute",
              inset: 0,
              background: "rgba(34,197,94,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "patient-pop 0.4s ease",
            }}>
              <div style={{
                width: "26px", height: "26px", borderRadius: "9999px",
                background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status text */}
      <div style={{ textAlign: "center", minHeight: "34px" }}>
        {matched ? (
          <div style={{ animation: "patient-fade 0.4s ease" }}>
            <div style={{
              fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "14px",
              color: "#0D0D0D", letterSpacing: "-0.01em", lineHeight: 1.3,
            }}>{patient.name}</div>
            <div style={{
              fontFamily: "'Geist Mono', monospace", fontSize: "11px", color: "#a59f97", marginTop: "2px",
            }}>{patient.id}</div>
          </div>
        ) : (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "12px", color: "#777169",
          }}>
            <span style={{
              width: "6px", height: "6px", borderRadius: "9999px", background: "#0D0D0D",
              animation: "patient-blink 1s ease-in-out infinite",
            }} />
            Identifying caller…
          </div>
        )}
      </div>

      <style>{`
        @keyframes patient-scan {
          0%   { top: -10%; }
          100% { top: 90%; }
        }
        @keyframes patient-pop {
          from { transform: scale(0.7); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        @keyframes patient-fade {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes patient-blink {
          0%, 100% { opacity: 0.3; }
          50%      { opacity: 1; }
        }
      `}</style>
    </div>
  );
}