"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "@/lib/navigation-adapter";
import { X, Bell, ArrowUpRight } from "lucide-react";

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
  const [dismissedIds, setDismissedIds] = useState(new Set());

  // Normalize incoming notifications array
  const allNotifications = useMemo(() => {
    if (rawNotifications && Array.isArray(rawNotifications)) {
      return rawNotifications.filter((n) => n && (previewMode || n.isActive));
    }
    if (singleNotification && (previewMode || singleNotification.isActive)) {
      return [singleNotification];
    }
    return [];
  }, [rawNotifications, singleNotification, previewMode]);

  // Filter out notifications dismissed during current session
  const activeList = useMemo(() => {
    if (previewMode) return allNotifications;
    return allNotifications.filter((n) => {
      if (typeof window === "undefined") return true;
      try {
        const storageKey = `dismissed_notif_${n._id}_${n.updatedAt || ""}`;
        return !sessionStorage.getItem(storageKey) && !dismissedIds.has(n._id);
      } catch (e) {
        return !dismissedIds.has(n._id);
      }
    });
  }, [allNotifications, previewMode, dismissedIds]);

  useEffect(() => {
    if (previewMode) {
      setIsOpen(Boolean(forceIsOpen) && allNotifications.length > 0);
      return;
    }

    if (activeList.length > 0) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 300);
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

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleDismiss();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, allNotifications]);

  const handleDismiss = () => {
    setIsClosing(true);
    if (!previewMode) {
      allNotifications.forEach((n) => {
        if (n._id) {
          const storageKey = `dismissed_notif_${n._id}_${n.updatedAt || ""}`;
          try {
            sessionStorage.setItem(storageKey, "true");
          } catch (e) {
            // ignore
          }
        }
      });
      setDismissedIds(new Set(allNotifications.map((n) => n._id)));
    }
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      document.body.style.overflow = "";
      if (customOnClose) customOnClose();
    }, 150);
  };

  const handleNotificationClick = (item) => {
    handleDismiss();

    const url = item?.buttonUrl?.trim();
    if (url) {
      if (url.startsWith("http://") || url.startsWith("https://")) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        const internalRoute = url.startsWith("/") ? url : `/${url}`;
        navigate(internalRoute);
      }
    } else {
      // Default fallback when no custom button link: open notifications page
      navigate("/notifications");
    }
  };

  if (!isOpen || activeList.length === 0) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="website-notifications-heading"
      className={`fixed inset-0 z-99999 flex items-center justify-center p-4 sm:p-6 transition-opacity duration-200 ${
        isClosing ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Backdrop overlay */}
      <div
        onClick={handleDismiss}
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs transition-opacity"
      />

      {/* ── NOTIFICATION MODAL CONTAINER ── */}
      <div
        className={`relative w-[92vw] min-w-[320px] sm:min-w-[480px] md:min-w-[520px] max-w-[560px] h-[50vh] min-h-[50vh] max-h-[80vh] bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col font-sans transition-all duration-200 transform ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* Top Accent Stripe */}
        <div className="h-1 bg-teal-600 w-full shrink-0" />

        {/* ── HEADER ── */}
        <div className="px-4 sm:px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 shrink-0 bg-slate-50/70 dark:bg-slate-900/80">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-teal-600 dark:text-teal-400 shrink-0" />
            <h2
              id="website-notifications-heading"
              className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-heading"
            >
              Website Notifications
            </h2>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Close notifications"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── NOTIFICATIONS ALL-IN-ONE LIST BODY ── */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto custom-scrollbar">
          <ul className="space-y-3 list-disc list-outside pl-4 text-xs sm:text-sm">
            {activeList.map((item, idx) => {
              const title = item.title?.trim() || "Website Notification";
              const hasLink = Boolean(item.buttonUrl && item.buttonUrl.trim());

              return (
                <li key={item._id || idx} className="text-blue-600 dark:text-blue-400">
                  <button
                    type="button"
                    onClick={() => handleNotificationClick(item)}
                    className="text-left text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline font-medium cursor-pointer transition-colors leading-relaxed inline-flex items-center gap-1 group"
                  >
                    <span>{title}</span>
                    {hasLink && (
                      <ArrowUpRight
                        size={14}
                        className="shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
