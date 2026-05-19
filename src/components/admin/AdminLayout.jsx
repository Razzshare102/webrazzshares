import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FolderKanban, Star, Home, Settings,
  Link as LinkIcon, Mail, Search, LogOut, Menu, X, ChevronRight,
  Moon, Sun, Bell, User
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import toast, { Toaster } from 'react-hot-toast'

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard' },
  { icon: FolderKanban, label: 'Portfolio', path: '/admin/portfolio' },
  { icon: Star, label: 'Testimonials', path: '/admin/testimonials' },
  { icon: Home, label: 'Homepage', path: '/admin/homepage' },
  { icon: LinkIcon, label: 'Social Links', path: '/admin/social' },
  { icon: Mail, label: 'Messages', path: '/admin/messages' },
  { icon: Search, label: 'SEO Settings', path: '/admin/seo' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
]

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

  const Sidebar = ({ mobile = false }) => (
    <div
      className={`flex flex-col h-full ${mobile ? 'w-64' : 'w-64'}`}
      style={{
        background: 'rgba(2, 4, 8, 0.95)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Brand */}
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-display font-bold"
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              boxShadow: '0 0 15px rgba(0,212,255,0.3)',
            }}
          >
            R
          </div>
          <div>
            <p className="font-display font-bold text-sm neon-text">RazzShares</p>
            <p className="text-gray-600 text-xs">Admin Panel</p>
          </div>
          {mobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-auto text-gray-500 hover:text-white"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-3 mx-3 mt-3 rounded-xl" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.1)' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
            <User size={12} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.email || 'Admin'}</p>
            <p className="text-green-400 text-xs">● Online</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path
          return (
            <Link
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive ? 'text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
              style={isActive ? {
                background: 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(124,58,237,0.08))',
                border: '1px solid rgba(0,212,255,0.15)',
              } : {}}
            >
              <Icon size={16} className={isActive ? 'text-cyan-400' : ''} />
              {label}
              {isActive && <ChevronRight size={12} className="ml-auto text-cyan-400/50" />}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/5 w-full transition-all duration-200"
        >
          <LogOut size={16} />
          Sign Out
        </button>
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-300 hover:bg-white/5 w-full transition-all duration-200 mt-1"
        >
          <Home size={16} />
          View Site
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex" style={{ background: '#030810' }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#0a1628', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)' },
        }}
      />

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 z-50 lg:hidden"
            >
              <Sidebar mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-4 lg:px-6 py-4 border-b border-white/5"
          style={{ background: 'rgba(2,4,8,0.9)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 30 }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5"
            >
              <Menu size={18} />
            </button>
            <div>
              <h1 className="text-white font-semibold text-sm">
                {navItems.find(n => n.path === location.pathname)?.label || 'Dashboard'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-white hover:bg-white/5 transition-all"
            >
              View Live Site →
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
