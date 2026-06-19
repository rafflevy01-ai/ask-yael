import React, { useState } from "react";

export default function SalaryCostSection() {
  const [salary, setSalary] = useState(8500);
  const [count, setCount]   = useState(2);
  const monthly = salary * count;
  const annual  = monthly * 12;

  const rows = [
    { label: "Salary / receptionist", value: "₪" + salary.toLocaleString() + " / mo", min: 6000, max: 12000, step: 500, val: salary, set: setSalary, minLabel: "₪6,000", maxLabel: "₪12,000", pct: ((salary - 6000) / 6000) * 100 },
    { label: "Receptionists", value: String(count), min: 1, max: 5, step: 1, val: count, set: setCount, minLabel: "1", maxLabel: "5", pct: ((count - 1) / 4) * 100 },
  ];

  return (
    <section data-salary-section style={{ width: "100%", backgroundColor: "#FFFFFF", padding: "64px 0 80px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 56px" }}>
        <div className="sal-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "56px", alignItems: "center" }}>

          {/* Left — copy */}
          <div>
            <span style={{ fontFamily: "Inter,sans-serif", fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#888", display: "block", marginBottom: "14px" }}>
              The Cost of Answering Phones
            </span>
            <h2 style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: "clamp(2rem,3.5vw,2.8rem)", color: "#0D0D0D", letterSpacing: "-0.04em", lineHeight: 1.1, margin: "0 0 14px" }}>
              See what your front desk really costs.
            </h2>
            <p style={{ fontFamily: "Inter,sans-serif", fontWeight: 400, fontSize: "16px", color: "#6B6B6B", margin: 0, lineHeight: 1.6, maxWidth: "440px" }}>
              Drag the sliders to match your clinic — then see how much you spend every year just to answer the phone.
            </p>
          </div>

          {/* Right — white calculator card */}
          <div style={{ background: "#FFFFFF", borderRadius: "20px", padding: "28px", boxShadow: "0 10px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)" }}>
            <div className="sal-card-grid" style={{ display: "grid", gridTemplateColumns: "1fr 0.85fr", gap: "24px", alignItems: "stretch" }}>

              {/* Inputs column */}
              <div style={{ display: "flex", flexDirection: "column", gap: "26px", paddingTop: "4px" }}>
                {rows.map(({ label, value, min, max, step, val, set, minLabel, maxLabel, pct }) => (
                  <div key={label}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <span style={{ fontFamily: "Inter,sans-serif", fontSize: "13px", fontWeight: 600, color: "#0D0D0D" }}>{label}</span>
                      <span style={{ fontFamily: "Inter,sans-serif", fontSize: "12px", fontWeight: 500, color: "#0D0D0D", background: "#F5F5F3", borderRadius: "8px", padding: "5px 10px", border: "1px solid #ECECEC" }}>{value}</span>
                    </div>
                    <input type="range" min={min} max={max} step={step} value={val}
                      onChange={e => set(parseInt(e.target.value))}
                      style={{ width: "100%", height: "4px", borderRadius: "9999px", outline: "none", appearance: "none", WebkitAppearance: "none",
                        background: "linear-gradient(to right,#2563EB " + pct + "%,#E5E7EB " + pct + "%)", cursor: "pointer" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px", fontFamily: "Inter,sans-serif", fontSize: "10px", color: "#9CA3AF" }}>
                      <span>{minLabel}</span><span>{maxLabel}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Blue results panel */}
              <div style={{ background: "#EEF4FF", borderRadius: "14px", padding: "22px" }}>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: "13px", fontWeight: 600, color: "#0D0D0D", marginBottom: "4px" }}>Monthly Cost</div>
                <div style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: "clamp(1.7rem,3vw,2.2rem)", color: "#0D0D0D", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: "8px" }}>
                  ₪{monthly.toLocaleString()}
                </div>
                <p style={{ fontFamily: "Inter,sans-serif", fontSize: "11px", fontWeight: 400, color: "#6B7280", margin: 0, lineHeight: 1.5 }}>
                  What you pay every month just to answer the phone.
                </p>

                <div style={{ borderTop: "1px solid rgba(37,99,235,0.15)", margin: "18px 0", paddingTop: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                    <span style={{ fontFamily: "Inter,sans-serif", fontSize: "12px", fontWeight: 600, color: "#0D0D0D" }}>Total per year</span>
                    <span style={{ fontFamily: "Inter,sans-serif", fontSize: "15px", fontWeight: 600, color: "#0D0D0D", letterSpacing: "-0.02em" }}>₪{annual.toLocaleString()}</span>
                  </div>
                  <p style={{ fontFamily: "Inter,sans-serif", fontSize: "11px", fontWeight: 400, color: "#6B7280", margin: 0, lineHeight: 1.5 }}>
                    Your yearly receptionist salary spend.
                  </p>
                </div>

                <a href="#book-demo" style={{ display: "block", textAlign: "center", fontFamily: "Inter,sans-serif", fontSize: "13px", fontWeight: 500, color: "#FFFFFF", background: "#2563EB", borderRadius: "9999px", padding: "11px 0", textDecoration: "none" }}>
                  Replace it with Yael
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>

      <style>{`
        [data-salary-section] input[type="range"] { -webkit-appearance:none; appearance:none; }
        [data-salary-section] input[type="range"]::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px; border-radius:9999px; background:#2563EB; border:2px solid #FFFFFF; box-shadow:0 1px 4px rgba(0,0,0,0.2); cursor:pointer; }
        [data-salary-section] input[type="range"]::-moz-range-thumb { width:16px; height:16px; border-radius:9999px; background:#2563EB; border:2px solid #FFFFFF; box-shadow:0 1px 4px rgba(0,0,0,0.2); cursor:pointer; }

        @media (max-width:1024px) {
          [data-salary-section] > div { padding:0 32px !important; }
        }
        @media (max-width:768px) {
          [data-salary-section] { padding:48px 0 56px !important; }
          [data-salary-section] > div { padding:0 20px !important; }
          [data-salary-section] .sal-grid { grid-template-columns:1fr !important; gap:32px !important; }
          [data-salary-section] .sal-card-grid { grid-template-columns:1fr !important; gap:20px !important; }
          [data-salary-section] h2 { font-size:1.6rem !important; }
        }
      `}</style>
    </section>
  );
}