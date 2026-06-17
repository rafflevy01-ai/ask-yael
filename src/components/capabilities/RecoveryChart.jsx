const BARS = [
  { h: 80, dark: true },
  { h: 60, dark: true },
  { h: 70, dark: true },
  { h: 50, dark: false },
  { h: 40, dark: false },
  { h: 55, dark: false },
];

export default function RecoveryChart() {
  return (
    <div style={{ padding: "8px 0" }}>
      <div style={{
        display: "flex", alignItems: "flex-end", gap: "6px",
        height: "80px", justifyContent: "center",
      }}>
        {BARS.map((bar, i) => (
          <div key={i} style={{
            width: "18px", height: `${bar.h}%`,
            background: bar.dark ? "#FAFAFA" : "#374151",
            borderRadius: "3px 3px 0 0",
          }} />
        ))}
      </div>
      <div style={{
        display: "flex", justifyContent: "space-between",
        marginTop: "10px", padding: "0 4px",
      }}>
        <span style={{
          fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", color: "#6B6B6B",
        }}>
          Recovered
        </span>
        <span style={{
          fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px", color: "#6B6B6B",
        }}>
          Missed
        </span>
      </div>
    </div>
  );
}