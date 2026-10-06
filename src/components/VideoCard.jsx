"use client";

import React, { useMemo, useState } from "react";
import { Calendar, Share2, Check, ExternalLink, Play, Video } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import { toast } from "react-toastify";

/**
 * Normalizes YouTube iframe input into a safe embed URL or sanitized iframe HTML.
 * Handles full <iframe> tags, youtube.com/watch?v= URLs, youtu.be URLs, and embed URLs.
 */
export function extractYoutubeEmbedUrl(input) {
  if (!input || typeof input !== "string") return "";
  const trimmed = input.trim();

  // If it's a full <iframe>, extract the src
  const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (srcMatch && srcMatch[1]) {
    let url = srcMatch[1];
    if (url.startsWith("//")) url = `https:${url}`;
    return url;
  }

  // If it's a URL, extract the 11-char YouTube ID
  const idMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i);
  if (idMatch && idMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${idMatch[1]}?rel=0&modestbranding=1`;
  }

  // If it already looks like a direct URL
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return trimmed;
}

export function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function VideoCard({ video, compact = false }) {
  const [copied, setCopied] = useState(false);
  const embedUrl = useMemo(() => extractYoutubeEmbedUrl(video?.iframe), [video?.iframe]);

  const handleShare = async () => {
    try {
      const urlToCopy = embedUrl.replace("/embed/", "/watch?v=") || window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(urlToCopy);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = urlToCopy;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      toast.success("Video link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  if (!video) return null;

  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* 16:9 Aspect Video Container */}
      <div className="relative w-full aspect-video bg-slate-950 overflow-hidden shrink-0">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={video.title || "YouTube Video Lecture"}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2 p-4 text-center">
            <FaYoutube size={32} className="text-red-500/60" />
            <span className="text-xs font-mono">Invalid or missing video embed</span>
          </div>
        )}
      </div>

      {/* Video Content & Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Header row: Badge & Date */}
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-200/60 dark:border-red-800/40 text-[10.5px] font-bold tracking-wide uppercase">
              <FaYoutube size={13} className="text-red-600 dark:text-red-400" />
              <span>Video Lecture</span>
            </span>
            {video.createdAt && (
              <span className="flex items-center gap-1 text-[11px]">
                <Calendar size={12} />
                <span>{formatDate(video.createdAt)}</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-heading font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            {video.title}
          </h3>

          {/* Optional Description */}
          {video.description && !compact && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 font-normal">
              {video.description}
            </p>
          )}
        </div>

        {/* Action Toolbar */}
        <div className="pt-2 flex items-center justify-between gap-2 text-xs">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xs font-medium"
            title="Share video link"
          >
            {copied ? (
              <Check size={13} className="text-emerald-500" />
            ) : (
              <Share2 size={13} />
            )}
            <span>{copied ? "Copied" : "Share"}</span>
          </button>

          {embedUrl && (
            <a
              href={embedUrl.replace("/embed/", "/watch?v=")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold text-xs transition-colors"
            >
              <span>Watch on YouTube</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
