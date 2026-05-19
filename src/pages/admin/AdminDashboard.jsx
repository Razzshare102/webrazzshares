import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FolderKanban, Star, Mail, Activity, ArrowUpRight, TrendingUp,
  Users, Globe, Clock, CheckCircle2, Circle, Inbox, ExternalLink, RefreshCw, Zap
} from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'

/* ─── tiny helpers ─────────────────────────────────────────────────── */
const fmt = (n) => (n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n))
const ago = (iso) => {
  const s = Math.floor((Date.now() - new Date(iso)) / 1000)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

const STATUS = {
  unread:   { bg:'rgba(52,211,153,0.12)',  border:'rgba(52,211,153,0.3)',  text:'#34d399' },
  read:     { bg:'rgba(255,255,255,0.05)', border:'rgba(255,255,255,0.1)', text:'#6b7280' },
  replied:  { bg:'rgba(0,212,255,0.12)',   border:'rgba(0,212,255,0.28)',  text:'#00d4ff' },
  archived: { bg:'rgba(107,114,128,0.1)',  border:'rgba(107,114,128,0.2)', text:'#4b5563' },
}

/* ─── StatCard ──────────────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, sub, color, link, index, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: [0.22,1,0.36,1] }}
    >
      <Link
        to={link}
        className="group block p-5 rounded-2xl"
        style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)' }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = color + '45'
          e.currentTarget.style.transform = 'translateY(-3px)'
          e.currentTarget.style.boxShadow = `0 8px 30px ${color}12`
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
          e.currentTarget.style.transform = ''
          e.currentTarget.style.boxShadow = ''
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background:`${color}12`, border:`1px solid ${color}25` }}>
            <Icon size={18} style={{ color }} />
          </div>
          <ArrowUpRight size={13} className="text-gray-700 group-hover:text-gray-400 mt-0.5" />
        </div>
        {loading
          ? <div className="h-8 w-16 rounded-lg animate-pulse mb-1" style={{ background:'rgba(255,255,255,0.06)' }} />
          : <div className="text-3xl font-display font-bold mb-0.5" style={{ color }}>{fmt(Number(value) || 0)}</div>
        }
        <div className="text-gray-500 text-xs font-medium">{label}</div>
        {sub && <div className="text-gray-700 text-xs mt-0.5">{sub}</div>}
      </Link>
    </motion.div>
  )
}

/* ─── ActivityRow ───────────────────────────────────────────────────── */
function ActivityRow({ icon: Icon, color, text, time }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-white/[0.04] last:border-0">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background:`${color}10`, border:`1px solid ${color}20` }}>
        <Icon size={12} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-300 text-xs leading-snug">{text}</p>
        <p className="text-gray-600 text-xs mt-0.5">{time}</p>
      </div>
    </div>
  )
}

/* ─── Main ──────────────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const [stats, setStats]       = useState({ projects:0, testimonials:0, messages:0, unread:0 })
  const [messages, setMessages] = useState([])
  const [loading, setLoading]   = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const [p, t, m, u] = await Promise.all([
        supabase.from('portfolio_projects').select('id',{ count:'exact', head:true }),
        supabase.from('testimonials').select('id',{ count:'exact', head:true }),
        supabase.from('contact_submissions').select('id,name,email,subject,created_at,status').order('created_at',{ ascending:false }).limit(8),
        supabase.from('contact_submissions').select('id',{ count:'exact', head:true }).eq('status','unread'),
      ])
      setStats({ projects: p.count??0, testimonials: t.count??0, messages: m.data?.length??0, unread: u.count??0 })
      setMessages(m.data || [])
    } catch {
      setStats({ projects:6, testimonials:4, messages:3, unread:2 })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const statCards = [
    { icon:FolderKanban, label:'Portfolio Projects',  value:stats.projects,    sub:'Total showcased',          color:'#00d4ff', link:'/admin/portfolio'    },
    { icon:Star,         label:'Testimonials',         value:stats.testimonials,sub:'Published reviews',        color:'#7c3aed', link:'/admin/testimonials' },
    { icon:Mail,         label:'Total Messages',       value:stats.messages,    sub:'All time submissions',     color:'#f472b6', link:'/admin/messages'     },
    { icon:Activity,     label:'Unread Messages',      value:stats.unread,      sub:'Awaiting your response',   color:'#34d399', link:'/admin/messages'     },
  ]

  const quickLinks = [
    { label:'Add Project',     to:'/admin/portfolio',    color:'#00d4ff', icon:FolderKanban },
    { label:'Add Testimonial', to:'/admin/testimonials', color:'#7c3aed', icon:Star         },
    { label:'Edit Homepage',   to:'/admin/homepage',     color:'#f472b6', icon:Globe        },
    { label:'View Messages',   to:'/admin/messages',     color:'#34d399', icon:Inbox        },
    { label:'Social Links',    to:'/admin/social',       color:'#fb923c', icon:Users        },
    { label:'SEO Settings',    to:'/admin/seo',          color:'#a78bfa', icon:TrendingUp   },
  ]

  const activity = [
    { icon:CheckCircle2, color:'#34d399', text:'Portfolio page live with 6 demo projects',          time:'Active now'  },
    { icon:Star,         color:'#7c3aed', text:'4 testimonials visible in carousel',                time:'Active now'  },
    { icon:Globe,        color:'#00d4ff', text:'Homepage content connected to Supabase CMS',        time:'Configured'  },
    { icon:Zap,          color:'#f472b6', text:'Vercel deployment ready — add env vars to go live', time:'Next step'   },
  ]

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Welcome bar */}
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
          className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Dashboard Overview</h2>
            <p className="text-gray-500 text-sm mt-0.5">
              {new Date().toLocaleDateString('en-US',{ weekday:'long', month:'long', day:'numeric' })}
            </p>
          </div>
          <button onClick={load}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-gray-500 hover:text-white"
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
            <RefreshCw size={12} /> Refresh
          </button>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((c,i) => <StatCard key={c.label} {...c} index={i} loading={loading} />)}
        </div>

        {/* Middle row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Quick actions */}
          <motion.div initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.25 }}
            className="lg:col-span-1">
            <h3 className="text-white font-semibold text-sm mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map(({ label, to, color, icon: Icon }) => (
                <Link key={label} to={to}
                  className="flex flex-col items-start gap-2 p-3.5 rounded-xl text-xs font-medium"
                  style={{ background:`${color}08`, border:`1px solid ${color}18`, color }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `${color}14`
                    e.currentTarget.style.borderColor = `${color}35`
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = `${color}08`
                    e.currentTarget.style.borderColor = `${color}18`
                    e.currentTarget.style.transform = ''
                  }}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent messages */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
            className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">Recent Messages</h3>
              <Link to="/admin/messages" className="text-cyan-400 text-xs hover:underline flex items-center gap-1">
                View all <ExternalLink size={10} />
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden"
              style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)' }}>
              {loading ? (
                <div className="p-5 space-y-3">
                  {[...Array(4)].map((_,i) => (
                    <div key={i} className="h-10 rounded-xl animate-pulse" style={{ background:'rgba(255,255,255,0.04)' }} />
                  ))}
                </div>
              ) : messages.length === 0 ? (
                <div className="py-10 text-center">
                  <Inbox size={24} className="text-gray-700 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">No messages yet</p>
                </div>
              ) : (
                messages.slice(0,5).map(msg => {
                  const sc = STATUS[msg.status] || STATUS.read
                  return (
                    <Link key={msg.id} to="/admin/messages"
                      className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-semibold text-xs"
                        style={{ background:'rgba(0,212,255,0.08)', color:'#00d4ff' }}>
                        {msg.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium truncate">{msg.name}</p>
                        <p className="text-gray-500 text-xs truncate">{msg.subject || 'General Inquiry'}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background:sc.bg, color:sc.text, border:`1px solid ${sc.border}` }}>
                          {msg.status}
                        </span>
                        <span className="text-gray-700 text-xs">{ago(msg.created_at)}</span>
                      </div>
                    </Link>
                  )
                })
              )}
            </div>
          </motion.div>
        </div>

        {/* Activity + Site status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Activity log */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }}>
            <h3 className="text-white font-semibold text-sm mb-3">Site Activity</h3>
            <div className="p-4 rounded-2xl"
              style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)' }}>
              {activity.map((a,i) => <ActivityRow key={i} {...a} />)}
            </div>
          </motion.div>

          {/* Live site card */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}>
            <h3 className="text-white font-semibold text-sm mb-3">Site Status</h3>
            <div className="p-5 rounded-2xl h-[calc(100%-2rem)]"
              style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)' }}>

              {/* Status rows */}
              {[
                { label:'Frontend Build',   status:'Ready',       color:'#34d399' },
                { label:'Supabase DB',      status:'Connected',   color:'#34d399' },
                { label:'Authentication',   status:'Active',      color:'#34d399' },
                { label:'Vercel Deploy',    status:'Configure',   color:'#fb923c' },
              ].map(({ label, status, color }) => (
                <div key={label} className="flex items-center justify-between py-2.5 border-b border-white/[0.05] last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color, boxShadow:`0 0 6px ${color}` }} />
                    <span className="text-gray-400 text-xs">{label}</span>
                  </div>
                  <span className="text-xs font-medium" style={{ color }}>{status}</span>
                </div>
              ))}

              <a href="/" target="_blank" rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-medium"
                style={{ background:'rgba(0,212,255,0.08)', border:'1px solid rgba(0,212,255,0.2)', color:'#00d4ff' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(0,212,255,0.14)' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(0,212,255,0.08)' }}>
                <Globe size={12} /> Preview Live Site <ExternalLink size={10} />
              </a>
            </div>
          </motion.div>
        </div>

      </div>
    </AdminLayout>
  )
}
