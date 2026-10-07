export const SITE_URL = "https://almukhtar.org.pk";
export const SITE_NAME = "Al-Mukhtar";
export const SITE_TITLE = "Al-Mukhtar — Where the Chosen Rise";
export const SITE_DESCRIPTION =
  "An esteemed Islamic institution cultivating future scholars and principled leaders through traditional Islamic jurisprudence, Tajweed, Quranic sciences, Arabic linguistics, and contemporary leadership in Peshawar, Pakistan.";

export function absoluteUrl(path = "") {
  if (!path) return SITE_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath === "/" ? "" : cleanPath}`;
}

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: [
      "Al-Mukhtar Institute",
      "Al-Mukhtar Islamic & Academic Institute",
      "جامعہ المختار الاسلامیہ پشاور",
    ],
    url: `${SITE_URL}/`,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/icon-512.png`,
      width: 512,
      height: 512,
      caption: "Al-Mukhtar Institute Official Emblem",
    },
    image: `${SITE_URL}/og-image.jpg`,
    description: SITE_DESCRIPTION,
    slogan: "Where the chosen rise",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ghaz Masjid, Tanga Adda, Landi Arbab",
      addressLocality: "Peshawar",
      addressRegion: "KPK",
      postalCode: "25000",
      addressCountry: "PK",
    },
    telephone: "+923339176894",
    email: "izhar5ullah@gmail.com",
    founder: {
      "@type": "Person",
      name: "Hazrat Maulana Muhammad Anwar",
      jobTitle: "Founder & Patron-in-Chief",
    },
    sameAs: [
      "https://www.facebook.com/share/1QH9nYGA2p/?mibextid=wwXIfr",
      "https://youtube.com/@muhammad.anwar80?feature=shared",
      "https://www.tiktok.com/@mulanaanwar?_r=1&_t=ZS-9AD9P9nw4kW",
    ],
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    alternateName: [
      "Al-Mukhtar Institute",
      "Al-Mukhtar Islamic & Academic Institute",
    ],
    description: SITE_DESCRIPTION,
    inLanguage: ["en", "ur"],
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
  };
}

export function getBreadcrumbSchema(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : absoluteUrl(item.url),
    })),
  };
}

export function getCourseSchema(course) {
  if (!course) return null;
  const courseUrl = absoluteUrl(`/courses/${course.slug || course._id}`);
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description:
      course.description ||
      `Comprehensive Islamic studies course: ${course.title} at Al-Mukhtar Institute.`,
    provider: {
      "@type": "EducationalOrganization",
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      "@id": `${SITE_URL}/#organization`,
    },
    educationalLevel: course.level || "All Levels",
    timeRequired: course.duration || undefined,
    url: courseUrl,
    image: course.image || `${SITE_URL}/og-image.jpg`,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Onsite & Online",
      location: {
        "@type": "Place",
        name: "Al-Mukhtar Peshawar Campus",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Ghaz Masjid, Tanga Adda, Landi Arbab",
          addressLocality: "Peshawar",
          addressRegion: "KPK",
          addressCountry: "PK",
        },
      },
    },
  };
}

export function getArticleSchema(blog) {
  if (!blog) return null;
  const blogUrl = absoluteUrl(`/blog/${blog.slug || blog._id}`);
  const imageUrl =
    blog.images && blog.images.length > 0
      ? blog.images[0].startsWith("http")
        ? blog.images[0]
        : absoluteUrl(blog.images[0])
      : `${SITE_URL}/og-image.jpg`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${blogUrl}#article`,
    headline: blog.title,
    description:
      blog.description ||
      "Islamic insights, academic research and scholarly article published by Al-Mukhtar Institute.",
    articleSection: blog.subject || "Islamic Studies",
    inLanguage: "en",
    image: imageUrl,
    datePublished: blog.createdAt ? new Date(blog.createdAt).toISOString() : undefined,
    dateModified: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": blogUrl,
    },
    author: {
      "@type": "Organization",
      name: "Al-Mukhtar Editorial Board",
      url: `${SITE_URL}/`,
    },
    publisher: {
      "@type": "EducationalOrganization",
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon-512.png`,
      },
    },
  };
}

