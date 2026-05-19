import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FolderKanban, Star, Home, Settings,
  Link as LinkIcon, Mail, Search, LogOut, Menu, X, ChevronRight,
  User, ExternalLink, Zap
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import toast, { Toaster } from 'react-hot-toast'

const navItems = [
  { icon: LayoutDashboard, label: 'Overview',     path: '/admin/dashboard'    },
  { icon: FolderKanban,   label: 'Portfolio',     path: '/admin/portfolio'    },
  { icon: Star,           label: 'Testimonials',  path: '/admin/testimonials' },
  { icon: Home,           label: 'Homepage',      path: '/admin/homepage'     },
  { icon: LinkIcon,       label: 'Social Links',  path: '/admin/social'       },
  { icon: Mail,           label: 'Messages',      path: '/admin/messages'     },
  { icon: Search,         label: 'SEO Settings',  path: '/admin/seo'          },
  { icon: Settings,       label: 'Settings',      path: '/admin/settings'     },
]

function SidebarContent({ mobile, onClose, user, location, onLogout }) {
  return (
    <div
      className="flex flex-col h-full w-64"
      style={{ background: 'rgba(2, 4, 8, 0.98)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Brand */}
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-display font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', boxShadow: '0 0 15px rgba(0,212,255,0.3)' }}
          >
            R
          </div>
          <div className="min-w-0">
            <p className="font-display font-bold text-sm neon-text">RazzShares</p>
            <p className="text-gray-600 text-xs">Admin Panel</p>
          </div>
          {mobile && (
            <button onClick={onClose} className="ml-auto text-gray-500 hover:text-white flex-shrink-0">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-3 mx-3 mt-3 rounded-xl" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.1)' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <User size={12} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.email || 'Admin'}</p>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path
          return (
            <Link
              key={path}
              to={path}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium group ${
                isActive ? 'text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
              style={isActive ? {
                background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(124,58,237,0.07))',
                border: '1px solid rgba(0,212,255,0.15)',
              } : {}}
            >
              <Icon size={16} className={isActive ? 'text-cyan-400' : 'group-hover:text-gray-300'} />
              {label}
              {isActive && <ChevronRight size={12} className="ml-auto text-cyan-400/40" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/5 space-y-0.5">
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-300 hover:bg-white/5 w-full"
        >
          <ExternalLink size={15} />
          View Live Site
        </Link>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/5 w-full"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut, user } = useAuth()

  const handleLogout = async () => {
    await signOut()
    toast.success('Signed out successfully')
    navigate('/admin')
  }

  const currentPage = navItems.find(n => n.path === location.pathname)?.label || 'Dashboard'

  return (
    <div className="min-h-screen flex" style={{ background: '#030810' }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0a1628',
            color: '#e2e8f0',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '13px',
          },
        }}
      />

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <SidebarContent
          mobile={false}
          onClose={() => {}}
          user={user}
          location={location}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed left-0 top-0 bottom-0 z-50 lg:hidden"
            >
              <SidebarContent
                mobile
                onClose={() => setSidebarOpen(false)}
                user={user}
                location={location}
                onLogout={handleLogout}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-4 lg:px-6 py-4 border-b border-white/5 sticky top-0 z-30"
          style={{ background: 'rgba(3,8,16,0.92)', backdropFilter: 'blur(20px)' }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <div>
              <h1 className="text-white font-semibold text-sm">{currentPage}</h1>
              <p className="text-gray-600 text-xs hidden sm:block">RazzShares Admin</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-white hover:bg-white/5"
            >
              <Zap size={11} className="text-cyan-400" />
              View Live Site
            </Link>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
