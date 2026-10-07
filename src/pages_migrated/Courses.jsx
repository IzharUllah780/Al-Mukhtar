"use client";

import React from "react";
import { useCourses } from "@/lib/queries";
import { BookOpen, Loader2, Sparkles } from "lucide-react";
import CourseCard from "../components/CourseCard.jsx";
import ApiErrorState from "../components/ApiErrorState.jsx";

function Courses() {
  const {
    data: courses = [],
    isLoading,
    isError,
    refetch,
  } = useCourses();

  return (
    <div className="bg-white dark:bg-[#070d18] font-sans text-slate-800 dark:text-slate-100 min-h-screen transition-colors duration-200">
      {/* Clean Hero Section */}
      <section className="pt-8 sm:pt-12 pb-4">
        <div className="max-w-7xl mx-auto px-3 sm:px-10 lg:px-16 text-left space-y-3">
          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-black dark:text-white leading-tight tracking-tight">
            Explore Our Courses
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed font-normal">
            Structured Islamic scholarship, Quranic disciplines, and Arabic linguistics taught by certified faculty designed for every stage of your educational pursuit.
          </p>
        </div>
      </section>

      {/* Courses Grid Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-10 lg:px-16 pt-4 pb-10 sm:pb-14">
        {isLoading && courses.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden animate-pulse">
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

        {isError && courses.length === 0 && (
          <ApiErrorState
            title="Unable to load academic programs"
            message="We couldn't connect to the curriculum server. Please check your network and click refresh."
            onRetry={refetch}
            className="my-8"
          />
        )}

        {!isLoading && !isError && courses.length === 0 && (
          <div className="text-center py-16 bg-slate-50/60 dark:bg-slate-900/40 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 max-w-md mx-auto">
            <BookOpen size={44} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-800 dark:text-slate-100 text-base font-bold font-heading">No courses available right now</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Check back soon — new course terms are being scheduled.</p>
          </div>
        )}

        {courses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-start">
            {courses.map((course) => (
              <CourseCard key={course._id || course.slug} course={course} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Courses;