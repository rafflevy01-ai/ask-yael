import { useState, useEffect } from "react";
import { AlertTriangle, Shield } from "lucide-react";
import AnimatedTranscript from "@/components/capabilities/AnimatedTranscript";

import SmsStaffPatient from "@/components/capabilities/SmsStaffPatient";
import RegistrationTypewriter from "@/components/capabilities/RegistrationTypewriter";
import MiniLanguageOrb from "@/components/capabilities/MiniLanguageOrb";
import DeescalationTransfer from "@/components/capabilities/DeescalationTransfer";
import OnlineStatusBadge from "@/components/capabilities/OnlineStatusBadge";
import CardTopImage from "@/components/capabilities/CardTopImage";
import LangDetectIOS from "@/components/capabilities/LangDetectIOS";
import { useLanguage } from "@/lib/LanguageContext";

const CARD_IMAGES = {
  language: "https://media.base44.com/images/public/6a2ab0818c0d050752d1521b/259622c4f_generated_image.png",
  recognition: "https://media.base44.com/images/public/6a2ab0818c0d050752d1521b/06a0181e3_generated_image.png",
  booking: "https://media.base44.com/images/public/6a2ab0818c0d050752d1521b/554e81b0f_generated_image.png",
  intake: "https://media.base44.com/images/public/6a2ab0818c0d050752d1521b/fa61db4db_generated_image.png",
};

const LANG_KEYS = ["he", "fr", "en"];

export default function CapabilitiesSection() {
  const { t, isRtl } = useLanguage();
  const LANGS = LANG_KEYS.map((key) => ({ key, label: t.caps.langLabels[key] }));
  const [activeLangIndex, setActiveLangIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLangIndex((prev) => (prev + 1) % LANGS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);
  return (
    <section data-capabilities dir={isRtl ? "rtl" : "ltr"} style={{ padding: "80px 40px", backgroundColor: "#FFFFFF", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
      <div style={{ maxWidth: "1080px", margin: "0 auto" }}>

        {/* Header */}
        <span style={{
          fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "10px",
          textTransform: "uppercase", letterSpacing: "0.12em", color: "#6B6B6B",
          display: "block", marginBottom: "14px",
        }}>
          {t.caps.label}
        </span>
        <h2 style={{
          fontFamily: "Inter, sans-serif", fontWeight: 300, fontSize: "clamp(2rem, 3.5vw, 2.25rem)",
          color: "#0D0D0D", letterSpacing: "-0.04em", lineHeight: 1.2,
          margin: "0 0 40px 0", textAlign: isRtl ? "right" : "left", maxWidth: "600px",
          marginInlineStart: 0,
        }}>
          {t.caps.title}
        </h2>

        {/* Bento Grid */}
        <div className="caps-bento">

          {/* ROW 1 — Two 2-column cards */}
          <div className="caps-bento-row">

            {/* Left: Live Call Handling (2 cols) */}
            <div className="caps-bento-card caps-card-col2">
              <div className="caps-card-inner">
                <h3 className="caps-card-title">{t.caps.liveTitle}</h3>
                <p className="caps-card-desc">{t.caps.liveDesc}</p>
                <div className="caps-card-visual-tall">
                  <AnimatedTranscript />
                </div>
              </div>
            </div>

            {/* Right: Real-time SMS to Staff and Patient (2 cols) */}
            <div className="caps-bento-card caps-card-col2">
              <div className="caps-card-inner">
                <CardTopImage src={CARD_IMAGES.recognition} alt={t.caps.smsTitle} />
                <h3 className="caps-card-title">{t.caps.smsTitle}</h3>
                <p className="caps-card-desc">{t.caps.smsDesc}</p>
                <div className="caps-card-visual-tall">
                  <SmsStaffPatient />
                </div>
              </div>
            </div>
          </div>

          {/* ROW 2 — Four equal cards */}
          <div className="caps-bento-row">

            {/* Card: Automatic Language Detection */}
          <div className="caps-bento-card">
            <div className="caps-card-inner">
              <LangDetectIOS />
              <h3 className="caps-card-title">{t.caps.langTitle}</h3>
              <p className="caps-card-desc">{t.caps.langDesc}</p>
              <div className="caps-card-visual" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "28px" }}>
                {LANGS.map((lang, i) => {
                  const isActive = i === activeLangIndex;
                  return (
                    <div key={lang.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                      <MiniLanguageOrb langKey={lang.key} isActive={isActive} />
                      <span style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "10px",
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? "#0D0D0D" : "#6B6B6B",
                        transition: "all 0.4s ease",
                      }}>
                        {lang.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card: New Patient Registration */}
          <div className="caps-bento-card">
            <div className="caps-card-inner">
              <CardTopImage src={CARD_IMAGES.intake} alt={t.caps.regTitle} />
              <h3 className="caps-card-title">{t.caps.regTitle}</h3>
              <p className="caps-card-desc">{t.caps.regDesc}</p>
              <div className="caps-card-visual" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <RegistrationTypewriter />
              </div>
            </div>
          </div>

          {/* Card: HMO and Insurance */}
          <div className="caps-bento-card">
            <div className="caps-card-inner" style={{ alignItems: "center", textAlign: "center", justifyContent: "center" }}>
              <Shield size={28} strokeWidth={1.6} color="#000000" style={{ marginBottom: "14px" }} />
              <h4 style={{
                fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "14px",
                color: "#0D0D0D", margin: "0 0 6px",
              }}>
                {t.caps.hmoTitle}
              </h4>
              <p style={{
                fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "12px",
                color: "#6B6B6B", lineHeight: 1.5, margin: 0,
              }}>
                {t.caps.hmoDesc}
              </p>
            </div>
          </div>

            {/* Card 4: 24/7 Availability */}
            <div className="caps-bento-card">
              <div className="caps-card-inner">
                <CardTopImage src={CARD_IMAGES.booking} alt={t.caps.availTitle} />
                <h3 className="caps-card-title">{t.caps.availTitle}</h3>
                <p className="caps-card-desc">{t.caps.availDesc}</p>
                <div className="caps-card-visual">
                  <OnlineStatusBadge />
                </div>
              </div>
            </div>
          </div>

          {/* ROW 3 — Emergency & De-escalation wide cards */}
          <div className="caps-bento-row">

            {/* Left: Emergency Triage */}
            <div className="caps-bento-card caps-card-col2">
              <div className="caps-card-inner" style={{ alignItems: "center", justifyContent: "center", textAlign: "center", padding: "28px 24px" }}>
                <AlertTriangle size={28} strokeWidth={1.6} color="#EF4444" />
                <h4 style={{
                  fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "14px",
                  color: "#0D0D0D", margin: "14px 0 6px",
                }}>
                  {t.caps.emergencyTitle}
                </h4>
                <p style={{
                  fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "12px",
                  color: "#6B6B6B", lineHeight: 1.5, margin: 0,
                }}>
                  {t.caps.emergencyDesc}
                </p>
              </div>
            </div>

            {/* Right: De-escalation (2 cols) */}
            <div className="caps-bento-card caps-card-col2">
              <div className="caps-card-inner">
                <h3 className="caps-card-title">{t.caps.deescTitle}</h3>
                <p className="caps-card-desc">{t.caps.deescDesc}</p>
                <div className="caps-card-visual" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <DeescalationTransfer />
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      <style>{`
        .caps-bento {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .caps-bento-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .caps-bento-card {
          background: #FFFFFF;
          border-radius: 16px;
          border: 1px solid rgba(0,0,0,0.06);
          overflow: hidden;
        }

        .caps-card-col2 {
          grid-column: span 2;
        }

        .caps-card-col4 {
          grid-column: span 4;
        }

        .caps-card-inner {
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .caps-card-title {
          font-family: "Inter", sans-serif;
          font-weight: 500;
          font-size: 14px;
          color: #0D0D0D;
          margin: 0 0 4px;
          letter-spacing: -0.01em;
        }

        .caps-card-desc {
          font-family: "Inter", sans-serif;
          font-weight: 400;
          font-size: 12px;
          color: #6B6B6B;
          margin: 0 0 16px;
          line-height: 1.5;
        }

        .caps-card-visual {
          flex: 1;
          min-height: 120px;
        }

        .caps-card-visual-tall {
          flex: 1;
          min-height: 280px;
        }

        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }

        @media (max-width: 900px) {
          .caps-bento-row {
            grid-template-columns: 1fr !important;
          }
          .caps-card-col2,
          .caps-card-col4 {
            grid-column: span 1 !important;
          }
        }

        @media (max-width: 768px) {
          [data-capabilities] { padding: 56px 16px !important; }
          [data-capabilities] h2 { font-size: 1.6rem !important; max-width: 100% !important; text-align: center !important; }
          [data-capabilities] > div > span { display: block !important; text-align: center !important; }
          .caps-card-title { font-size: 15px !important; }
          [data-capabilities] p  { font-size: 13px !important; }
          [data-capabilities] h4 { font-size: 15px !important; }
        }

        @media (max-width: 1024px) {
          [data-capabilities] { padding: 64px 32px !important; }
        }
      `}</style>
    </section>
  );
}