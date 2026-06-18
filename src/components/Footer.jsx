import React from "react";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "#" },
      { label: "Features", href: "#" },
      { label: "Languages", href: "#" },
      { label: "Pricing", href: "#" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Dental Clinics", href: "#" },
      { label: "Medical Clinics", href: "#" },
      { label: "Veterinary", href: "#" },
      { label: "Aesthetics", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com" },
      { label: "Facebook", href: "https://www.facebook.com" },
      { label: "Instagram", href: "https://www.instagram.com" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid rgba(0,0,0,0.06)", padding: "72px 40px 48px" }}>
      <div style={{
        maxWidth: "1200px", margin: "0 auto",
        display: "flex", justifyContent: "space-between", gap: "56px",
        flexWrap: "wrap",
      }}>

        {/* Branding */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "140px" }}>
          <span style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "20px",
            letterSpacing: "-0.04em",
            color: "#0D0D0D",
            marginBottom: "4px",
          }}>
            <span style={{ fontWeight: 400 }}>Ask</span>
            <span style={{ fontWeight: 700 }}>Yael</span>
          </span>
          <span style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: "12px",
            color: "#888888",
          }}>
            &copy; {new Date().getFullYear()} AskYael
          </span>
        </div>

        {/* Link columns */}
        {COLUMNS.map((col) => (
          <div key={col.title} style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "110px" }}>
            <span style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "12px",
              color: "#0D0D0D",
              marginBottom: "2px",
            }}>
              {col.title}
            </span>
            {col.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "13px",
                  color: "#555555",
                  textDecoration: "none",
                  lineHeight: 1.5,
                  transition: "color 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#0D0D0D"}
                onMouseLeave={e => e.currentTarget.style.color = "#555555"}
              >
                {link.label}
              </a>
            ))}
          </div>
        ))}

      </div>

      <style>{`
        @media (max-width: 768px) {
          footer { padding: 40px 24px !important; }
          footer > div { gap: 36px !important; flex-direction: column !important; }
        }
        @media (max-width: 1024px) {
          footer { padding: 56px 32px !important; }
        }
      `}</style>
    </footer>
  );
}