import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setMsg(''); setErr('')
    try {
      const res = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (!res.ok) { setErr(data.error); return }
      setMsg(data.message || 'If an account with that email exists, a reset link has been sent.')
    } catch { setErr('Network error') }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-horizon-50 dark:bg-horizon-950 px-4">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <h1 className="text-xl font-display font-bold text-horizon-900 dark:text-horizon-100 mb-2">Forgot Password</h1>
          <p className="text-sm text-horizon-400 mb-6">Enter your email to receive a reset link</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="input-field text-sm" required />
            {err && <p className="text-red-500 text-xs">{err}</p>}
            {msg && <p className="text-green-600 text-xs">{msg}</p>}
            <button type="submit" className="btn-primary w-full text-xs">Send Reset Link</button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/login" className="text-xs text-horizon-400 hover:text-horizon-900 dark:hover:text-horizon-100 uppercase tracking-wider">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
