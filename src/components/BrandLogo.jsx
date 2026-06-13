export default function BrandLogo({ size = 64 }) {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.42;
  const dotR = size * 0.06;
  const centerR = size * 0.08;

  const dots = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    return {
      x: cx + outerR * Math.cos(angle),
      y: cy + outerR * Math.sin(angle),
    };
  });

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ display: "block" }}
      >
        {/* stems */}
        {dots.map((dot, i) => (
          <line
            key={`stem-${i}`}
            x1={cx}
            y1={cy}
            x2={dot.x}
            y2={dot.y}
            stroke="#000000"
            strokeWidth={size * 0.015}
            strokeLinecap="round"
          />
        ))}

        {/* outer dots */}
        {dots.map((dot, i) => (
          <circle
            key={`dot-${i}`}
            cx={dot.x}
            cy={dot.y}
            r={dotR}
            fill="#000000"
          />
        ))}

        {/* center circle */}
        <circle cx={cx} cy={cy} r={centerR} fill="#000000" />
      </svg>
    </div>
  );
}