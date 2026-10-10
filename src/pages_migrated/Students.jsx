"use client";

import React, { useState } from "react";
import { Link } from "@/lib/navigation-adapter";
import {
  GraduationCap,
  Award,
  Globe,
  Building2,
  MapPin,
  ArrowRight,
  ChevronRight,
  X,
  CheckCircle2,
  User,
  Quote,
} from "lucide-react";
import { useStudents } from "@/lib/queries";
import { bg, getImageUrl } from "../assets/assets.js";

function Students() {
  const { data: apiStudents = [], isLoading } = useStudents();
  const activeStudents = apiStudents.filter((s) => s.status !== "inactive");
  const [activeModalStudent, setActiveModalStudent] = useState(null);

  return (
    <div className="bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200 min-h-screen">

      {/* ── 1. HERO SECTION ── */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-6 sm:py-8 border-b border-slate-800/80">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={bg}
            alt="Alumni Background"
            className="w-full h-full object-cover object-center opacity-60 sm:opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-950/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-slate-950/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 text-left space-y-2.5">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white font-heading tracking-tight max-w-2xl leading-snug">
            Where Our Graduates Stand Today
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-normal">
            Our graduates carry the knowledge, values, and scholarship developed at Jamia Al-Mukhtar to communities around the world. Discover the scholars, educators, and leaders shaping society.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 max-w-lg pt-2.5 border-t border-white/10 text-left">
            <div className="p-2.5 sm:p-3 rounded-lg bg-slate-900/80 border border-white/10 backdrop-blur-md">
              <span className="text-base sm:text-lg font-bold text-white font-heading block">
                100+
              </span>
              <span className="text-[10px] text-teal-300 uppercase tracking-wider font-mono font-semibold">
                Alumni Network
              </span>
            </div>
            <div className="p-2.5 sm:p-3 rounded-lg bg-slate-900/80 border border-white/10 backdrop-blur-md">
              <span className="text-base sm:text-lg font-bold text-teal-300 font-heading block">
                100%
              </span>
              <span className="text-[10px] text-slate-300 uppercase tracking-wider font-mono font-semibold">
                Verified Sanad
              </span>
            </div>
            <div className="p-2.5 sm:p-3 rounded-lg bg-slate-900/80 border border-white/10 backdrop-blur-md col-span-2 sm:col-span-1">
              <span className="text-base sm:text-lg font-bold text-emerald-400 font-heading block">
                Global
              </span>
              <span className="text-[10px] text-slate-300 uppercase tracking-wider font-mono font-semibold">
                Active Placement
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. ALUMNI DIRECTORY SECTION ── */}
      <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 space-y-6">

        {/* Section Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4 text-left">
          <div className="space-y-1">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider font-mono bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/60">
              Directory
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-heading tracking-tight mt-1">
              Graduate Profiles
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Explore the academic and professional achievements of our alumni.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shrink-0 self-start sm:self-auto">
            Total Profiles: <strong className="text-teal-700 dark:text-teal-400 font-semibold">{activeStudents.length}</strong>
          </div>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 animate-pulse"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                  </div>
                </div>
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && activeStudents.length === 0 && (
          <div className="py-16 text-center space-y-3 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl max-w-md mx-auto p-6">
            <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
              <GraduationCap size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 font-heading">
              No Graduate Profiles Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Graduate records are currently being updated.
            </p>
          </div>
        )}

        {/* ── PROFESSIONAL CLEAN ALUMNI CARDS ── */}
        {!isLoading && activeStudents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {activeStudents.map((student, i) => {
              const avatarSrc = getImageUrl(
                student.image,
                `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || "Student")}&background=0D9488&color=fff&bold=true`
              );

              return (
                <div
                  key={student._id || student.id || `alum-${i}`}
                  onClick={() => setActiveModalStudent(student)}
                  className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 rounded-2xl shadow-xs hover:shadow-lg hover:border-teal-500/60 dark:hover:border-teal-400/50 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer text-left"
                >
                  {/* Top Bar */}
                  <div className="p-5 pb-4 space-y-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Avatar, Name and Status */}
                      <div className="flex items-start gap-3.5">
                        <div className="relative w-14 h-14 shrink-0 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-teal-500 transition-all">
                          <img
                            src={avatarSrc}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || "Student")}&background=0D9488&color=fff&bold=true`;
                            }}
                            alt={student.name}
                            className="w-full h-full object-cover object-top rounded-full"
                            loading="lazy"
                          />
                        </div>

                        <div className="min-w-0 flex-1 space-y-0.5">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate">
                            {student.name}
                          </h3>

                          <p className="text-xs font-semibold text-teal-700 dark:text-teal-400 truncate">
                            {student.currentRole || "Graduate Scholar"}
                          </p>

                          <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold pt-0.5">
                            <CheckCircle2 size={12} className="shrink-0" />
                            <span>Verified Sanad</span>
                          </div>
                        </div>
                      </div>

                      {/* Details list */}
                      <div className="space-y-1.5 text-xs pt-3.5 mt-3.5 border-t border-slate-100 dark:border-slate-800/80">
                        {student.currentOrganization && (
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <Building2 size={13} className="text-slate-400 dark:text-slate-500 shrink-0" />
                            <span className="truncate">{student.currentOrganization}</span>
                          </div>
                        )}

                        {student.program && (
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <GraduationCap size={13} className="text-slate-400 dark:text-slate-500 shrink-0" />
                            <span className="truncate">{student.program}</span>
                          </div>
                        )}

                        {student.location && (
                          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
                            <MapPin size={12} className="text-slate-400 dark:text-slate-500 shrink-0" />
                            <span className="truncate">{student.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Milestone Snippet */}
                    {student.keyAchievement && (
                      <div className="mt-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Milestone: </span>
                        {student.keyAchievement}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Row */}
                  <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold font-mono uppercase tracking-wider">
                        {student.category || "Alumnus"}
                      </span>
                      {student.batchYear && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-mono">
                          {student.batchYear}
                        </span>
                      )}
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 dark:text-teal-400 group-hover:translate-x-0.5 transition-transform">
                      <span>View Bio</span>
                      <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── 3. GRADUATE PROFILE POPUP MODAL (Clean, Simple & Professional Layout) ── */}
      {activeModalStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
          onClick={() => setActiveModalStudent(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 font-sans text-left relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider font-mono text-teal-700 dark:text-teal-300">
                  Graduate Profile
                </span>
                {activeModalStudent.batchYear && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    • {activeModalStudent.batchYear}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setActiveModalStudent(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body: Clean Professional Resume/Profile Layout (No messy cards) */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 custom-scrollbar text-sm">
              
              {/* Profile Identity */}
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 ring-2 ring-teal-500/30 shrink-0">
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

                <div className="min-w-0 flex-1 space-y-1">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading">
                    {activeModalStudent.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-teal-700 dark:text-teal-400">
                    {activeModalStudent.currentRole || "Graduate Scholar"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {activeModalStudent.program || "Islamic Sciences"}
                  </p>
                </div>
              </div>

              {/* Information Rows (Clean Structured Format) */}
              <div className="space-y-3 py-1">
                {activeModalStudent.currentOrganization && (
                  <div className="flex items-start justify-between gap-4 py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 shrink-0">
                      <Building2 size={14} className="text-teal-600 dark:text-teal-400" />
                      Organization
                    </span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 text-right">
                      {activeModalStudent.currentOrganization}
                    </span>
                  </div>
                )}

                {activeModalStudent.location && (
                  <div className="flex items-start justify-between gap-4 py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 shrink-0">
                      <MapPin size={14} className="text-teal-600 dark:text-teal-400" />
                      Location
                    </span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 text-right">
                      {activeModalStudent.location}
                    </span>
                  </div>
                )}

                {activeModalStudent.program && (
                  <div className="flex items-start justify-between gap-4 py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 shrink-0">
                      <GraduationCap size={14} className="text-teal-600 dark:text-teal-400" />
                      Program
                    </span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 text-right">
                      {activeModalStudent.program}
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-4 py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 shrink-0">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    Sanad Status
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 text-right">
                    Verified Alumnus
                  </span>
                </div>
              </div>

              {/* Key Milestone */}
              {activeModalStudent.keyAchievement && (
                <div className="space-y-1.5 pt-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Award size={14} className="text-teal-600 dark:text-teal-400" />
                    Key Milestone &amp; Achievement
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    {activeModalStudent.keyAchievement}
                  </p>
                </div>
              )}

              {/* Reflection Quote */}
              {activeModalStudent.message && (
                <div className="space-y-1.5 pt-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Quote size={13} className="text-teal-600 dark:text-teal-400" />
                    Graduate Reflection
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-2 border-teal-500 pl-3 py-1">
                    &ldquo;{activeModalStudent.message}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 px-5 py-3 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 shrink-0">
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
    </div>
  );
}

export default Students;
