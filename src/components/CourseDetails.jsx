"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "@/lib/navigation-adapter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCourses } from "@/lib/queries";
import api from "@/lib/api";
import {
  Clock,
  Users,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Loader2,
  AlertTriangle,
  Eye,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Calendar,
  Languages,
  Award,
  ZoomIn,
  Maximize2,
  X,
  FileText,
  BookmarkCheck,
  Compass,
} from "lucide-react";
import CourseCard from "./CourseCard.jsx";
import ApiErrorState from "./ApiErrorState.jsx";
import { LogoImg, GreenDecorationBg, getImageUrl } from "../assets/assets.js";

// Clean out artificial word-break tags, soft hyphens, and zero-width artifacts
function cleanCourseDetail(rawHtml) {
  if (!rawHtml) return "";
  return rawHtml
    .replace(/<wbr\s*\/?>/gi, "")
    .replace(/&shy;/gi, "")
    .replace(/[\u00AD\u200B\u200C\u200D\uFEFF]/g, "")
    .replace(/&nbsp;/g, " ");
}

function CourseDetails() {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const { data: allCourses = [], isLoading: isAllCoursesLoading } = useCourses();
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);

  // Scroll to top whenever slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  // Handle ESC key and scroll lock for lightbox
  useEffect(() => {
    if (!isFullscreenImage) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsFullscreenImage(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreenImage]);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["course", slug],
    queryFn: async () => {
      if (!slug || slug === "undefined" || slug === "null") {
        throw new Error("Invalid course slug");
      }
      const encoded = encodeURIComponent(slug);
      const res = await api.get(`/api/courses/${encoded}`);
      if (res.data?.course) return res.data.course;
      throw new Error("Course not found");
    },
    initialData: () => {
      const all = queryClient.getQueryData(["courses"]);
      if (!Array.isArray(all)) return undefined;
      try {
        const decoded = decodeURIComponent(slug || "");
        return (
          all.find(
            (c) =>
              c.slug === slug ||
              c.slug === decoded ||
              c._id === slug ||
              c.title?.toLowerCase() === decoded.toLowerCase()
          ) || undefined
        );
      } catch {
        return all.find((c) => c.slug === slug || c._id === slug);
      }
    },
  });

  // Filter other courses for "More Courses to Explore"
  const moreCourses = useMemo(() => {
    if (!Array.isArray(allCourses)) return [];
    return allCourses
      .filter((c) => (c.slug ? c.slug !== slug : c._id !== data?._id) && c._id !== data?._id)
      .slice(0, 3);
  }, [allCourses, slug, data]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#080f19] flex flex-col items-center justify-center gap-3">
        <Loader2 size={36} className="animate-spin text-[#0D9488]" />
        <p className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider">Loading Course Details...</p>
      </div>
    );
  }

  const isNotFound = error?.response?.status === 404 || (!data && !isLoading && !isError);

  if (isNotFound || (isError && error?.response?.status === 404)) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#080f19] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400">
          <AlertTriangle size={32} />
        </div>
        <h2 className="font-heading text-2xl font-bold text-slate-800 dark:text-white mb-2">Course Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6 text-xs sm:text-sm max-w-md font-normal">
          The requested course program does not exist, has been renamed, or was temporarily moved.
        </p>
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 bg-[#0D9488] hover:bg-[#0F766E] text-white px-5 py-2.5 rounded-xl font-bold transition-all text-xs sm:text-sm shadow-xs"
        >
          <ArrowLeft size={15} /> Back to All Courses
        </Link>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#080f19] flex items-center justify-center p-4">
        <ApiErrorState
          variant="page"
          title="Unable to load course details"
          message="We couldn't retrieve this syllabus from the server. Check your network connection and click refresh."
          onRetry={refetch}
          isRetrying={isFetching}
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#080f19] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400">
          <AlertTriangle size={32} />
        </div>
        <h2 className="font-heading text-2xl font-bold text-slate-800 dark:text-white mb-2">Course Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6 text-xs sm:text-sm max-w-md font-normal">
          The requested course program does not exist, has been renamed, or was temporarily taken down for syllabus updates.
        </p>
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 bg-[#0D9488] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#0F766E] transition-all text-xs sm:text-sm shadow-2xs"
        >
          <ArrowLeft size={15} /> Back to All Courses
        </Link>
      </div>
    );
  }

  const course = data;
  const enrolledCount = course.applicationCount || course.students || 0;
  const heroBgImage = GreenDecorationBg;
  const hasRichDetail = Boolean(
    course.detail &&
    (course.detail.replace(/<[^>]*>/g, "").trim().length > 0 || course.detail.includes("<img") || course.detail.includes("<iframe"))
  );

  const processedDetail = useMemo(() => {
    return cleanCourseDetail(course?.detail || "");
  }, [course?.detail]);

  return (
    <div className="bg-white dark:bg-[#080f19] font-sans text-slate-800 dark:text-slate-100 min-h-screen">
      {/* ── 1. Top Part / Hero Section (Title & Description at Top) ── */}
      <section className="relative text-white overflow-hidden border-b border-teal-900/30">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBgImage}
            alt="Course Background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-slate-950/70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-10 sm:pb-14">
          {/* Breadcrumb / Back Link */}
          <div className="mb-4 sm:mb-6">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all font-mono uppercase tracking-wider"
            >
              <ArrowLeft size={14} /> Back to Courses
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
            {/* Left / Main Column: Title & Description in Top Part */}
            <div className="lg:col-span-8 space-y-4 sm:space-y-6">
              {/* Meta Badges */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                {course.level && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-400/40 text-emerald-200 text-[10.5px] sm:text-[11px] font-bold font-mono tracking-wider uppercase backdrop-blur-md shadow-xs">
                    <Sparkles size={12} className="text-emerald-300" />
                    <span>{course.level} Level</span>
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-black/40 border border-white/20 text-slate-100 text-[10.5px] sm:text-[11px] font-semibold font-mono tracking-wider backdrop-blur-md shadow-xs">
                  <GraduationCap size={13} className="text-teal-300" />
                  <span>Curriculum</span>
                </span>
                {course.duration && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-black/40 border border-white/20 text-slate-100 text-[10.5px] sm:text-[11px] font-semibold font-mono tracking-wider backdrop-blur-md shadow-xs">
                    <Clock size={12} className="text-emerald-300" />
                    <span>{course.duration}</span>
                  </span>
                )}
              </div>

              {/* Course Title (Prominent Top Part) */}
              <h1 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-3.5xl font-extrabold text-white leading-snug sm:leading-tight tracking-tight drop-shadow-md break-words">
                {course.title}
              </h1>

              {/* Course Short Description (Lead Excerpt in Top Part) */}
              {course.description ? (
                <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-normal max-w-3xl drop-shadow-xs">
                  {course.description}
                </p>
              ) : null}

              {/* Action Buttons & Stat Details in Top Part */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
                <Link
                  to={`/apply?course=${encodeURIComponent(course.title)}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0D9488] hover:bg-[#0F766E] text-white px-5 sm:px-6 py-3 rounded-xl font-bold transition-all text-xs sm:text-sm shadow-md active:scale-95 text-center"
                >
                  <span>Apply for this Course</span>
                  <ArrowRight size={15} />
                </Link>

                <Link
                  to="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold backdrop-blur-md border border-white/20 transition-all text-center"
                >
                  <span>Inquire Admissions</span>
                </Link>

                {/* Enrollment & View stats */}
                <div className="flex items-center justify-start sm:justify-start gap-4 text-xs text-slate-300 font-mono pt-1 sm:pt-0 sm:ml-2">
                  <span className="flex items-center gap-1.5">
                    <Users size={14} className="text-emerald-300" />
                    <span>{enrolledCount} Enrolled</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye size={14} className="text-emerald-300" />
                    <span>{course.views ?? 0} Views</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Preview Image (Optional, Clean) */}
            {course.image && (
              <div className="lg:col-span-4 w-full">
                <div
                  onClick={() => setIsFullscreenImage(true)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setIsFullscreenImage(true);
                  }}
                  title="Click to view full image"
                  className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/20 shadow-2xl bg-slate-900/80 backdrop-blur-md aspect-[16/10] sm:aspect-[16/11] group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0D9488] max-w-md mx-auto lg:max-w-none"
                >
                  <img
                    src={getImageUrl(course.image, LogoImg)}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = LogoImg;
                    }}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/80 text-white text-xs font-semibold backdrop-blur-md border border-white/20 shadow-lg">
                      <ZoomIn size={14} />
                      <span>View Full Image</span>
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 p-1.5 rounded-md bg-black/60 text-white opacity-70 group-hover:opacity-100 backdrop-blur-xs transition-opacity">
                    <Maximize2 size={13} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 2. Course Details & Syllabus Section (Clean, Unboxed, Professional Design - No Cards UI) ── */}
      <section className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Main Content Area (8 Cols) - Open Editorial Prose, No Boxed Cards */}
          <div className="lg:col-span-8 min-w-0 w-full space-y-8">
            
            {/* Rich Text Detail / Course Syllabus Section */}
            {hasRichDetail ? (
              <div className="space-y-5 min-w-0 w-full">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2.5">
                  <FileText size={20} className="text-[#0D9488] dark:text-teal-400" />
                  <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white tracking-tight">
                    Course Syllabus &amp; Curriculum Detail
                  </h2>
                </div>

                {/* Render Rich HTML Content from Quill - Styled matching Blog Detail */}
                <div className="prose prose-slate dark:prose-invert max-w-full min-w-0 w-full break-normal hyphens-none [word-break:normal] [overflow-wrap:break-word] text-xs sm:text-sm md:text-[15px] leading-relaxed prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-white prose-h1:text-xl sm:prose-h1:text-2xl prose-h2:text-lg sm:prose-h2:text-xl prose-h3:text-base sm:prose-h3:text-lg prose-p:text-slate-700 dark:prose-p:text-slate-200 prose-p:my-2.5 sm:prose-p:my-3 prose-p:leading-relaxed prose-ul:my-2.5 sm:prose-ul:my-3 prose-ul:list-disc prose-ul:pl-5 prose-ol:my-2.5 sm:prose-ol:my-3 prose-ol:list-decimal prose-ol:pl-5 prose-li:my-1 prose-a:text-teal-600 dark:prose-a:text-teal-400 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl sm:prose-img:rounded-2xl prose-img:shadow-sm [&_img]:max-w-full [&_img]:h-auto prose-blockquote:border-l-4 prose-blockquote:border-l-[#0D9488] prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-900 prose-blockquote:py-2.5 prose-blockquote:px-3 sm:prose-blockquote:px-4 prose-blockquote:rounded-r-xl prose-blockquote:text-slate-700 dark:prose-blockquote:text-slate-300 prose-blockquote:not-italic prose-strong:text-slate-900 dark:prose-strong:text-white prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:text-[#0D9488] dark:prose-code:text-teal-300 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:max-w-full prose-pre:overflow-x-auto [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:block [&_iframe]:max-w-full [&_iframe]:w-full [&_iframe]:aspect-video overflow-hidden">
                  <div
                    className="course-content blog-content max-w-full min-w-0 break-normal hyphens-none text-slate-800 dark:text-slate-200 overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: processedDetail }}
                  />
                </div>
              </div>
            ) : (
              /* Fallback when rich detail is empty */
              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2.5">
                  <BookOpen size={20} className="text-[#0D9488] dark:text-teal-400" />
                  <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white tracking-tight">
                    Course Information &amp; Objectives
                  </h2>
                </div>

                <div className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed space-y-4 font-normal">
                  {course.description ? (
                    <p>{course.description}</p>
                  ) : (
                    <p className="text-slate-400 dark:text-slate-500 italic">
                      Detailed syllabus guidelines for this course will be provided upon admission.
                    </p>
                  )}
                </div>

                <div className="pt-4 space-y-3">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-heading">
                    What Students Learn in this Program:
                  </h3>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-[#0D9488] dark:text-teal-400 shrink-0 mt-0.5" />
                      <span>Structured study modules under certified scholarly guidance.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-[#0D9488] dark:text-teal-400 shrink-0 mt-0.5" />
                      <span>Regular recitation, assessment, and interactive revision sessions.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-[#0D9488] dark:text-teal-400 shrink-0 mt-0.5" />
                      <span>Accredited certificate issued upon successful completion of term examinations.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Clean Editorial Admission Notice */}
            <div className="pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0D9488] dark:text-teal-400">
                  Admissions Open
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading">
                  Ready to enroll in {course.title}?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg">
                  Submit our quick online registration form or contact our academic desk.
                </p>
              </div>

              <Link
                to={`/apply?course=${encodeURIComponent(course.title)}`}
                className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold px-6 py-3 rounded-xl transition-all text-xs sm:text-sm shadow-xs active:scale-95 text-center"
              >
                <span>Apply Now</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Sidebar / Meta Rail (4 Cols) - Clean, Unboxed Typography */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border-t-2 border-[#0D9488] pt-5 space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-900 dark:text-white">
                Program Specifications
              </h3>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                {course.level && (
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-mono">Academic Level</span>
                    <span className="font-bold text-slate-900 dark:text-white">{course.level}</span>
                  </div>
                )}

                {course.duration && (
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-mono">Duration</span>
                    <span className="font-bold text-slate-900 dark:text-white">{course.duration}</span>
                  </div>
                )}

                <div className="py-3 flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-mono">Active Students</span>
                  <span className="font-bold text-slate-900 dark:text-white">{enrolledCount}</span>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-mono">Certification</span>
                  <span className="font-bold text-slate-900 dark:text-white">Al-Mukhtar Certified</span>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-mono">Study Mode</span>
                  <span className="font-bold text-slate-900 dark:text-white">Morning / Evening</span>
                </div>
              </div>

              {/* Direct Quick Action Buttons */}
              <div className="space-y-2 pt-2">
                <Link
                  to={`/apply?course=${encodeURIComponent(course.title)}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold py-2.5 px-4 rounded-lg transition-all text-xs text-center shadow-xs"
                >
                  <span>Submit Application</span>
                  <ArrowRight size={14} />
                </Link>

                <Link
                  to="/contact"
                  className="w-full inline-flex items-center justify-center gap-1.5 border border-slate-300 dark:border-slate-700 hover:border-[#0D9488] dark:hover:border-teal-400 text-slate-700 dark:text-slate-200 font-bold py-2.5 px-4 rounded-lg transition-all text-xs text-center"
                >
                  <span>Contact Admissions</span>
                </Link>
              </div>
            </div>

            {/* Institute Commitment Note */}
            <div className="border-l-2 border-slate-300 dark:border-slate-700 pl-4 py-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              <p className="font-medium text-slate-700 dark:text-slate-300">Certified Scholarly Sanad</p>
              <p className="mt-1">
                Every curriculum at Al-Mukhtar is structured according to authentic classical methodologies combined with modern pedagogy.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. More Courses to Explore Section (Clean Bottom Catalog) ── */}
      <section className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0a1420]/50 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#0D9488] dark:text-teal-400 font-mono tracking-wider uppercase">
                Explore Curricula
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                More Courses to Explore
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-xl font-normal">
                Discover our other academic pathways and classical disciplines.
              </p>
            </div>

            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D9488] dark:text-teal-400 hover:text-[#0F766E] font-mono uppercase tracking-wider transition-colors shrink-0"
            >
              <span>View All Courses</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Courses Grid */}
          {isAllCoursesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3 animate-pulse">
                  <div className="w-full h-40 bg-slate-100 dark:bg-slate-800" />
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : moreCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {moreCourses.map((c) => (
                <CourseCard key={c._id || c.slug} course={c} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-xs text-slate-500 dark:text-slate-400">No additional courses available right now.</p>
              <Link to="/courses" className="inline-block mt-3 text-xs text-[#0D9488] dark:text-teal-400 font-bold">
                Browse Course Catalog
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── 4. Fullscreen Course Image Lightbox Preview ── */}
      {isFullscreenImage && course.image && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[1000000] flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200"
        >
          <div
            onClick={() => setIsFullscreenImage(false)}
            className="fixed inset-0 cursor-zoom-out"
          />

          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsFullscreenImage(false)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/20 backdrop-blur-md shadow-xl transition-all cursor-pointer group"
            >
              <X size={16} className="group-hover:rotate-90 transition-transform" />
              <span>Close Preview</span>
            </button>
          </div>

          <div className="relative z-10 max-w-[90vw] max-h-[75vh] flex flex-col items-center justify-center">
            <img
              src={course.image}
              alt={course.title || "Course full image"}
              className="max-w-full max-h-[70vh] object-contain shadow-2xl border border-white/10"
            />
            {course.title && (
              <p className="mt-2.5 text-xs sm:text-sm text-slate-300 font-medium text-center bg-black/60 px-4 py-1 rounded-full border border-white/10 backdrop-blur-md max-w-lg truncate">
                {course.title}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseDetails;