"use client";

import React from "react";
import { Link } from "@/lib/navigation-adapter";
import { User } from "lucide-react";

function UserProfileMenu() {
  return (
    <Link
      to="/profile"
      className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-teal-600 dark:hover:bg-teal-600 text-slate-700 dark:text-slate-300 hover:text-white dark:hover:text-white border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all shadow-2xs hover:shadow-xs active:scale-95 group shrink-0"
      title="My Profile"
      aria-label="My Profile"
    >
      <User size={17} className="transition-transform group-hover:scale-110" />
    </Link>
  );
}

export default UserProfileMenu;

