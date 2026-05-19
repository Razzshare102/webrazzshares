# RazzShares — Web3 Portfolio & Admin Dashboard

> A premium Web3 creator portfolio with full CMS admin dashboard, built with React + Vite + TailwindCSS + Framer Motion + Supabase.

---

## ✨ Features

### Public Site
- 🎨 Dark futuristic UI with neon blue/purple gradients
- 🌌 Animated particle canvas background with star field
- 🖱️ Custom cursor glow effect
- ⚡ Loading screen with animated progress bar
- 📱 Fully responsive mobile-first design
- 🎭 Smooth page transitions & scroll reveal animations
- **Hero Section** — Animated headline, profile image, social links, CTA buttons
- **Stats Section** — Animated counters on scroll (Projects, Reach, Communities, Threads)
- **Services Section** — 4 glassmorphism cards with hover effects
- **Portfolio Page** — Dynamic grid with tag filtering & search
- **Testimonials Carousel** — Auto-playing slider with swipe controls
- **About Page** — Bio, skills, animated timeline of Web3 journey
- **Contact Page** — Form with toast notifications, Supabase storage
- **Footer** — Social links, quick nav, Web3 aesthetic

### Admin Dashboard (`/admin`)
- 🔐 Secure Supabase authentication
- 📊 Overview dashboard with live stats
- 🗂️ Portfolio CRUD — Add/Edit/Delete projects with image URLs, tags, social links
- ⭐ Testimonials CRUD — Manage client testimonials with star ratings
- 🏠 Homepage Editor — Edit hero text, stats, bio
- 🔗 Social Links Manager — Toggle visibility, update URLs & handles
- 📬 Contact Messages — Read/reply/archive/delete contact submissions
- 🔍 SEO Editor — Per-page meta title, description, keywords, OG image
- ⚙️ Settings — Change admin password

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/Razzshare102/webrazzshares.git
cd webrazzshares
npm install
```

### 2. Set up Supabase
1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `src/lib/supabaseSchema.sql`
3. Go to **Authentication → Users** and create a user:
   - Email: `razzshares@gmail.com`
   - Password: `Robiul@@2022`
4. Go to **Storage** and create these public buckets:
   - `portfolio-images`
   - `avatars`
   - `assets`

### 3. Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SITE_URL=http://localhost:5173
```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:5173`

---

## 🌐 Vercel Deployment

### Method 1: GitHub Import (Recommended)
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import from GitHub
3. Framework: **Vite** (auto-detected)
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SITE_URL` (your Vercel domain)
5. Deploy!

### Method 2: Vercel CLI
```bash
npm install -g vercel
vercel --prod
```

---

## 📁 Project Structure

```
src/
├── App.jsx                    # Root app with routing & auth
├── main.jsx                   # Entry point
├── index.css                  # Global styles + Tailwind
├── lib/
│   ├── supabase.js           # Supabase client
│   └── supabaseSchema.sql    # Database schema
├── contexts/
│   └── AuthContext.jsx       # Auth state provider
├── hooks/
│   └── useSupabase.js        # Data fetching hooks
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ParticleBackground.jsx
│   │   ├── LoadingScreen.jsx
│   │   └── CursorGlow.jsx
│   ├── sections/
│   │   ├── HeroSection.jsx
│   │   ├── StatsSection.jsx
│   │   ├── ServicesSection.jsx
│   │   └── TestimonialsSection.jsx
│   ├── admin/
│   │   ├── AdminLayout.jsx
│   │   └── ProtectedRoute.jsx
│   └── ui/
│       ├── ScrollReveal.jsx
│       └── AnimatedCounter.jsx
└── pages/
    ├── Home.jsx
    ├── Portfolio.jsx
    ├── About.jsx
    ├── Contact.jsx
    └── admin/
        ├── AdminLogin.jsx
        ├── AdminDashboard.jsx
        ├── AdminPortfolio.jsx
        ├── AdminTestimonials.jsx
        ├── AdminHomepage.jsx
        ├── AdminSocial.jsx
        ├── AdminMessages.jsx
        ├── AdminSEO.jsx
        └── AdminSettings.jsx
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite 5 | Build tool |
| TailwindCSS 3 | Styling |
| Framer Motion | Animations |
| Supabase | Backend, Auth, DB, Storage |
| React Router v6 | Client-side routing |
| Lucide React | Icons |
| React Hot Toast | Toast notifications |

---

## 🔑 Admin Access

| Field | Value |
|---|---|
| URL | `/admin` |
| Email | `razzshares@gmail.com` |
| Password | Set in Supabase Auth |

> ⚠️ Create the admin user in **Supabase → Authentication → Users** — credentials are not stored in code.

---

## 📞 Contact

- Email: [razzshares@gmail.com](mailto:razzshares@gmail.com)
- Twitter: [@razzshares](https://twitter.com/razzshares)
- Telegram: [t.me/razzshares](https://t.me/razzshares)
