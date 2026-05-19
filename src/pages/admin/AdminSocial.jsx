import { useState, useEffect } from 'react'
import { Save, Loader2, Eye, EyeOff, RefreshCw } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function AdminSocial() {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetch = async () => {
    setLoading(true)
    const { data } = await supabase.from('social_links').select('*').order('platform')
    setLinks(data || [])
    setLoading(false)
  }

  useEffect(() => { fetch() }, [])

  const handleChange = (id, field, value) => {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      for (const link of links) {
        const { error } = await supabase.from('social_links').update({
          url: link.url,
          handle: link.handle,
          visible: link.visible,
          updated_at: new Date().toISOString(),
        }).eq('id', link.id)
        if (error) throw error
      }
      toast.success('Social links saved!')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const PLATFORM_COLORS = { twitter: '#1da1f2', telegram: '#0088cc', discord: '#5865f2', email: '#00d4ff' }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Social Links</h2>
            <p className="text-gray-500 text-sm">Manage your social media links</p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetch} className="btn-secondary text-sm py-2 px-3"><RefreshCw size={14} /></button>
            <button onClick={handleSave} disabled={saving} className="btn-primary text-white text-sm py-2 px-4">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Save size={14} /> Save</>}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : (
          <div className="space-y-4">
            {links.map(link => {
              const color = PLATFORM_COLORS[link.platform] || '#00d4ff'
              return (
                <div
                  key={link.id}
                  className="p-5 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: color }} />
                      <span className="text-white font-semibold capitalize">{link.platform}</span>
                    </div>
                    <button
                      onClick={() => handleChange(link.id, 'visible', !link.visible)}
                      className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg transition-all"
                      style={{
                        background: link.visible ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.04)',
                        color: link.visible ? '#34d399' : '#9ca3af',
                        border: `1px solid ${link.visible ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.08)'}`,
                      }}
                    >
                      {link.visible ? <Eye size={11} /> : <EyeOff size={11} />}
                      {link.visible ? 'Visible' : 'Hidden'}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-500 text-xs mb-1">URL</label>
                      <input
                        value={link.url}
                        onChange={e => handleChange(link.id, 'url', e.target.value)}
                        className="input-field text-sm"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 text-xs mb-1">Handle / Label</label>
                      <input
                        value={link.handle || ''}
                        onChange={e => handleChange(link.id, 'handle', e.target.value)}
                        className="input-field text-sm"
                        placeholder="@username"
                      />
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
