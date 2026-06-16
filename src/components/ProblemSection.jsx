import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NotifStack from "@/components/NotifStack";
import { PhoneMissed, Clock, Globe, ArrowUpRight } from "lucide-react";

const PANELS = [
  { id: "missed-calls",  number: "01", label: "Missed Calls",  icon: PhoneMissed, title: "Every missed call is a lost patient.",                             description: "Five missed calls a day at ₪900 each, 250 working days." },
  { id: "after-hours",   number: "02", label: "After Hours",   icon: Clock,        title: "Your receptionist leaves at 18:00. Patients don't.",              description: "40% of appointment requests come after hours." },
  { id: "language-gap",  number: "03", label: "Language Gap",  icon: Globe,        title: "Your receptionist speaks one language. Your patients speak three.", description: "30,000+ French-speaking residents in Netanya." },
  { id: "salary-cost",   number: "04", label: "Salary Cost",   icon: "shekel",     title: "You're paying a full salary just to answer the phone.",            description: "For a team that still goes home at 18:00." },
];

const BUSINESS_BARS   = [65,95,85,60,40,50,70,65,55,45];
const AFTER_HOURS_BARS = [6,5,4,3,2];

const slideVariants = {
  enter:  (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center:          { x: 0, opacity: 1 },
  exit:   (dir) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

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

// ─── Top-level subcomponents (stable references = no unmount on parent re-render) ───

function LangCard() {
  return (
    <div style={{ width:"min(360px,90%)", background:"#FFF", borderRadius:"14px", boxShadow:"rgba(0,0,0,0.4) 0px 0px 1px,rgba(0,0,0,0.04) 0px 2px 4px", overflow:"hidden" }}>
      {[{ flag:"🇮🇱", lang:"Hebrew", ok:true },{ flag:"🇫🇷", lang:"Français", ok:false },{ flag:"🇬🇧", lang:"English", ok:false }].map((row,i) => (
        <div key={row.lang} style={{ opacity:i===0?1:0.4, padding:"14px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:i<2?"1px solid #E5E5E5":"none" }}>
          <div style={{ display:"flex", alignItems:"center" }}>
            <span style={{ fontSize:"16px" }}>{row.flag}</span>
            <span style={{ fontFamily:"Inter,sans-serif", fontWeight:500, fontSize:"14px", color:"#0D0D0D", marginLeft:"10px" }}>{row.lang}</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <div style={{ width:"34px", height:"18px", borderRadius:"9999px", background:row.ok?"#16A34A":"#E5E5E5", position:"relative" }}>
              <div style={{ width:"14px", height:"14px", background:"#FFF", borderRadius:"9999px", position:"absolute", top:"2px", ...(row.ok?{right:"2px"}:{left:"2px"}), boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }} />
            </div>
            <div style={{ width:"14px", height:"14px", background:row.ok?"#16A34A":"#DC2626", borderRadius:"9999px", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ color:"#FFF", fontSize:"9px", lineHeight:1 }}>{row.ok?"✓":"✕"}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SalaryCard({ salary, count, setSalary, setCount }) {
  const monthly = salary * count;
  const annual  = monthly * 12;
  return (
    <div style={{ width:"min(440px,95%)", background:"#FFF", borderRadius:"14px", boxShadow:"rgba(0,0,0,0.4) 0px 0px 1px,rgba(0,0,0,0.04) 0px 2px 4px", padding:"28px", display:"flex", flexDirection:"column", gap:"20px" }}>
      <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontFamily:"Inter,sans-serif", fontWeight:500, fontSize:"13px", color:"#0D0D0D" }}>Salary per receptionist</span>
          <span style={{ fontFamily:"Inter,sans-serif", fontWeight:500, fontSize:"14px", color:"#0D0D0D", letterSpacing:"-0.02em" }}>₪{salary.toLocaleString()} / month</span>
        </div>
        <input type="range" min="6000" max="12000" step="500" value={salary}
          onChange={e => setSalary(parseInt(e.target.value))}
          style={{ background:`linear-gradient(to right,#0D0D0D ${((salary-6000)/6000)*100}%,#E5E5E5 ${((salary-6000)/6000)*100}%)` }} />
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontFamily:"Inter,sans-serif", fontWeight:500, fontSize:"13px", color:"#0D0D0D" }}>Number of receptionists</span>
          <span style={{ fontFamily:"Inter,sans-serif", fontWeight:500, fontSize:"14px", color:"#0D0D0D", letterSpacing:"-0.02em" }}>{count}</span>
        </div>
        <input type="range" min="1" max="5" step="1" value={count}
          onChange={e => setCount(parseInt(e.target.value))}
          style={{ background:`linear-gradient(to right,#0D0D0D ${((count-1)/4)*100}%,#E5E5E5 ${((count-1)/4)*100}%)` }} />
      </div>
      <div style={{ height:"1px", background:"#E5E5E5" }} />
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"4px" }}>
        <span style={{ fontFamily:"Inter,sans-serif", fontWeight:500, fontSize:"12px", textTransform:"uppercase", letterSpacing:"0.1em", color:"#888" }}>You pay</span>
        <div style={{ display:"flex", alignItems:"baseline", gap:"6px" }}>
          <span style={{ fontFamily:"Inter,sans-serif", fontWeight:300, fontSize:"2.5rem", color:"#0D0D0D", letterSpacing:"-0.05em" }}>₪{monthly.toLocaleString()}</span>
          <span style={{ fontFamily:"Inter,sans-serif", fontSize:"13px", color:"#888" }}>/ month</span>
        </div>
        <span style={{ fontFamily:"Inter,sans-serif", fontWeight:300, fontSize:"1.3rem", color:"#555", letterSpacing:"-0.02em" }}>₪{annual.toLocaleString()} / year</span>
      </div>
    </div>
  );
}

function MobileCard({ panel, index, salary, count, setSalary, setCount }) {
  const Icon = panel.icon !== "shekel" ? panel.icon : null;
  return (
    <motion.div
      initial={{ opacity:0, y:24 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, amount:0.12 }}
      transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}
      style={{ backgroundColor:"#FFFFFF", borderRadius:"16px", overflow:"hidden", marginBottom:"16px" }}
    >
      {/* Card header */}
      <div style={{ padding:"18px 20px 0", display:"flex", alignItems:"center", gap:"10px" }}>
        {Icon
          ? <Icon size={15} strokeWidth={1.8} color="#0D0D0D" />
          : <span style={{ fontFamily:"Inter,sans-serif", fontWeight:300, fontSize:"15px", color:"#0D0D0D", lineHeight:1 }}>₪</span>
        }
        <span style={{ fontFamily:"Inter,sans-serif", fontWeight:500, fontSize:"13px", color:"#0D0D0D", letterSpacing:"-0.01em" }}>
          {panel.label}
        </span>
        <span style={{ fontFamily:"Inter,sans-serif", fontWeight:400, fontSize:"11px", color:"#B8B1A8", marginLeft:"auto" }}>
          {panel.number} / 04
        </span>
      </div>

      {/* Visual area */}
      <div style={{ backgroundColor:"#F4F1EE", margin:"16px 0 0", padding:"28px 20px 20px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"200px" }}>

        {index === 0 && (
          <motion.div
            style={{ display:"flex", flexDirection:"column", alignItems:"center", width:"100%" }}
            onViewportEnter={() => {
              const el = document.getElementById("stat-revenue-m0");
              if (el) countUp(el, 1125000, 1400);
            }}
            viewport={{ once:true }}
          >
            <div id="stat-revenue-m0" style={{ fontFamily:"Inter,sans-serif", fontWeight:300, fontSize:"clamp(1.8rem,7vw,2.6rem)", color:"#0D0D0D", lineHeight:1, letterSpacing:"-0.05em" }}>₪0</div>
            <div style={{ fontFamily:"Inter,sans-serif", fontWeight:500, fontSize:"11px", textTransform:"uppercase", letterSpacing:"0.1em", color:"#888", marginTop:"8px" }}>in unrealized revenue per year</div>
            <div style={{ height:"130px", width:"100%", maxWidth:"300px", position:"relative", overflow:"hidden", marginTop:"16px" }}><NotifStack /></div>
          </motion.div>
        )}

        {index === 1 && (
          <motion.div
            style={{ display:"flex", flexDirection:"column", alignItems:"center", width:"100%" }}
            onViewportEnter={() => {
              const bars = document.querySelectorAll(".ps-mobile-bar");
              requestAnimationFrame(() => requestAnimationFrame(() => {
                bars.forEach((bar, i) => setTimeout(() => {
                  bar.style.transition = "height 0.5s cubic-bezier(0.22,1,0.36,1)";
                  bar.style.height = bar.getAttribute("data-height") + "%";
                }, i * 80));
              }));
            }}
            viewport={{ once:true }}
          >
            <div style={{ fontFamily:"Inter,sans-serif", fontWeight:300, fontSize:"clamp(1.8rem,7vw,2.6rem)", color:"#0D0D0D", lineHeight:1, letterSpacing:"-0.05em" }}>40%</div>
            <div style={{ fontFamily:"Inter,sans-serif", fontWeight:500, fontSize:"11px", textTransform:"uppercase", letterSpacing:"0.1em", color:"#888", marginTop:"8px", marginBottom:"16px" }}>of appointment requests after hours</div>
            <div style={{ width:"100%", height:"80px", display:"flex", alignItems:"flex-end", gap:"3px" }}>
              {BUSINESS_BARS.map((h,i) => <div key={i} className="ps-mobile-bar" data-height={h} style={{ flex:1, borderRadius:"4px 4px 0 0", height:"0", background:"#0D0D0D" }} />)}
              <div style={{ position:"relative", width:"1px", height:"100%", background:"#E5E5E5", flexShrink:0 }}>
                <span style={{ position:"absolute", bottom:"-16px", left:"50%", transform:"translateX(-50%)", fontFamily:"Inter,sans-serif", fontSize:"8px", color:"#888", whiteSpace:"nowrap" }}>18:00</span>
              </div>
              {AFTER_HOURS_BARS.map((h,i) => <div key={i} className="ps-mobile-bar" data-height={h} style={{ flex:1, borderRadius:"4px 4px 0 0", height:"0", background:"#E5E5E5" }} />)}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", width:"100%", marginTop:"18px" }}>
              <span style={{ fontFamily:"Inter,sans-serif", fontSize:"11px", color:"#888" }}>Answered</span>
              <span style={{ fontFamily:"Inter,sans-serif", fontSize:"11px", color:"#DC2626" }}>No answer</span>
            </div>
          </motion.div>
        )}

        {index === 2 && (
          <>
            <div style={{ fontFamily:"Inter,sans-serif", fontWeight:300, fontSize:"clamp(1.8rem,7vw,2.6rem)", color:"#0D0D0D", lineHeight:1, letterSpacing:"-0.05em" }}>30,000+</div>
            <div style={{ fontFamily:"Inter,sans-serif", fontWeight:500, fontSize:"11px", textTransform:"uppercase", letterSpacing:"0.1em", color:"#888", marginTop:"8px", marginBottom:"16px" }}>French-speaking residents in Netanya</div>
            <LangCard />
          </>
        )}

        {index === 3 && <SalaryCard salary={salary} count={count} setSalary={setSalary} setCount={setCount} />}
      </div>

      {/* Bottom label */}
      <div style={{ padding:"18px 20px" }}>
        <div style={{ fontFamily:"Inter,sans-serif", fontWeight:500, fontSize:"16px", color:"#0D0D0D", letterSpacing:"-0.02em", marginBottom:"4px" }}>{panel.title}</div>
        <div style={{ fontFamily:"Inter,sans-serif", fontWeight:400, fontSize:"14px", color:"#777", lineHeight:1.5 }}>{panel.description}</div>
      </div>
    </motion.div>
  );
}

// ─── Main component ───

export default function ProblemSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection]     = useState(1);
  const [isMobile, setIsMobile]       = useState(false);
  const [salary, setSalary]           = useState(8500);
  const [count, setCount]             = useState(2);
  const barsAnimatedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Desktop: bar animation
  useEffect(() => {
    if (isMobile || activeIndex !== 1) {
      barsAnimatedRef.current = false;
      document.querySelectorAll("[data-height]:not(.ps-mobile-bar)").forEach(bar => {
        bar.style.transition = "none"; bar.style.height = "0%";
      });
      return;
    }
    if (barsAnimatedRef.current) return;
    barsAnimatedRef.current = true;
    const bars = document.querySelectorAll("[data-height]:not(.ps-mobile-bar)");
    requestAnimationFrame(() => requestAnimationFrame(() => {
      bars.forEach((bar, i) => setTimeout(() => {
        bar.style.transition = "height 0.5s cubic-bezier(0.22,1,0.36,1)";
        bar.style.height = bar.getAttribute("data-height") + "%";
      }, i * 120));
    }));
  }, [activeIndex, isMobile]);

  // Desktop: revenue counter
  useEffect(() => {
    if (isMobile || activeIndex !== 0) return;
    const el = document.getElementById("stat-revenue-desktop");
    if (el) countUp(el, 1125000, 1400);
  }, [activeIndex, isMobile]);

  const activePanel = PANELS[activeIndex];

  // Desktop card
  const desktopCard = (
    <div style={{ backgroundColor:"#FFFFFF", borderRadius:"16px", overflow:"hidden", position:"relative" }}>
      <div style={{ position:"absolute", top:"16px", right:"16px", zIndex:2 }}>
        <ArrowUpRight size={18} strokeWidth={1.8} color="#999" />
      </div>
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div key={activeIndex} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration:0.32, ease:[0.22,1,0.36,1] }}>
          <div className="ps-gray-container" style={{ backgroundColor:"#F4F1EE", padding:"40px 40px 24px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"320px" }}>
            {activeIndex === 0 && (
              <>
                <div id="stat-revenue-desktop" style={{ fontFamily:"Inter,sans-serif", fontWeight:300, fontSize:"clamp(2.6rem,6vw,4.5rem)", color:"#0D0D0D", lineHeight:1, letterSpacing:"-0.05em" }}>₪0</div>
                <div style={{ fontFamily:"Inter,sans-serif", fontWeight:500, fontSize:"12px", textTransform:"uppercase", letterSpacing:"0.1em", color:"#888", marginTop:"8px" }}>in unrealized revenue per year</div>
                <div className="ps-notif-stack" style={{ height:"180px", width:"100%", maxWidth:"340px", position:"relative", overflow:"hidden", marginTop:"20px" }}><NotifStack /></div>
              </>
            )}
            {activeIndex === 1 && (
              <>
                <div style={{ fontFamily:"Inter,sans-serif", fontWeight:300, fontSize:"clamp(2.6rem,6vw,4.5rem)", color:"#0D0D0D", lineHeight:1, letterSpacing:"-0.05em" }}>40%</div>
                <div style={{ fontFamily:"Inter,sans-serif", fontWeight:500, fontSize:"12px", textTransform:"uppercase", letterSpacing:"0.1em", color:"#888", marginTop:"8px", marginBottom:"24px" }}>of appointment requests come after hours</div>
                <div style={{ width:"min(560px,100%)" }}>
                  <div style={{ width:"100%", height:"clamp(80px,14vw,130px)", display:"flex", alignItems:"flex-end", gap:"3px" }}>
                    {BUSINESS_BARS.map((h,i) => <div key={i} className="bar-item" data-height={h} style={{ background:"#0D0D0D" }} />)}
                    <div style={{ position:"relative", width:"1px", height:"100%", background:"#E5E5E5", flexShrink:0 }}>
                      <span style={{ position:"absolute", bottom:"-18px", left:"50%", transform:"translateX(-50%)", fontFamily:"Inter,sans-serif", fontSize:"9px", color:"#888", whiteSpace:"nowrap" }}>18:00</span>
                    </div>
                    {AFTER_HOURS_BARS.map((h,i) => <div key={i} className="bar-item" data-height={h} style={{ background:"#E5E5E5" }} />)}
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginTop:"24px" }}>
                    <span style={{ fontFamily:"Inter,sans-serif", fontSize:"11px", color:"#888" }}>Answered</span>
                    <span style={{ fontFamily:"Inter,sans-serif", fontSize:"11px", color:"#DC2626" }}>No answer</span>
                  </div>
                </div>
              </>
            )}
            {activeIndex === 2 && (
              <>
                <div style={{ fontFamily:"Inter,sans-serif", fontWeight:300, fontSize:"clamp(2.6rem,6vw,4.5rem)", color:"#0D0D0D", lineHeight:1, letterSpacing:"-0.05em" }}>30,000+</div>
                <div style={{ fontFamily:"Inter,sans-serif", fontWeight:500, fontSize:"12px", textTransform:"uppercase", letterSpacing:"0.1em", color:"#888", marginTop:"8px", marginBottom:"20px" }}>French-speaking residents in Netanya</div>
                <LangCard />
              </>
            )}
            {activeIndex === 3 && <SalaryCard salary={salary} count={count} setSalary={setSalary} setCount={setCount} />}
          </div>
          <div className="ps-bottom-label" style={{ padding:"20px 32px 28px" }}>
            <div style={{ fontFamily:"Inter,sans-serif", fontWeight:500, fontSize:"18px", color:"#0D0D0D", letterSpacing:"-0.02em", marginBottom:"4px" }}>{activePanel.title}</div>
            <div style={{ fontFamily:"Inter,sans-serif", fontWeight:400, fontSize:"14px", color:"#777", lineHeight:1.5 }}>{activePanel.description}</div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Inter:wght@400;500&display=swap');
        input[type="range"] { -webkit-appearance:none; appearance:none; width:100%; height:3px; border-radius:9999px; outline:none; cursor:pointer; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:9999px; background:#000; cursor:pointer; box-shadow:0 1px 4px rgba(0,0,0,0.2); }
        input[type="range"]::-moz-range-thumb { width:18px; height:18px; border-radius:9999px; background:#000; border:none; cursor:pointer; }
        .bar-item { flex:1; border-radius:4px 4px 0 0; height:0; }

        @media (max-width: 768px) {
          [data-problem-section] { padding: 80px 0 40px !important; }
          [data-problem-section] > div { padding: 0 32px !important; }
          .ps-title-block { text-align: center !important; align-items: center !important; margin-bottom: 24px !important; }
          [data-problem-section] h2 { font-size: 1.6rem !important; }
          .ps-desktop-layout { display: none !important; }
          .ps-mobile-layout  { display: block !important; }
          .ps-gray-container { padding: 36px 20px 24px !important; min-height: auto !important; }
          .ps-notif-stack { margin-top: 36px !important; width: 100% !important; max-width: 100% !important; }
          .ps-bottom-label { padding: 24px 20px !important; }
        }

        @media (min-width: 769px) {
          .ps-mobile-layout  { display: none !important; }
          .ps-desktop-layout { display: flex !important; }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          [data-problem-section] > div { padding: 0 32px !important; }
        }
      `}</style>

      <section data-problem-section style={{ width:"100%", backgroundColor:"#FDFCFC", padding:"80px 0" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"0 48px" }}>

          <div className="ps-title-block" style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"48px" }}>
            <h2 style={{ fontFamily:"Inter,sans-serif", fontWeight: 300, fontSize:"clamp(2rem,3.5vw,2.6rem)", color:"#0D0D0D", letterSpacing:"-0.02em", lineHeight:1.1, margin:0 }}>
              Sound familiar?
            </h2>
            <p style={{ fontFamily:"Inter,sans-serif", fontWeight:400, fontSize:"14px", color:"#777", margin:0, lineHeight:1.5 }}>
              Calls go unanswered. Patients don't wait. Your front desk can't be everywhere at once.
            </p>
          </div>

          {/* Mobile: 4 stacked cards */}
          <div className="ps-mobile-layout">
            {PANELS.map((panel, i) => (
              <MobileCard key={panel.id} panel={panel} index={i} salary={salary} count={count} setSalary={setSalary} setCount={setCount} />
            ))}
          </div>

          {/* Desktop: tab list + animated card */}
          <div className="ps-desktop-layout" style={{ gap:"5%", alignItems:"flex-start" }}>
            <div style={{ width:"35%", flexShrink:0, display:"flex", flexDirection:"column" }}>
              {PANELS.map((panel, i) => {
                const isActive = i === activeIndex;
                const Icon = panel.icon !== "shekel" ? panel.icon : null;
                return (
                  <button key={panel.id}
                    onClick={() => { setDirection(i > activeIndex ? 1 : -1); setActiveIndex(i); }}
                    style={{ display:"flex", alignItems:"center", gap:"14px", width:"100%", padding:"16px 0", background:"none", border:"none", borderTop:i>0?"1px solid rgba(0,0,0,0.08)":"none", cursor:"pointer", textAlign:"left", opacity:isActive?1:0.35, transition:"opacity 0.25s ease" }}
                  >
                    {Icon ? <Icon size={18} strokeWidth={1.8} color={isActive?"#0D0D0D":"#999"} />
                           : <span style={{ fontFamily:"Inter,sans-serif", fontWeight:300, fontSize:"18px", color:isActive?"#0D0D0D":"#999", lineHeight:1 }}>₪</span>}
                    <span style={{ fontFamily:"Inter,sans-serif", fontWeight:400, fontSize:"15px", color:isActive?"#0D0D0D":"#999", letterSpacing:"-0.01em" }}>{panel.label}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ width:"65%", flexShrink:0 }}>{desktopCard}</div>
          </div>

        </div>
      </section>
    </>
  );
}
