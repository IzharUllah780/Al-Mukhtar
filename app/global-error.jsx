"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    if (typeof console !== "undefined" && console.error) {
      console.error("Root global application error:", error);
    }
  }, [error]);

  const handleHardRefresh = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    } else {
      reset();
    }
  };

  return (
    <html lang="en">
      <body className="antialiased font-sans bg-slate-50 text-slate-900 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#0D9488] flex items-center justify-center mx-auto border border-teal-100">
            <AlertTriangle size={28} />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              Al-Mukhtar Institute
            </h2>
            <p className="text-sm font-semibold text-slate-700">
              Application encountered an issue
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              We encountered a temporary client-side display error. Please click below to refresh and reload the application.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0D9488] hover:bg-[#0B7A70] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Try Again</span>
            </button>
            <button
              type="button"
              onClick={handleHardRefresh}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Home size={14} />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
