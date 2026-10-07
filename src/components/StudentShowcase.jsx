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
  CheckCircle2,
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

      {/* Clean, Wide, Screen-Constrained Details Modal */}
      {activeModalStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150"
          onClick={() => setActiveModalStudent(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl sm:max-w-3xl w-full max-h-[90vh] sm:max-h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 font-sans text-left relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header Bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider font-mono bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/60">
                  {activeModalStudent.category || "Alumni Profile"}
                </span>
                {activeModalStudent.batchYear && (
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Class of {activeModalStudent.batchYear}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setActiveModalStudent(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 custom-scrollbar">
              {/* Profile Top Row */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                {/* Profile Avatar */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 ring-4 ring-teal-500/20 shadow-sm shrink-0">
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

                {/* Identity info */}
                <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading truncate">
                    {activeModalStudent.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-teal-700 dark:text-teal-400 truncate">
                    {activeModalStudent.currentRole || "Graduate Scholar"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {activeModalStudent.program || "Islamic Sciences"}
                    {activeModalStudent.batchYear ? ` • Class of ${activeModalStudent.batchYear}` : ""}
                  </p>
                </div>
              </div>

              {/* Placement Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
                {activeModalStudent.currentOrganization && (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-0.5">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-[11px]">
                      <Building2 size={13} className="text-teal-600 dark:text-teal-400 shrink-0" />
                      Organization
                    </span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {activeModalStudent.currentOrganization}
                    </p>
                  </div>
                )}

                {activeModalStudent.location && (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-0.5">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-[11px]">
                      <MapPin size={13} className="text-teal-600 dark:text-teal-400 shrink-0" />
                      Location
                    </span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {activeModalStudent.location}
                    </p>
                  </div>
                )}

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-0.5">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-[11px]">
                    <GraduationCap size={13} className="text-teal-600 dark:text-teal-400 shrink-0" />
                    Program
                  </span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {activeModalStudent.program || "Dars-e-Nizami & Islamic Sciences"}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-0.5">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-[11px]">
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                    Sanad Status
                  </span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 truncate">
                    Verified Alumnus
                  </p>
                </div>
              </div>

              {/* Key Achievement */}
              {activeModalStudent.keyAchievement && (
                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1">
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
                    <Award size={13} className="text-amber-500 shrink-0" />
                    Key Milestone &amp; Achievement
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                    {activeModalStudent.keyAchievement}
                  </p>
                </div>
              )}

              {/* Quote / Reflection if available */}
              {activeModalStudent.message && (
                <div className="pl-3.5 border-l-2 border-teal-600 dark:border-teal-400 py-1 space-y-1">
                  <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase font-mono tracking-wider block">
                    Graduate Reflection
                  </span>
                  <blockquote className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed font-normal">
                    &ldquo;{activeModalStudent.message}&rdquo;
                  </blockquote>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 shrink-0">
              <button
                type="button"
                onClick={() => setActiveModalStudent(null)}
                className="py-2 px-4 rounded-lg bg-slate-200/70 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
              <Link
                to="/apply"
                className="inline-flex items-center justify-center gap-1.5 py-2 px-5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all text-center shadow-xs"
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
