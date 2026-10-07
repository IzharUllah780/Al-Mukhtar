"use client";

import React from "react";
import { Link } from "@/lib/navigation-adapter";
import {
  Sparkles,
  ArrowRight,
  FileCheck,
  Users,
  BookOpen,
  GraduationCap,
  MapPin,
} from "lucide-react";
import { GreenDecorationBg } from "../assets/assets.js";

function About() {
  return (
    <div className="bg-white dark:bg-[#070d18] font-sans text-slate-800 dark:text-slate-200 transition-colors duration-200">
      {/* ── 1. COMPACT HERO SECTION (HIGH VISIBILITY GREEN LEAVES BG) ── */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-7 sm:py-9 border-b border-slate-800/80">
        {/* Background Image: Green Leaves Decoration (High Visibility) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={GreenDecorationBg}
            alt="Islamic Academic Heritage - Al-Mukhtar"
            className="w-full h-full object-cover object-center opacity-75 sm:opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-950/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-10 lg:px-16">
          <div className="max-w-3xl space-y-2.5 text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 backdrop-blur-md text-teal-300 text-[10.5px] font-bold uppercase tracking-wider font-mono border border-teal-500/30">
              <Sparkles size={11} className="text-teal-400" />
              <span>Institutional Profile</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              About Al-Mukhtar
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal max-w-2xl">
              At Al-Mukhtar we are dedicated to nurturing a deeper understanding of Islam through quality Islamic education, Dars-e-Nizami programs, and short weekend courses. Learn, understand, and practice the teachings of Islam in your daily life.
            </p>

            {/* Compact Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-white/15">
              <div className="p-2 rounded-lg bg-black/40 border border-white/10 backdrop-blur-md">
                <span className="text-sm sm:text-base font-bold text-white font-heading block">3 Years</span>
                <span className="text-[10px] text-teal-300 font-mono uppercase font-semibold">Tradition</span>
              </div>
              <div className="p-2 rounded-lg bg-black/40 border border-white/10 backdrop-blur-md">
                <span className="text-sm sm:text-base font-bold text-teal-300 font-heading block">100+</span>
                <span className="text-[10px] text-slate-300 font-mono uppercase font-semibold">Alumni</span>
              </div>
              <div className="p-2 rounded-lg bg-black/40 border border-white/10 backdrop-blur-md">
                <span className="text-sm sm:text-base font-bold text-white font-heading block">100%</span>
                <span className="text-[10px] text-teal-300 font-mono uppercase font-semibold">Verified Sanad</span>
              </div>
              <div className="p-2 rounded-lg bg-black/40 border border-white/10 backdrop-blur-md">
                <span className="text-sm sm:text-base font-bold text-teal-300 font-heading block">Global</span>
                <span className="text-[10px] text-slate-300 font-mono uppercase font-semibold">Curricula</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. EDITORIAL / BLOG & DESCRIPTION STYLE CONTENT ── */}
      <main className="max-w-7xl mx-auto px-3 sm:px-10 lg:px-16 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left Reading / Description Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-8 text-left">

            {/* ── SECTION 1: MADRASA PROFILE & MISSION ── */}
            <section className="space-y-3.5">
              <div className="space-y-1 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 block">
                  Madrasa Profile &amp; Mission
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
                  Authentic Islamic Education &amp; Dars-e-Nizami
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                <strong className="font-semibold text-slate-900 dark:text-white">Al-Mukhtar</strong> is a dedicated Islamic Madrasa exclusively focused on teaching sacred Islamic courses and classical <strong className="font-semibold text-slate-900 dark:text-white">Dars-e-Nizami</strong>. Our institution stands committed to reviving traditional scholarly knowledge in an authentic, structured learning environment.
              </p>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                All programs and classes are conducted by qualified, certified Islamic scholars (<em className="italic font-serif">Alims</em>) who carry rigorous credentials and traditional sanad. Every student who completes their course successfully is awarded an official completion certificate recognized for its academic authenticity.
              </p>

              {/* Location Stamp */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-mono py-1">
                <MapPin size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
                <span>On-Campus Study: Ghaz Masjid, Tanga Adda, Landi Arbab, Peshawar</span>
              </div>

              {/* Inclusivity & Target Audience Description */}
              <div className="space-y-1.5 pt-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-heading">
                  Tailored for University Students, Professionals &amp; All Age Groups
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  Our curriculum is uniquely structured to accommodate <strong className="font-semibold text-slate-900 dark:text-white">university students</strong> and <strong className="font-semibold text-slate-900 dark:text-white">working professionals</strong>. We believe seeking Islamic knowledge has <strong className="font-semibold text-slate-900 dark:text-white">no age limitation</strong>—whether young students starting out or elders seeking deep understanding, all learners are warmly welcomed and guided step-by-step.
                </p>
              </div>

              {/* Institutional Quote */}
              <p className="text-xs sm:text-sm font-serif italic text-slate-700 dark:text-slate-300 leading-relaxed pt-2">
                "Seeking sacred knowledge is an obligation upon every Muslim. At Al-Mukhtar, we open the doors of traditional Islamic learning to professionals, students, and elders alike under the tutelage of certified scholars."
                <span className="block text-[11px] font-mono not-italic font-semibold text-teal-600 dark:text-teal-400 mt-1">
                  — Al-Mukhtar Institutional Mission
                </span>
              </p>
            </section>

            {/* ── SECTION 2: CORE DISCIPLINES ── */}
            <section className="space-y-3.5">
              <div className="space-y-1 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 block">
                  Curriculum &amp; Specializations
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
                  Core Disciplines Taught at Al-Mukhtar
                </h2>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    1. Tajweed (تجويد)
                  </h3>
                  <p className="mt-0.5 text-slate-600 dark:text-slate-300">
                    Mastery of Quranic phonetics, correct Makharij (articulation points), and rhythmic recitation rules taught through direct oral transmission.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    2. Arabic Language (اللغة العربية)
                  </h3>
                  <p className="mt-0.5 text-slate-600 dark:text-slate-300">
                    Comprehensive study of classical Arabic grammar (<em className="font-serif italic">Nahw</em>) and morphology (<em className="font-serif italic">Sarf</em>) to read and comprehend sacred texts directly.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    3. Fiqh (الفقه الإسلامي)
                  </h3>
                  <p className="mt-0.5 text-slate-600 dark:text-slate-300">
                    Islamic Jurisprudence covering daily worship (Ibadat), financial transactions (Muamalat), family laws, and modern ethical dilemmas.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    4. Hadith (الحديث النبوي)
                  </h3>
                  <p className="mt-0.5 text-slate-600 dark:text-slate-300">
                    Study of authentic prophetic traditions, sciences of narration (<em className="font-serif italic">Usul al-Hadith</em>), and moral character formation.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    5. Tafseer (تفسير القرآن الكريم)
                  </h3>
                  <p className="mt-0.5 text-slate-600 dark:text-slate-300">
                    Verse-by-verse Quranic exegesis, exploring linguistic nuances, historical context of revelation (Asbab al-Nuzul), and timeless guidance for living.
                  </p>
                </div>
              </div>
            </section>

            {/* ── SECTION 3: KEY PILLARS / WHY STUDY AT AL-MUKHTAR ── */}
            <section className="space-y-3.5">
              <div className="space-y-1 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 block">
                  Academic Framework
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
                  Why Study at Al-Mukhtar
                </h2>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    • Certified Scholars &amp; Alims
                  </h3>
                  <p className="mt-0.5 text-slate-600 dark:text-slate-300 pl-3">
                    Our faculty comprises professional, authorized Alims equipped with deep classical mastery and dedicated to individualized student mentorship.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    • Verified Course Certification
                  </h3>
                  <p className="mt-0.5 text-slate-600 dark:text-slate-300 pl-3">
                    Students receive authenticated completion certificates at the conclusion of their studies upon clearing formal assessments.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    • Zero Age Restrictions — Open for Young &amp; Old
                  </h3>
                  <p className="mt-0.5 text-slate-600 dark:text-slate-300 pl-3">
                    Age is never a barrier. Whether you are a school/university student, a busy professional, or a senior seeking Islamic enlightenment, our classes cater to all.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    • On-Campus Interactive Learning
                  </h3>
                  <p className="mt-0.5 text-slate-600 dark:text-slate-300 pl-3">
                    Direct on-campus interaction located conveniently at Ghaz Masjid, Tanga Adda, Landi Arbab, Peshawar with conducive lecture spaces.
                  </p>
                </div>
              </div>
            </section>

            {/* ── SECTION 4: CAMPUS FACILITIES ── */}
            <section className="space-y-3.5">
              <div className="space-y-1 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 block">
                  Campus Facilities
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
                  Our On-Campus Learning Environment
                </h2>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    • Islamic Reference Library
                  </h3>
                  <p className="mt-0.5 text-slate-600 dark:text-slate-300 pl-3">
                    Classical Arabic manuscripts, Tafseer compendiums, Hadith collections, and Fiqh treatises.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    • Tajweed &amp; Recitation Rooms
                  </h3>
                  <p className="mt-0.5 text-slate-600 dark:text-slate-300 pl-3">
                    Dedicated quiet spaces for one-on-one phonetic pronunciation practice and oral evaluations.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    • Dars-e-Nizami Lecture Halls
                  </h3>
                  <p className="mt-0.5 text-slate-600 dark:text-slate-300 pl-3">
                    Spacious traditional halls organized for scholar lectures, group discussions, and revision.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    • Peshawar Campus
                  </h3>
                  <p className="mt-0.5 text-slate-600 dark:text-slate-300 pl-3">
                    Conveniently situated at Ghaz Masjid, Tanga Adda, Landi Arbab, accessible to students from across Peshawar.
                  </p>
                </div>
              </div>
            </section>

          </div>

          {/* Right Sidebar Column (4 Cols) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">

            {/* Academic Factsheet */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 bg-slate-50/70 dark:bg-slate-900/50 space-y-3">
              <div className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400 font-mono text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
                <FileCheck size={14} />
                <span>Institutional Factsheet</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-start justify-between gap-2 pb-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400 shrink-0">Location:</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right">Ghaz Masjid, Tanga Adda, Landi Arbab, Peshawar</span>
                </div>
                <div className="flex items-start justify-between gap-2 pb-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400 shrink-0">Study Mode:</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right">On-Campus</span>
                </div>
                <div className="flex items-start justify-between gap-2 pb-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400 shrink-0">Faculty:</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right">Certified Scholars (Alims)</span>
                </div>
                <div className="flex items-start justify-between gap-2 pb-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400 shrink-0">Certification:</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400 text-right">Awarded Upon Completion</span>
                </div>
                <div className="flex items-start justify-between gap-2 pb-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400 shrink-0">Disciplines:</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right">Tajweed, Arabic, Fiqh, Hadith, Tafseer</span>
                </div>
                <div className="flex items-start justify-between gap-2 pb-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400 shrink-0">Eligibility:</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400 text-right">No Age Limit</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-500 dark:text-slate-400 shrink-0">Target:</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right">Students &amp; Professionals</span>
                </div>
              </div>
            </div>

            {/* Quick Portals */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono block">
                Explore Portals
              </span>

              <div className="space-y-1.5">
                <Link
                  to="/teachers"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/50 hover:bg-white dark:hover:bg-slate-900 transition-all text-xs font-semibold text-slate-800 dark:text-slate-200 group"
                >
                  <span className="flex items-center gap-2">
                    <Users size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
                    <span>Faculty Directory (Scholars)</span>
                  </span>
                  <ArrowRight size={12} className="text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                  to="/courses"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/50 hover:bg-white dark:hover:bg-slate-900 transition-all text-xs font-semibold text-slate-800 dark:text-slate-200 group"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
                    <span>Islamic Courses &amp; Dars-e-Nizami</span>
                  </span>
                  <ArrowRight size={12} className="text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                  to="/students"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/50 hover:bg-white dark:hover:bg-slate-900 transition-all text-xs font-semibold text-slate-800 dark:text-slate-200 group"
                >
                  <span className="flex items-center gap-2">
                    <GraduationCap size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
                    <span>Alumni &amp; Graduates</span>
                  </span>
                  <ArrowRight size={12} className="text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </div>

            {/* Compact Admissions Action Box */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-900 text-white space-y-3 border border-slate-800">
              <div className="space-y-1">
                <span className="inline-block text-[9.5px] font-mono font-bold uppercase tracking-wider text-teal-300 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
                  On-Campus Admissions
                </span>
                <h4 className="text-sm font-bold font-heading text-white">
                  Join Al-Mukhtar Madrasa
                </h4>
                <p className="text-[11.5px] text-slate-300 leading-relaxed">
                  Admissions are open for university students, professionals, and all age groups at Ghaz Masjid, Tanga Adda, Landi Arbab, Peshawar.
                </p>
              </div>

              <div className="pt-1 flex flex-col gap-2">
                <Link
                  to="/apply"
                  className="inline-flex items-center justify-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2 px-3 rounded-lg transition-all text-center shadow-sm"
                >
                  <span>Apply for Admission</span>
                  <ArrowRight size={12} />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold py-2 px-3 rounded-lg border border-white/10 transition-all text-center"
                >
                  <span>Contact Campus Office</span>
                </Link>
              </div>
            </div>

          </aside>
        </div>
      </main>
    </div>
  );
}

export default About;
