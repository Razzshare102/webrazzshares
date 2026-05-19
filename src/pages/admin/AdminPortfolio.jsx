import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Save, Loader2, ExternalLink, Star } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { usePortfolio } from '../../hooks/useSupabase'
import toast from 'react-hot-toast'

const EMPTY_FORM = {
  title: '',
  description: '',
  tags: '',
  logo_url: '',
  visit_url: '',
  twitter_url: '',
  telegram_url: '',
  discord_url: '',
  featured: false,
  sort_order: 0,
}

function ProjectModal({ project, onClose, onSave }) {
  const [form, setForm] = useState(project ? {
    ...project,
    tags: Array.isArray(project.tags) ? project.tags.join(', ') : '',
  } : EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      ...form,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      sort_order: parseInt(form.sort_order) || 0,
      updated_at: new Date().toISOString(),
    }

    try {
      let error
      if (project?.id) {
        const res = await supabase.from('portfolio_projects').update(payload).eq('id', project.id)
        error = res.error
      } else {
        const res = await supabase.from('portfolio_projects').insert([payload])
        error = res.error
      }

      if (error) throw error
      toast.success(project ? 'Project updated!' : 'Project created!')
      onSave()
      onClose()
    } catch (err) {
      toast.error(err.message || 'Error saving project')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h3 className="text-white font-semibold">{project ? 'Edit Project' : 'Add Project'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-gray-400 text-xs mb-1">Project Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required placeholder="Project name" className="input-field text-sm" />
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Project description..." className="input-field text-sm resize-none" />
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Tags (comma separated)</label>
            <input name="tags" value={form.tags} onChange={handleChange} placeholder="DeFi, Community, NFT" className="input-field text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 text-xs mb-1">Logo URL</label>
              <input name="logo_url" value={form.logo_url} onChange={handleChange} placeholder="https://..." className="input-field text-sm" />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">Website URL</label>
              <input name="visit_url" value={form.visit_url} onChange={handleChange} placeholder="https://..." className="input-field text-sm" />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">Twitter URL</label>
              <input name="twitter_url" value={form.twitter_url} onChange={handleChange} placeholder="https://twitter.com/..." className="input-field text-sm" />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">Telegram URL</label>
              <input name="telegram_url" value={form.telegram_url} onChange={handleChange} placeholder="https://t.me/..." className="input-field text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 text-xs mb-1">Discord URL</label>
              <input name="discord_url" value={form.discord_url} onChange={handleChange} placeholder="https://discord.gg/..." className="input-field text-sm" />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">Sort Order</label>
              <input type="number" name="sort_order" value={form.sort_order} onChange={handleChange} className="input-field text-sm" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 rounded accent-cyan-500" />
            <span className="text-gray-300 text-sm">Featured project</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary text-white flex-1 justify-center py-2.5 text-sm">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Save size={14} /> Save Project</>}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center py-2.5 text-sm">Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function AdminPortfolio() {
  const { data: projects, loading, refetch } = usePortfolio()
  const [modal, setModal] = useState(null) // null | 'add' | project object
  const [deleting, setDeleting] = useState(null)

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return
    setDeleting(id)
    const { error } = await supabase.from('portfolio_projects').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Project deleted'); refetch() }
    setDeleting(null)
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Portfolio Projects</h2>
            <p className="text-gray-500 text-sm mt-0.5">{projects.length} projects total</p>
          </div>
          <button onClick={() => setModal('add')} className="btn-primary text-white text-sm py-2.5">
            <Plus size={15} /> Add Project
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">No projects yet. Add your first one!</p>
            <button onClick={() => setModal('add')} className="btn-primary text-white text-sm"><Plus size={14} /> Add Project</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-sm"
                      style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff' }}
                    >
                      {project.title[0]}
                    </div>
                    {project.featured && <Star size={12} className="text-yellow-400 fill-yellow-400" />}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setModal(project)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      disabled={deleting === project.id}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                    >
                      {deleting === project.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                    </button>
                  </div>
                </div>
                <h4 className="text-white font-semibold text-sm mb-1">{project.title}</h4>
                <p className="text-gray-500 text-xs line-clamp-2 mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-1">
                  {project.tags?.slice(0, 3).map(tag => (
                    <span key={tag} className="tag-chip text-xs py-0">{tag}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {modal && (
            <ProjectModal
              project={modal === 'add' ? null : modal}
              onClose={() => setModal(null)}
              onSave={refetch}
            />
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}
