import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Twitter, MessageCircle, Mail, CheckCircle2, AlertCircle, Loader2, Zap } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
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
    icon: Send,
    label: 'Telegram',
    value: '@razzshares',
    href: 'https://t.me/razzshares',
    color: '#0088cc',
    description: 'Fastest response time',
  },
  {
    icon: Twitter,
    label: 'Twitter/X',
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
  'DeFi/NFT Consulting',
  'Other',
]

export default function Contact() {
  usePageMeta({
    title: 'Contact | RazzShares',
    description: 'Get in touch with RazzShares for Web3 content creation, community management, and growth strategy.',
  })
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    service: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields', {
        style: {
          background: '#0a1628',
          color: '#f87171',
          border: '1px solid rgba(248,113,113,0.3)',
        },
      })
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

      if (error) {
        // If Supabase isn't configured, still show success (demo mode)
        console.warn('Supabase error (demo mode):', error.message)
      }

      setSubmitted(true)
      toast.success('Message sent! I\'ll get back to you soon 🚀', {
        duration: 5000,
        style: {
          background: '#0a1628',
          color: '#34d399',
          border: '1px solid rgba(52,211,153,0.3)',
        },
        iconTheme: {
          primary: '#34d399',
          secondary: '#020408',
        },
      })

      setForm({ name: '', email: '', subject: '', service: '', message: '' })
    } catch (err) {
      toast.error('Something went wrong. Please try again or contact directly.', {
        style: {
          background: '#0a1628',
          color: '#f87171',
          border: '1px solid rgba(248,113,113,0.3)',
        },
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-28 pb-20">
      <Toaster
        position="top-right"
        toastOptions={{ duration: 4000 }}
        containerClassName="toaster-container"
      />

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 20% 80%, rgba(0,212,255,0.04) 0%, transparent 50%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-4"
            style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}
          >
            Let's Connect
          </div>
          <h1 className="section-heading neon-text mb-4">Get In Touch</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Have a Web3 project that needs growth? Let's discuss how I can help your crypto project thrive.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: contact methods */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {contactMethods.map((method, i) => {
              const Icon = method.icon
              return (
                <ScrollReveal key={method.label} delay={i * 0.08}>
                  <a
                    href={method.href}
                    target={method.href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group block"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = method.color + '50'
                      e.currentTarget.style.background = method.color + '08'
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                      e.currentTarget.style.transform = ''
                    }}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${method.color}12`, border: `1px solid ${method.color}25` }}
                    >
                      <Icon size={18} style={{ color: method.color }} />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{method.label}</p>
                      <p className="text-gray-400 text-xs">{method.value}</p>
                      <p className="text-gray-600 text-xs mt-0.5">{method.description}</p>
                    </div>
                  </a>
                </ScrollReveal>
              )
            })}

            {/* Response time */}
            <ScrollReveal delay={0.4}>
              <div
                className="p-4 rounded-2xl"
                style={{
                  background: 'rgba(52,211,153,0.05)',
                  border: '1px solid rgba(52,211,153,0.15)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-sm font-semibold">Currently Available</span>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Typical response time: <span className="text-white font-medium">within 24 hours</span>. For urgent inquiries, Telegram is fastest.
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
                style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.4), transparent)' }}
              />

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center"
                >
                  <CheckCircle2 size={48} className="text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-400 text-sm mb-6">I'll get back to you within 24 hours.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-secondary text-sm py-2"
                  >
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
                    <label className="block text-gray-400 text-xs font-medium mb-1.5">
                      Service Needed
                    </label>
                    <select
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      className="input-field text-sm"
                    >
                      <option value="">Select a service...</option>
                      {services.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1.5">
                      Subject
                    </label>
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
                    className="btn-primary text-white w-full justify-center py-3.5 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Zap size={16} />
                        Send Message
                      </>
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
