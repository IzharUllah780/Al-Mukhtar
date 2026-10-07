import Videos from "@/pages_migrated/Videos";
import { SITE_NAME, SITE_URL, getBreadcrumbSchema } from "@/lib/seo";

export const metadata = {
  title: "Islamic Lectures & Video Archive | Al-Mukhtar",
  description:
    "Watch inspiring Islamic lectures, Bayanaat by Hazrat Maulana Muhammad Anwar, Tafseer lessons, and educational video series from Al-Mukhtar Institute.",
  alternates: {
    canonical: `${SITE_URL}/videos`,
  },
  openGraph: {
    title: "Islamic Lectures & Video Archive | Al-Mukhtar",
    description:
      "Watch inspiring Islamic lectures, Bayanaat by Hazrat Maulana Muhammad Anwar, Tafseer lessons, and educational video series from Al-Mukhtar Institute.",
    url: `${SITE_URL}/videos`,
    siteName: SITE_NAME,
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Al-Mukhtar Islamic Lectures",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Islamic Lectures & Video Archive | Al-Mukhtar",
    description: "Watch inspiring Islamic lectures and Bayanaat from Al-Mukhtar Institute.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
};

export default function VideosPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Lectures & Videos", url: "/videos" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <Videos />
    </>
  );
}
