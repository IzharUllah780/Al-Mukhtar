"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";

export default function GoogleTranslator({ onLanguageChange }) {
  const [currentLang, setCurrentLang] = useState("en");
  const isUrduAppliedRef = useRef(false);

  // Helper to apply or remove RTL mode from HTML document safely
  const applyDirection = useCallback((lang) => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    const body = document.body;

    if (lang === "ur") {
      if (html.getAttribute("dir") !== "rtl") html.setAttribute("dir", "rtl");
      if (html.getAttribute("lang") !== "ur") html.setAttribute("lang", "ur");
      if (!html.classList.contains("urdu-mode")) html.classList.add("urdu-mode", "rtl");
      
      if (body) {
        if (body.getAttribute("dir") !== "rtl") body.setAttribute("dir", "rtl");
        if (!body.classList.contains("urdu-mode")) body.classList.add("urdu-mode", "rtl");
      }
      isUrduAppliedRef.current = true;
    } else {
      if (html.getAttribute("dir") === "rtl") html.setAttribute("dir", "ltr");
      if (html.getAttribute("lang") === "ur") html.setAttribute("lang", "en");
      html.classList.remove("urdu-mode", "rtl");
      
      if (body) {
        if (body.getAttribute("dir") === "rtl") body.setAttribute("dir", "ltr");
        body.classList.remove("urdu-mode", "rtl");
      }
      isUrduAppliedRef.current = false;
    }
  }, []);

  // Helper to verify if the page text has actually been translated into Urdu
  const isTranslatedToUrdu = useCallback(() => {
    if (typeof document === "undefined") return false;
    const html = document.documentElement;
    const body = document.body;

    // Check if Google Translate flags the page as translated
    const hasGoogleTranslatedClass =
      html.classList.contains("translated-ltr") ||
      html.classList.contains("translated-rtl") ||
      (body && (body.classList.contains("translated-ltr") || body.classList.contains("translated-rtl")));

    // Regex for Urdu / Arabic unicode character range
    const urduRegex = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;

    // Check Google Translate font nodes first
    const fontNodes = document.querySelectorAll("font");
    for (let i = 0; i < fontNodes.length && i < 30; i++) {
      const text = fontNodes[i].textContent || "";
      if (urduRegex.test(text)) {
        return true;
      }
    }

    // Check main navigation or content texts if translation class is present
    if (hasGoogleTranslatedClass) {
      const sampleElements = document.querySelectorAll("nav a, header h1, header span, main h1, main h2, main p");
      for (let i = 0; i < sampleElements.length && i < 20; i++) {
        const text = sampleElements[i].textContent || "";
        if (urduRegex.test(text)) {
          return true;
        }
      }
    }

    return false;
  }, []);

  useEffect(() => {
    // Check existing cookie or localStorage
    const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
    const savedLang = localStorage.getItem("site_lang");
    const activeLang = match && match[1] ? match[1] : (savedLang || "en");

    setCurrentLang(activeLang);

    if (activeLang === "en") {
      applyDirection("en");
    }

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

    // Watch for DOM translations: ONLY change alignment once Urdu text is actually detected
    let pollInterval = null;
    let observer = null;

    const checkAndApplyUrdu = () => {
      const currentSiteLang = localStorage.getItem("site_lang");
      const cookieM = document.cookie.match(/googtrans=\/en\/([^;]+)/);
      const isUrduWanted = (cookieM && cookieM[1] === "ur") || (currentSiteLang === "ur");

      if (isUrduWanted) {
        if (isTranslatedToUrdu()) {
          applyDirection("ur");
        }
      } else {
        applyDirection("en");
      }
    };

    // Check periodically for the first few seconds
    pollInterval = setInterval(checkAndApplyUrdu, 250);

    // Also observe DOM mutations (e.g. when Google Translate modifies tags)
    if (typeof MutationObserver !== "undefined") {
      observer = new MutationObserver(() => {
        checkAndApplyUrdu();
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
        childList: true,
        subtree: true,
      });
    }

    // Stop intense polling after 15 seconds to save CPU, but observer keeps working
    const timeoutId = setTimeout(() => {
      if (pollInterval) clearInterval(pollInterval);
    }, 15000);

    return () => {
      window.removeEventListener("mouseover", handleMouseOver, true);
      if (pollInterval) clearInterval(pollInterval);
      if (timeoutId) clearTimeout(timeoutId);
      if (observer) observer.disconnect();
    };
  }, [applyDirection, isTranslatedToUrdu]);

  const changeLanguage = (langCode) => {
    setCurrentLang(langCode);
    localStorage.setItem("site_lang", langCode);

    // Trigger parent callback immediately so mobile drawer closes smoothly
    if (onLanguageChange) {
      onLanguageChange(langCode);
    }

    if (langCode === "en") {
      // Clear translation cookies to return to default English
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
      return;
    }

    // Set Google Translate cookie for Urdu (do NOT set dir="rtl" until translation actually finishes)
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
