import Home from "@/pages_migrated/Home";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from "@/lib/seo";

export const metadata = {
  title: `${SITE_TITLE}`,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: `${SITE_URL}/`,
    siteName: "Al-Mukhtar",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Al-Mukhtar Islamic & Academic Institute",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/og-image.jpg`],
  },
};

export default function HomePage() {
  return <Home />;
}
