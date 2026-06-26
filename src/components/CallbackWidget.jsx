import React, { useState, useRef, useEffect } from "react";
import { Phone, X, ChevronDown } from "lucide-react";

const LANGUAGES = [
  { code: "he", label: "עברית", flag: "🇮🇱" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

export default function CallbackWidget() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"
  const [lang, setLang] = useState("he");
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const resetForm = () => {
    setName("");
    setPhone("");
    setStatus(null);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleOpen = () => {
    resetForm();
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("https://flow.automationraff.com/webhook/demo-callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, language: lang }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  };

  const activeLang = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  return (
    <>
      {/* Persistent ElevenLabs-style widget — fixed bottom-right, always visible */}
      {!open && (
        <div
          dir="ltr"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 9998,
            background: "#FFFFFF",
            borderRadius: "18px",
            padding: "16px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.16)",
            border: "1px solid rgba(0,0,0,0.05)",
            fontFamily: "Inter, sans-serif",
            maxWidth: "calc(100vw - 40px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <span style={{ position: "relative", display: "flex", width: "8px", height: "8px" }}>
              <span style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: "#22c55e", animation: "cb-ping 1.6s cubic-bezier(0,0,0.2,1) infinite",
              }} />
              <span style={{ position: "relative", width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e" }} />
            </span>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "14px", color: "#0D0D0D", letterSpacing: "-0.01em" }}>
              Listen to Yael live
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Ask anything — main call button */}
            <button
              onClick={handleOpen}
              aria-label="Listen to Yael live"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                flex: 1,
                background: "#0D0D0D",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "999px",
                padding: "9px 18px",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: "13px",
                whiteSpace: "nowrap",
                transition: "opacity 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <Phone size={15} />
              Ask anything
            </button>

            {/* Language selector */}
            <div ref={langRef} style={{ position: "relative" }}>
              <button
                onClick={() => setLangOpen((o) => !o)}
                aria-label="Choose language"
                style={{ ...iconBtnStyle, width: "auto", padding: "0 10px", gap: "5px" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#0D0D0D")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E5E5E5")}
              >
                <span style={{ fontSize: "18px", lineHeight: 1 }}>{activeLang.flag}</span>
                <ChevronDown size={13} color="#0D0D0D" style={{
                  transform: langOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s ease",
                }} />
              </button>

              {langOpen && (
                <div style={{
                  position: "absolute",
                  bottom: "calc(100% + 8px)",
                  right: 0,
                  background: "#FFFFFF",
                  borderRadius: "12px",
                  boxShadow: "0 8px 28px rgba(0,0,0,0.16)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  padding: "5px",
                  minWidth: "138px",
                }}>
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "9px",
                        width: "100%",
                        background: l.code === lang ? "#F5F5F5" : "transparent",
                        border: "none",
                        borderRadius: "7px",
                        padding: "8px 10px",
                        cursor: "pointer",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        color: "#0D0D0D",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F5F5")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = l.code === lang ? "#F5F5F5" : "transparent")}
                    >
                      <span style={{ fontSize: "17px", lineHeight: 1 }}>{l.flag}</span>
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <style>{`
            @keyframes cb-ping { 75%, 100% { transform: scale(2.2); opacity: 0; } }
          `}</style>
        </div>
      )}

      {/* Panel */}
      {open && (
        <div
          dir="ltr"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 9999,
            width: "300px",
            maxWidth: "calc(100vw - 40px)",
            background: "#FFFFFF",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.22)",
            border: "1px solid rgba(0,0,0,0.06)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <button
            onClick={handleClose}
            aria-label="Fermer"
            style={{
              position: "absolute",
              top: "14px",
              right: "14px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#a59f97",
              padding: 0,
              lineHeight: 0,
            }}
          >
            <X size={18} />
          </button>

          <div style={{ marginBottom: "18px" }}>
            <div style={{ fontWeight: 600, fontSize: "16px", color: "#0D0D0D", marginBottom: "4px" }}>
              Recevoir un appel de Yael
            </div>
            <div style={{ fontSize: "13px", color: "#777169", lineHeight: 1.5 }}>
              Laissez vos coordonnées, Yael vous rappelle en quelques secondes.
            </div>
          </div>

          {status === "success" ? (
            <div style={{ fontSize: "14px", color: "#0D0D0D", lineHeight: 1.5, fontWeight: 500 }}>
              📞 Yael vous appelle ! Décrochez dans quelques secondes…
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input
                type="text"
                required
                placeholder="Nom complet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={status === "loading"}
                style={inputStyle}
              />
              <input
                type="tel"
                required
                placeholder="Numéro de téléphone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={status === "loading"}
                style={inputStyle}
              />

              {status === "error" && (
                <div style={{ fontSize: "13px", color: "#dc2626", lineHeight: 1.4 }}>
                  Une erreur est survenue. Veuillez réessayer.
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                style={{
                  marginTop: "4px",
                  background: "#0D0D0D",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "9999px",
                  padding: "13px 0",
                  fontWeight: 500,
                  fontSize: "14px",
                  cursor: status === "loading" ? "default" : "pointer",
                  opacity: status === "loading" ? 0.7 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {status === "loading" && (
                  <span
                    style={{
                      width: "14px",
                      height: "14px",
                      border: "2px solid rgba(255,255,255,0.4)",
                      borderTopColor: "#FFFFFF",
                      borderRadius: "50%",
                      animation: "cb-spin 0.7s linear infinite",
                    }}
                  />
                )}
                {status === "loading" ? "Envoi…" : "Recevoir un appel de Yael"}
              </button>
            </form>
          )}

          <style>{`@keyframes cb-spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </>
  );
}

const iconBtnStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "38px",
  height: "38px",
  flexShrink: 0,
  background: "#FFFFFF",
  border: "1px solid #E5E5E5",
  borderRadius: "10px",
  cursor: "pointer",
  transition: "border-color 0.15s ease",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 14px",
  borderRadius: "10px",
  border: "1px solid #E5E5E5",
  fontFamily: "Inter, sans-serif",
  fontSize: "14px",
  color: "#0D0D0D",
  outline: "none",
  background: "#FAFAFA",
};