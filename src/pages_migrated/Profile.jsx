"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import api from "@/lib/api";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Calendar,
  KeyRound,
  LogOut,
  Edit2,
  ChevronRight,
  X,
  GraduationCap,
  Save,
  ArrowRight,
  Sun,
  Moon,
  ShieldCheck,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Link, useNavigate } from "@/lib/navigation-adapter";

function Profile() {
  const { user: authUser, login, logout, loading: authLoading } = useAuth();
  const { theme, isDark, toggleTheme, setTheme } = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 1. Fetch user profile data on page load (direct fetch when visiting profile page)
  const {
    data: fetchedUser,
    isLoading: profileLoading,
    isError: profileError,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ["userProfileLive"],
    queryFn: async () => {
      const res = await api.get("/api/auth/me");
      if (res.data?.success && res.data.user) {
        // Keep context in sync
        login(res.data.user);
        return res.data.user;
      }
      return null;
    },
    staleTime: 0,
    retry: 1,
  });

  const user = fetchedUser || authUser;
  const isInitialLoading = (profileLoading || authLoading) && !user;

  // 2. Fetch user's applied courses
  const {
    data: applicationsData,
    isLoading: applicationsLoading,
    isError: applicationsError,
    refetch: refetchApplications,
  } = useQuery({
    queryKey: ["myApplications"],
    queryFn: async () => {
      const res = await api.get("/api/applications/my-applications");
      return res.data?.applications || [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  // 3. Form for Profile Updates (Username / Email)
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfileForm,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
    },
  });

  useEffect(() => {
    if (user) {
      resetProfileForm({
        username: user.username || "",
        email: user.email || "",
      });
    }
  }, [user, resetProfileForm]);

  // 4. Form for Password Change
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPasswordForm,
    watch,
    formState: { errors: passwordErrors },
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Mutation for updating profile info
  const updateProfileMutation = useMutation({
    mutationFn: (data) => api.put("/api/auth/update-profile", data),
    onSuccess: (res) => {
      toast.success(res.data.message || "Profile updated successfully!");
      if (res.data.user) {
        login(res.data.user);
      }
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["userProfileLive"] });
      setEditProfileModalOpen(false);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || "Failed to update profile. Please try again."
      );
    },
  });

  // Mutation for updating password
  const changePasswordMutation = useMutation({
    mutationFn: (data) =>
      api.put("/api/auth/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    onSuccess: (res) => {
      toast.success(res.data.message || "Password updated successfully!");
      resetPasswordForm();
      setPasswordModalOpen(false);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || "Failed to change password. Please try again."
      );
    },
  });

  const onUpdateProfile = (data) => {
    updateProfileMutation.mutate(data);
  };

  const onChangePassword = (data) => {
    changePasswordMutation.mutate(data);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const applications = applicationsData || [];
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  // Initial Loading Skeleton (Prevents displaying any placeholder/mock data)
  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#070d18] text-slate-800 dark:text-slate-200 font-sans transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-16 space-y-8 animate-pulse">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
              <div className="space-y-2">
                <div className="h-5 w-40 bg-slate-200 dark:bg-slate-800 rounded-md" />
                <div className="h-3.5 w-48 bg-slate-200 dark:bg-slate-800 rounded-md" />
                <div className="h-3 w-32 bg-slate-200 dark:bg-slate-800 rounded-md" />
              </div>
            </div>
            <div className="h-9 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5 space-y-6">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" />
                <div className="h-4 w-44 bg-slate-200 dark:bg-slate-800 rounded-md" />
                <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded-md" />
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" />
                <div className="h-8 w-full bg-slate-200 dark:bg-slate-800 rounded-lg" />
              </div>
            </div>
            <div className="md:col-span-7 space-y-4">
              <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-20 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
              <div className="h-20 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user is not logged in after check
  if (!user && !profileLoading && !authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 bg-white dark:bg-[#070d18]">
        <div className="max-w-md w-full text-center space-y-4 p-8 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/60 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center">
            <User size={24} />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Authentication Required</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Please log in with your credentials to access and manage your profile details.
          </p>
          <div className="pt-2">
            <Link
              to="/login?redirect=%2Fprofile"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-all"
            >
              <span>Sign In to Account</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "AM";

  return (
    <div className="min-h-screen bg-white dark:bg-[#070d18] text-slate-800 dark:text-slate-200 font-sans transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-16 space-y-8 sm:space-y-10">
        
        {/* ── 1. CLEAN PROFILE HEADER (REAL DATA ONLY) ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-base sm:text-lg shrink-0 select-none shadow-xs">
              <span>{initials}</span>
            </div>
            
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading">
                  {user.username}
                </h1>
                {user.isVerified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-600 dark:text-teal-400">
                    <CheckCircle2 size={14} className="shrink-0" />
                    <span>Verified</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500 dark:text-amber-400">
                    <AlertCircle size={13} className="shrink-0" />
                    <span>Unverified</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {user.email}
              </p>
              <div className="flex items-center gap-2 pt-0.5 text-[11px] text-slate-400 font-mono">
                <span className="capitalize font-semibold text-teal-600 dark:text-teal-400">
                  {isAdmin ? "Administrator" : "Student"}
                </span>
                <span>•</span>
                <span>Member</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isAdmin && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 text-xs font-semibold transition active:scale-98 shadow-2xs"
              >
                <LayoutDashboard size={13} />
                <span>Admin Panel</span>
              </Link>
            )}
            <Link
              to="/apply"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition active:scale-98 shadow-xs"
            >
              <BookOpen size={13} />
              <span>Apply for Course</span>
            </Link>
          </div>
        </div>

        {/* ── 2. TWO COLUMN DETAILS (ACCOUNT, APPEARANCE & APPLICATIONS) ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Account Details, Appearance & Security */}
          <div className="md:col-span-5 space-y-6">
            
            {/* Account Information */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-500 dark:text-slate-400">
                  Account Details
                </h2>
                <button
                  type="button"
                  onClick={() => setEditProfileModalOpen(true)}
                  className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  <Edit2 size={12} />
                  <span>Edit</span>
                </button>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-0.5">Full Name</span>
                  <p className="font-semibold text-slate-900 dark:text-white">{user.username}</p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-0.5">Email Address</span>
                  <p className="font-semibold text-slate-900 dark:text-white font-mono text-xs">{user.email}</p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-0.5">Account Role</span>
                  <p className="font-semibold text-slate-900 dark:text-white capitalize">
                    {isAdmin ? "Administrator" : "Student"}
                  </p>
                </div>
              </div>
            </div>

            {/* ── APPEARANCE & THEME SECTION (Desktop & Mobile) ── */}
            <div className="space-y-3 pt-2">
              <div className="pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-500 dark:text-slate-400">
                  Appearance &amp; Theme
                </h2>
                <span className="text-[11px] font-mono text-teal-600 dark:text-teal-400 font-semibold capitalize">
                  {isDark ? "Dark Mode" : "Light Mode"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {/* Light Mode Button */}
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    !isDark
                      ? "border-teal-600 bg-teal-50/60 dark:bg-teal-950/30 text-teal-900 dark:text-teal-200 shadow-2xs ring-1 ring-teal-600"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Sun size={17} className={!isDark ? "text-teal-600 dark:text-teal-400" : "text-slate-400"} />
                    {!isDark && (
                      <span className="w-2 h-2 rounded-full bg-teal-600 dark:bg-teal-400" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Light</span>
                    <span className="text-[10px] text-slate-400">Clean bright style</span>
                  </div>
                </button>

                {/* Dark Mode Button */}
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    isDark
                      ? "border-teal-600 bg-teal-50/60 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 shadow-2xs ring-1 ring-teal-600"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Moon size={17} className={isDark ? "text-teal-600 dark:text-teal-400" : "text-slate-400"} />
                    {isDark && (
                      <span className="w-2 h-2 rounded-full bg-teal-600 dark:bg-teal-400" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Dark</span>
                    <span className="text-[10px] text-slate-400">Midnight dark style</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Security & Actions */}
            <div className="space-y-3 pt-2">
              <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-500 dark:text-slate-400">
                  Security &amp; Session
                </h2>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(true)}
                  className="w-full flex items-center justify-between py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2">
                    <KeyRound size={14} className="text-slate-400" />
                    <span>Change Password</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => setLogoutModalOpen(true)}
                  className="w-full flex items-center justify-between py-2 text-xs sm:text-sm font-medium text-rose-600 dark:text-rose-400 hover:underline transition cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2">
                    <LogOut size={14} className="text-rose-500" />
                    <span>Sign Out</span>
                  </div>
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Submitted Course Applications */}
          <div className="md:col-span-7 space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-500 dark:text-slate-400">
                  Course Applications
                </h2>
                <span className="text-[11px] font-mono text-slate-400">({applications.length})</span>
              </div>

              <Link
                to="/courses"
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Browse Courses</span>
                <ArrowRight size={11} />
              </Link>
            </div>

            {applicationsLoading ? (
              <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p>Loading your applications...</p>
              </div>
            ) : applicationsError ? (
              <div className="py-6 text-xs text-rose-500">
                Failed to load applications. <button onClick={() => refetchApplications()} className="underline cursor-pointer">Retry</button>
              </div>
            ) : applications.length === 0 ? (
              <div className="py-8 text-center space-y-2 text-xs text-slate-500 dark:text-slate-400">
                <p>You have not submitted any course admission applications yet.</p>
                <Link
                  to="/apply"
                  className="inline-block text-teal-600 dark:text-teal-400 font-semibold hover:underline pt-1"
                >
                  Submit an Application &rarr;
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border-b border-slate-100 dark:border-slate-800">
                {applications.map((app) => {
                  const status = app.status || "pending";
                  return (
                    <div
                      key={app._id}
                      onClick={() => setSelectedApplication(app)}
                      className="py-3 flex items-center justify-between gap-3 hover:text-teal-600 dark:hover:text-teal-400 transition cursor-pointer group"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white capitalize truncate group-hover:text-teal-600 dark:group-hover:text-teal-400">
                          {app.course?.replace(/-/g, " ") || "Course Application"}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                          <span className="capitalize">{app.shift} Shift</span>
                          <span>•</span>
                          <span>
                            {new Date(app.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-[11px] font-mono font-semibold capitalize ${
                            status === "approved"
                              ? "text-teal-600 dark:text-teal-400"
                              : status === "rejected"
                              ? "text-rose-500"
                              : "text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {status}
                        </span>
                        <ChevronRight size={14} className="text-slate-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* ── MODAL 1: EDIT PROFILE (Name & Email) ── */}
      {editProfileModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          onClick={() => setEditProfileModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-sm w-full p-5 space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Edit Profile Details
              </h2>
              <button
                type="button"
                onClick={() => setEditProfileModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-teal-600 dark:focus:border-teal-400"
                  {...registerProfile("username", {
                    required: "Name is required",
                    minLength: { value: 3, message: "Minimum 3 characters" },
                  })}
                />
                {profileErrors.username && (
                  <p className="text-[11px] text-rose-500 mt-1">{profileErrors.username.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-teal-600 dark:focus:border-teal-400"
                  {...registerProfile("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Valid email is required",
                    },
                  })}
                />
                {profileErrors.email && (
                  <p className="text-[11px] text-rose-500 mt-1">{profileErrors.email.message}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditProfileModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition cursor-pointer disabled:opacity-60"
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: CHANGE PASSWORD ── */}
      {passwordModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          onClick={() => setPasswordModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-sm w-full p-5 space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Change Password
              </h2>
              <button
                type="button"
                onClick={() => setPasswordModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitPassword(onChangePassword)} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Current password"
                    className="w-full px-3 py-2 pr-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-teal-600 dark:focus:border-teal-400"
                    {...registerPassword("currentPassword", {
                      required: "Current password is required",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showCurrentPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="text-[11px] text-rose-500 mt-1">{passwordErrors.currentPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New password"
                    className="w-full px-3 py-2 pr-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-teal-600 dark:focus:border-teal-400"
                    {...registerPassword("newPassword", {
                      required: "New password is required",
                      minLength: { value: 6, message: "Minimum 6 characters" },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showNewPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-[11px] text-rose-500 mt-1">{passwordErrors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    className="w-full px-3 py-2 pr-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-teal-600 dark:focus:border-teal-400"
                    {...registerPassword("confirmPassword", {
                      required: "Please confirm password",
                      validate: (val) => val === watch("newPassword") || "Passwords do not match",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showConfirmPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-[11px] text-rose-500 mt-1">{passwordErrors.confirmPassword.message}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition cursor-pointer disabled:opacity-60"
                >
                  {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 3: APPLICATION DETAILS POPUP ── */}
      {selectedApplication && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          onClick={() => setSelectedApplication(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Application</span>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white capitalize truncate">
                  {selectedApplication.course?.replace(/-/g, " ") || "Application Details"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApplication(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Status:</span>
                <span className="font-semibold capitalize text-teal-600 dark:text-teal-400">{selectedApplication.status || "Pending"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Applicant:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedApplication.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Shift:</span>
                <span className="font-semibold capitalize text-slate-900 dark:text-white">{selectedApplication.shift}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Mobile / WhatsApp:</span>
                <span className="font-semibold font-mono text-slate-900 dark:text-white">{selectedApplication.whatsapp || selectedApplication.mobile}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">CNIC / ID:</span>
                <span className="font-semibold font-mono text-slate-900 dark:text-white">{selectedApplication.cnic}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Qualification:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedApplication.qualification}</span>
              </div>
              <div className="py-1">
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Address:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedApplication.address}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedApplication(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 4: CONFIRM LOGOUT MODAL ── */}
      {logoutModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          onClick={() => setLogoutModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-sm w-full p-5 space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Confirm Sign Out
              </h2>
              <button
                type="button"
                onClick={() => setLogoutModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to sign out of your account on this device?
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setLogoutModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Profile;
