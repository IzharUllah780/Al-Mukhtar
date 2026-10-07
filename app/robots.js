import { SITE_URL } from "@/lib/seo";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/courses",
          "/courses/*",
          "/apply",
          "/result",
          "/blog",
          "/blog/*",
          "/contact",
          "/teachers",
          "/students",
          "/alumni",
          "/videos",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/api/",
          "/api/*",
          "/login",
          "/register",
          "/signup",
          "/profile",
          "/profile/*",
          "/verify-email",
          "/forgot-password",
          "/notifications",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
