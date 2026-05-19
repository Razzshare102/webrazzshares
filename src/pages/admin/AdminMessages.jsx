import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, Trash2, CheckCircle2, Archive, Loader2, ExternalLink,
  RefreshCw, Inbox, Reply, X, Send, Clock, Eye
} from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { useContactSubmissions } from '../../hooks/useSupabase'
import toast from 'react-hot-toast'

const STATUS = {
  unread:   { bg:'rgba(52,211,153,0.12)',  border:'rgba(52,211,153,0.3)',  text:'#34d399',  label:'Unread'   },
  read:     { bg:'rgba(255,255,255,0.05)', border:'rgba(255,255,255,0.1)', text:'#6b7280',  label:'Read'     },
  replied:  { bg:'rgba(0,212,255,0.12)',   border:'rgba(0,212,255,0.28)',  text:'#00d4ff',  label:'Replied'  },
  archived: { bg:'rgba(107,114,128,0.1)',  border:'rgba(107,114,128,0.2)', text:'#4b5563',  label:'Archived' },
}

const TABS = ['all', 'unread', 'read', 'replied', 'archived']

const fmtDate = iso => new Date(iso).toLocaleDateString('en-US',{ month:'short', day:'numeric', year:'numeric', hour:'2-digit', minute:'2-digit' })
const ago = iso => {
  const s = Math.floor((Date.now() - new Date(iso)) / 1000)
  if (s < 60)    return `${s}s ago`
  if (s < 3600)  return `${Math.floor(s/60)}m ago`
  if (s < 86400) return `${Math.floor(s/3600)}h ago`
  return `${Math.floor(s/86400)}d ago`
}

/* ── Reply Modal ─────────────────────────────────────────────────── */
function ReplyModal({ msg, onClose }) {
  const [body, setBody]   = useState(`Hi ${msg.name},\n\nThank you for reaching out!\n\n`)
  const [sending, setSending] = useState(false)

  const send = async () => {
    setSending(true)
    // Open email client (mailto) — in prod you'd call a server action
    const subject = encodeURIComponent(`Re: ${msg.subject || 'Your Message'}`)
    const bodyEnc = encodeURIComponent(body)
    window.open(`mailto:${msg.email}?subject=${subject}&body=${bodyEnc}`, '_blank')
    // Mark as replied
    await supabase.from('contact_submissions').update({ status:'replied' }).eq('id', msg.id)
    toast.success('Email client opened & marked as replied')
    setSending(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)' }}>
      <motion.div initial={{ opacity:0, scale:0.95, y:16 }} animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:0.95 }} transition={{ duration:0.22, ease:[0.22,1,0.36,1] }}
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{ background:'#080f1e', border:'1px solid rgba(255,255,255,0.1)' }}>

        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div>
            <h3 className="text-white font-semibold text-sm">Reply to {msg.name}</h3>
            <p className="text-gray-600 text-xs">{msg.email}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10">
            <X size={15} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="p-3 rounded-xl text-xs text-gray-400 italic"
            style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
            Original: "{msg.message?.slice(0, 120)}{msg.message?.length > 120 ? '…' : ''}"
          </div>

          <textarea value={body} onChange={e => setBody(e.target.value)} rows={7}
            className="input-field text-sm resize-none font-mono" />

          <div className="flex gap-3">
            <button onClick={send} disabled={sending}
              className="btn-primary text-white flex-1 justify-center py-2.5 text-sm">
              {sending ? <><Loader2 size={14} className="animate-spin" /> Opening…</> : <><Send size={14} /> Open Email Client</>}
            </button>
            <button onClick={onClose} className="btn-secondary px-5 py-2.5 text-sm">Cancel</button>
          </div>
          <p className="text-gray-700 text-xs text-center">Opens your default email app to send the reply</p>
        </div>
      </motion.div>
    </div>
  )
}

/* ── Main ────────────────────────────────────────────────────────── */
export default function AdminMessages() {
  const { data: all, loading, refetch } = useContactSubmissions()
  const [tab,      setTab]      = useState('all')
  const [selected, setSelected] = useState(null)
  const [updating, setUpdating] = useState(null)
  const [replyMsg, setReplyMsg] = useState(null)

  const messages = tab === 'all' ? all : all.filter(m => m.status === tab)

  const update = async (id, status) => {
    setUpdating(id)
    const { error } = await supabase.from('contact_submissions').update({ status }).eq('id', id)
    if (error) toast.error(error.message)
    else {
      toast.success(`Marked as ${status}`)
      refetch()
      if (selected?.id === id) setSelected(p => ({ ...p, status }))
    }
    setUpdating(null)
  }

  const del = async (id) => {
    if (!confirm('Delete this message permanently?')) return
    setUpdating(id)
    const { error } = await supabase.from('contact_submissions').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Deleted'); if (selected?.id === id) setSelected(null); refetch() }
    setUpdating(null)
  }

  const openMsg = (msg) => {
    setSelected(msg)
    if (msg.status === 'unread') update(msg.id, 'read')
  }

  const tabCount = (t) => t === 'all' ? all.length : all.filter(m => m.status === t).length

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-white">Contact Messages</h2>
            <p className="text-gray-500 text-sm mt-0.5">
              {all.filter(m => m.status==='unread').length} unread · {all.length} total
            </p>
          </div>
          <button onClick={refetch}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-white"
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
            <RefreshCw size={14} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 mb-4 flex-wrap">
          {TABS.map(t => {
            const count = tabCount(t)
            const active = tab === t
            return (
              <button key={t} onClick={() => setTab(t)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium capitalize flex items-center gap-1.5"
                style={{
                  background: active ? 'linear-gradient(135deg,#00d4ff,#7c3aed)' : 'rgba(255,255,255,0.04)',
                  border:     active ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  color:      active ? 'white' : '#9ca3af',
                }}>
                {t}
                <span className="px-1.5 py-0.5 rounded-full text-xs leading-none"
                  style={{ background: active ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)' }}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* List */}
          <div className="lg:col-span-2 space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            {loading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_,i) => (
                  <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background:'rgba(255,255,255,0.03)' }} />
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="py-12 text-center">
                <Inbox size={28} className="text-gray-700 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">No {tab !== 'all' ? tab : ''} messages</p>
              </div>
            ) : (
              messages.map(msg => {
                const sc = STATUS[msg.status] || STATUS.read
                const isActive = selected?.id === msg.id
                return (
                  <div key={msg.id} onClick={() => openMsg(msg)}
                    className="p-3.5 rounded-xl cursor-pointer"
                    style={{
                      background: isActive ? 'rgba(0,212,255,0.06)' : msg.status === 'unread' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isActive ? 'rgba(0,212,255,0.25)' : msg.status === 'unread' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}`,
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor='rgba(255,255,255,0.12)' }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor= msg.status==='unread' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-sm truncate ${msg.status === 'unread' ? 'text-white font-semibold' : 'text-gray-300 font-medium'}`}>
                        {msg.name}
                      </p>
                      <span className="text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ml-2"
                        style={{ background:sc.bg, color:sc.text, border:`1px solid ${sc.border}` }}>
                        {sc.label}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs truncate">{msg.subject || 'No subject'}</p>
                    <p className="text-gray-700 text-xs mt-1">{ago(msg.created_at)}</p>
                  </div>
                )
              })
            )}
          </div>

          {/* Detail */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div key={selected.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                  transition={{ duration:0.22 }}
                  className="p-5 rounded-2xl"
                  style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.08)' }}>

                  {/* Top glow */}
                  <div className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
                    style={{ background:'linear-gradient(90deg, transparent, rgba(0,212,255,0.4), transparent)' }} />

                  {/* Sender info */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold flex-shrink-0"
                        style={{ background:'rgba(0,212,255,0.1)', color:'#00d4ff' }}>
                        {selected.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-white font-bold">{selected.name}</h3>
                        <a href={`mailto:${selected.email}`}
                          className="text-cyan-400 text-sm hover:underline inline-flex items-center gap-1">
                          {selected.email} <ExternalLink size={10} />
                        </a>
                        <div className="flex items-center gap-1 mt-1 text-gray-600 text-xs">
                          <Clock size={10} />
                          {fmtDate(selected.created_at)}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => update(selected.id, 'replied')} disabled={updating === selected.id}
                        title="Mark replied"
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:text-cyan-400 hover:bg-cyan-400/10">
                        <CheckCircle2 size={14} />
                      </button>
                      <button onClick={() => update(selected.id, 'archived')} disabled={updating === selected.id}
                        title="Archive"
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:text-yellow-400 hover:bg-yellow-400/10">
                        <Archive size={14} />
                      </button>
                      <button onClick={() => del(selected.id)} disabled={updating === selected.id}
                        title="Delete"
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-400/10">
                        {updating === selected.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Subject */}
                  {selected.subject && (
                    <div className="mb-3 pb-3 border-b border-white/5">
                      <span className="text-gray-600 text-xs">Subject: </span>
                      <span className="text-gray-200 text-sm font-medium">{selected.subject}</span>
                    </div>
                  )}

                  {/* Status badge */}
                  <div className="mb-4">
                    <span className="text-xs px-2.5 py-1 rounded-full"
                      style={{
                        background: STATUS[selected.status]?.bg || STATUS.read.bg,
                        color:      STATUS[selected.status]?.text || STATUS.read.text,
                        border:    `1px solid ${STATUS[selected.status]?.border || STATUS.read.border}`,
                      }}>
                      {STATUS[selected.status]?.label || 'Read'}
                    </span>
                  </div>

                  {/* Message body */}
                  <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap p-4 rounded-xl mb-5"
                    style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)' }}>
                    {selected.message}
                  </div>

                  {/* Reply button */}
                  <div className="flex gap-2">
                    <button onClick={() => setReplyMsg(selected)}
                      className="btn-primary text-white text-sm py-2.5 flex-1 justify-center">
                      <Reply size={14} /> Reply to Message
                    </button>
                    <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your Message'}`}
                      className="btn-secondary text-sm py-2.5 px-4 flex items-center gap-1.5">
                      <ExternalLink size={13} /> Quick Email
                    </a>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity:0 }} animate={{ opacity:1 }}
                  className="flex flex-col items-center justify-center h-64 rounded-2xl text-center"
                  style={{ background:'rgba(255,255,255,0.01)', border:'1px dashed rgba(255,255,255,0.07)' }}>
                  <Eye size={28} className="text-gray-700 mb-3" />
                  <p className="text-gray-600 text-sm">Select a message to view</p>
                  <p className="text-gray-700 text-xs mt-1">Click any message on the left</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Reply modal */}
      <AnimatePresence>
        {replyMsg && <ReplyModal msg={replyMsg} onClose={() => { setReplyMsg(null); refetch() }} />}
      </AnimatePresence>
    </AdminLayout>
  )
}
