"use client";

import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate, useSearchParams } from "@/lib/navigation-adapter";
import api from "@/lib/api";
import { Mail, ArrowLeft, ShieldCheck, CheckCircle2, RefreshCw } from "lucide-react";
import { Logo, moon_light } from "../assets/assets.js";


function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const redirectUrl = searchParams.get("redirect") || "";

  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      otp0: "",
      otp1: "",
      otp2: "",
      otp3: "",
      otp4: "",
      otp5: "",
    },
  });

  // Verify OTP mutation
  const verifyMutation = useMutation({
    mutationFn: (data) => api.post("/api/auth/verify-email", data),
    onSuccess: () => {
      const redirectQuery = redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : "";
      navigate(`/login${redirectQuery}`);
    },
  });

  // Resend OTP mutation
  const resendMutation = useMutation({
    mutationFn: () => api.post("/api/auth/resend-otp", { email }),
    onSuccess: () => {
      setResendCooldown(30);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
  });

  const onSubmit = (data) => {
    const otp = Object.values(data).join("");
    verifyMutation.mutate({ email, otp });
  };

  // Handle auto-focus between OTP boxes
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // only digits

    setValue(`otp${index}`, value);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !getValues(`otp${index}`) && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pasted)) return;

    pasted.split("").forEach((digit, i) => {
      setValue(`otp${i}`, digit);
    });
    inputRefs.current[5]?.focus();
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
          <div className="flex items-center gap-3">
            <img
              src={Logo}
              alt="Madrasa Logo"
              className="w-11 h-11 rounded-xl object-cover ring-2 ring-[#5EEAD4]/40 shadow-sm"
            />
            <span className="text-white font-heading font-extrabold text-lg tracking-tight">
              Al-Mukhtar Institute
            </span>
          </div>

          <div className="py-8">
            <span className="inline-block text-[#5EEAD4] text-[11px] font-bold tracking-widest uppercase mb-3 font-mono">
              Almost There
            </span>
            <h1 className="font-heading text-3xl xl:text-4xl font-black text-white leading-tight mb-4 tracking-tight">
              One last step to confirm your account
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm font-normal">
              Verifying your email keeps your account secure and ensures you receive timely course notifications.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form (Premium Brand App UI on Mobile, Centered Form on Desktop) */}
      <div className="w-full lg:w-[58%] flex flex-col justify-between items-center px-4 py-5 sm:px-10 sm:py-10 lg:px-14 lg:py-12 min-h-[100dvh] lg:min-h-screen overflow-y-auto">
        
        {/* Top Back Navigation (Clean Arrow + Text for both mobile and desktop) */}
        <div className="w-full max-w-[440px] flex items-center justify-between mb-5 self-center">
          <Link
            to="/signup"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Signup</span>
          </Link>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-full border border-teal-200/60 dark:border-teal-800/60">
            Step 2 of 2
          </span>
        </div>

        {/* Main Content Card Container */}
        <div className="w-full max-w-[440px] flex-1 flex flex-col justify-center my-auto">
          
          {/* Header & Emblem */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left mb-6">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4 border border-teal-200/60 dark:border-teal-800/60 shadow-sm shadow-teal-500/10">
              <Mail size={24} />
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Verify your email
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal mt-1.5 max-w-xs sm:max-w-none">
              We've sent a 6-digit verification code to{" "}
              <strong className="font-semibold text-slate-900 dark:text-white break-all">{email || "your email"}</strong>.
              Enter it below to confirm your account.
            </p>
          </div>

          {verifyMutation.isError && (
            <div className="mb-5 text-xs sm:text-sm text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 rounded-2xl px-4 py-3 font-medium animate-in fade-in duration-200">
              {(() => {
                const msg = verifyMutation.error?.response?.data?.message;
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
                return "Invalid or expired code. Please try again.";
              })()}
            </div>
          )}

          {resendMutation.isSuccess && (
            <div className="mb-5 text-xs sm:text-sm text-teal-800 dark:text-teal-200 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-2xl px-4 py-3 font-medium flex items-center gap-2">
              <CheckCircle2 size={16} className="text-teal-600 dark:text-teal-400 shrink-0" />
              <span>A fresh verification code has been sent to your email.</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* OTP Boxes */}
            <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-3">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  ref={(el) => (inputRefs.current[index] = el)}
                  {...register(`otp${index}`, {
                    required: true,
                    pattern: /^\d$/,
                  })}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={`w-11 h-13 sm:w-13 sm:h-14 text-center text-xl sm:text-2xl font-black rounded-xl sm:rounded-2xl border text-slate-900 dark:text-white outline-none transition-all focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] dark:focus:border-[#0D9488] ${
                    errors[`otp${index}`]
                      ? "border-rose-400 bg-rose-50/30 dark:bg-rose-950/20"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-2xs"
                  }`}
                />
              ))}
            </div>
            {Object.keys(errors).length > 0 && (
              <p className="text-xs text-rose-500 mb-3 text-center font-medium">
                Please enter all 6 digits
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={verifyMutation.isPending}
              className="w-full h-12 rounded-xl sm:rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold text-sm sm:text-base shadow-sm shadow-teal-600/25 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-4 flex items-center justify-center cursor-pointer"
            >
              {verifyMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Code...</span>
                </div>
              ) : (
                <span>Verify &amp; Continue</span>
              )}
            </button>
          </form>

          {/* Resend Action */}
          <div className="mt-6 text-center">
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={() => resendMutation.mutate()}
                disabled={resendCooldown > 0 || resendMutation.isPending}
                className="text-teal-600 dark:text-teal-400 font-bold hover:underline disabled:text-slate-400 dark:disabled:text-slate-600 disabled:no-underline disabled:cursor-not-allowed cursor-pointer inline-flex items-center gap-1"
              >
                {resendMutation.isPending ? (
                  <>
                    <RefreshCw size={12} className="animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : resendCooldown > 0 ? (
                  <span>Resend in {resendCooldown}s</span>
                ) : (
                  <span>Resend Code</span>
                )}
              </button>
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

export default VerifyEmail;