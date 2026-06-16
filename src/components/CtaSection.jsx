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
    <section data-cta style={{ backgroundColor: "#F7F7F5", padding: "80px 40px 40px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <h2
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: "36px",
            color: "#0D0D0D",
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
            color: "#555555",
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
              color: "#FFFFFF",
              background: "#73C2FB",
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
              color: "#73C2FB",
              background: "transparent",
              border: "1.5px solid #73C2FB",
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
            color: "#888888",
            margin: "0 0 24px",
          }}
        >
          No sales pitch. No contract. Just a live demo.
        </p>

        <div
          ref={calendlyRef}
          style={{
            width: "100%",
            maxWidth: "480px",
            height: "500px",
            margin: "0 auto",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        />
      </div>

      <style>{`
        @media (max-width: 768px) {
          [data-cta] { padding: 64px 20px !important; }
          [data-cta] h2 { font-size: 1.6rem !important; }
          [data-cta] p  { font-size: 15px !important; }
        }
      `}</style>
    </section>
  );
}