"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@/lib/navigation-adapter";
import api from "@/lib/api";
import {
  Mail,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Users,
  Award,
} from "lucide-react";
import { Logo, moon_light } from "../assets/assets.js";


function getSanitizedError(error, defaultMsg = "Something went wrong. Please try again.") {
  const msg = error?.response?.data?.message;
  if (
    msg &&
    typeof msg === "string" &&
    !msg.toLowerCase().includes("mongo") &&
    !msg.toLowerCase().includes("topology") &&
    !msg.toLowerCase().includes("econn") &&
    !msg.toLowerCase().includes("error") &&
    msg.length < 90
  ) {
    return msg;
  }
  return defaultMsg;
}

/* ──────────────────────────────────────────────────────────
   Step 1 — Enter Email
────────────────────────────────────────────────────────── */
function StepEmail({ onNext }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: (data) => api.post("/api/auth/forgot-password", data),
    onSuccess: (_, variables) => onNext(variables.email),
  });

  return (
    <div className="w-full max-w-[440px]">
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left mb-6">
        <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4 border border-teal-200/60 dark:border-teal-800/60 shadow-sm shadow-teal-500/10">
          <Mail size={24} />
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Forgot your password?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal mt-1.5 max-w-xs sm:max-w-none">
          Enter your registered email address. We'll send you a 6-digit verification code to reset your password.
        </p>
      </div>

      {mutation.isError && (
        <div className="mb-5 text-xs sm:text-sm text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 rounded-2xl px-4 py-3 font-medium animate-in fade-in duration-200">
          {getSanitizedError(mutation.error, "Something went wrong. Please try again.")}
        </div>
      )}

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
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
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
              })}
            />
          </div>
          {errors.email && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full h-12 rounded-xl sm:rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold text-sm sm:text-base shadow-sm shadow-teal-600/25 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2 flex items-center justify-center cursor-pointer"
        >
          {mutation.isPending ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Sending OTP...</span>
            </div>
          ) : (
            <span>Send Reset Code</span>
          )}
        </button>
      </form>

      <p className="text-xs sm:text-sm text-center text-slate-500 dark:text-slate-400 mt-6">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-bold hover:underline">
          <ArrowLeft size={14} /> Back to Login
        </Link>
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Step 2 — Enter OTP
────────────────────────────────────────────────────────── */
function StepOtp({ email, onNext }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: (data) => api.post("/api/auth/verify-reset-otp", { email, otp: data.otp }),
    onSuccess: (res) => onNext(res.data.resetToken),
  });

  const resendMutation = useMutation({
    mutationFn: () => api.post("/api/auth/forgot-password", { email }),
  });

  return (
    <div className="w-full max-w-[440px]">
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left mb-6">
        <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4 border border-teal-200/60 dark:border-teal-800/60 shadow-sm shadow-teal-500/10">
          <KeyRound size={24} />
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Enter verification code
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal mt-1.5 max-w-xs sm:max-w-none">
          We sent a 6-digit code to <strong className="font-semibold text-slate-900 dark:text-white break-all">{email}</strong>. It expires in 10 minutes.
        </p>
      </div>

      {mutation.isError && (
        <div className="mb-5 text-xs sm:text-sm text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 rounded-2xl px-4 py-3 font-medium animate-in fade-in duration-200">
          {getSanitizedError(mutation.error, "Invalid or expired OTP. Please try again.")}
        </div>
      )}
      {resendMutation.isSuccess && (
        <div className="mb-5 text-xs sm:text-sm text-teal-800 dark:text-teal-200 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-2xl px-4 py-3 font-medium flex items-center gap-2">
          <CheckCircle2 size={16} className="text-teal-600 dark:text-teal-400 shrink-0" />
          <span>A fresh code has been sent to your email.</span>
        </div>
      )}

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            6-Digit OTP
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="••••••"
            className={`w-full px-4 py-3.5 sm:py-3 rounded-xl sm:rounded-2xl border text-center text-2xl font-black tracking-[0.35em] text-slate-900 dark:text-white outline-none transition-all focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] dark:focus:border-[#0D9488] ${
              errors.otp
                ? "border-rose-400 bg-rose-50/30 dark:bg-rose-950/20"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80"
            }`}
            {...register("otp", {
              required: "OTP is required",
              pattern: { value: /^\d{6}$/, message: "Enter a valid 6-digit OTP" },
            })}
          />
          {errors.otp && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.otp.message}</p>}
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full h-12 rounded-xl sm:rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold text-sm sm:text-base shadow-sm shadow-teal-600/25 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2 flex items-center justify-center cursor-pointer"
        >
          {mutation.isPending ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Verifying Code...</span>
            </div>
          ) : (
            <span>Verify OTP</span>
          )}
        </button>
      </form>

      <p className="text-xs sm:text-sm text-center text-slate-500 dark:text-slate-400 mt-5">
        Didn't receive it?{" "}
        <button
          type="button"
          onClick={() => resendMutation.mutate()}
          disabled={resendMutation.isPending}
          className="text-teal-600 dark:text-teal-400 font-bold hover:underline disabled:opacity-50 cursor-pointer"
        >
          {resendMutation.isPending ? "Sending..." : "Resend OTP"}
        </button>
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Step 3 — New Password
────────────────────────────────────────────────────────── */
function StepNewPassword({ resetToken, onDone }) {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: (data) =>
      api.post("/api/auth/reset-password", { resetToken, newPassword: data.newPassword }),
    onSuccess: onDone,
  });

  return (
    <div className="w-full max-w-[440px]">
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left mb-6">
        <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4 border border-teal-200/60 dark:border-teal-800/60 shadow-sm shadow-teal-500/10">
          <Lock size={24} />
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Set a new password
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal mt-1.5 max-w-xs sm:max-w-none">
          Choose a strong, secure password with at least 6 characters.
        </p>
      </div>

      {mutation.isError && (
        <div className="mb-5 text-xs sm:text-sm text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 rounded-2xl px-4 py-3 font-medium animate-in fade-in duration-200">
          {getSanitizedError(mutation.error, "Something went wrong. Please try again.")}
        </div>
      )}

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">New Password</label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
              <Lock size={17} />
            </div>
            <input
              type={showPwd ? "text" : "password"}
              placeholder="Enter new password"
              className={`w-full pl-10 pr-11 py-3 sm:py-2.5 rounded-xl sm:rounded-xl border text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-all focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] dark:focus:border-[#0D9488] ${
                errors.newPassword
                  ? "border-rose-400 bg-rose-50/30 dark:bg-rose-950/20"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80"
              }`}
              {...register("newPassword", {
                required: "Password is required",
                minLength: { value: 6, message: "At least 6 characters" },
              })}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPwd((p) => !p)}
              className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1.5 cursor-pointer"
            >
              {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.newPassword && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.newPassword.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Confirm Password</label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
              <Lock size={17} />
            </div>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm new password"
              className={`w-full pl-10 pr-11 py-3 sm:py-2.5 rounded-xl sm:rounded-xl border text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-all focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] dark:focus:border-[#0D9488] ${
                errors.confirmPassword
                  ? "border-rose-400 bg-rose-50/30 dark:bg-rose-950/20"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80"
              }`}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (v) => v === watch("newPassword") || "Passwords do not match",
              })}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowConfirm((p) => !p)}
              className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1.5 cursor-pointer"
            >
              {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full h-12 rounded-xl sm:rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold text-sm sm:text-base shadow-sm shadow-teal-600/25 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2 flex items-center justify-center cursor-pointer"
        >
          {mutation.isPending ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Resetting Password...</span>
            </div>
          ) : (
            <span>Reset Password</span>
          )}
        </button>
      </form>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Step 4 — Success
────────────────────────────────────────────────────────── */
function StepSuccess() {
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-[440px] text-center">
      <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-5 border border-teal-200/60 dark:border-teal-800 shadow-sm shadow-teal-500/10">
        <CheckCircle2 size={32} />
      </div>
      <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
        Password reset!
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 font-normal max-w-xs mx-auto">
        Your password has been reset successfully. You can now sign in with your new password.
      </p>
      <button
        onClick={() => navigate("/login")}
        className="w-full h-12 rounded-xl sm:rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold text-sm sm:text-base shadow-sm shadow-teal-600/25 active:scale-[0.99] transition-all flex items-center justify-center cursor-pointer"
      >
        Go to Login
      </button>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Main Component
────────────────────────────────────────────────────────── */
const STEPS = ["email", "otp", "password", "done"];

function ForgotPassword() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  // Step indicator
  const stepIndex = STEPS.indexOf(step);

  return (
    <div className="min-h-screen min-h-[100dvh] w-full flex bg-slate-50 dark:bg-[#070d18] font-sans transition-colors">
      {/* Left Panel (Desktop Large Screens Only) */}
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
            <img src={Logo} alt="Logo" className="w-11 h-11 rounded-none object-cover ring-2 ring-[#5EEAD4]/40 shadow-sm" />
            <span className="text-white font-heading font-extrabold text-lg tracking-tight">Al-Mukhtar Institute</span>
          </div>

          <div className="py-8">
            <span className="inline-block text-[#5EEAD4] text-[11px] font-bold tracking-widest uppercase mb-3 font-mono">
              Account Recovery
            </span>
            <h1 className="font-heading text-3xl xl:text-4xl font-black text-white leading-tight mb-4 tracking-tight">
              Regain access to your account
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm font-normal">
              Follow the simple steps to verify your identity and create a new password.
            </p>
          </div>

          {/* Progress steps */}
          <div className="space-y-3">
            {["Enter your email", "Verify OTP", "Set new password"].map((label, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 transition-all ${i < stepIndex
                      ? "bg-[#5EEAD4] text-[#0A2540]"
                      : i === stepIndex
                        ? "bg-white text-[#0A2540]"
                        : "bg-white/10 border border-white/20 text-white/50"
                    }`}
                >
                  {i < stepIndex ? <CheckCircle2 size={13} /> : i + 1}
                </div>
                <span
                  className={`text-xs ${i <= stepIndex ? "text-white font-semibold" : "text-white/40 font-normal"
                    }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel (Premium Brand App UI on Mobile, Centered Form on Desktop) */}
      <div className="w-full lg:w-[58%] flex flex-col justify-between items-center px-4 py-5 sm:px-10 sm:py-10 lg:px-14 lg:py-12 min-h-[100dvh] lg:min-h-screen overflow-y-auto">
        
        {/* Top Back Navigation (Clean Arrow + Text for both mobile and desktop) */}
        <div className="w-full max-w-[440px] flex items-center justify-between mb-5 self-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Login</span>
          </Link>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-full border border-teal-200/60 dark:border-teal-800/60">
            {step === "email" ? "Step 1 of 3" : step === "otp" ? "Step 2 of 3" : step === "password" ? "Step 3 of 3" : "Completed"}
          </span>
        </div>

        {/* Main Step Container */}
        <div className="w-full max-w-[440px] flex-1 flex flex-col justify-center my-auto">
          {step === "email" && (
            <StepEmail
              onNext={(e) => {
                setEmail(e);
                setStep("otp");
              }}
            />
          )}
          {step === "otp" && (
            <StepOtp
              email={email}
              onNext={(token) => {
                setResetToken(token);
                setStep("password");
              }}
            />
          )}
          {step === "password" && (
            <StepNewPassword
              resetToken={resetToken}
              onDone={() => setStep("done")}
            />
          )}
          {step === "done" && <StepSuccess />}
        </div>

        {/* Mobile Bottom Footer Brand / Privacy Notice */}
        <div className="w-full max-w-[440px] pt-4 mt-auto text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-normal">
            <CheckCircle2 size={13} className="text-teal-600 dark:text-teal-400" />
            <span>Al-Mukhtar Account Security</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;
