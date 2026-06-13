import { useState } from "react";

const FAQS = [
  {
    q: "How long does it take to go live?",
    a: "2 to 4 weeks. We handle everything \u2014 conversation design, integration with your booking system, testing with real phone calls, and launch. You don\u2019t need a developer, and nothing in your current workflow changes.",
  },
  {
    q: "Does Yael work with my existing booking system?",
    a: "Yes. Yael is configured during setup to connect directly to your existing system. She reads availability and recognizes returning patients \u2014 and writes every confirmed booking and new patient registration. We handle the technical integration. Not sure if your system is compatible? Book a demo \u2014 we\u2019ll tell you in the first 10 minutes.",
  },
  {
    q: "What if Yael makes a mistake?",
    a: "Every action Yael takes sends a real-time SMS to your staff. If she books the wrong slot, your team knows immediately. If a call is escalating or she can\u2019t resolve it, she transfers the caller to a human with a full transcript of everything that was said.",
  },
  {
    q: "Is my patient data secure?",
    a: "Yes. Patient names, phone numbers, and medical information are handled with automatic PII protection \u2014 sensitive data is never stored in plain text. Yael operates in compliance with Israeli data protection law.",
  },
  {
    q: "What happens to my receptionist?",
    a: "Most clinics keep their full team. Yael handles the phone \u2014 typically the most repetitive and stressful part of the receptionist\u2019s day. Your team focuses on patients in the clinic, paperwork, and the interactions that require a human.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section data-faq style={{ background: "#fdfcfc", padding: "100px 48px" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>

        <h2 style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
          fontSize: "36px",
          color: "#000000",
          letterSpacing: "-0.72px",
          lineHeight: 1.15,
          margin: "0 0 40px 0",
        }}>
          Questions
        </h2>

        <div>
          {FAQS.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => toggle(i)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "16px",
                  width: "100%",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  padding: "24px 0",
                  cursor: "pointer",
                }}
              >
                <span style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#000000",
                  lineHeight: 1.5,
                }}>
                  {faq.q}
                </span>
                <span style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "20px",
                  color: "#000000",
                  lineHeight: 1,
                  flexShrink: 0,
                  marginTop: "-2px",
                }}>
                  {openIndex === i ? "\u2212" : "+"}
                </span>
              </button>

              <div style={{
                overflow: "hidden",
                maxHeight: openIndex === i ? "500px" : "0",
                opacity: openIndex === i ? 1 : 0,
                transition: "max-height 300ms ease, opacity 300ms ease",
              }}>
                <p style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "15px",
                  color: "#777169",
                  lineHeight: 1.6,
                  margin: "0 0 24px 0",
                  paddingRight: "32px",
                }}>
                  {faq.a}
                </p>
              </div>

              <div style={{ height: "1px", background: "#e5e5e5" }} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          [data-faq] { padding: 64px 20px !important; }
        }
        @media (max-width: 1024px) {
          [data-faq] { padding: 80px 24px !important; }
        }
      `}</style>
    </section>
  );
}