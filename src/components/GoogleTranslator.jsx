"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Loader2 } from "lucide-react";

export default function GoogleTranslator({ onLanguageChange }) {
  const [currentLang, setCurrentLang] = useState("en");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatingTarget, setTranslatingTarget] = useState("");
  const isUpdatingRef = useRef(false);
  const observerRef = useRef(null);
  const pollTimerRef = useRef(null);
  const fallbackTimerRef = useRef(null);

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

  const clearTranslationWatchers = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTranslationWatchers();
    };
  }, [clearTranslationWatchers]);

  // Sync translation state across multiple instances (e.g. desktop + mobile)
  useEffect(() => {
    const handleGlobalTranslateState = (e) => {
      if (e.detail) {
        setIsTranslating(Boolean(e.detail.isTranslating));
        setTranslatingTarget(e.detail.target || "");
        if (e.detail.lang) {
          setCurrentLang(e.detail.lang);
        }
      }
    };

    window.addEventListener("language-translate-state", handleGlobalTranslateState);
    return () => {
      window.removeEventListener("language-translate-state", handleGlobalTranslateState);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check existing cookie or localStorage
    const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
    const savedLang = localStorage.getItem("site_lang");
    const activeLang = match && match[1] ? match[1] : (savedLang || "en");

    setCurrentLang(activeLang);
    if (activeLang === "ur") {
      applyDirection("ur");
    } else {
      applyDirection("en");
    }

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

  // Helper to check if Urdu unicode characters exist across multiple rendered DOM nodes
  const hasUrduContentInDOM = useCallback(() => {
    if (typeof document === "undefined") return false;
    const elementsToCheck = document.querySelectorAll("h1, h2, h3, nav a span, header span, p, button span");
    const urduRegex = /[\u0600-\u06FF]{3,}/;
    let urduNodeCount = 0;

    for (let i = 0; i < elementsToCheck.length; i++) {
      const text = elementsToCheck[i]?.textContent || "";
      if (urduRegex.test(text)) {
        urduNodeCount++;
        if (urduNodeCount >= 2) {
          return true;
        }
      }
    }
    return false;
  }, []);

  // Helper to check if text has reverted to English
  const hasEnglishRestoredInDOM = useCallback(() => {
    if (typeof document === "undefined") return true;
    const elementsToCheck = document.querySelectorAll("h1, h2, nav a span, p");
    const urduRegex = /[\u0600-\u06FF]{3,}/;
    let urduFound = false;

    for (let i = 0; i < Math.min(elementsToCheck.length, 20); i++) {
      const text = elementsToCheck[i]?.textContent || "";
      if (urduRegex.test(text)) {
        urduFound = true;
        break;
      }
    }
    return !urduFound;
  }, []);

  const broadcastState = (target, translating, lang) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("language-translate-state", {
          detail: { target, isTranslating: translating, lang },
        })
      );
    }
  };

  const changeLanguage = (langCode) => {
    if (isUpdatingRef.current) return;
    isUpdatingRef.current = true;
    clearTranslationWatchers();

    if (typeof window !== "undefined") {
      localStorage.setItem("site_lang", langCode);
    }

    if (onLanguageChange) {
      onLanguageChange(langCode);
    }

    if (langCode === "en") {
      // ── SWITCHING TO ENGLISH ──
      broadcastState("en", true, "en");

      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;

      const select = document.querySelector(".goog-te-combo");
      if (select) {
        select.value = "en";
        select.dispatchEvent(new Event("change"));
      }

      const finishEnglishTransition = () => {
        clearTranslationWatchers();
        applyDirection("en");
        setTimeout(() => {
          broadcastState("en", false, "en");
          isUpdatingRef.current = false;
        }, 300);
      };

      pollTimerRef.current = setInterval(() => {
        if (hasEnglishRestoredInDOM()) {
          finishEnglishTransition();
        }
      }, 100);

      fallbackTimerRef.current = setTimeout(() => {
        finishEnglishTransition();
      }, 2000);
      return;
    }

    // ── SWITCHING TO URDU ──
    // 1. Show floating top-corner loading popup
    // 2. Keep text in current LTR orientation until Urdu translation is rendered
    broadcastState("ur", true, "ur");

    const cookieValue = `/en/${langCode}`;
    document.cookie = `googtrans=${cookieValue}; path=/;`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname};`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=.${window.location.hostname};`;

    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
    }

    const finishUrduTransition = () => {
      clearTranslationWatchers();
      // ONLY NOW align text to right side after real Urdu text has been detected in DOM
      applyDirection("ur");
      setTimeout(() => {
        broadcastState("ur", false, "ur");
        isUpdatingRef.current = false;
      }, 350);
    };

    // Poll every 80ms for translated Urdu text
    pollTimerRef.current = setInterval(() => {
      if (hasUrduContentInDOM()) {
        finishUrduTransition();
      }
    }, 80);

    // MutationObserver on document.body for instant detection
    if (typeof MutationObserver !== "undefined" && document.body) {
      observerRef.current = new MutationObserver(() => {
        if (hasUrduContentInDOM()) {
          finishUrduTransition();
        }
      });
      observerRef.current.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    // Fallback safety timer
    fallbackTimerRef.current = setTimeout(() => {
      finishUrduTransition();
    }, 3500);
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
          disabled={isTranslating}
          className={`notranslate px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium flex items-center justify-center disabled:opacity-60 ${
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
          disabled={isTranslating}
          className={`notranslate px-3 py-1 rounded-md transition-all cursor-pointer font-medium flex items-center justify-center text-[13px] leading-none disabled:opacity-60 ${
            currentLang === "ur"
              ? "bg-teal-600 text-white font-bold shadow-xs ring-1 ring-teal-400/40"
              : "text-slate-300 hover:text-white hover:bg-slate-800"
          }`}
          title="اردو میں دیکھیں (RTL)"
          translate="no"
        >
          <span
            className="notranslate font-bold"
            style={{ fontFamily: "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', 'Noto Sans Arabic', serif" }}
          >
            اردو
          </span>
        </button>
      </div>

      {/* ── TOP-CORNER FLOATING TRANSLATION LOADING POPUP (NO BLUR OVERLAY) ── */}
      {isTranslating && (
        <aside
          role="status"
          aria-live="polite"
          aria-label="Language translation in progress"
          className="notranslate fixed top-4 right-4 z-999999 pointer-events-auto animate-in fade-in slide-in-from-top-3 duration-200 font-sans"
          dir="ltr"
          translate="no"
        >
          <div className="bg-slate-900/95 dark:bg-slate-900/98 text-white border border-teal-500/40 rounded-xl px-4 py-2.5 shadow-2xl flex items-center gap-3 max-w-[280px] sm:max-w-xs ring-1 ring-teal-500/20">
            {/* Spinning Loader */}
            <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/30">
              <Loader2 size={16} className="animate-spin text-teal-400" />
            </div>

            {/* Translation Progress Text */}
            <div className="space-y-0.5 min-w-0 flex-1">
              <p className="text-[12px] font-bold text-white leading-tight truncate">
                {translatingTarget === "ur"
                  ? "Translating to Urdu..."
                  : "Restoring English..."}
              </p>
              <p
                className="text-[10.5px] text-teal-300/90 leading-tight truncate"
                style={{ fontFamily: "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', 'Noto Sans Arabic', serif" }}
              >
                {translatingTarget === "ur"
                  ? "صفحہ کا ترجمہ جاری ہے..."
                  : "Please wait..."}
              </p>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
