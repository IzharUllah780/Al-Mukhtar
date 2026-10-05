"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Upload,
  Plus,
  Search,
  Trash2,
  Edit,
  Eye,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  BookOpen,
  Lock,
  Unlock,
  Sparkles,
  Calendar,
  Save,
  FileCheck2,
  ExternalLink,
} from "lucide-react";

export default function AdminCoursePdfResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterReleaseStatus, setFilterReleaseStatus] = useState("all");
  const [coursesList, setCoursesList] = useState([]);

  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    courseName: "",
    title: "Annual Examination Result",
    session: "2025-2026",
    pdfUrl: "",
    pdfName: "",
    pdfSize: "",
    description: "Official certified examination result document.",
    isReleased: true,
    holdReason: "",
  });

  const [pdfFile, setPdfFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [savingResult, setSavingResult] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [formError, setFormError] = useState("");
  const [successNotice, setSuccessNotice] = useState("");
  const fileInputRef = useRef(null);

  // Fetch results and metadata
  const fetchResults = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (filterCourse !== "all") params.set("courseName", filterCourse);
      if (filterReleaseStatus !== "all") params.set("isReleased", filterReleaseStatus);
      params.set("limit", "100");

      const res = await fetch(`/api/results?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setResults(data.results || []);
        setTotalCount(data.total || 0);
      }
    } catch (err) {
      console.error("Failed to load results:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeta = async () => {
    try {
      const res = await fetch("/api/results/meta");
      const data = await res.json();
      if (data.success) {
        setCoursesList(data.courses || []);
        if (data.courses?.length > 0 && !formData.courseName) {
          setFormData((prev) => ({ ...prev, courseName: data.courses[0] }));
        }
      }
    } catch (err) {
      console.error("Failed to load meta:", err);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [filterCourse, filterReleaseStatus]);

  useEffect(() => {
    fetchMeta();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchResults();
  };

  // Convert uploaded PDF to Base64
  const processPdfFile = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setFormError("Only official PDF (.pdf) files are supported.");
      return;
    }

    const sizeKB = (file.size / 1024).toFixed(1);
    const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : `${sizeKB} KB`;

    // Attempt to auto-infer course or title from file name
    const cleanName = file.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " ").trim();

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({
        ...prev,
        courseName: prev.courseName || cleanName,
        pdfUrl: event.target.result,
        pdfName: file.name,
        pdfSize: sizeStr,
      }));
      setFormError("");
    };
    reader.readAsDataURL(file);
  };

  // 1-Click Release or Hold Toggle
  const handleToggleRelease = async (resultItem) => {
    setTogglingId(resultItem._id);
    try {
      const res = await fetch(`/api/results/${resultItem._id}/toggle-release`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isReleased: !resultItem.isReleased }),
      });
      const data = await res.json();
      if (data.success) {
        setResults((prev) =>
          prev.map((r) => (r._id === resultItem._id ? { ...r, isReleased: data.isReleased } : r))
        );
        setSuccessNotice(data.message);
        setTimeout(() => setSuccessNotice(""), 3500);
      } else {
        alert(data.message || "Failed to update release status");
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setTogglingId(null);
    }
  };

  const handleOpenUploadModal = () => {
    setEditingId(null);
    setPdfFile(null);
    setFormData({
      courseName: coursesList[0] || "Quran Recitation & Tajweed",
      title: "Annual Examination Result",
      session: "2025-2026",
      pdfUrl: "",
      pdfName: "",
      pdfSize: "",
      description: "Official certified examination result document.",
      isReleased: true,
      holdReason: "",
    });
    setFormError("");
    setShowUploadModal(true);
  };

  const handleEdit = (r) => {
    setEditingId(r._id);
    setFormData({
      courseName: r.courseName || "",
      title: r.title || "Annual Examination Result",
      session: r.session || "2025-2026",
      pdfUrl: r.pdfUrl || "",
      pdfName: r.pdfName || "Result_Document.pdf",
      pdfSize: r.pdfSize || "",
      description: r.description || "Official certified examination result document.",
      isReleased: r.isReleased !== false,
      holdReason: r.holdReason || "",
    });
    setFormError("");
    setShowUploadModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.courseName.trim()) {
      setFormError("Please enter or select a Course Name.");
      return;
    }

    if (!formData.pdfUrl) {
      setFormError("Please upload the result PDF document (.pdf).");
      return;
    }

    setSavingResult(true);
    setFormError("");

    try {
      const url = editingId ? `/api/results/${editingId}` : "/api/results";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setShowUploadModal(false);
        setEditingId(null);
        setSuccessNotice(
          editingId
            ? "Result document updated successfully."
            : `Result PDF for "${formData.courseName}" uploaded successfully.`
        );
        setTimeout(() => setSuccessNotice(""), 4000);
        fetchResults();
        fetchMeta();
      } else {
        setFormError(data.message || "Failed to save PDF result.");
      }
    } catch (err) {
      setFormError(`Error: ${err.message}`);
    } finally {
      setSavingResult(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this course result PDF document?")) return;

    try {
      const res = await fetch(`/api/results/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchResults();
        fetchMeta();
      } else {
        alert(data.message || "Failed to delete result");
      }
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-5 font-sans text-slate-800 dark:text-slate-100">
      {/* Page Header - Clean & Non-card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight font-heading">
            Course Examination Results
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage certified student gazettes, upload result PDFs, and control live publication status.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={fetchResults}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all cursor-pointer shadow-2xs disabled:opacity-50"
            title="Refresh results list"
          >
            <RefreshCw size={12} className={`text-teal-600 dark:text-teal-400 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "Refreshing..." : "Refresh"}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenUploadModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Upload size={13} />
            <span>Upload PDF Gazette</span>
          </button>
        </div>
      </div>

      {/* Success Alert */}
      {successNotice && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center justify-between gap-2 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
            <span>{successNotice}</span>
          </div>
          <button type="button" onClick={() => setSuccessNotice("")} className="text-emerald-500 hover:text-emerald-700">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Inline Minimal Metrics Summary (No bulky cards) */}
      <div className="flex flex-wrap items-center gap-3 text-xs py-1">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 font-mono text-[11px]">
          <span className="text-slate-500 dark:text-slate-400">Total Gazettes:</span>
          <strong className="text-slate-900 dark:text-white font-bold">{totalCount}</strong>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/60 font-mono text-[11px]">
          <span className="text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
            <Unlock size={11} />
            Live / Released:
          </span>
          <strong className="text-emerald-700 dark:text-emerald-300 font-bold">
            {results.filter((r) => r.isReleased !== false).length}
          </strong>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/60 font-mono text-[11px]">
          <span className="text-amber-700 dark:text-amber-300 flex items-center gap-1">
            <Lock size={11} />
            On Hold:
          </span>
          <strong className="text-amber-700 dark:text-amber-300 font-bold">
            {results.filter((r) => r.isReleased === false).length}
          </strong>
        </div>
      </div>

      {/* Integrated Search & Filter Toolbar - Fully Mobile Responsive */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full sm:max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by course name, examination title, session..."
            className="w-full px-3 py-1.5 pl-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-600 dark:focus:border-teal-400"
          />
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setTimeout(() => fetchResults(), 50);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={12} />
            </button>
          )}
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Filter Course */}
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="flex-1 sm:flex-initial px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200 outline-none cursor-pointer focus:border-teal-600"
          >
            <option value="all">All Courses ({coursesList.length})</option>
            {coursesList.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Filter Release Status */}
          <select
            value={filterReleaseStatus}
            onChange={(e) => setFilterReleaseStatus(e.target.value)}
            className="flex-1 sm:flex-initial px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200 outline-none cursor-pointer focus:border-teal-600"
          >
            <option value="all">All Status</option>
            <option value="true">Live Only</option>
            <option value="false">On Hold Only</option>
          </select>
        </div>
      </div>

      {/* Main Results Table - Scrollable on x-axis on mobile with scrollbars hidden */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto no-scrollbar scroll-smooth">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-mono text-[10.5px] tracking-wider border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Course Discipline</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Examination & Session</th>
                <th className="py-2.5 px-3.5 text-center whitespace-nowrap">Gazette Document</th>
                <th className="py-2.5 px-3.5 text-center whitespace-nowrap">Visibility</th>
                <th className="py-2.5 px-3.5 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <RefreshCw size={18} className="animate-spin mx-auto mb-2 text-teal-600 dark:text-teal-400" />
                    <span>Loading examination results...</span>
                  </td>
                </tr>
              ) : results.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    <AlertCircle size={20} className="mx-auto mb-1.5 text-slate-400" />
                    <p className="text-xs">No examination result gazettes found.</p>
                    <button
                      type="button"
                      onClick={handleOpenUploadModal}
                      className="mt-2 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                    >
                      + Upload First Gazette PDF
                    </button>
                  </td>
                </tr>
              ) : (
                results.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    {/* 1. Course Discipline */}
                    <td className="py-3 px-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <BookOpen size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
                        <span className="truncate max-w-[200px] sm:max-w-[240px]">{r.courseName}</span>
                      </div>
                    </td>

                    {/* 2. Examination & Session */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {r.title || "Annual Examination Result"}
                      </div>
                      <div className="text-[10.5px] text-slate-400 font-mono">
                        Session: {r.session || "2025-2026"}
                      </div>
                    </td>

                    {/* 3. PDF Document */}
                    <td className="py-3 px-3.5 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedResult(r);
                          setShowPreviewModal(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-mono text-[11px] font-semibold border border-rose-200/80 dark:border-rose-900 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition cursor-pointer"
                        title="Click to view PDF"
                      >
                        <FileText size={12} className="text-rose-500" />
                        <span className="truncate max-w-[130px]">
                          {r.pdfName ? (r.pdfName.length > 18 ? `${r.pdfName.slice(0, 16)}...` : r.pdfName) : "Gazette.pdf"}
                        </span>
                        {r.pdfSize && <span className="text-[9.5px] opacity-75">({r.pdfSize})</span>}
                      </button>
                    </td>

                    {/* 4. Release Status Toggle */}
                    <td className="py-3 px-3.5 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleRelease(r)}
                        disabled={togglingId === r._id}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition cursor-pointer active:scale-95 ${
                          r.isReleased !== false
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-700 hover:border-amber-300"
                            : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700"
                        }`}
                        title={r.isReleased !== false ? "Click to Hold (Hide) Result" : "Click to Release (Make Live) Result"}
                      >
                        {togglingId === r._id ? (
                          <RefreshCw size={11} className="animate-spin" />
                        ) : r.isReleased !== false ? (
                          <>
                            <Unlock size={11} /> <span>Live</span>
                          </>
                        ) : (
                          <>
                            <Lock size={11} /> <span>On Hold</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* 5. Actions */}
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedResult(r);
                            setShowPreviewModal(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          title="View PDF"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(r)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          title="Edit Details"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(r._id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          title="Delete Gazette"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: UPLOAD / EDIT COURSE RESULT PDF */}
      {/* ========================================================================= */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 max-w-2xl w-full shadow-2xl relative max-h-[92vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute right-4 top-4 sm:right-6 sm:top-6 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 border border-teal-200/80 dark:border-teal-800">
                <FileText size={18} />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-heading">
                  {editingId ? "Edit Examination Gazette" : "Upload Course Result PDF"}
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Specify course discipline, attach the certified PDF, and configure publication status.
                </p>
              </div>
            </div>

            {formError && (
              <div className="mb-3.5 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs border border-rose-200 dark:border-rose-900 flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              {/* PDF Dropzone Area */}
              <div>
                <label className="block text-xs font-bold uppercase font-mono text-slate-600 dark:text-slate-400 mb-1">
                  Result PDF Gazette (.pdf) <span className="text-rose-500">*</span>
                </label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    processPdfFile(file);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 sm:p-6 text-center transition cursor-pointer ${
                    isDragging
                      ? "border-teal-600 bg-teal-50/50 dark:bg-teal-950/20 scale-[1.01]"
                      : formData.pdfUrl
                      ? "border-emerald-500/60 bg-emerald-50/30 dark:bg-emerald-950/20"
                      : "border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:border-teal-600"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => processPdfFile(e.target.files?.[0])}
                    accept="application/pdf,.pdf"
                    className="hidden"
                  />
                  {formData.pdfUrl ? (
                    <div className="space-y-1.5">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                        <FileCheck2 size={22} />
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {formData.pdfName || "Result_Document.pdf"}
                      </p>
                      <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10.5px] font-bold">
                        {formData.pdfSize || "PDF Attached"}
                      </span>
                      <p className="text-[10px] text-slate-400">
                        Click or drag new PDF to replace
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
                        <Upload size={20} />
                      </div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Click to select or drag & drop course result PDF
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        File format: Strictly PDF (.pdf) only
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Course Name Input + Quick Presets */}
              <div>
                <label className="block text-xs font-bold uppercase font-mono text-slate-600 dark:text-slate-400 mb-1">
                  Course Discipline <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.courseName}
                  onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                  placeholder="e.g. Quran Recitation & Tajweed, Arabic Language, Dars-e-Nizami"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600 mb-1.5"
                />

                {/* Quick Course Presets from DB */}
                {coursesList.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {coursesList.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, courseName: preset })}
                        className={`px-2 py-0.5 rounded text-[10.5px] font-semibold border transition cursor-pointer ${
                          formData.courseName === preset
                            ? "bg-teal-600 text-white border-teal-600"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Session */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase font-mono text-slate-600 dark:text-slate-400 mb-1">
                    Examination Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Annual Examination 2025-2026 Gazette"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase font-mono text-slate-600 dark:text-slate-400 mb-1">
                    Academic Session
                  </label>
                  <input
                    type="text"
                    value={formData.session}
                    onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                    placeholder="e.g. 2025-2026"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              {/* Option of On Hold Result */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Public Release Visibility
                  </span>
                  <p className="text-[10.5px] text-slate-400">
                    When On Hold, this examination result is hidden from the students result lookup page.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isReleased: !formData.isReleased })}
                  className={`py-1.5 px-3 rounded-lg border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition ${
                    formData.isReleased
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                      : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                  }`}
                >
                  {formData.isReleased ? (
                    <>
                      <Unlock size={12} /> <span>Live (Released)</span>
                    </>
                  ) : (
                    <>
                      <Lock size={12} /> <span>On Hold (Hidden)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingResult}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition disabled:opacity-50 cursor-pointer active:scale-95"
                >
                  {savingResult ? (
                    <>
                      <RefreshCw size={12} className="animate-spin" />
                      <span>Saving Gazette...</span>
                    </>
                  ) : (
                    <>
                      <Save size={13} />
                      <span>{editingId ? "Save Changes" : "Publish Result Gazette"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULLSCREEN PDF PREVIEW MODAL */}
      {/* ========================================================================= */}
      {showPreviewModal && selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl w-full shadow-xl overflow-hidden relative max-h-[95vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 min-w-0">
                <FileText size={16} className="text-teal-600 dark:text-teal-400 shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {selectedResult.courseName} — {selectedResult.title || "Examination Result"}
                  </h3>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    Session: {selectedResult.session || "2025-2026"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="w-full h-[580px] sm:h-[700px] bg-slate-100 dark:bg-slate-950 relative">
              <iframe
                src={`${selectedResult.pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                className="w-full h-full border-0"
                title={`${selectedResult.courseName} Result`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
