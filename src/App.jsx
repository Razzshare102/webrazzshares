import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'

import { AuthProvider } from './contexts/AuthContext'
import LoadingScreen from './components/layout/LoadingScreen'
import ParticleBackground from './components/layout/ParticleBackground'
import CursorGlow from './components/layout/CursorGlow'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ProtectedRoute from './components/admin/ProtectedRoute'
import BackToTop from './components/ui/BackToTop'
import ScrollProgress from './components/ui/ScrollProgress'

// Pages
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import About from './pages/About'
import Contact from './pages/Contact'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminPortfolio from './pages/admin/AdminPortfolio'
import AdminTestimonials from './pages/admin/AdminTestimonials'
import AdminHomepage from './pages/admin/AdminHomepage'
import AdminSocial from './pages/admin/AdminSocial'
import AdminMessages from './pages/admin/AdminMessages'
import AdminSEO from './pages/admin/AdminSEO'
import AdminSettings from './pages/admin/AdminSettings'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8  },
}

/** Public layout wrapper */
function PublicPage({ children }) {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      {children}
      <Footer />
      <BackToTop />
    </>
  )
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={location}>
          {/* ── Public ── */}
          <Route path="/"          element={<PublicPage><Home /></PublicPage>} />
          <Route path="/portfolio" element={<PublicPage><Portfolio /></PublicPage>} />
          <Route path="/about"     element={<PublicPage><About /></PublicPage>} />
          <Route path="/contact"   element={<PublicPage><Contact /></PublicPage>} />

          {/* ── Admin ── */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard"   element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/portfolio"   element={<ProtectedRoute><AdminPortfolio /></ProtectedRoute>} />
          <Route path="/admin/testimonials"element={<ProtectedRoute><AdminTestimonials /></ProtectedRoute>} />
          <Route path="/admin/homepage"    element={<ProtectedRoute><AdminHomepage /></ProtectedRoute>} />
          <Route path="/admin/social"      element={<ProtectedRoute><AdminSocial /></ProtectedRoute>} />
          <Route path="/admin/messages"    element={<ProtectedRoute><AdminMessages /></ProtectedRoute>} />
          <Route path="/admin/seo"         element={<ProtectedRoute><AdminSEO /></ProtectedRoute>} />
          <Route path="/admin/settings"    element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />

          {/* ── 404 ── */}
          <Route path="*" element={
            <PublicPage>
              <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
                <div
                  className="text-9xl font-display font-bold mb-4 select-none"
                  style={{
                    background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  404
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>
                <p className="text-gray-500 mb-8 max-w-md">
                  This page doesn't exist in the Web3 universe. Head back to the homepage.
                </p>
                <a href="/" className="btn-primary text-white">← Go Home</a>
              </div>
            </PublicPage>
          } />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function AppContent() {
  const [loaded, setLoaded] = useState(false)

  // Show a one-time demo mode notice when Supabase is not configured
  useEffect(() => {
    if (!import.meta.env.VITE_SUPABASE_URL) {
      setTimeout(() => {
        toast('Running in demo mode — connect Supabase to enable CMS features', {
          icon: '⚡',
          duration: 6000,
          style: {
            background: '#0a1628',
            color: '#67e8f9',
            border: '1px solid rgba(0,212,255,0.2)',
            borderRadius: '12px',
            fontSize: '13px',
          },
        })
      }, 2800)
    }
  }, [])

  return (
    <div style={{ background: '#020408', minHeight: '100vh' }}>
      {/* Global toast */}
      <Toaster
        position="top-right"
        containerStyle={{ zIndex: 99999 }}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0a1628',
            color: '#e2e8f0',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#34d399', secondary: '#020408' },
          },
          error: {
            iconTheme: { primary: '#f87171', secondary: '#020408' },
          },
        }}
      />

      <AnimatePresence>
        {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      </AnimatePresence>

      {loaded && (
        <>
          <ParticleBackground />
          <CursorGlow />
          <div className="relative z-10">
            <AnimatedRoutes />
          </div>
        </>
      )}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}
