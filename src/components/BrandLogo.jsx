export default function BrandLogo({ color = "#000000" }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      {/* Central circle - voice source */}
      <circle cx="32" cy="32" r="7" fill={color} />

      {/* Inner concentric ring — cutout */}
      <circle cx="32" cy="32" r="4" fill="none" stroke={color} strokeWidth="1.2" />

      {/* Sound wave arcs - right side */}
      <path
        d="M44 20C50.5 24 54 31 54 32C54 33 50.5 40 44 44"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M40 24C44.5 27 47 31.5 47 32C47 32.5 44.5 37 40 40"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Sound wave arcs - left side (mirrored) */}
      <path
        d="M20 20C13.5 24 10 31 10 32C10 33 13.5 40 20 44"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M24 24C19.5 27 17 31.5 17 32C17 32.5 19.5 37 24 40"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}