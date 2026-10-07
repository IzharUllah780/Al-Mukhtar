import Students from "@/pages_migrated/Students";
import { SITE_NAME, SITE_URL, getBreadcrumbSchema } from "@/lib/seo";

export const metadata = {
  title: "Student Community & Alumni Network | Al-Mukhtar",
  description:
    "Explore our student directory, alumni achievements, and graduates of Islamic jurisprudence and Arabic sciences at Al-Mukhtar Peshawar.",
  alternates: {
    canonical: `${SITE_URL}/students`,
  },
  openGraph: {
    title: "Student Community & Alumni Network | Al-Mukhtar",
    description:
      "Explore our student directory, alumni achievements, and graduates of Al-Mukhtar Institute.",
    url: `${SITE_URL}/students`,
    siteName: SITE_NAME,
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Al-Mukhtar Students and Alumni",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Community & Alumni Network | Al-Mukhtar",
    description: "Explore our student directory and alumni network at Al-Mukhtar Peshawar.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
};

export default function StudentsPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Students", url: "/students" },
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
