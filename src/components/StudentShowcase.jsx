"use client";

import React, { useState } from "react";
import { Link } from "@/lib/navigation-adapter";
import { getImageUrl } from "../assets/assets.js";
import {
  GraduationCap,
  Briefcase,
  MapPin,
  Building2,
  Award,
  ArrowRight,
  Quote,
  Sparkles,
  ChevronRight,
  X,
} from "lucide-react";

import { useStudents } from "@/lib/queries";

export default function StudentShowcase({ limit, showHeaderAction = false }) {
  const { data: apiStudents = [] } = useStudents();
  const activeStudents = apiStudents.filter((s) => s.status !== "inactive");
  const displayStudents = typeof limit === "number" ? activeStudents.slice(0, limit) : activeStudents;
  const [activeModalStudent, setActiveModalStudent] = useState(null);

  if (activeStudents.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 transition-colors font-sans">
      <div className="max-w-7xl mx-auto px-3 sm:px-10 lg:px-16 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-left">
          <div className="space-y-1">
            <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Where Our Graduates Stand Today
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Our alumni serve as scholars, teachers, researchers, and community leaders.
            </p>
          </div>

          {showHeaderAction && (
            <Link
              to="/students"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-teal-600 dark:text-teal-400 hover:underline shrink-0"
            >
              <span>View all alumni ({activeStudents.length})</span>
              <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {/* Clean, Streamlined Graduate List (Mobile-First Responsive Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 text-left">
          {displayStudents.map((student, idx) => (
            <div
              key={student._id || student.id || `alum-${idx}`}
              onClick={() => setActiveModalStudent(student)}
              className="group flex items-start gap-4 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-teal-500/50 dark:hover:border-teal-400/50 hover:shadow-xs transition-all cursor-pointer"
            >
              {/* Circular Avatar */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-teal-500 transition-all">
                <img
                  src={getImageUrl(
                    student.image,
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || "Student")}&background=0D9488&color=fff&bold=true`
                  )}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || "Student")}&background=0D9488&color=fff&bold=true`;
                  }}
                  alt={student.name}
                  className="w-full h-full object-cover object-top rounded-full"
                />
              </div>

              {/* Information */}
              <div className="min-w-0 flex-1 space-y-1">
                <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {student.name}
                </h3>
                <p className="text-xs font-semibold text-teal-700 dark:text-teal-400 truncate">
                  {student.currentRole || "Graduate Scholar"}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {student.currentOrganization ? `${student.currentOrganization}` : student.location || "Al-Mukhtar Alumnus"}
                  {student.batchYear ? ` • Class '${String(student.batchYear).slice(-2)}` : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clean, Simple Mobile-Friendly Details Modal */}
      {activeModalStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setActiveModalStudent(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden p-6 text-center space-y-4 animate-in zoom-in-95 duration-150 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModalStudent(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Profile Avatar */}
            <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 ring-4 ring-teal-500/20 shadow-md">
              <img
                src={getImageUrl(
                  activeModalStudent.image,
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(activeModalStudent.name || "Student")}&background=0D9488&color=fff&bold=true`
                )}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activeModalStudent.name || "Student")}&background=0D9488&color=fff&bold=true`;
                }}
                alt={activeModalStudent.name}
                className="w-full h-full rounded-full object-cover object-top"
              />
            </div>

            {/* Header Text */}
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading">
                {activeModalStudent.name}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-teal-700 dark:text-teal-400">
                {activeModalStudent.currentRole || "Graduate Scholar"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activeModalStudent.program || "Islamic Sciences"} {activeModalStudent.batchYear ? `• Class of ${activeModalStudent.batchYear}` : ""}
              </p>
            </div>

            {/* Placement Details */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1.5 text-left">
              {activeModalStudent.currentOrganization && (
                <p className="flex items-center gap-2">
                  <Building2 size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
                  <span className="font-medium text-slate-900 dark:text-white">{activeModalStudent.currentOrganization}</span>
                </p>
              )}
              {activeModalStudent.location && (
                <p className="flex items-center gap-2">
                  <MapPin size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>{activeModalStudent.location}</span>
                </p>
              )}
              {activeModalStudent.keyAchievement && (
                <p className="flex items-start gap-2 pt-1 text-slate-700 dark:text-slate-300">
                  <Award size={14} className="text-amber-500 shrink-0 mt-0.5" />
                  <span>{activeModalStudent.keyAchievement}</span>
                </p>
              )}
            </div>

            {/* Quote / Reflection if available */}
            {activeModalStudent.message && (
              <blockquote className="text-xs text-slate-600 dark:text-slate-300 italic border-l-2 border-teal-600 pl-3 py-0.5 text-left">
                &ldquo;{activeModalStudent.message}&rdquo;
              </blockquote>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setActiveModalStudent(null)}
                className="w-full py-2 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
              <Link
                to="/apply"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-all text-center"
              >
                <span>Apply Now</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
