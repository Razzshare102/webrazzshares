import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Save, Loader2, Star, Eye, EyeOff } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { useTestimonials } from '../../hooks/useSupabase'
import toast from 'react-hot-toast'

const EMPTY = { name:'', position:'', company:'', feedback:'', avatar_url:'', rating:5, featured:true, sort_order:0 }

/* ── Star picker ─────────────────────────────────────────────────── */
function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  const active = hovered || value
  return (
    <div className="flex gap-1" onMouseLeave={() => setHovered(0)}>
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button"
          onMouseEnter={() => setHovered(n)}
          onClick={() => onChange(n)}
          className="p-0.5 transition-transform hover:scale-110">
          <Star size={20}
            className={n <= active ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
          />
        </button>
      ))}
      <span className="ml-2 text-gray-400 text-sm self-center">{value}/5</span>
    </div>
  )
}

/* ── Modal ───────────────────────────────────────────────────────── */
function TestimonialModal({ testimonial, onClose, onSave }) {
  const [form, setForm] = useState(testimonial || EMPTY)
  const [saving, setSaving] = useState(false)

  const set  = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const onChange = e => {
    const { name, value, type, checked } = e.target
    set(name, type === 'checkbox' ? checked : value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      rating: parseInt(form.rating) || 5,
      sort_order: parseInt(form.sort_order) || 0,
      updated_at: new Date().toISOString(),
    }
    try {
      const { error } = testimonial?.id
        ? await supabase.from('testimonials').update(payload).eq('id', testimonial.id)
        : await supabase.from('testimonials').insert([payload])
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)' }}>
      <motion.div initial={{ opacity:0, scale:0.95, y:20 }} animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:0.95, y:20 }} transition={{ duration:0.25, ease:[0.22,1,0.36,1] }}
        className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl"
        style={{ background:'#080f1e', border:'1px solid rgba(255,255,255,0.1)' }}>

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-white/5"
          style={{ background:'rgba(8,15,30,0.95)', backdropFilter:'blur(12px)' }}>
          <h3 className="text-white font-semibold">{testimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">

          {/* Avatar preview */}
          <div>
            <label className="block text-gray-400 text-xs font-medium mb-2">Avatar</label>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 font-bold text-lg"
                style={{ background:'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))', border:'1px solid rgba(0,212,255,0.2)', color:'#00d4ff' }}>
                {form.avatar_url
                  ? <img src={form.avatar_url} alt="avatar" className="w-full h-full object-cover" onError={e => { e.target.style.display='none' }} />
                  : (form.name?.[0]?.toUpperCase() || '?')
                }
              </div>
              <input name="avatar_url" value={form.avatar_url} onChange={onChange}
                placeholder="https://avatar-url.jpg (optional)"
                className="input-field text-sm flex-1" />
            </div>
          </div>

          {/* Name + position */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 text-xs mb-1">Full Name <span className="text-red-400">*</span></label>
              <input name="name" value={form.name} onChange={onChange} required className="input-field text-sm" placeholder="Alex Chen" />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">Position</label>
              <input name="position" value={form.position} onChange={onChange} className="input-field text-sm" placeholder="CEO" />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-xs mb-1">Company / Project</label>
            <input name="company" value={form.company} onChange={onChange} className="input-field text-sm" placeholder="DeFi Protocol X" />
          </div>

          <div>
            <label className="block text-gray-400 text-xs mb-1">Testimonial <span className="text-red-400">*</span></label>
            <textarea name="feedback" value={form.feedback} onChange={onChange} required rows={4}
              placeholder="What did they say about working with you?"
              className="input-field text-sm resize-none" />
            <p className="text-gray-700 text-xs mt-1">{form.feedback.length} characters</p>
          </div>

          {/* Star rating */}
          <div>
            <label className="block text-gray-400 text-xs mb-2">Rating</label>
            <StarPicker value={form.rating} onChange={v => set('rating', v)} />
          </div>

          {/* Sort + visibility */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-gray-500 text-xs mb-1">Sort Order</label>
              <input type="number" name="sort_order" value={form.sort_order} onChange={onChange}
                className="input-field text-sm" min={0} />
            </div>
            <div>
              <label className="block text-gray-500 text-xs mb-1">Visibility</label>
              <button type="button" onClick={() => set('featured', !form.featured)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium"
                style={{
                  background: form.featured ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.04)',
                  border:`1px solid ${form.featured ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  color: form.featured ? '#34d399' : '#6b7280',
                }}>
                {form.featured ? <Eye size={14} /> : <EyeOff size={14} />}
                {form.featured ? 'Visible' : 'Hidden'}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-white/5">
            <button type="submit" disabled={saving} className="btn-primary text-white flex-1 justify-center py-2.5 text-sm">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : <><Save size={14} /> Save</>}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center py-2.5 text-sm">Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

/* ── Page ────────────────────────────────────────────────────────── */
export default function AdminTestimonials() {
  const { data: testimonials, loading, refetch } = useTestimonials(true)
  const [modal,    setModal]    = useState(null)
  const [deleting, setDeleting] = useState(null)

  const handleDelete = async (id) => {
    if (!confirm('Delete this testimonial?')) return
    setDeleting(id)
    const { error } = await supabase.from('testimonials').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Deleted'); refetch() }
    setDeleting(null)
  }

  const toggleVisibility = async (t) => {
    const { error } = await supabase.from('testimonials').update({ featured: !t.featured }).eq('id', t.id)
    if (error) toast.error(error.message)
    else { toast.success(t.featured ? 'Hidden' : 'Now visible'); refetch() }
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Testimonials</h2>
            <p className="text-gray-500 text-sm mt-0.5">
              {testimonials.filter(t => t.featured).length} visible · {testimonials.length} total
            </p>
          </div>
          <button onClick={() => setModal('add')} className="btn-primary text-white text-sm py-2.5">
            <Plus size={15} /> Add Testimonial
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_,i) => (
              <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background:'rgba(255,255,255,0.03)' }} />
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-20 rounded-2xl" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)' }}>
            <Star size={36} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No testimonials yet.</p>
            <button onClick={() => setModal('add')} className="btn-primary text-white text-sm"><Plus size={14} /> Add First</button>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {testimonials.map(t => (
                <motion.div key={t.id} layout initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  className="p-5 rounded-2xl group"
                  style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor='rgba(124,58,237,0.25)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'}>

                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold flex-shrink-0 overflow-hidden text-lg"
                      style={{ background:'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(0,212,255,0.1))', color:'#a78bfa' }}>
                      {t.avatar_url
                        ? <img src={t.avatar_url} alt={t.name} className="w-full h-full object-cover" />
                        : t.name[0]
                      }
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <p className="text-white font-semibold text-sm">{t.name}</p>
                        <span className="text-xs px-1.5 py-0.5 rounded-md"
                          style={{
                            background: t.featured ? 'rgba(52,211,153,0.1)'  : 'rgba(255,255,255,0.04)',
                            color:      t.featured ? '#34d399' : '#6b7280',
                            border:    `1px solid ${t.featured ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.08)'}`,
                          }}>
                          {t.featured ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs">{t.position}{t.company ? ` · ${t.company}` : ''}</p>
                      <div className="flex gap-0.5 mt-1.5 mb-2">
                        {[...Array(5)].map((_,i) => (
                          <Star key={i} size={11} className={i < (t.rating||5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'} />
                        ))}
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-2 italic">"{t.feedback}"</p>
                    </div>

                    {/* Actions — visible on hover */}
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 flex-shrink-0">
                      <button onClick={() => toggleVisibility(t)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-green-400 hover:bg-green-400/10">
                        {t.featured ? <EyeOff size={12} /> : <Eye size={12} />}
                      </button>
                      <button onClick={() => setModal(t)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-cyan-400 hover:bg-cyan-400/10">
                        <Pencil size={12} />
                      </button>
                      <button onClick={() => handleDelete(t.id)} disabled={deleting === t.id}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-400/10">
                        {deleting === t.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
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
