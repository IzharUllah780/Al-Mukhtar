import Students from "@/pages_migrated/Students";
import { SITE_NAME, SITE_URL, getBreadcrumbSchema } from "@/lib/seo";

export const metadata = {
  title: "Alumni Directory & Graduates | Al-Mukhtar",
  description:
    "Discover alumni profiles, graduate accomplishments, and scholars from Al-Mukhtar Islamic Institute Peshawar.",
  alternates: {
    canonical: `${SITE_URL}/alumni`,
  },
  openGraph: {
    title: "Alumni Directory & Graduates | Al-Mukhtar",
    description: "Discover alumni profiles and graduates from Al-Mukhtar Islamic Institute Peshawar.",
    url: `${SITE_URL}/alumni`,
    siteName: SITE_NAME,
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Al-Mukhtar Alumni Network",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alumni Directory & Graduates | Al-Mukhtar",
    description: "Discover alumni profiles and graduates from Al-Mukhtar Islamic Institute.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
};

export default function AlumniPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Alumni", url: "/alumni" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <Students />
    </>
  );
}
