import Teachers from "@/pages_migrated/Teachers";
import { SITE_NAME, SITE_URL, getBreadcrumbSchema } from "@/lib/seo";

export const metadata = {
  title: "Distinguished Islamic Scholars & Faculty | Al-Mukhtar",
  description:
    "Meet our qualified Islamic scholars, Muftis, and academic faculty dedicated to imparting traditional Islamic sciences and moral mentorship at Al-Mukhtar Peshawar.",
  alternates: {
    canonical: `${SITE_URL}/teachers`,
  },
  openGraph: {
    title: "Distinguished Islamic Scholars & Faculty | Al-Mukhtar",
    description:
      "Meet our qualified Islamic scholars, Muftis, and academic faculty at Al-Mukhtar Peshawar.",
    url: `${SITE_URL}/teachers`,
    siteName: SITE_NAME,
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Al-Mukhtar Faculty & Teachers",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Distinguished Islamic Scholars & Faculty | Al-Mukhtar",
    description: "Meet our qualified Islamic scholars and faculty at Al-Mukhtar Peshawar.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
};

export default function TeachersPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Faculty", url: "/teachers" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <Teachers />
    </>
  );
}
