import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [err, setErr] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setErr('')
    if (password !== confirm) { setErr('Passwords do not match'); return }
    try {
      const res = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      })
      const data = await res.json()
      if (!res.ok) { setErr(data.error); return }
      navigate('/login')
    } catch { setErr('Network error') }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-horizon-50 dark:bg-horizon-950 px-4">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <h1 className="text-xl font-display font-bold text-horizon-900 dark:text-horizon-100 mb-6">Reset Password</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="New password" className="input-field text-sm" required />
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirm password" className="input-field text-sm" required />
            {err && <p className="text-red-500 text-xs">{err}</p>}
            <button type="submit" className="btn-primary w-full text-xs">Reset Password</button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/login" className="text-xs text-horizon-400 hover:text-horizon-900 dark:hover:text-horizon-100 uppercase tracking-wider">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
