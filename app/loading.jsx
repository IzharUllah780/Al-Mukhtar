import React from "react";

export default function Loading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 md:px-10 lg:px-16 py-8 sm:py-12 space-y-8 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="w-full h-48 sm:h-64 bg-slate-200/70 dark:bg-slate-800/60 rounded-2xl" />

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 space-y-4"
          >
            <div className="w-full h-40 bg-slate-200/70 dark:bg-slate-800/60 rounded-xl" />
            <div className="h-4 bg-slate-200/70 dark:bg-slate-800/60 rounded w-2/3" />
            <div className="h-3 bg-slate-200/70 dark:bg-slate-800/60 rounded w-full" />
            <div className="h-3 bg-slate-200/70 dark:bg-slate-800/60 rounded w-4/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
