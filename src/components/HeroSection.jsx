import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import VoiceOrb from "./VoiceOrb";
import TabSwitcher from "./TabSwitcher";


const TTS_TEXTS = {
  en: "Hi there! I'm Yael, your AI dental assistant. I'm here to help you book appointments, answer your questions, and make sure you're taken care of — any time, day or night. What can I do for you today?",
  fr: "Bonjour ! Je suis Yael, votre assistante dentaire virtuelle. Je suis là pour prendre vos rendez-vous, répondre à vos questions et m'assurer que vous êtes bien pris en charge — à toute heure. Qu'est-ce que je peux faire pour vous aujourd'hui ?",
};

const HEBREW_AUDIO_URL = "https://media.base44.com/files/public/6a2ab0818c0d050752d1521b/416b68379_ElevenLabs_2026-06-14T22_10_57_Christina-EnergeticCommercialAmericanFemaleVoice_pvc_sp109_s19_sb75_v3.mp3";
const FRENCH_AUDIO_URL = "https://media.base44.com/files/public/6a2ab0818c0d050752d1521b/4e7c757aa_2233.mp3";
const ENGLISH_AUDIO_URL = "https://media.base44.com/files/public/6a2ab0818c0d050752d1521b/d266f3f71_ElevenLabs_2026-06-14T22_15_08_Christina-EnergeticCommercialAmericanFemaleVoice_pvc_sp109_s19_sb75_v3.mp3";

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState("he");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, [activeTab]);

  const handlePhoneClick = async () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);

    try {
      let audioUrl;

      if (activeTab === "he") {
        audioUrl = HEBREW_AUDIO_URL;
      } else if (activeTab === "fr") {
        audioUrl = FRENCH_AUDIO_URL;
      } else if (activeTab === "en") {
        audioUrl = ENGLISH_AUDIO_URL;
      } else {
        const response = await base44.functions.invoke("elevenLabsTTS", {
          text: TTS_TEXTS[activeTab],
        });

        const base64 = response.data.audio;
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const audioBlob = new Blob([bytes], { type: "audio/mpeg" });
        audioUrl = URL.createObjectURL(audioBlob);
      }

      const audio = new Audio(audioUrl);

      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
        audioRef.current = null;
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        setIsPlaying(false);
        audioRef.current = null;
        URL.revokeObjectURL(audioUrl);
      };

      audio.play().catch((e) => {
        console.error("Audio play rejected:", e);
        setIsPlaying(false);
        audioRef.current = null;
        URL.revokeObjectURL(audioUrl);
      });
    } catch (error) {
      console.error("TTS playback error:", error);
      setIsPlaying(false);
    }
  };

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        backgroundColor: "#F7F7F5",
        minHeight: "100vh",
        paddingBottom: "60px",
      }}>

      <div className="hero-inner" style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 40px 0" }}>

        {/* ─── TWO-COLUMN ROW ─── */}
        <div
          className="hero-row"
          style={{
            display: "flex",
            gap: "5%",
            alignItems: "flex-start",
            marginBottom: "40px",
          }}>

          {/* LEFT — headline + buttons */}
          <div className="hero-left" style={{ flex: "0 0 60%", minWidth: 0 }}>
            <h1
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 200,
                fontSize: "clamp(1.75rem, 2.5vw, 2.5rem)",
                color: "#0D0D0D",
                letterSpacing: "-0.025em",
                lineHeight: 1.15,
                margin: 0,
              }}>
              Meet Yael.<br />
              Your front desk on autopilot.
            </h1>

            <div className="hero-cta-row" style={{ display: "flex", gap: "16px", marginTop: "28px" }}>
              <a
                href="#book-demo"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "15px",
                  color: "#FFFFFF",
                  backgroundColor: "#0DB8A9",
                  borderRadius: "999px",
                  padding: "14px 36px",
                  display: "inline-flex",
                  alignItems: "center",
                  textDecoration: "none",
                  border: "none",
                  cursor: "pointer",
                  minWidth: "200px",
                  justifyContent: "center",
                  transition: "opacity 0.15s ease",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                Book a Free Demo
              </a>

              <a
                href="#how-it-works"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "15px",
                  color: "rgba(13, 184, 169, 0.7)",
                  backgroundColor: "transparent",
                  borderRadius: "999px",
                  padding: "14px 36px",
                  display: "inline-flex",
                  alignItems: "center",
                  textDecoration: "none",
                  border: "1.5px solid #0DB8A9",
                  cursor: "pointer",
                  minWidth: "200px",
                  justifyContent: "center",
                  transition: "opacity 0.15s ease",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                See How It Works
              </a>
            </div>
          </div>

          {/* RIGHT — description */}
          <div className="hero-right" style={{ flex: "0 0 35%", minWidth: 0, alignSelf: "flex-end" }}>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: "16px",
                color: "#555555",
                lineHeight: 1.6,
                margin: 0,
              }}>
              Yael answers every call in Hebrew, French, or English — booking appointments,
              registering new patients, and handling emergencies, 24/7, so your team never has to.
            </p>
          </div>
        </div>

        {/* ─── DEMO CARD ─── */}
        <div
          style={{
            backgroundColor: "#EEECEA",
            border: "1px solid #E0DDD9",
            borderRadius: "16px",
            padding: "36px 32px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          className="hero-demo">

          <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="hero-orb-wrap">
            {/* Inner clip wrapper — clips the orb, but not the phone button */}
            <div className="hero-orb-clip">
              <VoiceOrb activeLang={activeTab} isPlaying={isPlaying} onPhoneClick={handlePhoneClick} />
            </div>

            {/* Mobile phone button — absolutely positioned, half-inside half-below the orb */}
            <button
              className="hero-phone-btn-mobile"
              onClick={handlePhoneClick}
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                backgroundColor: isPlaying ? "#E53E3E" : "#0DB8A9",
                border: "3px solid #FFFFFF",
                cursor: "pointer",
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </button>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-inner { padding: 56px 16px 0 !important; }
          .hero-row {
            flex-direction: column !important;
            gap: 14px !important;
            padding: 0 !important;
            margin-bottom: 40px !important;
          }
          .hero-left, .hero-right { flex: 1 1 auto !important; width: 100% !important; }
          .hero-left h1 { font-size: 2rem !important; }
          .hero-cta-row { flex-direction: column !important; gap: 10px !important; }
          .hero-cta-row a {
            width: 100% !important;
            min-width: 0 !important;
            padding: 12px 24px !important;
            font-size: 14px !important;
          }
          .hero-right p { font-size: 14px !important; }

          .hero-demo {
            width: calc(100% - 32px) !important;
            margin: 0 auto 32px !important;
            padding: 24px 8px 60px !important;
            border-radius: 16px !important;
            overflow: visible !important;
          }

          .hero-orb-wrap {
            width: 100% !important;
            height: 260px !important;
            margin: 0 auto !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            flex-shrink: 0 !important;
            position: relative !important;
          }

          .hero-orb-clip {
            width: 100% !important;
            height: 260px !important;
            overflow: hidden !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .hero-orb-clip > div:first-child {
            transform: scale(0.75) !important;
            transform-origin: center center !important;
          }
          .hero-orb-clip > div:first-child > button { display: none !important; }

          .hero-phone-btn-mobile {
            display: inline-flex !important;
            position: absolute !important;
            bottom: 20px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            z-index: 2 !important;
          }
        }
        @media (max-width: 1024px) {
          .hero-inner { padding: 72px 32px 0 !important; }
        }
      `}</style>
    </section>
  );
}