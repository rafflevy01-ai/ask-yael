import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPHERES = [
  { key: "HE", label: "Hebrew", color: "#10B981" },
  { key: "FR", label: "Français", color: "#8B5CF6" },
  { key: "EN", label: "English", color: "#06B6D4" },
];

export default function LanguagePills() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((p) => (p + 1) % SPHERES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "flex-end",
      gap: "28px", padding: "20px 0",
    }}>
      {SPHERES.map((sphere, i) => {
        const isActive = i === active;
        return (
          <div key={sphere.key} style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: "10px",
          }}>
            {/* Sphere */}
            <motion.div
              animate={{
                scale: isActive ? 1 : 0.65,
              }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: `radial-gradient(circle at 35% 35%, ${isActive ? "#FFF" : "transparent"} 0%, ${sphere.color} 65%)`,
                opacity: isActive ? 1 : 0.45,
                boxShadow: isActive
                  ? `0 0 20px ${sphere.color}40, 0 4px 12px rgba(0,0,0,0.08)`
                  : "none",
                transition: "opacity 0.6s ease, box-shadow 0.6s ease",
              }}
            />
            {/* Label */}
            <motion.span
              animate={{
                color: isActive ? "#0D0D0D" : "#6B6B6B",
                fontWeight: isActive ? 600 : 400,
              }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "11px",
                letterSpacing: "-0.01em",
              }}
            >
              {sphere.label}
            </motion.span>
          </div>
        );
      })}
    </div>
  );
}