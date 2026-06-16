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
  const [isMobile, setIsMobile] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handleChange = () => setIsMobile(mq.matches);
    handleChange();
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

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
            padding: "40px 40px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          className="hero-demo">

          <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="hero-orb-wrap">
            {/* Inner clip wrapper — clips the orb, but not the phone button */}
            <div className="hero-orb-clip">
              <VoiceOrb
                activeLang={activeTab}
                isPlaying={isPlaying}
                onPhoneClick={handlePhoneClick}
                size={isMobile ? 210 : 280}
              />
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
          .hero-inner { padding: 100px 16px 0 !important; }
          .hero-row {
            flex-direction: column !important;
            gap: 14px !important;
            padding: 0 !important;
            margin-bottom: 32px !important;
          }
          .hero-left, .hero-right { flex: 1 1 auto !important; width: 100% !important; text-align: center !important; }
          .hero-left h1 { font-size: 1.6rem !important; }
          .hero-cta-row { flex-direction: row !important; gap: 8px !important; margin-top: 20px !important; justify-content: center !important; }
          .hero-cta-row a {
            flex: 1 !important;
            min-width: 0 !important;
            padding: 10px 14px !important;
            font-size: 13px !important;
          }
          .hero-right p { font-size: 14px !important; }

          /* Matches ProblemSection's nested-inset pattern: 16px container padding + 16px card margin = 32px from edge */
          .hero-demo {
            width: calc(100% - 32px) !important;
            margin: 0 auto 32px !important;
            padding: 36px 20px 24px !important;
            overflow: visible !important;
          }

          .hero-demo .tab-switcher {
            justify-content: center !important;
            gap: 8px !important;
          }
          .hero-demo .tab-switcher button {
            flex: 0 1 auto !important;
          }

          /* The orb now renders natively at 210px on mobile (via VoiceOrb's size prop) instead of
             being CSS-scaled, so the clip box just needs to auto-size to match it exactly. */
          .hero-orb-wrap {
            width: 100% !important;
            margin: 0 auto !important;
            padding-bottom: 24px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            position: relative !important;
            overflow: visible !important;
          }

          .hero-orb-clip {
            flex-shrink: 0 !important;
            overflow: hidden !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          /* The orb's own marginBottom makes room for its built-in phone button, which is hidden
             here in favor of the separate .hero-phone-btn-mobile — without removing it, the clip's
             auto-height would include that empty space and stop being a perfect square. */
          .hero-orb-clip > div:first-child {
            margin-bottom: 0 !important;
          }
          .hero-orb-clip > div:first-child > button { display: none !important; }

          .hero-phone-btn-mobile {
            display: inline-flex !important;
            position: absolute !important;
            bottom: 0 !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            z-index: 2 !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .hero-inner { padding: 72px 32px 0 !important; }
        }
      `}</style>
    </section>
  );
}