import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { PhoneMissed, UserX, CalendarX, MoonStar } from "lucide-react";

const CARDS = [
{
  icon: PhoneMissed,
  headline: "Every missed call is a lost patient.",
  body: "Clinic phones ring while you're treating. No one picks up. The patient calls your competitor.",
  shade: "#f5f3f1"
},
{
  icon: UserX,
  headline: "Your receptionist can't do everything.",
  body: "Juggling calls, walk-ins, bookings, and follow-ups at the same time. Something always slips.",
  shade: "#f0ede9"
},
{
  icon: CalendarX,
  headline: "Manual bookings mean human errors.",
  body: "Wrong times, double bookings, forgotten confirmations. Every mistake costs you a patient.",
  shade: "#ebe7e2"
},
{
  icon: MoonStar,
  headline: "Your clinic closes. Patient needs don't.",
  body: "Calls after 6pm go to voicemail. Most patients never call back.",
  shade: "#e5e0d9"
}];


function ProblemCard({ card, index, activeIndex, setActiveIndex, inView }) {
  const isOpen = activeIndex === index;
  const Icon = card.icon;

  // Stacking offset: cards below active one shift down, cards above stack tightly
  const stackOffset = index * 12;
  const yBase = inView ? stackOffset : stackOffset + 40;

  return (
    <motion.div
      initial={{ opacity: 0, y: yBase + 24 }}
      animate={inView ? { opacity: 1, y: yBase } : { opacity: 0, y: yBase + 24 }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "relative",
        zIndex: CARDS.length - index,
        cursor: "pointer"
      }}
      onHoverStart={() => setActiveIndex(index)}
      onHoverEnd={() => setActiveIndex(null)}
      onTap={() => setActiveIndex(isOpen ? null : index)}>
      
      <motion.div
        layout
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          backgroundColor: card.shade,
          borderRadius: "20px",
          padding: "32px",
          overflow: "hidden"
        }}>
        
        {/* Always-visible row */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "rgba(0,0,0,0.07)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
            
            <Icon size={18} color="#000000" strokeWidth={1.5} />
          </div>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: "16px",
              color: "#000000",
              lineHeight: 1.4,
              margin: 0
            }}>
            
            {card.headline}
          </p>
        </div>

        {/* Expandable body */}
        <AnimatePresence initial={false}>
          {isOpen &&
          <motion.div
            key="body"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}>
            
              <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: "14px",
                color: "#777169",
                lineHeight: 1.6,
                margin: 0,
                paddingLeft: "56px"
              }}>
              
                {card.body}
              </p>
            </motion.div>
          }
        </AnimatePresence>
      </motion.div>
    </motion.div>);

}

export default function ProblemSection() {
  const [activeIndex, setActiveIndex] = useState(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: "#fdfcfc", padding: "100px 24px" }}>
      
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: "56px" }}>
          
          <h2
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: "clamp(28px, 5vw, 42px)",
              color: "#000000",
              letterSpacing: "-0.72px",
              lineHeight: 1.15,
              margin: "0 0 16px 0"
            }}>
            
            Sound familiar?
          </h2>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: "15px",
              color: "#777169",
              lineHeight: 1.6,
              margin: 0
            }}>
            
            Every dental clinic faces these problems. Most just accept them.
          </p>
        </motion.div>

        {/* Card stack */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {CARDS.map((card, i) =>
          <ProblemCard
            key={i}
            card={card}
            index={i}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            inView={inView} />

          )}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.55, delay: 0.6, ease: "easeOut" }}
          style={{
            marginTop: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "120px",
          }}>
          
          <a
            href="#solution"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: "13px",
              color: "#a59f97",
              textDecoration: "none",
              letterSpacing: "0.01em"
            }}>
            
            See how Yael solves this ↓
          </a>
        </motion.div>
      </div>
    </section>);

}