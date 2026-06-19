import React, { useRef, useEffect, useState } from "react";

const VIDEO_URL = "https://media.base44.com/videos/public/6a2ab0818c0d050752d1521b/d23390b87_1114568_Woman_Home_3840x2160.mp4";

export default function VideoSection() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play();
          setPlaying(true);
        } else {
          videoRef.current?.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.3 }
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  const handleToggle = () => {
    if (playing) {
      videoRef.current?.pause();
      setPlaying(false);
    } else {
      videoRef.current?.play();
      setPlaying(true);
    }
  };

  return (
    <section style={{
      width: "100%",
      backgroundColor: "#FFFFFF",
      borderTop: "1px solid rgba(0,0,0,0.06)",
      position: "relative",
      overflow: "hidden",
    }}>
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        loop
        playsInline
        onClick={handleToggle}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          cursor: "pointer",
        }}
      />

      {/* Play/pause overlay */}
      {!playing && (
        <button
          onClick={handleToggle}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "rgba(0,0,0,0.55)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(6px)",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white" style={{ marginLeft: "4px" }}>
            <polygon points="5,2 20,12 5,22" />
          </svg>
        </button>
      )}
    </section>
  );
}