import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const ACCENT = "#000000";

const CATEGORIES = ["All", "Setup", "Security", "Integrations", "Your team"];

function highlightMatch(text, query) {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <span key={i} style={{ color: ACCENT }}>{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function FaqSection() {
  const { t, isRtl } = useLanguage();
  const tf = t.faq;
  const FAQS = tf.items;
  const [openIndex, setOpenIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [searchFocused, setSearchFocused] = useState(false);

  const filtered = useMemo(() => {
    return FAQS.reduce((acc, faq, idx) => {
      const tagMatch = activeTag === "All" || faq.tags.includes(activeTag);
      if (!tagMatch) return acc;
      const q = search.trim().toLowerCase();
      if (!q) return { ...acc, items: [...acc.items, { ...faq, origIdx: idx }] };
      const match = faq.q.toLowerCase().includes(q) || faq.a.toLowerCase().includes(q);
      if (!match) return acc;
      return { ...acc, items: [...acc.items, { ...faq, origIdx: idx }] };
    }, { items: [] });
  }, [search, activeTag, FAQS]);

  useEffect(() => {
    setOpenIndex(null);
  }, [activeTag, search]);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section data-faq dir={isRtl ? "rtl" : "ltr"} style={{ padding: "80px 40px", backgroundColor: "#FFFFFF", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>

        {/* Outer card */}
        <div style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "0.5px solid #E2E2E2",
          overflow: "hidden",
        }}>

          {/* Header with dot-grid */}
          <div style={{
            position: "relative",
            padding: "40px 36px 32px",
            backgroundImage: "radial-gradient(circle, #E8E8E8 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}>

            {/* Label */}
            <span style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: ACCENT,
              display: "block",
              marginBottom: "10px",
            }}>
              {tf.label}
            </span>

            {/* Heading */}
            <h2 style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 300,
              fontSize: "clamp(1.75rem, 3vw, 2rem)",
              color: "#0D0D0D",
              letterSpacing: "-0.04em",
              lineHeight: 1.2,
              margin: "0 0 24px 0",
            }}>
              {tf.title}
            </h2>

            {/* Search bar */}
            <div style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              borderRadius: "10px",
              border: `1px solid ${searchFocused ? ACCENT : "#E5E5E5"}`,
              background: "#FFFFFF",
              transition: "border-color 0.2s ease",
            }}>
              <Search size={16} strokeWidth={1.8} color={searchFocused ? ACCENT : "#6B6B6B"} style={{ flexShrink: 0, transition: "color 0.2s ease" }} />
              <input
                type="text"
                placeholder={tf.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "14px",
                  color: "#0D0D0D",
                }}
              />
            </div>

            {/* Category tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "16px" }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTag(cat)}
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fontSize: "12px",
                    padding: "6px 14px",
                    borderRadius: "999px",
                    border: activeTag === cat ? `1px solid ${ACCENT}` : "1px solid #E2E2E2",
                    background: activeTag === cat ? "#0D0D0D" : "#FFFFFF12",
                    color: activeTag === cat ? "#FFFFFF" : "#555555",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {tf.categories?.[cat] || cat}
                </button>
              ))}
            </div>
          </div>

          {/* Accordion list */}
          <div style={{ minHeight: "420px" }}>
            {filtered.items.length === 0 ? (
              <div style={{ padding: "36px", textAlign: "center" }}>
                <p style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "13px",
                  color: "#6B6B6B",
                  margin: 0,
                }}>
                  {tf.noResults}
                </p>
              </div>
            ) : (
              filtered.items.map((faq, i) => {
                const isOpen = openIndex === i;
                return (
                  <div key={i} style={{ borderTop: i === 0 ? "0.5px solid #EDEDED" : undefined }}>
                    <button
                      onClick={() => toggle(i)}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "16px",
                        width: "100%",
                        textAlign: "left",
                        background: "none",
                        border: "none",
                        borderTop: i > 0 ? "0.5px solid #EDEDED" : undefined,
                        padding: "20px 36px",
                        cursor: "pointer",
                      }}
                    >
                      <span style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: isOpen ? ACCENT : "#0D0D0D",
                        lineHeight: 1.5,
                        transition: "color 0.15s ease",
                      }}
                      className="faq-question-text"
                      >
                        {highlightMatch(faq.q, search)}
                      </span>
                      <span style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 400,
                        fontSize: "18px",
                        color: isOpen ? ACCENT : "#6B6B6B",
                        lineHeight: 1,
                        flexShrink: 0,
                        marginTop: "-1px",
                        transition: "transform 0.2s ease, color 0.2s ease",
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      }}>
                        +
                      </span>
                    </button>

                    <div style={{
                      overflow: "hidden",
                      maxHeight: isOpen ? "300px" : "0",
                      opacity: isOpen ? 1 : 0,
                      transition: "max-height 0.3s ease, opacity 0.25s ease",
                    }}>
                      <p style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 400,
                        fontSize: "13px",
                        color: "#6B6B6B",
                        lineHeight: 1.65,
                        margin: "0",
                        padding: "0 36px 20px",
                        paddingRight: "52px",
                      }}>
                        {faq.a}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <style>{`
        .faq-question-text:hover { color: ${ACCENT} !important; }

        @media (max-width: 768px) {
          [data-faq] { padding: 56px 16px !important; }
          [data-faq] h2 { font-size: 1.6rem !important; text-align: center !important; }
          [data-faq] p  { font-size: 14px !important; }
        }
        @media (max-width: 1024px) {
          [data-faq] { padding: 64px 24px !important; }
        }
      `}</style>
    </section>
  );
}