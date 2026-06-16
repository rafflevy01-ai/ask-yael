import React, { useEffect, useRef, useState } from "react";
import NotifStack from "@/components/NotifStack";
import { PhoneMissed, Clock, Globe, ArrowUpRight } from "lucide-react";

// ── Panel data ──
const PANELS = [
  {
    id: "missed-calls",
    number: "01",
    label: "Missed Calls",
    icon: PhoneMissed,
    title: "Every missed call is a lost patient.",
    description: "Five missed calls a day at ₪900 each, 250 working days.",
  },
  {
    id: "after-hours",
    number: "02",
    label: "After Hours",
    icon: Clock,
    title: "Your receptionist leaves at 18:00. Patients don't.",
    description: "40% of appointment requests come after hours.",
  },
  {
    id: "language-gap",
    number: "03",
    label: "Language Gap",
    icon: Globe,
    title: "Your receptionist speaks one language. Your patients speak three.",
    description: "30,000+ French-speaking residents in Netanya.",
  },
  {
    id: "salary-cost",
    number: "04",
    label: "Salary Cost",
    icon: "shekel",
    title: "You're paying a full salary just to answer the phone.",
    description: "For a team that still goes home at 18:00.",
  },
];

export default function ProblemSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [salary, setSalary] = useState(8500);
  const [count, setCount] = useState(2);
  const monthly = salary * count;
  const annual = monthly * 12;
  const barsAnimatedRef = useRef(false);

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

  // ── Animate bars when After Hours panel becomes active ──
  useEffect(() => {
    if (activeIndex !== 1) {
      barsAnimatedRef.current = false;
      // Reset bars
      const allBars = document.querySelectorAll('[data-height]');
      allBars.forEach((bar) => {
        bar.style.transition = "none";
        bar.style.height = "0%";
      });
      return;
    }
    if (barsAnimatedRef.current) return;
    barsAnimatedRef.current = true;

    const bars = document.querySelectorAll('[data-height]');
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        bars.forEach((bar, i) => {
          setTimeout(() => {
            bar.style.transition =
              "height 0.5s cubic-bezier(0.22,1,0.36,1)";
            bar.style.height = bar.getAttribute("data-height") + "%";
          }, i * 120);
        });
      })
    );
  }, [activeIndex]);

  // ── Revenue counter ──
  useEffect(() => {
    if (activeIndex !== 0) return;
    const el = document.getElementById("stat-revenue");
    if (!el) return;

    function countUp(el, target, duration) {
      const start = performance.now();
      function step(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = Math.floor(eased * target);
        el.textContent =
          "\u20AA" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if (t < 1) requestAnimationFrame(step);
        else
          el.textContent =
            "\u20AA" + target.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      requestAnimationFrame(step);
    }
    countUp(el, 1125000, 1400);
  }, [activeIndex]);

  const activePanel = PANELS[activeIndex];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Inter:wght@400;500&display=swap');

        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 3px;
          border-radius: 9999px;
          outline: none;
          cursor: pointer;
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

        @media (max-width: 768px) {
          [data-problem-section] { padding: 160px 0 !important; scroll-margin-top: 160px; }
          [data-problem-section] > div { padding: 0 16px !important; }
          .ps-two-col {
            flex-direction: column !important;
          }
          .ps-left-col {
            width: 100% !important;
            flex-shrink: 1 !important;
            padding-top: 8px !important;
            overflow-x: auto !important;
            display: flex !important;
            flex-direction: row !important;
          }
          .ps-left-col button {
            white-space: nowrap !important;
            flex-shrink: 0 !important;
            border-top: none !important;
            margin-right: 8px !important;
            padding: 8px 12px !important;
            border-radius: 8px !important;
            background: rgba(0,0,0,0.04) !important;
          }
          .ps-right-col {
            width: 100% !important;
            flex-shrink: 1 !important;
            margin-top: 16px !important;
            margin-bottom: 24px !important;
          }
          .ps-gray-container { padding: 36px 20px 24px !important; min-height: auto !important; }
          .ps-notif-stack { margin-top: 36px !important; width: 100% !important; max-width: 100% !important; }
          .ps-bottom-label { padding: 24px 20px !important; }
        }
      `}</style>

      <section
        data-problem-section
        style={{
          width: "100%",
          backgroundColor: "#F5F5F3",
          padding: "80px 0",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 48px",
          }}
        >
          {/* ── TITLE + SUBTITLE ROW ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginBottom: "48px",
            }}
          >
            <h2
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 200,
                fontSize: "clamp(2rem, 3.5vw, 2.6rem)",
                color: "#0D0D0D",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              Sound familiar?
            </h2>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: "14px",
                color: "#777777",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Calls go unanswered. Patients don't wait. Your front desk can't be everywhere at once.
            </p>
          </div>

          {/* ── TWO COLUMNS ── */}
          <div
            className="ps-two-col"
            style={{
              display: "flex",
              gap: "5%",
              alignItems: "flex-start",
            }}
          >
            {/* LEFT COLUMN — 35% */}
            <div
              className="ps-left-col"
              style={{
                width: "35%",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {PANELS.map((panel, i) => {
                const isActive = i === activeIndex;
                return (
                  <button
                    key={panel.id}
                    onClick={() => setActiveIndex(i)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      width: "100%",
                      padding: "16px 0",
                      background: "none",
                      border: "none",
                      borderTop: i > 0 ? "1px solid rgba(0,0,0,0.08)" : "none",
                      cursor: "pointer",
                      textAlign: "left",
                      opacity: isActive ? 1 : 0.35,
                      transition: "opacity 0.25s ease",
                    }}
                  >
                    {panel.icon === "shekel" ? (
                      <span style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 300,
                        fontSize: "18px",
                        color: isActive ? "#0D0D0D" : "#999999",
                        lineHeight: 1,
                      }}>₪</span>
                    ) : (
                      (() => { const Icon = panel.icon; return <Icon size={18} strokeWidth={1.8} color={isActive ? "#0D0D0D" : "#999999"} />; })()
                    )}
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: "15px",
                        color: isActive ? "#0D0D0D" : "#999999",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {panel.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* RIGHT COLUMN — 65% */}
            <div
              className="ps-right-col"
              style={{
                width: "65%",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "16px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {/* Arrow top-right */}
                <div
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    zIndex: 2,
                  }}
                >
                  <ArrowUpRight size={18} strokeWidth={1.8} color="#999999" />
                </div>

                {/* Visual area with light gray inner background */}
                <div
                  className="ps-gray-container"
                  style={{
                    backgroundColor: "#F0F0EE",
                    padding: "40px 40px 24px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "320px",
                  }}
                >
                  {/* ── PANEL 0: MISSED CALLS ── */}
                  {activeIndex === 0 && (
                    <>
                      <div
                        id="stat-revenue"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 300,
                          fontSize: "clamp(2.6rem, 6vw, 4.5rem)",
                          color: "#0D0D0D",
                          lineHeight: 1,
                          letterSpacing: "-0.05em",
                        }}
                      >
                        ₪0
                      </div>
                      <div
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 500,
                          fontSize: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "#888888",
                          marginTop: "8px",
                          }}
                          >
                          in unrealized revenue per year
                      </div>
                      <div
                        className="ps-notif-stack"
                        style={{
                          height: "180px",
                          width: "100%",
                          maxWidth: "340px",
                          position: "relative",
                          overflow: "hidden",
                          marginTop: "20px",
                        }}
                      >
                        <NotifStack />
                      </div>
                    </>
                  )}

                  {/* ── PANEL 1: AFTER HOURS ── */}
                  {activeIndex === 1 && (
                    <>
                      <div
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 300,
                          fontSize: "clamp(2.6rem, 6vw, 4.5rem)",
                          color: "#0D0D0D",
                          lineHeight: 1,
                          letterSpacing: "-0.05em",
                        }}
                      >
                        40%
                      </div>
                      <div
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 500,
                          fontSize: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "#888888",
                          marginTop: "8px",
                          marginBottom: "24px",
                          }}
                          >
                          of appointment requests come after hours
                      </div>
                      <div style={{ width: "min(560px, 100%)" }}>
                        <div
                          style={{
                            width: "100%",
                            height: "clamp(80px, 14vw, 130px)",
                            display: "flex",
                            alignItems: "flex-end",
                            gap: "3px",
                          }}
                        >
                          {businessBars.map((b) => (
                            <div
                              key={b.time}
                              className="bar-item"
                              data-height={b.h}
                              style={{ background: "#0D0D0D" }}
                            />
                          ))}
                          <div
                            style={{
                              position: "relative",
                              width: "1px",
                              height: "100%",
                              background: "#D1D5DB",
                              flexShrink: 0,
                            }}
                          >
                            <span
                              style={{
                                position: "absolute",
                                bottom: "-18px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                fontFamily: "Inter, sans-serif",
                                fontSize: "9px",
                                color: "#888888",
                                whiteSpace: "nowrap",
                              }}
                            >
                              18:00
                            </span>
                          </div>
                          {afterHoursBars.map((b) => (
                            <div
                              key={b.time}
                              className="bar-item"
                              data-height={b.h}
                              style={{ background: "#E5E5E5" }}
                            />
                          ))}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "24px",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontSize: "11px",
                              color: "#888888",
                            }}
                          >
                            Answered
                          </span>
                          <span
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontSize: "11px",
                              color: "#DC2626",
                            }}
                          >
                            No answer
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* ── PANEL 2: LANGUAGE GAP ── */}
                  {activeIndex === 2 && (
                    <>
                      <div
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 300,
                          fontSize: "clamp(2.6rem, 6vw, 4.5rem)",
                          color: "#0D0D0D",
                          lineHeight: 1,
                          letterSpacing: "-0.05em",
                        }}
                      >
                        30,000+
                      </div>
                      <div
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 500,
                          fontSize: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "#888888",
                          marginTop: "8px",
                          marginBottom: "20px",
                          }}
                          >
                          French-speaking residents in Netanya
                      </div>
                      {/* Language card */}
                      <div
                        style={{
                          width: "min(360px, 90%)",
                          background: "#FFFFFF",
                          borderRadius: "14px",
                          boxShadow:
                            "rgba(0,0,0,0.4) 0px 0px 1px 0px, rgba(0,0,0,0.04) 0px 2px 4px 0px",
                          overflow: "hidden",
                        }}
                      >
                        {[
                          { flag: "🇮🇱", lang: "Hebrew", ok: true },
                          { flag: "🇫🇷", lang: "Français", ok: false },
                          { flag: "🇬🇧", lang: "English", ok: false },
                        ].map((row, i) => (
                          <div
                            key={row.lang}
                            style={{
                              opacity: i === 0 ? 1 : 0.4,
                              padding: "14px 18px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              borderBottom:
                                i < 2 ? "1px solid #E5E5E5" : "none",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <span style={{ fontSize: "16px" }}>
                                {row.flag}
                              </span>
                              <span
                                style={{
                                  fontFamily: "Inter, sans-serif",
                                  fontWeight: 500,
                                  fontSize: "14px",
                                  color: "#0D0D0D",
                                  marginLeft: "10px",
                                }}
                              >
                                {row.lang}
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <div
                                style={{
                                  width: "34px",
                                  height: "18px",
                                  borderRadius: "9999px",
                                  background: row.ok ? "#16A34A" : "#D1D5DB",
                                  position: "relative",
                                }}
                              >
                                <div
                                  style={{
                                    width: "14px",
                                    height: "14px",
                                    background: "#FFF",
                                    borderRadius: "9999px",
                                    position: "absolute",
                                    top: "2px",
                                    ...(row.ok
                                      ? { right: "2px" }
                                      : { left: "2px" }),
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                                  }}
                                />
                              </div>
                              <div
                                style={{
                                  width: "14px",
                                  height: "14px",
                                  background: row.ok ? "#16A34A" : "#DC2626",
                                  borderRadius: "9999px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <span
                                  style={{
                                    color: "#FFF",
                                    fontSize: "9px",
                                    lineHeight: 1,
                                  }}
                                >
                                  {row.ok ? "✓" : "✕"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* ── PANEL 3: SALARY COST ── */}
                  {activeIndex === 3 && (
                    <div
                      style={{
                        width: "min(440px, 95%)",
                        background: "#FFFFFF",
                        borderRadius: "14px",
                        boxShadow:
                          "rgba(0,0,0,0.4) 0px 0px 1px 0px, rgba(0,0,0,0.04) 0px 2px 4px 0px",
                        padding: "28px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                      }}
                    >
                      {/* Slider 1 */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontWeight: 500,
                              fontSize: "13px",
                              color: "#0D0D0D",
                            }}
                          >
                            Salary per receptionist
                          </span>
                          <span
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 500,
                              fontSize: "14px",
                              color: "#0D0D0D",
                              letterSpacing: "-0.02em",
                            }}
                          >
                            ₪{salary.toLocaleString()} / month
                          </span>
                        </div>
                        <input
                          type="range"
                          min="6000"
                          max="12000"
                          step="500"
                          value={salary}
                          onChange={(e) => setSalary(parseInt(e.target.value))}
                          style={{
                            background: `linear-gradient(to right, #0D0D0D ${((salary - 6000) / 6000) * 100}%, #E5E5E5 ${((salary - 6000) / 6000) * 100}%)`,
                          }}
                        />
                      </div>

                      {/* Slider 2 */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontWeight: 500,
                              fontSize: "13px",
                              color: "#0D0D0D",
                            }}
                          >
                            Number of receptionists
                          </span>
                          <span
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 500,
                              fontSize: "14px",
                              color: "#0D0D0D",
                              letterSpacing: "-0.02em",
                            }}
                          >
                            {count}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="1"
                          value={count}
                          onChange={(e) => setCount(parseInt(e.target.value))}
                          style={{
                            background: `linear-gradient(to right, #0D0D0D ${((count - 1) / 4) * 100}%, #E5E5E5 ${((count - 1) / 4) * 100}%)`,
                          }}
                        />
                      </div>

                      <div
                        style={{ height: "1px", background: "#E5E5E5" }}
                      />

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 500,
                            fontSize: "12px",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            color: "#888888",
                            }}
                            >
                            You pay
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: "6px",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 300,
                              fontSize: "2.5rem",
                              color: "#0D0D0D",
                              letterSpacing: "-0.05em",
                            }}
                          >
                            ₪{monthly.toLocaleString()}
                          </span>
                          <span
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontSize: "13px",
                              color: "#888888",
                            }}
                          >
                            / month
                          </span>
                        </div>
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                                                fontWeight: 300,
                                                fontSize: "1.3rem",
                            color: "#555555",
                            letterSpacing: "-0.02em",
                          }}
                        >
                          ₪{annual.toLocaleString()} / year
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom label area */}
                <div className="ps-bottom-label" style={{ padding: "20px 32px 28px" }}>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                      fontSize: "18px",
                      color: "#0D0D0D",
                      letterSpacing: "-0.02em",
                      marginBottom: "4px",
                    }}
                  >
                    {activePanel.title}
                  </div>
                  <div
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 400,
                      fontSize: "14px",
                      color: "#777777",
                      lineHeight: 1.5,
                    }}
                  >
                    {activePanel.description}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}