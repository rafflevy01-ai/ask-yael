import { useState, useEffect, useRef } from "react";

const CONVERSATIONS = [
  {
    lang: "FR",
    messages: [
      { role: "patient", text: "Bonjour, je voudrais prendre un rendez-vous pour jeudi prochain." },
      { role: "yael", text: "Je vous réserve le jeudi 12 à 9h. On confirme ?" },
      { role: "patient", text: "Oui, parfait, merci !" },
      { role: "yael", text: "C'est noté. Vous recevrez un SMS de confirmation." },
    ],
  },
  {
    lang: "HE",
    messages: [
      { role: "patient", text: "שלום, זאת פעם ראשונה שלי אצלכם. אני רוצה להירשם." },
      { role: "yael", text: "ברוכים הבאים! אשמח לקחת את הפרטים. מה השם המלא?" },
      { role: "patient", text: "דוד כהן." },
      { role: "yael", text: "תודה דוד. מה תאריך הלידה וקופת החולים?" },
    ],
  },
  {
    lang: "EN",
    messages: [
      { role: "patient", text: "I have a terrible toothache, I need to see someone today." },
      { role: "yael", text: "I understand — let me get you an urgent slot. Same-day emergency visits include a ₪300 surcharge. Is that okay?" },
      { role: "patient", text: "Yes, that's fine. When can I come?" },
      { role: "yael", text: "I have 10:30 available. I'll reserve it for you now." },
    ],
  },
];

const LANGS = [
  { key: "FR", label: "FR", color: "#3B82F6" },
  { key: "HE", label: "עב", color: "#8B5CF6" },
  { key: "EN", label: "EN", color: "#10B981" },
];

export default function AnimatedTranscript() {
  const [convIndex, setConvIndex] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);
  const scrollRef = useRef(null);

  const conv = CONVERSATIONS[convIndex];

  // Call timer
  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed((p) => p + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  // Message sequencing
  useEffect(() => {
    if (msgIndex >= conv.messages.length) {
      // Switch conversation
      const t = setTimeout(() => {
        setVisibleMessages([]);
        setMsgIndex(0);
        setConvIndex((p) => (p + 1) % CONVERSATIONS.length);
      }, 2000);
      return () => clearTimeout(t);
    }

    setIsTyping(true);
    const typingDuration = 800 + Math.random() * 600;
    const t = setTimeout(() => {
      setIsTyping(false);
      setVisibleMessages((prev) => [...prev, conv.messages[msgIndex]]);
      setMsgIndex((p) => p + 1);
    }, typingDuration);

    return () => clearTimeout(t);
  }, [msgIndex, convIndex]);

  // Auto-scroll within card only
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleMessages]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.06)", marginBottom: "8px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            width: "8px", height: "8px", borderRadius: "50%", background: "#22C55E",
            display: "inline-block", animation: "pulse-dot 1.5s ease-in-out infinite",
          }} />
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "12px", color: "#0D0D0D" }}>
            Live call
          </span>
          <WaveformBars />
        </div>
        <span style={{
          fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "12px", color: "#888",
          fontVariantNumeric: "tabular-nums",
        }}>
          {formatTime(elapsed)}
        </span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflow: "auto", paddingRight: "4px", minHeight: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {visibleMessages.map((msg, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: msg.role === "patient" ? "flex-start" : "flex-end",
              animation: "fadeInUp 0.35s ease-out",
            }}>
              <div style={{
                maxWidth: "78%", padding: "8px 12px", borderRadius: "12px",
                fontFamily: "Inter, sans-serif", fontSize: "12px", lineHeight: 1.5,
                background: msg.role === "patient" ? "#F1F0EE" : "#DBEAFE",
                color: "#0D0D0D",
                borderTopLeftRadius: msg.role === "patient" ? "2px" : "12px",
                borderTopRightRadius: msg.role === "patient" ? "12px" : "2px",
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={{ display: "flex", justifyContent: msgIndex % 2 === 0 ? "flex-start" : "flex-end" }}>
              <div style={{
                padding: "8px 16px", borderRadius: "12px",
                background: msgIndex % 2 === 0 ? "#F1F0EE" : "#DBEAFE",
                display: "flex", gap: "3px",
              }}>
                <TypingDot delay="0s" /><TypingDot delay="0.2s" /><TypingDot delay="0.4s" />
              </div>
            </div>
          )}
          <div />
        </div>
      </div>

      {/* Language pills */}
      <div style={{
        display: "flex", justifyContent: "center", gap: "8px",
        paddingTop: "10px", borderTop: "1px solid rgba(0,0,0,0.06)", marginTop: "8px",
      }}>
        {LANGS.map((l) => (
          <span key={l.key} style={{
            fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "10px",
            padding: "4px 10px", borderRadius: "999px",
            background: conv.lang === l.key ? "#0D0D0D" : "transparent",
            color: conv.lang === l.key ? "#FFFFFF" : "#888888",
            border: conv.lang === l.key ? "none" : "1px solid #E5E5E5",
            transition: "all 0.3s ease",
          }}>
            {l.label}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function WaveformBars() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "1.5px", height: "14px" }}>
      {[0,1,2,3].map((i) => (
        <span key={i} style={{
          width: "2px", height: "100%", background: "#22C55E", borderRadius: "1px",
          animation: `wave-${i} 0.7s ease-in-out infinite`,
          animationDelay: `${i * 0.15}s`,
        }} />
      ))}
      <style>{`
        ${[0,1,2,3].map(i => `
          @keyframes wave-${i} {
            0%, 100% { height: 4px; }
            50% { height: ${8 + i * 2}px; }
          }
        `).join('')}
      `}</style>
    </div>
  );
}

function TypingDot({ delay }) {
  return (
    <span style={{
      width: "5px", height: "5px", borderRadius: "50%", background: "#999",
      animation: "bounce 0.8s ease-in-out infinite",
      animationDelay: delay,
      display: "inline-block",
    }} />
  );
}