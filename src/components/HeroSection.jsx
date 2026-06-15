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
          <div className="hero-left" style={{ flex: "0 0 55%", minWidth: 0 }}>
            <h1
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
                color: "#0D0D0D",
                letterSpacing: "-0.025em",
                lineHeight: 1.15,
                margin: 0,
              }}>
              Meet Yael. Your front desk<br />
              on autopilot.
            </h1>

            <div style={{ display: "flex", gap: "16px", marginTop: "28px" }}>
              <a
                href="#book-demo"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "15px",
                  color: "#FFFFFF",
                  backgroundColor: "#0D0D0D",
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
                  color: "#0D0D0D",
                  backgroundColor: "transparent",
                  borderRadius: "999px",
                  padding: "14px 36px",
                  display: "inline-flex",
                  alignItems: "center",
                  textDecoration: "none",
                  border: "1px solid #0D0D0D",
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
          <div className="hero-right" style={{ flex: "0 0 40%", minWidth: 0, alignSelf: "flex-end" }}>
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

          <VoiceOrb activeLang={activeTab} isPlaying={isPlaying} onPhoneClick={handlePhoneClick} />

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-inner { padding: 64px 20px 0 !important; }
          .hero-row { flex-direction: column !important; gap: 24px !important; }
          .hero-left, .hero-right { flex: 1 1 auto !important; width: 100% !important; }
          .hero-demo { padding: 24px 20px 16px !important; }
        }
        @media (max-width: 1024px) {
          .hero-inner { padding: 72px 32px 0 !important; }
        }
      `}</style>
    </section>
  );
}