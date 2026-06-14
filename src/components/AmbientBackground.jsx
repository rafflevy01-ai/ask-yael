import { motion } from "framer-motion";

const containerStyle = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  overflow: "hidden",
  isolation: "isolate",
  zIndex: 0,
};

const blobBase = {
  position: "absolute",
  borderRadius: "50%",
  opacity: 0.6,
};

const overlayBase = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: "100%",
  height: "100%",
  zIndex: 10,
};

export default function AmbientBackground({
  baseColor = "#ffffff",
  color1 = "rgba(0, 122, 255, 0.4)",
  color2 = "rgba(175, 82, 222, 0.3)",
  color3 = "rgba(50, 173, 230, 0.3)",
  blurAmount = 60,
  speedMultiplier = 1,
  overlayOpacity = 0.1,
  colorDuration = 10,
}) {
  return (
    <div style={{ ...containerStyle, backgroundColor: baseColor }}>
      {/* Blob 1 */}
      <motion.div
        style={{
          ...blobBase,
          backgroundColor: color1,
          width: "80%",
          height: "80%",
          top: "10%",
          left: "10%",
        }}
        animate={{
          x: [-30, 30],
          y: [-30, 30],
          scale: [1, 1.1],
          backgroundColor: [color1, color2, color3],
        }}
        transition={{
          default: {
            duration: 7 * speedMultiplier,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
          },
          backgroundColor: {
            duration: colorDuration,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
          },
        }}
      />

      {/* Blob 2 */}
      <motion.div
        style={{
          ...blobBase,
          backgroundColor: color2,
          width: "70%",
          height: "70%",
          top: "15%",
          right: "15%",
        }}
        animate={{
          x: [50, -50],
          y: [100, -20],
          backgroundColor: [color2, color3, color1],
        }}
        transition={{
          default: {
            duration: 5 * speedMultiplier,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
          },
          backgroundColor: {
            duration: colorDuration,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
          },
        }}
      />

      {/* Blob 3 */}
      <motion.div
        style={{
          ...blobBase,
          backgroundColor: color3,
          width: "60%",
          height: "60%",
          bottom: "10%",
          left: "20%",
        }}
        animate={{
          x: [-20, 80],
          y: [100, 50],
          backgroundColor: [color3, color1, color2],
        }}
        transition={{
          default: {
            duration: 6 * speedMultiplier,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
          },
          backgroundColor: {
            duration: colorDuration,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
          },
        }}
      />

      {/* Blur overlay */}
      <div
        style={{
          ...overlayBase,
          backdropFilter: `blur(${blurAmount}px)`,
          WebkitBackdropFilter: `blur(${blurAmount}px)`,
          pointerEvents: "none",
        }}
      />

      {/* White overlay */}
      <div
        style={{
          ...overlayBase,
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          opacity: overlayOpacity,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}