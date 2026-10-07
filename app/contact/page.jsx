import Contact from "@/pages_migrated/Contact";
import { SITE_NAME, SITE_URL, getBreadcrumbSchema } from "@/lib/seo";

export const metadata = {
  title: "Contact Al-Mukhtar Institute | Peshawar Campus",
  description:
    "Get in touch with Al-Mukhtar Islamic & Academic Institute. Find campus location at Ghaz Masjid, Tanga Adda, Landi Arbab, Peshawar, phone +92 333 9176894, and contact form.",
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: "Contact Al-Mukhtar Institute | Peshawar Campus",
    description:
      "Get in touch with Al-Mukhtar Islamic & Academic Institute. Location: Ghaz Masjid, Tanga Adda, Landi Arbab, Peshawar. Phone: +92 333 9176894.",
    url: `${SITE_URL}/contact`,
    siteName: SITE_NAME,
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Contact Al-Mukhtar Institute",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Al-Mukhtar Institute | Peshawar Campus",
    description: "Get in touch with Al-Mukhtar Islamic & Academic Institute Peshawar.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
};

export default function ContactPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Contact Us", url: "/contact" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <Contact />
    </>
  );
}
