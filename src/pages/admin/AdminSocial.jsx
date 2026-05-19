import { useState, useEffect } from 'react'
import { Save, Loader2, Eye, EyeOff, RefreshCw, Copy, Check, ExternalLink, CheckCircle2 } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const PLATFORM_CONFIG = {
  twitter:  { label:'Twitter / X', color:'#1da1f2', icon:'𝕏', hint:'https://twitter.com/username' },
  telegram: { label:'Telegram',    color:'#0088cc', icon:'✈', hint:'https://t.me/username'         },
  discord:  { label:'Discord',     color:'#5865f2', icon:'⚡', hint:'https://discord.gg/invite'    },
  email:    { label:'Email',       color:'#00d4ff', icon:'✉', hint:'mailto:you@email.com'          },
}

/* copy-to-clipboard button */
function CopyBtn({ text }) {
  const [done, setDone] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(text).catch(() => {})
    setDone(true)
    setTimeout(() => setDone(false), 1800)
  }
  return (
    <button type="button" onClick={copy}
      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-600 hover:text-gray-300"
      style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)' }}
      title="Copy URL">
      {done ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
    </button>
  )
}

export default function AdminSocial() {
  const [links,   setLinks]   = useState([])
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('social_links').select('*').order('platform')
    setLinks(data || defaultLinks())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const defaultLinks = () => Object.entries(PLATFORM_CONFIG).map(([platform, cfg]) => ({
    id: platform, platform, url:'', handle:'', visible:true, _new:true,
  }))

  const set = (id, field, value) => {
    setLinks(p => p.map(l => (l.id === id || l.platform === id) ? { ...l, [field]: value } : l))
  }

  const toggleAll = (visible) => {
    setLinks(p => p.map(l => ({ ...l, visible })))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      for (const link of links) {
        if (link._new) continue // skip demo fallback items
        await supabase.from('social_links').update({
          url:     link.url,
          handle:  link.handle,
          visible: link.visible,
          updated_at: new Date().toISOString(),
        }).eq('id', link.id)
      }
      setSaved(true)
      toast.success('Social links saved!')
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const allVisible = links.every(l => l.visible)
  const anyVisible = links.some(l => l.visible)

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Social Links</h2>
            <p className="text-gray-500 text-sm mt-0.5">
              {links.filter(l => l.visible).length} of {links.length} visible on your site
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={load}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-white"
              style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <RefreshCw size={14} />
            </button>
            <button onClick={handleSave} disabled={saving}
              className="btn-primary text-white text-sm py-2 px-4 min-w-[100px] justify-center">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> :
               saved  ? <><CheckCircle2 size={14} /> Saved!</> :
                        <><Save size={14} /> Save</>}
            </button>
          </div>
        </div>

        {/* Toggle all bar */}
        <div className="flex items-center justify-between mb-4 px-4 py-2.5 rounded-xl"
          style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)' }}>
          <span className="text-gray-400 text-xs font-medium">Toggle all visibility</span>
          <div className="flex gap-2">
            <button onClick={() => toggleAll(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5"
              style={{
                background: allVisible ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.04)',
                border:     allVisible ? '1px solid rgba(52,211,153,0.25)' : '1px solid rgba(255,255,255,0.08)',
                color:      allVisible ? '#34d399' : '#9ca3af',
              }}>
              <Eye size={11} /> Show All
            </button>
            <button onClick={() => toggleAll(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5"
              style={{
                background: !anyVisible ? 'rgba(107,114,128,0.1)' : 'rgba(255,255,255,0.04)',
                border:     !anyVisible ? '1px solid rgba(107,114,128,0.25)' : '1px solid rgba(255,255,255,0.08)',
                color:      !anyVisible ? '#9ca3af' : '#6b7280',
              }}>
              <EyeOff size={11} /> Hide All
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_,i) => <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ background:'rgba(255,255,255,0.03)' }} />)}
          </div>
        ) : (
          <div className="space-y-3">
            {links.map(link => {
              const cfg = PLATFORM_CONFIG[link.platform] || {}
              return (
                <div key={link.id || link.platform}
                  className="p-5 rounded-2xl"
                  style={{
                    background: link.visible ? `${cfg.color}06` : 'rgba(255,255,255,0.02)',
                    border:     link.visible ? `1px solid ${cfg.color}20` : '1px solid rgba(255,255,255,0.06)',
                  }}>

                  {/* Platform header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {/* Icon circle */}
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                        style={{ background:`${cfg.color}15`, border:`1px solid ${cfg.color}30`, color:cfg.color }}>
                        {cfg.icon}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{cfg.label || link.platform}</p>
                        {link.handle && <p className="text-gray-500 text-xs">{link.handle}</p>}
                      </div>
                    </div>

                    {/* Visibility toggle */}
                    <button onClick={() => set(link.id || link.platform, 'visible', !link.visible)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium"
                      style={{
                        background: link.visible ? 'rgba(52,211,153,0.1)'  : 'rgba(255,255,255,0.04)',
                        border:    `1px solid ${link.visible ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.1)'}`,
                        color:      link.visible ? '#34d399' : '#6b7280',
                      }}>
                      {link.visible ? <Eye size={11} /> : <EyeOff size={11} />}
                      {link.visible ? 'Visible' : 'Hidden'}
                    </button>
                  </div>

                  {/* Fields */}
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-gray-500 text-xs mb-1">URL</label>
                      <div className="flex gap-2">
                        <input value={link.url || ''} onChange={e => set(link.id || link.platform, 'url', e.target.value)}
                          placeholder={cfg.hint} className="input-field text-sm flex-1 py-2" />
                        {link.url && <CopyBtn text={link.url} />}
                        {link.url && (
                          <a href={link.url} target="_blank" rel="noopener noreferrer"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-300 flex-shrink-0"
                            style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)' }}>
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-500 text-xs mb-1">Handle / Display Label</label>
                      <input value={link.handle || ''} onChange={e => set(link.id || link.platform, 'handle', e.target.value)}
                        placeholder="@username or display text" className="input-field text-sm py-2" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
