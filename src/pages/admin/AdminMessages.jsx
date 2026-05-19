import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Trash2, Check, Archive, Loader2, ExternalLink, RefreshCw } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { useContactSubmissions } from '../../hooks/useSupabase'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  unread: { bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)', text: '#34d399' },
  read: { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', text: '#9ca3af' },
  replied: { bg: 'rgba(0,212,255,0.1)', border: 'rgba(0,212,255,0.25)', text: '#00d4ff' },
  archived: { bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.2)', text: '#6b7280' },
}

export default function AdminMessages() {
  const { data: messages, loading, refetch } = useContactSubmissions()
  const [selected, setSelected] = useState(null)
  const [updating, setUpdating] = useState(null)

  const updateStatus = async (id, status) => {
    setUpdating(id)
    const { error } = await supabase.from('contact_submissions').update({ status }).eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success(`Marked as ${status}`); refetch() }
    setUpdating(null)
  }

  const deleteMessage = async (id) => {
    if (!confirm('Delete this message?')) return
    setUpdating(id)
    const { error } = await supabase.from('contact_submissions').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Deleted'); if (selected?.id === id) setSelected(null); refetch() }
    setUpdating(null)
  }

  const formatDate = (str) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Contact Messages</h2>
            <p className="text-gray-500 text-sm">{messages.filter(m => m.status === 'unread').length} unread · {messages.length} total</p>
          </div>
          <button onClick={refetch} className="btn-secondary text-sm py-2 px-3"><RefreshCw size={14} /></button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* List */}
          <div className="lg:col-span-2 space-y-2">
            {loading ? (
              <div className="text-center py-10 text-gray-500 text-sm">Loading...</div>
            ) : messages.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-sm">No messages yet</div>
            ) : (
              messages.map(msg => {
                const sc = STATUS_COLORS[msg.status] || STATUS_COLORS.read
                return (
                  <div
                    key={msg.id}
                    onClick={() => { setSelected(msg); updateStatus(msg.id, msg.status === 'unread' ? 'read' : msg.status) }}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${selected?.id === msg.id ? 'ring-1 ring-cyan-500/40' : ''}`}
                    style={{
                      background: selected?.id === msg.id ? 'rgba(0,212,255,0.05)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${selected?.id === msg.id ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.07)'}`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-white text-sm font-medium truncate">{msg.name}</p>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-md flex-shrink-0 ml-2"
                        style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}
                      >
                        {msg.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs truncate">{msg.subject || 'No subject'}</p>
                    <p className="text-gray-600 text-xs mt-1">{formatDate(msg.created_at)}</p>
                  </div>
                )
              })
            )}
          </div>

          {/* Detail */}
          <div className="lg:col-span-3">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl h-full"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-white font-bold">{selected.name}</h3>
                    <a href={`mailto:${selected.email}`} className="text-cyan-400 text-sm hover:underline flex items-center gap-1">
                      {selected.email} <ExternalLink size={10} />
                    </a>
                    <p className="text-gray-500 text-xs mt-0.5">{formatDate(selected.created_at)}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => updateStatus(selected.id, 'replied')}
                      disabled={updating === selected.id}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all"
                      title="Mark as replied"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => updateStatus(selected.id, 'archived')}
                      disabled={updating === selected.id}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all"
                      title="Archive"
                    >
                      <Archive size={14} />
                    </button>
                    <button
                      onClick={() => deleteMessage(selected.id)}
                      disabled={updating === selected.id}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                      title="Delete"
                    >
                      {updating === selected.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>

                {selected.subject && (
                  <div className="mb-3 pb-3 border-b border-white/5">
                    <span className="text-gray-500 text-xs">Subject: </span>
                    <span className="text-gray-300 text-sm">{selected.subject}</span>
                  </div>
                )}

                <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </div>

                <div className="mt-5 pt-4 border-t border-white/5">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your Message'}`}
                    className="btn-primary text-white text-sm py-2 px-4 inline-flex"
                  >
                    <Mail size={14} /> Reply via Email
                  </a>
                </div>
              </motion.div>
            ) : (
              <div
                className="flex items-center justify-center h-64 rounded-2xl text-gray-600 text-sm"
                style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                Select a message to view
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
