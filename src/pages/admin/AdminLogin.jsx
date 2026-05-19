import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn, AlertCircle, Loader2, Shield, Zap, Lock } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) {
      setError('Invalid email or password. Please try again.')
    } else {
      navigate('/admin/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ background: '#020408' }}>
      {/* Background orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #00d4ff 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] rounded-full opacity-8 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #7c3aed 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full opacity-6 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #f472b6 0%, transparent 70%)', filter: 'blur(80px)' }} />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo + brand */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5, ease: 'backOut' }}
            className="inline-block"
          >
            <div className="relative inline-flex items-center justify-center">
              <div className="absolute inset-0 rounded-2xl blur-xl opacity-60"
                style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }} />
              <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-display font-black"
                style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', boxShadow: '0 0 40px rgba(0,212,255,0.4)' }}>
                R
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <h1 className="text-2xl font-display font-bold neon-text mt-4">RazzShares</h1>
            <p className="text-gray-500 text-sm mt-1">Admin Control Panel</p>
          </motion.div>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.09)',
            backdropFilter: 'blur(24px)',
          }}
        >
          {/* Top glow line */}
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.6), rgba(124,58,237,0.5), transparent)' }} />

          <div className="p-8">
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
                <Shield size={15} className="text-cyan-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-sm">Secure Admin Access</h2>
                <p className="text-gray-600 text-xs">Protected by Supabase Auth</p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="flex items-start gap-2.5 p-3.5 rounded-xl mb-5 text-sm"
                style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', color: '#f87171' }}
              >
                <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="razzshares@gmail.com"
                  className="input-field text-sm"
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-medium mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="input-field text-sm pr-11"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300"
                    tabIndex={-1}
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary text-white w-full justify-center py-3.5 text-sm mt-2"
                style={{ opacity: loading ? 0.8 : 1 }}
              >
                {loading
                  ? <><Loader2 size={15} className="animate-spin" /> Authenticating...</>
                  : <><Lock size={15} /> Sign In to Dashboard</>
                }
              </button>
            </form>

            {/* Security badges */}
            <div className="flex items-center justify-center gap-4 mt-5 pt-5 border-t border-white/5">
              {[
                { icon: Shield, label: 'JWT Secured' },
                { icon: Lock,   label: 'Encrypted' },
                { icon: Zap,    label: 'Supabase Auth' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1 text-gray-700 text-xs">
                  <Icon size={10} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <p className="text-center text-gray-700 text-xs mt-5">
          <a href="/" className="hover:text-gray-400 transition-colors">← Return to public site</a>
        </p>
      </motion.div>
    </div>
  )
}
