"use client";

import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "@/lib/navigation-adapter";
import {
  User,
  LayoutDashboard,
  ChevronDown,
  Sun,
  Moon,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "./AuthContext.jsx";
import { useTheme } from "@/context/ThemeContext";

function UserProfileMenu() {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "AM";

  return (
    <div className="relative font-sans" ref={menuRef}>
      {/* Profile Trigger Circle */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 p-0.5 rounded-full focus:outline-none cursor-pointer group"
        aria-label="User profile menu"
        aria-expanded={open}
      >
        <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs group-hover:bg-teal-700 transition-colors">
          {initials}
        </div>
        <ChevronDown
          size={13}
          className={`text-slate-400 transition-transform duration-200 group-hover:text-slate-600 dark:group-hover:text-slate-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Simple, Professional Dropdown (No internal background boxes) */}
      <div
        className={`absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg py-1.5 z-50 transition-all duration-150 origin-top-right ${
          open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
        }`}
      >
        {/* User Identity Header */}
        <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-900 dark:text-white truncate leading-tight">
            {user?.username}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
            {user?.email}
          </p>
          <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-teal-600 dark:text-teal-400 font-semibold uppercase tracking-wider">
            {isAdmin ? <ShieldCheck size={11} /> : <User size={10} />}
            <span>{user?.role === "admin" || user?.role === "superadmin" ? "Administrator" : "Student"}</span>
          </div>
        </div>

        {/* Navigation Items (Clean, No colored boxes) */}
        <div className="py-1">
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              <LayoutDashboard size={14} className="text-slate-400 shrink-0" />
              <span>Admin Dashboard</span>
            </Link>
          )}

          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            <User size={14} className="text-slate-400 shrink-0" />
            <span>My Profile</span>
          </Link>

          {/* Dark / Light Mode Switch */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5">
              {isDark ? (
                <Moon size={14} className="text-slate-400 shrink-0" />
              ) : (
                <Sun size={14} className="text-slate-400 shrink-0" />
              )}
              <span>Appearance</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {isDark ? "Dark" : "Light"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserProfileMenu;
