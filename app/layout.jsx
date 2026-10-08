import React, { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Providers from "@/components/Providers";
import MainLayoutShell from "@/components/MainLayoutShell";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  getOrganizationSchema,
  getWebSiteSchema,
} from "@/lib/seo";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Al-Mukhtar",
    "Al-Mukhtar Official",
    "Al-Mukhtar Institute",
    "Al-Mukhtar Islamic & Academic Institute",
    "Islamic Institute Peshawar",
    "Dars-e-Nizami",
    "Tajweed",
    "Quran Recitation",
    "Arabic Language",
    "Islamic Studies",
    "Islamic Jurisprudence",
    "Peshawar",
    "KPK",
    "Pakistan",
  ],
  authors: [{ name: "Al-Mukhtar", url: SITE_URL }],
  creator: "Al-Mukhtar",
  publisher: "Al-Mukhtar",
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: `${SITE_URL}/`,
    siteName: SITE_NAME,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Al-Mukhtar — Where the Chosen Rise",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "X4KwyEHF-QaAKtrY1ctfAEeMaC2QG2j_lT63WGuOJOg",
  },
  other: {
    "google-adsense-account": "ca-pub-5967341765221118",
  },
};

export default function RootLayout({ children }) {
  const organizationSchema = getOrganizationSchema();
  const webSiteSchema = getWebSiteSchema();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-5967341765221118" />
        <meta name="google-site-verification" content="X4KwyEHF-QaAKtrY1ctfAEeMaC2QG2j_lT63WGuOJOg" />
        <meta name="theme-color" content="#0D9488" />
        
        {/* Urdu & Arabic High-Quality Calligraphy & Sans Fonts */}
        <link
          rel="preload"
          href="/fonts/jameel-noori-nastaleeq.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,700&family=Gulzar&family=Noto+Nastaliq+Urdu:wght@400;500;600;700;800&family=Noto+Sans+Arabic:wght@300;400;500;600;700;800&family=Amiri:wght@400;700&display=swap"
          rel="stylesheet"
        />

        {/* Global JSON-LD Structured Data for Organization and WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />



        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5967341765221118"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased font-sans bg-slate-50 text-slate-900 dark:bg-[#080f19] dark:text-slate-100 min-h-screen">
        <Providers>
          <Suspense fallback={null}>
            <MainLayoutShell>{children}</MainLayoutShell>
          </Suspense>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
