"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Link } from "@/lib/navigation-adapter";
import { Clock, Users, ArrowRight } from "lucide-react";
import { LogoImg, getImageUrl } from "../assets/assets.js";

function CourseCard({ course }) {
  const [imgError, setImgError] = useState(false);

  if (!course) return null;

  const enrolledCount = course.applicationCount || course.students || 0;
  const rawImage = getImageUrl(course.image, null);
  const thumbnailSrc = !imgError && rawImage ? rawImage : LogoImg;
  const isFallbackLogo = imgError || !rawImage;
  const courseLink = `/courses/${encodeURIComponent(course.slug || course._id)}`;
  const applyLink = `/apply?course=${encodeURIComponent(course.title)}`;
  const levelLabel = course.level ? `${course.level} Level` : "Certificate";
  const durationLabel = course.duration || "Self-Paced";

  return (
    <article className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 hover:border-teal-500/50 dark:hover:border-teal-400/50 hover:shadow-md transition-all duration-300 flex flex-col h-full overflow-hidden font-sans w-full">
      {/* Clickable Image & Header Section */}
      <Link to={courseLink} className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 block">
        <Image
          src={thumbnailSrc}
          alt={course.title || "Course program"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`transition-transform duration-500 ease-out group-hover:scale-105 ${
            isFallbackLogo
              ? "object-contain p-4 opacity-75"
              : "object-cover object-center"
          }`}
          onError={() => setImgError(true)}
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-50 group-hover:opacity-30 transition-opacity" />

        {/* Floating Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-sm text-teal-300 text-[10.5px] font-bold uppercase tracking-wider border border-white/10 shadow-xs">
            {levelLabel}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-sm text-slate-200 text-[10.5px] font-medium flex items-center gap-1 border border-white/10 shadow-xs">
            <Users size={11} className="text-teal-400" />
            <span>{enrolledCount}</span>
          </span>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Category / Subtitle */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span className="text-teal-600 dark:text-teal-400 font-semibold uppercase tracking-wider">
              Al-Mukhtar Curriculum
            </span>
          </div>

          {/* Course Title Link */}
          <h3 className="text-sm sm:text-[15px] font-bold font-heading text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            <Link to={courseLink} className="hover:underline">
              {course.title}
            </Link>
          </h3>

          {/* Short Description */}
          {course.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 font-normal">
              {course.description}
            </p>
          )}

          {/* Duration Metadata */}
          <div className="pt-1.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="inline-flex items-center gap-1">
              <Clock size={13} className="text-teal-600 dark:text-teal-400 shrink-0" />
              <span>{durationLabel}</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              Open Admissions
            </span>
          </div>
        </div>

        {/* 2 Action Buttons in a Single Row */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <Link
            to={courseLink}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all text-center border border-slate-200/80 dark:border-slate-700 active:scale-95 shadow-2xs"
          >
            <span>Details</span>
            <ArrowRight size={12} className="shrink-0 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
          </Link>
          <Link
            to={applyLink}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs hover:shadow-sm text-center active:scale-95"
          >
            <span>Apply Now</span>
            <ArrowRight size={12} className="shrink-0" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default CourseCard;
