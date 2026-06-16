import { useEffect, useRef } from "react";

const CALENDLY_URL = "https://calendly.com/askyael/30min";

export default function CalendlySection() {
  const containerRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = () => {
      if (window.Calendly && containerRef.current) {
        window.Calendly.initInlineWidget({
          url: CALENDLY_URL,
          parentElement: containerRef.current,
          prefill: {},
          utm: {},
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <section style={{ backgroundColor: "#0DB8A9", padding: "80px 40px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
        <h2
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: "28px",
            color: "#FFFFFF",
            letterSpacing: "-0.56px",
            margin: "0 0 40px",
          }}
        >
          Book your free demo directly
        </h2>

        <div
          ref={containerRef}
          style={{
            width: "100%",
            minHeight: "650px",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        />
      </div>

      <style>{`
        @media (max-width: 768px) {
          section { padding: 56px 20px !important; }
        }
      `}</style>
    </section>
  );
}