"use client";

import React, { useState } from "react";
import { Link } from "@/lib/navigation-adapter";
import {
  Award,
  Users,
  Calendar,
  ArrowRight,
  ChevronRight,
  GraduationCap,
  Building2,
  CheckCircle2,
  Quote,
  X,
  Sparkles,
} from "lucide-react";
import { useTeachers } from "@/lib/queries";
import { getImageUrl, DirectorImage } from "../assets/assets.js";

function TeacherCards({ marquee = false, onTeacherClick, limit }) {
  const { data: apiTeachers = [] } = useTeachers();
  const teachers = apiTeachers.filter((t) => t.status !== "inactive");
  const displayTeachers = typeof limit === "number" ? teachers.slice(0, limit) : teachers;
  const [activeModalTeacher, setActiveModalTeacher] = useState(null);

  if (teachers.length === 0) {
    return null;
  }

  const handleCardClick = (teacher) => {
    if (onTeacherClick) {
      onTeacherClick(teacher);
    } else {
      setActiveModalTeacher(teacher);
    }
  };

  const renderCard = (teacher, key) => (
    <div
      key={key}
      onClick={() => handleCardClick(teacher)}
      className={`group flex items-start gap-4 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-teal-500/50 dark:hover:border-teal-400/50 hover:shadow-xs transition-all cursor-pointer font-sans text-left ${
        marquee ? "w-[280px] sm:w-[320px] shrink-0" : "w-full"
      }`}
    >
      {/* Circular Avatar */}
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-teal-500 transition-all">
        <img
          src={getImageUrl(teacher.image, DirectorImage)}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = DirectorImage;
          }}
          alt={teacher.name}
          loading="lazy"
          className="w-full h-full object-cover object-top rounded-full"
        />
      </div>

      {/* Information */}
      <div className="min-w-0 flex-1 space-y-1">
        <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
          {teacher.name}
        </h3>
        <p className="text-xs font-semibold text-teal-700 dark:text-teal-400 truncate">
          {teacher.role || "Senior Scholar & Faculty"}
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
          {teacher.department || "Islamic Studies"}
          {teacher.experienceYears ? ` • ${teacher.experienceYears} Exp` : ""}
        </p>
      </div>
    </div>
  );

  return (
    <>
      {marquee ? (
        <div className="relative w-full overflow-hidden py-2">
          <div className="flex gap-4 sm:gap-6 animate-marquee hover:[animation-play-state:paused] active:[animation-play-state:paused]">
            {[...teachers, ...teachers].map((teacher, idx) =>
              renderCard(teacher, `marquee-teacher-${idx}`)
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 text-left">
          {displayTeachers.map((teacher, i) =>
            renderCard(teacher, teacher._id || teacher.id || `faculty-${i}`)
          )}
        </div>
      )}

      {/* Teacher Details Modal Dialog - Wide Width, Compact Height */}
      {activeModalTeacher && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150"
          onClick={() => setActiveModalTeacher(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl sm:max-w-3xl w-full max-h-[90vh] sm:max-h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 font-sans text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header Bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider font-mono bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/60">
                  Faculty Scholar Profile
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalTeacher(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Body - 2-Column Responsive Layout */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 custom-scrollbar">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                {/* Avatar */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 ring-4 ring-teal-500/20 shadow-sm shrink-0">
                  <img
                    src={getImageUrl(activeModalTeacher.image, DirectorImage)}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = DirectorImage;
                    }}
                    alt={activeModalTeacher.name}
                    className="w-full h-full rounded-full object-cover object-top"
                  />
                </div>

                {/* Identity info */}
                <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    {activeModalTeacher.department && (
                      <span className="px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-[10px] font-bold font-mono uppercase tracking-wider border border-teal-200/60 dark:border-teal-800/60">
                        {activeModalTeacher.department}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      Faculty Member
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading truncate">
                    {activeModalTeacher.name}
                  </h2>

                  <p className="text-xs sm:text-sm font-semibold text-teal-600 dark:text-teal-400 truncate">
                    {activeModalTeacher.role || "Senior Scholar & Faculty"}
                  </p>
                </div>
              </div>

              {/* Specification Grid in 2 Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-0.5">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-[11px]">
                    <Calendar size={13} className="text-teal-600 dark:text-teal-400" />
                    Teaching Experience
                  </span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {activeModalTeacher.experienceYears || "5+ Years"}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-0.5">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-[11px]">
                    <Users size={13} className="text-teal-600 dark:text-teal-400" />
                    Students Mentored
                  </span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {activeModalTeacher.studentsMentored || "200+"} Students
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-0.5">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-[11px]">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    Accreditation
                  </span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 truncate">
                    Verified Resident Faculty
                  </p>
                </div>
              </div>

              {/* Areas of Academic Specialization */}
              {Array.isArray(activeModalTeacher.specializations) &&
                activeModalTeacher.specializations.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider block">
                      Academic Specializations
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeModalTeacher.specializations.map((spec, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium border border-slate-200/80 dark:border-slate-700"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Scholarly Philosophy / Quote */}
              {activeModalTeacher.quote && (
                <div className="pl-3.5 border-l-2 border-teal-600 dark:border-teal-400 py-1 space-y-1">
                  <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase font-mono tracking-wider block">
                    Scholarly Philosophy
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal italic">
                    &ldquo;{activeModalTeacher.quote}&rdquo;
                  </p>
                </div>
              )}

              {/* Academic Background / Bio */}
              {activeModalTeacher.bio && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider block">
                    Academic Background &amp; Profile
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                    {activeModalTeacher.bio}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Bottom Footer Actions */}
            <div className="flex items-center justify-end gap-2.5 px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 shrink-0">
              <button
                type="button"
                onClick={() => setActiveModalTeacher(null)}
                className="py-2 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-200/70 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
              <Link
                to="/apply"
                className="inline-flex items-center justify-center gap-1.5 py-2 px-5 rounded-lg bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 shadow-xs transition-all text-center"
              >
                <span>Enroll Now</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TeacherCards;

