import React from "react";

export default function CardTopImage({ src, alt }) {
  return (
    <div
      style={{
        width: "calc(100% + 48px)",
        marginLeft: "-24px",
        marginTop: "-20px",
        marginBottom: "16px",
        height: "120px",
        overflow: "hidden",
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          display: "block",
        }}
      />
    </div>
  );
}