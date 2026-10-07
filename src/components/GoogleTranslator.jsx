"use client";

import React, { useEffect, useState } from "react";

export default function GoogleTranslator() {
  const [currentLang, setCurrentLang] = useState("en");
  const [isLoaded, setIsLoaded] = useState(false);

  // Helper to apply or remove RTL mode from HTML document safely
  const applyDirection = (lang) => {
    if (typeof document === "undefined") return;
    const isUrdu = lang === "ur";
    const html = document.documentElement;
    const body = document.body;

    if (isUrdu) {
      if (html.getAttribute("dir") !== "rtl") html.setAttribute("dir", "rtl");
      if (!html.classList.contains("urdu-mode")) {
        html.classList.add("urdu-mode", "rtl");
      }
      if (body && body.getAttribute("dir") !== "rtl") body.setAttribute("dir", "rtl");
      if (body && !body.classList.contains("urdu-mode")) {
        body.classList.add("urdu-mode", "rtl");
      }
    } else {
      if (html.getAttribute("dir") === "rtl") html.setAttribute("dir", "ltr");
      html.classList.remove("urdu-mode", "rtl");
      if (body && body.getAttribute("dir") === "rtl") body.setAttribute("dir", "ltr");
      body?.classList.remove("urdu-mode", "rtl");
    }
  };

  useEffect(() => {
    // Check existing cookie or localStorage
    const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
    const savedLang = localStorage.getItem("site_lang");
    const activeLang = match && match[1] ? match[1] : (savedLang || "en");

    setCurrentLang(activeLang);
    applyDirection(activeLang);

    // Set up Google Translate callback
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,ur",
            autoDisplay: false,
          },
          "google_translate_element"
        );
        setIsLoaded(true);
      }
    };

    // Load Google Translate script if not already present
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google?.translate) {
      setIsLoaded(true);
    }

    // Inject high-priority global CSS rules to permanently disable hover background colors on translated text
    const styleId = "google-translate-no-hover-bg";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
        .goog-text-highlight,
        .goog-text-highlight:hover,
        .goog-text-highlight:focus,
        .goog-text-highlight:active,
        font.goog-text-highlight,
        font.goog-text-highlight:hover,
        font,
        font:hover,
        font[style],
        font[style]:hover,
        *[class*="goog-text-highlight"],
        *[class*="goog-text-highlight"]:hover {
          background-color: transparent !important;
          background: transparent !important;
          box-shadow: none !important;
          border: none !important;
          text-decoration: none !important;
          outline: none !important;
        }
        #goog-gt-tt,
        .goog-te-balloon-frame,
        .goog-tooltip {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Intercept mouseover events on translated text elements in capture phase
    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target &&
        (target.tagName === "FONT" ||
          target.classList?.contains("goog-text-highlight") ||
          target.closest?.(".goog-text-highlight") ||
          target.closest?.("font"))
      ) {
        target.style.setProperty("background-color", "transparent", "important");
        target.style.setProperty("background", "transparent", "important");
        target.style.setProperty("box-shadow", "none", "important");
      }
    };

    window.addEventListener("mouseover", handleMouseOver, true);

    return () => {
      window.removeEventListener("mouseover", handleMouseOver, true);
    };
  }, []);

  const changeLanguage = (langCode) => {
    setCurrentLang(langCode);
    localStorage.setItem("site_lang", langCode);
    applyDirection(langCode);

    if (langCode === "en") {
      // Clear translation cookies to return to default English
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
      window.location.reload();
      return;
    }

    // Set Google Translate cookie for Urdu
    const cookieValue = `/en/${langCode}`;
    document.cookie = `googtrans=${cookieValue}; path=/;`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname};`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=.${window.location.hostname};`;

    window.location.reload();
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
