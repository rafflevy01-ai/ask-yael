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

export default function VoiceDemoSection() {
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
        backgroundColor: "#FFFFFF",
        padding: "0 0 80px",
        marginTop: "-60px",
        zIndex: 2,
      }}>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px" }}>
        <div
          style={{
            backgroundColor: "rgba(244, 241, 238, 0.45)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: "16px",
            padding: "40px 40px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          className="voice-demo-card">

          <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="voice-orb-wrap">
            <div className="voice-orb-clip">
              <VoiceOrb
                activeLang={activeTab}
                isPlaying={isPlaying}
                onPhoneClick={handlePhoneClick}
                size={isMobile ? 210 : 280}
              />
            </div>

            <button
              className="voice-phone-btn-mobile"
              onClick={handlePhoneClick}
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                backgroundColor: isPlaying ? "#E53E3E" : "#000000",
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
          .voice-demo-card {
            width: calc(100% - 32px) !important;
            margin: 0 auto !important;
            padding: 36px 20px 24px !important;
          }

          .voice-demo-card .tab-switcher {
            justify-content: center !important;
            gap: 8px !important;
          }
          .voice-demo-card .tab-switcher button {
            flex: 0 1 auto !important;
          }

          .voice-orb-wrap {
            width: 100% !important;
            margin: 0 auto !important;
            padding-bottom: 24px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            position: relative !important;
            overflow: visible !important;
          }

          .voice-orb-clip {
            flex-shrink: 0 !important;
            overflow: hidden !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .voice-orb-clip > div:first-child {
            margin-bottom: 0 !important;
          }
          .voice-orb-clip > div:first-child > button { display: none !important; }

          .voice-phone-btn-mobile {
            display: inline-flex !important;
            position: absolute !important;
            bottom: 0 !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            z-index: 2 !important;
          }
        }
      `}</style>
    </section>
  );
}