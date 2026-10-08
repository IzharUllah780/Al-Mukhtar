"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocation } from "@/lib/navigation-adapter";
import { useAuth } from "./AuthContext.jsx";

/** Shows a centered spinner while auth is being loaded */
function AuthLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#070d18] transition-colors">
      <div className="w-9 h-9 border-3 border-teal-200 dark:border-teal-900 border-t-[#0D9488] rounded-full animate-spin" />
    </div>
  );
}

/**
 * GuestRoute — only accessible when NOT logged in.
 * Logged-in users are redirected to "/" (home).
 */
export function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  if (loading || user) {
    return <AuthLoader />;
  }

  return children;
}

/**
 * PrivateRoute — only accessible when logged in.
 * Unauthenticated users are redirected to "/login".
 */
export function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      const fullRedirect = location.pathname + (location.search || "");
      router.replace(`/login?redirect=${encodeURIComponent(fullRedirect)}`);
    }
  }, [loading, user, location.pathname, location.search, router]);

  if (loading || !user) {
    return <AuthLoader />;
  }

  return children;
}

/**
 * AdminRoute — only accessible when logged in AND role === "admin" / "superadmin".
 * Non-admins are redirected to "/".
 */
export function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (user.role !== "admin" && user.role !== "superadmin") {
        router.replace("/");
      }
    }
  }, [loading, user, router]);

  if (loading || !user || (user.role !== "admin" && user.role !== "superadmin")) {
    return <AuthLoader />;
  }

  return children;
}
