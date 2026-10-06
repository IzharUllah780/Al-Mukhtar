"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Eye } from "lucide-react";

export default function BlogListCard({ post }) {
  const [imgError, setImgError] = useState(false);

  if (!post) return null;

  const {
    slug = "",
    title = "",
    excerpt = "",
    coverImage = "",
    category = "General",
    author = { name: "Al-Mukhtar Faculty" },
    date = "Recently",
    views = 0,
    readTime = "1 min read",
  } = post;

  let authorName = "Al-Mukhtar Faculty";
  const isObjectId = (str) => typeof str === "string" && /^[0-9a-fA-F]{24}$/.test(str.trim());
  if (author) {
    if (typeof author === "string" && !isObjectId(author)) authorName = author;
    else if (author?.name && !isObjectId(author.name)) authorName = author.name;
    else if (author?.fullName && !isObjectId(author.fullName)) authorName = author.fullName;
  }
  const authorParts = authorName.trim().split(/\s+/);
  const authorInitials =
    authorParts.length > 1
      ? (authorParts[0][0] + authorParts[1][0]).toUpperCase()
      : authorName.slice(0, 2).toUpperCase() || "AM";

  const blogHref = slug ? `/blog/${slug}` : "#";
  const imageSrc = !imgError && coverImage ? coverImage : "/assets/example2.png";

  return (
    <article className="w-full h-full font-sans bg-white dark:bg-slate-900/90 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:shadow-md transition-all flex flex-col justify-between">
      <Link
        href={blogHref}
        className="group flex flex-col-reverse sm:flex-row sm:items-start sm:justify-between gap-3.5 sm:gap-4.5 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded-2xl transition-all h-full justify-between"
      >
        {/* Left: Text Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
          <div>
            {/* Top row: circular avatar with author initials, author name in semibold, dot, date in light gray */}
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 text-[10px] sm:text-[11px] font-bold flex items-center justify-center shrink-0 uppercase font-mono">
                {authorInitials}
              </div>
              <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[140px] sm:max-w-[200px]">
                {authorName}
              </span>
              <span className="text-slate-400 dark:text-slate-600 select-none">·</span>
              <span className="text-slate-500 dark:text-slate-400 text-xs">{date}</span>
            </div>

            {/* Title: bold, large, near-black, clamped to 2 lines */}
            <h2 className="mt-1.5 text-base sm:text-lg font-bold font-heading text-slate-900 dark:text-white leading-snug tracking-tight line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              {title}
            </h2>

            {/* Excerpt: gray, clamped to 4 lines with ellipsis */}
            {excerpt && (
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4 font-normal">
                {excerpt}
              </p>
            )}
          </div>

          {/* Bottom row: category pill, clock icon + read time, dot, eye icon + views */}
          <div className="mt-3 flex items-center flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
              {category}
            </span>

            <span className="inline-flex items-center gap-1 text-[11px]">
              <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
              <span>{readTime}</span>
            </span>

            <span className="text-slate-400 dark:text-slate-600 select-none">·</span>

            <span className="inline-flex items-center gap-1 text-[11px]">
              <Eye className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
              <span>{views} views</span>
            </span>
          </div>
        </div>

        {/* Right side: rounded-2xl thumbnail (Hidden on mobile) */}
        <div className="hidden sm:block relative w-24 h-20 sm:w-28 sm:h-24 md:w-32 md:h-24 shrink-0 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-800 shadow-xs group-hover:shadow-md transition-all">
          <Image
            src={imageSrc}
            alt={title || "Blog thumbnail"}
            fill
            sizes="(max-width: 640px) 96px, 128px"
            className="object-cover object-center w-full h-full transition-transform duration-500 ease-out group-hover:scale-105 rounded-2xl"
            onError={() => setImgError(true)}
            unoptimized
          />
        </div>
      </Link>
    </article>
  );
}
