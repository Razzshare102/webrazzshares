import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Save, Loader2, Star } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { useTestimonials } from '../../hooks/useSupabase'
import toast from 'react-hot-toast'

const EMPTY_FORM = {
  name: '', position: '', company: '', feedback: '',
  avatar_url: '', rating: 5, featured: true, sort_order: 0,
}

function TestimonialModal({ testimonial, onClose, onSave }) {
  const [form, setForm] = useState(testimonial || EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, rating: parseInt(form.rating), sort_order: parseInt(form.sort_order) || 0, updated_at: new Date().toISOString() }

    try {
      let error
      if (testimonial?.id) {
        const res = await supabase.from('testimonials').update(payload).eq('id', testimonial.id)
        error = res.error
      } else {
        const res = await supabase.from('testimonials').insert([payload])
        error = res.error
      }
      if (error) throw error
      toast.success(testimonial ? 'Testimonial updated!' : 'Testimonial added!')
      onSave(); onClose()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h3 className="text-white font-semibold">{testimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 text-xs mb-1">Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required className="input-field text-sm" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">Position</label>
              <input name="position" value={form.position} onChange={handleChange} className="input-field text-sm" placeholder="CEO" />
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Company</label>
            <input name="company" value={form.company} onChange={handleChange} className="input-field text-sm" placeholder="Company name" />
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Feedback *</label>
            <textarea name="feedback" value={form.feedback} onChange={handleChange} required rows={4} className="input-field text-sm resize-none" placeholder="Their testimonial..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 text-xs mb-1">Rating (1-5)</label>
              <input type="number" name="rating" value={form.rating} onChange={handleChange} min={1} max={5} className="input-field text-sm" />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">Sort Order</label>
              <input type="number" name="sort_order" value={form.sort_order} onChange={handleChange} className="input-field text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Avatar URL</label>
            <input name="avatar_url" value={form.avatar_url} onChange={handleChange} className="input-field text-sm" placeholder="https://..." />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 accent-cyan-500" />
            <span className="text-gray-300 text-sm">Show on homepage</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary text-white flex-1 justify-center py-2.5 text-sm">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Save size={14} /> Save</>}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center py-2.5 text-sm">Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function AdminTestimonials() {
  const { data: testimonials, loading, refetch } = useTestimonials(true)
  const [modal, setModal] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const handleDelete = async (id) => {
    if (!confirm('Delete this testimonial?')) return
    setDeleting(id)
    const { error } = await supabase.from('testimonials').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Deleted!'); refetch() }
    setDeleting(null)
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Testimonials</h2>
            <p className="text-gray-500 text-sm">{testimonials.length} total</p>
          </div>
          <button onClick={() => setModal('add')} className="btn-primary text-white text-sm py-2.5">
            <Plus size={15} /> Add Testimonial
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">No testimonials yet.</p>
            <button onClick={() => setModal('add')} className="btn-primary text-white text-sm"><Plus size={14} /> Add First Testimonial</button>
          </div>
        ) : (
          <div className="space-y-3">
            {testimonials.map(t => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-5 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold flex-shrink-0" style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa' }}>
                      {t.name[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-white font-semibold text-sm">{t.name}</p>
                        {t.featured && <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)' }}>Visible</span>}
                      </div>
                      <p className="text-gray-500 text-xs">{t.position}{t.company ? ` · ${t.company}` : ''}</p>
                      <div className="flex gap-0.5 mt-1">
                        {[...Array(t.rating || 5)].map((_, i) => <Star key={i} size={10} className="text-yellow-400 fill-yellow-400" />)}
                      </div>
                      <p className="text-gray-400 text-sm mt-2 line-clamp-2">"{t.feedback}"</p>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => setModal(t)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(t.id)} disabled={deleting === t.id} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all">
                      {deleting === t.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {modal && (
            <TestimonialModal
              testimonial={modal === 'add' ? null : modal}
              onClose={() => setModal(null)}
              onSave={refetch}
            />
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}
