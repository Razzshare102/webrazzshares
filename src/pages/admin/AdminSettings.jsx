import { useState } from 'react'
import { Shield, Key, Loader2, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function AdminSettings() {
  const { user } = useAuth()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match")
      return
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) toast.error(error.message)
    else {
      toast.success('Password updated successfully!')
      setNewPassword('')
      setConfirmPassword('')
    }
    setLoading(false)
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <p className="text-gray-500 text-sm">Manage your admin account settings</p>
        </div>

        <div className="space-y-5">
          {/* Account Info */}
          <div className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Shield size={16} className="text-cyan-400" />
              <h3 className="text-white font-semibold">Account Information</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-gray-400 text-sm">Email</span>
                <span className="text-white text-sm">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-gray-400 text-sm">Role</span>
                <span className="px-2 py-0.5 rounded-md text-xs" style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)' }}>
                  Administrator
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-400 text-sm">Auth Provider</span>
                <span className="text-gray-300 text-sm">Supabase</span>
              </div>
            </div>
          </div>

          {/* Change password */}
          <div className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Key size={16} className="text-purple-400" />
              <h3 className="text-white font-semibold">Change Password</h3>
            </div>
            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div>
                <label className="block text-gray-400 text-xs mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="input-field text-sm"
                  placeholder="Minimum 8 characters"
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="input-field text-sm"
                  placeholder="Repeat password"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary text-white text-sm py-2.5 w-full justify-center">
                {loading ? <><Loader2 size={14} className="animate-spin" /> Updating...</> : <><Key size={14} /> Update Password</>}
              </button>
            </form>
          </div>

          {/* Supabase setup info */}
          <div
            className="p-5 rounded-2xl"
            style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.12)' }}
          >
            <h3 className="text-cyan-400 font-semibold text-sm mb-3 flex items-center gap-2">
              <AlertCircle size={15} /> Supabase Setup Required
            </h3>
            <div className="space-y-2 text-gray-400 text-xs leading-relaxed">
              <p>To fully activate the admin dashboard:</p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Create a Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline inline-flex items-center gap-0.5">supabase.com <ExternalLink size={9} /></a></li>
                <li>Run the SQL schema from <code className="bg-white/5 px-1 rounded">src/lib/supabaseSchema.sql</code></li>
                <li>Add your project URL and anon key to <code className="bg-white/5 px-1 rounded">.env</code></li>
                <li>Create a user in Supabase Auth with the admin email/password</li>
                <li>Redeploy to Vercel with the environment variables set</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
