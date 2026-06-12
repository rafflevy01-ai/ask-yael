import React, { useEffect, useRef, useState } from "react";
import NotifStack from "@/components/NotifStack";

export default function ProblemSection() {
  const initRef = useRef(false);
  const [salary, setSalary] = useState(8500);
  const [count, setCount] = useState(2);
  const monthly = salary * count;
  const annual = monthly * 12;

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    // --- Bar animations (defined first so scroll handler can call them) ---
    window.animateBarsEnter = function () {
      const bars = document.querySelectorAll('[data-height]');
      // Reset all to 0 instantly
      bars.forEach((bar) => {bar.style.transition = 'none';bar.style.height = '0%';});
      requestAnimationFrame(() => requestAnimationFrame(() => {
        bars.forEach((bar, i) => {
          // Each bar rises one at a time: 120ms stagger, 500ms rise
          setTimeout(() => {
            bar.style.transition = 'height 0.5s cubic-bezier(0.22,1,0.36,1)';
            bar.style.height = bar.getAttribute('data-height') + '%';
          }, i * 120);
        });
      }));
    };
    window.animateBarsExit = function () {
      const bars = document.querySelectorAll('[data-height]');
      // Collapse right to left
      [...bars].reverse().forEach((bar, i) => {
        bar.style.transition = 'height 0.3s cubic-bezier(0.55,0,1,0.45)';
        setTimeout(() => {bar.style.height = '0%';}, i * 40);
      });
    };

    // --- Scroll-jacking ---
    (function () {
      const isMobile = window.innerWidth < 768;

      const section = document.getElementById("problem-section");
      const track = document.getElementById("panels-track");
      const dots = [0, 1, 2, 3].map((i) => document.getElementById("dot-" + i));
      let lastPanel = -1;

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

        if (activePanel !== lastPanel) {
          const prev = lastPanel;
          lastPanel = activePanel;
          // Entering panel 2 (from either side)
          if (activePanel === 1) {
            window.animateBarsEnter();
          }
          // Leaving panel 2 in either direction
          if (prev === 1 && activePanel !== 1) {
            window.animateBarsExit();
          }
        }
      }

      if (!isMobile) {
        window.addEventListener("scroll", updateScroll, { passive: true });
      }
      updateScroll();
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
  { time: "17:00", h: 45 }];

  const afterHoursBars = [
  { time: "18:00", h: 6 },
  { time: "19:00", h: 5 },
  { time: "20:00", h: 4 },
  { time: "21:00", h: 3 },
  { time: "22:00", h: 2 }];


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
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .panel-card {
          width: min(900px, 90vw);
          height: min(600px, 80vh);
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
          position: relative;
          overflow: hidden;
        }
        .panel-card::before {
          content: '';
          position: absolute;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%);
          top: -80px;
          right: -60px;
          pointer-events: none;
          filter: blur(20px);
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
        }

        @media (max-width: 1024px) {
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
          <div style={{ position: "absolute", top: "40px", left: "50%", transform: "translateX(-50%)", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", textAlign: "center", width: "100%" }}>
            <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "clamp(1.6rem, 2.8vw, 2.25rem)", color: "#000", letterSpacing: "-0.05em", lineHeight: 1.1, margin: 0 }}>Sound familiar?</h1>
            <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", color: "#a59f97", margin: 0 }}>Calls go unanswered. Patients don't wait. Your front desk can't be everywhere at once.</p>
          </div>

          {/* Progress dots */}
          <div className="problem-dots">
            {[0, 1, 2, 3].map((i) =>
            <div key={i} id={`dot-${i}`} className="problem-dot" />
            )}
          </div>

          {/* Horizontal track */}
          <div id="panels-track">

            {/* ── PANEL 1 ── */}
            <div className="problem-panel">
              <div className="panel-card" style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #faf5ff 100%)" }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "14px", color: "#a59f97", marginBottom: "8px", letterSpacing: "-0.02em" }}>01</span>
                <div id="stat-revenue" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "5rem", color: "#000", lineHeight: 1, letterSpacing: "-0.05em" }}>₪0</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#a59f97", marginBottom: "16px" }}>in unrealized revenue per year</div>
                <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "clamp(1.5rem, 2.8vw, 2.25rem)", color: "#000", letterSpacing: "-0.84px", lineHeight: 1.1, margin: 0, maxWidth: "520px", textAlign: "center" }}>
                  Every missed call is a lost patient.
                </h2>
                <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", color: "#777169", lineHeight: 1.6, margin: "16px 0 0 0", maxWidth: "480px", textAlign: "center" }}>
                  Five missed calls a day at ₪900 each, 250 working days.
                </p>

                {/* Notification stack */}
                <div style={{ height: "240px", width: "360px", flexShrink: 0, position: "relative", overflow: "hidden", marginTop: "24px" }}>
                  <NotifStack />
                </div>
              </div>
            </div>

            {/* ── PANEL 2 ── */}
            <div className="problem-panel">
              <div className="panel-card" style={{ background: "linear-gradient(135deg, #ecfdf5 0%, #f0f9ff 100%)" }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "14px", color: "#a59f97", marginBottom: "8px", letterSpacing: "-0.02em" }}>02</span>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "5rem", color: "#000", lineHeight: 1, letterSpacing: "-0.05em" }}>40%</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#a59f97", marginBottom: "16px" }}>of appointment requests come after hours</div>
                <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "clamp(1.5rem, 2.8vw, 2.25rem)", color: "#000", letterSpacing: "-0.72px", textAlign: "center", maxWidth: "520px", margin: 0 }}>
                  Your receptionist leaves at 18:00. Patients don't.
                </h2>

                {/* Bar chart */}
                <div style={{ width: "min(640px, 100%)", marginTop: "24px" }}>
                  <div id="bar-chart" style={{ width: "100%", height: "140px", display: "flex", alignItems: "flex-end", gap: "4px" }}>
                    {businessBars.map((b) =>
                    <div
                      key={b.time}
                      className="bar-item"
                      data-height={b.h}
                      style={{ background: "#000000" }} />

                    )}
                    {/* Divider */}
                    <div style={{ position: "relative", width: "1px", height: "100%", background: "#e5e5e5", flexShrink: 0 }}>
                      <span style={{ position: "absolute", bottom: "-18px", left: "50%", transform: "translateX(-50%)", fontFamily: "Inter, sans-serif", fontSize: "9px", color: "#a59f97", whiteSpace: "nowrap" }}>18:00</span>
                    </div>
                    {afterHoursBars.map((b) =>
                    <div
                      key={b.time}
                      className="bar-item"
                      data-height={b.h}
                      style={{ background: "#e5e5e5" }} />

                    )}
                  </div>
                  {/* Labels */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#a59f97" }}>Answered</span>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#dc2626" }}>No answer</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── PANEL 3 ── */}
            <div className="problem-panel">
              <div className="panel-card" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #fafef9 100%)" }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "14px", color: "#a59f97", marginBottom: "8px", letterSpacing: "-0.02em" }}>03</span>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "5rem", color: "#000", lineHeight: 1, letterSpacing: "-0.05em" }}>30,000+</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#a59f97", marginBottom: "16px" }}>French-speaking residents in Netanya</div>
                <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "clamp(1.5rem, 2.8vw, 2.25rem)", color: "#000", letterSpacing: "-0.72px", textAlign: "center", maxWidth: "540px", margin: 0 }}>
                  Your receptionist speaks one language.<br />Your patients speak three.
                </h2>

                {/* Language card */}
                <div style={{ width: "min(400px, 90%)", background: "#ffffff", borderRadius: "20px", boxShadow: "rgba(0,0,0,0.4) 0px 0px 1px 0px, rgba(0,0,0,0.04) 0px 2px 4px 0px", overflow: "hidden", marginTop: "24px" }}>
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
            </div>

            {/* ── PANEL 4 ── */}
            <div className="problem-panel">
              <div className="panel-card" style={{ background: "linear-gradient(135deg, #f8fafc 0%, #f5f9ff 100%)" }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "14px", color: "#a59f97", marginBottom: "8px", letterSpacing: "-0.02em" }}>04</span>
                <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "clamp(1.5rem, 2.8vw, 2.25rem)", color: "#000", letterSpacing: "-0.72px", textAlign: "center", maxWidth: "540px", margin: 0 }}>
                  You're paying a full salary just to answer the phone.
                </h2>

                {/* Calculator card */}
                <div style={{ width: "min(480px, 90%)", background: "#ffffff", borderRadius: "20px", boxShadow: "rgba(0,0,0,0.4) 0px 0px 1px 0px, rgba(0,0,0,0.04) 0px 2px 4px 0px", padding: "32px", display: "flex", flexDirection: "column", gap: "28px", marginTop: "24px" }}>
                  {/* Slider 1 */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "13px", color: "#000" }}>Salary per receptionist</span>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "14px", color: "#000", letterSpacing: "-0.02em" }}>₪{salary.toLocaleString()} / month</span>
                    </div>
                    <input 
                      type="range" 
                      min="6000" 
                      max="12000" 
                      step="500" 
                      value={salary}
                      onChange={(e) => setSalary(parseInt(e.target.value))}
                      style={{
                        background: `linear-gradient(to right, #000 ${(salary - 6000) / 6000 * 100}%, #e5e5e5 ${(salary - 6000) / 6000 * 100}%)`
                      }}
                    />
                  </div>

                  {/* Slider 2 */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "13px", color: "#000" }}>Number of receptionists</span>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "14px", color: "#000", letterSpacing: "-0.02em" }}>{count}</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="5" 
                      step="1" 
                      value={count}
                      onChange={(e) => setCount(parseInt(e.target.value))}
                      style={{
                        background: `linear-gradient(to right, #000 ${(count - 1) / 4 * 100}%, #e5e5e5 ${(count - 1) / 4 * 100}%)`
                      }}
                    />
                  </div>

                  {/* Divider */}
                  <div style={{ height: "1px", background: "#e5e5e5" }} />

                  {/* Output */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#a59f97" }}>You pay</span>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "2.5rem", color: "#000", letterSpacing: "-0.05em" }}>₪{monthly.toLocaleString()}</span>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#a59f97" }}>/ month</span>
                    </div>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "1.4rem", color: "#777169", letterSpacing: "-0.02em" }}>₪{annual.toLocaleString()} / year</span>
                    <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontStyle: "italic", fontSize: "13px", color: "#a59f97", lineHeight: 1.5, textAlign: "center", marginTop: "8px", marginBottom: 0 }}>
                      For a team that still goes home at 18:00. Still misses calls. Still speaks one language.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>{/* end panels-track */}
        </div>{/* end problem-sticky */}
      </section>

      {/* Stat counter script */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          function countUp(el, target, duration) {
            const start = performance.now();
            function step(now) {
              const t = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - t, 3);
              const val = Math.floor(eased * target);
              el.textContent = '\\u20AA' + val.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');
              if (t < 1) requestAnimationFrame(step);
              else el.textContent = '\\u20AA' + target.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');
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
      ` }} />
    </>);

}