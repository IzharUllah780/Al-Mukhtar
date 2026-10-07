import About from "@/pages_migrated/About";
import { SITE_NAME, SITE_URL, getBreadcrumbSchema } from "@/lib/seo";

export const metadata = {
  title: `About Al-Mukhtar | Islamic & Academic Institute Peshawar`,
  description:
    "Learn about Al-Mukhtar Islamic & Academic Institute in Peshawar, founded by Hazrat Maulana Muhammad Anwar. Discover our educational philosophy, Dars-e-Nizami curriculum, and faculty.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: `About Al-Mukhtar | Islamic & Academic Institute Peshawar`,
    description:
      "Learn about Al-Mukhtar Islamic & Academic Institute in Peshawar, founded by Hazrat Maulana Muhammad Anwar. Discover our educational philosophy, Dars-e-Nizami curriculum, and faculty.",
    url: `${SITE_URL}/about`,
    siteName: SITE_NAME,
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "About Al-Mukhtar Institute",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `About Al-Mukhtar | Islamic & Academic Institute Peshawar`,
    description:
      "Learn about Al-Mukhtar Islamic & Academic Institute in Peshawar, founded by Hazrat Maulana Muhammad Anwar.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
};

export default function AboutPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <About />
    </>
  );
}
