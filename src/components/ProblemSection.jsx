import React, { useEffect, useRef, useState } from "react";
import IntakePatientCard from "@/components/IntakePatientCard";
import AutoScheduleCard from "@/components/AutoScheduleCard";
import MultiLingualCard from "@/components/MultiLingualCard";
import { useLanguage } from "@/lib/LanguageContext";
const BUSINESS_BARS   = [65,95,85,60,40,50,70,65,55,45];
const AFTER_HOURS_BARS = [6,5,4,3,2];

function countUp(el, target, duration) {
  const start = performance.now();
  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const val = Math.floor((1 - Math.pow(1 - t, 3)) * target);
    el.textContent = "₪" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = "₪1,125,000";
  }
  requestAnimationFrame(step);
}

function MissedCallsCard({ isVisible, tp }) {
  const statRef = useRef(null);
  const counted = useRef(false);
  useEffect(() => {
    if (isVisible && !counted.current && statRef.current) {
      counted.current = true;
      countUp(statRef.current, 1125000, 1400);
    }
  }, [isVisible]);
  return (
    <div className="ps-card" style={{ background:"linear-gradient(180deg, #9DB4C0 0%, #C5D5DD 50%, #F2F5F7 100%)" }}>
      <div className="ps-card-top">
        <span className="ps-card-label" style={{ color:"rgba(255,255,255,0.7)" }}>{tp.missedLabel}</span>
        <div style={{ fontFamily:"Inter,sans-serif", fontWeight:300, fontSize:"clamp(1.8rem,4vw,2.6rem)", color:"#FFFFFF", letterSpacing:"-0.05em", lineHeight:1, marginBottom:"4px" }}>
          {tp.missedTitle}
        </div>
        <p style={{ fontFamily:"Inter,sans-serif", fontSize:"11px", fontWeight:500, textTransform:"uppercase", letterSpacing:"0.08em", color:"rgba(255,255,255,0.75)", margin:0 }}>
          {tp.missedSub}
        </p>
      </div>
      <div className="ps-card-visual" style={{ justifyContent:"center", alignItems:"center", paddingBottom:"28px" }}>
        <div dir="ltr" style={{
          background:"rgba(250,250,252,0.94)", backdropFilter:"blur(40px) saturate(200%)",
          WebkitBackdropFilter:"blur(40px) saturate(200%)",
          borderRadius:"16px", padding:"11px 14px",
          boxShadow:"0 2px 12px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)",
          fontFamily:"-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
          width:"100%", maxWidth:"340px",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"3px" }}>
            <div style={{ width:"16px", height:"16px", background:"#34c759", borderRadius:"4px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.73a16 16 0 006.72 6.72l1.06-1.16a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            </div>
            <span style={{ fontSize:"11px", fontWeight:600, color:"rgba(60,60,67,0.55)", flex:1, letterSpacing:"0.01em" }}>PHONE</span>
            <span style={{ fontSize:"11px", fontWeight:400, color:"rgba(60,60,67,0.4)" }}>18:32</span>
          </div>
          <div style={{ fontSize:"13px", fontWeight:600, color:"#000", lineHeight:1.35 }}>Missed Call</div>
          <div style={{ fontSize:"13px", fontWeight:400, color:"rgba(60,60,67,0.75)", marginTop:"1px", lineHeight:1.35 }}>+972 54 321 4567</div>
          <div style={{ display:"flex", gap:"7px", marginTop:"9px" }}>
            <div style={{ flex:1, height:"26px", background:"rgba(118,118,128,0.12)", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", fontWeight:500, color:"#007aff" }}>Call Back</div>
            <div style={{ flex:1, height:"26px", background:"rgba(118,118,128,0.12)", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", fontWeight:500, color:"#007aff" }}>Message</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const INSTANT_NOTIF_IMG = "https://media.base44.com/images/public/6a2ab0818c0d050752d1521b/332dc40be_Your_task_is_to_recreate_a_lad_Nano_Banana_2_59670.png";
const CLINIC_NOTIF_IMG = "https://media.base44.com/images/public/6a2ab0818c0d050752d1521b/f9a210da0_Create_a_picture_similar_to_th_Nano_Banana_2_18435copie.png";

function InstantNotificationCard({ tp, isRtl }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <div className="ps-card" style={{ position:"relative", background:"#1a1a1a" }}>
      <img
        src={INSTANT_NOTIF_IMG}
        alt="Woman receiving SMS notification"
        onLoad={() => setImgLoaded(true)}
        style={{
          position:"absolute", inset:0,
          width:"100%", height:"100%",
          objectFit:"cover",
          objectPosition:"center 40%",
          opacity: imgLoaded ? 1 : 0,
          transition:"opacity 0.4s ease",
        }}
      />
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.15)", zIndex:1 }} />
      
      {/* SMS bubble on right side */}
      <div style={{
        position:"absolute",
        zIndex:2,
        right:"12px",
        top:"50%",
        transform:"translateY(-50%)",
        maxWidth:"175px",
      }}>
        <span style={{
          fontFamily:"Inter,sans-serif", fontWeight:500, fontSize:"8px",
          textTransform:"uppercase", letterSpacing:"0.1em",
          color:"rgba(255,255,255,0.7)", display:"block", marginBottom:"8px",
        }}>
          {tp.smsToPatient}
        </span>
        <div style={{
          background:"#34C759",
          borderRadius:"14px 14px 4px 14px",
          padding:"12px 14px",
        }}>
          <div dir={isRtl ? "rtl" : "ltr"} style={{
            fontFamily:"Inter, sans-serif", fontWeight:400, fontSize:"11px",
            color:"#FFFFFF", lineHeight:1.5, whiteSpace:"pre-line",
            textAlign: isRtl ? "right" : "left",
          }}>
            {tp.smsBubble}
          </div>
        </div>
      </div>

      {/* Top-left label */}
      <div style={{ position:"relative", zIndex:2, padding:"24px 28px 0" }}>
        <span style={{ fontFamily:"Inter,sans-serif", fontSize:"11px", fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:"rgba(255,255,255,0.85)", display:"block", marginBottom:"8px" }}>
          {tp.instantLabel}
        </span>
        <div style={{ fontFamily:"Inter,sans-serif", fontWeight:300, fontSize:"clamp(1.8rem,4vw,2.6rem)", color:"#FFFFFF", letterSpacing:"-0.05em", lineHeight:1, marginBottom:"4px" }}>
          {tp.instantTitle}
        </div>
        <p style={{ fontFamily:"Inter,sans-serif", fontSize:"11px", fontWeight:500, textTransform:"uppercase", letterSpacing:"0.08em", color:"rgba(255,255,255,0.75)", margin:0 }}>
          {tp.instantSub}
        </p>
      </div>
    </div>
  );
}

function ClinicNotificationCard({ tp, isRtl }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <div className="ps-card" style={{ position:"relative", background:"#1a1a1a" }}>
      <img
        src={CLINIC_NOTIF_IMG}
        alt="Receptionist receiving clinic notification"
        onLoad={() => setImgLoaded(true)}
        style={{
          position:"absolute", inset:0,
          width:"100%", height:"100%",
          objectFit:"cover",
          objectPosition:"center 30%",
          opacity: imgLoaded ? 1 : 0,
          transition:"opacity 0.4s ease",
        }}
      />
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.2)", zIndex:1 }} />
      
      {/* Notification bubble on right side */}
      <div style={{
        position:"absolute",
        zIndex:2,
        right:"20px",
        bottom:"40px",
        left:"100px",
      }}>
        <span style={{
          fontFamily:"Inter,sans-serif", fontWeight:500, fontSize:"9px",
          textTransform:"uppercase", letterSpacing:"0.1em",
          color:"rgba(255,255,255,0.7)", display:"block", marginBottom:"6px",
        }}>
          {tp.notifToClinic}
        </span>
        <div style={{
          background:"rgba(255,255,255,0.9)",
          backdropFilter:"blur(14px)",
          WebkitBackdropFilter:"blur(14px)",
          borderRadius:"10px",
          padding:"6px 10px",
          border:"1px solid rgba(0,0,0,0.06)",
          boxShadow:"0 2px 10px rgba(0,0,0,0.05)",
          display:"inline-flex", gap:"6px", alignItems:"center",
          width:"fit-content",
        }}>
          {/* App icon */}
          <div style={{
            width:"20px", height:"20px", borderRadius:"4px",
            background:"#0D0D0D", flexShrink:0,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <span style={{ color:"#FFF", fontSize:"10px", fontWeight:700, lineHeight:1 }}>Y</span>
          </div>
          {/* Content — all on one line */}
          <div dir={isRtl ? "rtl" : "ltr"} style={{ display:"flex", alignItems:"baseline", gap:"5px", flexWrap:"wrap", rowGap:"1px", minWidth:0 }}>
            <span style={{
              fontFamily:"Inter, sans-serif", fontWeight:600, fontSize:"10px",
              color:"#0D0D0D",
            }}>
              {tp.notifAppName}
            </span>
            <span style={{
              fontFamily:"Inter, sans-serif", fontWeight:500, fontSize:"10px",
              color:"#0D0D0D",
            }}>
              {tp.notifText}
            </span>
            <span style={{
              fontFamily:"Inter, sans-serif", fontWeight:400, fontSize:"9px",
              color:"#555555",
            }}>
              {tp.notifDetail}
            </span>
          </div>
        </div>
      </div>

      {/* Top-left label */}
      <div style={{ position:"relative", zIndex:2, padding:"24px 28px 0" }}>
        <span style={{ fontFamily:"Inter,sans-serif", fontSize:"11px", fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:"rgba(255,255,255,0.85)", display:"block", marginBottom:"8px" }}>
          {tp.instantLabel}
        </span>
        <div style={{ fontFamily:"Inter,sans-serif", fontWeight:300, fontSize:"clamp(1.8rem,4vw,2.6rem)", color:"#FFFFFF", letterSpacing:"-0.05em", lineHeight:1, marginBottom:"4px" }}>
          {tp.clinicTitle}
        </div>
        <p style={{ fontFamily:"Inter,sans-serif", fontSize:"11px", fontWeight:500, textTransform:"uppercase", letterSpacing:"0.08em", color:"rgba(255,255,255,0.75)", margin:0 }}>
          {tp.clinicSub}
        </p>
      </div>
    </div>
  );
}

function AfterHoursCard({ isVisible, tp }) {
  const barsRef = useRef(null);
  const animated = useRef(false);
  useEffect(() => {
    if (isVisible && !animated.current && barsRef.current) {
      animated.current = true;
      const bars = barsRef.current.querySelectorAll(".ps-ah-bar");
      requestAnimationFrame(() => requestAnimationFrame(() => {
        bars.forEach((bar, i) => setTimeout(() => {
          bar.style.transition = "height 0.5s cubic-bezier(0.22,1,0.36,1)";
          bar.style.height = bar.getAttribute("data-h") + "%";
        }, i * 80));
      }));
    }
  }, [isVisible]);
  return (
    <div className="ps-card">
      <div className="ps-card-top">
        <span className="ps-card-label">{tp.afterHoursLabel}</span>
        <div className="ps-card-stat">40%</div>
        <p className="ps-card-subdesc">{tp.afterHoursSub}</p>
        <p className="ps-card-copy">{tp.afterHoursCopy}</p>
      </div>
      <div className="ps-card-visual" style={{ padding:"0 28px 28px" }}>
        <div ref={barsRef} style={{ display:"flex", alignItems:"flex-end", gap:"3px", height:"90px" }}>
          {BUSINESS_BARS.map((h,i) => <div key={i} className="ps-ah-bar" data-h={h} style={{ flex:1, borderRadius:"3px 3px 0 0", height:"0", background:"#0D0D0D" }} />)}
          <div style={{ width:"1px", height:"100%", background:"#D1D5DB", flexShrink:0, position:"relative" }}>
            <span style={{ position:"absolute", bottom:"-16px", left:"50%", transform:"translateX(-50%)", fontSize:"9px", color:"#888", whiteSpace:"nowrap", fontFamily:"Inter,sans-serif" }}>18:00</span>
          </div>
          {AFTER_HOURS_BARS.map((h,i) => <div key={i} className="ps-ah-bar" data-h={h} style={{ flex:1, borderRadius:"3px 3px 0 0", height:"0", background:"#D1D5DB" }} />)}
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:"20px", fontFamily:"Inter,sans-serif", fontSize:"11px" }}>
          <span style={{ color:"#888" }}>{tp.answered}</span>
          <span style={{ color:"#DC2626" }}>{tp.noAnswer}</span>
        </div>
      </div>
    </div>
  );
}

export default function ProblemSection() {
  const { t, isRtl } = useLanguage();
  const tp = t.problem;
  const trackRef  = useRef(null);
  const card0Ref  = useRef(null);
  const card1Ref  = useRef(null);
  const [vis0, setVis0] = useState(false);
  const [vis1, setVis1] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.target === card0Ref.current && e.isIntersecting) setVis0(true);
        if (e.target === card1Ref.current && e.isIntersecting) setVis1(true);
      });
    }, { threshold: 0.3 });
    if (card0Ref.current) obs.observe(card0Ref.current);
    if (card1Ref.current) obs.observe(card1Ref.current);
    return () => obs.disconnect();
  }, []);

  const scroll = (dir) => {
    if (!trackRef.current) return;
    const card = trackRef.current.querySelector(".ps-card");
    const w = card ? card.offsetWidth + 16 : 420;
    trackRef.current.scrollBy({ left: dir * w, behavior: "smooth" });
  };

  return (
    <section data-problem-section style={{ width:"100%", backgroundColor:"#FFFFFF", padding:"80px 0 64px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
      <div style={{ maxWidth:"1280px", margin:"0 auto", padding:"0 56px" }}>

        <div style={{ marginBottom:"48px" }}>
          <h2 style={{ fontFamily:"Inter,sans-serif", fontWeight:300, fontSize:"clamp(2rem,3.5vw,2.8rem)", color:"#0D0D0D", letterSpacing:"-0.04em", lineHeight:1.1, margin:"0 0 14px" }}>
            {tp.title}
          </h2>
          <p style={{ fontFamily:"Inter,sans-serif", fontWeight:400, fontSize:"16px", color:"#6B6B6B", margin:0, lineHeight:1.6, maxWidth:"520px" }}>
            {tp.subtitle}
          </p>
        </div>

        <div style={{ position:"relative" }}>
          <div ref={trackRef} className="ps-track">
            <div ref={card0Ref}><MissedCallsCard isVisible={vis0} tp={tp} /></div>
            <InstantNotificationCard tp={tp} isRtl={isRtl} />
            <ClinicNotificationCard tp={tp} isRtl={isRtl} />
            <AutoScheduleCard />
            <IntakePatientCard />
            <MultiLingualCard />
          </div>
          <button className="ps-arrow ps-arrow-left"  onClick={() => scroll(-1)} aria-label="Previous">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button className="ps-arrow ps-arrow-right" onClick={() => scroll(1)} aria-label="Next">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>

      <style>{`
        input[type="range"]                      { -webkit-appearance:none; appearance:none; }
        input[type="range"]::-webkit-slider-thumb{ -webkit-appearance:none; width:16px; height:16px; border-radius:9999px; background:#0D0D0D; cursor:pointer; }
        input[type="range"]::-moz-range-thumb    { width:16px; height:16px; border-radius:9999px; background:#0D0D0D; border:none; cursor:pointer; }

        .ps-track { display:flex; gap:16px; overflow-x:auto; scroll-snap-type:x mandatory; scrollbar-width:none; -ms-overflow-style:none; padding-bottom:4px; }
        .ps-track::-webkit-scrollbar { display:none; }
        .ps-track > div { scroll-snap-align:start; flex:0 0 auto; }

        .ps-card { width:420px; height:520px; background:#F5F5F3; border-radius:20px; display:flex; flex-direction:column; overflow:hidden; }
        .ps-card-dark { background:#16213e; }
        .ps-card-top  { padding:28px 28px 16px; flex-shrink:0; }
        .ps-card-label { font-family:Inter,sans-serif; font-size:11px; font-weight:500; letter-spacing:0.08em; text-transform:uppercase; color:#888; display:block; margin-bottom:12px; }
        .ps-card-stat  { font-family:Inter,sans-serif; font-weight:300; font-size:clamp(2rem,4.5vw,3.2rem); color:#0D0D0D; letter-spacing:-0.05em; line-height:1; margin-bottom:6px; }
        .ps-card-subdesc { font-family:Inter,sans-serif; font-size:11px; font-weight:500; text-transform:uppercase; letter-spacing:0.08em; color:#888; margin:0 0 12px; }
        .ps-card-copy    { font-family:Inter,sans-serif; font-size:14px; font-weight:400; color:#555; line-height:1.55; margin:0; }
        .ps-card-visual  { flex:1; min-height:0; padding:0 28px 28px; display:flex; flex-direction:column; justify-content:flex-end; }

        .ps-arrow { position:absolute; top:50%; transform:translateY(-50%); width:36px; height:36px; border-radius:50%; background:#FFFFFF; border:1px solid #E5E5E5; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#0D0D0D; box-shadow:0 1px 6px rgba(0,0,0,0.08); transition:opacity 0.15s; z-index:2; }
        .ps-arrow:hover { opacity:0.7; }
        .ps-arrow-left  { left:-18px; }
        .ps-arrow-right { right:-18px; }

        @media (max-width:1024px) {
          [data-problem-section] > div { padding:0 32px !important; }
          .ps-card { width:360px !important; height:500px !important; }
        }
        @media (max-width:768px) {
          [data-problem-section] { padding:56px 0 48px !important; }
          [data-problem-section] > div { padding:0 20px !important; }
          .ps-card { width:calc(82vw) !important; height:460px !important; }
          [data-problem-section] h2 { font-size:1.6rem !important; }
          .ps-arrow { display:none !important; }
        }
      `}</style>
    </section>
  );
}