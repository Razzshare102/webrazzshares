import { useState, useEffect } from 'react'
import { Save, Loader2, RefreshCw } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const CONTENT_FIELDS = [
  { key: 'hero_headline', label: 'Hero Headline', type: 'text', placeholder: 'Web3 Content Creator & Community Moderator' },
  { key: 'hero_subheadline', label: 'Hero Subheadline', type: 'textarea', placeholder: 'Helping crypto projects grow...' },
  { key: 'stats_projects', label: 'Stats: Projects Count', type: 'text', placeholder: '50' },
  { key: 'stats_reach', label: 'Stats: Campaign Reach', type: 'text', placeholder: '500K' },
  { key: 'stats_communities', label: 'Stats: Communities Managed', type: 'text', placeholder: '30' },
  { key: 'stats_threads', label: 'Stats: Threads Written', type: 'text', placeholder: '1000' },
  { key: 'about_bio', label: 'About Bio', type: 'textarea', placeholder: 'Your bio text...' },
]

export default function AdminHomepage() {
  const [content, setContent] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchContent = async () => {
    setLoading(true)
    const { data } = await supabase.from('homepage_content').select('*')
    if (data) {
      const map = {}
      data.forEach(item => { map[item.key] = item.value })
      setContent(map)
    }
    setLoading(false)
  }

  useEffect(() => { fetchContent() }, [])

  const handleChange = (key, value) => {
    setContent(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updates = CONTENT_FIELDS.map(field => ({
        key: field.key,
        value: content[field.key] || '',
        updated_at: new Date().toISOString(),
      }))

      const { error } = await supabase
        .from('homepage_content')
        .upsert(updates, { onConflict: 'key' })

      if (error) throw error
      toast.success('Homepage content saved!')
    } catch (err) {
      toast.error(err.message || 'Error saving content')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Homepage Content</h2>
            <p className="text-gray-500 text-sm">Edit your homepage text and stats</p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchContent} className="btn-secondary text-sm py-2 px-3">
              <RefreshCw size={14} />
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-primary text-white text-sm py-2 px-4">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Save size={14} /> Save All</>}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading content...</div>
        ) : (
          <div
            className="p-6 rounded-2xl space-y-5"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {CONTENT_FIELDS.map(field => (
              <div key={field.key}>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={content[field.key] || ''}
                    onChange={e => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={4}
                    className="input-field text-sm resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={content[field.key] || ''}
                    onChange={e => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="input-field text-sm"
                  />
                )}
                <p className="text-gray-600 text-xs mt-1 font-mono">{field.key}</p>
              </div>
            ))}

            <div className="pt-4 border-t border-white/5">
              <button onClick={handleSave} disabled={saving} className="btn-primary text-white text-sm w-full justify-center py-3">
                {saving ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : <><Save size={15} /> Save Homepage Content</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
