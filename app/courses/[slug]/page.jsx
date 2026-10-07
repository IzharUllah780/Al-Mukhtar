import CourseDetails from "@/components/CourseDetails";
import dbConnect from "@/lib/db";
import Course from "@/lib/models/course.model";
import {
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  getCourseSchema,
  getBreadcrumbSchema,
} from "@/lib/seo";

async function getCourse(slugOrId) {
  try {
    await dbConnect();
    let course = await Course.findOne({ slug: slugOrId }).lean();
    if (!course && slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      course = await Course.findById(slugOrId).lean();
    }
    return course;
  } catch (error) {
    console.warn("Could not fetch course for SEO:", error.message);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const course = await getCourse(slug);

  if (!course) {
    return {
      title: `Course Details | Al-Mukhtar`,
      description:
        "Explore comprehensive Islamic studies and specialized academic programs at Al-Mukhtar Institute.",
      alternates: {
        canonical: `${SITE_URL}/courses/${slug || ""}`,
      },
    };
  }

  const courseTitle = `${course.title} | Islamic Courses | ${SITE_NAME}`;
  const courseDesc =
    course.description ||
    `Enroll in ${course.title} at Al-Mukhtar Islamic Institute. Level: ${
      course.level || "All levels"
    }. Duration: ${course.duration || "Flexible"}.`;
  const canonicalUrl = absoluteUrl(`/courses/${course.slug || course._id}`);
  const imageUrl = course.image ? absoluteUrl(course.image) : `${SITE_URL}/og-image.jpg`;

  return {
    title: courseTitle,
    description: courseDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: courseTitle,
      description: courseDesc,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: course.title,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: courseTitle,
      description: courseDesc,
      images: [imageUrl],
    },
  };
}

export default async function CourseDetailPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const course = await getCourse(slug);

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Courses", url: "/courses" },
    {
      name: course?.title || "Course Details",
      url: `/courses/${slug || ""}`,
    },
  ]);

  const courseSchema = course ? getCourseSchema(course) : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      {courseSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
        />
      )}
      <CourseDetails />
    </>
  );
}
