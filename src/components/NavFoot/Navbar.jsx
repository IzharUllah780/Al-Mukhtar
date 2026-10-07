"use client";

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "@/lib/navigation-adapter";
import {
  Menu,
  X,
  LogOut,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Sun,
  Moon,
  Building2,
  UserCheck,
  GraduationCap,
  Mail,
} from "lucide-react";
import { Logo } from "../../assets/assets.js";
import { useAuth } from "../AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import UserProfileMenu from "../UserProfileMenu.jsx";
import NotificationBell from "../NotificationBell.jsx";
import GoogleTranslator from "../GoogleTranslator.jsx";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Courses", path: "/courses" },
  { name: "Blog", path: "/blog" },
  { name: "Videos", path: "/videos" },
];

const ABOUT_SUB_LINKS = [
  { name: "About Institute", path: "/about", description: "History, mission, campus & methodology", icon: Building2 },
  { name: "Faculty & Scholars", path: "/teachers", description: "Resident scholars, leadership & founder", icon: UserCheck },
  { name: "Alumni & Graduates", path: "/students", description: "Student network & academic achievements", icon: GraduationCap },
  { name: "Contact & Inquiries", path: "/contact", description: "Campus location, phone & admissions desk", icon: Mail },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [mobileAboutExpanded, setMobileAboutExpanded] = useState(false);
  const dropdownTimeoutRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, loading, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  const isLinkActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const isAboutActive =
    ABOUT_SUB_LINKS.some((sub) => location.pathname.startsWith(sub.path)) ||
    location.pathname === "/alumni";

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setAboutDropdownOpen(false);
    setMobileAboutExpanded(false);
  }, [location.pathname]);

  // Lock body scroll on mobile menu
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
    setMobileAboutExpanded(false);
  };

  const handleMouseEnterAbout = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setAboutDropdownOpen(true);
  };

  const handleMouseLeaveAbout = () => {
    dropdownTimeoutRef.current = setTimeout(() => setAboutDropdownOpen(false), 150);
  };

  const handleMobileLogout = async () => {
    closeMenu();
    await logout();
    navigate("/login");
  };

  const extraMobileLinks = [
    { name: "Examination Results", path: "/result", show: true },
    { name: "My Profile", path: "/profile", show: Boolean(user) },
    { name: "Admin Dashboard", path: "/admin", show: Boolean(user && isAdmin) },
  ].filter((item) => item.show);

  return (
    <>
      {/* University Institutional Top Bar */}
      <div className="bg-slate-950 text-slate-300 text-[11px] font-sans border-b border-slate-800/80 hidden sm:block py-1.5 transition-colors">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-10 lg:px-16 flex items-center justify-between gap-4">
          
          {/* Left: Admissions & Campus info */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex items-center gap-1.5 text-teal-400 font-medium shrink-0">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>Admissions Open • Academic Session 2026</span>
            </span>
            <span className="text-slate-700 hidden md:inline">|</span>
            <span className="text-slate-400 hidden md:inline truncate">
              Peshawar Campus, KPK, Pakistan
            </span>
          </div>

          {/* Right: Simple Links & Language Switcher */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 font-medium">
            <Link
              to="/result"
              className="text-slate-300 hover:text-teal-400 hover:underline transition-colors"
            >
              Results
            </Link>
            <span className="text-slate-700">|</span>
            <Link
              to="/contact"
              className="text-slate-300 hover:text-teal-400 hover:underline transition-colors"
            >
              Contact
            </Link>
            <span className="text-slate-700">|</span>
            <GoogleTranslator />
          </div>

        </div>
      </div>

      {/* Main Navbar Header */}
      <header className="sticky top-0 z-40 w-full transition-all duration-200 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 py-3.5 font-sans">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-10 lg:px-16 flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group min-w-0">
            <div className="w-10 h-10 overflow-hidden shrink-0 border border-slate-200/80 dark:border-slate-700 bg-teal-50 dark:bg-slate-800/80 shadow-xs group-hover:scale-105 transition-transform duration-200 flex items-center justify-center rounded-none">
              <img src={Logo} alt="Al-Mukhtar Logo" className="w-full h-full object-cover rounded-none" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-base font-extrabold text-slate-900 dark:text-white font-heading tracking-tight leading-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate">
                Al-Mukhtar
              </span>
              <span className="text-[10.5px] font-normal text-slate-500 dark:text-slate-400 truncate">
                Where the chosen rise
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {NAV_LINKS.map(({ name, path }) => {
              const active = isLinkActive(path);
              return (
                <Link
                  key={path}
                  to={path}
                  className={`relative py-1 text-sm font-semibold transition-colors ${
                    active
                      ? "text-teal-600 dark:text-teal-400 font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400"
                  }`}
                >
                  <span>{name}</span>
                  {active && (
                    <span className="absolute -bottom-1 left-0 w-full h-[2.5px] bg-teal-600 dark:bg-teal-400 rounded-full shadow-xs" />
                  )}
                </Link>
              );
            })}

            {/* About Dropdown */}
            <div className="relative" onMouseEnter={handleMouseEnterAbout} onMouseLeave={handleMouseLeaveAbout}>
              <button
                type="button"
                onClick={() => setAboutDropdownOpen((prev) => !prev)}
                className={`relative py-1 text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isAboutActive
                    ? "text-teal-600 dark:text-teal-400 font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400"
                }`}
              >
                <span>About</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    aboutDropdownOpen ? "rotate-180 text-teal-600 dark:text-teal-400" : ""
                  }`}
                />
                {isAboutActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-[2.5px] bg-teal-600 dark:bg-teal-400 rounded-full shadow-xs" />
                )}
              </button>

              {aboutDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 w-80 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/90 dark:border-slate-800 p-2 space-y-1">
                    {ABOUT_SUB_LINKS.map((item) => {
                      const Icon = item.icon;
                      const isCurrentActive = isLinkActive(item.path);

                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setAboutDropdownOpen(false)}
                          className={`flex items-start gap-3 p-2.5 rounded-xl transition-all group ${
                            isCurrentActive
                              ? "bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300"
                              : "hover:bg-slate-50 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                              isCurrentActive
                                ? "bg-teal-600 text-white shadow-xs"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-teal-600 group-hover:text-white"
                            }`}
                          >
                            <Icon size={16} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold font-heading group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors block">
                              {item.name}
                            </span>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight line-clamp-1 mt-0.5 font-normal">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Right Action Area */}
          <div className="hidden md:flex items-center gap-2.5">
            {loading ? (
              <div className="w-20 h-8 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
            ) : user ? (
              <>
                {!isAdmin && (
                  <Link
                    to="/apply"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-2xs transition-all hover:shadow-xs active:scale-95"
                  >
                    <span>Apply Now</span>
                    <ArrowRight size={13} className="shrink-0" />
                  </Link>
                )}
                <NotificationBell />
                <UserProfileMenu />
              </>
            ) : (
              <div className="flex items-center gap-2">
                <NotificationBell />
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/90 transition-all shadow-2xs active:scale-95"
                >
                  Log in
                </Link>
                <Link
                  to="/apply"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-2xs transition-all hover:shadow-xs active:scale-95"
                >
                  <span>Apply Now</span>
                  <ArrowRight size={13} className="shrink-0" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-1.5 md:hidden">
            <NotificationBell />
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[85%] max-w-[320px] bg-white dark:bg-[#070d18] shadow-2xl md:hidden flex flex-col border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out font-sans ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-teal-50 dark:bg-slate-800">
              <img src={Logo} alt="Al-Mukhtar" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-slate-900 dark:text-white font-heading tracking-tight truncate">
                Al-Mukhtar
              </span>
              <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400 truncate">
                Where the chosen rise
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={closeMenu}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer shrink-0"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Links Body */}
        <div className="px-3 py-3 space-y-4 flex-1 overflow-y-auto">
          
          {/* Main Navigation Section */}
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 font-mono block mb-1">
              Menu
            </span>

            {NAV_LINKS.map(({ name, path }) => {
              const active = isLinkActive(path);
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={closeMenu}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    active
                      ? "text-teal-600 dark:text-teal-400 font-bold bg-teal-50/60 dark:bg-teal-950/40"
                      : "text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400"
                  }`}
                >
                  <span>{name}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400" />}
                </Link>
              );
            })}

            {/* Examination Results Link */}
            <Link
              to="/result"
              onClick={closeMenu}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                isLinkActive("/result")
                  ? "text-teal-600 dark:text-teal-400 font-bold bg-teal-50/60 dark:bg-teal-950/40"
                  : "text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400"
              }`}
            >
              <span>Examination Results</span>
              {isLinkActive("/result") && <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400" />}
            </Link>
          </div>

          {/* About Section */}
          <div className="space-y-0.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 font-mono block mb-1">
              About Institute
            </span>

            {ABOUT_SUB_LINKS.map(({ name, path }) => {
              const active = isLinkActive(path);
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={closeMenu}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    active
                      ? "text-teal-600 dark:text-teal-400 font-bold bg-teal-50/60 dark:bg-teal-950/40"
                      : "text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400"
                  }`}
                >
                  <span>{name}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400" />}
                </Link>
              );
            })}
          </div>

          {/* Account / Management Section (if logged in) */}
          {user && (
            <div className="space-y-0.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 font-mono block mb-1">
                Account
              </span>

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={closeMenu}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    isLinkActive("/admin")
                      ? "text-teal-600 dark:text-teal-400 font-bold bg-teal-50/60 dark:bg-teal-950/40"
                      : "text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400"
                  }`}
                >
                  <span>Admin Dashboard</span>
                  {isLinkActive("/admin") && <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400" />}
                </Link>
              )}

              <Link
                to="/profile"
                onClick={closeMenu}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  isLinkActive("/profile")
                    ? "text-teal-600 dark:text-teal-400 font-bold bg-teal-50/60 dark:bg-teal-950/40"
                    : "text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400"
                }`}
              >
                <span>My Profile</span>
                {isLinkActive("/profile") && <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400" />}
              </Link>
            </div>
          )}

          {/* Appearance & Language Section */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
              <span className="text-slate-500 dark:text-slate-400">Language</span>
              <GoogleTranslator />
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                {isDark ? <Moon size={15} className="text-slate-400" /> : <Sun size={15} className="text-slate-400" />}
                <span>Theme</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {isDark ? "Dark" : "Light"}
              </span>
            </button>
          </div>

        </div>

        {/* Drawer Footer / Actions */}
        {/* Drawer Footer / Guest Actions */}
        {!user && (
          <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 shrink-0">
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={closeMenu}
                className="w-full text-center py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/apply"
                onClick={closeMenu}
                className="w-full text-center py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-all"
              >
                Apply Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
