import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

export default function ConfirmDeposit() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState('')

  const handleConfirm = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem('horizon-auth'))
      const uid = auth?.id || auth?.user?.id
      const res = await fetch(`/api/users/${uid}/deposit/${orderId}/confirm`, {
        method: 'PUT'
      })
      if (res.ok) { setConfirmed(true) }
      else { const d = await res.json(); setError(d.error || 'Failed to confirm') }
    } catch { setError('Something went wrong') }
  }

  if (confirmed) {
    return (
      <div className="min-h-screen bg-horizon-50 dark:bg-midnight-950 flex items-center justify-center px-4">
        <div className="glass-card p-10 max-w-md mx-auto text-center animate-scale-in">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-2xl font-display font-bold text-midnight-900 dark:text-white mb-2">Deposit Reported</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Thank you! Your payment is being verified. We'll confirm your order once the transaction is detected on the blockchain.</p>
          <Link to="/orders" className="btn-primary text-sm">View Orders</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-horizon-50 dark:bg-midnight-950 flex items-center justify-center px-4 py-16 relative">
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="relative z-10 max-w-lg mx-auto text-center animate-fade-in">
        <div className="glass-card p-10">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
          </div>
          <h1 className="text-2xl font-display font-bold text-midnight-900 dark:text-white mb-2">Confirm Your Deposit</h1>
          <p className="text-xs text-gray-400 mb-2">Order: <span className="font-mono text-horizon-600 dark:text-horizon-400 font-medium">#{orderId?.slice(0, 8).toUpperCase()}</span></p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Please confirm that you have sent the exact amount to the provided wallet address. Your order will be processed after blockchain confirmation.</p>
          {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-2">{error}</p>}
          <div className="flex gap-3 justify-center">
            <button onClick={handleConfirm} disabled={confirmed} className="btn-primary">{confirmed ? 'Confirmed' : "I've Sent the Payment"}</button>
            <Link to="/orders" className="btn-outline">Cancel</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
