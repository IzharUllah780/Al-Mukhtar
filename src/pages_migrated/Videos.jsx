"use client";

import React, { useState, useMemo } from "react";
import { Link } from "@/lib/navigation-adapter";
import { useVideos } from "@/lib/queries";
import VideoCard from "@/components/VideoCard.jsx";
import ApiErrorState from "@/components/ApiErrorState.jsx";
import { Search, ArrowLeft, Play } from "lucide-react";
import { FaYoutube } from "react-icons/fa";

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
    <div className="bg-white dark:bg-[#070d18] font-sans text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-10 lg:px-16 py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* Simple & Professional Hero Header */}
        <header className="space-y-3 sm:space-y-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-teal-600 dark:text-teal-400 font-bold">Video Lectures</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black dark:text-white font-heading tracking-tight">
                Video Lectures
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Authentic Islamic lectures, lessons, and scholarly discourses delivered by resident faculty.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80 shrink-0">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              />
              <input
                type="text"
                placeholder="Search lectures..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-teal-600 dark:focus:border-teal-400 transition-colors shadow-2xs"
              />
            </div>
          </div>
        </header>

        {/* Video Count Tag */}
        {videos.length > 0 && !isLoading && (
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>
              Showing <strong className="text-slate-900 dark:text-white font-bold">{filteredVideos.length}</strong> of {videos.length} videos
            </span>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden p-4 space-y-4 animate-pulse"
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
          <div className="text-center py-12 sm:py-16 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200/60 dark:border-red-800/40 flex items-center justify-center text-red-600 dark:text-red-400 mx-auto">
              <FaYoutube size={24} />
            </div>
            <div className="space-y-1">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
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

