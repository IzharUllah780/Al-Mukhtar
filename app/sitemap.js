import dbConnect from "@/lib/db";
import Course from "@/lib/models/course.model";
import Blog from "@/lib/models/blog.model";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap() {
  const staticRoutes = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/courses`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/apply`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/result`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/teachers`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/students`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/videos`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  let courseRoutes = [];
  let blogRoutes = [];

  try {
    await dbConnect();

    const courses = await Course.find({}, "slug updatedAt createdAt").lean();
    courseRoutes = (courses || [])
      .filter((course) => course.slug)
      .map((course) => ({
        url: `${SITE_URL}/courses/${course.slug}`,
        lastModified: course.updatedAt || course.createdAt || new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }));

    const blogs = await Blog.find({ status: "published" }, "slug updatedAt createdAt").lean();
    blogRoutes = (blogs || [])
      .filter((blog) => blog.slug)
      .map((blog) => ({
        url: `${SITE_URL}/blog/${blog.slug}`,
        lastModified: blog.updatedAt || blog.createdAt || new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      }));
  } catch (error) {
    console.warn("Could not fetch dynamic sitemap entries from DB:", error.message);
  }

  return [...staticRoutes, ...courseRoutes, ...blogRoutes];
}
