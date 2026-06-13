const DIVIDER_WIDTH = "680px";

export default function SectionDividers() {
  return (
    <div
      data-section-dividers
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: DIVIDER_WIDTH,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <div style={{
        position: "absolute", top: 0, bottom: 0, left: 0,
        width: "1px", background: "#e0ddd9",
      }} />
      <div style={{
        position: "absolute", top: 0, bottom: 0, right: 0,
        width: "1px", background: "#e0ddd9",
      }} />

      <style>{`
        @media (max-width: 768px) {
          [data-section-dividers] { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export function SectionDivider() {
  return (
    <div
      data-section-divider
      style={{
        maxWidth: DIVIDER_WIDTH,
        margin: "0 auto",
        height: "1px",
        position: "relative",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "1px", background: "#e0ddd9",
      }} />

      {/* Left cross marker */}
      <div style={{
        position: "absolute", top: "50%", left: 0,
        transform: "translate(-50%, -50%)",
        width: "9px", height: "9px",
      }}>
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "#b1b0b0", transform: "translateY(-50%)" }} />
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1px", background: "#b1b0b0", transform: "translateX(-50%)" }} />
      </div>

      {/* Right cross marker */}
      <div style={{
        position: "absolute", top: "50%", right: 0,
        transform: "translate(50%, -50%)",
        width: "9px", height: "9px",
      }}>
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "#b1b0b0", transform: "translateY(-50%)" }} />
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1px", background: "#b1b0b0", transform: "translateX(-50%)" }} />
      </div>

      <style>{`
        @media (max-width: 768px) {
          [data-section-divider] { display: none !important; }
        }
      `}</style>
    </div>
  );
}