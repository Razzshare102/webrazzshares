import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Zap, Lock } from 'lucide-react'

const navLinks = [
  { label: 'Home',      path: '/'          },
  { label: 'Portfolio', path: '/portfolio' },
  { label: 'About',     path: '/about'     },
  { label: 'Contact',   path: '/contact'   },
]

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const location = useLocation()
  const mobileRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  // Close mobile menu on outside click
  useEffect(() => {
    if (!mobileOpen) return
    const handler = (e) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [mobileOpen])

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-3 border-b border-white/5' : 'py-5'
        }`}
        style={{
          background: scrolled ? 'rgba(2,4,8,0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-display font-bold"
                style={{
                  background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                  boxShadow: '0 0 15px rgba(0,212,255,0.3)',
                  transition: 'box-shadow 0.3s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 30px rgba(0,212,255,0.6)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 15px rgba(0,212,255,0.3)' }}
              >
                R
              </div>
              <span className="font-display font-bold text-lg neon-text">RazzShares</span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive ? 'text-cyan-400' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background: 'rgba(0,212,255,0.08)',
                          border: '1px solid rgba(0,212,255,0.15)',
                        }}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-gray-600 hover:text-gray-400 transition-colors"
              >
                <Lock size={11} />
                Admin
              </Link>
              <Link to="/contact" className="btn-primary text-white text-sm py-2 px-5">
                <Zap size={14} />
                Hire Me
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile overlay backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 md:hidden"
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={mobileRef}
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[68px] left-3 right-3 z-40 rounded-2xl overflow-hidden md:hidden"
            style={{
              background: 'rgba(5,13,26,0.97)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.09)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
            }}
          >
            {/* Top glow */}
            <div
              className="absolute top-0 left-8 right-8 h-px"
              style={{ background: 'linear-gradient(90deg,transparent,rgba(0,212,255,0.5),transparent)' }}
            />

            <div className="p-4 flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-cyan-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                    style={isActive ? {
                      background: 'rgba(0,212,255,0.08)',
                      border: '1px solid rgba(0,212,255,0.2)',
                    } : {}}
                  >
                    {link.label}
                    {isActive && (
                      <span
                        className="ml-auto w-1.5 h-1.5 rounded-full"
                        style={{ background: '#00d4ff', boxShadow: '0 0 6px #00d4ff' }}
                      />
                    )}
                  </Link>
                )
              })}

              <div className="mt-2 pt-3 border-t border-white/5 flex flex-col gap-2">
                <Link to="/contact" className="btn-primary w-full justify-center text-white py-3">
                  <Zap size={14} />
                  Hire Me
                </Link>
                <Link
                  to="/admin"
                  className="flex items-center justify-center gap-1.5 py-2 text-xs text-gray-600 hover:text-gray-400 transition-colors"
                >
                  <Lock size={11} />
                  Admin Panel
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
