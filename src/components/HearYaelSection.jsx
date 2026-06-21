import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";

const CARD_META = [
  { id: 1, featured: false, audioUrl: "https://media.base44.com/files/public/6a2ab0818c0d050752d1521b/5600dd582_recording1.wav" },
  { id: 2, featured: true, audioUrl: "https://media.base44.com/files/public/6a2ab0818c0d050752d1521b/b4c684b4f_recording2.wav" },
  { id: 3, featured: false },
  { id: 4, featured: false },
];

// ── Waveform ──────────────────────────────────────────────────────────────────

function WaveformPlaceholder({ featured, playing }) {
  const bars = [
    { height: 18, duration: "0.7s", delay: "0s" },
    { height: 32, duration: "0.9s", delay: "0.15s" },
    { height: 24, duration: "0.6s", delay: "0.05s" },
    { height: 40, duration: "1.0s", delay: "0.25s" },
    { height: 28, duration: "0.75s", delay: "0.1s" },
    { height: 20, duration: "0.85s", delay: "0.2s" },
    { height: 36, duration: "0.65s", delay: "0.3s" },
    { height: 22, duration: "0.95s", delay: "0.08s" },
    { height: 30, duration: "0.8s", delay: "0.18s" },
    { height: 16, duration: "0.7s", delay: "0.35s" },
    { height: 38, duration: "0.9s", delay: "0.12s" },
    { height: 26, duration: "0.6s", delay: "0.28s" },
  ];

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "3px",
      height: "52px",
      background: featured ? "#f9f9f9" : "#f5f5f5",
      borderRadius: "10px",
      padding: "0 16px",
    }}>
      {bars.map((bar, i) => (
        <div
          key={i}
          style={{
            width: "3px",
            height: playing ? `${bar.height}px` : "6px",
            borderRadius: "9999px",
            background: playing ? "#000000" : (featured ? "#c0c0c0" : "#e0e0e0"),
            animation: playing ? `waveform-pulse ${bar.duration} ${bar.delay} ease-in-out infinite alternate` : "none",
            transition: "height 0.3s ease, background 0.3s ease",
          }}
        />
      ))}
      <style>{`
        @keyframes waveform-pulse {
          from { transform: scaleY(0.3); opacity: 0.5; }
          to   { transform: scaleY(1);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function AudioCard({ card, featuredLabel }) {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!card.audioUrl) return;
    const audio = new Audio(card.audioUrl);
    audioRef.current = audio;
    audio.addEventListener("ended", () => setPlaying(false));
    audio.addEventListener("timeupdate", () => setCurrentTime(audio.currentTime));
    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
    return () => { audio.pause(); };
  }, [card.audioUrl]);

  const handlePlayPause = () => {
    if (!card.audioUrl) { setPlaying((p) => !p); return; }
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
    } else {
      audioRef.current?.play();
      setPlaying(true);
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  };

  const handleSkip = (secs) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + secs));
  };

  const formatTime = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const progress = duration ? currentTime / duration : 0;

  return (
    <div style={{
      background: "#ffffff",
      borderRadius: "16px",
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      gap: "14px",
      boxShadow: card.featured
        ? "0 4px 24px rgba(0,0,0,0.08), 0 0 0 1px #000000"
        : "rgba(0,0,0,0.4) 0px 0px 1px 0px, rgba(0,0,0,0.05) 0px 4px 12px 0px",
      border: card.featured ? "1px solid #000000" : "none",
      position: "relative",
    }}>
      {card.featured && (
        <div style={{
          position: "absolute",
          top: "-10px",
          left: "20px",
          background: "#000000",
          color: "#ffffff",
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          fontSize: "10px",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          padding: "3px 10px",
          borderRadius: "9999px",
        }}>
          {featuredLabel}
        </div>
      )}

      <div>
        <div style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
          fontSize: "15px",
          color: "#000000",
          marginBottom: "4px",
        }}>
          {card.title}
        </div>
        <div style={{
          fontFamily: "Inter, sans-serif",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "13px",
          color: "#a59f97",
          lineHeight: 1.5,
        }}>
          {card.description}
        </div>
      </div>

      {/* Player row */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          onClick={handlePlayPause}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "9999px",
            background: "#000000",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            transition: "opacity 0.15s ease",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          {playing ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
              <rect x="1.5" y="1" width="3.5" height="10" rx="1" />
              <rect x="7" y="1" width="3.5" height="10" rx="1" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="white" style={{ marginLeft: "2px" }}>
              <polygon points="2,1 11,6 2,11" />
            </svg>
          )}
        </button>

        <div style={{ flex: 1 }}>
          <WaveformPlaceholder featured={card.featured} playing={playing} />
        </div>
      </div>

      {/* Seek bar + controls */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div
          onClick={handleSeek}
          style={{
            height: "3px",
            background: "#e5e5e5",
            borderRadius: "9999px",
            cursor: card.audioUrl ? "pointer" : "default",
            position: "relative",
          }}
        >
          <div style={{
            width: `${progress * 100}%`,
            height: "100%",
            background: "#000000",
            borderRadius: "9999px",
            transition: "width 0.1s linear",
          }} />
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "11px", color: "#a59f97" }}>
            {formatTime(currentTime)}{duration ? ` / ${formatTime(duration)}` : ""}
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => handleSkip(-10)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center", opacity: card.audioUrl ? 1 : 0.3 }}
              title="Back 10s"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#777169" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 .49-4" />
                <text x="7" y="15" fontSize="7" fill="#777169" stroke="none" fontFamily="Inter" fontWeight="500">10</text>
              </svg>
            </button>
            <button
              onClick={() => handleSkip(10)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center", opacity: card.audioUrl ? 1 : 0.3 }}
              title="Forward 10s"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#777169" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-.49-4" />
                <text x="7" y="15" fontSize="7" fill="#777169" stroke="none" fontFamily="Inter" fontWeight="500">10</text>
              </svg>
            </button>
          </div>
        </div>
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
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
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
            <AudioCard key={card.id} card={card} featuredLabel={t.hear.featured} />
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