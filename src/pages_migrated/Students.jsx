"use client";

import React, { useState } from "react";
import { Link } from "@/lib/navigation-adapter";
import {
  GraduationCap,
  Award,
  Globe,
  Building2,
  MapPin,
  Sparkles,
  ArrowRight,
  ChevronRight,
  X,
  CheckCircle2,
} from "lucide-react";
import { useStudents } from "@/lib/queries";
import { bg, getImageUrl } from "../assets/assets.js";

function Students() {
  const { data: apiStudents = [], isLoading } = useStudents();
  const activeStudents = apiStudents.filter((s) => s.status !== "inactive");

  const [activeModalStudent, setActiveModalStudent] = useState(null);

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200 min-h-screen">

      {/* ── 1. HERO SECTION: GLOBAL ALUMNI DIRECTORY ── */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-12 sm:py-16 border-b border-slate-800/80">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={bg}
            alt="Alumni Background"
            className="w-full h-full object-cover object-center opacity-70 sm:opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-slate-950/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 text-left space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 backdrop-blur-md text-teal-300 text-[11px] font-bold uppercase tracking-wider font-mono border border-teal-500/20">
            <Globe size={12} className="text-teal-400" />
            <span>Alumni &amp; Global Impact</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-heading tracking-tight max-w-2xl">
            Where Our Graduates Stand Today
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed font-normal">
            Our graduates carry the knowledge, values, and character they developed at Al-Mukhtar into communities around the world. Today, they serve as scholars, educators, professionals, and community leaders, making meaningful contributions in their respective fields while continuing the legacy of knowledge and service.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl pt-3 border-t border-white/15 text-left">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 backdrop-blur-md">
              <span className="text-base sm:text-lg font-bold text-white font-heading block">
                100+
              </span>
              <span className="text-[10px] text-teal-300 uppercase tracking-wider font-mono font-semibold">
                Graduates
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 backdrop-blur-md">
              <span className="text-base sm:text-lg font-bold text-teal-300 font-heading block">
                3
              </span>
              <span className="text-[10px] text-slate-300 uppercase tracking-wider font-mono font-semibold">
                Years of Excellence
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 backdrop-blur-md">
              <span className="text-base sm:text-lg font-bold text-white font-heading block">
                100%
              </span>
              <span className="text-[10px] text-teal-300 uppercase tracking-wider font-mono font-semibold">
                Verified Sanad
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. ALUMNI DIRECTORY ── */}
      <section className="py-10 sm:py-16 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 space-y-8">

        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4 text-left">
          <div className="space-y-1">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider font-mono bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/60">
              Graduates Directory
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-heading tracking-tight mt-1">
              Alumni Profiles
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Explore the professional journeys and contributions of our graduates.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 shrink-0 self-start sm:self-auto">
            Total Profiles: <strong className="text-teal-700 dark:text-teal-400 font-semibold">{activeStudents.length}</strong>
          </div>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-3 animate-pulse">
                <div className="h-56 rounded-2xl bg-slate-200 dark:bg-slate-800 w-full" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && activeStudents.length === 0 && (
          <div className="py-12 text-center space-y-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <GraduationCap size={32} className="text-slate-400 mx-auto" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              No graduate records found.
            </p>
          </div>
        )}

        {/* ── Open Editorial Alumni Roster ── */}
        {!isLoading && activeStudents.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {activeStudents.map((student, i) => (
              <div
                key={student._id || student.id || `alum-${i}`}
                onClick={() => setActiveModalStudent(student)}
                className="group flex flex-col space-y-3 cursor-pointer text-left"
              >
                {/* Prominent Large Portrait */}
                <div className="relative h-56 sm:h-64 w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                  <img
                    src={getImageUrl(student.image, `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || "Student")}&background=0D9488&color=fff&bold=true`)}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || "Student")}&background=0D9488&color=fff&bold=true`;
                    }}
                    alt={student.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Corner Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1">
                    <span className="bg-slate-950/80 backdrop-blur-md text-teal-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider border border-white/10">
                      {student.category || "Alumnus"}
                    </span>
                    {student.batchYear && (
                      <span className="bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-white/10">
                        Class {student.batchYear}
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate">
                      {student.name}
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0">
                      {student.location || "Alumnus"}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-teal-700 dark:text-teal-400 truncate">
                    {student.currentRole || "Graduate Scholar"}
                  </p>

                  {student.currentOrganization && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                      <Building2 size={12} className="shrink-0 text-slate-400" />
                      <span>{student.currentOrganization}</span>
                    </p>
                  )}

                  {/* Action link */}
                  <div className="pt-1.5 flex items-center gap-1 text-xs font-bold text-teal-600 dark:text-teal-400 group-hover:text-teal-700 dark:group-hover:text-teal-300">
                    <span>View Bio &amp; Journey</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── 3. GRADUATE DETAILED BIO MODAL ── */}
      {activeModalStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
          onClick={() => setActiveModalStudent(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-700 dark:text-slate-300">
                Alumni Profile
              </span>
              <button
                type="button"
                onClick={() => setActiveModalStudent(null)}
                className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 custom-scrollbar">

              {/* Profile Top Row */}
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <img
                  src={getImageUrl(activeModalStudent.image, `https://ui-avatars.com/api/?name=${encodeURIComponent(activeModalStudent.name || "Student")}&background=0D9488&color=fff&bold=true`)}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activeModalStudent.name || "Student")}&background=0D9488&color=fff&bold=true`;
                  }}
                  alt={activeModalStudent.name}
                  className="w-16 h-16 rounded-2xl object-cover object-top border border-slate-200 dark:border-slate-700 shadow-sm shrink-0"
                />

                <div className="space-y-0.5 flex-1 min-w-0">
                  <span className="text-[10px] font-mono text-teal-700 dark:text-teal-400 uppercase font-bold">
                    {activeModalStudent.category || "Graduate"}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white font-heading truncate">
                    {activeModalStudent.name}
                  </h2>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate">
                    {activeModalStudent.currentRole}
                  </p>
                </div>
              </div>

              {/* Clean Specification List */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Organization</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[220px]">
                    {activeModalStudent.currentOrganization || "Private Scholarly Practice"}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Location</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {activeModalStudent.location || "International"}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Academic Program</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[220px]">
                    {activeModalStudent.program}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Sanad Verification</span>
                  <span className="font-semibold text-teal-600 dark:text-teal-400">
                    Verified Alumnus
                  </span>
                </div>
              </div>

              {/* Key Milestone */}
              {activeModalStudent.keyAchievement && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase font-mono tracking-wider block">
                    Key Milestone
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                    {activeModalStudent.keyAchievement}
                  </p>
                </div>
              )}

              {/* Reflection */}
              {activeModalStudent.message && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase font-mono tracking-wider block">
                    Graduate Reflection
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal italic">
                    &ldquo;{activeModalStudent.message}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="grid grid-cols-2 gap-3 p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 shrink-0">
              <button
                type="button"
                onClick={() => setActiveModalStudent(null)}
                className="py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-200/70 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full cursor-pointer text-center transition-colors"
              >
                Close
              </button>
              <Link
                to="/apply"
                className="py-2.5 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-full text-center transition-colors shadow-sm"
              >
                Apply Now
              </Link>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Students;
