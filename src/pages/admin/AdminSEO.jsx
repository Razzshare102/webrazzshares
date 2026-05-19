import { useState, useEffect } from 'react'
import { Save, Loader2, RefreshCw } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const PAGES = ['home', 'portfolio', 'about', 'contact']

export default function AdminSEO() {
  const [seoData, setSeoData] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activePage, setActivePage] = useState('home')

  const fetch = async () => {
    setLoading(true)
    const { data } = await supabase.from('seo_settings').select('*')
    if (data) {
      const map = {}
      data.forEach(row => { map[row.page] = row })
      setSeoData(map)
    }
    setLoading(false)
  }

  useEffect(() => { fetch() }, [])

  const handleChange = (page, field, value) => {
    setSeoData(prev => ({
      ...prev,
      [page]: { ...(prev[page] || { page }), [field]: value },
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      for (const page of PAGES) {
        const row = seoData[page]
        if (!row) continue
        const { error } = await supabase.from('seo_settings').upsert({
          page,
          title: row.title || '',
          description: row.description || '',
          og_image: row.og_image || '',
          keywords: row.keywords || '',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'page' })
        if (error) throw error
      }
      toast.success('SEO settings saved!')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const current = seoData[activePage] || {}

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">SEO Settings</h2>
            <p className="text-gray-500 text-sm">Optimize your pages for search engines</p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetch} className="btn-secondary text-sm py-2 px-3"><RefreshCw size={14} /></button>
            <button onClick={handleSave} disabled={saving} className="btn-primary text-white text-sm py-2 px-4">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Save size={14} /> Save All</>}
            </button>
          </div>
        </div>

        {/* Page tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {PAGES.map(page => (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 capitalize"
              style={{
                background: activePage === page ? 'linear-gradient(135deg, #00d4ff, #7c3aed)' : 'rgba(255,255,255,0.04)',
                border: activePage === page ? 'none' : '1px solid rgba(255,255,255,0.08)',
                color: activePage === page ? 'white' : '#9ca3af',
              }}
            >
              {page}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : (
          <div
            className="p-6 rounded-2xl space-y-5"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">Page Title</label>
              <input
                value={current.title || ''}
                onChange={e => handleChange(activePage, 'title', e.target.value)}
                className="input-field text-sm"
                placeholder="Page Title | RazzShares"
              />
              <p className="text-gray-600 text-xs mt-1">{(current.title || '').length}/60 chars recommended</p>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">Meta Description</label>
              <textarea
                value={current.description || ''}
                onChange={e => handleChange(activePage, 'description', e.target.value)}
                className="input-field text-sm resize-none"
                rows={3}
                placeholder="Brief description for search engines..."
              />
              <p className="text-gray-600 text-xs mt-1">{(current.description || '').length}/160 chars recommended</p>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">Keywords</label>
              <input
                value={current.keywords || ''}
                onChange={e => handleChange(activePage, 'keywords', e.target.value)}
                className="input-field text-sm"
                placeholder="Web3, crypto, community manager..."
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">OG Image URL</label>
              <input
                value={current.og_image || ''}
                onChange={e => handleChange(activePage, 'og_image', e.target.value)}
                className="input-field text-sm"
                placeholder="https://..."
              />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
