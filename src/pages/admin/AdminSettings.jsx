import { useState } from 'react'
import {
  Shield, Key, Loader2, CheckCircle2, ExternalLink, User,
  AlertTriangle, Database, Zap, Copy, Check, Info, LogOut
} from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

/* ── Copy button ─────────────────────────────────────────────────── */
function CopyText({ text }) {
  const [done, setDone] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => {})
    setDone(true)
    setTimeout(() => setDone(false), 1800)
  }
  return (
    <div className="flex items-center gap-2 mt-1 p-2.5 rounded-lg"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <code className="text-xs text-gray-300 flex-1 font-mono truncate">{text}</code>
      <button onClick={copy} className="text-gray-500 hover:text-gray-300 flex-shrink-0">
        {done ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
      </button>
    </div>
  )
}

/* ── Section card ────────────────────────────────────────────────── */
function Section({ icon: Icon, iconColor, title, subtitle, children }) {
  return (
    <div className="p-5 rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${iconColor}12`, border: `1px solid ${iconColor}25` }}>
          <Icon size={16} style={{ color: iconColor }} />
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">{title}</h3>
          {subtitle && <p className="text-gray-500 text-xs mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}

/* ── Page ────────────────────────────────────────────────────────── */
export default function AdminSettings() {
  const { user, signOut } = useAuth()
  const navigate          = useNavigate()

  const [newPw,   setNewPw]   = useState('')
  const [confPw,  setConfPw]  = useState('')
  const [pwLoad,  setPwLoad]  = useState(false)
  const [pwSaved, setPwSaved] = useState(false)

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (newPw !== confPw)  { toast.error("Passwords don't match"); return }
    if (newPw.length < 8)  { toast.error('Minimum 8 characters');  return }

    setPwLoad(true)
    const { error } = await supabase.auth.updateUser({ password: newPw })
    if (error) {
      toast.error(error.message || 'Password update failed')
    } else {
      toast.success('Password updated!')
      setPwSaved(true)
      setNewPw(''); setConfPw('')
      setTimeout(() => setPwSaved(false), 3000)
    }
    setPwLoad(false)
  }

  const handleSignOut = async () => {
    await signOut()
    toast.success('Signed out successfully')
    navigate('/admin')
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '(not configured)'

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-5">

        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <p className="text-gray-500 text-sm mt-0.5">Manage your account and deployment configuration</p>
        </div>

        {/* ── Account info ── */}
        <Section icon={User} iconColor="#00d4ff" title="Account Information" subtitle="Your Supabase admin profile">
          <div className="divide-y divide-white/[0.05]">
            {[
              { label: 'Email address', value: user?.email || '—'                          },
              { label: 'User ID',       value: user?.id?.slice(0, 18) + '…' || '—'        },
              { label: 'Role',          value: 'Administrator', badge: true                },
              { label: 'Auth provider', value: 'Supabase Email Auth'                       },
              { label: 'Session',       value: user ? 'Active' : 'None', green: !!user     },
            ].map(({ label, value, badge, green }) => (
              <div key={label} className="flex items-center justify-between py-3">
                <span className="text-gray-500 text-sm">{label}</span>
                {badge ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)' }}>
                    {value}
                  </span>
                ) : (
                  <span className="text-sm font-medium" style={{ color: green ? '#34d399' : '#e2e8f0' }}>
                    {value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* ── Change password ── */}
        <Section icon={Key} iconColor="#7c3aed" title="Change Password" subtitle="Update your admin account password">
          <form onSubmit={handlePasswordChange} className="space-y-3">
            <div>
              <label className="block text-gray-500 text-xs mb-1.5">New Password <span className="text-red-400">*</span></label>
              <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
                className="input-field text-sm" placeholder="Min. 8 characters" required minLength={8} />
              {newPw.length > 0 && (
                <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full transition-all duration-300" style={{
                    width: `${Math.min((newPw.length / 16) * 100, 100)}%`,
                    background: newPw.length < 8 ? '#f87171' : newPw.length < 12 ? '#fb923c' : '#34d399',
                  }} />
                </div>
              )}
            </div>
            <div>
              <label className="block text-gray-500 text-xs mb-1.5">Confirm Password <span className="text-red-400">*</span></label>
              <input type="password" value={confPw} onChange={e => setConfPw(e.target.value)}
                className="input-field text-sm" placeholder="Repeat new password" required />
              {confPw.length > 0 && newPw !== confPw && (
                <p className="text-red-400 text-xs mt-1">Passwords don't match</p>
              )}
            </div>
            <button type="submit" disabled={pwLoad}
              className="btn-primary text-white w-full justify-center py-2.5 text-sm">
              {pwLoad  ? <><Loader2 size={14} className="animate-spin" /> Updating…</>      :
               pwSaved ? <><CheckCircle2 size={14} /> Password Updated!</>                   :
                         <><Key size={14} /> Update Password</>}
            </button>
          </form>
        </Section>

        {/* ── Supabase config ── */}
        <Section icon={Database} iconColor="#3ecf8e" title="Supabase Configuration" subtitle="Your backend connection — supabase.com">
          <div className="space-y-4">
            <div>
              <p className="text-gray-500 text-xs mb-1">Project URL</p>
              <CopyText text={supabaseUrl} />
            </div>

            <div className="flex items-start gap-2.5 p-3.5 rounded-xl"
              style={{ background: 'rgba(62,207,142,0.05)', border: '1px solid rgba(62,207,142,0.15)' }}>
              <Info size={13} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-gray-400 leading-relaxed space-y-1">
                <p className="font-medium text-emerald-400">Supabase Setup Checklist</p>
                {[
                  'Create a project at supabase.com',
                  'Run src/lib/supabaseSchema.sql in the SQL editor',
                  'Go to Authentication → Users → Add user',
                  'Add VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY to .env',
                  'Redeploy on Vercel with env vars set',
                ].map((step, i) => (
                  <p key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-mono flex-shrink-0">{i + 1}.</span> {step}
                  </p>
                ))}
              </div>
            </div>

            <a href="https://supabase.com" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-emerald-400 hover:underline">
              Open Supabase Dashboard <ExternalLink size={10} />
            </a>
          </div>
        </Section>

        {/* ── Env vars ── */}
        <Section icon={Zap} iconColor="#34d399" title="Environment Variables" subtitle="Add these to .env and Vercel dashboard">
          <div className="space-y-2">
            {[
              { key: 'VITE_SUPABASE_URL',      desc: 'Your Supabase project URL'          },
              { key: 'VITE_SUPABASE_ANON_KEY', desc: 'Your Supabase anon / public API key' },
            ].map(({ key, desc }) => (
              <div key={key} className="p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <code className="text-cyan-400 text-xs font-mono">{key}</code>
                <p className="text-gray-600 text-xs mt-0.5">{desc}</p>
              </div>
            ))}
            <a href="https://vercel.com/docs/environment-variables" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-green-400 hover:underline pt-1">
              Vercel env vars docs <ExternalLink size={10} />
            </a>
          </div>
        </Section>

        {/* ── Danger zone ── */}
        <Section icon={AlertTriangle} iconColor="#f87171" title="Danger Zone" subtitle="Irreversible actions — proceed with caution">
          <div className="space-y-3">
            <button onClick={handleSignOut}
              className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium"
              style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.12)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.06)' }}>
              <LogOut size={15} /> Sign Out of Admin
            </button>

            <div className="p-4 rounded-xl"
              style={{ background: 'rgba(248,113,113,0.04)', border: '1px dashed rgba(248,113,113,0.2)' }}>
              <p className="text-gray-500 text-xs">
                To delete the admin account go to{' '}
                <a href="https://supabase.com" target="_blank" rel="noopener noreferrer"
                  className="text-red-400 hover:underline">
                  Supabase → Authentication → Users
                </a>{' '}
                and remove the user manually.
              </p>
            </div>
          </div>
        </Section>

      </div>
    </AdminLayout>
  )
}
