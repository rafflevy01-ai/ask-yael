import React, { useState } from "react";
import { Phone, X } from "lucide-react";

export default function CallbackWidget() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"

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
        body: JSON.stringify({ name, phone }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  };

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
            borderRadius: "20px",
            padding: "18px 20px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.16)",
            border: "1px solid rgba(0,0,0,0.05)",
            fontFamily: "Inter, sans-serif",
            maxWidth: "calc(100vw - 40px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
            <span style={{ position: "relative", display: "flex", width: "10px", height: "10px" }}>
              <span style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: "#22c55e", animation: "cb-ping 1.6s cubic-bezier(0,0,0.2,1) infinite",
              }} />
              <span style={{ position: "relative", width: "10px", height: "10px", borderRadius: "50%", background: "#22c55e" }} />
            </span>
            <span style={{ fontWeight: 500, fontSize: "16px", color: "#0D0D0D" }}>
              Listen to Yael live
            </span>
          </div>

          <button
            onClick={handleOpen}
            aria-label="Listen to Yael live"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              width: "100%",
              background: "#0D0D0D",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "9999px",
              padding: "13px 22px",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: "15px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <Phone size={17} />
            Ask anything
          </button>

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