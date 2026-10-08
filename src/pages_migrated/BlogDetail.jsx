"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, Link, useLocation, useNavigate } from "@/lib/navigation-adapter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useBlogs } from "@/lib/queries";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Eye,
  Share2,
  Printer,
  ShieldCheck,
  MessageCircle,
  BookOpen,
  ChevronDown,
  ListFilter,
  Check,
  Send,
  User,
  Sparkles,
  Tag,
  Loader2,
  Edit3,
  Trash2,
  CornerDownRight,
  X,
  MessageSquare,
  LogIn,
  ZoomIn,
} from "lucide-react";
import { LogoImg, getImageUrl } from "../assets/assets.js";
import ApiErrorState from "../components/ApiErrorState.jsx";
import AdSenseBanner from "../components/AdSenseBanner.jsx";
import { toast } from "react-toastify";
import { formatDate, getReadingTime, getSnippet } from "../components/BlogCard.jsx";

export function renderFormattedDescription(text) {
  if (!text) return null;
  const parts = String(text).split(/(?:<br\s*\/?>|\r?\n)/gi);
  return parts.map((part, index) => (
    <React.Fragment key={index}>
      {part}
      {index < parts.length - 1 && <br />}
    </React.Fragment>
  ));
}

// Isolated, Memoized Blog Content component to prevent React re-renders from wiping Google Translate translated DOM
export const BlogContentRenderer = React.memo(
  function BlogContentRenderer({ htmlContent }) {
    return (
      <div
        className="blog-content max-w-full min-w-0 break-normal hyphens-none text-slate-800 dark:text-slate-200"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  },
  (prevProps, nextProps) => prevProps.htmlContent === nextProps.htmlContent
);

// Smart parser: cleans artifacts, extracts headings (H1-H6, bold headers, or paragraphs), and injects IDs
function processArticleContent(rawHtml) {
  if (!rawHtml) return { html: "", headings: [] };

  // 1. Clean out artificial word-break tags and soft hyphens
  let cleaned = rawHtml
    .replace(/<wbr\s*\/?>/gi, "")
    .replace(/&shy;/gi, "")
    .replace(/[\u00AD\u200B\u200C\u200D\uFEFF]/g, "")
    .replace(/&nbsp;/g, " ");

  let headings = [];
  let headingIndex = 0;

  // 2. First pass: look for H1-H6 tags
  let html = cleaned.replace(
    /<(h[1-6])([^>]*)>(.*?)<\/\1>/gi,
    (match, tag, attrs, inner) => {
      const plainText = inner.replace(/<[^>]*>/g, "").trim();
      if (!plainText) return match;

      const slug =
        plainText
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .slice(0, 40) || `section-${headingIndex}`;

      const id = `${slug}-${headingIndex++}`;
      headings.push({
        id,
        text: plainText,
        level: parseInt(tag[1], 10),
      });

      return `<${tag} id="${id}" ${attrs}>${inner}</${tag}>`;
    }
  );

  // 3. If no standard H1-H6 tags found, scan for bold headings inside paragraphs (<p><strong>...</strong></p>)
  if (headings.length < 2) {
    headingIndex = 0;
    const fallbackHeadings = [];
    const fallbackHtml = cleaned.replace(
      /<p([^>]*)>\s*<(strong|b)>([^<]{3,80})<\/\2>(.*?)<\/p>/gi,
      (match, pAttrs, bTag, boldText, rest) => {
        const plainText = boldText.trim();
        if (!plainText || plainText.length < 3) return match;

        const slug =
          plainText
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .slice(0, 40) || `topic-${headingIndex}`;

        const id = `${slug}-${headingIndex++}`;
        fallbackHeadings.push({
          id,
          text: plainText,
          level: 2,
        });

        return `<p id="${id}" ${pAttrs}><${bTag}>${boldText}</${bTag}>${rest}</p>`;
      }
    );

    if (fallbackHeadings.length >= 2) {
      headings = fallbackHeadings;
      html = fallbackHtml;
    }
  }

  // 4. If still no headings found (e.g. plain text / unstructured story), generate structured section anchors
  if (headings.length === 0) {
    let pCount = 0;
    const generatedHeadings = [];
    html = cleaned.replace(/<p([^>]*)>(.*?)<\/p>/gi, (match, pAttrs, inner) => {
      const plainText = inner.replace(/<[^>]*>/g, "").trim();
      if (!plainText || plainText.length < 20) return match;
      pCount++;
      if (pCount === 1) {
        const id = "overview-section";
        generatedHeadings.push({ id, text: "Overview & Introduction", level: 2 });
        return `<p id="${id}" ${pAttrs}>${inner}</p>`;
      } else if (pCount === 3) {
        const id = "details-section";
        generatedHeadings.push({ id, text: "Key Insights & Discussion", level: 2 });
        return `<p id="${id}" ${pAttrs}>${inner}</p>`;
      } else if (pCount === 6) {
        const id = "conclusion-section";
        generatedHeadings.push({ id, text: "Summary & Conclusion", level: 2 });
        return `<p id="${id}" ${pAttrs}>${inner}</p>`;
      }
      return match;
    });

    if (generatedHeadings.length > 0) {
      headings = generatedHeadings;
    }
  }

  return { html, headings };
}

function BlogDetail() {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  const [activeHeadingId, setActiveHeadingId] = useState("");
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [editingReplyKey, setEditingReplyKey] = useState(null);
  const [editReplyText, setEditReplyText] = useState("");
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(10);
  const [copied, setCopied] = useState(false);
  const [activeImageModal, setActiveImageModal] = useState(null);
  const responsesRef = useRef(null);

  // Fetch current blog post
  const {
    data: blog,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const res = await api.get(`/api/blogs/${slug}`);
      return res.data?.blog || null;
    },
    staleTime: 60 * 1000,
  });

  // Fetch all blogs for "More from Al-Mukhtar"
  const { data: allBlogs = [] } = useBlogs();

  // Post top-level comment
  const addCommentMutation = useMutation({
    mutationFn: async ({ comment }) => {
      const res = await api.post(`/api/blogs/${slug}/comment`, { comment });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog", slug] });
      toast.success("Reflection posted successfully!");
      setNewCommentText("");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to submit reflection.");
    },
  });

  // Update top-level comment
  const updateCommentMutation = useMutation({
    mutationFn: async ({ commentId, comment }) => {
      const res = await api.put(`/api/blogs/${slug}/comment/${commentId}`, { comment });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog", slug] });
      toast.success("Comment updated successfully!");
      setEditingCommentId(null);
      setEditCommentText("");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update comment.");
    },
  });

  // Delete top-level comment
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId) => {
      const res = await api.delete(`/api/blogs/${slug}/comment/${commentId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog", slug] });
      toast.success("Comment deleted.");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete comment.");
    },
  });

  // Post reply to a comment
  const addReplyMutation = useMutation({
    mutationFn: async ({ commentId, comment }) => {
      const res = await api.post(`/api/blogs/${slug}/comment/${commentId}/reply`, { comment });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog", slug] });
      toast.success("Reply posted successfully!");
      setReplyingToCommentId(null);
      setReplyText("");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to post reply.");
    },
  });

  // Update reply
  const updateReplyMutation = useMutation({
    mutationFn: async ({ commentId, replyId, comment }) => {
      const res = await api.put(`/api/blogs/${slug}/comment/${commentId}/reply/${replyId}`, { comment });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog", slug] });
      toast.success("Reply updated successfully!");
      setEditingReplyKey(null);
      setEditReplyText("");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update reply.");
    },
  });

  // Delete reply
  const deleteReplyMutation = useMutation({
    mutationFn: async ({ commentId, replyId }) => {
      const res = await api.delete(`/api/blogs/${slug}/comment/${commentId}/reply/${replyId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog", slug] });
      toast.success("Reply deleted.");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete reply.");
    },
  });

  // Helper to check item author
  const isOwner = (itemUser) => {
    if (!user) return false;
    const currentUserId = user.id || user._id;
    if (!currentUserId) return false;
    const targetId = typeof itemUser === "object" && itemUser?._id ? itemUser._id : itemUser;
    return targetId?.toString() === currentUserId?.toString();
  };

  // Related blogs
  const relatedBlogs = useMemo(() => {
    if (!blog) return [];
    return allBlogs
      .filter((b) => (b.slug || b._id) !== (blog.slug || blog._id))
      .slice(0, 3);
  }, [allBlogs, blog]);

  // Process HTML and extract Headings
  const { html: processedContent, headings } = useMemo(() => {
    return processArticleContent(blog?.content || "");
  }, [blog?.content]);

  // Track active heading on scroll
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const headingElements = headings
        .map((h) => document.getElementById(h.id))
        .filter(Boolean);

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        const top = el.getBoundingClientRect().top + scrollY;
        if (scrollY >= top - 150) {
          setActiveHeadingId(el.id);
          return;
        }
      }
      if (headingElements.length > 0) {
        setActiveHeadingId(headingElements[0].id);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  // Scroll smoothly to heading
  const scrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveHeadingId(id);
      setMobileTocOpen(false);
    }
  };

  // Get share URL using domain from window.location.origin or env
  const getShareUrl = () => {
    if (typeof window !== "undefined" && window.location.origin) {
      const origin = window.location.origin.replace(/\/$/, "");
      return `${origin}/blog/${blog?.slug || slug}`;
    }
    const envDomain = process.env.NEXT_PUBLIC_SITE_URL || "";
    const cleanDomain = envDomain.replace(/\/$/, "");
    return `${cleanDomain}/blog/${blog?.slug || slug}`;
  };

  const handleShare = async () => {
    if (!blog && !slug) return;
    const shareUrl = getShareUrl();

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      toast.success("Blog link copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("Failed to copy link to clipboard");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }
    if (!newCommentText.trim()) {
      toast.error("Please enter your thoughts before posting.");
      return;
    }
    addCommentMutation.mutate({ comment: newCommentText.trim() });
  };

  const handleStartEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditCommentText(comment.comment);
  };

  const handleSaveEditComment = (commentId) => {
    if (!editCommentText.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }
    updateCommentMutation.mutate({ commentId, comment: editCommentText.trim() });
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm("Are you sure you want to delete this reflection?")) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  const handleStartReply = (commentId) => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }
    if (replyingToCommentId === commentId) {
      setReplyingToCommentId(null);
      setReplyText("");
    } else {
      setReplyingToCommentId(commentId);
      setReplyText("");
    }
  };

  const handleSaveReply = (commentId) => {
    if (!replyText.trim()) {
      toast.error("Reply cannot be empty.");
      return;
    }
    addReplyMutation.mutate({ commentId, comment: replyText.trim() });
  };

  const handleStartEditReply = (commentId, reply) => {
    setEditingReplyKey(`${commentId}_${reply._id}`);
    setEditReplyText(reply.comment);
  };

  const handleSaveEditReply = (commentId, replyId) => {
    if (!editReplyText.trim()) {
      toast.error("Reply cannot be empty.");
      return;
    }
    updateReplyMutation.mutate({ commentId, replyId, comment: editReplyText.trim() });
  };

  const handleDeleteReply = (commentId, replyId) => {
    if (window.confirm("Are you sure you want to delete this reply?")) {
      deleteReplyMutation.mutate({ commentId, replyId });
    }
  };

  if (isLoading) {
    return (
      <div className="py-10 bg-slate-50 min-h-screen font-sans">
        <div className="max-w-7xl mx-auto px-3 sm:px-10 lg:px-16 space-y-6">
          <div className="w-48 h-4 bg-slate-200 rounded-md animate-pulse"></div>
          <div className="space-y-3 max-w-4xl">
            <div className="w-28 h-6 bg-slate-200 rounded-full animate-pulse"></div>
            <div className="w-full h-12 bg-slate-200 rounded-xl animate-pulse"></div>
            <div className="w-3/4 h-12 bg-slate-200 rounded-xl animate-pulse"></div>
          </div>
          <div className="w-full h-80 sm:h-[400px] bg-slate-200 rounded-3xl animate-pulse"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
            <div className="lg:col-span-8 bg-white rounded-3xl p-8 border border-slate-200 space-y-4">
              <div className="w-full h-4 bg-slate-200 rounded-md animate-pulse"></div>
              <div className="w-full h-4 bg-slate-200 rounded-md animate-pulse"></div>
              <div className="w-4/5 h-4 bg-slate-200 rounded-md animate-pulse"></div>
              <div className="w-full h-32 bg-slate-100 rounded-xl animate-pulse"></div>
            </div>
            <div className="lg:col-span-4 space-y-6">
              <div className="w-full h-64 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex items-center justify-center px-4 py-16">
        <ApiErrorState
          variant="page"
          title="Unable to load research article"
          message="We couldn't retrieve this publication from the server. Check your connection and click refresh."
          onRetry={refetch}
          isRetrying={isFetching}
          backUrl="/blog"
          backLabel="Return to Blog Index"
        />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-5 py-8">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mx-auto">
            <BookOpen size={24} className="stroke-[1.75]" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-black dark:text-white tracking-tight">
              Article Not Found
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto font-normal">
              The publication or research article you requested has either been archived or does not exist in our academic archive.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/blog"
              className="inline-flex items-center justify-center rounded-full bg-teal-600 text-white hover:bg-teal-700 font-bold text-xs sm:text-sm px-6 py-2.5 gap-2 transition-all shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Blog Index</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const rawImages = Array.isArray(blog.images) && blog.images.length > 0
    ? blog.images
    : (blog.image ? [blog.image] : []);
  const blogImages = rawImages
    .map((img) => getImageUrl(img))
    .filter((src) => typeof src === "string" && src.trim().length > 0);

  const snippet = blog.description || getSnippet(blog.content, 260);
  const readTime = getReadingTime(blog);
  const commentsList = Array.isArray(blog.comments) ? blog.comments : [];

  return (
    <article className="py-4 sm:py-8 md:py-10 bg-white dark:bg-slate-950 min-h-screen font-sans text-slate-900 dark:text-slate-100 overflow-x-clip w-full transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-10 lg:px-16 space-y-4 sm:space-y-6">
        {/* Header Breadcrumbs & Title */}
        <header className="w-full space-y-2.5 sm:space-y-4 pb-1">
          {/* Breadcrumb row */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 flex-wrap">
            <Link to="/blog" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Academic Insights
            </Link>
            <span className="text-slate-400">/</span>
            <Link
              to={`/blog?category=${encodeURIComponent(blog.subject || "Blog")}`}
              className="text-teal-600 dark:text-teal-400 font-bold hover:underline"
            >
              {blog.subject || "Blog"}
            </Link>
          </div>

          {/* Article Title: Crisp mobile typography */}
          <h1 className="text-2xl sm:text-3xl md:text-[38px] lg:text-[42px] font-extrabold tracking-tight text-black dark:text-white font-heading leading-[1.22] sm:leading-[1.2] w-full break-normal hyphens-none">
            {blog.title}
          </h1>

          {/* Lead Paragraph Excerpt */}
          {snippet && (
            <p className="text-[14px] sm:text-base md:text-[17px] text-black dark:text-slate-100 leading-relaxed font-normal w-full break-normal hyphens-none pt-0.5">
              {renderFormattedDescription(snippet)}
            </p>
          )}
        </header>

        {/* Featured Image / Gallery Presentation */}
        {blogImages.length > 0 && (
          <div className="w-full">
            <div
              className={`grid gap-2.5 sm:gap-4 items-stretch ${blogImages.length === 1
                ? "grid-cols-1 sm:max-w-md md:max-w-lg"
                : blogImages.length === 2
                  ? "grid-cols-1 sm:grid-cols-2"
                  : blogImages.length === 3
                    ? "grid-cols-1 sm:grid-cols-3"
                    : "grid-cols-2 sm:grid-cols-2 md:grid-cols-4"
                }`}
            >
              {blogImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImageModal(img)}
                  className={`group relative rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer ${blogImages.length === 1
                    ? "h-48 sm:h-64 md:h-76 w-full"
                    : blogImages.length === 2
                      ? "h-48 sm:h-64 md:h-76"
                      : "h-40 sm:h-52 md:h-64"
                    }`}
                  title="Click to view full image"
                >
                  <img
                    src={img}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = LogoImg;
                      e.currentTarget.className = "max-h-24 max-w-[65%] object-contain m-auto drop-shadow-sm";
                    }}
                    alt={`${blog.title} - Image ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                    <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-slate-100 text-[11px] font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                      <ZoomIn size={13} />
                      <span>View Full Image</span>
                    </span>
                    {blogImages.length > 1 && (
                      <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-white">
                        {idx + 1} / {blogImages.length}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MOBILE Table of Contents: Placed directly after the cover image & gallery */}
        {headings.length > 0 && (
          <div className="block lg:hidden w-full my-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 shadow-2xs">
            <button
              type="button"
              onClick={() => setMobileTocOpen(!mobileTocOpen)}
              className="w-full flex items-center justify-between text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[#0D9488] dark:text-teal-400 shadow-2xs">
                  <ListFilter className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-heading">
                  Table of Contents
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0D9488] dark:text-teal-400 font-mono">
                  {headings.length} Sections
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="text-[11px] font-medium hidden sm:inline">
                  {mobileTocOpen ? "Collapse" : "Explore Sections"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    mobileTocOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {mobileTocOpen && (
              <nav className="mt-3 pt-2 space-y-1 max-h-64 overflow-y-auto toc-scrollbar pr-1">
                {headings.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => scrollToHeading(h.id)}
                    className={`block w-full text-left py-2 px-2.5 rounded-xl text-xs cursor-pointer transition-all hover:underline underline-offset-3 hover:text-teal-600 dark:hover:text-blue-400 ${
                      h.level === 3 ? "pl-5 text-[11px]" : "font-semibold"
                    } ${
                      activeHeadingId === h.id
                        ? "bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 font-bold underline border border-teal-200/60 dark:border-teal-800/60"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {h.text}
                  </button>
                ))}
              </nav>
            )}
          </div>
        )}

        {/* 2-Column Main Reading Grid (Left: Expanded Content (col-9), Right: Compact Sticky TOC (col-3)) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start pt-2 w-full">
          {/* Main Article Content (Expanded to lg:col-span-9) */}
          <div className="lg:col-span-9 min-w-0 w-full space-y-8">
            {/* Rendered Prose Content with Natural Word Wrapping */}
            <div className="prose prose-slate dark:prose-invert max-w-full min-w-0 w-full break-normal hyphens-none [word-break:normal] [overflow-wrap:break-word] text-sm sm:text-[15px] md:text-[16px] lg:text-[16px] leading-relaxed prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-700 dark:prose-p:text-slate-200 prose-a:text-teal-600 dark:prose-a:text-blue-400 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-img:shadow-sm [&_img]:max-w-full [&_img]:h-auto prose-blockquote:border-l-4 prose-blockquote:border-l-[#0D9488] prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-900 prose-blockquote:py-2.5 prose-blockquote:px-4 prose-blockquote:rounded-r-xl prose-blockquote:text-slate-700 dark:prose-blockquote:text-slate-300 prose-blockquote:not-italic prose-strong:text-slate-900 dark:prose-strong:text-white prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:text-[#0D9488] dark:prose-code:text-teal-300 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:max-w-full prose-pre:overflow-x-auto [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:block [&_iframe]:max-w-full">
              <BlogContentRenderer htmlContent={processedContent} />
            </div>

            {/* Related Topics & Category Tags */}
            <div className="mt-8 pt-2 space-y-2.5">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono block">
                Related Topics
              </span>
              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/blog?category=${encodeURIComponent(blog.subject || "Blog")}`}
                  className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700 hover:text-[#0D9488] dark:hover:text-teal-300 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
                >
                  #{blog.subject || "Blog"}
                </Link>
                <Link
                  to={`/blog?search=${encodeURIComponent(blog.title.split(" ")[0])}`}
                  className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700 hover:text-[#0D9488] dark:hover:text-teal-300 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
                >
                  #{blog.title.split(" ")[0]}
                </Link>
              </div>
            </div>

            {/* AdSense Unit at Blog Article Ending */}
            <AdSenseBanner className="mt-8 mb-2" />

            {/* Author & Editorial Metadata / Action Bar (End of Blog Article) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pt-6 pb-2">
              {/* Author / Institute Profile */}
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shrink-0 ring-2 ring-slate-200 dark:ring-slate-700 bg-white dark:bg-slate-900 shadow-xs">
                  <img
                    src={LogoImg}
                    alt="Al-Mukhtar Institute"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span className="font-bold text-black dark:text-white text-xs sm:text-sm">
                      Al-Mukhtar Institute
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/60 px-2 py-0.5 rounded-full font-mono">
                      <ShieldCheck className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                      Verified
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 dark:text-slate-500" />
                      <span>{readTime}</span>
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span>{formatDate(blog.createdAt)}</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 dark:text-slate-500" />
                      <span>{blog.views ?? 0} views</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Integrated Action Controls */}
              <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => responsesRef.current?.scrollIntoView({ behavior: "smooth" })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/60 hover:text-teal-700 dark:hover:text-teal-300 transition-colors cursor-pointer border border-slate-200/80 dark:border-slate-700"
                  title="Jump to responses"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>{commentsList.length}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200/80 dark:border-slate-700"
                  title="Share article"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                      <span>Share</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="p-1.5 rounded-full text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer hidden sm:inline-flex border border-slate-200/80 dark:border-slate-700"
                  title="Print article"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Sticky Table of Contents & Sidebar on the RIGHT Side (Compact lg:col-span-3) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 self-start pl-2 lg:pl-4 space-y-6 font-sans shrink-0 min-w-0 w-full z-10">
            {/* Table of Contents Header & Items */}
            {headings.length > 0 && (
              <div className="w-full flex flex-col font-sans max-h-[calc(100vh-140px)]">
                <div className="shrink-0 flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider font-mono">
                    <BookOpen className="w-3.5 h-3.5 text-[#0D9488] dark:text-teal-400" />
                    <span>Table of Contents</span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                    {headings.length} Topics
                  </span>
                </div>

                <nav className="flex-1 overflow-y-auto pr-1.5 mt-3 space-y-1.5 text-xs border-l-2 border-slate-200 dark:border-slate-700 pl-2.5 scroll-smooth toc-scrollbar">
                  {headings.map((h) => {
                    const isActive = activeHeadingId === h.id;
                    return (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => scrollToHeading(h.id)}
                        className={`block w-full text-left transition-all py-1 leading-snug cursor-pointer break-normal hover:underline underline-offset-3 hover:text-teal-600 dark:hover:text-blue-400 ${
                          h.level === 3 ? "pl-2.5 text-[11px]" : "font-semibold"
                        } ${
                          isActive
                            ? "text-teal-600 dark:text-teal-400 font-bold underline translate-x-1"
                            : "text-slate-600 dark:text-slate-300 hover:translate-x-0.5"
                        }`}
                      >
                        {h.text}
                      </button>
                    );
                  })}
                </nav>
              </div>
            )}
          </aside>
        </div>

        {/* Below Article Section (TOC has stopped scrolling above) */}
        <div className="pt-6 sm:pt-8 space-y-8 sm:space-y-10 w-full max-w-4xl">
          {/* Interactive Responses & Realtime Discussions */}
          <div
            id="responses-section"
            ref={responsesRef}
            className="space-y-3 sm:space-y-4 pt-2"
          >
            {/* Comment Input (Simple, Unboxed, Compact) */}
            {!user ? (
              <div className="py-2 flex items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300 flex-wrap">
                <span>Sign in with your account to participate in discussion.</span>
                <div className="flex items-center gap-2 font-medium">
                  <Link
                    to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
                    className="font-bold text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    Sign In
                  </Link>
                  <span className="text-slate-400">•</span>
                  <Link
                    to={`/signup?redirect=${encodeURIComponent(location.pathname)}`}
                    className="hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCommentSubmit} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-xs font-semibold text-teal-700 dark:text-teal-300">
                    @{user.username}
                  </span>
                </div>

                <textarea
                  rows={2}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Share your thoughts, ask scholarly questions, or contribute a reflection..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-teal-600 dark:focus:border-teal-400 resize-none transition-colors"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={addCommentMutation.isPending || !newCommentText.trim()}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addCommentMutation.isPending ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Posting...</span>
                      </>
                    ) : (
                      <>
                        <span>Post Comment</span>
                        <Send className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Live Comments List (Unboxed, Compact) */}
            <div className="space-y-3 pt-2">
              {commentsList.length > 0 ? (
                <>
                  {commentsList.slice(0, visibleCommentsCount).map((c, index) => {
                    const authorName =
                      (typeof c.user === "object" && c.user?.username) ||
                      c.name ||
                      "Anonymous";
                    const canManage = isOwner(c.user) || isAdmin;
                    const isEditing = editingCommentId === c._id;
                    const isReplying = replyingToCommentId === c._id;
                    const replies = Array.isArray(c.replies) ? c.replies : [];

                    return (
                      <div
                        key={c._id || index}
                        className="py-1.5 space-y-1 text-left"
                      >
                        {/* Comment Header */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0 flex-wrap">
                            <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                              {authorName}
                            </span>
                            <span className="text-slate-400 dark:text-slate-500 text-[10px] font-mono">
                              {formatDate(c.createdAt)}
                              {c.updatedAt && (
                                <span className="ml-1 text-teal-600 dark:text-teal-400 italic">
                                  (edited)
                                </span>
                              )}
                            </span>
                          </div>

                          {/* Action buttons if owner or admin */}
                          {canManage && !isEditing && (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleStartEditComment(c)}
                                className="p-1 rounded text-slate-400 hover:text-teal-600 dark:hover:text-teal-300 transition-colors cursor-pointer"
                                title="Edit"
                              >
                                <Edit3 size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteComment(c._id)}
                                disabled={deleteCommentMutation.isPending}
                                className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Comment Body or Inline Edit Form */}
                        {isEditing ? (
                          <div className="space-y-1.5 pt-1">
                            <textarea
                              rows={2}
                              value={editCommentText}
                              onChange={(e) => setEditCommentText(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-600 resize-none"
                            />
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setEditingCommentId(null)}
                                className="px-2.5 py-1 rounded text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveEditComment(c._id)}
                                disabled={updateCommentMutation.isPending || !editCommentText.trim()}
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                              >
                                {updateCommentMutation.isPending ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Check className="w-3 h-3" />
                                )}
                                <span>Save</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-snug whitespace-pre-wrap break-words">
                            {c.comment}
                          </p>
                        )}

                        {/* Reply Trigger */}
                        <div className="flex items-center gap-2 pt-0.5 text-xs">
                          <button
                            type="button"
                            onClick={() => handleStartReply(c._id)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                          >
                            <CornerDownRight size={11} />
                            <span>Reply</span>
                            {replies.length > 0 && (
                              <span className="text-[10px] font-mono text-slate-400">
                                ({replies.length})
                              </span>
                            )}
                          </button>
                        </div>

                        {/* Inline Reply Form */}
                        {isReplying && (
                          <div className="mt-1.5 p-2.5 rounded-xl bg-slate-50/90 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono text-[11px] text-teal-700 dark:text-teal-300">
                                @{user?.username}
                              </span>
                              <button
                                type="button"
                                onClick={() => setReplyingToCommentId(null)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                              >
                                <X size={13} />
                              </button>
                            </div>
                            <textarea
                              rows={2}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={`Reply to @${authorName}...`}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-600 resize-none"
                            />
                            <div className="flex justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setReplyingToCommentId(null)}
                                className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveReply(c._id)}
                                disabled={addReplyMutation.isPending || !replyText.trim()}
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                              >
                                {addReplyMutation.isPending ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Send className="w-3 h-3" />
                                )}
                                <span>Reply</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Nested Replies */}
                        {replies.length > 0 && (
                          <div className="border-l-2 border-slate-200 dark:border-slate-800 ml-1 sm:ml-2 pl-2.5 sm:pl-3.5 space-y-2 mt-1.5">
                            {replies.map((r, rIdx) => {
                              const replyAuthorName =
                                (typeof r.user === "object" && r.user?.username) ||
                                r.name ||
                                "Anonymous";
                              const canManageReply = isOwner(r.user) || isAdmin;
                              const replyEditKey = `${c._id}_${r._id}`;
                              const isEditingReply = editingReplyKey === replyEditKey;

                              return (
                                <div
                                  key={r._id || rIdx}
                                  className="space-y-0.5 text-left"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                                        {replyAuthorName}
                                      </span>
                                      <span className="text-slate-400 dark:text-slate-500 text-[9px] font-mono">
                                        {formatDate(r.createdAt)}
                                        {r.updatedAt && (
                                          <span className="ml-1 text-teal-600 dark:text-teal-400 italic">
                                            (edited)
                                          </span>
                                        )}
                                      </span>
                                    </div>

                                    {canManageReply && !isEditingReply && (
                                      <div className="flex items-center gap-1">
                                        <button
                                          type="button"
                                          onClick={() => handleStartEditReply(c._id, r)}
                                          className="p-1 text-slate-400 hover:text-teal-600 cursor-pointer"
                                          title="Edit"
                                        >
                                          <Edit3 size={11} />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteReply(c._id, r._id)}
                                          disabled={deleteReplyMutation.isPending}
                                          className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                                          title="Delete"
                                        >
                                          <Trash2 size={11} />
                                        </button>
                                      </div>
                                    )}
                                  </div>

                                  {isEditingReply ? (
                                    <div className="space-y-1 pt-1">
                                      <textarea
                                        rows={2}
                                        value={editReplyText}
                                        onChange={(e) => setEditReplyText(e.target.value)}
                                        className="w-full px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-600 resize-none"
                                      />
                                      <div className="flex justify-end gap-1.5">
                                        <button
                                          type="button"
                                          onClick={() => setEditingReplyKey(null)}
                                          className="px-2 py-0.5 text-[11px] text-slate-500"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleSaveEditReply(c._id, r._id)}
                                          disabled={updateReplyMutation.isPending || !editReplyText.trim()}
                                          className="px-2.5 py-0.5 rounded-lg bg-teal-600 text-white text-[11px] font-bold"
                                        >
                                          Save
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug whitespace-pre-wrap break-words">
                                      {r.comment}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Show More Button if more than 10 comments */}
                  {commentsList.length > visibleCommentsCount && (
                    <div className="pt-2 text-center">
                      <button
                        type="button"
                        onClick={() => setVisibleCommentsCount((prev) => prev + 10)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                      >
                        <span>Show more comments ({commentsList.length - visibleCommentsCount} more)</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs text-slate-400 dark:text-slate-500 py-2 text-left">
                  No comments yet. Be the first to share your thoughts!
                </p>
              )}
            </div>
          </div>

          {/* "More from Al-Mukhtar Institute" Related Articles */}
          {relatedBlogs.length > 0 && (
            <div className="pt-6 space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white font-heading">
                  More from Academic Insights
                </h3>
                <Link
                  to="/blog"
                  className="text-xs font-bold text-[#0D9488] dark:text-teal-400 hover:underline flex items-center gap-1"
                >
                  <span>View all</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {relatedBlogs.map((rel) => {
                  const relImg = getImageUrl(
                    (Array.isArray(rel.images) && rel.images.length > 0)
                      ? rel.images[0]
                      : rel.image
                  );
                  return (
                    <Link
                      key={rel._id || rel.slug}
                      to={`/blog/${rel.slug || rel._id}`}
                      className="group p-2.5 sm:p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-900 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 transition-all flex flex-col space-y-2 sm:space-y-2.5"
                    >
                      <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                        {relImg ? (
                          <img
                            src={relImg}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = LogoImg;
                              e.currentTarget.className = "max-h-16 max-w-[70%] object-contain m-auto drop-shadow-2xs";
                            }}
                            alt={rel.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-tr from-[#0F766E] to-[#0A2540] flex items-center justify-center text-white">
                            <BookOpen className="w-6 h-6 text-teal-200" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1 flex-1 flex flex-col justify-between">
                        <span className="text-[10px] font-bold text-[#0D9488] dark:text-teal-400 uppercase font-mono">
                          {rel.subject || "Blog"}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0D9488] dark:group-hover:text-teal-300 transition-colors line-clamp-2 leading-snug break-normal">
                          {rel.title}
                        </h4>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Image Lightbox Modal */}
      {activeImageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveImageModal(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveImageModal(null)}
              className="absolute -top-10 right-0 sm:right-2 text-white/80 hover:text-white p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
              title="Close image view"
            >
              <X size={20} />
            </button>
            <img
              src={activeImageModal}
              alt="Full view"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}
    </article>
  );
}

export default BlogDetail;
