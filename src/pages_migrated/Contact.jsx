"use client";

import React, { useState } from "react";
import { Link } from "@/lib/navigation-adapter";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "react-toastify";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  ArrowUpRight,
  GraduationCap,
  ChevronDown,
  Loader2,
  MessageCircle,
  User,
  HelpCircle,
  BookOpen,
  DollarSign,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { FaFacebook, FaYoutube, FaTiktok } from "react-icons/fa";
import { GreenDecorationBg } from "../assets/assets.js";

const TOPIC_OPTIONS = [
  { id: "admission", label: "Admission Inquiry", icon: GraduationCap },
  { id: "courses", label: "Course Information", icon: BookOpen },
  { id: "fees", label: "Fee & Concession", icon: DollarSign },
  { id: "general", label: "General Question", icon: HelpCircle },
];

const SIMPLE_FAQS = [
  {
    question: "Can university students and working professionals join classes?",
    answer:
      "Yes, absolutely! Al-Mukhtar programs are specifically structured for university students, working professionals, and elders seeking authentic Islamic knowledge with convenient schedules and no age barrier.",
  },
  {
    question: "Where is the campus located for in-person classes & admissions?",
    answer:
      "Our on-campus facility is situated at Ghaz Masjid, Tanga Adda, Landi Arbab, Peshawar, KPK, Pakistan. You can visit the admissions desk directly or connect with us online.",
  },
  {
    question: "How long does it take to receive a response to inquiries?",
    answer:
      "Our team reviews all messages and responds via WhatsApp, phone call (+92 333 9176894), or email (izhar5ullah@gmail.com) within 24 hours.",
  },
  {
    question: "Are fee concessions or financial assistance available?",
    answer:
      "Yes. Deserving and motivated students can apply for fee concessions and scholarships upon submitting their inquiry or admission application.",
  },
  {
    question: "Are official certificates awarded upon course completion?",
    answer:
      "Yes. Every student who successfully completes their course and passes the examination receives an official, certified completion certificate from Al-Mukhtar.",
  },
];

function Contact() {
  const [selectedTopic, setSelectedTopic] = useState(TOPIC_OPTIONS[0].label);
  const [openFaq, setOpenFaq] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      subject: TOPIC_OPTIONS[0].label,
    },
  });

  const contactMutation = useMutation({
    mutationFn: (data) => api.post("/api/contact", data),
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Your message has been sent successfully to administration!");
      reset({
        name: "",
        email: "",
        phone: "",
        subject: TOPIC_OPTIONS[0].label,
        message: "",
      });
      setSelectedTopic(TOPIC_OPTIONS[0].label);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to send message. Please reach us directly on WhatsApp."
      );
    },
  });

  const onSubmit = (data) => {
    contactMutation.mutate(data);
  };

  const handleTopicSelect = (topicLabel) => {
    setSelectedTopic(topicLabel);
    setValue("subject", topicLabel, { shouldValidate: true });
  };

  return (
    <div className="bg-white dark:bg-[#070d18] text-slate-900 dark:text-slate-100 font-sans min-h-screen transition-colors duration-200">
      
      {/* ── 1. COMPACT HERO SECTION (GREEN LEAVES BG) ── */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-7 sm:py-9 border-b border-slate-800/80">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={GreenDecorationBg}
            alt="Al-Mukhtar Contact Desk"
            className="w-full h-full object-cover object-center opacity-75 sm:opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-950/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-heading tracking-tight">
            Contact Al-Mukhtar
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl mx-auto leading-relaxed font-normal">
            Have questions about academic programs, admissions criteria, or fee concessions? Send us an inquiry below or connect directly through our helpline.
          </p>

          {/* Quick Direct Actions (Only 1 WhatsApp & 1 Helpline) */}
          <div className="pt-2 sm:pt-3 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://wa.me/923431775096?text=Assalam-o-Alaikum,%20I%20want%20information%20about%20Al-Mukhtar%20courses%20and%20admissions."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-full font-semibold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
            >
              <MessageCircle size={15} className="shrink-0" />
              <span>WhatsApp Support</span>
            </a>

            <a
              href="tel:+923339176894"
              className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-5 py-2 rounded-full font-semibold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
            >
              <Phone size={14} className="shrink-0" />
              <span>Call Helpline</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── 2. MAIN CONTACT SECTION & FORM ── */}
      <section className="py-8 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="space-y-8 sm:space-y-10">

            {/* Form Intro Bar */}
            <div className="border-b border-slate-200 dark:border-slate-800/80 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-heading">
                  Send Your Inquiry
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Fill out the form below and our administration will get back to you promptly.
                </p>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-full self-start sm:self-auto font-medium font-mono border border-slate-200 dark:border-slate-800">
                <Clock size={13} className="text-teal-600 dark:text-teal-400 shrink-0" />
                <span>Response within 24 hours</span>
              </div>
            </div>

            {/* Topic Selectors */}
            <div className="space-y-2.5">
              <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                Select Inquiry Topic
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {TOPIC_OPTIONS.map((topic) => {
                  const Icon = topic.icon;
                  const isSelected = selectedTopic === topic.label;
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => handleTopicSelect(topic.label)}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2.5 ${
                        isSelected
                          ? "border-teal-600 dark:border-teal-400 bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 ring-1 ring-teal-500/30 font-semibold"
                          : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-medium"
                      }`}
                    >
                      <Icon
                        size={16}
                        className={`shrink-0 ${
                          isSelected ? "text-teal-600 dark:text-teal-400" : "text-slate-400"
                        }`}
                      />
                      <span className="text-xs sm:text-sm leading-tight">{topic.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact Form Fields */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g. Muhammad Ahmad"
                      className={`w-full pl-10 pr-3.5 py-2.5 rounded-lg border text-xs sm:text-sm text-slate-900 dark:text-slate-100 bg-slate-50/60 dark:bg-slate-900/60 placeholder:text-slate-400 outline-none transition-all focus:bg-white dark:focus:bg-slate-900 focus:border-teal-600 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500/20 ${
                        errors.name ? "border-rose-400 bg-rose-50/20" : "border-slate-200 dark:border-slate-800"
                      }`}
                      {...register("name", {
                        required: "Please enter your full name",
                        minLength: { value: 2, message: "Name must be at least 2 characters" },
                      })}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-[11px] text-rose-500 font-medium">{errors.name.message}</p>
                  )}
                </div>

                {/* WhatsApp / Phone Number */}
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Phone / WhatsApp Number
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g. 0343 1775096"
                      className={`w-full pl-10 pr-3.5 py-2.5 rounded-lg border text-xs sm:text-sm text-slate-900 dark:text-slate-100 bg-slate-50/60 dark:bg-slate-900/60 placeholder:text-slate-400 outline-none transition-all focus:bg-white dark:focus:bg-slate-900 focus:border-teal-600 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500/20 ${
                        errors.phone ? "border-rose-400 bg-rose-50/20" : "border-slate-200 dark:border-slate-800"
                      }`}
                      {...register("phone", {
                        pattern: {
                          value: /^[\d\s+()-]{7,16}$/,
                          message: "Please enter a valid phone number",
                        },
                      })}
                    />
                  </div>
                  {errors.phone ? (
                    <p className="text-[11px] text-rose-500 font-medium">{errors.phone.message}</p>
                  ) : (
                    <p className="text-[11px] text-slate-400">
                      Optional: We will reach out via WhatsApp or phone call.
                    </p>
                  )}
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      placeholder="student@example.com"
                      className={`w-full pl-10 pr-3.5 py-2.5 rounded-lg border text-xs sm:text-sm text-slate-900 dark:text-slate-100 bg-slate-50/60 dark:bg-slate-900/60 placeholder:text-slate-400 outline-none transition-all focus:bg-white dark:focus:bg-slate-900 focus:border-teal-600 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500/20 ${
                        errors.email ? "border-rose-400 bg-rose-50/20" : "border-slate-200 dark:border-slate-800"
                      }`}
                      {...register("email", {
                        required: "Email address is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Please enter a valid email address",
                        },
                      })}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] text-rose-500 font-medium">{errors.email.message}</p>
                  )}
                </div>

                {/* Subject Field */}
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Subject / Topic <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Admission inquiry for Tajweed course"
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm text-slate-900 dark:text-slate-100 bg-slate-50/60 dark:bg-slate-900/60 placeholder:text-slate-400 outline-none transition-all focus:bg-white dark:focus:bg-slate-900 focus:border-teal-600 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500/20 ${
                      errors.subject ? "border-rose-400 bg-rose-50/20" : "border-slate-200 dark:border-slate-800"
                    }`}
                    {...register("subject", {
                      required: "Subject is required",
                      minLength: { value: 2, message: "Please specify a subject" },
                    })}
                  />
                  {errors.subject && (
                    <p className="text-[11px] text-rose-500 font-medium">{errors.subject.message}</p>
                  )}
                </div>

              </div>

              {/* Message Content */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Your Message or Inquiry <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Please write your detailed message or questions here..."
                  className={`w-full p-3.5 rounded-lg border text-xs sm:text-sm text-slate-900 dark:text-slate-100 bg-slate-50/60 dark:bg-slate-900/60 placeholder:text-slate-400 outline-none transition-all resize-none focus:bg-white dark:focus:bg-slate-900 focus:border-teal-600 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500/20 ${
                    errors.message ? "border-rose-400 bg-rose-50/20" : "border-slate-200 dark:border-slate-800"
                  }`}
                  {...register("message", {
                    required: "Please enter your message",
                    minLength: { value: 5, message: "Message should be at least 5 characters" },
                  })}
                />
                {errors.message && (
                  <p className="text-[11px] text-rose-500 font-medium">{errors.message.message}</p>
                )}
              </div>

              {/* Action Bar */}
              <div className="pt-2 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800/80">
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
                  Inquiries are delivered directly to the administration at <span className="text-slate-700 dark:text-slate-300 font-medium">izhar5ullah@gmail.com</span>.
                </p>

                <button
                  type="submit"
                  disabled={contactMutation.isPending}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-7 py-2.5 rounded-full font-semibold text-xs sm:text-sm shadow-sm active:scale-98 transition-all disabled:opacity-60 cursor-pointer"
                >
                  {contactMutation.isPending ? (
                    <>
                      <Loader2 size={15} className="animate-spin shrink-0" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} className="shrink-0" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* ── 3. DIRECT CONTACT DETAILS (UNBOXED & EDITORIAL) ── */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
              <div className="mb-6">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading">
                  Direct Contact Channels
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Reach out directly to our administration office via WhatsApp, voice call, or visit our campus.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* WhatsApp Support */}
                <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs font-mono uppercase tracking-wider">
                    <MessageCircle size={15} />
                    <span>WhatsApp</span>
                  </div>
                  <a
                    href="https://wa.me/923431775096"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors block"
                  >
                    +92 343 1775096
                  </a>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Fast messaging &amp; admission guidance
                  </p>
                </div>

                {/* Call Helpline */}
                <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1.5">
                  <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-xs font-mono uppercase tracking-wider">
                    <Phone size={15} />
                    <span>Call Helpline</span>
                  </div>
                  <a
                    href="tel:+923339176894"
                    className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors block"
                  >
                    +92 333 9176894
                  </a>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Voice call assistance
                  </p>
                </div>

                {/* Email Desk */}
                <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1.5">
                  <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-xs font-mono uppercase tracking-wider">
                    <Mail size={15} />
                    <span>Email Inquiries</span>
                  </div>
                  <a
                    href="mailto:izhar5ullah@gmail.com"
                    className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors block truncate"
                    title="izhar5ullah@gmail.com"
                  >
                    izhar5ullah@gmail.com
                  </a>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Formal documentation &amp; verification
                  </p>
                </div>

                {/* Campus Address */}
                <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1.5">
                  <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-xs font-mono uppercase tracking-wider">
                    <MapPin size={15} />
                    <span>Campus Location</span>
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-tight">
                    Ghaz Masjid, Tanga Adda, Landi Arbab, Peshawar, KPK
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Ghaz+Masjid+Tanga+Adda+Landi+Arbab+Peshawar+Pakistan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline pt-0.5"
                  >
                    <span>Google Maps</span>
                    <ArrowUpRight size={11} />
                  </a>
                </div>

              </div>

              {/* Official Social Media Channels */}
              <div className="mt-4 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-700 dark:text-slate-300">
                    Official Media &amp; Broadcast Channels
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Follow Al-Mukhtar on official platforms for lectures, updates, and announcements.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://www.facebook.com/share/1QH9nYGA2p/?mibextid=wwXIfr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-[#1877F2] hover:border-[#1877F2] text-slate-700 dark:text-slate-200 hover:text-white transition-all text-xs font-medium group"
                    title="Facebook"
                  >
                    <FaFacebook size={13} className="text-[#1877F2] group-hover:text-white transition-colors" />
                    <span>Facebook</span>
                  </a>
                  <a
                    href="https://youtube.com/@muhammad.anwar80?feature=shared"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-[#FF0000] hover:border-[#FF0000] text-slate-700 dark:text-slate-200 hover:text-white transition-all text-xs font-medium group"
                    title="YouTube"
                  >
                    <FaYoutube size={13} className="text-[#FF0000] group-hover:text-white transition-colors" />
                    <span>YouTube</span>
                  </a>
                  <a
                    href="https://www.tiktok.com/@mulanaanwar?_r=1&_t=ZS-9AD9P9nw4kW"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-black hover:border-black text-slate-700 dark:text-slate-200 hover:text-white transition-all text-xs font-medium group"
                    title="TikTok"
                  >
                    <FaTiktok size={12} className="text-slate-800 dark:text-slate-200 group-hover:text-white transition-colors" />
                    <span>TikTok</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. FREQUENTLY ASKED QUESTIONS ── */}
      <section className="border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/30 py-8 sm:py-12 transition-colors">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          
          <div className="text-center space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Quick answers to common questions about Al-Mukhtar.
            </p>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
            {SIMPLE_FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="py-3">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between gap-3 text-left font-medium text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors py-1 cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm">{faq.question}</span>
                    <ChevronDown
                      size={16}
                      className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-teal-600 dark:text-teal-400" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="pt-2 pb-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  );
}

export default Contact;