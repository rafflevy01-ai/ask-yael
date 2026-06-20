import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "@/lib/translations";

const LanguageContext = createContext(null);

const STORAGE_KEY = "askyael_lang";

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState("he");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved && translations[saved]) setLangState(saved);
  }, []);

  const setLang = (next) => {
    if (!translations[next]) return;
    setLangState(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* noop */ }
  };

  const dir = lang === "he" ? "rtl" : "ltr";

  // Apply direction + Hebrew font globally
  useEffect(() => {
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);
    if (lang === "he") {
      document.body.style.fontFamily = "'Noto Sans Hebrew', sans-serif";
    } else {
      document.body.style.fontFamily = "";
    }
  }, [dir, lang]);

  const t = translations[lang] || translations.en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, dir, t, isRtl: dir === "rtl" }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Safe fallback so components never crash if used outside provider
    return { lang: "en", setLang: () => {}, dir: "ltr", t: translations.en, isRtl: false };
  }
  return ctx;
}