import Result from "@/pages_migrated/Result";
import { SITE_NAME, SITE_URL, getBreadcrumbSchema } from "@/lib/seo";

export const metadata = {
  title: "Student Examination Results Portal | Al-Mukhtar",
  description:
    "Official Al-Mukhtar student examination result portal. Search and verify course results, annual exam gazettes, and academic evaluation records in Peshawar.",
  alternates: {
    canonical: `${SITE_URL}/result`,
  },
  openGraph: {
    title: "Student Examination Results Portal | Al-Mukhtar",
    description:
      "Official Al-Mukhtar student examination result portal. Search and verify course results, annual exam gazettes, and mark sheets.",
    url: `${SITE_URL}/result`,
    siteName: SITE_NAME,
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Al-Mukhtar Examination Results",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Examination Results Portal | Al-Mukhtar",
    description: "Search and verify course results and official academic mark sheets.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
};

export default function ResultPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Examination Results", url: "/result" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <Result />
    </>
  );
}
