import Apply from "@/pages_migrated/Apply";
import { PrivateRoute } from "@/components/ProtectedRoute";
import { SITE_NAME, SITE_URL, getBreadcrumbSchema } from "@/lib/seo";

export const metadata = {
  title: "Online Admission & Student Registration | Al-Mukhtar Institute",
  description:
    "Apply online for Islamic sciences, Dars-e-Nizami, Tajweed, and short courses at Al-Mukhtar Institute Peshawar. Submit your admission application easily.",
  alternates: {
    canonical: `${SITE_URL}/apply`,
  },
  openGraph: {
    title: "Online Admission & Student Registration | Al-Mukhtar Institute",
    description:
      "Apply online for Islamic sciences, Dars-e-Nizami, Tajweed, and short courses at Al-Mukhtar Institute Peshawar.",
    url: `${SITE_URL}/apply`,
    siteName: SITE_NAME,
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Online Admission at Al-Mukhtar Institute",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Admission & Student Registration | Al-Mukhtar Institute",
    description: "Apply online for Islamic sciences and Dars-e-Nizami at Al-Mukhtar.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
};

export default function ApplyPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Admissions", url: "/apply" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <PrivateRoute>
        <Apply />
      </PrivateRoute>
    </>
  );
}
