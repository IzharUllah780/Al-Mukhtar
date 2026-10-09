# 🕌 Al-Mukhtar (جامعہ المختار الاسلامیہ پشاور)
### *Where the Chosen Rise*

[![Next.js](https://img.shields.io/badge/Next.js-15.2.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.1.1-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8.12-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Resend](https://img.shields.io/badge/Resend-Email_API-000000?style=for-the-badge&logo=resend)](https://resend.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)]()

---

## 📖 Overview

**Al-Mukhtar Islamic & Academic Institute** (جامعہ المختار الاسلامیہ پشاور) is an esteemed Islamic educational institute located in Peshawar, Khyber Pakhtunkhwa, Pakistan. Founded under the patronage of **Hazrat Maulana Muhammad Anwar**, the institute is committed to cultivating future Islamic scholars, researchers, and principled leaders through a balanced curriculum blending traditional Islamic jurisprudence (Dars-e-Nizami), Tajweed, Quranic sciences, Arabic linguistics, and modern academic leadership.

This repository contains the **complete, full-stack web application and institutional management portal** for Al-Mukhtar. Built using **Next.js 15 App Router**, **React 19**, **Tailwind CSS v4**, and **MongoDB**, it provides a public portal for students, scholars, and visitors alongside a role-based **Admin Control Suite** for institute administration.

---

## ✨ Core Features & Capabilities

### 🌐 Public Portal & Student Services
- **🏛️ Interactive Homepage & Institute Tour**: Highlights institutional values, featured courses, recent announcements, scholarly articles, leadership messages, and student achievements.
- **📚 Course Exploration (`/courses`, `/courses/[slug]`)**: Detailed course catalogs with curriculum breakdown, prerequisites, levels (Beginner, Intermediate, Advanced), duration, and online enrollment entry points.
- **📝 Online Admissions Portal (`/apply`)**: Multi-step student application form with real-time validation (Zod + React Hook Form), image/document upload with client-side compression, and automated email confirmations.
- **📊 Examination Results Portal (`/result`)**: Public marksheet verification system allowing students to search results via roll number or registration ID, view subject-wise breakdowns, calculate grades/percentages, and generate printable marksheets.
- **📰 Scholarly Blog & Research Publication (`/blog`, `/blog/[slug]`)**: Rich articles on Islamic jurisprudence, research, and contemporary topics with reading time estimations, categories, author metadata, and related posts.
- **👨‍🏫 Faculty & Scholar Directory (`/teachers`)**: Profiles of Islamic scholars, resident Muftis, and educators featuring qualifications, specializations, and departmental roles.
- **🧑‍🎓 Student & Alumni Showcase (`/students`, `/alumni`)**: Directory celebrating student excellence, roll numbers, academic achievements, and alumni networks.
- **🎥 Islamic Video Lectures & Media (`/videos`)**: Embedded video library of sermons, tafseer sessions, lectures, and event recordings.
- **🔔 Real-Time Announcements & Notifications (`/notifications`)**: Campus-wide broadcasts with category tagging, urgency indicators, unread counters, and modal previews.
- **📞 Contact & Campus Direction (`/contact`)**: Interactive inquiry forms, campus contact information, Google Maps directions, and social media channels.

### 🔐 Authentication, Authorization & Security
- **Robust Authentication**: Secure email/password authentication using **JWT (JSON Web Tokens)** stored in HTTP-only cookies and **bcryptjs** password hashing.
- **Email Verification & Password Recovery**: Integrated with **Resend API** for delivering secure OTP verification links and password reset tokens.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions separating standard Visitors, Registered Users, Students, Teachers, and Institute Administrators.
- **Security & Validation**: Strict request schema validation using **Zod**, XSS prevention, rate limiting safeguards, and token blocklisting.

### 🛠️ Administrative Control Center (`/admin`)
- **📈 Comprehensive Dashboard Metrics**: Real-time stats showing total students, faculty, applications, active courses, published articles, and system activity charts using **Recharts**.
- **📋 Admissions Application Management (`/admin/applies`)**: Review pending applications, update admission statuses (Pending, Approved, Rejected), inspect uploaded documents, and **Export Applications to Excel (`.xlsx`)**.
- **📊 Results Management & Bulk Upload (`/admin/results`)**: Publish semester/annual exam results, edit marks, and batch process student scores with Excel import/export utilities.
- **✍️ Blog Content Authoring (`/admin/blog-post`)**: WYSIWYG rich-text editor (**React Quill New**) with media embedding, SEO meta configuration, slug generation, and draft/published controls.
- **📖 Course Builder (`/admin/course-post`, `/admin/courses`)**: Create, update, or archive courses with syllabus modules, instructor assignment, and admission criteria.
- **👥 Faculty & Student Records (`/admin/teachers`, `/admin/students`)**: Add, edit, or search academic records, qualifications, roll assignments, and photos.
- **📢 Push Notifications (`/admin/notifications`)**: Broadcast urgent alerts or general updates across the website with priority levels.
- **📹 Video Library Manager (`/admin/videos`)**: Manage video links, titles, categories, and featured lecture series.
- **🛡️ User Management & Role Elevation (`/admin/users`)**: Search users, toggle account statuses, manage permissions, and assign admin privileges.

### 🎨 Design, Typography & Internationalization
- **Modern Islamic & Academic Aesthetic**: Tailored color palette with deep emerald/teal accents, warm gold highlights, and glassmorphism UI cards.
- **Dual Theme Support**: Full **Dark Mode** and **Light Mode** support with smooth color transitions and persistent state.
- **Multilingual Typography**: Integrated web fonts for Arabic and Urdu calligraphy alongside clean modern Latin typography:
  - *Jameel Noori Nastaleeq* (Preloaded Urdu Calligraphy)
  - *Noto Nastaliq Urdu* & *Gulzar*
  - *Amiri* & *Noto Sans Arabic*
  - *Cinzel* & *Playfair Display* (Editorial headings)
  - *Inter* & *Plus Jakarta Sans* (Body copy)
- **🌍 Google Translate Integration**: Built-in translation widget supporting instant multilingual viewing for global audiences.

### 🚀 SEO & Search Engine Optimization
- **Dynamic Meta Tags & OpenGraph**: Automated OpenGraph, Twitter Cards, and canonical tags across all dynamic routes (courses, blogs, pages).
- **JSON-LD Structured Data**: Full Schema.org compliance including:
  - `EducationalOrganization`
  - `WebSite`
  - `Course` & `CourseInstance`
  - `BlogPosting`
  - `BreadcrumbList`
- **Dynamic XML Sitemap (`sitemap.js`)** & **Robots configuration (`robots.js`)**.
- **Monetization & Analytics**: Built-in **Google AdSense** integration (`ca-pub-5967341765221118`) and **Vercel Web Analytics**.

---

## 🏗️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 15.2 (App Router)](https://nextjs.org/) | Full-stack React framework with SSR, ISR, and API routes |
| **UI Library** | [React 19](https://react.dev/) | Component architecture & modern concurrent features |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern utility-first CSS engine with `@tailwindcss/postcss` |
| **Database** | [MongoDB](https://www.mongodb.com/) & [Mongoose 8.12](https://mongoosejs.com/) | Document database for records, users, courses, and content |
| **Authentication** | [JWT](https://jwt.io/) & [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Token authentication and secure password encryption |
| **State & Data Fetching** | [TanStack React Query v5](https://tanstack.com/query) | Server state synchronization, caching, and background refetching |
| **Forms & Validation** | [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) | Performant forms and type-safe schema validations |
| **Email Service** | [Resend](https://resend.com/) | Transactional emails for OTPs, approvals, and alerts |
| **Rich Text Editor** | [React Quill New](https://www.npmjs.com/package/react-quill-new) | WYSIWYG editor for drafting scholarly blog posts |
| **Charts & Analytics** | [Recharts](https://recharts.org/) | Data visualization in the Admin Dashboard |
| **Spreadsheets / Excel** | [XLSX (SheetJS)](https://sheetjs.com/) | Exporting application lists and processing student exam scores |
| **Icons & Media** | [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/) | Modern UI icons |
| **Analytics & Ads** | [Vercel Analytics](https://vercel.com/analytics) & Google AdSense | Web telemetry and institutional ad management |

---

## 📁 Repository Structure

```plaintext
Al-Mukhtar/
├── app/                              # Next.js App Router root
│   ├── layout.jsx                    # Root layout (Fonts, SEO Schema, Providers, Analytics)
│   ├── page.jsx                      # Homepage entry point
│   ├── globals.css                   # Global styles & Tailwind CSS v4 definitions
│   ├── sitemap.js                    # Dynamic XML Sitemap generator
│   ├── robots.js                     # Dynamic Robots.txt generator
│   ├── (public pages)/
│   │   ├── about/                    # About Al-Mukhtar, history & mission
│   │   ├── apply/                    # Online admissions application form
│   │   ├── courses/                  # Course catalog & single course dynamic pages
│   │   ├── blog/                     # Blog listings & single article dynamic pages
│   │   ├── result/                   # Student marksheet & result checking portal
│   │   ├── students/                 # Student showcase directory
│   │   ├── teachers/                 # Faculty & scholar profiles
│   │   ├── alumni/                   # Alumni network
│   │   ├── notifications/            # Institute announcements & notifications
│   │   ├── videos/                   # Video lectures library
│   │   ├── contact/                  # Contact form & location map
│   │   └── profile/                  # User account profile
│   ├── (auth)/
│   │   ├── login/                    # User & administrator login
│   │   ├── register/ | signup/       # Account registration
│   │   ├── verify-email/             # Email OTP confirmation page
│   │   └── forgot-password/          # Password reset request & verification
│   ├── admin/                        # Protected Administrative Suite
│   │   ├── page.jsx                  # Admin overview metrics dashboard
│   │   ├── applies/                  # Application review & Excel export
│   │   ├── blog-post/                # Rich text blog creator
│   │   ├── course-post/              # Course creation & curriculum builder
│   │   ├── results/                  # Exam results manager & score sheets
│   │   ├── students/                 # Student database management
│   │   ├── teachers/                 # Faculty record management
│   │   ├── notifications/            # Campus announcement publisher
│   │   ├── videos/                   # Video lecture library manager
│   │   └── users/                    # User accounts & role permissions
│   └── api/                          # Next.js Backend REST API Endpoints
│       ├── auth/                     # Login, register, logout, verify, password reset
│       ├── admin/                    # Admin statistics & role controls
│       ├── applications/             # Admission application submissions & status
│       ├── blogs/                    # Article CRUD operations
│       ├── courses/                  # Course CRUD operations
│       ├── results/                  # Exam result lookups & management
│       ├── students/                 # Student directory API
│       ├── teachers/                 # Teacher directory API
│       ├── notifications/            # Notification broadcasts API
│       ├── videos/                   # Video media API
│       └── contact/                  # Contact form submissions API
├── src/
│   ├── components/                   # Reusable UI & Layout Components
│   │   ├── NavFoot/                  # Header, Navbar, Mobile Menu, Footer
│   │   ├── Admin/                    # Admin Dashboard navigation & sidebar
│   │   ├── CourseCard.jsx            # Course preview card
│   │   ├── CourseDetails.jsx         # Full course view component
│   │   ├── BlogCard.jsx              # Blog post preview component
│   │   ├── TeacherCards.jsx          # Faculty profile cards
│   │   ├── StudentShowcase.jsx       # Student record presentation
│   │   ├── NotificationModal.jsx     # Full announcement popup
│   │   ├── NotificationBell.jsx      # Unread badge indicator
│   │   ├── QuillEditor.jsx           # WYSIWYG editor wrapper
│   │   ├── ThemeToggle.jsx           # Dark / Light mode switcher
│   │   ├── GoogleTranslator.jsx      # Multilingual translation widget
│   │   ├── AdSenseBanner.jsx         # Google AdSense integration
│   │   └── ProtectedRoute.jsx        # Route authorization guard
│   ├── lib/                          # Core Utilities & Backend Logic
│   │   ├── db.js                     # MongoDB Mongoose connection handler
│   │   ├── auth.js                   # JWT token generation, verification & cookies
│   │   ├── email.js                  # Resend email templates & dispatcher
│   │   ├── seo.js                    # Schema.org generators & SEO constants
│   │   ├── imageCompressor.js        # Browser image compression before upload
│   │   ├── exportApplications.js     # Excel (.xlsx) generator for admissions
│   │   ├── excelResultHelper.js      # Student result parser & spreadsheet helper
│   │   ├── validations.js            # Zod validation schemas
│   │   └── models/                   # Mongoose Database Models
│   │       ├── user.model.js
│   │       ├── application.model.js
│   │       ├── course.model.js
│   │       ├── blog.model.js
│   │       ├── result.model.js
│   │       ├── student.model.js
│   │       ├── teacher.model.js
│   │       ├── notification.model.js
│   │       ├── video.model.js
│   │       └── blocklist.model.js
│   └── pages_migrated/               # Page view components
├── public/                           # Static assets, logos, favicons, fonts
├── .env                              # Environment configuration (Private)
├── package.json                      # Project dependencies & scripts
└── next.config.mjs                   # Next.js runtime configuration
```

---

## 🗄️ Database Models & Architecture

The application uses MongoDB managed with Mongoose. Key models include:

| Model | File | Description |
| :--- | :--- | :--- |
| **`User`** | `src/lib/models/user.model.js` | User accounts, hashed passwords, roles (`user`, `student`, `teacher`, `admin`), email verification status, OTP tokens. |
| **`Application`** | `src/lib/models/application.model.js` | Online student admission submissions with personal data, academic background, chosen course, uploaded documents, and status (`pending`, `approved`, `rejected`). |
| **`Course`** | `src/lib/models/course.model.js` | Course title, slug, description, syllabus, duration, difficulty level, instructor, fee structure, and cover image. |
| **`Blog`** | `src/lib/models/blog.model.js` | Research articles, rich HTML body, category/subject, author, tags, cover images, view counts, and published status. |
| **`Result`** | `src/lib/models/result.model.js` | Student examination results, roll number, registration ID, semester/year, subject marks, total marks, GPA/Grade, and remarks. |
| **`Student`** | `src/lib/models/student.model.js` | Enrolled student profiles, roll numbers, admission batch, enrolled courses, and contact information. |
| **`Teacher`** | `src/lib/models/teacher.model.js` | Faculty records, scholarly titles, departmental designations, biographies, qualifications, and profile photos. |
| **`Notification`** | `src/lib/models/notification.model.js` | Campus announcements, target audience, importance level (urgent/normal), date, and expiration. |
| **`Video`** | `src/lib/models/video.model.js` | Islamic lecture records, YouTube video IDs/URLs, playlists, descriptions, and publish dates. |
| **`Blocklist`** | `src/lib/models/blocklist.model.js` | Invalidated / revoked JWT tokens for secure logout workflows. |

---

## 🔌 API Endpoints Reference

### 🔑 Authentication & Users
- `POST /api/auth/register` — Register a new user account.
- `POST /api/auth/login` — Authenticate and issue secure JWT cookie.
- `POST /api/auth/logout` — Revoke token and clear session cookies.
- `POST /api/auth/verify-email` — Verify email via OTP token.
- `POST /api/auth/forgot-password` — Request password reset email.
- `POST /api/auth/reset-password` — Set new password using token.
- `GET /api/auth/me` — Retrieve current authenticated user session.

### 📝 Applications & Admissions
- `POST /api/applications` — Submit a new admission application.
- `GET /api/applications` — (Admin) Fetch all admission applications with pagination/filtering.
- `PATCH /api/applications/[id]` — (Admin) Update application review status.
- `GET /api/applications/export` — (Admin) Export applications list as `.xlsx` file.

### 📊 Results
- `GET /api/results/search` — Public search by roll number or registration ID.
- `GET /api/results` — (Admin) List all published results.
- `POST /api/results` — (Admin) Add or batch import examination results.
- `PUT /api/results/[id]` / `DELETE /api/results/[id]` — (Admin) Modify or remove result records.

### 📚 Courses & Blog
- `GET /api/courses` & `GET /api/courses/[slug]` — Fetch active courses.
- `POST /api/courses`, `PUT /api/courses/[id]`, `DELETE /api/courses/[id]` — (Admin) Manage courses.
- `GET /api/blogs` & `GET /api/blogs/[slug]` — Fetch published blog posts.
- `POST /api/blogs`, `PUT /api/blogs/[id]`, `DELETE /api/blogs/[id]` — (Admin) Manage articles.

### 📢 Notifications, Media & Directory
- `GET /api/notifications` & `POST /api/notifications` — Fetch or broadcast notifications.
- `GET /api/videos` & `POST /api/videos` — Fetch or manage lecture videos.
- `GET /api/teachers` & `POST /api/teachers` — Faculty directory endpoints.
- `GET /api/students` & `POST /api/students` — Student showcase directory endpoints.
- `POST /api/contact` — Submit general contact inquiries.

---

## ⚙️ Environment Variables

Create a `.env` file in the project root with the following configuration:

```env
# Application Port & URLs
PORT=3000
BASE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=https://almukhtar.org.pk

# Database Connection
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/AlMukhtar?retryWrites=true&w=majority

# Authentication Security
JWT_SECRET=your_super_secret_jwt_key_here

# Transactional Email (Resend API)
RESEND_API_KEY=re_your_resend_api_key_here
RESEND_FROM="Al-Mukhtar <info@almukhtar.org.pk>"
ADMIN_EMAIL=izhar5ullah@gmail.com
```

---

## 🚀 Getting Started & Local Development

### 1. Prerequisites
- **Node.js**: v18.18.0 or later (v20+ recommended)
- **npm** or **yarn** or **pnpm**
- **MongoDB**: A running MongoDB instance or MongoDB Atlas cluster connection string.

### 2. Clone and Install
```bash
# Clone the repository
git clone https://github.com/IzharUllah780/Al-Mukhtar.git

# Navigate into the project folder
cd Al-Mukhtar

# Install project dependencies
npm install
```

### 3. Configure Environment
Create your `.env` file based on the section above:
```bash
cp .env.example .env # or edit .env directly
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 5. Build for Production
```bash
# Create optimized production build
npm run build

# Start production server
npm run start
```

---

## 🏛️ About the Institution

**Al-Mukhtar Islamic & Academic Institute (جامعہ المختار الاسلامیہ)**
- **Founder & Patron-in-Chief**: Hazrat Maulana Muhammad Anwar
- **Location**: Ghaz Masjid, Tanga Adda, Landi Arbab, Peshawar, Khyber Pakhtunkhwa (KPK), Pakistan (Postal Code: 25000)
- **Phone**: [+92 333 9176894](tel:+923339176894)
- **Email**: [izhar5ullah@gmail.com](mailto:izhar5ullah@gmail.com)
- **Official Website**: [https://almukhtar.org.pk](https://almukhtar.org.pk)

### 🔗 Official Social Channels
- **Facebook**: [Al-Mukhtar on Facebook](https://www.facebook.com/share/1QH9nYGA2p/?mibextid=wwXIfr)
- **YouTube**: [Maulana Muhammad Anwar Channel](https://youtube.com/@muhammad.anwar80?feature=shared)
- **TikTok**: [@mulanaanwar Official](https://www.tiktok.com/@mulanaanwar?_r=1&_t=ZS-9AD9P9nw4kW)

---

## 📄 License & Intellectual Property

© 2026 **Al-Mukhtar Islamic & Academic Institute**. All Rights Reserved.  
Proprietary academic software designed and developed for Al-Mukhtar Institute.