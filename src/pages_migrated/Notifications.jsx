"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "@/lib/navigation-adapter";
import {
  Bell,
  Calendar,
  ArrowRight,
  ExternalLink,
  RotateCw,
  X,
  Maximize2,
  Inbox,
} from "lucide-react";
import { Logo, LogoImg, getImageUrl } from "../assets/assets.js";
import { useAllNotifications } from "@/lib/queries";
import ApiErrorState from "../components/ApiErrorState.jsx";

// Helper for relative timestamps
function formatTimeAgo(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

function Notifications() {
  const navigate = useNavigate();
  const {
    data: allNotifications = [],
    isLoading: allNotificationsLoading,
    isError: isAllNotificationsError,
    refetch: refetchAllNotifications,
  } = useAllNotifications();

  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    document.title = "Notifications | Al-Mukhtar Institute";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Handle ESC key for lightbox modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 1. Active Notifications (ordered by newest date first)
  const activeNotifications = useMemo(() => {
    return allNotifications
      .filter((n) => n.isActive)
      .sort((a, b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt));
  }, [allNotifications]);

  // 2. Inactive Notifications (ordered chronologically by newest date first)
  const inactiveNotifications = useMemo(() => {
    return allNotifications
      .filter((n) => !n.isActive)
      .sort((a, b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt));
  }, [allNotifications]);

  const handleAction = (redirectUrl) => {
    if (!redirectUrl) return;
    if (redirectUrl.startsWith("http://") || redirectUrl.startsWith("https://")) {
      window.open(redirectUrl, "_blank", "noopener,noreferrer");
    } else {
      navigate(redirectUrl);
    }
  };

  // Helper to extract action link & label
  const getActionDetails = (item) => {
    const url = item.buttonUrl || item.redirectUrl || "";
    const text =
      item.buttonText ||
      (url.includes("/courses")
        ? "View Course"
        : url.includes("/blog")
        ? "Read Article"
        : url.includes("/apply")
        ? "Apply Now"
        : "View Details");
    return { url, text };
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 transition-colors duration-200 pt-8 sm:pt-10 pb-20">
      {/* ── Single Heading ──────────────────── */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 mb-6 sm:mb-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white tracking-tight">
            Notifications
          </h1>

          <button
            type="button"
            onClick={() => refetchAllNotifications()}
            title="Refresh notifications"
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCw size={15} className={allNotificationsLoading ? "animate-spin text-teal-600 dark:text-teal-400" : ""} />
          </button>
        </div>
      </div>

      {/* ── Main Notifications 2-Column Compact Grid ────────────────────────── */}
      <main className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {allNotificationsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-4 rounded-2xl animate-pulse bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                <div className="flex-1 space-y-2.5">
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/5" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-800/70 rounded w-full" />
                </div>
                <div className="w-20 h-14 bg-slate-200 dark:bg-slate-800 rounded-xl shrink-0" />
              </div>
            ))}
          </div>
        ) : isAllNotificationsError ? (
          <div className="my-8 max-w-md mx-auto">
            <ApiErrorState
              title="Unable to load notifications"
              message="Failed to retrieve announcements from the server."
              onRetry={refetchAllNotifications}
            />
          </div>
        ) : allNotifications.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 py-16 px-6 text-center space-y-2 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto border border-teal-100 dark:border-teal-900/50">
              <Inbox size={22} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              No notifications
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              Announcements and updates will show up here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* ══════════════════════════════════════════════════════════════════
                1. ACTIVE NOTIFICATIONS
            ══════════════════════════════════════════════════════════════════ */}
            {activeNotifications.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-start">
                {activeNotifications.map((item) => {
                  const timeAgo = formatTimeAgo(item.createdAt || item.updatedAt);
                  const { url: actionUrl, text: actionText } = getActionDetails(item);

                  return (
                    <div
                      key={item._id}
                      className="group relative flex items-start justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-teal-200/90 dark:border-teal-900/50 shadow-sm hover:shadow-md hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all duration-200 h-auto max-h-[320px] overflow-hidden"
                    >
                      {/* Left: Avatar & Text */}
                      <div className="flex items-start gap-3 flex-1 min-w-0 max-h-full flex-col justify-between">
                        <div className="w-full">
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="relative shrink-0">
                              <div className="w-8 h-8 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-teal-50 dark:bg-slate-800">
                                <img src={Logo} alt="Al-Mukhtar" className="w-full h-full object-cover" />
                              </div>
                              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                            </div>

                            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                Al-Mukhtar
                              </span>
                              <span className="text-[10.5px] text-slate-400 dark:text-slate-500 font-mono">
                                • {timeAgo}
                              </span>
                            </div>
                          </div>

                          {/* Title */}
                          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug break-words">
                            {item.title}
                          </h2>

                          {/* Description clamped to 2 lines */}
                          {item.description && (
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed whitespace-pre-line break-words line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>

                        {/* ACTION BUTTON */}
                        {actionUrl && (
                          <div className="mt-3 pt-0.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleAction(actionUrl)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
                            >
                              <span>{actionText}</span>
                              {actionUrl.startsWith("http") ? (
                                <ExternalLink size={12} />
                              ) : (
                                <ArrowRight size={12} />
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Right: Compact Thumbnail Image */}
                      {Boolean(getImageUrl(item.image)) && (
                        <div className="shrink-0 relative group/thumb rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 w-20 h-14 sm:w-24 sm:h-16 self-start">
                          <img
                            src={getImageUrl(item.image)}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = LogoImg;
                            }}
                            alt={item.title}
                            onClick={() => setSelectedImage(getImageUrl(item.image))}
                            className="w-full h-full object-cover cursor-zoom-in group-hover/thumb:scale-105 transition-transform duration-200"
                            loading="lazy"
                          />
                          <button
                            type="button"
                            onClick={() => setSelectedImage(getImageUrl(item.image))}
                            title="Expand Image"
                            className="absolute inset-0 bg-black/30 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center text-white transition-opacity cursor-zoom-in"
                          >
                            <Maximize2 size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                2. DIVIDER LINE & INACTIVE NOTIFICATIONS
            ══════════════════════════════════════════════════════════════════ */}
            {inactiveNotifications.length > 0 && (
              <>
                {/* Subtle Divider Line */}
                <div className="pt-3 pb-1 flex items-center gap-3">
                  <div className="h-px bg-slate-200 dark:border-slate-800 flex-1" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                    Earlier
                  </span>
                  <div className="h-px bg-slate-200 dark:border-slate-800 flex-1" />
                </div>

                {/* Inactive Notifications Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-start">
                  {inactiveNotifications.map((item) => {
                    const timeAgo = formatTimeAgo(item.createdAt || item.updatedAt);
                    const fullDate = new Date(item.createdAt || item.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });

                    return (
                      <div
                        key={item._id}
                        className="group relative flex items-start justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 opacity-80 hover:opacity-100 h-auto max-h-[300px] overflow-hidden"
                      >
                        {/* Left: Avatar & Text */}
                        <div className="flex items-start gap-3 flex-1 min-w-0 flex-col">
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-8 h-8 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0 grayscale-30">
                              <img src={Logo} alt="Al-Mukhtar" className="w-full h-full object-cover" />
                            </div>

                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                Al-Mukhtar
                              </span>
                              <span className="text-[10.5px] text-slate-400 dark:text-slate-500 font-mono">
                                • {timeAgo || fullDate}
                              </span>
                            </div>
                          </div>

                          {/* Title */}
                          <h2 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 leading-snug break-words">
                            {item.title}
                          </h2>

                          {/* Description clamped to 2 lines */}
                          {item.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed whitespace-pre-line break-words line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>

                        {/* Right: Compact Thumbnail Image */}
                        {Boolean(getImageUrl(item.image)) && (
                          <div className="shrink-0 relative group/thumb rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 w-20 h-14 sm:w-24 sm:h-16 self-start">
                            <img
                              src={getImageUrl(item.image)}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = LogoImg;
                              }}
                              alt={item.title}
                              onClick={() => setSelectedImage(getImageUrl(item.image))}
                              className="w-full h-full object-cover cursor-zoom-in group-hover/thumb:scale-105 transition-transform duration-200 opacity-90 group-hover:opacity-100"
                              loading="lazy"
                            />
                            <button
                              type="button"
                              onClick={() => setSelectedImage(getImageUrl(item.image))}
                              title="Expand Image"
                              className="absolute inset-0 bg-black/30 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center text-white transition-opacity cursor-zoom-in"
                            >
                              <Maximize2 size={13} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* ── Lightbox Image Preview Modal ─────────────────────────────────────── */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-2 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
              aria-label="Close image preview"
            >
              <X size={18} />
            </button>
            <img
              src={selectedImage}
              alt="Notification Preview"
              className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;
