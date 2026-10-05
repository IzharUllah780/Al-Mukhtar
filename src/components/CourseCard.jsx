"use client";

import React from "react";
import { Link } from "@/lib/navigation-adapter";
import { Clock, Users, ArrowRight, Eye } from "lucide-react";
import { LogoImg, getImageUrl } from "../assets/assets.js";

function CourseCard({ course }) {
  if (!course) return null;

  const enrolledCount = course.applicationCount || course.students || 0;
  const imageSrc = getImageUrl(course.image, null);
  const courseLink = `/courses/${encodeURIComponent(course.slug || course._id)}`;

  return (
    <article className="group bg-white dark:bg-slate-900 rounded-lg border border-slate-200/90 dark:border-slate-800 hover:border-teal-500/60 dark:hover:border-teal-400/60 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden font-sans w-full">
      {/* Image Section - Big and Prominent, completely unrounded */}
      <Link to={courseLink} className="relative w-full h-44 sm:h-48 md:h-52 overflow-hidden bg-slate-100 dark:bg-slate-800 block shrink-0 rounded-lg">
        {imageSrc ? (
          <img
            src={imageSrc}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = LogoImg;
              e.currentTarget.className = "max-h-20 max-w-[80%] object-contain m-auto drop-shadow-xs rounded-lg";
            }}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-lg"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-slate-100 dark:from-slate-800 via-teal-50/30 dark:via-slate-800/60 to-slate-50 dark:to-slate-900 flex items-center justify-center p-4 rounded-lg">
            <img
              src={LogoImg}
              alt="Al-Mukhtar Institute"
              className="max-h-20 max-w-[80%] object-contain drop-shadow-xs group-hover:scale-105 transition-transform duration-300 rounded-lg"
              loading="lazy"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity pointer-events-none" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="bg-slate-900/95 backdrop-blur-md text-teal-300 text-[10px] font-bold px-2.5 py-1 rounded-none shadow-xs font-mono uppercase tracking-wider border border-teal-500/30">
            {course.level || "Certificate"}
          </span>
          <span className="bg-slate-900/95 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-none font-mono flex items-center gap-1 border border-white/15">
            <Users size={11} className="text-teal-400" />
            {enrolledCount}
          </span>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2 min-w-0">
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              {course.duration || "Structured"}
            </span>
            <span>•</span>
            <span className="text-teal-600 dark:text-teal-400 font-semibold uppercase tracking-wider text-[10px]">
              Al-Mukhtar
            </span>
          </div>

          <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors leading-snug line-clamp-2">
            <Link to={courseLink}>{course.title}</Link>
          </h3>

          {course.description && (
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 font-normal">
              {course.description}
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            Open for Enrollment
          </span>

          <Link
            to={courseLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-600 hover:text-white dark:hover:bg-teal-600 text-teal-700 dark:text-teal-300 text-xs font-bold transition-all shrink-0 border border-teal-200/60 dark:border-teal-800/60 shadow-2xs hover:shadow-xs"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default CourseCard;
