import { useState, useEffect } from 'react'
import { Save, Loader2, RefreshCw, CheckCircle2, Info, Hash, Type, AlignLeft } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const FIELDS = [
  {
    section: 'Hero',
    color: '#00d4ff',
    items: [
      { key:'hero_headline',    label:'Main Headline',    type:'text',     max:80,  icon:Type,     placeholder:'Web3 Content Creator & Community Moderator' },
      { key:'hero_subheadline', label:'Sub Headline',     type:'textarea', max:200, icon:AlignLeft, placeholder:'Helping crypto projects grow through content, engagement...' },
    ]
  },
  {
    section: 'Stats Counter',
    color: '#7c3aed',
    items: [
      { key:'stats_projects',    label:'Projects Count',     type:'text', max:10, icon:Hash, placeholder:'50' },
      { key:'stats_reach',       label:'Campaign Reach',     type:'text', max:10, icon:Hash, placeholder:'500K' },
      { key:'stats_communities', label:'Communities Managed',type:'text', max:10, icon:Hash, placeholder:'30' },
      { key:'stats_threads',     label:'Threads Written',    type:'text', max:10, icon:Hash, placeholder:'1000' },
    ]
  },
  {
    section: 'About Bio',
    color: '#f472b6',
    items: [
      { key:'about_bio', label:'Bio Text', type:'textarea', max:600, icon:AlignLeft, placeholder:'Your professional bio...' },
    ]
  },
]

/* character-count bar */
function CharBar({ current, max, color }) {
  const pct  = Math.min((current / max) * 100, 100)
  const warn = pct > 90
  return (
    <div className="mt-1.5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-gray-700 text-xs">{current}/{max} characters</span>
        {warn && <span className="text-yellow-500 text-xs">Near limit</span>}
      </div>
      <div className="h-1 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.06)' }}>
        <div className="h-full rounded-full transition-all duration-300"
          style={{ width:`${pct}%`, background: warn ? '#f59e0b' : color }} />
      </div>
    </div>
  )
}

export default function AdminHomepage() {
  const [content, setContent] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('homepage_content').select('*')
    if (data) {
      const map = {}
      data.forEach(r => { map[r.key] = r.value })
      setContent(map)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const set = (key, value) => setContent(p => ({ ...p, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const allKeys = FIELDS.flatMap(s => s.items.map(i => i.key))
      const upserts = allKeys.map(key => ({
        key,
        value: content[key] || '',
        updated_at: new Date().toISOString(),
      }))
      const { error } = await supabase.from('homepage_content').upsert(upserts, { onConflict:'key' })
      if (error) throw error
      setSaved(true)
      toast.success('Homepage content saved!')
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      toast.error(err.message || 'Error saving')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Homepage Content</h2>
            <p className="text-gray-500 text-sm mt-0.5">Edit text, numbers, and copy shown on your homepage</p>
          </div>
          <div className="flex gap-2">
            <button onClick={load} className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-white"
              style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <RefreshCw size={14} />
            </button>
            <button onClick={handleSave} disabled={saving}
              className="btn-primary text-white text-sm py-2 px-4 min-w-[100px] justify-center">
              {saving  ? <><Loader2 size={14} className="animate-spin" /> Saving…</> :
               saved   ? <><CheckCircle2 size={14} /> Saved!</> :
                         <><Save size={14} /> Save All</>}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_,i) => (
              <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background:'rgba(255,255,255,0.03)' }} />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {FIELDS.map(({ section, color, items }) => (
              <div key={section} className="rounded-2xl overflow-hidden"
                style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)' }}>

                {/* Section header */}
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/5"
                  style={{ background:`${color}06` }}>
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:color }} />
                  <span className="text-white font-semibold text-sm">{section}</span>
                </div>

                <div className="p-5 space-y-5">
                  {items.map(({ key, label, type, max, icon: Icon, placeholder }) => {
                    const val = content[key] || ''
                    return (
                      <div key={key}>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Icon size={12} style={{ color }} />
                          <label className="text-gray-300 text-sm font-medium">{label}</label>
                        </div>
                        {type === 'textarea' ? (
                          <textarea
                            value={val}
                            onChange={e => set(key, e.target.value)}
                            placeholder={placeholder}
                            rows={type === 'textarea' && max > 200 ? 5 : 3}
                            className="input-field text-sm resize-none"
                          />
                        ) : (
                          <input
                            type="text"
                            value={val}
                            onChange={e => set(key, e.target.value)}
                            placeholder={placeholder}
                            className="input-field text-sm"
                          />
                        )}
                        <CharBar current={val.length} max={max} color={color} />
                        <p className="text-gray-700 text-xs mt-0.5 font-mono">{key}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Info banner */}
            <div className="flex items-start gap-3 p-4 rounded-xl"
              style={{ background:'rgba(0,212,255,0.04)', border:'1px solid rgba(0,212,255,0.12)' }}>
              <Info size={14} className="text-cyan-500 flex-shrink-0 mt-0.5" />
              <p className="text-gray-400 text-xs leading-relaxed">
                Changes here update your live site content via Supabase CMS. Stats and text refresh on the next page load.
              </p>
            </div>

            {/* Bottom save */}
            <button onClick={handleSave} disabled={saving}
              className="btn-primary text-white w-full justify-center py-3.5 text-sm">
              {saving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> :
               saved  ? <><CheckCircle2 size={15} /> All Changes Saved!</> :
                        <><Save size={15} /> Save Homepage Content</>}
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
