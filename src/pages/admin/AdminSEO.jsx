import { useState, useEffect } from 'react'
import { Save, Loader2, RefreshCw, Globe, Image, Tag, AlignLeft, Type, CheckCircle2 } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const PAGES = ['home', 'portfolio', 'about', 'contact']

const PAGE_META = {
  home:      { label:'Home',      path:'/',          color:'#00d4ff' },
  portfolio: { label:'Portfolio', path:'/portfolio', color:'#7c3aed' },
  about:     { label:'About',     path:'/about',     color:'#f472b6' },
  contact:   { label:'Contact',   path:'/contact',   color:'#34d399' },
}

/* character-count bar */
function CharBar({ value, max, good, color }) {
  const len  = (value || '').length
  const pct  = Math.min((len / max) * 100, 100)
  const isGood  = len >= good && len <= max
  const isOver  = len > max
  const barColor = isOver ? '#f87171' : isGood ? '#34d399' : color
  return (
    <div className="mt-1.5 space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span style={{ color: isOver ? '#f87171' : '#4b5563' }}>{len} / {max} chars</span>
        {isGood && <span className="text-green-400 flex items-center gap-1"><CheckCircle2 size={10} /> Good length</span>}
        {isOver && <span className="text-red-400">Too long!</span>}
        {!isGood && !isOver && len > 0 && <span style={{ color:'#6b7280' }}>Ideal: {good}–{max}</span>}
      </div>
      <div className="h-1 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.06)' }}>
        <div className="h-full rounded-full transition-all duration-300"
          style={{ width:`${pct}%`, background: barColor }} />
      </div>
    </div>
  )
}

/* OG Preview card */
function OGPreview({ data, page }) {
  const meta = PAGE_META[page] || {}
  return (
    <div className="rounded-xl overflow-hidden" style={{ border:'1px solid rgba(255,255,255,0.1)' }}>
      {/* OG image placeholder */}
      <div className="h-28 flex items-center justify-center relative"
        style={{ background:'linear-gradient(135deg,#070f1e,#0c1930)' }}>
        {data.og_image ? (
          <img src={data.og_image} alt="OG" className="w-full h-full object-cover absolute inset-0" />
        ) : (
          <div className="text-center">
            <Image size={20} className="text-gray-700 mx-auto mb-1" />
            <p className="text-gray-700 text-xs">No OG image set</p>
          </div>
        )}
        <div className="absolute bottom-2 left-2 text-xs px-2 py-0.5 rounded"
          style={{ background:'rgba(0,0,0,0.6)', color:'#9ca3af' }}>
          {meta.path || '/'}
        </div>
      </div>
      {/* Text preview */}
      <div className="p-3" style={{ background:'#0f1f35' }}>
        <p className="text-gray-500 text-xs mb-0.5">razzshares.com</p>
        <p className="text-white text-sm font-semibold line-clamp-1">
          {data.title || `${meta.label} | RazzShares`}
        </p>
        <p className="text-gray-400 text-xs mt-0.5 line-clamp-2">
          {data.description || 'No meta description set yet.'}
        </p>
      </div>
    </div>
  )
}

export default function AdminSEO() {
  const [seoData,     setSeoData]     = useState({})
  const [loading,     setLoading]     = useState(true)
  const [saving,      setSaving]      = useState(false)
  const [saved,       setSaved]       = useState(false)
  const [activePage,  setActivePage]  = useState('home')

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('seo_settings').select('*')
    if (data) {
      const map = {}
      data.forEach(r => { map[r.page] = r })
      setSeoData(map)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const set = (page, field, value) => {
    setSeoData(p => ({ ...p, [page]: { ...(p[page] || { page }), [field]: value } }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      for (const page of PAGES) {
        const row = seoData[page] || { page }
        await supabase.from('seo_settings').upsert({
          page,
          title:       row.title       || '',
          description: row.description || '',
          og_image:    row.og_image    || '',
          keywords:    row.keywords    || '',
          updated_at:  new Date().toISOString(),
        }, { onConflict:'page' })
      }
      setSaved(true)
      toast.success('SEO settings saved!')
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const current = seoData[activePage] || {}
  const meta    = PAGE_META[activePage] || {}

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">SEO Settings</h2>
            <p className="text-gray-500 text-sm mt-0.5">Optimize every page for search engines & social sharing</p>
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
                        <><Save size={14} /> Save All</>}
            </button>
          </div>
        </div>

        {/* Page tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {PAGES.map(page => {
            const m = PAGE_META[page]
            const active = activePage === page
            return (
              <button key={page} onClick={() => setActivePage(page)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium capitalize"
                style={{
                  background: active ? `${m.color}18`   : 'rgba(255,255,255,0.04)',
                  border:     active ? `1px solid ${m.color}50` : '1px solid rgba(255,255,255,0.08)',
                  color:      active ? m.color : '#9ca3af',
                }}>
                <Globe size={12} />
                {m.label}
              </button>
            )
          })}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_,i) => <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background:'rgba(255,255,255,0.03)' }} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

            {/* Form */}
            <div className="lg:col-span-3 space-y-5">
              <div className="p-5 rounded-2xl space-y-5"
                style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)' }}>

                {/* Title */}
                <div>
                  <label className="flex items-center gap-1.5 text-gray-300 text-sm font-medium mb-1.5">
                    <Type size={12} style={{ color: meta.color }} /> Page Title
                  </label>
                  <input value={current.title || ''} onChange={e => set(activePage, 'title', e.target.value)}
                    placeholder={`${meta.label} | RazzShares`} className="input-field text-sm" />
                  <CharBar value={current.title} max={60} good={50} color={meta.color} />
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center gap-1.5 text-gray-300 text-sm font-medium mb-1.5">
                    <AlignLeft size={12} style={{ color: meta.color }} /> Meta Description
                  </label>
                  <textarea value={current.description || ''} onChange={e => set(activePage, 'description', e.target.value)}
                    placeholder="Brief, compelling description for search results…"
                    className="input-field text-sm resize-none" rows={3} />
                  <CharBar value={current.description} max={160} good={120} color={meta.color} />
                </div>

                {/* Keywords */}
                <div>
                  <label className="flex items-center gap-1.5 text-gray-300 text-sm font-medium mb-1.5">
                    <Tag size={12} style={{ color: meta.color }} /> Keywords
                  </label>
                  <input value={current.keywords || ''} onChange={e => set(activePage, 'keywords', e.target.value)}
                    placeholder="Web3, crypto, community manager, ambassador…" className="input-field text-sm" />
                  <p className="text-gray-700 text-xs mt-1">Separate with commas</p>
                </div>

                {/* OG image */}
                <div>
                  <label className="flex items-center gap-1.5 text-gray-300 text-sm font-medium mb-1.5">
                    <Image size={12} style={{ color: meta.color }} /> Open Graph Image URL
                  </label>
                  <input value={current.og_image || ''} onChange={e => set(activePage, 'og_image', e.target.value)}
                    placeholder="https://your-site.com/og-image.jpg (1200×630)" className="input-field text-sm" />
                  <p className="text-gray-700 text-xs mt-1">Recommended: 1200×630px</p>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="lg:col-span-2">
              <h3 className="text-gray-500 text-xs font-medium mb-2 uppercase tracking-wider">Social Preview</h3>
              <OGPreview data={current} page={activePage} />

              {/* Tips */}
              <div className="mt-4 p-4 rounded-xl space-y-2"
                style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Tips</p>
                {[
                  ['Title',       '50–60 chars'],
                  ['Description', '120–160 chars'],
                  ['OG Image',    '1200 × 630 px'],
                  ['Keywords',    '5–10 terms'],
                ].map(([k,v]) => (
                  <div key={k} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">{k}</span>
                    <span className="text-gray-400 font-mono">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
