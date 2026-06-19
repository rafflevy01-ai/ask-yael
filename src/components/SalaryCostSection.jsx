import React, { useState } from "react";

export default function SalaryCostSection() {
  const [salary, setSalary] = useState(8500);
  const [count, setCount]   = useState(2);
  const monthly = salary * count;
  const annual  = monthly * 12;

  const rows = [
    { label: "Salary / receptionist", value: "₪" + salary.toLocaleString() + " / mo", min: 6000, max: 12000, step: 500, val: salary, set: setSalary, pct: ((salary - 6000) / 6000) * 100 },
    { label: "Receptionists", value: String(count), min: 1, max: 5, step: 1, val: count, set: setCount, pct: ((count - 1) / 4) * 100 },
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

          {/* Right — calculator card */}
          <div style={{ background: "#F5F5F3", borderRadius: "20px", padding: "32px" }}>
            <div style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: "clamp(2rem,4vw,3rem)", color: "#0D0D0D", letterSpacing: "-0.05em", lineHeight: 1, marginBottom: "6px" }}>
              ₪{monthly.toLocaleString()}
            </div>
            <p style={{ fontFamily: "Inter,sans-serif", fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "#888", margin: "0 0 28px" }}>
              per month in receptionist salaries
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {rows.map(({ label, value, min, max, step, val, set, pct }) => (
                <div key={label}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Inter,sans-serif", fontSize: "13px", color: "#555", marginBottom: "8px" }}>
                    <span>{label}</span><span style={{ fontWeight: 500, color: "#0D0D0D" }}>{value}</span>
                  </div>
                  <input type="range" min={min} max={max} step={step} value={val}
                    onChange={e => set(parseInt(e.target.value))}
                    style={{ width: "100%", height: "3px", borderRadius: "9999px", outline: "none", appearance: "none", WebkitAppearance: "none",
                      background: "linear-gradient(to right,#0D0D0D " + pct + "%,#E5E5E5 " + pct + "%)", cursor: "pointer" }} />
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid #E5E5E5", marginTop: "24px", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: "Inter,sans-serif", fontSize: "13px", color: "#888" }}>Total per year</span>
              <span style={{ fontFamily: "Inter,sans-serif", fontWeight: 500, fontSize: "18px", color: "#0D0D0D", letterSpacing: "-0.02em" }}>₪{annual.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        [data-salary-section] input[type="range"] { -webkit-appearance:none; appearance:none; }
        [data-salary-section] input[type="range"]::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px; border-radius:9999px; background:#0D0D0D; cursor:pointer; }
        [data-salary-section] input[type="range"]::-moz-range-thumb { width:16px; height:16px; border-radius:9999px; background:#0D0D0D; border:none; cursor:pointer; }

        @media (max-width:1024px) {
          [data-salary-section] > div { padding:0 32px !important; }
        }
        @media (max-width:768px) {
          [data-salary-section] { padding:48px 0 56px !important; }
          [data-salary-section] > div { padding:0 20px !important; }
          [data-salary-section] .sal-grid { grid-template-columns:1fr !important; gap:32px !important; }
          [data-salary-section] h2 { font-size:1.6rem !important; }
        }
      `}</style>
    </section>
  );
}