import { AlertTriangle, Shield } from "lucide-react";
import AnimatedTranscript from "@/components/capabilities/AnimatedTranscript";
import LanguagePills from "@/components/capabilities/LanguagePills";
import SmsSequence from "@/components/capabilities/SmsSequence";
import DataPillsSequence from "@/components/capabilities/DataPillsSequence";
import RecoveryChart from "@/components/capabilities/RecoveryChart";

export default function CapabilitiesSection() {
  return (
    <section data-capabilities style={{ padding: "80px 40px", backgroundColor: "#FAFAF8" }}>
      <div style={{ maxWidth: "1080px", margin: "0 auto" }}>

        {/* Header */}
        <span style={{
          fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "10px",
          textTransform: "uppercase", letterSpacing: "0.12em", color: "#888888",
          display: "block", marginBottom: "14px",
        }}>
          Capabilities
        </span>
        <h2 style={{
          fontFamily: "Inter, sans-serif", fontWeight: 200, fontSize: "clamp(2rem, 3.5vw, 2.25rem)",
          color: "#0D0D0D", letterSpacing: "-0.02em", lineHeight: 1.2,
          margin: "0 0 40px 0", textAlign: "left", maxWidth: "560px",
        }}>
          Everything your front desk handles. Automated.
        </h2>

        {/* Bento Grid */}
        <div className="caps-bento">
          {/* ROW 1 */}
          <div className="caps-bento-row">
            {/* Card 1: Live Call Handling (2 cols) */}
            <div className="caps-bento-card caps-card-wide caps-card-1" style={{ gridColumn: "span 2" }}>
              <div className="caps-card-inner">
                <h3 className="caps-card-title">Live Call Handling</h3>
                <p className="caps-card-desc">Real conversations handled in real time — all three languages, all day.</p>
                <div className="caps-card-visual caps-card-visual-tall">
                  <AnimatedTranscript />
                </div>
              </div>
            </div>

            {/* Card 2: Language Detection (1 col) */}
            <div className="caps-bento-card caps-card-2">
              <div className="caps-card-inner">
                <h3 className="caps-card-title">Automatic language detection</h3>
                <p className="caps-card-desc">Yael switches languages the moment she hears the first word.</p>
                <div className="caps-card-visual">
                  <LanguagePills />
                </div>
              </div>
            </div>
          </div>

          {/* ROW 2 */}
          <div className="caps-bento-row" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            {/* Card 4: SMS to Staff (1 col) */}
            <div className="caps-bento-card caps-card-4">
              <div className="caps-card-inner">
                <h3 className="caps-card-title">Real-time SMS to staff</h3>
                <p className="caps-card-desc">Your team knows every action Yael takes, instantly.</p>
                <div className="caps-card-visual">
                  <SmsSequence />
                </div>
              </div>
            </div>

            {/* Card 5: New Patient Registration (1 col) */}
            <div className="caps-bento-card caps-card-5">
              <div className="caps-card-inner">
                <h3 className="caps-card-title">New patient registration</h3>
                <p className="caps-card-desc">All details captured before the patient hangs up.</p>
                <div className="caps-card-visual">
                  <DataPillsSequence />
                </div>
              </div>
            </div>

            {/* Card 6: Missed Call Recovery (1 col) */}
            <div className="caps-bento-card caps-card-6">
              <div className="caps-card-inner">
                <h3 className="caps-card-title">Missed call recovery</h3>
                <p className="caps-card-desc">Patients who don't leave a message get called back within minutes.</p>
                <div className="caps-card-visual">
                  <RecoveryChart />
                </div>
              </div>
            </div>

            {/* Card 3: 24/7 Availability (1 col) */}
            <div className="caps-bento-card caps-card-3">
              <div className="caps-card-inner">
                <h3 className="caps-card-title">24/7 Availability</h3>
                <p className="caps-card-desc">No voicemail, no missed calls — Yael answers every time.</p>
                <div className="caps-card-visual" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0 20px" }}>
                  <span style={{
                    fontFamily: "Inter, sans-serif", fontWeight: 300,
                    fontSize: "clamp(3rem, 5vw, 4rem)",
                    color: "#0D0D0D", letterSpacing: "-0.04em", lineHeight: 1,
                  }}>
                    24/7
                  </span>
                  <span style={{
                    fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "10px",
                    textTransform: "uppercase", letterSpacing: "0.1em", color: "#AAAAAA",
                    marginTop: "6px",
                  }}>
                    Always available
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ROW 3 */}
          <div className="caps-bento-row">
            {/* Card 7: Emergency + HMO (2 cols) */}
            <div className="caps-bento-card caps-card-wide caps-card-7" style={{ gridColumn: "span 2" }}>
              <div className="caps-card-inner">
                <div className="caps-card-visual" style={{ padding: "20px 0 8px" }}>
                  <div style={{
                    display: "flex", alignItems: "stretch", gap: "0",
                  }}>
                    {/* Left: Emergency */}
                    <div style={{
                      flex: 1, display: "flex", flexDirection: "column",
                      alignItems: "center", textAlign: "center", padding: "24px 20px",
                    }}>
                      <AlertTriangle size={28} strokeWidth={1.6} color="#EF4444" />
                      <h4 style={{
                        fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "14px",
                        color: "#0D0D0D", margin: "12px 0 6px",
                      }}>
                        Emergency triage
                      </h4>
                      <p style={{
                        fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "12px",
                        color: "#888888", lineHeight: 1.5, margin: 0,
                      }}>
                        Same-day appointments with fee disclosure
                      </p>
                    </div>

                    {/* Divider */}
                    <div style={{ width: "1px", background: "rgba(0,0,0,0.08)", alignSelf: "stretch" }} />

                    {/* Right: HMO */}
                    <div style={{
                      flex: 1, display: "flex", flexDirection: "column",
                      alignItems: "center", textAlign: "center", padding: "24px 20px",
                    }}>
                      <Shield size={28} strokeWidth={1.6} color="#3B82F6" />
                      <h4 style={{
                        fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "14px",
                        color: "#0D0D0D", margin: "12px 0 6px",
                      }}>
                        HMO and insurance
                      </h4>
                      <p style={{
                        fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "12px",
                        color: "#888888", lineHeight: 1.5, margin: 0,
                      }}>
                        Price and treatment inquiries answered instantly
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .caps-bento {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .caps-bento-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .caps-bento-card {
          background: #FFFFFF;
          border-radius: 16px;
          border: 1px solid rgba(0,0,0,0.06);
          overflow: hidden;
        }

        .caps-card-inner {
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .caps-card-title {
          font-family: "Inter", sans-serif;
          font-weight: 500;
          font-size: 14px;
          color: #0D0D0D;
          margin: 0 0 4px;
          letter-spacing: -0.01em;
        }

        .caps-card-desc {
          font-family: "Inter", sans-serif;
          font-weight: 400;
          font-size: 12px;
          color: #888888;
          margin: 0 0 16px;
          line-height: 1.5;
        }

        .caps-card-visual {
          flex: 1;
          min-height: 120px;
        }

        .caps-card-visual-tall {
          min-height: 260px;
        }

        .caps-card-7 .caps-card-inner {
          padding: 12px 24px;
        }

        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }

        @media (max-width: 900px) {
          .caps-bento-row {
            grid-template-columns: 1fr !important;
          }
          .caps-card-wide {
            grid-column: span 1 !important;
          }
        }

        @media (max-width: 768px) {
          [data-capabilities] { padding: 56px 20px !important; }
        }

        @media (max-width: 1024px) {
          [data-capabilities] { padding: 64px 32px !important; }
        }
      `}</style>
    </section>
  );
}