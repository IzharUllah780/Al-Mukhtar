"use client";

import React, { useEffect, useRef } from "react";

/**
 * AdSenseBanner Component
 * Displays Google AdSense ads in designated positions with elegant styling
 * and hydration safety.
 */
export default function AdSenseBanner({
  client = "ca-pub-5967341765221118",
  slot,
  format = "auto",
  responsive = "true",
  className = "",
  label = "Advertisement",
}) {
  const adRef = useRef(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (pushedRef.current) return;

    try {
      if (typeof window !== "undefined") {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushedRef.current = true;
      }
    } catch (err) {
      // Ignore adsbygoogle errors (e.g. ad blockers or duplicate pushes)
      console.debug("AdSense push error:", err);
    }
  }, []);

  return (
    <div
      className={`w-full my-6 p-3 sm:p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-center overflow-hidden transition-all shadow-2xs ${className}`}
    >
      {label && (
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="h-px bg-slate-200 dark:bg-slate-800 flex-1 max-w-[60px]" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 select-none">
            {label}
          </span>
          <span className="h-px bg-slate-200 dark:bg-slate-800 flex-1 max-w-[60px]" />
        </div>
      )}

      <div ref={adRef} className="min-h-[90px] flex items-center justify-center overflow-hidden">
        <ins
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
