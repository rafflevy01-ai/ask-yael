import React from "react";

const TABS = [
  {
    key: "he",
    label: "Hebrew",
    gradient: "radial-gradient(circle at 40% 35%, #80EAE0 0%, #40E0D0 40%, #0D7377 100%)",
  },
  {
    key: "fr",
    label: "Français",
    gradient: "radial-gradient(circle at 40% 35%, #C4B5FD 0%, #8B5CF6 40%, #6D28D9 100%)",
  },
  {
    key: "en",
    label: "English",
    gradient: "radial-gradient(circle at 40% 35%, #7DD4EC 0%, #22A6C2 40%, #1A6A8A 100%)",
  },
];

function MiniOrb({ gradient }) {
  return (
    <span
      className="mini-orb"
      style={{
        display: "inline-block",
        width: "16px",
        height: "16px",
        borderRadius: "50%",
        background: gradient,
        position: "relative",
        flexShrink: 0,
      }}>
      {/* Specular highlight */}
      <span
        style={{
          position: "absolute",
          top: "2px",
          left: "3px",
          width: "3px",
          height: "3px",
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.7)",
          pointerEvents: "none",
        }}
      />
    </span>
  );
}

export default function TabSwitcher({ activeTab, onTabChange }) {
  return (
    <div
      className="tab-switcher"
      style={{
        display: "inline-flex",
        gap: "4px",
        marginBottom: "40px",
      }}>
<style>{`
  @media (max-width: 768px) {
    .tab-switcher {
      margin-bottom: 28px !important;
      width: 100% !important;
      justify-content: center !important;
      display: flex !important;
    }
    .tab-switcher button {
      font-size: 13px !important;
      padding: 6px 12px !important;
      gap: 6px !important;
    }
    .tab-switcher .mini-orb {
      width: 14px !important;
      height: 14px !important;
    }
  }
`}</style>
      {TABS.map(tab => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: "13px",
              color: isActive ? "#0A0A0A" : "#888888",
              backgroundColor: isActive ? "#FFFFFF" : "transparent",
              border: isActive ? "1px solid #D0CCC8" : "1px solid transparent",
              borderRadius: "999px",
              padding: "6px 24px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}>
            <MiniOrb gradient={tab.gradient} />
            {tab.label}
          </button>
        );
      })}

      <style>{`
        @keyframes orbPulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        .mini-orb {
          animation: orbPulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}