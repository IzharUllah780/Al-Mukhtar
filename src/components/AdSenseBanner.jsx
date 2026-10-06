"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * AdSenseBanner Component
 * Displays Google AdSense ads in designated positions with elegant styling.
 * Only displays the advertisement container, borders, and label when ads are actively loaded and running.
 */
export default function AdSenseBanner({
  client = "ca-pub-5967341765221118",
  slot,
  format = "auto",
  responsive = "true",
  className = "",
  label = "Advertisement",
}) {
  const insRef = useRef(null);
  const pushedRef = useRef(false);
  const [isAdRunning, setIsAdRunning] = useState(false);

  useEffect(() => {
    // 1. Push to adsbygoogle if not already pushed
    if (!pushedRef.current) {
      try {
        if (typeof window !== "undefined") {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          pushedRef.current = true;
        }
      } catch (err) {
        console.debug("AdSense push error:", err);
      }
    }

    // 2. Observe the <ins> tag to detect when an ad is actually filled and running
    const target = insRef.current;
    if (!target) return;

    const checkAdStatus = () => {
      const status = target.getAttribute("data-ad-status");
      const hasIframe = !!target.querySelector("iframe");
      const hasChildContent = target.children.length > 0 && target.offsetHeight > 0;

      if (status === "filled" || (hasIframe && target.offsetHeight > 0) || hasChildContent) {
        setIsAdRunning(true);
      } else if (status === "unfilled") {
        setIsAdRunning(false);
      }
    };

    // Check immediately in case it loaded synchronously
    checkAdStatus();

    // Listen for attribute and child list changes
    const observer = new MutationObserver(() => {
      checkAdStatus();
    });

    observer.observe(target, {
      attributes: true,
      attributeFilter: ["data-ad-status", "style", "class"],
      childList: true,
      subtree: true,
    });

    // Also interval check for up to 6 seconds to catch iframe dimension changes
    const interval = setInterval(checkAdStatus, 1000);
    const timeout = setTimeout(() => clearInterval(interval), 6000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      className={`w-full transition-all duration-300 ${
        isAdRunning
          ? `my-6 p-3 sm:p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-center overflow-hidden shadow-2xs ${className}`
          : "h-0 m-0 p-0 border-none overflow-hidden opacity-0 pointer-events-none"
      }`}
      aria-hidden={!isAdRunning}
    >
      {isAdRunning && label && (
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="h-px bg-slate-200 dark:bg-slate-800 flex-1 max-w-[60px]" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 select-none">
            {label}
          </span>
          <span className="h-px bg-slate-200 dark:bg-slate-800 flex-1 max-w-[60px]" />
        </div>
      )}

      <div className="w-full flex items-center justify-center overflow-hidden">
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: "block", width: "100%" }}
          data-ad-client={client}
          {...(slot ? { "data-ad-slot": slot } : {})}
          data-ad-format={format}
          data-full-width-responsive={responsive}
        />
      </div>
    </div>
  );
}

