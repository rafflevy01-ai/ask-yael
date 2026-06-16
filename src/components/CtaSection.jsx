import { useEffect, useRef } from "react";

const CALENDLY_URL = "https://calendly.com/rafflevy01/30min";

export default function CtaSection() {
  const calendlyRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = () => {
      if (window.Calendly && calendlyRef.current) {
        window.Calendly.initInlineWidget({
          url: CALENDLY_URL,
          parentElement: calendlyRef.current,
          hideLandingPageDetails: true,
          hideEventTypeDetails: true,
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
    <section style={{ backgroundColor: "#000000", padding: "80px 40px 48px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <h2
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: "36px",
            color: "#FFFFFF",
            letterSpacing: "-0.72px",
            margin: "0 0 16px",
          }}
        >
          Ready to stop missing patients?
        </h2>

        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: "16px",
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.5,
            margin: "0 0 32px",
          }}
        >
          Book a 30-minute demo. Hear Yael on a real call. No commitment.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <a
            href="#book-demo"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: "15px",
              color: "#000000",
              background: "#FFFFFF",
              borderRadius: "9999px",
              height: "40px",
              padding: "0 20px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              border: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Book a Free Demo
          </a>

          <a
            href="#whatsapp"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: "15px",
              color: "#FFFFFF",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "9999px",
              height: "40px",
              padding: "0 20px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Message on WhatsApp
          </a>
        </div>

        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: "13px",
            color: "rgba(255,255,255,0.4)",
            margin: "0 0 40px",
          }}
        >
          No sales pitch. No contract. Just a live demo.
        </p>

        <div
          ref={calendlyRef}
          style={{
            maxWidth: "480px",
            margin: "0 auto",
            minHeight: "700px",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        />
      </div>

      <style>{`
        @media (max-width: 768px) {
          section { padding: 64px 20px !important; }
        }
      `}</style>
    </section>
  );
}