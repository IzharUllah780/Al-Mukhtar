"use client";

import React, { useState } from "react";
import BlogCard from "@/components/blog/BlogCard";
import BlogListCard from "@/components/blog/BlogListCard";
import { LayoutGrid, ListFilter } from "lucide-react";

const dummyPosts = [
  {
    slug: "opportunistic-screening-ai-preventive-medicine",
    title: "Opportunistic Screening: How AI is Turning Routine Scans into Preventive Medicine",
    excerpt:
      "Imagine you visit the emergency room with sharp abdominal pain. A doctor orders a CT scan to check for appendicitis. The scan clears you of any acute danger, but a few days later, your physician calls with an unexpected update...",
    coverImage: "/assets/example1.png",
    category: "TECHNOLOGY & AI",
    author: {
      name: "Nabeel Ahmad",
    },
    date: "Sep 3, 2026",
    views: 12,
    readTime: "2 min read",
  },
  {
    slug: "principles-of-classical-fiqh-and-ijtihad",
    title: "Understanding Classical Fiqh: Core Principles of Islamic Jurisprudence in Modern Times",
    excerpt:
      "Exploring how traditional scholars systematically derived rulings from foundational Islamic texts, maintaining balance between divine text and contemporary societal questions.",
    coverImage: "/assets/example2.png",
    category: "ISLAMIC SCIENCES",
    author: {
      name: "Mufti Muhammad Anwar",
    },
    date: "Aug 28, 2026",
    views: 148,
    readTime: "5 min read",
  },
  {
    slug: "mastering-arabic-grammar-for-quran-comprehension",
    title: "Mastering Arabic Grammar: The Step-by-Step Path to Direct Quranic Comprehension",
    excerpt:
      "A guided roadmap for students beginning their journey with Nahw and Sarf, demystifying sentence structures and uncovering morphological precision.",
    coverImage: "/assets/example1.png",
    category: "ARABIC LANGUAGE",
    author: {
      name: "Maulana Tariq Jamil",
    },
    date: "Aug 20, 2026",
    views: 95,
    readTime: "4 min read",
  },
  {
    slug: "seerah-as-a-practical-framework-for-character",
    title: "The Prophetic Character: Translating Seerah into Daily Ethics and Family Life",
    excerpt:
      "How the sunnah provides practical models of empathy, leadership, resilience, and personal character development in everyday interactions.",
    coverImage: "/assets/example2.png",
    category: "SEERAH & MORALS",
    author: {
      name: "Dr. Bilal Philips",
    },
    date: "Aug 15, 2026",
    views: 210,
    readTime: "6 min read",
  },
];

export default function BlogPreviewPage() {
  const [activeTab, setActiveTab] = useState("both");

  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Component Preview
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading mt-1">
              Blog Card Design Showcase
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Live interactive preview of <code className="text-teal-600 dark:text-teal-400 font-mono">BlogCard</code> (Grid) and <code className="text-teal-600 dark:text-teal-400 font-mono">BlogListCard</code> (List).
            </p>
          </div>

          {/* View Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 dark:bg-slate-800/80 rounded-xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab("both")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "both"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All Styles
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("grid")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "grid"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <LayoutGrid size={13} />
              <span>Grid View</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("list")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "list"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <ListFilter size={13} />
              <span>List View</span>
            </button>
          </div>
        </div>

        {/* Section 1: Grid Cards (CARD 1 - example1.png) */}
        {(activeTab === "both" || activeTab === "grid") && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading">
                  1. BlogCard (Grid Style — example1.png)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Vertical 4:3 cover image with uppercase category, 2-line clamped title, metadata row, and excerpt.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {dummyPosts.slice(0, 3).map((post) => (
                <BlogCard key={`grid-${post.slug}`} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Section 2: List Cards (CARD 2 - example2.png) */}
        {(activeTab === "both" || activeTab === "list") && (
          <section className="space-y-6 pt-6 border-t border-slate-200/80 dark:border-slate-800">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading">
                2. BlogListCard (List Style — 2 in a row)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                2 list blogs in a single row with author row, bold title, excerpt, pill badges, and thumbnail.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {dummyPosts.map((post) => (
                <BlogListCard key={`list-${post.slug}`} post={post} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
