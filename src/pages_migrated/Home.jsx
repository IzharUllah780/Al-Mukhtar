"use client";

import React, { useState } from "react";
import { Link } from "@/lib/navigation-adapter";
import { useCourses, useBlogs, useTeachers, useVideos } from "@/lib/queries";
import {
  ArrowRight,
  BookOpen,
  Award,
  GraduationCap,
  Building,
  Globe,
  ShieldCheck,
  Monitor,
  Compass,
  CheckCircle2,
  Quote,
  ChevronDown,
  HelpCircle,
  Sparkles,
  Play,
} from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import BlogCard from "../components/BlogCard.jsx";
import CourseCard from "../components/CourseCard.jsx";
import TeacherCards from "../components/TeacherCards.jsx";
import StudentShowcase from "../components/StudentShowcase.jsx";
import VideoCard from "../components/VideoCard.jsx";
import ApiErrorState from "../components/ApiErrorState.jsx";
import { AboutImage, BackgroundImage, FounderImage, Logo, MasjidImage, getImageUrl } from "../assets/assets.js";

const faqs = [
  {
    question: "What courses and programs are taught at Al-Mukhtar?",
    answer:
      "Al-Mukhtar is a dedicated Islamic Madrasa teaching sacred Islamic sciences and classical Dars-e-Nizami, including Tajweed & Quran recitation, Arabic grammar & morphology, Fiqh (Islamic Jurisprudence), Hadith studies, Tafseer, and Seerat-un-Nabi ﷺ.",
  },
  {
    question: "Is there any age restriction or prior qualification requirement?",
    answer:
      "There is no age limitation at Al-Mukhtar. Our courses are specially designed for university students, working professionals, and elders, as well as young learners starting their journey in Deen. Everyone is taught step-by-step.",
  },
  {
    question: "What is the study mode and where is the campus located?",
    answer:
      "All classes are conducted On-Campus with direct scholar-to-student interaction at our Peshawar campus located at Ghaz Masjid, Tanga Adda, Landi Arbab, Peshawar, KPK, Pakistan.",
  },
  {
    question: "Who teaches the classes and what are their qualifications?",
    answer:
      "All courses are taught by certified Islamic scholars (Alims) with authentic Sanad, led by Founder & CEO Mulana Muhammad Anwar (M.Phil Media Studies & Mass Communication, M.Phil Seerat Studies, Kulliyyat al-Shariah Jamia Tur Rasheed).",
  },
  {
    question: "Are certificates provided at the end of the course?",
    answer:
      "Yes. Upon successful completion of the course syllabus and passing the final assessment, students are awarded an official certified Sanad / Certificate from Al-Mukhtar.",
  },
  {
    question: "How do I check examination results and download result PDFs?",
    answer:
      "Official examination result PDF gazettes are published under the Results section of our website, where students can view and download their course result gazette at any time.",
  },
];

function Home() {
  const [openFaq, setOpenFaq] = useState(0);

  const {
    data: courses = [],
    isLoading: coursesLoading,
    isError: isCoursesError,
    refetch: refetchCourses,
  } = useCourses();

  const {
    data: blogs = [],
    isLoading: blogsLoading,
    isError: isBlogsError,
    refetch: refetchBlogs,
  } = useBlogs();

  const { data: teachers = [] } = useTeachers();
  const { data: videos = [], isLoading: videosLoading } = useVideos();

  const [selectedTeacherId, setSelectedTeacherId] = useState("");

  const activeTeachers = teachers.filter((t) => t.status !== "inactive");
  const activeTeacher =
    activeTeachers.find((t) => (t._id || t.id) === selectedTeacherId) || activeTeachers[0] || null;

  const featuredCourses = courses.slice(0, 6);
  const recentBlogs = blogs.slice(0, 6);
  const featuredVideos = videos.slice(0, 3);

  return (
    <div className="bg-white dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* ── PREMIER UNIVERSITY HERO SECTION (MASJID BACKGROUND WITH CRISP OVERLAY, ZERO CARDS, ZERO ROUNDED IMAGES) ── */}
      <section className="relative overflow-hidden text-white py-12 sm:py-16 transition-colors">
        {/* Masjid Background Image with Enhanced Visibility */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={MasjidImage}
            alt="Masjid"
            className="w-full h-full object-cover object-center rounded-none brightness-[0.96] contrast-[1.05]"
          />
          {/* Light-dark overlay for light mode, deep dark overlay for dark mode */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-slate-950/25 dark:from-slate-950/90 dark:via-slate-950/65 dark:to-slate-950/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 md:px-10 lg:px-16">
          <div className="max-w-4xl space-y-4 sm:space-y-5 text-left">
            {/* Dignified Academic Headline (Refined, Compact Proportion) */}
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight">
              Your Journey Towards Islamic Knowledge Begins Here — Learn, Reflect & Grow with Al-Mukhtar
            </h1>

            {/* Institutional Overview Description with Line Break */}
            <p className="text-slate-200 text-xs sm:text-sm sm:text-base leading-relaxed font-normal max-w-3xl">
              <span>Explore the world of Islamic knowledge with Al-Mukhtar. We offer structured Islamic education, Dars-e-Nizami and weekend short courses to help students strengthen their understanding of Deen.</span>
              <span className="block mt-2">Guided by qualified Islamic scholars holding authentic chains of transmission (Sanad), our programs provide a disciplined, step-by-step learning journey tailored for university students, professionals, and seekers of all backgrounds.</span>
            </p>

            {/* Action Buttons (Single Row on Mobile & Desktop) */}
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:items-center sm:gap-3 pt-2 w-full sm:w-auto max-w-md sm:max-w-none">
              <Link
                to="/courses"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-3 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm transition-all text-center rounded-xl shadow-xs hover:shadow-md active:scale-98"
              >
                <span className="truncate">Explore Courses</span>
              </Link>
              <Link
                to="/blog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 font-bold px-3 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm transition-all text-center rounded-xl shadow-xs hover:shadow-md active:scale-98 backdrop-blur-xs"
              >
                <span className="truncate">Read Blogs</span>
                <ArrowRight size={14} className="shrink-0" />
              </Link>
            </div>

            {/* Institutional Quality Indicators */}
            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-x-6 pt-2 text-xs sm:text-sm text-slate-200 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-teal-400 shrink-0" />
                <span>Experienced Islamic Scholars</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-teal-400 shrink-0" />
                <span>Flexible Shifts (Morning &amp; Evening)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-teal-400 shrink-0" />
                <span>Recognized Certification</span>
              </span>
            </div>
          </div>

          {/* Quick Metrics Ribbon (Compact, Unboxed - Zero Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-6 sm:mt-8 pt-6 text-left border-t border-slate-700/60 dark:border-slate-800/60">
            <div className="space-y-0.5">
              <p className="font-heading text-xl sm:text-2xl md:text-3xl font-black text-white">100+</p>
              <p className="text-teal-300 dark:text-teal-400 text-[11px] sm:text-xs uppercase tracking-wider font-semibold">Students Taught</p>
            </div>
            <div className="space-y-0.5">
              <p className="font-heading text-xl sm:text-2xl md:text-3xl font-black text-white">10+</p>
              <p className="text-teal-300 dark:text-teal-400 text-[11px] sm:text-xs uppercase tracking-wider font-semibold">Scholars &amp; Faculty</p>
            </div>
            <div className="space-y-0.5">
              <p className="font-heading text-xl sm:text-2xl md:text-3xl font-black text-white">3</p>
              <p className="text-teal-300 dark:text-teal-400 text-[11px] sm:text-xs uppercase tracking-wider font-semibold">Years of Service</p>
            </div>
            <div className="space-y-0.5">
              <p className="font-heading text-xl sm:text-2xl md:text-3xl font-black text-white">5</p>
              <p className="text-teal-300 dark:text-teal-400 text-[11px] sm:text-xs uppercase tracking-wider font-semibold">Certified Programs</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── UNIVERSITY QUICK PORTALS STRIP (COMPACT, SEAMLESS FLOW) ── */}
      <div className="py-4 transition-colors font-sans border-b border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-10 lg:px-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 items-center justify-between text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-semibold font-sans">
          <div className="flex items-center gap-2 py-0.5">
            <GraduationCap size={16} className="text-teal-600 dark:text-teal-400 shrink-0" />
            <span className="truncate">Certified Curriculum</span>
          </div>
          <div className="flex items-center gap-2 py-0.5">
            <Award size={16} className="text-teal-600 dark:text-teal-400 shrink-0" />
            <span className="truncate">Qualified Scholars</span>
          </div>
          <div className="flex items-center gap-2 py-0.5">
            <Building size={16} className="text-teal-600 dark:text-teal-400 shrink-0" />
            <span className="truncate">Modern Campus</span>
          </div>
          <div className="flex items-center gap-2 py-0.5">
            <Globe size={16} className="text-teal-600 dark:text-teal-400 shrink-0" />
            <span className="truncate">Inclusive Community</span>
          </div>
        </div>
      </div>

      {/* ── DEDICATED FOUNDER MESSAGE SECTION (CLEAN, SEAMLESS) ── */}
      <section className="relative py-10 sm:py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Free Standing Straight Portrait */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-[240px] sm:max-w-[280px] flex flex-col items-center overflow-visible">
                {/* Natural Soft Ambient Lighting */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-teal-500/20 via-emerald-500/10 to-transparent blur-3xl pointer-events-none" />

                {/* Free standing portrait */}
                <div className="relative z-10 w-full flex items-end justify-center">
                  <img
                    src={FounderImage}
                    alt="Mulana Muhammad Anwar"
                    className="w-full max-w-[220px] sm:max-w-[260px] h-auto max-h-[340px] object-contain object-bottom drop-shadow-2xl select-none transition-transform duration-500 hover:scale-[1.02] rounded-none"
                  />
                </div>

                {/* Direct Editorial Metadata */}
                <div className="relative z-20 w-full pt-3 text-center space-y-1 mt-1 sm:mt-2">
                  <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading">
                    Mulana Muhammad Anwar
                  </p>
                  <p className="text-xs text-teal-700 dark:text-teal-400 font-semibold">
                    Founder &amp; CEO &bull; FAST-NUCES Faculty
                  </p>
                </div>
              </div>
            </div>

            {/* Founder's Message & Read More Link */}
            <div className="lg:col-span-8 space-y-3.5 text-left">
              <h2 className="font-heading text-lg sm:text-xl font-bold text-black dark:text-white tracking-tight">
                Message from Founder
              </h2>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                <p>
                  You are not merely the future of our society—you are an important part of its present. The direction of our communities, our institutions, and our Ummah depends greatly on how you use the opportunities, knowledge, energy, and talents that Allah has blessed you with.
                </p>
                <p>
                  Islam does not teach us to choose between faith and worldly achievement. Rather, Islam calls us to seek success in both: to build a strong relationship with Allah while becoming people of knowledge, character, excellence, and positive contribution.
                </p>
                <p>
                  The life of the Prophet Muhammad ﷺ teaches us that faith should inspire action, knowledge should produce wisdom, and spirituality should lead to service. A successful Muslim is one who strives to become closer to Allah while also striving for excellence in education, profession, leadership, innovation, and service to humanity.
                </p>
              </div>

              <div className="pt-1 sm:pt-2">
                <Link
                  to="/teachers"
                  className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-xs sm:text-sm font-semibold hover:underline transition-colors"
                >
                  <span>Read more</span>
                  <ArrowRight size={14} className="shrink-0" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT SECTION (BACKGROUND IMAGE WITH CONTENT ON TOP) ── */}
      <section className="relative overflow-hidden text-white py-12 sm:py-16 md:py-20 lg:py-24 flex items-center transition-colors">
        {/* Full Background Image */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={BackgroundImage}
            alt="About Al-Mukhtar Institute Background"
            className="w-full h-full object-cover object-center rounded-none brightness-[0.95] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/70 to-slate-950/35 dark:from-slate-950/92 dark:via-slate-950/80 dark:to-slate-950/60" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-6 md:px-10 lg:px-16">
          <div className="max-w-3xl space-y-4 sm:space-y-5 text-left">
            <h2 className="font-heading text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
              A trusted center of learning, guidance, and character
            </h2>

            <div className="space-y-3 text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              <p>
                Founded with the vision to cultivate intellect, spiritual clarity, and moral discipline, Al-Mukhtar Institute serves students through structured Islamic and classical Dars-e-Nizami programs. Our academy revives traditional sciences in a disciplined, modern academic atmosphere.
              </p>
              <p>
                Our scholars are rigorously trained with authentic chains of transmission (Sanad), our curriculum is step-by-step, and every student receives personalized mentorship to grow intellectually and spiritually.
              </p>
              <p>
                Whether you are a university student, working professional, or an elder starting your journey in Deen, our programs offer flexible schedules designed to balance worldly responsibilities with sacred learning.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1 sm:pt-2">
              {[
                "Authentic Classical Curriculum",
                "Qualified Faculty & Scholars",
                "Structured Academic Support",
                "Safe, Disciplined Environment",
                "Direct Scholar-to-Student Mentorship",
                "Recognized Certification & Sanad",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-teal-400 shrink-0" />
                  <span className="text-xs sm:text-sm text-slate-100 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-1.5 text-teal-300 hover:text-teal-200 dark:text-teal-400 dark:hover:text-teal-300 text-xs sm:text-sm font-semibold hover:underline transition-colors"
              >
                <span>Learn more about our institute</span>
                <ArrowRight size={14} className="shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── METHODOLOGY / APPROACH ── */}
      <section className="py-10 sm:py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start text-left">
            {/* Left Institutional Column */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="font-heading text-lg sm:text-xl font-bold text-black dark:text-white tracking-tight leading-snug">
                A Tri-fold Approach to Education
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Our educational methodology integrates authentic classical scholarship with practical life application and personal character discipline.
              </p>

              <div className="pt-1 space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>Verified Chains of Transmission (Sanad)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>Step-by-Step Progressive Curriculum</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>Direct Scholar Mentorship &amp; Guidance</span>
                </div>
              </div>
            </div>

            {/* Right Pillars List */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              {[
                {
                  num: "01",
                  icon: BookOpen,
                  title: "Traditional Sciences",
                  desc: "Tafseer, Hadith, Fiqh, and Arabic grammar, taught by scholars with verified chains of transmission (Ijazah).",
                },
                {
                  num: "02",
                  icon: Compass,
                  title: "Practical Islamic Learning",
                  desc: "Islamic knowledge is connected to daily life through practical learning, real-life examples, worship guidance, and lessons that help students apply what they learn.",
                },
                {
                  num: "03",
                  icon: ShieldCheck,
                  title: "Tarbiyah & Character",
                  desc: "Active emphasis on Islamic ethics, personal discipline, integrity, and meaningful community service.",
                },
              ].map((pillar, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 sm:gap-4"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-teal-50 dark:bg-teal-950/70 border border-teal-200/70 dark:border-teal-800/70 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0 rounded-lg">
                    <pillar.icon size={16} />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10.5px] font-bold text-teal-700 dark:text-teal-400 uppercase font-sans">
                        Pillar {pillar.num}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED COURSES ── */}
      {(coursesLoading || isCoursesError || featuredCourses.length > 0) && (
        <section className="max-w-7xl mx-auto px-3 sm:px-6 md:px-10 lg:px-16 py-10 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8 text-left">
            <div className="space-y-1">
              <h2 className="font-heading text-lg sm:text-xl font-bold text-black dark:text-white tracking-tight">
                Featured Courses
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Structured Islamic learning programs and weekend short courses designed to deepen understanding of Deen.
              </p>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 text-teal-600 dark:text-teal-400 text-xs sm:text-sm font-bold hover:text-teal-700 dark:hover:text-teal-300 hover:gap-2 transition-all shrink-0"
            >
              <span>View all programs</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {coursesLoading && featuredCourses.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden animate-pulse">
                  <div className="w-full aspect-[16/9] bg-slate-100 dark:bg-slate-800" />
                  <div className="p-4 space-y-2.5">
                    <div className="w-20 h-3 bg-slate-100 dark:bg-slate-800 rounded" />
                    <div className="w-4/5 h-4 bg-slate-100 dark:bg-slate-800 rounded" />
                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded" />
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                      <div className="w-16 h-3 bg-slate-100 dark:bg-slate-800 rounded" />
                      <div className="w-16 h-3 bg-slate-100 dark:bg-slate-800 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isCoursesError && featuredCourses.length === 0 && (
            <ApiErrorState
              title="Unable to load featured courses"
              message="Network or server connection issue while retrieving courses. Click refresh to try again."
              onRetry={refetchCourses}
            />
          )}

          {featuredCourses.length > 0 && (
            <div className="space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-start">
                {featuredCourses.map((course) => (
                  <CourseCard key={course._id || course.slug} course={course} />
                ))}
              </div>

              {courses.length > 6 && (
                <div className="text-center pt-2">
                  <Link
                    to="/courses"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 font-bold px-6 py-3 transition-all text-xs sm:text-sm shadow-xs rounded-xl hover:shadow-md active:scale-98"
                  >
                    <span>Explore All Courses ({courses.length})</span>
                    <ArrowRight size={14} className="text-teal-600 dark:text-teal-400" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* ── FACULTY / TEACHERS ── */}
      {activeTeachers.length > 0 && (
        <section className="py-10 sm:py-16 transition-colors">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-10 lg:px-16 space-y-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div className="space-y-1">
                <h2 className="font-heading text-lg sm:text-xl font-bold text-black dark:text-white tracking-tight">
                  Learn Under Experienced Scholars
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                  Guided by qualified scholars holding verified chains of transmission (Ijazah) from recognized academic institutions.
                </p>
              </div>
              <Link
                to="/teachers"
                className="inline-flex items-center gap-1.5 text-teal-600 dark:text-teal-400 text-xs sm:text-sm font-bold hover:text-teal-700 dark:hover:text-teal-300 hover:gap-2 transition-all shrink-0"
              >
                <span>View all faculty ({activeTeachers.length})</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <TeacherCards />
          </div>
        </section>
      )}

      {/* ── NEWS & ANNOUNCEMENTS ── */}
      {(blogsLoading || isBlogsError || recentBlogs.length > 0) && (
        <section className="max-w-7xl mx-auto px-3 sm:px-6 md:px-10 lg:px-16 py-10 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8 text-left">
            <div className="space-y-1">
              <h2 className="font-heading text-lg sm:text-xl font-bold text-black dark:text-white tracking-tight">
                Latest Blogs from the Institute
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Articles, scholarly insights, and academic updates published by Al-Mukhtar faculty and research fellows.
              </p>
            </div>
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-teal-600 dark:text-teal-400 text-xs sm:text-sm font-bold hover:text-teal-700 dark:hover:text-teal-300 hover:gap-2 transition-all shrink-0"
            >
              <span>View all articles</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {blogsLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-3 animate-pulse rounded-xl">
                  <div className="w-full h-40 bg-slate-100 dark:bg-slate-800" />
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 w-3/4" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 w-full" />
                </div>
              ))}
            </div>
          )}

          {isBlogsError && !blogsLoading && (
            <ApiErrorState
              title="Unable to load latest articles"
              message="Failed to retrieve publications from the server. Click refresh to try again."
              onRetry={refetchBlogs}
            />
          )}

          {!blogsLoading && !isBlogsError && recentBlogs.length > 0 && (
            <div className="space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
                {recentBlogs.map((blog) => (
                  <BlogCard key={blog._id || blog.slug} blog={blog} />
                ))}
              </div>

              {blogs.length > 6 && (
                <div className="text-center pt-2">
                  <Link
                    to="/blog"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 font-bold px-6 py-3 transition-all text-xs sm:text-sm shadow-xs rounded-xl hover:shadow-md active:scale-98"
                  >
                    <span>Explore All Articles ({blogs.length})</span>
                    <ArrowRight size={14} className="text-teal-600 dark:text-teal-400" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* ── STUDENTS & ALUMNI SUCCESS SHOWCASE ── */}
      <StudentShowcase limit={6} showHeaderAction={true} />

      {/* ── FEATURED YOUTUBE VIDEO LECTURES SECTION ── */}
      {(videosLoading || featuredVideos.length > 0) && (
        <section className="max-w-7xl mx-auto px-3 sm:px-6 md:px-10 lg:px-16 py-10 sm:py-16 border-t border-slate-200/80 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
            <div className="space-y-1">
              <span className="text-[10.5px] font-bold text-red-600 dark:text-red-400 font-mono tracking-wider uppercase flex items-center gap-1.5">
                <FaYoutube size={14} className="text-red-600 dark:text-red-400" />
                <span>Video Lectures &amp; Media</span>
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-black dark:text-white tracking-tight">
                Scholarly Lectures &amp; Video Discourses
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-xl font-normal leading-relaxed">
                Watch recorded lessons, Tajweed tutorials, and discourses delivered by certified resident scholars at Al-Mukhtar.
              </p>
            </div>
            <Link
              to="/videos"
              className="inline-flex items-center gap-1.5 text-teal-600 dark:text-teal-400 text-xs sm:text-sm font-bold hover:text-teal-700 dark:hover:text-teal-300 hover:gap-2 transition-all shrink-0"
            >
              <span>View all video lectures</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {videosLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 animate-pulse"
                >
                  <div className="w-full aspect-video bg-slate-100 dark:bg-slate-800 rounded-xl" />
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full" />
                </div>
              ))}
            </div>
          )}

          {!videosLoading && featuredVideos.length > 0 && (
            <div className="space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
                {featuredVideos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>

              <div className="text-center pt-2">
                <Link
                  to="/videos"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 font-bold px-6 py-3 transition-all text-xs sm:text-sm shadow-xs rounded-xl hover:shadow-md active:scale-98"
                >
                  <FaYoutube size={16} className="text-red-600 dark:text-red-400" />
                  <span>Explore More Videos ({videos.length})</span>
                  <ArrowRight size={14} className="text-teal-600 dark:text-teal-400 ml-1" />
                </Link>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── FAQS ── */}
      <section className="max-w-4xl mx-auto px-3 sm:px-6 md:px-10 lg:px-16 py-10 sm:py-16">
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8 space-y-1">
          <h2 className="font-heading text-lg sm:text-xl font-bold text-black dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Everything you need to know about our courses, academic structure, and campus admissions.
          </p>
        </div>

        <div className="space-y-2.5 sm:space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} className="border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900/80 shadow-2xs transition-all duration-200 rounded-xl">
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-3 text-left px-4 sm:px-5 py-3.5 sm:py-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <span className="flex items-center gap-2.5 sm:gap-3">
                    <HelpCircle size={16} className="text-teal-600 dark:text-teal-400 shrink-0" />
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{faq.question}</span>
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-teal-600 dark:text-teal-400" : ""}`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-200 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed px-4 sm:px-5 pb-4 pl-9 sm:pl-11 font-normal">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── UNBOXED ADMISSIONS ACTION SECTION ── */}
      <section className="py-12 sm:py-16 md:py-20 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-10 lg:px-16 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-black dark:text-white tracking-tight">
              Ready to begin your educational journey?
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm sm:text-base leading-relaxed font-normal max-w-xl mx-auto">
              Join students learning under qualified scholars in a structured, supportive academic environment.
            </p>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:items-center sm:justify-center sm:gap-3 pt-2 max-w-md mx-auto sm:max-w-none">
              <Link
                to="/apply"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold px-3 sm:px-6 py-2.5 sm:py-3 shadow-xs transition-all text-xs sm:text-sm rounded-xl hover:shadow-md active:scale-98"
              >
                <span className="truncate">Apply Now</span>
                <ArrowRight size={14} className="shrink-0" />
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-3 sm:px-6 py-2.5 sm:py-3 transition-all text-xs sm:text-sm rounded-xl hover:shadow-md active:scale-98"
              >
                <span className="truncate">Contact Us</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;