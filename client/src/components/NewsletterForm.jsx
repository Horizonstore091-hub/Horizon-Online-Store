import { useState } from 'react'

export default function NewsletterForm({ source = 'website' }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  const handleSubmit = async e => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source })
      })
      if (res.ok) setStatus('success')
      else setStatus('error')
    } catch { setStatus('error') }
  }

  if (status === 'success') return <p className="text-sm text-emerald-600">Thanks for subscribing!</p>

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" required className="input-field text-sm flex-1" />
      <button type="submit" disabled={status === 'loading'} className="btn-primary text-sm !py-2 !px-4">
        {status === 'loading' ? '...' : 'Subscribe'}
      </button>
      {status === 'error' && <p className="text-xs text-red-500">Something went wrong</p>}
    </form>
  )
}
