import React from "react";
import { useLanguage } from "@/lib/LanguageContext";

const CARD_META = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
];

function FeatureCard({ card }) {
  return (
    <div style={{
      background: "#ffffff",
      borderRadius: "16px",
      padding: "28px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      boxShadow: "rgba(0,0,0,0.4) 0px 0px 1px 0px, rgba(0,0,0,0.05) 0px 4px 12px 0px",
    }}>
      <div style={{
        fontFamily: "Inter, sans-serif",
        fontWeight: 500,
        fontSize: "16px",
        color: "#000000",
        letterSpacing: "-0.01em",
      }}>
        {card.title}
      </div>
      <div style={{
        fontFamily: "Inter, sans-serif",
        fontWeight: 400,
        fontSize: "14px",
        color: "#777169",
        lineHeight: 1.6,
      }}>
        {card.description}
      </div>
    </div>
  );
}

export default function HearYaelSection() {
  const { t, isRtl } = useLanguage();
  const cards = CARD_META.map((meta) => ({
    ...meta,
    title: t.hear.cards[meta.id].title,
    description: t.hear.cards[meta.id].description,
  }));

  return (
    <section data-hear-yael dir={isRtl ? "rtl" : "ltr"} style={{
      padding: "100px 48px",
      maxWidth: "100%",
      backgroundColor: "#FFFFFF",
      borderTop: "1px solid rgba(0,0,0,0.06)",
    }}>
      <div style={{ maxWidth: "920px", margin: "0 auto" }}>
        <div style={{ marginBottom: "48px", textAlign: "center" }}>
          <span style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#a59f97",
            display: "block",
            marginBottom: "16px",
          }}>
            {t.hear.label}
          </span>
          <h2 style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 300,
            fontSize: "clamp(2rem, 3.5vw, 2.25rem)",
            color: "#0D0D0D",
            letterSpacing: "-0.04em",
            lineHeight: 1.2,
            margin: 0,
          }}>
            {t.hear.title}
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px",
        }}
          className="hear-yael-grid"
        >
          {cards.map((card) => (
            <FeatureCard key={card.id} card={card} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .hear-yael-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          [data-hear-yael] {
            padding: 64px 16px !important;
          }
          [data-hear-yael] h2 { font-size: 1.6rem !important; max-width: 100% !important; text-align: center !important; }
          [data-hear-yael] p  { font-size: 14px !important; }
        }
        @media (max-width: 1024px) {
          [data-hear-yael] {
            padding: 80px 32px !important;
          }
        }
      `}</style>
    </section>
  );
}