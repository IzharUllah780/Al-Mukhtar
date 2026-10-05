"use client";

import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdminVideos } from "@/lib/queries";
import api from "../../lib/api.js";
import { extractYoutubeEmbedUrl, formatDate } from "@/components/VideoCard.jsx";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  ExternalLink,
  PlaySquare,
  Sparkles,
  Eye,
  Calendar,
} from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import { toast } from "react-toastify";
import ApiErrorState from "../../components/ApiErrorState.jsx";

function AdminVideos() {
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [apiMsg, setApiMsg] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      iframe: "",
    },
  });

  const iframeWatch = watch("iframe");
  const liveEmbedUrl = useMemo(() => extractYoutubeEmbedUrl(iframeWatch), [iframeWatch]);

  const {
    data: videos = [],
    isLoading,
    isError,
    refetch: refetchVideos,
  } = useAdminVideos();

  const filteredVideos = useMemo(() => {
    return videos.filter((v) =>
      v.title?.toLowerCase().includes(search.toLowerCase()) ||
      v.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [videos, search]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchVideos();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const createMutation = useMutation({
    mutationFn: (payload) => api.post("/api/videos", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminVideos"] });
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      setApiMsg({ success: true, text: "YouTube video published successfully." });
      resetForm();
      setTimeout(() => setApiMsg(null), 4000);
    },
    onError: (err) =>
      setApiMsg({
        success: false,
        text: err?.response?.data?.message || "Failed to create video.",
      }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => api.put(`/api/videos/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminVideos"] });
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      setApiMsg({ success: true, text: "YouTube video updated successfully." });
      resetForm();
      setTimeout(() => setApiMsg(null), 4000);
    },
    onError: (err) =>
      setApiMsg({
        success: false,
        text: err?.response?.data?.message || "Failed to update video.",
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/videos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminVideos"] });
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      refetchVideos();
      toast.success("YouTube video deleted successfully.");
      setVideoToDelete(null);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete video.");
    },
  });

  const resetForm = () => {
    reset({
      title: "",
      description: "",
      iframe: "",
    });
    setShowForm(false);
    setEditingVideo(null);
  };

  const openEdit = (video) => {
    setEditingVideo(video);
    reset({
      title: video.title || "",
      description: video.description || "",
      iframe: video.iframe || "",
    });
    setShowForm(true);
  };

  const onSubmit = async (formData) => {
    setApiMsg(null);
    const payload = {
      title: formData.title,
      description: formData.description || "",
      iframe: formData.iframe,
    };
    if (editingVideo) {
      updateMutation.mutate({ id: editingVideo._id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FaYoutube className="w-5 h-5 text-red-600" />
            <span>YouTube Videos &amp; Lectures</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Upload and manage YouTube iframe video embeds displayed on the website and home page.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleRefresh}
            title="Refresh database"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#0D9488] hover:text-[#0D9488] dark:hover:border-teal-400 dark:hover:text-teal-400 text-xs font-medium shadow-2xs transition-colors"
          >
            <RefreshCw size={13} className={isRefreshing ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => {
              if (showForm) resetForm();
              else {
                reset();
                setEditingVideo(null);
                setShowForm(true);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0D9488] text-white text-xs font-semibold shadow-xs hover:bg-[#0F766E] transition-colors"
          >
            {showForm ? <X size={13} /> : <Plus size={13} />}
            <span>{showForm ? "Cancel" : "Add YouTube Video"}</span>
          </button>
        </div>
      </div>

      {apiMsg && (
        <div
          className={`flex items-center gap-2 border text-xs font-medium px-3.5 py-2.5 rounded-lg ${
            apiMsg.success
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
              : "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300"
          }`}
        >
          {apiMsg.success ? (
            <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle size={14} className="text-rose-600 dark:text-rose-400 shrink-0" />
          )}
          <span>{apiMsg.text}</span>
        </div>
      )}

      {/* Video Form */}
      {showForm && (
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
            <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <PlaySquare size={14} className="text-[#0D9488]" />
              <span>{editingVideo ? "Edit YouTube Video" : "Upload New YouTube Video"}</span>
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={15} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              {/* Video Title */}
              <div className="sm:col-span-12">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Video Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Classical Arabic Morphology Lecture 01 - Al-Mukhtar Institute"
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm sm:text-xs outline-none focus:border-[#0D9488] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0D9488]/15 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 transition-all ${
                    errors.title ? "border-rose-400" : "border-slate-300 dark:border-slate-700"
                  }`}
                  {...register("title", { required: "Video title is required" })}
                />
                {errors.title && <p className="text-[10px] text-rose-500 mt-1">{errors.title.message}</p>}
              </div>

              {/* YouTube Iframe Tag or URL */}
              <div className="sm:col-span-12">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  YouTube Iframe Embed Tag or Video URL <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder={`Paste YouTube <iframe> tag or link:\n<iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID" ...></iframe>\nor https://www.youtube.com/watch?v=VIDEO_ID`}
                  className={`w-full font-mono text-xs border rounded-xl p-3 outline-none focus:border-[#0D9488] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0D9488]/15 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 transition-all resize-y ${
                    errors.iframe ? "border-rose-400" : "border-slate-300 dark:border-slate-700"
                  }`}
                  {...register("iframe", { required: "YouTube iframe tag or video link is required" })}
                />
                {errors.iframe && <p className="text-[10px] text-rose-500 mt-1">{errors.iframe.message}</p>}
                <p className="text-[11px] text-slate-400 mt-1">
                  Tip: On YouTube, click <strong>Share &gt; Embed</strong> and copy the full &lt;iframe&gt; code, or paste the regular YouTube video URL.
                </p>
              </div>

              {/* Live Preview Box */}
              {liveEmbedUrl && (
                <div className="sm:col-span-12 space-y-1.5">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Live Video Embed Preview:
                  </span>
                  <div className="max-w-md aspect-video bg-black rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 shadow-md">
                    <iframe
                      src={liveEmbedUrl}
                      title="Preview"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Description (Optional) */}
              <div className="sm:col-span-12">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Description / Topic Summary <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Short summary of what this video lecture covers..."
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs sm:text-sm outline-none focus:border-[#0D9488] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0D9488]/15 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 transition-all resize-y"
                  {...register("description")}
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-1.5 bg-[#0D9488] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#0F766E] shadow-xs transition-all disabled:opacity-60 cursor-pointer active:scale-95"
              >
                {isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{editingVideo ? "Update Video" : "Publish Video"}</span>
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search & Meta Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 w-full sm:w-80 shadow-2xs focus-within:border-[#0D9488] dark:focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-[#0D9488]/15 transition-all">
          <Search size={14} className="text-slate-400 dark:text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Search videos by title or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-xs sm:text-sm outline-none w-full bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-slate-100"
          />
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Total Videos: <strong className="text-slate-800 dark:text-slate-200">{filteredVideos.length}</strong>
        </div>
      </div>

      {/* Videos List Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 animate-pulse"
            >
              <div className="w-full aspect-video bg-slate-100 dark:bg-slate-800 rounded-xl" />
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <ApiErrorState
          title="Failed to load videos"
          message="Could not retrieve videos from database."
          onRetry={refetchVideos}
        />
      ) : filteredVideos.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center justify-center text-red-600 dark:text-red-400 mx-auto">
            <FaYoutube size={24} />
          </div>
          <h3 className="font-heading font-bold text-slate-800 dark:text-white text-base">
            No YouTube Videos Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {search
              ? "No videos matching your search query. Try clearing the search filter."
              : "No YouTube videos have been uploaded yet. Click 'Add YouTube Video' above to embed your first lecture."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVideos.map((video) => {
            const embedUrl = extractYoutubeEmbedUrl(video.iframe);
            return (
              <div
                key={video._id}
                className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Embedded Iframe Player */}
                  <div className="w-full aspect-video bg-black overflow-hidden relative">
                    {embedUrl ? (
                      <iframe
                        src={embedUrl}
                        title={video.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                        Invalid Embed Code
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{formatDate(video.createdAt)}</span>
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-slate-900 dark:text-white text-sm line-clamp-2 leading-snug">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {video.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 mt-2">
                  {embedUrl ? (
                    <a
                      href={embedUrl.replace("/embed/", "/watch?v=")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-[#0D9488] dark:text-teal-400 font-semibold hover:underline"
                    >
                      <span>Open Link</span>
                      <ExternalLink size={11} />
                    </a>
                  ) : <div />}

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEdit(video)}
                      className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-[#0D9488] dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-slate-800 transition-colors"
                      title="Edit Video"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setVideoToDelete(video)}
                      className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete Video"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {videoToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto">
              <AlertTriangle size={24} />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base">
                Delete YouTube Video?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Are you sure you want to delete <strong>&quot;{videoToDelete.title}&quot;</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setVideoToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(videoToDelete._id)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-xs transition-colors cursor-pointer disabled:opacity-60"
              >
                {deleteMutation.isPending && <Loader2 size={13} className="animate-spin" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminVideos;
