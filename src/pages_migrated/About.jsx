"use client";

import React from "react";
import { Link } from "@/lib/navigation-adapter";
import {
  BookOpen,
  Users,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Globe,
  Quote,
  Compass,
  Layers,
  HeartHandshake,
  Building2,
  Library,
  Calendar,
  Award,
  Check,
  MapPin,
  FileCheck,
} from "lucide-react";
import { CampusImage, bg, FounderImage } from "../assets/assets.js";

function About() {
  return (
    <div className="bg-white dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* ── 1. INSTITUTIONAL HERO SECTION ── */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-12 sm:py-16 border-b border-slate-800/80">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={bg}
            alt="Islamic Academic Heritage"
            className="w-full h-full object-cover object-center opacity-70 sm:opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-slate-950/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="max-w-2xl space-y-4 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 backdrop-blur-md text-teal-300 text-[11px] font-bold uppercase tracking-wider font-mono border border-teal-500/20">
              <Sparkles size={12} className="text-teal-400" />
              <span>Institutional Profile</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-heading tracking-tight">
              About Al-Mukhtar
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              At Al-Mukhtar we are dedicated to nurturing a deeper understanding of Islam through quality Islamic education, Dars-e-Nizami programs, and short weekend courses. Learn, understand, and practice the teachings of Islam in your daily life.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/15">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 backdrop-blur-md">
                <span className="text-base sm:text-lg font-bold text-white font-heading block">3 Years</span>
                <span className="text-[10px] text-teal-300 font-mono uppercase font-semibold">Tradition</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 backdrop-blur-md">
                <span className="text-base sm:text-lg font-bold text-teal-300 font-heading block">100+</span>
                <span className="text-[10px] text-slate-300 font-mono uppercase font-semibold">Alumni</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 backdrop-blur-md">
                <span className="text-base sm:text-lg font-bold text-white font-heading block">100%</span>
                <span className="text-[10px] text-teal-300 font-mono uppercase font-semibold">Verified Sanad</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 backdrop-blur-md">
                <span className="text-base sm:text-lg font-bold text-teal-300 font-heading block">Global</span>
                <span className="text-[10px] text-slate-300 font-mono uppercase font-semibold">Curricula</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. MAIN ACADEMIC CONTENT ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left Main Content Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-12 text-left">

            {/* SECTION 1: GENESIS & MADRASA IDENTITY */}
            <article className="space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60 mb-2">
                  Madrasa Profile &amp; Mission
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-heading tracking-tight mt-1">
                  Authentic Islamic Education &amp; Dars-e-Nizami
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong className="font-semibold text-slate-900 dark:text-white">Al-Mukhtar</strong> is a dedicated Islamic Madrasa exclusively focused on teaching sacred Islamic courses and classical <strong className="font-semibold text-slate-900 dark:text-white">Dars-e-Nizami</strong>. Our institution stands committed to reviving traditional scholarly knowledge in an authentic, structured learning environment.
              </p>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                All programs and classes are conducted by qualified, certified Islamic scholars (<em className="italic font-serif">Alims</em>) who carry rigorous credentials and traditional sanad. Every student who completes their course successfully is awarded an official completion certificate recognized for its academic authenticity.
              </p>

              {/* Campus Visual */}
              <div className="my-6 rounded-none overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-900 group">
                <div className="relative h-60 sm:h-80 w-full overflow-hidden rounded-none">
                  <img
                    src={CampusImage}
                    alt="Al-Mukhtar Madrasa Campus"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex items-end p-5">
                    <div className="text-white space-y-1">
                      <p className="text-sm font-bold font-heading">Al-Mukhtar Campus</p>
                      <p className="text-xs text-slate-300 font-mono flex items-center gap-1.5">
                        <MapPin size={14} className="text-teal-400 shrink-0" />
                        <span>Ghaz Masjid, Tanga Adda, Landi Arbab, Peshawar — On-Campus Study</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inclusivity & Target Audience Highlight */}
              <div className="p-5 sm:p-6 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-900/50 space-y-2.5">
                <h3 className="text-sm sm:text-base font-bold text-teal-800 dark:text-teal-300 font-heading flex items-center gap-2">
                  <GraduationCap size={18} className="text-teal-600 dark:text-teal-400" />
                  <span>Tailored for University Students, Professionals &amp; All Age Groups</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Our curriculum is uniquely structured to accommodate <strong className="font-semibold text-slate-900 dark:text-white">university students</strong> and <strong className="font-semibold text-slate-900 dark:text-white">working professionals</strong>. We believe seeking Islamic knowledge has <strong className="font-semibold text-slate-900 dark:text-white">no age limitation</strong>—whether young students starting out or elders seeking deep understanding, all learners are warmly welcomed and guided step-by-step.
                </p>
              </div>

              {/* Pull-Quote */}
              <div className="my-6 p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border-l-4 border-teal-600 dark:border-teal-400 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <blockquote className="space-y-2">
                  <p className="text-xs sm:text-sm font-serif italic text-slate-800 dark:text-slate-200 leading-relaxed">
                    "Seeking sacred knowledge is an obligation upon every Muslim. At Al-Mukhtar, we open the doors of traditional Islamic learning to professionals, students, and elders alike under the tutelage of certified scholars."
                  </p>
                  <footer className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                    — Al-Mukhtar Institutional Mission
                  </footer>
                </blockquote>
              </div>
            </article>

            {/* SECTION 2: CORE DISCIPLINES */}
            <article className="space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60 mb-2">
                  Curriculum &amp; Specializations
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-heading tracking-tight mt-1">
                  Core Disciplines Taught at Al-Mukhtar
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Tajweed */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/40 shadow-sm transition-all space-y-2">
                  <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-sm font-heading">
                    <BookOpen size={18} />
                    <span>1. Tajweed (تجويد)</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Mastery of Quranic phonetics, correct Makharij (articulation points), and rhythmic recitation rules taught through direct oral transmission.
                  </p>
                </div>

                {/* Arabic */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/40 shadow-sm transition-all space-y-2">
                  <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-sm font-heading">
                    <Layers size={18} />
                    <span>2. Arabic Language (اللغة العربية)</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Comprehensive study of classical Arabic grammar (<em className="font-serif">Nahw</em>) and morphology (<em className="font-serif">Sarf</em>) to read and comprehend sacred texts directly.
                  </p>
                </div>

                {/* Fiqh */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/40 shadow-sm transition-all space-y-2">
                  <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-sm font-heading">
                    <ShieldCheck size={18} />
                    <span>3. Fiqh (الفقه الإسلامي)</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Islamic Jurisprudence covering daily worship (Ibadat), financial transactions (Muamalat), family laws, and modern ethical dilemmas.
                  </p>
                </div>

                {/* Hadith */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/40 shadow-sm transition-all space-y-2">
                  <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-sm font-heading">
                    <HeartHandshake size={18} />
                    <span>4. Hadith (الحديث النبوي)</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Study of authentic prophetic traditions, sciences of narration (<em className="font-serif">Usul al-Hadith</em>), and moral character formation.
                  </p>
                </div>

                {/* Tafseer */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/40 shadow-sm transition-all space-y-2 sm:col-span-2">
                  <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-sm font-heading">
                    <Globe size={18} />
                    <span>5. Tafseer (تفسير القرآن الكريم)</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Verse-by-verse Quranic exegesis, exploring linguistic nuances, historical context of revelation (Asbab al-Nuzul), and timeless guidance for living.
                  </p>
                </div>
              </div>
            </article>

            {/* SECTION 3: KEY PILLARS */}
            <article className="space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60 mb-2">
                  Academic Framework
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-heading tracking-tight mt-1">
                  Why Study at Al-Mukhtar
                </h2>
              </div>

              <div className="space-y-3 pt-1">
                <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-xs sm:text-sm font-heading">
                    <CheckCircle2 size={18} />
                    <span>Certified Scholars &amp; Alims</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                    Our faculty comprises professional, authorized Alims equipped with deep classical mastery and dedicated to individualized student mentorship.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-xs sm:text-sm font-heading">
                    <Award size={18} />
                    <span>Verified Course Certification</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                    Students receive authenticated completion certificates at the conclusion of their studies upon clearing formal assessments.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-xs sm:text-sm font-heading">
                    <Users size={18} />
                    <span>Zero Age Restrictions — Open for Young &amp; Old</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                    Age is never a barrier. Whether you are a school/university student, a busy professional, or a senior seeking Islamic enlightenment, our classes cater to all.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-xs sm:text-sm font-heading">
                    <MapPin size={18} />
                    <span>On-Campus Interactive Learning</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                    Direct on-campus interaction located conveniently at Ghaz Masjid, Tanga Adda, Landi Arbab, Peshawar with conducive lecture spaces.
                  </p>
                </div>
              </div>
            </article>

            {/* SECTION 4: CAMPUS & FACILITIES */}
            <article className="space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60 mb-2">
                  Campus Facilities
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-heading tracking-tight mt-1">
                  Our On-Campus Learning Environment
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-xs sm:text-sm font-heading">
                    <Library size={16} />
                    <span>Islamic Reference Library</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Classical Arabic manuscripts, Tafseer compendiums, Hadith collections, and Fiqh treatises.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-xs sm:text-sm font-heading">
                    <Building2 size={16} />
                    <span>Tajweed &amp; Recitation Rooms</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Dedicated quiet spaces for one-on-one phonetic pronunciation practice and oral evaluations.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-xs sm:text-sm font-heading">
                    <Users size={16} />
                    <span>Dars-e-Nizami Lecture Halls</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Spacious traditional halls organized for scholar lectures, group discussions, and revision.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-xs sm:text-sm font-heading">
                    <MapPin size={16} />
                    <span>Peshawar Campus</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Conveniently situated at Ghaz Masjid, Tanga Adda, Landi Arbab, accessible to students from across Peshawar.
                  </p>
                </div>
              </div>
            </article>

          </div>

          {/* Right Sidebar Column (4 Cols — Sticky Quick Info & Portals) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">

            {/* Quick Fact Sheet Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-mono text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">
                <FileCheck size={16} />
                <span>Institutional Factsheet</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Location:</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right">Ghaz Masjid, Tanga Adda, Landi Arbab, Peshawar</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Study Mode:</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right">On-Campus</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Faculty:</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right">Certified Scholars (Alims)</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Certification:</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400 text-right">Awarded Upon Completion</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Core Disciplines:</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right">Tajweed, Arabic, Fiqh, Hadith, Tafseer</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Eligibility / Age:</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400 text-right">No Age Limit (Young &amp; Old)</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Target Audience:</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right">Uni Students &amp; Professionals</span>
                </div>
              </div>
            </div>

            {/* Quick Portal Navigation Links */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 space-y-3.5 shadow-sm">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white font-heading uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Explore Portals
              </h3>

              <div className="space-y-2.5">
                <Link
                  to="/teachers"
                  className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/50 hover:shadow-sm transition-all text-xs font-bold text-slate-800 dark:text-slate-200 group"
                >
                  <span className="flex items-center gap-2.5">
                    <Users size={15} className="text-teal-600 dark:text-teal-400" />
                    <span>Faculty Directory (Scholars)</span>
                  </span>
                  <ArrowRight size={13} className="text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                  to="/courses"
                  className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/50 hover:shadow-sm transition-all text-xs font-bold text-slate-800 dark:text-slate-200 group"
                >
                  <span className="flex items-center gap-2.5">
                    <BookOpen size={15} className="text-teal-600 dark:text-teal-400" />
                    <span>Islamic Courses &amp; Dars-e-Nizami</span>
                  </span>
                  <ArrowRight size={13} className="text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                  to="/students"
                  className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/50 hover:shadow-sm transition-all text-xs font-bold text-slate-800 dark:text-slate-200 group"
                >
                  <span className="flex items-center gap-2.5">
                    <GraduationCap size={15} className="text-teal-600 dark:text-teal-400" />
                    <span>Alumni &amp; Graduates</span>
                  </span>
                  <ArrowRight size={13} className="text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </div>

            {/* Admission Box */}
            <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4 border border-slate-800 shadow-md">
              <div className="space-y-1.5">
                <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider text-teal-300 bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded-full">
                  On-Campus Admissions
                </span>
                <h4 className="text-base font-bold font-heading">
                  Join Al-Mukhtar Madrasa
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Admissions are open for university students, professionals, and all age groups at Ghaz Masjid, Tanga Adda, Landi Arbab, Peshawar.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <Link
                  to="/apply"
                  className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2.5 px-4 rounded-full transition-all text-center shadow-sm"
                >
                  <span>Apply for Admission</span>
                  <ArrowRight size={13} />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold py-2.5 px-4 rounded-full border border-white/10 transition-all text-center"
                >
                  <span>Contact Campus Office</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

export default About;