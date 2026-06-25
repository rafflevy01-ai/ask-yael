import React, { useState } from "react";
import { Phone, X } from "lucide-react";

export default function CallbackWidget() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"

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
      {/* Trigger tab — fixed on the right edge, vertical */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Recevoir un appel de Yael"
          style={{
            position: "fixed",
            top: "50%",
            right: 0,
            transform: "translateY(-50%)",
            zIndex: 9998,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#0D0D0D",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "12px 0 0 12px",
            padding: "16px 12px",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "13px",
            writingMode: "vertical-rl",
            boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
          }}
        >
          <Phone size={16} style={{ transform: "rotate(90deg)" }} />
          Recevoir un appel
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          dir="ltr"
          style={{
            position: "fixed",
            top: "50%",
            right: "20px",
            transform: "translateY(-50%)",
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
            onClick={() => setOpen(false)}
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