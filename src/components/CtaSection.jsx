export default function CtaSection() {
  return (
    <section style={{ backgroundColor: "#000000", padding: "96px 40px" }}>
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
            margin: 0,
          }}
        >
          No sales pitch. No contract. Just a live demo.
        </p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          section { padding: 64px 20px !important; }
        }
      `}</style>
    </section>
  );
}