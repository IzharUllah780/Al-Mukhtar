"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate, useLocation, useSearchParams } from "@/lib/navigation-adapter";
import api from "@/lib/api";
import { Eye, EyeOff, BookOpen, Users, Award, ArrowLeft, Mail, Lock, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Logo, moon_light } from "../assets/assets.js";


function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || location.state?.from || "/";
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const loginMutation = useMutation({
    mutationFn: (data) => api.post("/api/auth/login", data),
    onSuccess: (response) => {
      login(response.data.user);
      navigate(redirectUrl, { replace: true });
    },
  });

  const getLoginErrorMessage = () => {
    const status = loginMutation.error?.response?.status;
    const msg = loginMutation.error?.response?.data?.message;

    if (status === 401) {
      return "Invalid credentials. Please check your email and password.";
    }
    if (status === 403) {
      return "Please verify your account before logging in.";
    }
    if (
      msg &&
      typeof msg === "string" &&
      !msg.toLowerCase().includes("mongo") &&
      !msg.toLowerCase().includes("topology") &&
      !msg.toLowerCase().includes("econn") &&
      !msg.toLowerCase().includes("error") &&
      msg.length < 80
    ) {
      return msg;
    }
    return "Something went wrong. Please try again.";
  };

  const onSubmit = (data) => {
    loginMutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="min-h-screen min-h-[100dvh] w-full flex bg-slate-50 dark:bg-[#070d18] font-sans transition-colors">
      {/* Left Panel - Branding (Desktop Large Screens Only) */}
      <div className="hidden lg:flex lg:w-[42%] relative bg-gradient-to-br from-[#0A2540] via-[#081E2E] to-[#0D9488] overflow-hidden">
        <img
          src={moon_light}
          alt=""
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-25 pointer-events-none"
        />
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#5EEAD4]/15 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#0D9488]/20 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-14 w-full">
          {/* Logo + Name */}
          <div className="flex items-center gap-3">
            <img
              src={Logo}
              alt="Madrasa Logo"
              className="w-11 h-11 rounded-xl object-cover ring-2 ring-[#5EEAD4]/40 shadow-sm"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-white font-brand font-bold text-xl tracking-tight leading-tight">
                Al-Mukhtar
              </span>
              <span className="text-[11px] text-[#5EEAD4]/80 font-normal">
                Where the chosen rise
              </span>
            </div>
          </div>

          {/* Main message */}
          <div className="py-8">
            <span className="inline-block text-[#5EEAD4] text-[11px] font-bold tracking-widest uppercase mb-3 font-mono">
              Welcome Back
            </span>
            <h1 className="font-heading text-3xl xl:text-4xl font-black text-white leading-tight mb-4 tracking-tight">
              Continue your journey of knowledge & faith
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm font-normal">
              Sign in to access your courses, track your applications, and connect with your instructors.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                <BookOpen size={16} className="text-[#5EEAD4]" />
              </div>
              <span className="text-xs text-slate-200 font-medium">
                Structured authentic curriculum
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                <Users size={16} className="text-[#5EEAD4]" />
              </div>
              <span className="text-xs text-slate-200 font-medium">
                Experienced, qualified scholars
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                <Award size={16} className="text-[#5EEAD4]" />
              </div>
              <span className="text-xs text-slate-200 font-medium">
                Recognized course certification
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form (Premium Brand App UI on Mobile, Centered Form on Desktop) */}
      <div className="w-full lg:w-[58%] flex flex-col justify-between items-center px-4 py-5 sm:px-10 sm:py-10 lg:px-14 lg:py-12 min-h-[100dvh] lg:min-h-screen overflow-y-auto">
        
        {/* Top Back Navigation (Clean Arrow + Text for both mobile and desktop) */}
        <div className="w-full max-w-[440px] flex items-center justify-start mb-5 self-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Main Content Card Container */}
        <div className="w-full max-w-[440px] flex-1 flex flex-col justify-center my-auto">
          
          {/* Brand Header */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left mb-7">
            {/* Brand Emblem on Mobile */}
            <div className="lg:hidden relative mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-teal-500/20">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center overflow-hidden p-1.5">
                  <img src={Logo} alt="Al-Mukhtar" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Sign in to Al-Mukhtar
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal mt-1.5 max-w-xs sm:max-w-none">
              Welcome back! Please enter your credentials to access your student portal.
            </p>
          </div>

          {loginMutation.isError && (
            <div className="mb-5 text-xs sm:text-sm text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 rounded-2xl px-4 py-3 font-medium space-y-1.5 animate-in fade-in duration-200">
              <p>{getLoginErrorMessage()}</p>
              {loginMutation.error?.response?.status === 403 && (
                <div className="pt-1">
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 dark:text-teal-400 underline hover:text-teal-700"
                  >
                    <span>Re-enter credentials in Signup to receive a fresh OTP</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
                  <Mail size={17} />
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`w-full pl-10 pr-4 py-3 sm:py-2.5 rounded-xl sm:rounded-xl border text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-all focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] dark:focus:border-[#0D9488] ${
                    errors.email
                      ? "border-rose-400 bg-rose-50/30 dark:bg-rose-950/20"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80"
                  }`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-500 mt-1 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-teal-600 dark:text-teal-400 font-bold hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
                  <Lock size={17} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full pl-10 pr-11 py-3 sm:py-2.5 rounded-xl sm:rounded-xl border text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-all focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] dark:focus:border-[#0D9488] ${
                    errors.password
                      ? "border-rose-400 bg-rose-50/30 dark:bg-rose-950/20"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80"
                  }`}
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition p-1.5 cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 mt-1 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full h-12 rounded-xl sm:rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold text-sm sm:text-base shadow-sm shadow-teal-600/25 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2 flex items-center justify-center cursor-pointer"
            >
              {loginMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing In...</span>
                </div>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono font-bold tracking-wider uppercase">OR</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Switch to Signup */}
          <div className="text-center">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{" "}
              <Link
                to={redirectUrl && redirectUrl !== "/" ? `/signup?redirect=${encodeURIComponent(redirectUrl)}` : "/signup"}
                className="text-teal-600 dark:text-teal-400 font-bold hover:underline inline-flex items-center gap-0.5"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Mobile Bottom Footer Brand / Privacy Notice */}
        <div className="w-full max-w-[440px] pt-4 mt-auto text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-normal">
            <ShieldCheck size={13} className="text-teal-600 dark:text-teal-400" />
            <span>Al-Mukhtar Islamic &amp; Academic Institute</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;