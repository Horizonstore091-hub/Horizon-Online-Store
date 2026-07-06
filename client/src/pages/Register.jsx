import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', referralCode: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const passwordStrength = useMemo(() => {
    const p = form.password;
    if (!p) return { score: 0, label: '', color: 'bg-gray-200 dark:bg-gray-700' };
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^a-zA-Z0-9]/.test(p)) score++;
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-horizon-500', 'bg-emerald-500'];
    return { score: Math.min(score, 5), label: labels[score], color: colors[score] };
  }, [form.password]);

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.phone)
      if (form.referralCode) {
        const user = JSON.parse(localStorage.getItem('horizon-auth') || '{}')
        if (user?.id) {
          await fetch('/api/referrals/claim', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: form.referralCode, newUserId: user.id }) }).catch(() => {})
        }
      }
      navigate('/profile')
    } catch (err) {
      setError(err.message || 'Registration failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-horizon-50 dark:bg-midnight-950 relative overflow-hidden px-4 py-16">
      <div className="absolute inset-0 dot-pattern opacity-50" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-horizon-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-horizon-600/10 rounded-full blur-3xl" />
      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4"><Logo className="h-12" /></div>
          <h1 className="text-2xl font-display font-bold text-midnight-900 dark:text-white">Create Account</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Join the Horizon community</p>
        </div>
        <div className="glass-card p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Full name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" required className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Phone (optional)</label>
              <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 000-0000" className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Password</label>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 6 chars" required className="input-field" />
                {form.password && (
                  <div className="mt-2">
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`} style={{ width: `${(passwordStrength.score / 5) * 100}%` }} />
                    </div>
                    <p className={`text-[10px] mt-0.5 ${passwordStrength.score >= 4 ? 'text-emerald-600' : passwordStrength.score >= 3 ? 'text-horizon-600' : 'text-gray-400'}`}>
                      {passwordStrength.label} {passwordStrength.score >= 4 ? '- Strong password' : ''}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Confirm</label>
                <input type="password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} placeholder="Repeat" required className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Referral code (optional)</label>
              <input value={form.referralCode} onChange={e => setForm({ ...form, referralCode: e.target.value })} placeholder="HZNCODE" className="input-field" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50 mt-2 btn-pulse">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-midnight-800 text-center">
            <p className="text-sm text-gray-500">Already have an account? <Link to="/login" className="text-horizon-600 dark:text-horizon-400 font-medium hover:underline">Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}
