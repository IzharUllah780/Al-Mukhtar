"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";

export default function GoogleTranslator({ onLanguageChange }) {
  const [currentLang, setCurrentLang] = useState("en");
  const isUpdatingRef = useRef(false);

  // Helper to apply or remove RTL mode from HTML document safely without thrashing
  const applyDirection = useCallback((lang) => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    const body = document.body;

    if (lang === "ur") {
      if (html.getAttribute("dir") !== "rtl") html.setAttribute("dir", "rtl");
      if (html.getAttribute("lang") !== "ur") html.setAttribute("lang", "ur");
      if (!html.classList.contains("urdu-mode")) html.classList.add("urdu-mode");
      if (!html.classList.contains("rtl")) html.classList.add("rtl");

      if (body) {
        if (body.getAttribute("dir") !== "rtl") body.setAttribute("dir", "rtl");
        if (!body.classList.contains("urdu-mode")) body.classList.add("urdu-mode");
        if (!body.classList.contains("rtl")) body.classList.add("rtl");
      }
    } else {
      if (html.getAttribute("dir") === "rtl") html.setAttribute("dir", "ltr");
      if (html.getAttribute("lang") === "ur") html.setAttribute("lang", "en");
      if (html.classList.contains("urdu-mode")) html.classList.remove("urdu-mode");
      if (html.classList.contains("rtl")) html.classList.remove("rtl");

      if (body) {
        if (body.getAttribute("dir") === "rtl") body.setAttribute("dir", "ltr");
        if (body.classList.contains("urdu-mode")) body.classList.remove("urdu-mode");
        if (body.classList.contains("rtl")) body.classList.remove("rtl");
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check existing cookie or localStorage
    const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
    const savedLang = localStorage.getItem("site_lang");
    const activeLang = match && match[1] ? match[1] : (savedLang || "en");

    setCurrentLang(activeLang);
    applyDirection(activeLang);

    // Set up Google Translate callback
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        try {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "en,ur",
              autoDisplay: false,
            },
            "google_translate_element"
          );
        } catch (e) {
          console.debug("Google translate init error:", e);
        }
      }
    };

    // Load Google Translate script if not already present
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [applyDirection]);

  const changeLanguage = (langCode) => {
    if (isUpdatingRef.current) return;
    isUpdatingRef.current = true;

    setCurrentLang(langCode);
    if (typeof window !== "undefined") {
      localStorage.setItem("site_lang", langCode);
    }

    // Trigger parent callback if provided (e.g. to close mobile drawer)
    if (onLanguageChange) {
      onLanguageChange(langCode);
    }

    if (langCode === "en") {
      applyDirection("en");
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;

      const select = document.querySelector(".goog-te-combo");
      if (select) {
        select.value = "en";
        select.dispatchEvent(new Event("change"));
      } else {
        window.location.reload();
      }
      isUpdatingRef.current = false;
      return;
    }

    applyDirection("ur");
    const cookieValue = `/en/${langCode}`;
    document.cookie = `googtrans=${cookieValue}; path=/;`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname};`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=.${window.location.hostname};`;

    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
    } else {
      window.location.reload();
    }
    isUpdatingRef.current = false;
  };

  return (
    <>
      {/* Hidden container for Google Translate widget */}
      <div id="google_translate_element" className="hidden" style={{ display: "none" }} />

      {/* Language Switcher Buttons Container */}
      <div
        className="notranslate inline-flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 rounded-lg p-1 text-[11px] font-sans"
        translate="no"
        dir="ltr"
      >
        <button
          type="button"
          onClick={() => changeLanguage("en")}
          className={`notranslate px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium flex items-center justify-center ${
            currentLang === "en"
              ? "bg-teal-600 text-white font-bold shadow-xs ring-1 ring-teal-400/40"
              : "text-slate-300 hover:text-white hover:bg-slate-800"
          }`}
          title="Switch to English"
          translate="no"
        >
          <span className="notranslate tracking-wide font-sans">English</span>
        </button>

        <button
          type="button"
          onClick={() => changeLanguage("ur")}
          className={`notranslate px-3 py-1 rounded-md transition-all cursor-pointer font-medium flex items-center justify-center text-[13px] leading-none ${
            currentLang === "ur"
              ? "bg-teal-600 text-white font-bold shadow-xs ring-1 ring-teal-400/40"
              : "text-slate-300 hover:text-white hover:bg-slate-800"
          }`}
          title="اردو میں دیکھیں (RTL)"
          translate="no"
        >
          <span
            className="notranslate font-bold"
            style={{ fontFamily: "'Noto Nastaliq Urdu', 'Noto Sans Arabic', serif" }}
          >
            اردو
          </span>
        </button>
      </div>
    </>
  );
}

