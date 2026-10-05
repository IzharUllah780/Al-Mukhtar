"use client";

import React, { useState, useMemo, useRef } from "react";
import { useBlogs } from "@/lib/queries";
import { Link, useSearchParams } from "@/lib/navigation-adapter";
import api from "@/lib/api";
import {
  Search,
  List as ListIcon,
  LayoutGrid,
  Sparkles,
  ArrowRight,
  Eye,
  Mail,
  X,
  BookOpen,
  SlidersHorizontal,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Tag,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import BlogCard, { calculateReadingStats } from "../components/BlogCard.jsx";
import ApiErrorState from "../components/ApiErrorState.jsx";
import AdSenseBanner from "../components/AdSenseBanner.jsx";
import { toast } from "react-toastify";

const BLOGS_PER_PAGE = 24;

function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const articlesSectionRef = useRef(null);

  const {
    data: blogs = [],
    isLoading,
    isError,
    refetch,
  } = useBlogs();

  // Extract dynamic categories with counts (capped to at most 5 buttons total: All + top 4)
  const displayedCategories = useMemo(() => {
    const counts = {};
    blogs.forEach((b) => {
      const subject = b.subject ? b.subject.trim() : "General";
      counts[subject] = (counts[subject] || 0) + 1;
    });

    // Sort subjects by count descending
    const sortedSubjects = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);

    // Take top 4 categories
    let topCategories = sortedSubjects.slice(0, 4);

    // If active category is selected but not in top 4, include it
    if (
      selectedCategory !== "All" &&
      !topCategories.some((c) => c.toLowerCase() === selectedCategory.toLowerCase()) &&
      counts[selectedCategory]
    ) {
      topCategories = [...topCategories.slice(0, 3), selectedCategory];
    }

    const result = { All: blogs.length };
    topCategories.forEach((cat) => {
      result[cat] = counts[cat] || 0;
    });

    return result;
  }, [blogs, selectedCategory]);

  // Extract popular tags
  const activeTags = useMemo(() => {
    const subjects = new Set();
    blogs.forEach((b) => {
      if (b.subject) subjects.add(b.subject.trim());
    });
    return Array.from(subjects).slice(0, 8);
  }, [blogs]);

  // Filter & Sort blogs
  const filteredBlogs = useMemo(() => {
    let result = [...blogs];

    // Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter(
        (b) => (b.subject || "General").toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((b) => {
        const titleMatch = (b.title || "").toLowerCase().includes(q);
        const subjectMatch = (b.subject || "").toLowerCase().includes(q);
        const descriptionMatch = (b.description || "").toLowerCase().includes(q);
        const contentMatch = (b.content || "").toLowerCase().includes(q);
        return titleMatch || subjectMatch || descriptionMatch || contentMatch;
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "views") return (b.views || 0) - (a.views || 0);
      if (sortBy === "readTime") {
        return calculateReadingStats(a).seconds - calculateReadingStats(b).seconds;
      }
      return 0;
    });

    return result;
  }, [blogs, selectedCategory, searchQuery, sortBy]);

  // Pagination calculation: 24 blogs per page
  const totalPages = Math.ceil(filteredBlogs.length / BLOGS_PER_PAGE) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedBlogs = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * BLOGS_PER_PAGE;
    return filteredBlogs.slice(startIndex, startIndex + BLOGS_PER_PAGE);
  }, [filteredBlogs, safeCurrentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === safeCurrentPage) return;
    setCurrentPage(page);
    if (articlesSectionRef.current) {
      const yOffset = -80;
      const element = articlesSectionRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPaginationRange = (current, total) => {
    const delta = 1;
    const range = [];
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }
    if (current - delta > 2) {
      range.unshift("...");
    }
    if (current + delta < total - 1) {
      range.push("...");
    }
    range.unshift(1);
    if (total > 1) {
      range.push(total);
    }
    return range;
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    if (category === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen font-sans text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Professional Editorial Hero Section - Solid Clean Background */}
      <section className="relative bg-white dark:bg-slate-950 pt-6 sm:pt-8 pb-3 sm:pb-4">
        <div className="max-w-3xl px-4 sm:px-6 lg:px-17 text-start space-y-2.5 sm:space-y-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading leading-tight">
            Articles &amp; <span className="text-teal-600 dark:text-teal-400">Publications</span>
          </h1>

        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-3 sm:pt-4 pb-12 sm:pb-16">
        <div className="space-y-6">
          {/* Category Pills & Toolbar Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
            {/* Category Pills (Horizontal Scroll) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-nowrap whitespace-nowrap">
              {Object.entries(displayedCategories).map(([cat, count]) => {
                const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                      isActive
                        ? "bg-teal-600 dark:bg-teal-600 text-white shadow-sm font-bold"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sort & View Options */}
            <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 dark:text-slate-500 text-xs hidden sm:inline font-mono">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold outline-none cursor-pointer transition-colors border border-transparent dark:border-slate-700 focus:border-teal-600 dark:focus:border-teal-400"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="views">Most Viewed</option>
                  <option value="readTime">Quick Reads</option>
                </select>
              </div>

              {/* View Switcher Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-sm font-bold"
                      : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === "list"
                      ? "bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-sm font-bold"
                      : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                  title="List View"
                >
                  <ListIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Full Width Grid / List Section */}
          <div ref={articlesSectionRef} className="w-full space-y-8 pt-2">
            {isLoading && (
              <div
                className={
                  viewMode === "list"
                    ? "grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"
                    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                }
              >
                {[1, 2, 3, 4, 5, 6].map((n) =>
                  viewMode === "list" ? (
                    <div
                      key={n}
                      className="p-2 sm:p-3 bg-transparent animate-pulse flex flex-row items-start justify-between gap-4 sm:gap-6"
                    >
                      <div className="flex-1 space-y-2.5 py-1 min-w-0">
                        <div className="w-20 h-3 bg-slate-200 dark:bg-slate-700 rounded" />
                        <div className="w-4/5 h-5 bg-slate-200 dark:bg-slate-700 rounded" />
                        <div className="w-full h-3.5 bg-slate-200 dark:bg-slate-700 rounded" />
                        <div className="w-3/4 h-3.5 bg-slate-200 dark:bg-slate-700 rounded" />
                      </div>
                      <div className="w-28 h-24 sm:w-36 sm:h-28 md:w-44 md:h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl shrink-0" />
                    </div>
                  ) : (
                    <div
                      key={n}
                      className="p-4 rounded-3xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 animate-pulse space-y-3"
                    >
                      <div className="w-full aspect-[16/10] bg-slate-200 dark:bg-slate-700 rounded-2xl" />
                      <div className="w-24 h-3.5 bg-slate-200 dark:bg-slate-700 rounded-md" />
                      <div className="w-4/5 h-5 bg-slate-200 dark:bg-slate-700 rounded-md" />
                      <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-md" />
                    </div>
                  )
                )}
              </div>
            )}

            {isError && (
              <ApiErrorState
                title="Unable to load academic articles"
                message="We were unable to connect to the publications archive. Please verify your connection and click refresh."
                onRetry={refetch}
              />
            )}

            {!isLoading && !isError && filteredBlogs.length === 0 && (
              <div className="py-16 text-center space-y-3 bg-slate-50/60 dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 max-w-xl mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-300 flex items-center justify-center mx-auto">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                  No articles found matching criteria
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  {searchQuery
                    ? `No publications found for "${searchQuery}". Try searching with different keywords.`
                    : "No articles are published in this category yet."}
                </p>
                {(searchQuery || selectedCategory !== "All") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      handleCategorySelect("All");
                    }}
                    className="mt-2 px-5 py-2.5 rounded-full bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-all cursor-pointer shadow-sm inline-block"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}

            {/* Render Blogs: Grid vs List layout */}
            {!isLoading && !isError && filteredBlogs.length > 0 && (
              <>
                <div
                  className={
                    viewMode === "list"
                      ? "grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"
                      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                  }
                >
                  {paginatedBlogs.map((blog) => (
                    <BlogCard
                      key={blog._id || blog.slug}
                      blog={blog}
                      layout={viewMode}
                      onCategoryClick={handleCategorySelect}
                    />
                  ))}
                </div>

                {/* Pagination Toolbar when totalPages > 1 */}
                {totalPages > 1 ? (
                  <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      Showing <span className="font-bold text-slate-900 dark:text-white">{(safeCurrentPage - 1) * BLOGS_PER_PAGE + 1}</span>–<span className="font-bold text-slate-900 dark:text-white">{Math.min(safeCurrentPage * BLOGS_PER_PAGE, filteredBlogs.length)}</span> of <span className="font-bold text-slate-900 dark:text-white">{filteredBlogs.length}</span> articles
                    </p>

                    <div className="flex items-center gap-1.5 flex-wrap justify-center">
                      {/* Previous Button */}
                      <button
                        type="button"
                        onClick={() => handlePageChange(safeCurrentPage - 1)}
                        disabled={safeCurrentPage === 1}
                        className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-teal-600 dark:hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Prev</span>
                      </button>

                      {/* Page Numbers */}
                      {getPaginationRange(safeCurrentPage, totalPages).map((item, idx) => {
                        if (item === "...") {
                          return (
                            <span
                              key={`ellipsis-${idx}`}
                              className="px-2 py-1 text-slate-400 dark:text-slate-500 text-xs select-none"
                            >
                              •••
                            </span>
                          );
                        }

                        const isPageActive = item === safeCurrentPage;
                        return (
                          <button
                            key={`page-${item}`}
                            type="button"
                            onClick={() => handlePageChange(item)}
                            className={`w-9 h-9 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                              isPageActive
                                ? "bg-teal-600 text-white shadow-sm scale-105"
                                : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-teal-600 dark:hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-300 shadow-sm"
                            }`}
                          >
                            {item}
                          </button>
                        );
                      })}

                      {/* Next Button */}
                      <button
                        type="button"
                        onClick={() => handlePageChange(safeCurrentPage + 1)}
                        disabled={safeCurrentPage === totalPages}
                        className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-teal-600 dark:hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
                        aria-label="Next page"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Feed Summary when 1 page only */
                  <div className="pt-6 text-center text-xs text-slate-400 dark:text-slate-500 font-mono">
                    Showing {filteredBlogs.length} of {blogs.length} published articles
                  </div>
                )}
              </>
            )}
            {/* AdSense Unit at Blog Page Ending */}
            <AdSenseBanner className="mt-10 max-w-5xl mx-auto" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Blog;
