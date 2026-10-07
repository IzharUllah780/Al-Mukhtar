"use client";

import React from "react";
import { Link } from "@/lib/navigation-adapter";
import {
  BookOpen,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { FaFacebook, FaYoutube, FaTiktok } from "react-icons/fa";

const websiteLinks = [
  { label: "Home", to: "/" },
  { label: "About Institute", to: "/about" },
  { label: "Courses", to: "/courses" },
  { label: "Faculty & Scholars", to: "/teachers" },
  { label: "Alumni & Students", to: "/students" },
  { label: "Video Lectures", to: "/videos" },
  { label: "Blog & Articles", to: "/blog" },
  { label: "Online Admission", to: "/apply" },
  { label: "Exam Results", to: "/result" },
  { label: "Contact Us", to: "/contact" },
];

const socialLinks = [
  {
    icon: FaFacebook,
    href: "https://www.facebook.com/share/1QH9nYGA2p/?mibextid=wwXIfr",
    label: "Facebook",
    color: "hover:bg-[#1877F2] hover:border-[#1877F2]",
  },
  {
    icon: FaYoutube,
    href: "https://youtube.com/@muhammad.anwar80?feature=shared",
    label: "YouTube",
    color: "hover:bg-[#FF0000] hover:border-[#FF0000]",
  },
  {
    icon: FaTiktok,
    href: "https://www.tiktok.com/@mulanaanwar?_r=1&_t=ZS-9AD9P9nw4kW",
    label: "TikTok",
    color: "hover:bg-[#000000] hover:border-slate-500",
  },
];

function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white relative overflow-hidden border-t border-slate-800 font-sans">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Col 1: Brand & About */}
          <div className="md:col-span-4 lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center shrink-0 shadow-sm border border-teal-500/30">
                <BookOpen size={18} className="text-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-heading text-lg font-extrabold text-white tracking-tight leading-tight">
                  Al-Mukhtar
                </span>
                <span className="text-[11px] text-slate-400 font-normal">
                  Where the chosen rise
                </span>
              </div>
            </div>
            
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm">
              Authentic Islamic education integrated with modern academic learning — guided by qualified scholars, built on discipline, sincerity, and classical scholarship.
            </p>

            <div className="flex items-center gap-2 pt-1">
              {socialLinks.map((social, i) => {
                const Icon = social.icon;
                return (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`w-8 h-8 rounded-lg bg-slate-800/90 border border-slate-700/80 flex items-center justify-center ${social.color} group transition-all`}
                  >
                    <Icon
                      size={14}
                      className="text-slate-300 group-hover:text-white transition-colors"
                    />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Col 2: All Website Pages in 2 Columns */}
          <div className="md:col-span-4 lg:col-span-5">
            <h4 className="text-teal-400 text-xs font-bold tracking-wider uppercase font-mono mb-4">
              Website Navigation
            </h4>
            <ul className="grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-2.5">
              {websiteLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.to}
                    className="text-slate-300 text-xs sm:text-sm hover:text-teal-300 hover:underline transition-colors block py-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Direct Contact Information */}
          <div className="md:col-span-4 lg:col-span-3">
            <h4 className="text-teal-400 text-xs font-bold tracking-wider uppercase font-mono mb-4">
              Contact Us
            </h4>
            <ul className="space-y-4 sm:space-y-4.5">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-teal-400 mt-1 shrink-0" />
                <span className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Ghaz Masjid, Tanga Adda, Landi Arbab, Peshawar, KPK, Pakistan
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-teal-400 shrink-0" />
                <a
                  href="tel:+923339176894"
                  className="text-slate-300 text-xs sm:text-sm hover:text-teal-300 hover:underline transition-colors"
                >
                  +92 333 9176894
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-teal-400 shrink-0" />
                <a
                  href="mailto:izhar5ullah@gmail.com"
                  className="text-slate-300 text-xs sm:text-sm hover:text-teal-300 hover:underline transition-colors truncate"
                  title="izhar5ullah@gmail.com"
                >
                  izhar5ullah@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="relative z-10 border-t border-slate-800/80 bg-[#020617]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-400">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Al-Mukhtar Institute. All rights reserved.
          </p>
          <p className="text-center sm:text-right text-[11px] text-slate-500 font-mono">
            Academic Excellence &amp; Classical Scholarship
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;