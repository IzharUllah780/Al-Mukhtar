import Courses from "@/pages_migrated/Courses";
import { SITE_NAME, SITE_URL, getBreadcrumbSchema } from "@/lib/seo";

export const metadata = {
  title: "Islamic Courses & Academic Programs | Al-Mukhtar",
  description:
    "Explore authentic Islamic science programs, Daras-e-Nizami, Tajweed-ul-Quran, Arabic grammar, Hadith, Fiqh, and foundational Islamic studies at Al-Mukhtar Peshawar.",
  alternates: {
    canonical: `${SITE_URL}/courses`,
  },
  openGraph: {
    title: "Islamic Courses & Academic Programs | Al-Mukhtar",
    description:
      "Explore authentic Islamic science programs, Daras-e-Nizami, Tajweed-ul-Quran, Arabic grammar, Hadith, and Fiqh taught by certified faculty.",
    url: `${SITE_URL}/courses`,
    siteName: SITE_NAME,
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Islamic Courses at Al-Mukhtar Institute",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Islamic Courses & Academic Programs | Al-Mukhtar",
    description:
      "Explore authentic Islamic science programs, Daras-e-Nizami, Tajweed, and Arabic linguistics.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
};

export default function CoursesPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Courses", url: "/courses" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <Courses />
    </>
  );
}
