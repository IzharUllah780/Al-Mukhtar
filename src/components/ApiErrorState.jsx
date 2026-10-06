"use client";

import React, { useState } from "react";
import { RefreshCw, WifiOff, ArrowLeft, BookOpen } from "lucide-react";
import { Link } from "@/lib/navigation-adapter";

/**
 * Reusable, modern API Error State component.
 * Features an open, clean, professional layout without heavy/clunky card boxes.
 *
 * @param {Object} props
 * @param {string} [props.title="Unable to load content"]
 * @param {string} [props.message="Please check your internet connection and try refreshing."]
 * @param {Function} [props.onRetry] - Function to trigger the API refetch
 * @param {Function} [props.refetch] - Alias for onRetry
 * @param {boolean} [props.isRetrying=false] - If the parent is actively refetching
 * @param {"card" | "page" | "inline" | "banner"} [props.variant="page"] - Display layout
 * @param {string} [props.className=""] - Custom classes
 * @param {string} [props.backUrl="/blog"] - Fallback URL for back navigation
 * @param {string} [props.backLabel="Browse Publications"] - Fallback button label
 */
export default function ApiErrorState({
  title = "Unable to load research article",
  message = "We couldn't retrieve this publication from the server. Check your connection and click refresh.",
  onRetry,
  refetch,
  isRetrying = false,
  variant = "page",
  className = "",
  backUrl = "/blog",
  backLabel = "Browse Publications",
}) {
  const [internalRetrying, setInternalRetrying] = useState(false);
  const handleRetry = onRetry || refetch;

  const handleTriggerRetry = async () => {
    if (!handleRetry || internalRetrying || isRetrying) return;
    setInternalRetrying(true);
    try {
      await handleRetry();
    } catch {
      // Handled by query client
    } finally {
      setTimeout(() => setInternalRetrying(false), 500);
    }
  };

  const isSpinning = isRetrying || internalRetrying;

  // 1. Inline / Compact Variant (Sidebars, small widgets, form fields)
  if (variant === "inline") {
    return (
      <div
        className={`flex items-center justify-between gap-3 py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs ${className}`}
        role="alert"
      >
        <div className="flex items-center gap-2 min-w-0">
          <WifiOff size={14} className="text-slate-400 dark:text-slate-500 shrink-0" />
          <p className="text-slate-700 dark:text-slate-300 font-medium truncate">
            {title}
          </p>
        </div>
        {handleRetry && (
          <button
            type="button"
            onClick={handleTriggerRetry}
            disabled={isSpinning}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-600 text-white font-bold hover:bg-teal-700 transition-all text-[11px] shrink-0 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={11} className={isSpinning ? "animate-spin" : ""} />
            <span>{isSpinning ? "Retrying..." : "Refresh"}</span>
          </button>
        )}
      </div>
    );
  }

  // 2. Banner Variant
  if (variant === "banner") {
    return (
      <div
        className={`py-4 px-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border-l-4 border-teal-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}
        role="alert"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
            <WifiOff size={15} />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-black dark:text-white font-heading">
              {title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {message}
            </p>
          </div>
        </div>
        {handleRetry && (
          <button
            type="button"
            onClick={handleTriggerRetry}
            disabled={isSpinning}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all cursor-pointer disabled:opacity-60 shrink-0 self-start sm:self-auto"
          >
            <RefreshCw size={13} className={isSpinning ? "animate-spin" : ""} />
            <span>{isSpinning ? "Refreshing..." : "Refresh"}</span>
          </button>
        )}
      </div>
    );
  }

  // 3. Full Page & Default Open Minimalist Layout (Clean, open, professional, no heavy boxed card)
  return (
    <div
      className={`w-full max-w-xl mx-auto py-12 sm:py-16 text-center font-sans space-y-5 ${className}`}
      role="alert"
    >
      {/* Sleek Minimalist Icon */}
      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mx-auto">
        <WifiOff size={24} className="stroke-[1.75]" />
      </div>

      {/* Clean Typography */}
      <div className="space-y-2">
        <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-black dark:text-white tracking-tight">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto font-normal">
          {message}
        </p>
      </div>

      {/* Action Buttons: Clean Pill Buttons */}
      <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
        {handleRetry && (
          <button
            type="button"
            onClick={handleTriggerRetry}
            disabled={isSpinning}
            className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white font-bold px-6 py-2.5 rounded-full text-xs sm:text-sm shadow-xs transition-all cursor-pointer disabled:opacity-60"
          >
            <RefreshCw size={14} className={isSpinning ? "animate-spin" : ""} />
            <span>{isSpinning ? "Refreshing..." : "Refresh Page"}</span>
          </button>
        )}

        {backUrl && (
          <Link
            to={backUrl}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all"
          >
            <ArrowLeft size={14} />
            <span>{backLabel}</span>
          </Link>
        )}
      </div>
    </div>
  );
}
