"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Eye } from "lucide-react";

export default function BlogCard({ post }) {
  const [imgError, setImgError] = useState(false);

  if (!post) return null;

  const {
    slug = "",
    title = "",
    excerpt = "",
    coverImage = "",
    category = "General",
    date = "Recently",
    views = 0,
    readTime = "1 min read",
  } = post;

  const blogHref = slug ? `/blog/${slug}` : "#";
  const imageSrc = !imgError && coverImage ? coverImage : "/assets/example1.png";

  return (
    <article className="w-full font-sans">
      <Link
        href={blogHref}
        className="group block w-full text-left select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded-2xl transition-all"
      >
        {/* Top: Cover image with modern 16:9 aspect ratio for balanced height */}
        <div className="relative aspect-[16/9] sm:aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 shadow-xs group-hover:shadow-md transition-shadow">
          <Image
            src={imageSrc}
            alt={title || "Blog cover image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center w-full h-full transition-transform duration-500 ease-out group-hover:scale-105 rounded-2xl"
            onError={() => setImgError(true)}
            unoptimized
          />
        </div>

        {/* 1. Category label: small, uppercase, monospace */}
        <div className="mt-3">
          <span className="font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            {category}
          </span>
        </div>

        {/* 2. Title: bold, sleek proportional font size, clamped to 2 lines */}
        <h2 className="mt-1 text-base sm:text-lg lg:text-[19px] font-bold font-heading text-slate-900 dark:text-white leading-snug tracking-tight line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
          {title}
        </h2>

        {/* 3. Meta row: date • eye icon + views • clock icon + read time */}
        <div className="mt-1.5 flex items-center flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400 font-normal">
          <span>{date}</span>
          <span className="text-slate-300 dark:text-slate-600 select-none">•</span>
          <span className="inline-flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span>{views} views</span>
          </span>
          <span className="text-slate-300 dark:text-slate-600 select-none">•</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span>{readTime}</span>
          </span>
        </div>

        {/* 4. Excerpt: muted gray, clamped to 4 lines */}
        {excerpt && (
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4 font-normal">
            {excerpt}
          </p>
        )}
      </Link>
    </article>
  );
}
