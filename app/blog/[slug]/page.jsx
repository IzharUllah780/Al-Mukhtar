import BlogDetail from "@/pages_migrated/BlogDetail";
import dbConnect from "@/lib/db";
import Blog from "@/lib/models/blog.model";
import {
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  getArticleSchema,
  getBreadcrumbSchema,
} from "@/lib/seo";

async function getBlog(slugOrId) {
  try {
    await dbConnect();
    let blog = await Blog.findOne({ slug: slugOrId }).lean();
    if (!blog && slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(slugOrId).lean();
    }
    return blog;
  } catch (error) {
    console.warn("Could not fetch blog for SEO:", error.message);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const blog = await getBlog(slug);

  if (!blog) {
    return {
      title: `Article | Al-Mukhtar Islamic Institute`,
      description:
        "Read articles and research published by scholars and researchers at Al-Mukhtar Institute.",
      alternates: {
        canonical: `${SITE_URL}/blog/${slug || ""}`,
      },
    };
  }

  const articleTitle = `${blog.title} | Al-Mukhtar Blog`;
  const articleDesc =
    blog.description ||
    `Read ${blog.title}, an Islamic research and scholarly article published by Al-Mukhtar Institute.`;
  const canonicalUrl = absoluteUrl(`/blog/${blog.slug || blog._id}`);
  const imageUrl =
    blog.images && blog.images.length > 0
      ? blog.images[0].startsWith("http")
        ? blog.images[0]
        : absoluteUrl(blog.images[0])
      : `${SITE_URL}/og-image.jpg`;

  return {
    title: articleTitle,
    description: articleDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: articleTitle,
      description: articleDesc,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      type: "article",
      publishedTime: blog.createdAt ? new Date(blog.createdAt).toISOString() : undefined,
      modifiedTime: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : undefined,
      section: blog.subject || "Islamic Studies",
    },
    twitter: {
      card: "summary_large_image",
      title: articleTitle,
      description: articleDesc,
      images: [imageUrl],
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const blog = await getBlog(slug);

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    {
      name: blog?.title || "Article",
      url: `/blog/${slug || ""}`,
    },
  ]);

  const articleSchema = blog ? getArticleSchema(blog) : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
      <BlogDetail />
    </>
  );
}
