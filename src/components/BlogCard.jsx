"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Link } from "@/lib/navigation-adapter";
import { Clock, Eye } from "lucide-react";
import { LogoImg, getImageUrl } from "../assets/assets.js";

export function getSnippet(html, maxLength = 320) {
  if (!html) return "";
  const text = html
    .replace(/<wbr\s*\/?>/gi, "")
    .replace(/&shy;/gi, "")
    .replace(/[\u00AD\u200B\u200C\u200D\uFEFF]/g, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

export function formatDate(d) {
  if (!d) return "Recently";
  const dateObj = new Date(d);
  if (isNaN(dateObj.getTime())) return "Recently";
  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function calculateReadingStats(contentOrHtml, imagesCount = 0) {
  if (!contentOrHtml) {
    return { words: 0, images: 0, seconds: 60, minutes: 1, text: "1 min read" };
  }

  let rawText = "";
  let totalImages = typeof imagesCount === "number" ? imagesCount : 0;

  if (typeof contentOrHtml === "object" && contentOrHtml !== null) {
    rawText = [
      contentOrHtml.title || "",
      contentOrHtml.description || "",
      contentOrHtml.content || "",
    ].join(" ");
    if (Array.isArray(contentOrHtml.images)) {
      totalImages = contentOrHtml.images.length;
    } else if (contentOrHtml.image) {
      totalImages = 1;
    }
  } else if (typeof contentOrHtml === "string") {
    rawText = contentOrHtml;
    const inlineImgs = (rawText.match(/<img\b[^>]*>/gi) || []).length;
    totalImages += inlineImgs;
  }

  // 1. Remove script/style tags and their inner content
  const withoutScripts = rawText
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ");

  // 2. Decode standard HTML entities and clean HTML tags
  const cleanText = withoutScripts
    .replace(/<wbr\s*\/?>/gi, "")
    .replace(/&shy;/gi, "")
    .replace(/[\u00AD\u200B\u200C\u200D\uFEFF]/g, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;|&#x27;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  // 3. Extract words (matches English, Arabic, and all multilingual tokens)
  const words = cleanText.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;

  if (wordCount === 0 && totalImages === 0) {
    return { words: 0, images: 0, seconds: 60, minutes: 1, text: "1 min read" };
  }

  // Standard adult reading speed: 200 words per minute
  const wordSeconds = (wordCount / 200) * 60;

  let imageSeconds = 0;
  for (let i = 1; i <= totalImages; i++) {
    imageSeconds += Math.max(3, 13 - i);
  }

  const totalSeconds = Math.max(30, wordSeconds + imageSeconds);
  const minutes = Math.max(1, Math.ceil(totalSeconds / 60));

  return {
    words: wordCount,
    images: totalImages,
    seconds: Math.round(totalSeconds),
    minutes,
    text: `${minutes} min read`,
  };
}

export function getReadingTime(contentOrHtml, imagesCount = 0) {
  return calculateReadingStats(contentOrHtml, imagesCount).text;
}

export function getBlogImage(blog) {
  if (Array.isArray(blog?.images) && blog.images.length > 0 && blog.images[0]) {
    return getImageUrl(blog.images[0], null);
  }
  if (blog?.image) return getImageUrl(blog.image, null);
  return null;
}

export function getAuthorInfo(blog) {
  let name = "Al-Mukhtar Faculty";

  const isObjectId = (str) => typeof str === "string" && /^[0-9a-fA-F]{24}$/.test(str.trim());

  if (blog?.author) {
    if (typeof blog.author === "string") {
      if (!isObjectId(blog.author)) {
        name = blog.author;
      }
    } else if (typeof blog.author === "object") {
      if (blog.author.name && !isObjectId(blog.author.name)) {
        name = blog.author.name;
      } else if (blog.author.fullName && !isObjectId(blog.author.fullName)) {
        name = blog.author.fullName;
      } else if (blog.author.username && !isObjectId(blog.author.username)) {
        name = blog.author.username;
      }
    }
  } else if (blog?.authorName) {
    if (!isObjectId(blog.authorName)) {
      name = blog.authorName;
    }
  }

  const parts = name.trim().split(/\s+/);
  const initials = parts.length > 1
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase() || "AM";

  return { name, initials };
}

function BlogCard({ blog, onCategoryClick, layout = "grid" }) {
  const [imgError, setImgError] = useState(false);

  if (!blog) return null;

  const rawImage = getBlogImage(blog);
  const snippet =
    blog.description && blog.description.length > 150
      ? blog.description
      : getSnippet(blog.content || blog.description, layout === "list" ? 500 : 420);
  const readTime = getReadingTime(blog);
  const formattedDate = formatDate(blog.createdAt || blog.publishedAt);
  const blogUrl = `/blog/${blog.slug || blog._id}`;
  const category = blog.subject || blog.category || "General";
  const viewsCount = typeof blog.views === "number" ? blog.views : 0;
  const { name: authorName, initials: authorInitials } = getAuthorInfo(blog);

  const thumbnailSrc = !imgError && rawImage ? rawImage : LogoImg;
  const isFallbackLogo = imgError || !rawImage;

  /* ─────────────────────────────────────────────────────────────
     LIST VIEW (Matches 2-in-a-row list card style)
     - Image floats right (float-right) with compact height
     - Excerpt is standard block text (NO line-clamp) so it wraps directly underneath the image
     - No border, no shadow (clean solid flat look)
     ───────────────────────────────────────────────────────────── */
  if (layout === "list") {
    return (
      <article className="group w-full p-0.5 sm:p-1 bg-transparent font-sans transition-all">
        <div className="flow-root">
          {/* Float-Right Thumbnail Image */}
          <Link
            to={blogUrl}
            className="float-right ml-3 sm:ml-4 mb-2 relative w-28 h-20 sm:w-36 sm:h-24 md:w-44 md:h-28 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 block group/img shadow-2xs hover:shadow-xs transition-all"
          >
            <Image
              src={thumbnailSrc}
              alt={blog.title || "Blog article"}
              fill
              sizes="(max-width: 640px) 112px, (max-width: 1024px) 144px, 176px"
              className={`transition-transform duration-500 ease-out group-hover:scale-105 rounded-2xl ${
                isFallbackLogo
                  ? "object-contain p-3 opacity-75"
                  : "object-cover object-center"
              }`}
              onError={() => setImgError(true)}
              unoptimized
            />
          </Link>

          {/* 1. Date */}
          <div className="text-xs text-slate-500 dark:text-slate-400">
            <span>{formattedDate}</span>
          </div>

          {/* 2. Title */}
          <h2 className="mt-1 text-base sm:text-lg lg:text-[19px] font-bold font-heading text-slate-900 dark:text-white leading-snug tracking-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            <Link to={blogUrl} className="hover:underline">
              {blog.title}
            </Link>
          </h2>

          {/* 3. Excerpt (Standard flow: wraps around and underneath the floated image) */}
          {snippet && (
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {snippet}
            </p>
          )}

          {/* 4. Bottom Badges / Metadata */}
          <div className="mt-3 flex items-center flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
            <button
              type="button"
              onClick={(e) => {
                if (onCategoryClick) {
                  e.preventDefault();
                  e.stopPropagation();
                  onCategoryClick(category);
                }
              }}
              className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {category}
            </button>

            <span className="inline-flex items-center gap-1 text-[11px]">
              <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
              <span>{readTime}</span>
            </span>

            <span className="text-slate-400 dark:text-slate-600 select-none">·</span>

            <span className="inline-flex items-center gap-1 text-[11px]">
              <Eye className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
              <span>{viewsCount} views</span>
            </span>
          </div>
        </div>
      </article>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     GRID VIEW (Up to 3 cards per row)
     - Top: Full rounded image (rounded-2xl)
     - Category label (uppercase tracking-wider)
     - Title (bold prominent font)
     - Meta Row: Date • Views • Read time
     - Excerpt (up to 4 lines)
     ───────────────────────────────────────────────────────────── */
  return (
    <article className="w-full bg-transparent font-sans">
      <div className="group block w-full text-left">
        {/* Top Rounded Thumbnail Image with sleek 16:9 aspect ratio */}
        <Link to={blogUrl} className="block overflow-hidden rounded-2xl">
          <div className="relative aspect-[16/9] sm:aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 shadow-xs group-hover:shadow-md transition-all">
            <Image
              src={thumbnailSrc}
              alt={blog.title || "Blog article"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`transition-transform duration-500 ease-out group-hover:scale-105 rounded-2xl ${
                isFallbackLogo
                  ? "object-contain p-5 opacity-75"
                  : "object-cover object-center"
              }`}
              onError={() => setImgError(true)}
              unoptimized
            />
          </div>
        </Link>

        {/* Category Label */}
        <div className="mt-3">
          <button
            type="button"
            onClick={(e) => {
              if (onCategoryClick) {
                e.preventDefault();
                e.stopPropagation();
                onCategoryClick(category);
              }
            }}
            className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer inline-block"
          >
            {category}
          </button>
        </div>

        {/* Title */}
        <h2 className="mt-1 text-base sm:text-lg lg:text-[19px] font-bold font-heading text-slate-900 dark:text-white leading-snug tracking-tight line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
          <Link to={blogUrl} className="hover:underline">
            {blog.title}
          </Link>
        </h2>

        {/* Metadata Row: Date • Views • Read Time */}
        <div className="mt-1.5 flex items-center flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400 font-normal">
          <span>{formattedDate}</span>
          <span className="text-slate-300 dark:text-slate-600 select-none">•</span>
          <span className="inline-flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span>{viewsCount} views</span>
          </span>
          <span className="text-slate-300 dark:text-slate-600 select-none">•</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span>{readTime}</span>
          </span>
        </div>

        {/* Excerpt (up to 4 lines) */}
        {snippet && (
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4 font-normal">
            {snippet}
          </p>
        )}
      </div>
    </article>
  );
}

export default BlogCard;
