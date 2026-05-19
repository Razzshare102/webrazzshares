import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Pencil, Trash2, X, Save, Loader2, Star, StarOff,
  Upload, Image, ExternalLink, Twitter, Send, MessageCircle, Tag
} from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { usePortfolio } from '../../hooks/useSupabase'
import toast from 'react-hot-toast'

const EMPTY = {
  title:'', description:'', tags:'', logo_url:'',
  visit_url:'', twitter_url:'', telegram_url:'', discord_url:'',
  featured:false, sort_order:0,
}

/* ── Image upload helper ─────────────────────────────────────────── */
async function uploadImage(file, bucket = 'portfolio-images') {
  const ext  = file.name.split('.').pop()
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

/* ── Modal ───────────────────────────────────────────────────────── */
function ProjectModal({ project, onClose, onSave }) {
  const [form, setForm] = useState(
    project
      ? { ...project, tags: Array.isArray(project.tags) ? project.tags.join(', ') : '' }
      : EMPTY
  )
  const [saving,     setSaving]     = useState(false)
  const [uploading,  setUploading]  = useState(false)
  const fileRef = useRef()

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const onChange = e => {
    const { name, value, type, checked } = e.target
    set(name, type === 'checkbox' ? checked : value)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file)
      set('logo_url', url)
      toast.success('Image uploaded!')
    } catch (err) {
      // fallback: use object URL for demo
      set('logo_url', URL.createObjectURL(file))
      toast('Image preview set (Supabase Storage not configured)', { icon:'ℹ️' })
    } finally {
      setUploading(false)
    }
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
      const { error } = project?.id
        ? await supabase.from('portfolio_projects').update(payload).eq('id', project.id)
        : await supabase.from('portfolio_projects').insert([payload])
      if (error) throw error
      toast.success(project ? 'Project updated!' : 'Project added!')
      onSave(); onClose()
    } catch (err) {
      toast.error(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const Field = ({ label, name, placeholder, type='text' }) => (
    <div>
      <label className="block text-gray-500 text-xs mb-1">{label}</label>
      <input type={type} name={name} value={form[name]} onChange={onChange}
        placeholder={placeholder} className="input-field text-sm" />
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)' }}>
      <motion.div initial={{ opacity:0, scale:0.95, y:20 }} animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:0.95, y:20 }} transition={{ duration:0.25, ease:[0.22,1,0.36,1] }}
        className="w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl"
        style={{ background:'#080f1e', border:'1px solid rgba(255,255,255,0.1)' }}>

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-white/5"
          style={{ background:'rgba(8,15,30,0.95)', backdropFilter:'blur(12px)' }}>
          <div>
            <h3 className="text-white font-semibold">{project ? 'Edit Project' : 'Add New Project'}</h3>
            <p className="text-gray-600 text-xs mt-0.5">Fill in the project details below</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">

          {/* Logo upload + preview */}
          <div>
            <label className="block text-gray-400 text-xs font-medium mb-2">Project Logo</label>
            <div className="flex items-center gap-3">
              {/* Preview */}
              <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                style={{ background:'rgba(0,212,255,0.06)', border:'1px solid rgba(0,212,255,0.15)' }}>
                {form.logo_url
                  ? <img src={form.logo_url} alt="logo" className="w-full h-full object-cover" />
                  : <Image size={20} className="text-gray-600" />
                }
              </div>
              <div className="flex-1 space-y-2">
                <input name="logo_url" value={form.logo_url} onChange={onChange}
                  placeholder="https://..." className="input-field text-xs py-2" />
                <button type="button" onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{ background:'rgba(0,212,255,0.08)', border:'1px solid rgba(0,212,255,0.2)', color:'#00d4ff' }}>
                  {uploading ? <Loader2 size={11} className="animate-spin" /> : <Upload size={11} />}
                  {uploading ? 'Uploading…' : 'Upload Image'}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </div>
            </div>
          </div>

          {/* Core fields */}
          <div>
            <label className="block text-gray-400 text-xs font-medium mb-1.5">Project Title <span className="text-red-400">*</span></label>
            <input name="title" value={form.title} onChange={onChange} required
              placeholder="e.g. DeFi Protocol Alpha" className="input-field text-sm" />
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-medium mb-1.5">Description</label>
            <textarea name="description" value={form.description} onChange={onChange}
              rows={3} placeholder="Describe what you did for this project…" className="input-field text-sm resize-none" />
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-medium mb-1.5">
              <Tag size={11} className="inline mr-1" />Tags <span className="text-gray-600 font-normal">(comma separated)</span>
            </label>
            <input name="tags" value={form.tags} onChange={onChange}
              placeholder="DeFi, Community, NFT, Ambassador" className="input-field text-sm" />
            {form.tags && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.tags.split(',').map(t => t.trim()).filter(Boolean).map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-md text-xs"
                    style={{ background:'rgba(0,212,255,0.08)', border:'1px solid rgba(0,212,255,0.18)', color:'#67e8f9' }}>
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* URLs grid */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Website URL"  name="visit_url"    placeholder="https://project.xyz" />
            <Field label="Twitter URL"  name="twitter_url"  placeholder="https://twitter.com/…" />
            <Field label="Telegram URL" name="telegram_url" placeholder="https://t.me/…" />
            <Field label="Discord URL"  name="discord_url"  placeholder="https://discord.gg/…" />
          </div>

          {/* Sort + featured */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-gray-500 text-xs mb-1">Sort Order</label>
              <input type="number" name="sort_order" value={form.sort_order} onChange={onChange}
                className="input-field text-sm" min={0} />
              <p className="text-gray-700 text-xs mt-1">Lower = shown first</p>
            </div>
            <div>
              <label className="block text-gray-500 text-xs mb-1">Featured</label>
              <button type="button" onClick={() => set('featured', !form.featured)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium"
                style={{
                  background: form.featured ? 'rgba(234,179,8,0.1)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${form.featured ? 'rgba(234,179,8,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  color: form.featured ? '#facc15' : '#6b7280',
                }}>
                {form.featured ? <Star size={14} className="fill-yellow-400" /> : <StarOff size={14} />}
                {form.featured ? 'Featured' : 'Not Featured'}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-white/5">
            <button type="submit" disabled={saving} className="btn-primary text-white flex-1 justify-center py-2.5 text-sm">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : <><Save size={14} /> Save Project</>}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center py-2.5 text-sm">Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

/* ── ProjectCard ─────────────────────────────────────────────────── */
function ProjectCard({ project, onEdit, onDelete, deleting }) {
  return (
    <motion.div layout initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
      exit={{ opacity:0, scale:0.9 }}
      className="p-4 rounded-2xl group"
      style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(0,212,255,0.2)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.07)' }}>

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
            style={{ background:'rgba(0,212,255,0.08)', border:'1px solid rgba(0,212,255,0.15)' }}>
            {project.logo_url
              ? <img src={project.logo_url} alt={project.title} className="w-full h-full object-cover" />
              : <span className="text-cyan-400 font-display font-bold">{project.title[0]}</span>
            }
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">{project.title}</p>
            {project.featured && (
              <span className="inline-flex items-center gap-1 text-xs mt-0.5" style={{ color:'#facc15' }}>
                <Star size={9} className="fill-yellow-400" /> Featured
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100">
          <button onClick={() => onEdit(project)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-cyan-400 hover:bg-cyan-400/10">
            <Pencil size={12} />
          </button>
          <button onClick={() => onDelete(project.id)} disabled={deleting === project.id}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-400/10">
            {deleting === project.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
          </button>
        </div>
      </div>

      <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">{project.description}</p>

      <div className="flex flex-wrap gap-1 mb-3">
        {project.tags?.slice(0,4).map(t => (
          <span key={t} className="px-1.5 py-0.5 rounded-md text-xs"
            style={{ background:'rgba(0,212,255,0.07)', border:'1px solid rgba(0,212,255,0.15)', color:'#67e8f9' }}>
            {t}
          </span>
        ))}
      </div>

      {/* Social links */}
      <div className="flex items-center gap-1.5">
        {project.visit_url    && <a href={project.visit_url}    target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-md flex items-center justify-center text-gray-600 hover:text-white" style={{ background:'rgba(255,255,255,0.05)' }}><ExternalLink size={10} /></a>}
        {project.twitter_url  && <a href={project.twitter_url}  target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background:'rgba(29,161,242,0.1)', color:'#1da1f2' }}><Twitter size={10} /></a>}
        {project.telegram_url && <a href={project.telegram_url} target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background:'rgba(0,136,204,0.1)', color:'#0088cc' }}><Send size={10} /></a>}
        {project.discord_url  && <a href={project.discord_url}  target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background:'rgba(88,101,242,0.1)', color:'#5865f2' }}><MessageCircle size={10} /></a>}
        <span className="ml-auto text-gray-700 text-xs">#{project.sort_order ?? 0}</span>
      </div>
    </motion.div>
  )
}

/* ── Page ────────────────────────────────────────────────────────── */
export default function AdminPortfolio() {
  const { data: projects, loading, refetch } = usePortfolio()
  const [modal,    setModal]    = useState(null)
  const [deleting, setDeleting] = useState(null)

  const handleDelete = async (id) => {
    if (!confirm('Delete this project? This cannot be undone.')) return
    setDeleting(id)
    const { error } = await supabase.from('portfolio_projects').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Project deleted'); refetch() }
    setDeleting(null)
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Portfolio Projects</h2>
            <p className="text-gray-500 text-sm mt-0.5">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={() => setModal('add')} className="btn-primary text-white text-sm py-2.5">
            <Plus size={15} /> Add Project
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_,i) => (
              <div key={i} className="h-52 rounded-2xl animate-pulse" style={{ background:'rgba(255,255,255,0.03)' }} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 rounded-2xl" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)' }}>
            <FolderKanban size={36} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No projects yet. Add your first one!</p>
            <button onClick={() => setModal('add')} className="btn-primary text-white text-sm"><Plus size={14} /> Add Project</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {projects.map(p => (
                <ProjectCard key={p.id} project={p}
                  onEdit={setModal} onDelete={handleDelete} deleting={deleting} />
              ))}
            </AnimatePresence>
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

// for the empty state icon
function FolderKanban({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 6a2 2 0 0 1 2-2h5l2 2h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z"/>
      <line x1="8" y1="14" x2="8" y2="18"/><line x1="12" y1="11" x2="12" y2="18"/><line x1="16" y1="14" x2="16" y2="18"/>
    </svg>
  )
}
