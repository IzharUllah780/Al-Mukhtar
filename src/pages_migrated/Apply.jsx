"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  User,
  Users,
  MessageCircle,
  Phone,
  Clock,
  GraduationCap,
  MapPin,
  CreditCard,
  Calendar,
  BookOpen,
  CheckCircle2,
  Send,
  ShieldCheck,
  PhoneCall,
  LogIn,
  Lock,
  ArrowRight,
  Info,
  Sparkles,
  FileText,
  HelpCircle,
  Mail,
  Check,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "@/lib/navigation-adapter";
import { useAuth } from "@/context/AuthContext";
import { useCourses } from "@/lib/queries";
import ApiErrorState from "../components/ApiErrorState.jsx";
import { GreenDecorationBg } from "../assets/assets.js";

const qualificationOptions = [
  "Primary",
  "Middle",
  "Matric",
  "Intermediate",
  "Bachelors",
  "Masters",
  "Other",
];

const admissionGuidelines = [
  {
    step: "01",
    title: "Application Submission",
    text: "Complete all required fields accurately. Select your target course and desired study shift.",
  },
  {
    step: "02",
    title: "Credentials Verification",
    text: "Admissions officers review your submitted profile and contact you via WhatsApp/Phone in 1–2 working days.",
  },
  {
    step: "03",
    title: "Enrollment & Orientation",
    text: "Upon verification, receive your roll number, class timetable, and orientation schedule.",
  },
];

function Apply() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: courses = [],
    isLoading: coursesLoading,
    isError: coursesError,
    refetch: refetchCourses,
  } = useCourses();

  const searchParams = new URLSearchParams(location.search);
  const targetCourseParam = searchParams.get("course");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      course: "",
    },
  });

  // Pre-select the course when arriving with ?course= query param
  useEffect(() => {
    if (!targetCourseParam) return;
    const rawTarget = decodeURIComponent(targetCourseParam).trim();
    if (!rawTarget) return;

    if (courses && courses.length > 0) {
      const lower = rawTarget.toLowerCase();
      const cleanTarget = lower.replace(/[^a-z0-9]/g, "");

      const matched = courses.find((c) => {
        const titleLower = (c.title || "").trim().toLowerCase();
        const slugLower = (c.slug || "").trim().toLowerCase();
        const idStr = (c._id || "").toString();

        const cleanTitle = titleLower.replace(/[^a-z0-9]/g, "");
        const cleanSlug = slugLower.replace(/[^a-z0-9]/g, "");

        return (
          titleLower === lower ||
          slugLower === lower ||
          idStr === rawTarget ||
          (cleanTarget && (cleanSlug === cleanTarget || cleanTitle === cleanTarget)) ||
          (cleanTarget.length > 3 && (cleanTitle.includes(cleanTarget) || cleanTarget.includes(cleanTitle)))
        );
      });

      if (matched) {
        setValue("course", matched.slug || matched.title, { shouldValidate: true });
      } else {
        setValue("course", rawTarget, { shouldValidate: false });
      }
    }
  }, [targetCourseParam, courses, setValue]);

  const submitMutation = useMutation({
    mutationFn: (data) => api.post("/api/applications", data),
    onSuccess: (res) => {
      setSubmitted(true);
      reset();
      window.scrollTo({ top: 0, behavior: "smooth" });

      if (res.data?.application) {
        queryClient.setQueryData(["myApplications"], (old) => {
          const prev = Array.isArray(old) ? old : [];
          return [res.data.application, ...prev.filter((a) => a._id !== res.data.application._id)];
        });
      }

      queryClient.invalidateQueries({ queryKey: ["myApplications"] });
      queryClient.refetchQueries({ queryKey: ["myApplications"], type: "active" });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["application-stats"] });
      queryClient.invalidateQueries({ queryKey: ["applicationStats"] });
    },
  });

  const onSubmit = (data) => {
    submitMutation.mutate(data);
  };

  // ── Loading Skeleton ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white dark:bg-slate-950 px-4">
        <div className="w-9 h-9 border-3 border-teal-200 dark:border-teal-900 border-t-teal-600 rounded-full animate-spin" />
      </div>
    );
  }

  // ── Auth Guard Gate ────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 min-h-screen transition-colors">
        {/* Hero Banner */}
        <section className="relative overflow-hidden bg-slate-950 text-white py-8 sm:py-12 border-b border-slate-800">
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src={GreenDecorationBg}
              alt="Al-Mukhtar Admissions"
              className="w-full h-full object-cover object-center opacity-70 sm:opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-950/65" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/50" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white font-heading tracking-tight leading-tight">
              Apply for Course Admission
            </h1>
            <p className="mt-2 text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Submit your formal application for Islamic studies and classical Arabic programs at Al-Mukhtar Institute.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-14">
          <div className="py-2 space-y-6 max-w-2xl bg-white dark:bg-slate-900/60 rounded-2xl p-5 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start gap-4 text-slate-700 dark:text-slate-300">
              <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 border border-teal-100 dark:border-teal-900/50">
                <Lock size={20} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading leading-snug">
                  Authentication Required to Submit Application
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  To securely link your admission profile, track your verification status, and receive direct updates, please sign in or register an account.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                to={`/login?redirect=${encodeURIComponent(location.pathname + (location.search || ""))}`}
                className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 sm:py-2.5 rounded-xl transition-all text-xs sm:text-sm shadow-xs active:scale-[0.98]"
              >
                <LogIn size={16} />
                <span>Sign In to Continue</span>
              </Link>
              <Link
                to={`/signup?redirect=${encodeURIComponent(location.pathname + (location.search || ""))}`}
                className="inline-flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-600 font-semibold px-6 py-3 sm:py-2.5 rounded-xl transition-all text-xs sm:text-sm active:scale-[0.98]"
              >
                <span>Create an Account</span>
              </Link>
            </div>

            <div className="pt-5 border-t border-slate-100 dark:border-slate-800/80">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Want to review programs first?{" "}
                <Link to="/courses" className="text-teal-600 dark:text-teal-400 font-semibold hover:underline">
                  Explore academic courses &rarr;
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 min-h-screen transition-colors">
      
      {/* ── Page Hero with Green Leaves Background ── */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-6 sm:py-10 border-b border-slate-800">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={GreenDecorationBg}
            alt="Al-Mukhtar Admissions"
            className="w-full h-full object-cover object-center opacity-70 sm:opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-950/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/45" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[11px] font-mono font-medium mb-1">
                <Sparkles size={12} className="text-teal-400" />
                <span>Admissions Open 2026</span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white font-heading tracking-tight leading-tight">
                Online Admission Application
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Complete your admission application below. All applications are reviewed by the academic registrar office within 1–2 business days.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300 font-mono shrink-0">
              <span className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 backdrop-blur-xs flex items-center gap-2">
                <User size={13} className="text-teal-400 shrink-0" />
                <span className="truncate max-w-[220px]">
                  Applicant: <strong className="text-white">{user.name || user.email}</strong>
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content Area ─────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-12">
        {submitted ? (
          /* ── Submission Confirmation ─────────────────────── */
          <div className="max-w-3xl py-4 sm:py-6 animate-in fade-in duration-300">
            <div className="p-5 sm:p-8 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50 mb-8">
              <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-3">
                <CheckCircle2 size={28} className="shrink-0" />
                <span className="text-xs font-bold uppercase tracking-widest font-mono">
                  Submission Confirmed
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight mb-3">
                Application Successfully Registered
              </h2>

              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Thank you for applying to Al-Mukhtar Institute. Our admissions office has received your credentials. An admissions representative will contact you via WhatsApp or phone call within <strong>1–2 working days</strong> for verification and timetable confirmation.
              </p>
            </div>

            <div className="border-t border-b border-slate-200 dark:border-slate-800 py-6 mb-8 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
                Admission Timeline & Procedure
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
                <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
                  <div className="text-xs font-bold font-mono text-teal-600 dark:text-teal-400 mb-1">
                    STEP 01
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1">
                    Credential Review
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Verification of CNIC/B-Form, age requirements, and academic background.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
                  <div className="text-xs font-bold font-mono text-teal-600 dark:text-teal-400 mb-1">
                    STEP 02
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1">
                    Counseling & Shift
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Admissions call to finalize shift timings and answer curriculum questions.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
                  <div className="text-xs font-bold font-mono text-teal-600 dark:text-teal-400 mb-1">
                    STEP 03
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1">
                    Orientation & Roll No.
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Official enrollment slip issuance and orientation day on campus.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 sm:py-2.5 rounded-xl transition-all text-xs sm:text-sm shadow-xs active:scale-[0.98] cursor-pointer"
              >
                <span>Submit Another Application</span>
              </button>
              <Link
                to="/profile"
                className="inline-flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-600 font-semibold px-6 py-3 sm:py-2.5 rounded-xl transition-all text-xs sm:text-sm active:scale-[0.98]"
              >
                <span>View My Applications</span>
              </Link>
              <Link
                to="/courses"
                className="inline-flex items-center justify-center gap-2 text-teal-600 dark:text-teal-400 hover:underline font-semibold px-4 py-2.5 text-xs sm:text-sm"
              >
                <span>Browse More Courses</span>
              </Link>
            </div>
          </div>
        ) : (
          /* ── Open Editorial Form Layout ────────────────────────────────────── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-14 items-start">
            
            {/* Left / Main Column: The Application Form */}
            <div className="lg:col-span-8">
              {submitMutation.isError && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs sm:text-sm text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
                  <Info size={16} className="shrink-0 text-rose-500 mt-0.5" />
                  <span>
                    {submitMutation.error?.response?.data?.message || "An error occurred while submitting your application. Please verify details and try again."}
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8 sm:space-y-10">
                
                {/* Section 1: Personal Details */}
                <div className="bg-white dark:bg-slate-900/40 p-4 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
                  <div className="flex items-center gap-2.5 pb-3.5 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 uppercase tracking-wider border border-teal-200/60 dark:border-teal-800/60">
                      Section 01
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-heading">
                      Personal Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 sm:gap-y-5 pt-4 sm:pt-5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="e.g. Muhammad Usman"
                          className={`w-full pl-10 pr-3.5 py-3 sm:py-2.5 rounded-xl text-base sm:text-sm bg-slate-50/70 dark:bg-slate-900 text-slate-900 dark:text-white border placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors ${
                            errors.name ? "border-rose-500 bg-rose-50/30" : "border-slate-200 dark:border-slate-700/80"
                          }`}
                          {...register("name", {
                            required: "Full name is required",
                            pattern: {
                              value: /^[A-Za-z\s]{3,50}$/,
                              message: "Enter a valid name (letters only)",
                            },
                          })}
                        />
                      </div>
                      {errors.name && (
                        <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Father's Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                        Father's Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Users size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="e.g. Abdul Rahman"
                          className={`w-full pl-10 pr-3.5 py-3 sm:py-2.5 rounded-xl text-base sm:text-sm bg-slate-50/70 dark:bg-slate-900 text-slate-900 dark:text-white border placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors ${
                            errors.fatherName ? "border-rose-500 bg-rose-50/30" : "border-slate-200 dark:border-slate-700/80"
                          }`}
                          {...register("fatherName", {
                            required: "Father's name is required",
                            pattern: {
                              value: /^[A-Za-z\s]{3,50}$/,
                              message: "Enter a valid name (letters only)",
                            },
                          })}
                        />
                      </div>
                      {errors.fatherName && (
                        <p className="text-xs text-rose-500 mt-1 font-medium">{errors.fatherName.message}</p>
                      )}
                    </div>

                    {/* Age */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                        Age (Years) <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                          type="number"
                          placeholder="e.g. 19"
                          className={`w-full pl-10 pr-3.5 py-3 sm:py-2.5 rounded-xl text-base sm:text-sm bg-slate-50/70 dark:bg-slate-900 text-slate-900 dark:text-white border placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors ${
                            errors.age ? "border-rose-500 bg-rose-50/30" : "border-slate-200 dark:border-slate-700/80"
                          }`}
                          {...register("age", {
                            required: "Age is required",
                            valueAsNumber: true,
                            min: { value: 4, message: "Age must be at least 4" },
                            max: { value: 70, message: "Age must be 70 or below" },
                          })}
                        />
                      </div>
                      {errors.age && (
                        <p className="text-xs text-rose-500 mt-1 font-medium">{errors.age.message}</p>
                      )}
                    </div>

                    {/* CNIC / B-Form */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                        CNIC / B-Form Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <CreditCard size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="12345-1234567-1"
                          className={`w-full pl-10 pr-3.5 py-3 sm:py-2.5 rounded-xl text-base sm:text-sm bg-slate-50/70 dark:bg-slate-900 text-slate-900 dark:text-white border placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors ${
                            errors.cnic ? "border-rose-500 bg-rose-50/30" : "border-slate-200 dark:border-slate-700/80"
                          }`}
                          {...register("cnic", {
                            required: "CNIC / B-Form number is required",
                            pattern: {
                              value: /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/,
                              message: "Format: 12345-1234567-1",
                            },
                          })}
                        />
                      </div>
                      {errors.cnic ? (
                        <p className="text-xs text-rose-500 mt-1 font-medium">{errors.cnic.message}</p>
                      ) : (
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                          Format: 5 digits - 7 digits - 1 digit
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 2: Academic Program & Shift Selection */}
                <div className="bg-white dark:bg-slate-900/40 p-4 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
                  <div className="flex items-center gap-2.5 pb-3.5 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 uppercase tracking-wider border border-teal-200/60 dark:border-teal-800/60">
                      Section 02
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-heading">
                      Academic Choice & Background
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 sm:gap-y-5 pt-4 sm:pt-5">
                    {/* Course Selection */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                        Desired Course / Program <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <BookOpen size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <select
                          className={`w-full pl-10 pr-8 py-3 sm:py-2.5 rounded-xl text-base sm:text-sm bg-slate-50/70 dark:bg-slate-900 text-slate-900 dark:text-white border focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors appearance-none cursor-pointer ${
                            errors.course ? "border-rose-500 bg-rose-50/30" : "border-slate-200 dark:border-slate-700/80"
                          }`}
                          {...register("course", {
                            required: "Please select a course",
                          })}
                        >
                          <option value="" disabled>
                            {coursesLoading ? "Loading available courses..." : coursesError ? "Unable to load courses" : "Select an academic program"}
                          </option>
                          {!coursesLoading && !coursesError && courses?.length > 0 ? (
                            courses.map((course) => (
                              <option key={course._id} value={course.slug || course.title}>
                                {course.title}
                              </option>
                            ))
                          ) : null}
                        </select>
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                          ▼
                        </div>
                      </div>
                      {coursesError && (
                        <div className="mt-2">
                          <ApiErrorState variant="inline" title="Failed to load courses" onRetry={refetchCourses} />
                        </div>
                      )}
                      {errors.course && (
                        <p className="text-xs text-rose-500 mt-1 font-medium">{errors.course.message}</p>
                      )}
                    </div>

                    {/* Preferred Shift */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                        Preferred Shift <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Clock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <select
                          defaultValue=""
                          className={`w-full pl-10 pr-8 py-3 sm:py-2.5 rounded-xl text-base sm:text-sm bg-slate-50/70 dark:bg-slate-900 text-slate-900 dark:text-white border focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors appearance-none cursor-pointer ${
                            errors.shift ? "border-rose-500 bg-rose-50/30" : "border-slate-200 dark:border-slate-700/80"
                          }`}
                          {...register("shift", {
                            required: "Please select your preferred study shift",
                          })}
                        >
                          <option value="" disabled>Select shift</option>
                          <option value="morning">Morning Shift (Standard)</option>
                          <option value="evening">Evening Shift (Afternoon/Evening)</option>
                        </select>
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                          ▼
                        </div>
                      </div>
                      {errors.shift && (
                        <p className="text-xs text-rose-500 mt-1 font-medium">{errors.shift.message}</p>
                      )}
                    </div>

                    {/* Previous Qualification */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                        Prior Qualification <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <GraduationCap size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <select
                          defaultValue=""
                          className={`w-full pl-10 pr-8 py-3 sm:py-2.5 rounded-xl text-base sm:text-sm bg-slate-50/70 dark:bg-slate-900 text-slate-900 dark:text-white border focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors appearance-none cursor-pointer ${
                            errors.qualification ? "border-rose-500 bg-rose-50/30" : "border-slate-200 dark:border-slate-700/80"
                          }`}
                          {...register("qualification", {
                            required: "Please select your latest qualification",
                          })}
                        >
                          <option value="" disabled>Select prior qualification</option>
                          {qualificationOptions.map((q) => (
                            <option key={q} value={q}>{q}</option>
                          ))}
                        </select>
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                          ▼
                        </div>
                      </div>
                      {errors.qualification && (
                        <p className="text-xs text-rose-500 mt-1 font-medium">{errors.qualification.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 3: Contact & Address */}
                <div className="bg-white dark:bg-slate-900/40 p-4 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
                  <div className="flex items-center gap-2.5 pb-3.5 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 uppercase tracking-wider border border-teal-200/60 dark:border-teal-800/60">
                      Section 03
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-heading">
                      Contact & Residential Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 sm:gap-y-5 pt-4 sm:pt-5">
                    {/* WhatsApp */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                        WhatsApp Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <MessageCircle size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                          type="tel"
                          placeholder="03001234567"
                          className={`w-full pl-10 pr-3.5 py-3 sm:py-2.5 rounded-xl text-base sm:text-sm bg-slate-50/70 dark:bg-slate-900 text-slate-900 dark:text-white border placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors ${
                            errors.whatsapp ? "border-rose-500 bg-rose-50/30" : "border-slate-200 dark:border-slate-700/80"
                          }`}
                          {...register("whatsapp", {
                            required: "WhatsApp number is required",
                            pattern: {
                              value: /^03[0-9]{9}$/,
                              message: "Enter 11-digit mobile (e.g. 03001234567)",
                            },
                          })}
                        />
                      </div>
                      {errors.whatsapp ? (
                        <p className="text-xs text-rose-500 mt-1 font-medium">{errors.whatsapp.message}</p>
                      ) : (
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                          We send application status updates via WhatsApp.
                        </p>
                      )}
                    </div>

                    {/* Secondary Mobile */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                        Secondary Phone / Mobile <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                          type="tel"
                          placeholder="03001234567"
                          className={`w-full pl-10 pr-3.5 py-3 sm:py-2.5 rounded-xl text-base sm:text-sm bg-slate-50/70 dark:bg-slate-900 text-slate-900 dark:text-white border placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors ${
                            errors.mobile ? "border-rose-500 bg-rose-50/30" : "border-slate-200 dark:border-slate-700/80"
                          }`}
                          {...register("mobile", {
                            required: "Mobile number is required",
                            pattern: {
                              value: /^03[0-9]{9}$/,
                              message: "Enter 11-digit mobile (e.g. 03001234567)",
                            },
                          })}
                        />
                      </div>
                      {errors.mobile && (
                        <p className="text-xs text-rose-500 mt-1 font-medium">{errors.mobile.message}</p>
                      )}
                    </div>

                    {/* Address */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                        Residential Address <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin size={15} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                        <textarea
                          rows={3}
                          placeholder="Complete residential address: House / Street, Area, City"
                          className={`w-full pl-10 pr-3.5 py-3 sm:py-2.5 rounded-xl text-base sm:text-sm bg-slate-50/70 dark:bg-slate-900 text-slate-900 dark:text-white border placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors ${
                            errors.address ? "border-rose-500 bg-rose-50/30" : "border-slate-200 dark:border-slate-700/80"
                          }`}
                          {...register("address", {
                            required: "Residential address is required",
                            minLength: {
                              value: 8,
                              message: "Please provide your full address",
                            },
                          })}
                        />
                      </div>
                      {errors.address && (
                        <p className="text-xs text-rose-500 mt-1 font-medium">{errors.address.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Action Bar */}
                <div className="pt-2 sm:pt-4 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <ShieldCheck size={16} className="text-teal-600 dark:text-teal-400 shrink-0" />
                    <span>Your submitted data is stored securely and used solely for admissions.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3.5 sm:py-3 rounded-xl transition-all text-sm shadow-xs disabled:opacity-60 cursor-pointer active:scale-[0.98]"
                  >
                    <span>{submitMutation.isPending ? "Submitting Application..." : "Submit Application"}</span>
                    <Send size={15} />
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Institutional Admissions Notes & Contacts */}
            <aside className="lg:col-span-4 space-y-6 lg:space-y-8 bg-slate-50/60 dark:bg-slate-900/40 rounded-2xl p-5 sm:p-6 lg:p-6 border border-slate-200/80 dark:border-slate-800/80 lg:sticky lg:top-24">
              
              {/* Guidelines */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                  <FileText size={16} />
                  <h3 className="text-xs font-bold uppercase tracking-widest font-mono text-slate-800 dark:text-slate-200">
                    Admissions Workflow
                  </h3>
                </div>
                <div className="space-y-4 pt-1">
                  {admissionGuidelines.map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <span className="text-xs font-bold font-mono text-teal-600 dark:text-teal-400 shrink-0 mt-0.5 px-1.5 py-0.5 bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/60 rounded">
                        {item.step}
                      </span>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {item.title}
                        </h4>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documentation Required */}
              <div className="pt-5 border-t border-slate-200/70 dark:border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                  <Check size={16} />
                  <h3 className="text-xs font-bold uppercase tracking-widest font-mono text-slate-800 dark:text-slate-200">
                    Required Documents
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Upon physical campus verification, applicants must present original CNIC / B-Form and 2 recent passport-size photographs.
                </p>
              </div>

              {/* Admissions Help Desk */}
              <div className="pt-5 border-t border-slate-200/70 dark:border-slate-800/80 space-y-2.5">
                <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                  <HelpCircle size={16} />
                  <h3 className="text-xs font-bold uppercase tracking-widest font-mono text-slate-800 dark:text-slate-200">
                    Admissions Help Desk
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Have questions about prerequisites, fee waivers, or shift schedules? Contact the admissions office directly:
                </p>
                <div className="pt-1.5 space-y-2 text-xs">
                  <div className="flex items-center gap-2.5">
                    <PhoneCall size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
                    <a href="tel:+923339176894" className="text-slate-700 dark:text-slate-300 font-semibold hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                      +92 333 9176894
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
                    <a href="mailto:izhar5ullah@gmail.com" className="text-slate-700 dark:text-slate-300 font-semibold hover:text-teal-600 dark:hover:text-teal-400 transition-colors truncate">
                      izhar5ullah@gmail.com
                    </a>
                  </div>
                </div>
              </div>

            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

export default Apply;