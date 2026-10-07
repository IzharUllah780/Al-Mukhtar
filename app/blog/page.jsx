import Blog from "@/pages_migrated/Blog";
import { SITE_NAME, SITE_URL, getBreadcrumbSchema } from "@/lib/seo";

export const metadata = {
  title: "Islamic Articles & Scholarly Research | Al-Mukhtar Blog",
  description:
    "Read insightful Islamic articles, contemporary Fiqh reflections, Quranic commentary, and student research published by scholars at Al-Mukhtar Institute.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "Islamic Articles & Scholarly Research | Al-Mukhtar Blog",
    description:
      "Read insightful Islamic articles, contemporary Fiqh reflections, Quranic commentary, and student research published by scholars at Al-Mukhtar Institute.",
    url: `${SITE_URL}/blog`,
    siteName: SITE_NAME,
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Al-Mukhtar Islamic Blog & Articles",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Islamic Articles & Scholarly Research | Al-Mukhtar Blog",
    description:
      "Read insightful Islamic articles, contemporary Fiqh reflections, and research from Al-Mukhtar.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
};

export default function BlogPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <Blog />
    </>
  );
}
