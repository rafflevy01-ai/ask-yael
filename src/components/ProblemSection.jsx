import React, { useEffect, useRef, useState } from "react";
import NotifStack from "@/components/NotifStack";

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

function MissedCallsCard({ isVisible }) {
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
        <span className="ps-card-label" style={{ color:"rgba(255,255,255,0.7)" }}>Missed Calls</span>
        <div ref={statRef} className="ps-card-stat" style={{ color:"#FFFFFF" }}>₪0</div>
        <p className="ps-card-subdesc" style={{ color:"rgba(255,255,255,0.7)" }}>in unrealized revenue per year</p>
        <p className="ps-card-copy" style={{ color:"rgba(255,255,255,0.85)" }}>Five missed calls a day at ₪900 each, 250 working days — gone.</p>
      </div>
      <div className="ps-card-visual" style={{ justifyContent:"center" }}>
        <div style={{ height:"130px", position:"relative", overflow:"hidden", transform:"scale(0.85)" }}>
          <NotifStack />
        </div>
      </div>
    </div>
  );
}

const INSTANT_NOTIF_IMG = "https://media.base44.com/images/public/6a2ab0818c0d050752d1521b/191371eb9_We_make_this_exact_picture_wit_Nano_Banana_2_78860.png";

function InstantNotificationCard() {
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <div className="ps-card" style={{ position:"relative", background:"#1a1a1a" }}>
      {/* Text — sits at top with solid dark bg for readability */}
      <div style={{ position:"relative", zIndex:2, padding:"24px 28px 12px", background:"#1a1a1a" }}>
        <span style={{ fontFamily:"Inter,sans-serif", fontSize:"11px", fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:"rgba(255,255,255,0.7)", display:"block", marginBottom:"8px" }}>
          Instant Notification
        </span>
        <div style={{ fontFamily:"Inter,sans-serif", fontWeight:300, fontSize:"clamp(1.8rem,4vw,2.6rem)", color:"#FFFFFF", letterSpacing:"-0.05em", lineHeight:1, marginBottom:"4px" }}>
          Within seconds.
        </div>
        <p style={{ fontFamily:"Inter,sans-serif", fontSize:"11px", fontWeight:500, textTransform:"uppercase", letterSpacing:"0.08em", color:"rgba(255,255,255,0.65)", margin:"0 0 8px" }}>
          Confirmation SMS sent automatically
        </p>
        <p style={{ fontFamily:"Inter,sans-serif", fontSize:"13px", fontWeight:400, color:"rgba(255,255,255,0.9)", lineHeight:1.5, margin:0 }}>
          The second Yael confirms a booking, the patient receives a personalized SMS with all the details — date, time, doctor, and treatment.
        </p>
      </div>

      {/* Image — fills the remaining card space below the text */}
      <div style={{ flex:1, minHeight:0, position:"relative", overflow:"hidden" }}>
        <img
          src={INSTANT_NOTIF_IMG}
          alt="Instant SMS notification on iPhone"
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
        {/* Soft gradient at top of image area to blend into the text section */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:"30px", background:"linear-gradient(to bottom, #1a1a1a, transparent)", zIndex:1 }} />
      </div>
    </div>
  );
}

function AfterHoursCard({ isVisible }) {
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
        <span className="ps-card-label">After Hours</span>
        <div className="ps-card-stat">40%</div>
        <p className="ps-card-subdesc">of appointment requests after hours</p>
        <p className="ps-card-copy">Your receptionist leaves at 18:00. Patients don't.</p>
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
          <span style={{ color:"#888" }}>Answered</span>
          <span style={{ color:"#DC2626" }}>No answer</span>
        </div>
      </div>
    </div>
  );
}

function LanguageGapCard() {
  return (
    <div className="ps-card" style={{ background:"linear-gradient(180deg, #7B8FA1 0%, #C5D0D9 50%, #E8EDF1 100%)" }}>
      <div className="ps-card-top">
        <span className="ps-card-label" style={{ color:"rgba(255,255,255,0.7)" }}>Language Gap</span>
        <div className="ps-card-stat" style={{ color:"#FFFFFF" }}>30,000+</div>
        <p className="ps-card-subdesc" style={{ color:"rgba(255,255,255,0.7)" }}>French-speaking residents in Netanya</p>
        <p className="ps-card-copy" style={{ color:"rgba(255,255,255,0.8)" }}>Your receptionist speaks one language. Your patients speak three.</p>
      </div>
      <div className="ps-card-visual" style={{ padding:"0 28px 28px", justifyContent:"center" }}>
        <div style={{ background:"#FFFFFF", borderRadius:"12px", overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", transform:"scale(0.85)" }}>
          {[{ flag:"🇮🇱", lang:"Hebrew", ok:true },{ flag:"🇫🇷", lang:"Français", ok:false },{ flag:"🇬🇧", lang:"English", ok:false }].map((row,i) => (
            <div key={row.lang} style={{ padding:"13px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:i<2?"1px solid #E5E5E5":"none" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                <span style={{ fontSize:"16px" }}>{row.flag}</span>
                <span style={{ fontFamily:"Inter,sans-serif", fontWeight:500, fontSize:"14px", color:"#0D0D0D" }}>{row.lang}</span>
              </div>
              <div style={{ width:"34px", height:"18px", borderRadius:"9999px", background:row.ok?"#7BA0BF":"#E5E5E5", position:"relative" }}>
                <div style={{ width:"14px", height:"14px", background:"#FFFFFF", borderRadius:"9999px", position:"absolute", top:"2px", ...(row.ok?{right:"2px"}:{left:"2px"}), boxShadow:"0 1px 3px rgba(0,0,0,0.1)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SalaryCostCard() {
  const [salary, setSalary] = useState(8500);
  const [count, setCount]   = useState(2);
  const monthly = salary * count;
  const annual  = monthly * 12;
  return (
    <div className="ps-card">
      <div className="ps-card-top">
        <span className="ps-card-label">Salary Cost</span>
        <div className="ps-card-stat" style={{ fontSize:"clamp(1.6rem,3.5vw,2.4rem)" }}>₪{monthly.toLocaleString()}</div>
        <p className="ps-card-subdesc">per month in receptionist salaries</p>
        <p className="ps-card-copy">You're paying a full salary just to answer the phone.</p>
      </div>
      <div className="ps-card-visual" style={{ padding:"0 28px 28px", display:"flex", flexDirection:"column", gap:"14px", justifyContent:"flex-end" }}>
        {[
          { label:"Salary / receptionist", value:"₪"+salary.toLocaleString()+" / mo", min:6000, max:12000, step:500, val:salary, set:setSalary, pct:((salary-6000)/6000)*100 },
          { label:"Receptionists", value:String(count), min:1, max:5, step:1, val:count, set:setCount, pct:((count-1)/4)*100 },
        ].map(({ label, value, min, max, step, val, set, pct }) => (
          <div key={label}>
            <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"Inter,sans-serif", fontSize:"12px", color:"#555", marginBottom:"6px" }}>
              <span>{label}</span><span style={{ fontWeight:500, color:"#0D0D0D" }}>{value}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={val}
              onChange={e => set(parseInt(e.target.value))}
              style={{ width:"100%", height:"3px", borderRadius:"9999px", outline:"none", appearance:"none", WebkitAppearance:"none",
                background:"linear-gradient(to right,#0D0D0D "+pct+"%,#E5E5E5 "+pct+"%)", cursor:"pointer" }} />
          </div>
        ))}
        <div style={{ borderTop:"1px solid #E5E5E5", paddingTop:"10px", fontFamily:"Inter,sans-serif", fontSize:"12px", color:"#888", textAlign:"center" }}>
          ₪{annual.toLocaleString()} / year
        </div>
      </div>
    </div>
  );
}

// ── Replace this URL after uploading to Base44 media ──
const SMS_PHOTO = "https://media.base44.com/files/public/6a2ab0818c0d050752d1521b/sms-photo.jpg";

function ConfirmationCard() {
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <div className="ps-card" style={{ background:"#111827", position:"relative" }}>
      {/* Text — compact top section */}
      <div style={{ padding:"24px 24px 16px", flexShrink:0 }}>
        <span style={{ fontFamily:"Inter,sans-serif", fontSize:"11px", fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:"rgba(255,255,255,0.4)", display:"block", marginBottom:"10px" }}>
          Patient Confirmation
        </span>
        <div style={{ fontFamily:"Inter,sans-serif", fontWeight:300, fontSize:"clamp(1.6rem,3vw,2.4rem)", color:"#FFFFFF", letterSpacing:"-0.04em", lineHeight:1, marginBottom:"10px" }}>
          Instant.
        </div>
        <p style={{ fontFamily:"Inter,sans-serif", fontSize:"13px", fontWeight:400, color:"rgba(255,255,255,0.6)", lineHeight:1.5, margin:0 }}>
          The moment Yael books, the patient gets an SMS — automatically, 24/7.
        </p>
      </div>

      {/* Photo — fills the remaining card height */}
      <div style={{ flex:1, minHeight:0, position:"relative", overflow:"hidden", borderRadius:"0 0 20px 20px" }}>
        {/* Always-visible dark bg */}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(160deg,#111827 0%,#1e3a5f 100%)" }} />
        {/* Actual photo */}
        <img
          src={SMS_PHOTO}
          alt="Patient receiving Yael SMS confirmation"
          onLoad={() => setImgLoaded(true)}
          style={{
            position:"absolute", inset:0,
            width:"100%", height:"100%",
            objectFit:"cover",
            objectPosition:"center 15%",
            opacity: imgLoaded ? 1 : 0,
            transition:"opacity 0.4s ease",
          }}
        />
        {/* Subtle top fade so it blends with the text above */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:"60px", background:"linear-gradient(to bottom,#111827,transparent)", zIndex:1 }} />
      </div>
    </div>
  );
}

export default function ProblemSection() {
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
    <section data-problem-section style={{ width:"100%", backgroundColor:"#FFFFFF", padding:"80px 0 64px" }}>
      <div style={{ maxWidth:"1280px", margin:"0 auto", padding:"0 56px" }}>

        <div style={{ marginBottom:"48px" }}>
          <h2 style={{ fontFamily:"Inter,sans-serif", fontWeight:300, fontSize:"clamp(2rem,3.5vw,2.8rem)", color:"#0D0D0D", letterSpacing:"-0.04em", lineHeight:1.1, margin:"0 0 14px" }}>
            Sound familiar?
          </h2>
          <p style={{ fontFamily:"Inter,sans-serif", fontWeight:400, fontSize:"16px", color:"#6B6B6B", margin:0, lineHeight:1.6, maxWidth:"520px" }}>
            Calls go unanswered. Patients don't wait. Your front desk can't be everywhere at once.
          </p>
        </div>

        <div style={{ position:"relative" }}>
          <div ref={trackRef} className="ps-track">
            <div ref={card0Ref}><MissedCallsCard isVisible={vis0} /></div>
            <InstantNotificationCard />
            <div ref={card1Ref}><AfterHoursCard isVisible={vis1} /></div>
            <LanguageGapCard />
            <SalaryCostCard />
            <ConfirmationCard />
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