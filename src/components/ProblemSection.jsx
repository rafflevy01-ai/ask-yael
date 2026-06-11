import React, { useEffect, useRef } from "react";

export default function ProblemSection() {
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    // --- Scroll-jacking ---
    (function () {
      const isMobile = window.innerWidth < 768;

      const section = document.getElementById("problem-section");
      const track = document.getElementById("panels-track");
      const dots = [0, 1, 2, 3].map((i) => document.getElementById("dot-" + i));
      let barAnimated = false;

      function updateScroll() {
        if (!section || !track) return;
        const rect = section.getBoundingClientRect();
        const scrolled = -rect.top;
        const totalScroll = section.offsetHeight - window.innerHeight;
        const progress = Math.max(0, Math.min(1, scrolled / totalScroll));

        if (!isMobile) {
          track.style.transform =
            "translateX(-" + progress * window.innerWidth * 3 + "px)";
        }

        const activePanel = Math.min(3, Math.floor(progress * 4 + 0.05));
        dots.forEach((dot, i) => {
          if (!dot) return;
          dot.style.background = i === activePanel ? "#000000" : "#e5e5e5";
          dot.style.transform = i === activePanel ? "scale(1.3)" : "scale(1)";
        });

        if (activePanel === 1 && !barAnimated) {
          barAnimated = true;
          if (typeof window.animateBars === 'function') window.animateBars();
        }
      }

      if (!isMobile) {
        window.addEventListener("scroll", updateScroll, { passive: true });
      }
      updateScroll();
    })();

    // --- Notifications ---
    (function () {
      const notifData = [
        { number: "+972 54 321 4567", time: "18:32" },
        { number: "+33 6 12 34 56 78", time: "19:15" },
        { number: "+972 52 876 5432", time: "20:07" },
        { number: "+972 58 234 5678", time: "21:44" },
        { number: "+972 50 111 2233", time: "22:18" },
      ];
      let notifIndex = 0;
      let activeCards = [];
      const stack = document.getElementById("notif-stack");
      if (!stack) return;

      function createCard(data) {
        const card = document.createElement("div");
        card.style.cssText =
          "position:absolute;top:0;left:0;right:0;" +
          "background:rgba(255,255,255,0.82);" +
          "backdrop-filter:blur(40px) saturate(180%);" +
          "-webkit-backdrop-filter:blur(40px) saturate(180%);" +
          "border-radius:20px;padding:12px 14px;box-sizing:border-box;" +
          "box-shadow:inset 0 0 0 0.5px rgba(255,255,255,0.6),0 4px 24px rgba(0,0,0,0.06);" +
          "font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif;" +
          "transition:transform 0.42s cubic-bezier(0.34,1.1,0.64,1),opacity 0.42s ease;" +
          "transform:translateY(-80px) scale(1);opacity:0;";
        card.innerHTML =
          // Row 1 — header
          '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">' +
            '<div style="width:18px;height:18px;background:#34c759;border-radius:5px;display:flex;align-items:center;justify-content:center;flex-shrink:0">' +
              '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.73a16 16 0 006.72 6.72l1.06-1.16a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>' +
            '</div>' +
            '<span style="font-size:12px;font-weight:600;color:rgba(60,60,67,0.6);flex:1">Phone</span>' +
            '<span style="font-size:12px;font-weight:400;color:rgba(60,60,67,0.4)">' + data.time + '</span>' +
            '<span style="font-size:14px;color:rgba(60,60,67,0.3);margin-left:4px">›</span>' +
          '</div>' +
          // Row 2
          '<div style="font-size:15px;font-weight:600;color:#000000">Missed Call</div>' +
          // Row 3
          '<div style="font-size:15px;font-weight:400;color:#3c3c3c;margin-top:1px">New Patient · ' + data.number + '</div>' +
          // Row 4 — actions
          '<div style="display:flex;gap:8px;margin-top:10px">' +
            '<div style="flex:1;height:32px;background:rgba(0,0,0,0.05);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:500;color:#007aff">Call Back</div>' +
            '<div style="flex:1;height:32px;background:rgba(0,0,0,0.05);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:500;color:#007aff">Message</div>' +
          '</div>';
        return card;
      }

      function addNotification() {
        activeCards.forEach((card, i) => {
          const np = i + 1;
          if (np >= 3) {
            card.style.opacity = "0";
            setTimeout(
              () => card.parentNode && card.parentNode.removeChild(card),
              450
            );
            activeCards.splice(i, 1);
          } else if (np === 1) {
            card.style.transform = "translateY(9px) scale(0.95)";
            card.style.zIndex = "2";
            card.style.opacity = "0.85";
          } else {
            card.style.transform = "translateY(16px) scale(0.90)";
            card.style.zIndex = "1";
            card.style.opacity = "0.6";
          }
        });
        const card = createCard(notifData[notifIndex % notifData.length]);
        stack.appendChild(card);
        activeCards.unshift(card);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            card.style.transform = "translateY(0) scale(1)";
            card.style.opacity = "1";
            card.style.zIndex = "3";
            card.style.transition = "transform 0.42s cubic-bezier(0.34,1.1,0.64,1), opacity 0.42s ease";
          })
        );
        notifIndex++;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              setTimeout(addNotification, 600);
              const interval = setInterval(addNotification, 2500);
              observer.disconnect();
              // store interval so it doesn't leak
              window.__yaelNotifInterval = interval;
            }
          });
        },
        { threshold: 0.3 }
      );
      const s = document.getElementById("problem-section");
      if (s) observer.observe(s);
    })();

    // --- Calculator ---
    (function () {
      const ss = document.getElementById("salary-slider");
      const cs = document.getElementById("count-slider");
      const sd = document.getElementById("salary-display");
      const cd = document.getElementById("count-display");
      const mo = document.getElementById("monthly-output");
      const ao = document.getElementById("annual-output");
      function fmt(n) {
        return "₪" + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      function update() {
        if (!ss || !cs) return;
        const salary = parseInt(ss.value);
        const count = parseInt(cs.value);
        const monthly = salary * count;
        if (sd) sd.textContent = fmt(salary) + " / month";
        if (cd) cd.textContent = count;
        if (mo) mo.textContent = fmt(monthly);
        if (ao) ao.textContent = fmt(monthly * 12) + " / year";
        const sp = ((salary - 6000) / 6000) * 100;
        const cp = ((count - 1) / 4) * 100;
        ss.style.background =
          "linear-gradient(to right,#000 " + sp + "%,#e5e5e5 " + sp + "%)";
        cs.style.background =
          "linear-gradient(to right,#000 " + cp + "%,#e5e5e5 " + cp + "%)";
      }
      if (ss) ss.addEventListener("input", update);
      if (cs) cs.addEventListener("input", update);
      update();
    })();
  }, []);

  // Business hours bars
  const businessBars = [
    { time: "08:00", h: 65 },
    { time: "09:00", h: 95 },
    { time: "10:00", h: 85 },
    { time: "11:00", h: 60 },
    { time: "12:00", h: 40 },
    { time: "13:00", h: 50 },
    { time: "14:00", h: 70 },
    { time: "15:00", h: 65 },
    { time: "16:00", h: 55 },
    { time: "17:00", h: 45 },
  ];
  const afterHoursBars = [
    { time: "18:00", h: 6 },
    { time: "19:00", h: 5 },
    { time: "20:00", h: 4 },
    { time: "21:00", h: 3 },
    { time: "22:00", h: 2 },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300&family=Inter:wght@400;500&family=Geist+Mono:wght@400&display=swap');

        #problem-section {
          position: relative;
          height: 500vh;
          background: transparent;
        }
        #problem-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
          background: #fdfcfc;
        }
        #panels-track {
          display: flex;
          width: 400vw;
          height: 100%;
          will-change: transform;
          transition: none;
        }
        .problem-panel {
          width: 100vw;
          height: 100vh;
          flex-shrink: 0;
        }
        .problem-dots {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 12px;
          z-index: 10;
        }
        .problem-dot {
          width: 8px;
          height: 8px;
          background: #e5e5e5;
          border-radius: 9999px;
          transition: background 0.3s ease, transform 0.3s ease;
        }
        .problem-label {
          position: absolute;
          top: 40px;
          left: 64px;
          z-index: 10;
          font-family: Inter, sans-serif;
          font-weight: 500;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #a59f97;
        }
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 3px;
          border-radius: 9999px;
          outline: none;
          cursor: pointer;
          background: linear-gradient(to right, #000 50%, #e5e5e5 50%);
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: #000;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }
        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: #000;
          border: none;
          cursor: pointer;
        }
        .bar-item {
          flex: 1;
          border-radius: 4px 4px 0 0;
          height: 0;
          transition: height 0.6s ease-out;
        }

        @media (max-width: 768px) {
          #problem-section {
            height: auto !important;
          }
          #problem-sticky {
            position: relative !important;
            height: auto !important;
          }
          #panels-track {
            flex-direction: column !important;
            width: 100% !important;
            height: auto !important;
            transform: none !important;
          }
          .problem-panel {
            width: 100% !important;
            min-height: 100svh;
            height: auto !important;
            padding: 80px 24px 64px !important;
          }
          .problem-dots {
            display: none !important;
          }
          .problem-label {
            left: 24px !important;
          }
          .iphone-col {
            display: none !important;
          }
          .panel1-left {
            align-items: center !important;
            text-align: center !important;
          }
        }
      `}</style>

      <section id="problem-section">
        <div id="problem-sticky">
          {/* Section label */}
          <div className="problem-label">The Problem</div>

          {/* Progress dots */}
          <div className="problem-dots">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} id={`dot-${i}`} className="problem-dot" />
            ))}
          </div>

          {/* Horizontal track */}
          <div id="panels-track">

            {/* ── PANEL 1 ── */}
            <div
              className="problem-panel"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0 64px",
                gap: "64px",
              }}
            >
              {/* Left column */}
              <div
                className="panel1-left"
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                  maxWidth: "480px",
                }}
              >
                <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "13px", color: "#a59f97" }}>01</span>
                <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "42px", color: "#000", letterSpacing: "-0.84px", lineHeight: 1.1, margin: 0 }}>
                  Every missed call is a lost patient.
                </h2>
                <div>
                  <div id="stat-revenue" style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400, fontSize: "3.5rem", color: "#000", lineHeight: 1 }}>₪0</div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#a59f97", marginTop: "6px" }}>in unrealized revenue per year</div>
                </div>
                <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", color: "#777169", lineHeight: 1.6, margin: 0 }}>
                  Five missed calls a day at ₪900 each, 250 working days.
                </p>
              </div>

              {/* Right column — iOS notification stack */}
              <div
                className="iphone-col"
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <div
                  id="notif-stack"
                  style={{ position: "relative", width: "340px", height: "220px", pointerEvents: "none" }}
                />
              </div>
            </div>

            {/* ── PANEL 2 ── */}
            <div
              className="problem-panel"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "24px",
                padding: "0 80px",
              }}
            >
              <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "13px", color: "#a59f97" }}>02</span>
              <div style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400, fontSize: "5rem", color: "#000", lineHeight: 1 }}>40%</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#a59f97" }}>of appointment requests come after hours</div>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "36px", color: "#000", letterSpacing: "-0.72px", textAlign: "center", maxWidth: "520px", margin: 0 }}>
                Your receptionist leaves at 18:00. Patients don't.
              </h2>

              {/* Bar chart */}
              <div style={{ width: "min(640px, 100%)" }}>
                <div id="bar-chart" style={{ width: "100%", height: "140px", display: "flex", alignItems: "flex-end", gap: "4px" }}>
                  {businessBars.map((b) => (
                    <div
                      key={b.time}
                      className="bar-item"
                      data-height={b.h}
                      style={{ background: "#000000" }}
                    />
                  ))}
                  {/* Divider */}
                  <div style={{ position: "relative", width: "1px", height: "100%", background: "#e5e5e5", flexShrink: 0 }}>
                    <span style={{ position: "absolute", bottom: "-18px", left: "50%", transform: "translateX(-50%)", fontFamily: "Inter, sans-serif", fontSize: "9px", color: "#a59f97", whiteSpace: "nowrap" }}>18:00</span>
                  </div>
                  {afterHoursBars.map((b) => (
                    <div
                      key={b.time}
                      className="bar-item"
                      data-height={b.h}
                      style={{ background: "#e5e5e5" }}
                    />
                  ))}
                </div>
                {/* Labels */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#a59f97" }}>Answered</span>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#dc2626" }}>No answer</span>
                </div>
              </div>
            </div>

            {/* ── PANEL 3 ── */}
            <div
              className="problem-panel"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "32px",
              }}
            >
              <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "13px", color: "#a59f97" }}>03</span>
              <div style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400, fontSize: "5rem", color: "#000", lineHeight: 1 }}>30,000+</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#a59f97" }}>French-speaking residents in Netanya</div>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "36px", color: "#000", letterSpacing: "-0.72px", textAlign: "center", maxWidth: "540px", margin: 0 }}>
                Your receptionist speaks one language. Your patients speak three.
              </h2>

              {/* Language card */}
              <div style={{ width: "min(400px, 90%)", background: "#ffffff", borderRadius: "20px", boxShadow: "rgba(0,0,0,0.4) 0px 0px 1px 0px, rgba(0,0,0,0.04) 0px 2px 4px 0px", overflow: "hidden" }}>
                {/* Hebrew row */}
                <div style={{ opacity: 1, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e5e5e5" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ fontSize: "18px" }}>🇮🇱</span>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "15px", color: "#000", marginLeft: "12px" }}>Hebrew</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "36px", height: "20px", borderRadius: "9999px", background: "#16a34a", position: "relative" }}>
                      <div style={{ width: "16px", height: "16px", background: "#fff", borderRadius: "9999px", position: "absolute", top: "2px", right: "2px", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                    </div>
                    <div style={{ width: "16px", height: "16px", background: "#16a34a", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "#fff", fontSize: "10px", lineHeight: 1 }}>✓</span>
                    </div>
                  </div>
                </div>
                {/* French row */}
                <div style={{ opacity: 0.4, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e5e5e5" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ fontSize: "18px" }}>🇫🇷</span>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "15px", color: "#000", marginLeft: "12px" }}>Français</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "36px", height: "20px", borderRadius: "9999px", background: "#d1d5db", position: "relative" }}>
                      <div style={{ width: "16px", height: "16px", background: "#fff", borderRadius: "9999px", position: "absolute", top: "2px", left: "2px", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                    </div>
                    <div style={{ width: "16px", height: "16px", background: "#dc2626", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "#fff", fontSize: "10px", lineHeight: 1 }}>✕</span>
                    </div>
                  </div>
                </div>
                {/* English row */}
                <div style={{ opacity: 0.4, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ fontSize: "18px" }}>🇬🇧</span>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "15px", color: "#000", marginLeft: "12px" }}>English</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "36px", height: "20px", borderRadius: "9999px", background: "#d1d5db", position: "relative" }}>
                      <div style={{ width: "16px", height: "16px", background: "#fff", borderRadius: "9999px", position: "absolute", top: "2px", left: "2px", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                    </div>
                    <div style={{ width: "16px", height: "16px", background: "#dc2626", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "#fff", fontSize: "10px", lineHeight: 1 }}>✕</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── PANEL 4 ── */}
            <div
              className="problem-panel"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "32px",
                padding: "0 80px",
              }}
            >
              <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "13px", color: "#a59f97" }}>04</span>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "36px", color: "#000", letterSpacing: "-0.72px", textAlign: "center", maxWidth: "540px", margin: 0 }}>
                You're paying a full salary just to answer the phone.
              </h2>

              {/* Calculator card */}
              <div style={{ width: "min(480px, 90%)", background: "#ffffff", borderRadius: "20px", boxShadow: "rgba(0,0,0,0.4) 0px 0px 1px 0px, rgba(0,0,0,0.04) 0px 2px 4px 0px", padding: "32px", display: "flex", flexDirection: "column", gap: "28px" }}>
                {/* Slider 1 */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "13px", color: "#000" }}>Salary per receptionist</span>
                    <span id="salary-display" style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400, fontSize: "14px", color: "#000" }}>₪8,500 / month</span>
                  </div>
                  <input type="range" id="salary-slider" min="6000" max="12000" step="500" defaultValue="8500" />
                </div>

                {/* Slider 2 */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "13px", color: "#000" }}>Number of receptionists</span>
                    <span id="count-display" style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400, fontSize: "14px", color: "#000" }}>2</span>
                  </div>
                  <input type="range" id="count-slider" min="1" max="5" step="1" defaultValue="2" />
                </div>

                {/* Divider */}
                <div style={{ height: "1px", background: "#e5e5e5" }} />

                {/* Output */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#a59f97" }}>You pay</span>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                    <span id="monthly-output" style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400, fontSize: "2.5rem", color: "#000" }}>₪17,000</span>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#a59f97" }}>/ month</span>
                  </div>
                  <span id="annual-output" style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400, fontSize: "1.4rem", color: "#777169" }}>₪204,000 / year</span>
                  <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontStyle: "italic", fontSize: "13px", color: "#a59f97", lineHeight: 1.5, textAlign: "center", marginTop: "8px", marginBottom: 0 }}>
                    For a team that still goes home at 18:00. Still misses calls. Still speaks one language.
                  </p>
                </div>
              </div>
            </div>

          </div>{/* end panels-track */}
        </div>{/* end problem-sticky */}
      </section>

      {/* Stat counter + bar animation script */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          // Count-up for revenue stat
          function countUp(el, target, duration) {
            const start = performance.now();
            function step(now) {
              const t = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - t, 3);
              const val = Math.floor(eased * target);
              el.textContent = '₪' + val.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');
              if (t < 1) requestAnimationFrame(step);
              else el.textContent = '₪' + target.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');
            }
            requestAnimationFrame(step);
          }
          const statEl = document.getElementById('stat-revenue');
          if (statEl) {
            const obs = new IntersectionObserver(entries => {
              entries.forEach(e => {
                if (e.isIntersecting) { countUp(statEl, 1125000, 1400); obs.disconnect(); }
              });
            }, { threshold: 0.3 });
            obs.observe(statEl);
          }
        })();
      `}} />
    </>
  );
}

// animateBars must be global for the scroll handler
if (typeof window !== 'undefined') {
  window.animateBars = function() {
    document.querySelectorAll('[data-height]').forEach((bar, i) => {
      setTimeout(() => { bar.style.height = bar.getAttribute('data-height') + '%'; }, i * 40);
    });
  };
}