"use client";

import React, { useState, useMemo } from "react";
import { Link } from "@/lib/navigation-adapter";
import { useVideos } from "@/lib/queries";
import VideoCard from "@/components/VideoCard.jsx";
import ApiErrorState from "@/components/ApiErrorState.jsx";
import {
  Search,
  ArrowLeft,
  Sparkles,
  BookOpen,
  GraduationCap,
  Play,
  Tv,
} from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import { GreenDecorationBg } from "@/assets/assets.js";

function Videos() {
  const [search, setSearch] = useState("");
  const { data: videos = [], isLoading, isError, refetch, isFetching } = useVideos();

  const filteredVideos = useMemo(() => {
    if (!search.trim()) return videos;
    const q = search.toLowerCase();
    return videos.filter(
      (v) =>
        v.title?.toLowerCase().includes(q) ||
        v.description?.toLowerCase().includes(q)
    );
  }, [videos, search]);

  return (
    <div className="bg-white dark:bg-slate-950 font-sans text-slate-850 dark:text-slate-100 min-h-screen transition-colors duration-200">
      {/* Hero Header Section */}
      <section className="relative text-white overflow-hidden border-b border-teal-900/30">
        <div className="absolute inset-0 z-0">
          <img
            src={GreenDecorationBg}
            alt="Al-Mukhtar Video Library"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-slate-950/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-6 sm:pt-10 pb-10 sm:pb-14">
          {/* Breadcrumb row */}
          <div className="mb-4 sm:mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all font-mono uppercase tracking-wider"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </div>

          <div className="max-w-3xl space-y-3 sm:space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/70 border border-red-500/40 text-red-300 text-[10.5px] sm:text-[11px] font-bold font-mono tracking-wider uppercase backdrop-blur-md">
                <FaYoutube size={13} className="text-red-400" />
                <span>Video Lectures &amp; Media</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/20 text-slate-200 text-[10.5px] sm:text-[11px] font-semibold font-mono tracking-wider backdrop-blur-md">
                <Play size={12} className="text-teal-300" />
                <span>{videos.length} Lectures</span>
              </span>
            </div>

            <h1 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
              Scholarly Lectures &amp; Video Library
            </h1>

            <p className="text-slate-200 text-xs sm:text-sm sm:text-base leading-relaxed font-normal max-w-2xl">
              Watch authentic Islamic lectures, Dars-e-Nizami lessons, Tajweed tutorials, and special scholarly discourses delivered by resident faculty at Al-Mukhtar Institute.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-8 sm:py-12 space-y-6 sm:space-y-8">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="relative w-full sm:w-96">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />
            <input
              type="text"
              placeholder="Search lectures by title or topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[#0D9488] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0D9488]/15 transition-all shadow-2xs"
            />
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-2 self-start sm:self-auto">
            <span>Showing</span>
            <strong className="text-slate-900 dark:text-white font-bold">{filteredVideos.length}</strong>
            <span>of {videos.length} videos</span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden p-4 space-y-4 animate-pulse shadow-xs"
              >
                <div className="w-full aspect-video bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <ApiErrorState
            title="Unable to load video lectures"
            message="Could not retrieve the video catalog from the server. Check your network connection and click refresh."
            onRetry={refetch}
            isRetrying={isFetching}
          />
        )}

        {/* Empty State */}
        {!isLoading && !isError && filteredVideos.length === 0 && (
          <div className="text-center py-12 sm:py-16 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-lg mx-auto space-y-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 flex items-center justify-center text-red-600 dark:text-red-400 mx-auto shadow-xs">
              <FaYoutube size={28} />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                No Video Lectures Found
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {search
                  ? `No video matches the search term "${search}". Try searching with different keywords.`
                  : "Video lectures will be uploaded here shortly. Please check back soon."}
              </p>
            </div>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        )}

        {/* Video Grid */}
        {!isLoading && !isError && filteredVideos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredVideos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Videos;
