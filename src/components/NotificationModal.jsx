"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "@/lib/navigation-adapter";
import { Logo, getImageUrl } from "../assets/assets.js";
import {
  X,
  Bell,
  ExternalLink,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";

export default function NotificationModal({
  notifications: rawNotifications,
  notification: singleNotification,
  isOpen: forceIsOpen,
  onClose: customOnClose,
  previewMode = false,
}) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);
  const [dismissedIds, setDismissedIds] = useState(new Set());

  // Normalize incoming notifications array
  const allNotifications = React.useMemo(() => {
    if (rawNotifications && Array.isArray(rawNotifications)) {
      return rawNotifications.filter((n) => n && n.isActive);
    }
    if (singleNotification && singleNotification.isActive) {
      return [singleNotification];
    }
    return [];
  }, [rawNotifications, singleNotification]);

  // Filter out notifications dismissed during current session
  const activeList = React.useMemo(() => {
    if (previewMode) return allNotifications;
    return allNotifications.filter((n) => {
      const storageKey = `dismissed_notif_${n._id}_${n.updatedAt || ""}`;
      return !sessionStorage.getItem(storageKey) && !dismissedIds.has(n._id);
    });
  }, [allNotifications, previewMode, dismissedIds]);

  useEffect(() => {
    if (previewMode) {
      setIsOpen(Boolean(forceIsOpen) && allNotifications.length > 0);
      setCurrentIndex(0);
      return;
    }

    if (activeList.length > 0) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 350);
      return () => clearTimeout(timer);
    } else {
      setIsOpen(false);
    }
  }, [activeList.length, previewMode, forceIsOpen, allNotifications.length]);

  // Lock background page scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Adjust index if out of bounds
  useEffect(() => {
    if (currentIndex >= activeList.length && activeList.length > 0) {
      setCurrentIndex(activeList.length - 1);
    }
  }, [activeList.length, currentIndex]);

  // Auto-play slider: advance to next notification every 6 seconds when multiple exist
  useEffect(() => {
    if (!isOpen || activeList.length <= 1 || isFullscreenImage) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeList.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isOpen, activeList.length, isFullscreenImage, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (isFullscreenImage) {
        if (e.key === "Escape") setIsFullscreenImage(false);
        return;
      }

      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "Escape") {
        handleDismissAll();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isFullscreenImage, activeList.length, currentIndex]);

  const currentNotification = activeList[currentIndex] || activeList[0] || null;

  const handleNext = () => {
    if (activeList.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % activeList.length);
  };

  const handlePrev = () => {
    if (activeList.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + activeList.length) % activeList.length);
  };

  const handleDismissAll = () => {
    setIsClosing(true);
    if (!previewMode) {
      allNotifications.forEach((n) => {
        if (n._id) {
          const storageKey = `dismissed_notif_${n._id}_${n.updatedAt || ""}`;
          sessionStorage.setItem(storageKey, "true");
        }
      });
      setDismissedIds(new Set(allNotifications.map((n) => n._id)));
    }
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      setIsFullscreenImage(false);
      if (customOnClose) customOnClose();
    }, 150);
  };

  const handleActionClick = () => {
    if (!currentNotification?.buttonUrl) {
      handleDismissAll();
      return;
    }

    const url = currentNotification.buttonUrl.trim();

    if (!previewMode) {
      allNotifications.forEach((n) => {
        if (n._id) {
          const storageKey = `dismissed_notif_${n._id}_${n.updatedAt || ""}`;
          sessionStorage.setItem(storageKey, "true");
        }
      });
      setDismissedIds(new Set(allNotifications.map((n) => n._id)));
    }

    setIsOpen(false);
    setIsClosing(false);
    setIsFullscreenImage(false);
    document.body.style.overflow = "";
    if (customOnClose) customOnClose();

    if (url.startsWith("http://") || url.startsWith("https://")) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      const internalRoute = url.startsWith("/") ? url : `/${url}`;
      navigate(internalRoute);
    }
  };

  if (!isOpen || !currentNotification) return null;

  const {
    title = "",
    description = "",
    image = "",
    badge = "Announcement",
    buttonText = "",
    buttonUrl = "",
  } = currentNotification;

  const totalNotices = activeList.length;
  const hasMultiple = totalNotices > 1;
  const notificationImage = getImageUrl(image, null);
  const hasImage = Boolean(notificationImage);
  const hasTitle = Boolean(title && title.trim());
  const hasDesc = Boolean(description && description.trim());
  const hasAction = Boolean(buttonText && buttonText.trim() && buttonUrl && buttonUrl.trim());

  return (
    <>
      {/* ── 1. AUTHENTIC NOTIFICATION CARD MODAL ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-card-title"
        className={`fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${
          isClosing ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {/* Backdrop overlay */}
        <div
          onClick={handleDismissAll}
          className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs transition-opacity"
        />

        {/* ── NOTIFICATION CARD CONTAINER ── */}
        <div
          className={`relative w-full max-w-lg bg-white dark:bg-[#0c1424] text-slate-800 dark:text-slate-100 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-all duration-300 transform ${
            isClosing
              ? "scale-95 translate-y-4 opacity-0"
              : "scale-100 translate-y-0 opacity-100"
          }`}
        >
          {/* Top Decorative Notification Accent Line */}
          <div className="h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 w-full shrink-0" />

          {/* ── NOTIFICATION HEADER ── */}
          <div className="px-5 py-3.5 bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Notification Bell with pulsating indicator */}
              <div className="relative w-8 h-8 rounded-xl bg-teal-500/10 dark:bg-teal-400/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/20">
                <Bell size={15} className="animate-wiggle" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-teal-500 rounded-full ring-2 ring-white dark:ring-[#0c1424]" />
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 font-mono">
                    {badge || "Announcement"}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    • Official Notice
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Al-Mukhtar Islamic Sciences
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {hasMultiple && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300">
                  <span>{currentIndex + 1}</span>
                  <span className="text-slate-400">/</span>
                  <span>{totalNotices}</span>
                </div>
              )}

              <button
                onClick={handleDismissAll}
                aria-label="Close notification"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* ── NOTIFICATION BODY ── */}
          <div className="p-5 space-y-3.5 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {/* Optional Attached Notice Image / Flyer */}
            {hasImage && (
              <div
                onClick={() => setIsFullscreenImage(true)}
                className="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-100 dark:bg-slate-900 max-h-52"
              >
                <img
                  src={notificationImage}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = Logo;
                  }}
                  alt={title || "Notification banner"}
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-medium backdrop-blur-xs">
                  <Maximize2 size={14} />
                  <span>Click to expand flyer</span>
                </div>
              </div>
            )}

            {/* Notification Title */}
            {hasTitle && (
              <h2
                id="notification-card-title"
                className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug font-heading tracking-tight"
              >
                {title}
              </h2>
            )}

            {/* Notification Text */}
            {hasDesc && (
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                {description}
              </div>
            )}
          </div>

          {/* ── NOTIFICATION FOOTER & ACTIONS ── */}
          <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            {/* Multiple notices pagination arrows */}
            {hasMultiple ? (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Previous notice"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Next notice"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            ) : (
              <span className="text-[11px] text-slate-400 font-mono">
                Recent update
              </span>
            )}

            {/* Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDismissAll}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Dismiss
              </button>

              {hasAction && (
                <button
                  type="button"
                  onClick={handleActionClick}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm hover:shadow transition cursor-pointer"
                >
                  <span>{buttonText}</span>
                  {buttonUrl.startsWith("http") ? (
                    <ExternalLink size={12} />
                  ) : (
                    <ArrowRight size={12} />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. FULLSCREEN IMAGE LIGHTBOX PREVIEW ── */}
      {isFullscreenImage && hasImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[1000000] flex items-center justify-center p-4 bg-black/95 animate-in fade-in duration-150"
        >
          <div
            onClick={() => setIsFullscreenImage(false)}
            className="fixed inset-0 cursor-zoom-out"
          />

          <button
            type="button"
            onClick={() => setIsFullscreenImage(false)}
            className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="Close preview"
          >
            <X size={18} />
          </button>

          <div className="relative z-10 max-w-[90vw] max-h-[85vh] flex flex-col items-center justify-center">
            <img
              src={notificationImage}
              alt={title || "Fullscreen preview"}
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
