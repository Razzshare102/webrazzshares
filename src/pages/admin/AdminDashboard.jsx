import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FolderKanban, Star, Mail, Activity, ArrowUpRight, Users, TrendingUp, Search, Home, Link as LinkIcon, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'

const StatCard = ({ icon: Icon, label, value, color, link, index }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
    <Link
      to={link}
      className="block p-5 rounded-2xl group"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = color + '40'
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = `0 8px 30px ${color}10`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = ''
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
          <Icon size={18} style={{ color }} />
        </div>
        <ArrowUpRight size={14} className="text-gray-600 group-hover:text-gray-400" />
      </div>
      <div className="text-3xl font-display font-bold mb-1" style={{ color }}>{value}</div>
      <div className="text-gray-500 text-sm">{label}</div>
    </Link>
  </motion.div>
)

const quickActions = [
  { label: 'Add Project',      link: '/admin/portfolio',    color: '#00d4ff', icon: FolderKanban },
  { label: 'Add Testimonial',  link: '/admin/testimonials', color: '#7c3aed', icon: Star       },
  { label: 'Edit Homepage',    link: '/admin/homepage',     color: '#f472b6', icon: Home       },
  { label: 'View Messages',    link: '/admin/messages',     color: '#34d399', icon: Mail       },
  { label: 'Social Links',     link: '/admin/social',       color: '#fb923c', icon: LinkIcon   },
  { label: 'SEO Settings',     link: '/admin/seo',          color: '#a78bfa', icon: Search     },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: '—', testimonials: '—', messages: '—', unread: '—' })
  const [recentMessages, setRecentMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [proj, test, msgs, unread] = await Promise.all([
          supabase.from('portfolio_projects').select('id', { count: 'exact', head: true }),
          supabase.from('testimonials').select('id', { count: 'exact', head: true }),
          supabase.from('contact_submissions').select('id, name, email, subject, created_at, status').order('created_at', { ascending: false }).limit(5),
          supabase.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('status', 'unread'),
        ])
        setStats({
          projects: proj.count ?? 0,
          testimonials: test.count ?? 0,
          messages: msgs.count ?? msgs.data?.length ?? 0,
          unread: unread.count ?? 0,
        })
        setRecentMessages(msgs.data || [])
      } catch {
        setStats({ projects: 6, testimonials: 4, messages: 3, unread: 2 })
        setRecentMessages([])
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    { icon: FolderKanban, label: 'Portfolio Projects', value: stats.projects, color: '#00d4ff', link: '/admin/portfolio' },
    { icon: Star,         label: 'Testimonials',       value: stats.testimonials, color: '#7c3aed', link: '/admin/testimonials' },
    { icon: Mail,         label: 'Total Messages',     value: stats.messages,    color: '#f472b6', link: '/admin/messages' },
    { icon: Activity,     label: 'Unread Messages',    value: stats.unread,      color: '#34d399', link: '/admin/messages' },
  ]

  const STATUS_COLORS = {
    unread:   { bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.3)',  text: '#34d399' },
    read:     { bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.1)', text: '#9ca3af' },
    replied:  { bg: 'rgba(0,212,255,0.1)',   border: 'rgba(0,212,255,0.25)', text: '#00d4ff'  },
    archived: { bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.2)', text: '#6b7280' },
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-1">Welcome back! 👋</h2>
          <p className="text-gray-500 text-sm">Here's an overview of your RazzShares portfolio site.</p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, i) => <StatCard key={card.label} {...card} index={i} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick actions */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <h3 className="text-white font-semibold mb-4 text-sm">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {quickActions.map(({ label, link, color, icon: Icon }) => (
                <Link
                  key={label}
                  to={link}
                  className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium"
                  style={{ background: `${color}08`, border: `1px solid ${color}1a`, color }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `${color}14`
                    e.currentTarget.style.borderColor = `${color}35`
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = `${color}08`
                    e.currentTarget.style.borderColor = `${color}1a`
                    e.currentTarget.style.transform = ''
                  }}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent messages */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-sm">Recent Messages</h3>
              <Link to="/admin/messages" className="text-cyan-400 text-xs hover:underline">View all →</Link>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {loading ? (
                <div className="p-6 text-center text-gray-500 text-sm">Loading...</div>
              ) : recentMessages.length === 0 ? (
                <div className="p-8 text-center">
                  <Mail size={24} className="text-gray-700 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">No messages yet</p>
                </div>
              ) : (
                recentMessages.slice(0, 4).map((msg) => {
                  const sc = STATUS_COLORS[msg.status] || STATUS_COLORS.read
                  return (
                    <div key={msg.id} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{msg.name}</p>
                        <p className="text-gray-500 text-xs truncate">{msg.subject || 'General Inquiry'}</p>
                      </div>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-3"
                        style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}
                      >
                        {msg.status}
                      </span>
                    </div>
                  )
                })
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  )
}
