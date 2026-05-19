import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send as SendIcon, Twitter, MessageCircle, Mail, CheckCircle2, Loader2, Zap, Clock, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import ScrollReveal from '../components/ui/ScrollReveal'
import { submitContact } from '../hooks/useSupabase'
import usePageMeta from '../hooks/usePageMeta'

const contactMethods = [
  {
    icon: Mail,
    label: 'Email',
    value: 'razzshares@gmail.com',
    href: 'mailto:razzshares@gmail.com',
    color: '#00d4ff',
    description: 'For detailed project inquiries',
  },
  {
    icon: SendIcon,
    label: 'Telegram',
    value: '@razzshares',
    href: 'https://t.me/razzshares',
    color: '#0088cc',
    description: 'Fastest response time',
  },
  {
    icon: Twitter,
    label: 'Twitter / X',
    value: '@razzshares',
    href: 'https://twitter.com/razzshares',
    color: '#1da1f2',
    description: 'DMs open for collaborations',
  },
  {
    icon: MessageCircle,
    label: 'Discord',
    value: 'razzshares',
    href: 'https://discord.gg/razzshares',
    color: '#5865f2',
    description: 'Join the community',
  },
]

const services = [
  'Content Creation',
  'Community Moderation',
  'Ambassador Program',
  'Growth Strategy',
  'DeFi / NFT Consulting',
  'Other',
]

export default function Contact() {
  usePageMeta({
    title: 'Contact | RazzShares',
    description: 'Get in touch with RazzShares for Web3 content creation, community management, and growth strategy.',
  })

  const [form, setForm] = useState({ name: '', email: '', subject: '', service: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const { error } = await submitContact({
        name: form.name,
        email: form.email,
        subject: form.subject || form.service || 'General Inquiry',
        message: form.message,
      })
      if (error) console.warn('Supabase (demo mode):', error.message)

      setSubmitted(true)
      toast.success("Message sent! I'll get back to you soon 🚀", { duration: 5000 })
      setForm({ name: '', email: '', subject: '', service: '', message: '' })
    } catch {
      toast.error('Something went wrong. Please try contacting directly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 20% 80%, rgba(0,212,255,0.04) 0%, transparent 50%)' }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <ScrollReveal className="text-center mb-14">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-4"
            style={{ background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.18)', color: '#67e8f9' }}
          >
            Let's Connect
          </span>
          <h1 className="section-heading neon-text mb-4">Get In Touch</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Have a Web3 project that needs growth? Let's discuss how I can help your crypto project thrive.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left: contact methods */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {contactMethods.map((m, i) => {
              const Icon = m.icon
              return (
                <ScrollReveal key={m.label} delay={i * 0.08}>
                  <a
                    href={m.href}
                    target={m.href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-2xl block"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = m.color + '50'
                      e.currentTarget.style.background = m.color + '08'
                      e.currentTarget.style.transform = 'translateX(5px)'
                      e.currentTarget.style.boxShadow = `0 0 20px ${m.color}12`
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                      e.currentTarget.style.transform = ''
                      e.currentTarget.style.boxShadow = ''
                    }}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${m.color}12`, border: `1px solid ${m.color}25` }}
                    >
                      <Icon size={18} style={{ color: m.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm">{m.label}</p>
                      <p className="text-gray-400 text-xs">{m.value}</p>
                      <p className="text-gray-600 text-xs mt-0.5">{m.description}</p>
                    </div>
                    <ExternalLink size={12} className="text-gray-700 flex-shrink-0" />
                  </a>
                </ScrollReveal>
              )
            })}

            {/* Availability */}
            <ScrollReveal delay={0.4}>
              <div
                className="p-4 rounded-2xl"
                style={{ background: 'rgba(52,211,153,0.04)', border: '1px solid rgba(52,211,153,0.15)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={13} className="text-green-400" />
                  <span className="text-green-400 text-sm font-semibold">Currently Available</span>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Typical response:{' '}
                  <span className="text-white font-medium">within 24 hours</span>. For urgent matters, Telegram is fastest.
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Right: form */}
          <ScrollReveal className="lg:col-span-3" direction="left">
            <div
              className="relative p-6 lg:p-8 rounded-3xl"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {/* Top glow */}
              <div
                className="absolute top-0 left-8 right-8 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.5), rgba(124,58,237,0.4), transparent)' }}
              />

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-14 text-center"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)' }}
                  >
                    <CheckCircle2 size={32} className="text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Message Sent! 🚀</h3>
                  <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
                    Thanks for reaching out. I'll get back to you within 24 hours.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn-secondary text-sm py-2 px-5">
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-xs font-medium mb-1.5">
                        Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="input-field text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs font-medium mb-1.5">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="input-field text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1.5">Service Needed</label>
                    <select
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      className="input-field text-sm"
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="" style={{ background: '#0a1628', color: '#9ca3af' }}>Select a service...</option>
                      {services.map(s => (
                        <option key={s} value={s} style={{ background: '#0a1628', color: '#e2e8f0' }}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1.5">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="Brief subject line"
                      className="input-field text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1.5">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Tell me about your project, goals, and how I can help..."
                      className="input-field text-sm resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary text-white w-full justify-center py-3.5 text-sm"
                  >
                    {loading ? (
                      <><Loader2 size={16} className="animate-spin" /> Sending...</>
                    ) : (
                      <><Zap size={16} /> Send Message</>
                    )}
                  </button>

                  <p className="text-gray-600 text-xs text-center">
                    Or reach out directly at{' '}
                    <a href="mailto:razzshares@gmail.com" className="text-cyan-500 hover:underline">
                      razzshares@gmail.com
                    </a>
                  </p>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  )
}
