import React from "react";

const CARDS = [
  {
    title: "Every unanswered call is a patient who just called your competitor.",
    body: "Average dental appointment: ₪900. Five missed calls a day. That's ₪1,125,000 in unrealized revenue per year.",
  },
  {
    title: "Patients don't stop calling at 6pm. Your receptionist does.",
    body: "40% of appointment requests come outside business hours. Every one of them goes to voicemail.",
  },
  {
    title: "A French-speaking patient who isn't answered in French doesn't call back.",
    body: "Over 30,000 French-speaking residents in Netanya need dental care. One call in the wrong language is a patient lost.",
  },
];

export default function ProblemSection() {
  return (
    <section style={{ backgroundColor: "#fdfcfc", padding: "80px 24px" }}>
      <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: "36px",
            color: "#000000",
            letterSpacing: "-0.72px",
            lineHeight: 1.2,
            margin: "0 0 48px 0",
          }}
        >
          The problem with missing calls.
        </h2>

        <div className="problem-grid">
          {CARDS.map((card, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#f5f3f1",
                borderRadius: "20px",
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#000000",
                  lineHeight: 1.4,
                  margin: 0,
                }}
              >
                {card.title}
              </p>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "14px",
                  color: "#777169",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .problem-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 768px) {
          .problem-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}