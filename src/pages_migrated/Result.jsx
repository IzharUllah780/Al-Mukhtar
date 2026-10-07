"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePublicResults, useResultsMeta } from "@/lib/queries/results";
import AdSenseBanner from "@/components/AdSenseBanner";
import {
  FileText,
  Download,
  Eye,
  Search,
  BookOpen,
  RefreshCw,
  ExternalLink,
  X,
  ChevronDown,
  ArrowDownToLine,
  Check,
  ShieldCheck,
  Award,
  MessageCircle,
} from "lucide-react";

export default function Result() {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dropdownRef = useRef(null);
  
  // Search state: Only fetch/show results when search button has been clicked
  const [hasSearched, setHasSearched] = useState(false);
  const [activeCourse, setActiveCourse] = useState("");

  // PDF Preview Modal
  const [previewResult, setPreviewResult] = useState(null);

  // TanStack Query for course metadata (available in dropdown)
  const { data: courses = [] } = useResultsMeta();

  // Results query: Only enabled once the user clicks "Search Result" with a selected course
  const { data: results = [], isLoading, isFetching } = usePublicResults(
    { courseName: activeCourse },
    { enabled: Boolean(hasSearched && activeCourse) }
  );

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (!selectedCourse) {
      setErrorMessage("Please select a course to search results.");
      return;
    }
    setErrorMessage("");
    setActiveCourse(selectedCourse);
    setHasSearched(true);
  };

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setErrorMessage("");
    setDropdownOpen(false);
  };

  const handleReset = () => {
    setSelectedCourse("");
    setActiveCourse("");
    setHasSearched(false);
    setErrorMessage("");
  };

  // Direct download trigger
  const handleDownload = (r) => {
    const link = document.createElement("a");
    link.href = r.pdfUrl;
    link.download = r.pdfName || `${r.courseName.replace(/\s+/g, "_")}_Result.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenNewTab = (r) => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(
        `<iframe src="${r.pdfUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
      );
      newWindow.document.title = `${r.courseName} - Examination Result | Al-Mukhtar Institute`;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#070d18] text-slate-800 dark:text-slate-200 font-sans transition-colors duration-200">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-14 space-y-8 sm:space-y-10">
        
        {/* Page Title & Subtitle */}
        <div className="space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
            Course Examination Results
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Office of Examinations &bull; Published gazettes, mark sheets, and academic evaluation records.
          </p>
        </div>

        {/* ── COURSE SELECTION & SEARCH ACTION BAR ── */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5 pb-4 border-b border-slate-200 dark:border-slate-800">
            
            {/* Custom Dropdown for Course Selection */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className={`inline-flex items-center justify-between gap-2 px-3.5 py-2 rounded-lg border text-xs sm:text-sm transition cursor-pointer min-w-[200px] sm:min-w-[240px] ${
                  selectedCourse
                    ? "bg-slate-50 dark:bg-slate-900 border-teal-600/60 dark:border-teal-500/60 text-slate-900 dark:text-white font-medium"
                    : "bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <BookOpen size={14} className={selectedCourse ? "text-teal-600 dark:text-teal-400 shrink-0" : "text-slate-400 shrink-0"} />
                  <span className="truncate">{selectedCourse || "Select Course"}</span>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 shrink-0 transition-transform duration-150 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-72 max-h-64 overflow-y-auto rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg py-1 z-30 divide-y divide-slate-100 dark:divide-slate-800/60">
                  
                  {/* Disabled Header / Prompt */}
                  <div className="px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono select-none">
                    Select Course
                  </div>

                  {/* Course Options */}
                  {courses.length === 0 ? (
                    <div className="px-3.5 py-2 text-xs text-slate-400">
                      No courses available
                    </div>
                  ) : (
                    courses.map((course, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectCourse(course)}
                        className={`w-full px-3.5 py-2 text-left text-xs transition cursor-pointer flex items-center justify-between ${
                          selectedCourse === course
                            ? "bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-semibold"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span className="truncate pr-2">{course}</span>
                        {selectedCourse === course && (
                          <Check size={13} className="text-teal-600 dark:text-teal-400 shrink-0" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Search Result Button */}
            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold transition active:scale-98 cursor-pointer shadow-xs"
            >
              <Search size={13} />
              <span>Search Result</span>
            </button>

            {/* Reset Action */}
            {(hasSearched || selectedCourse) && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer px-2 py-1"
              >
                Reset
              </button>
            )}

          </div>

          {errorMessage && (
            <p className="text-xs text-rose-500 font-medium pt-0.5">
              {errorMessage}
            </p>
          )}
        </div>

        {/* ── RESULTS SECTION (UNBOXED EDITORIAL DIRECTORY) ── */}
        <div>
          {!hasSearched ? (
            /* Prompt: Search has not been triggered yet */
            <div className="py-8 text-left space-y-1 text-xs text-slate-500 dark:text-slate-400">
              <p>Please select a course from the dropdown above and click <strong className="text-slate-700 dark:text-slate-300 font-semibold">Search Result</strong> to view official records.</p>
            </div>
          ) : isLoading ? (
            /* Loading Indicator */
            <div className="py-12 text-center space-y-2">
              <RefreshCw size={18} className="animate-spin text-teal-600 mx-auto" />
              <p className="text-xs text-slate-500">Searching examination records...</p>
            </div>
          ) : results.length === 0 ? (
            /* No Results */
            <div className="py-8 text-left space-y-1 text-xs">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                No examination results published for {activeCourse}
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                If your examination was recently conducted, the result gazette is currently being compiled by the examination committee.
              </p>
            </div>
          ) : (
            /* Results Table / Ledger */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-1">
                <span>Published gazettes for <strong className="text-slate-800 dark:text-slate-200">{activeCourse}</strong> ({results.length})</span>
                {isFetching && <RefreshCw size={11} className="animate-spin text-teal-600" />}
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-800 border-t border-b border-slate-200 dark:border-slate-800">
                {results.map((r, index) => (
                  <div
                    key={r._id || index}
                    className="py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    {/* Course & Result Information */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-teal-700 dark:text-teal-400">
                          {r.courseName}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          • {r.session || "Session 2025-2026"}
                        </span>
                      </div>

                      <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                        {r.title || `${r.courseName} Official Result Gazette`}
                      </h3>

                      {r.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {r.description}
                        </p>
                      )}
                    </div>

                    {/* Actions: View & Download */}
                    <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => setPreviewResult(r)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition cursor-pointer"
                      >
                        <Eye size={12} />
                        <span>View</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownload(r)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition cursor-pointer"
                      >
                        <ArrowDownToLine size={12} />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── ACADEMIC GRADING & VERIFICATION GUIDELINES ── */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-6 text-xs text-slate-600 dark:text-slate-400">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            
            {/* Grading Scale */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider text-[11px]">
                <Award size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
                <span>Academic Evaluation Key</span>
              </div>
              <ul className="space-y-1.5 text-xs">
                <li className="flex justify-between border-b border-slate-100 dark:border-slate-800/60 pb-1">
                  <span>Mumtaz (Distinction / 1st Position):</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">80% &amp; Above</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 dark:border-slate-800/60 pb-1">
                  <span>Jayyid Jiddan (First Division):</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">65% – 79%</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 dark:border-slate-800/60 pb-1">
                  <span>Jayyid (Second Division):</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">50% – 64%</span>
                </li>
                <li className="flex justify-between">
                  <span>Maqbool (Pass):</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">40% – 49%</span>
                </li>
              </ul>
            </div>

            {/* Transcript & Rechecking Policy */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider text-[11px]">
                <ShieldCheck size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
                <span>Transcript &amp; Verification Policy</span>
              </div>
              <p className="leading-relaxed">
                Official certificates (Sanad) and Detailed Marks Certificates (DMC) are issued through the Examination Branch upon successful course completion. Re-checking applications must be submitted within 15 days of gazette publication.
              </p>
            </div>

          </div>

          {/* Contact Examination Desk */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">Examination Branch Inquiries:</span>
              <span className="text-slate-500">Ghaz Masjid, Tanga Adda, Landi Arbab, Peshawar &bull; Phone: +92 333 9176894</span>
            </div>
            
            <a
              href="https://wa.me/923431775096?text=Assalam-o-Alaikum,%20I%20have%20an%20inquiry%20regarding%20my%20examination%20result%20gazette."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:underline font-semibold shrink-0"
            >
              <MessageCircle size={14} />
              <span>WhatsApp Examination Helpline</span>
            </a>
          </div>

        </div>

        {/* AdSense Unit */}
        <AdSenseBanner />

      </div>

      {/* ── RESPONSIVE PDF MODAL ── */}
      {previewResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-[#0c1827] border border-slate-200 dark:border-slate-800 rounded-xl max-w-3xl w-full shadow-xl overflow-hidden relative max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <FileText size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
                <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {previewResult.courseName} — {previewResult.title || "Result"}
                </h3>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenNewTab(previewResult)}
                  className="p-1.5 rounded text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Open in new tab"
                >
                  <ExternalLink size={13} />
                </button>

                <button
                  type="button"
                  onClick={() => handleDownload(previewResult)}
                  className="px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition cursor-pointer inline-flex items-center gap-1"
                >
                  <Download size={11} />
                  <span>Download</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewResult(null)}
                  className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white transition cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Embedded Iframe */}
            <div className="w-full h-[60vh] sm:h-[68vh] bg-slate-100 dark:bg-slate-950 relative">
              <iframe
                src={`${previewResult.pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                className="w-full h-full border-0"
                title={`${previewResult.courseName} Result`}
              />
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
