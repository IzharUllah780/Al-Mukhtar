"use client";

import React, { useState } from "react";
import { Link } from "@/lib/navigation-adapter";
import {
  GraduationCap,
  Users,
  ArrowRight,
  X,
  ChevronRight,
  Briefcase,
  Newspaper,
  HeartHandshake,
} from "lucide-react";
import { useTeachers } from "@/lib/queries";
import { FounderImage, DirectorImage, GreenDecorationBg, getImageUrl } from "../assets/assets.js";

function Teachers() {
  const { data: apiTeachers = [], isLoading } = useTeachers();
  const activeTeachers = apiTeachers.filter((t) => t.status !== "inactive");

  const [activeModalTeacher, setActiveModalTeacher] = useState(null);
  const filteredTeachers = activeTeachers;

  return (
    <div className="bg-white dark:bg-[#070d18] text-slate-800 dark:text-slate-200 font-sans transition-colors duration-200 min-h-screen">

      {/* ── 1. COMPACT HERO SECTION (GREEN LEAVES BACKGROUND) ── */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-7 sm:py-9 border-b border-slate-800/80">
        {/* Background Image: Green Leaves Decoration (High Visibility) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={GreenDecorationBg}
            alt="Faculty Background - Al-Mukhtar"
            className="w-full h-full object-cover object-center opacity-75 sm:opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-950/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-10 lg:px-16 text-left space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 backdrop-blur-md text-teal-300 text-[10.5px] font-bold uppercase tracking-wider font-mono border border-teal-500/30">
            <Users size={11} className="text-teal-400" />
            <span>Faculty &amp; Scholarly Leadership</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight max-w-2xl">
            Meet Our Scholars &amp; Faculty
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed font-normal">
            Guided by qualified scholars with verified chains of transmission and dedicated pedagogical training.
          </p>
        </div>
      </section>

      {/* ── 2. FOUNDER & LEADERSHIP PROFILE (EDITORIAL / NO CARDS) ── */}
      <section className="py-8 sm:py-12 max-w-7xl mx-auto px-3 sm:px-10 lg:px-16 space-y-8">

        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5 text-left">
          <div className="space-y-0.5">
            <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 block">
              Founding Leadership
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
              Founder Profile &amp; Dossier
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            Al-Mukhtar Leadership
          </span>
        </div>

        {/* Main 2-Column Academic Profile (No Cards, Small Portrait Matching Home Page) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start text-left">

          {/* Left Column: Small Portrait (Matching Home Page) & Key Info */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24 flex flex-col items-center sm:items-start">
            {/* Free Standing Straight Portrait (Small size like Home Page) */}
            <div className="relative w-full max-w-[200px] sm:max-w-[240px] flex flex-col items-center sm:items-start overflow-visible">
              <div className="absolute -inset-3 bg-gradient-to-tr from-teal-500/15 via-emerald-500/10 to-transparent blur-2xl pointer-events-none" />
              <img
                src={FounderImage}
                alt="Mulana Muhammad Anwar"
                className="relative z-10 w-full max-w-[190px] sm:max-w-[220px] h-auto max-h-[290px] object-contain object-bottom drop-shadow-xl select-none transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>

            {/* Direct Metadata */}
            <div className="w-full space-y-1 text-center sm:text-left border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="inline-block px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                Founder &amp; CEO
              </span>
              <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900 dark:text-white">
                Mulana Muhammad Anwar
              </h3>
              <p className="text-xs text-teal-700 dark:text-teal-400 font-medium">
                Al-Mukhtar &bull; FAST-NUCES Faculty
              </p>
            </div>

            {/* Primary Appointments (Clean Unboxed List) */}
            <div className="w-full space-y-2 text-xs">
              <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Primary Appointments
              </span>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-1.5">
                  <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
                  <span><strong>Chief Executive Officer (CEO)</strong> — Al-Mukhtar</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
                  <span><strong>Visiting Faculty Member</strong> — FAST-NUCES Peshawar</span>
                </li>
              </ul>
            </div>

            {/* Focus Areas Tags */}
            <div className="w-full space-y-1.5 text-xs pt-1">
              <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Focus Areas &amp; Research
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Islamic Studies",
                  "Seerat Studies",
                  "Media Communication",
                  "Youth Development",
                  "Islamic Thought",
                  "Religion & Society",
                ].map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 text-[11px] font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Scholarly Dossier (Clean Blog / Description Prose) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Profile Overview */}
            <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
              <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 block">
                Founder &amp; Chief Executive Officer
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
                Mulana Muhammad Anwar
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-teal-700 dark:text-teal-400">
                Scholar in Islamic Studies, Media Communication &amp; Seerat Studies
              </p>
              <p className="text-xs sm:text-sm font-serif italic text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                &ldquo;My academic journey represents an effort to bring together traditional Islamic scholarship and contemporary academic disciplines, particularly media, communication, and Seerat Studies.&rdquo;
              </p>
            </div>

            {/* 1. Education & Qualifications (Unboxed List) */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1.5">
                <GraduationCap size={17} className="text-teal-600 dark:text-teal-400 shrink-0" />
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-heading tracking-tight">
                  Education &amp; Qualifications
                </h4>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h5 className="font-bold text-slate-900 dark:text-white">
                      • M.Phil. in Media Studies &amp; Mass Communication
                    </h5>
                    <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
                      Postgraduate
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 pl-3 mt-0.5">
                    A postgraduate degree focusing on media, communication, journalism, and the role of mass media in shaping society and public discourse.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h5 className="font-bold text-slate-900 dark:text-white">
                      • M.Phil. in Seerat Studies
                    </h5>
                    <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
                      Postgraduate
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 pl-3 mt-0.5">
                    Advanced academic study of the life, character, teachings, communication, leadership, and legacy of the Prophet Muhammad ﷺ.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h5 className="font-bold text-slate-900 dark:text-white">
                      • Kulliyyat al-Shariah (Faculty of Shariah) — Jamia Tur Rasheed (Batch 5)
                    </h5>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 pl-3 mt-0.5">
                    Graduated from the Faculty of Shariah, gaining comprehensive traditional Islamic education in Qur’an, Hadith, Fiqh, Islamic jurisprudence, Arabic, and other foundational Islamic sciences.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Currently Involved In (Unboxed List) */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1.5">
                <Briefcase size={17} className="text-teal-600 dark:text-teal-400 shrink-0" />
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-heading tracking-tight">
                  Currently Involved In
                </h4>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white">
                    • Visiting Faculty Member — FAST-NUCES, Peshawar Campus
                  </h5>
                  <p className="text-slate-600 dark:text-slate-300 pl-3 mt-0.5">
                    Serving as a Visiting Faculty Member at the FAST-NUCES Peshawar Campus, contributing to the academic and intellectual development of university students.
                  </p>
                </div>

                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white">
                    • Chief Executive Officer (CEO) — Al-Mukhtar
                  </h5>
                  <p className="text-slate-600 dark:text-slate-300 pl-3 mt-0.5">
                    Serving as the CEO of Al-Mukhtar, an organization committed to promoting knowledge, character, faith, and constructive engagement with contemporary society.
                  </p>
                </div>

                <div className="pl-3 pt-1">
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">Youth &amp; Societal Vision:</strong> Through Al-Mukhtar, my aim is to contribute to the development of a generation that is grounded in Islamic values, intellectually capable, morally responsible, and prepared to meet the challenges of the modern world.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Professional Experience in Media & Journalism */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1.5">
                <Newspaper size={17} className="text-teal-600 dark:text-teal-400 shrink-0" />
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-heading tracking-tight">
                  Professional Experience
                </h4>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <p>
                  I have professional experience in both media and academia, allowing me to engage with contemporary issues from academic, journalistic, and Islamic perspectives.
                </p>

                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Media Organizations Worked With:
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 pl-3 mt-0.5">
                    Daily Mashriq (Peshawar), Daily Islam (Karachi), and Daily Times (Peshawar).
                  </p>
                </div>

                <p>
                  I have also contributed columns and articles to various newspapers, writing on social, religious, educational, intellectual, and contemporary issues. My experience in journalism and media has provided me with a strong understanding of public communication, media discourse, and the social influence of communications.
                </p>

                <p>
                  Alongside my media career, my academic background in Media Studies, Mass Communication, and Seerat Studies, together with my traditional Islamic education from Jamia Tur Rasheed, has enabled me to work at the intersection of Islamic scholarship, contemporary education, media, and social development.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* ── 3. A MESSAGE TO THE YOUTH (CLEAN READING PROSE) ── */}
        <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800 text-left">
          <div className="space-y-1 border-b border-slate-200 dark:border-slate-800 pb-2.5">
            <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
              <HeartHandshake size={14} />
              <span>Executive Scholarly Address</span>
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
              A Message to the Youth
            </h3>
            <p className="text-[11.5px] font-mono text-slate-500 dark:text-slate-400">
              By Mulana Muhammad Anwar &bull; Founder &amp; CEO, Al-Mukhtar
            </p>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              Dear Young Men and Women,
            </p>

            <p>
              You are not merely the future of our society—you are an important part of its present. The direction of our communities, our institutions, and our Ummah depends greatly on how you use the opportunities, knowledge, energy, and talents that Allah has blessed you with.
            </p>

            <p>
              Islam does not teach us to choose between faith and worldly achievement. Rather, Islam calls us to seek success in both: to build a strong relationship with Allah while becoming people of knowledge, character, excellence, and positive contribution.
            </p>

            <p>
              The life of the Prophet Muhammad ﷺ teaches us that faith should inspire action, knowledge should produce wisdom, and spirituality should lead to service. A successful Muslim is one who strives to become closer to Allah while also striving for excellence in education, profession, leadership, innovation, and service to humanity.
            </p>

            <div className="space-y-1.5 pt-1">
              <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                Therefore, I encourage you to come forward:
              </p>
              <p>
                Pursue education with dedication. Develop your professional skills. Read, think, question, research, and create. Become competent in the fields that shape the modern world. At the same time, remain connected to the Qur’an, the Sunnah, Islamic values, and the noble character taught by the Prophet Muhammad ﷺ.
              </p>
              <p>
                Do not think that religious commitment is an obstacle to worldly success, nor that worldly success requires you to compromise your faith. True success is to excel in this world without losing sight of the Hereafter.
              </p>
            </div>

            <p>
              Our Ummah needs young people who are simultaneously faithful and capable, spiritually grounded and intellectually confident, morally upright and professionally excellent.
            </p>

            <p>
              Let your education serve a purpose. Let your profession become a means of benefit. Let your talents become a source of service. And let your success be measured not only by what you achieve for yourself, but also by what you contribute to your family, your society, your Ummah, and humanity.
            </p>

            <p className="font-serif italic text-teal-800 dark:text-teal-300 font-semibold py-1">
              &ldquo;Dream greatly. Work sincerely. Learn continuously. Serve selflessly. And remain connected to Allah.&rdquo;
            </p>

            <p>
              The world needs your talent, the Ummah needs your commitment, and your future is waiting for your effort. Step forward, take responsibility, and become a source of positive change.
            </p>

            {/* Quranic Ayah Citation */}
            <div className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-900 space-y-0.5">
              <p className="font-serif italic text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                &ldquo;And say: Do [righteous] deeds, for Allah will see your deeds, and so will His Messenger and the believers.&rdquo;
              </p>
              <span className="text-[10px] font-mono uppercase tracking-wider text-teal-600 dark:text-teal-400 block">
                — Qur’an 9:105
              </span>
            </div>

            <p className="text-xs font-semibold text-teal-700 dark:text-teal-400 pt-1">
              May Allah make our youth a generation of knowledge, faith, character, excellence, and service. Ameen.
            </p>
          </div>
        </div>

      </section>

      {/* ── 4. FACULTY ROSTER (CLEAN UNBOXED LIST/GRID) ── */}
      <section className="py-8 sm:py-12 max-w-7xl mx-auto px-3 sm:px-10 lg:px-16 space-y-6">

        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
          <div className="space-y-0.5 text-left">
            <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 block">
              Faculty Directory
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
              Our Teachers
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Qualified scholars and instructors delivering authentic curricula across our programs.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 shrink-0 self-start sm:self-auto">
            Active Faculty: <strong className="text-teal-700 dark:text-teal-400">{activeTeachers.length}</strong>
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2.5 animate-pulse">
                <div className="h-56 rounded-xl bg-slate-200 dark:bg-slate-800 w-full" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredTeachers.length === 0 && (
          <div className="py-10 text-center space-y-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <GraduationCap size={28} className="text-slate-400 mx-auto" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              No faculty records available at this time.
            </p>
          </div>
        )}

        {/* Faculty Grid (Clean Editorial Sizing) */}
        {!isLoading && filteredTeachers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
            {filteredTeachers.map((teacher, i) => (
              <div
                key={teacher._id || teacher.id || `faculty-${i}`}
                onClick={() => setActiveModalTeacher(teacher)}
                className="group flex flex-col space-y-2.5 cursor-pointer text-left"
              >
                {/* Portrait */}
                <div className="relative h-56 sm:h-64 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <img
                    src={getImageUrl(teacher.image, DirectorImage)}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = DirectorImage;
                    }}
                    alt={teacher.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Corner Department Tag */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="bg-slate-950/80 backdrop-blur-md text-teal-300 text-[9.5px] font-bold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider border border-white/10">
                      {teacher.department || "Faculty"}
                    </span>
                  </div>
                </div>

                {/* Clean Info */}
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-heading group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate">
                      {teacher.name}
                    </h3>
                    <span className="text-[10.5px] font-mono text-slate-400 shrink-0">
                      {teacher.experienceYears || "5+ Yrs"}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-teal-700 dark:text-teal-400 truncate">
                    {teacher.role}
                  </p>

                  {/* Specializations */}
                  {Array.isArray(teacher.specializations) && teacher.specializations.length > 0 && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {teacher.specializations.slice(0, 3).join(" • ")}
                    </p>
                  )}

                  {/* Clean Profile Link */}
                  <div className="pt-1 flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 group-hover:text-teal-700 dark:group-hover:text-teal-300">
                    <span>View Bio &amp; Credentials</span>
                    <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── 5. COMPACT CTA SECTION ── */}
      <section className="bg-slate-900 text-white py-8 sm:py-10 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-3 sm:px-10 lg:px-16 text-center space-y-3">
          <h2 className="text-lg sm:text-2xl font-extrabold font-heading tracking-tight">
            Begin Your Scholarly Journey at Al-Mukhtar
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Admissions are open for upcoming modular tracks and foundational certifications.
          </p>
          <div className="pt-2 flex items-center justify-center gap-2.5 max-w-xs sm:max-w-none mx-auto">
            <Link
              to="/apply"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-all text-center"
            >
              <span>Apply Now</span>
              <ArrowRight size={12} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/15 text-center"
            >
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── SCHOLAR DETAILS MODAL ── */}
      {activeModalTeacher && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
          onClick={() => setActiveModalTeacher(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-700 dark:text-slate-300">
                Faculty Scholar Profile
              </span>
              <button
                type="button"
                onClick={() => setActiveModalTeacher(null)}
                className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 custom-scrollbar">

              {/* Profile Top Row */}
              <div className="flex items-center gap-3.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <img
                  src={getImageUrl(activeModalTeacher.image, DirectorImage)}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DirectorImage;
                  }}
                  alt={activeModalTeacher.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover object-top border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0"
                />

                <div className="space-y-0.5 flex-1 min-w-0">
                  <span className="text-[9.5px] font-mono text-teal-700 dark:text-teal-400 uppercase font-bold">
                    {activeModalTeacher.department || "Faculty"}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading truncate">
                    {activeModalTeacher.name}
                  </h2>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate">
                    {activeModalTeacher.role}
                  </p>
                </div>
              </div>

              {/* Specs */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Teaching Experience</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {activeModalTeacher.experienceYears || "5+ Years"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Scholars Mentored</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {activeModalTeacher.studentsMentored || "200+"} Students
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Accreditation</span>
                  <span className="font-semibold text-teal-600 dark:text-teal-400">
                    Verified Resident Faculty
                  </span>
                </div>
              </div>

              {/* Specializations */}
              {Array.isArray(activeModalTeacher.specializations) &&
                activeModalTeacher.specializations.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider block">
                      Academic Specializations
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeModalTeacher.specializations.map((spec, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[11px]"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Bio */}
              {activeModalTeacher.bio && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider block">
                    Scholarly Bio
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {activeModalTeacher.bio}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="grid grid-cols-2 gap-2.5 p-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 shrink-0">
              <button
                type="button"
                onClick={() => setActiveModalTeacher(null)}
                className="py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-200/70 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl cursor-pointer text-center transition-colors"
              >
                Close
              </button>
              <Link
                to="/apply"
                className="py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-center transition-colors shadow-sm"
              >
                Enroll Now
              </Link>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Teachers;
