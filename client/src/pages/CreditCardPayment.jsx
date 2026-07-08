import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

export default function CreditCardPayment() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    cardholderName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/orders/credit-cards/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, orderId })
      })
      if (res.ok) {
        setDone(true)
      } else {
        const data = await res.json()
        setError(data.error || 'Payment failed')
      }
    } catch { setError('Something went wrong') }
    setSubmitting(false)
  }

  if (done) {
    setTimeout(() => navigate('/orders'), 2000)
    return (
      <div className="min-h-screen bg-horizon-50 dark:bg-midnight-950 flex items-center justify-center px-4">
        <div className="glass-card p-10 max-w-md mx-auto text-center animate-scale-in">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-2xl font-display font-bold text-midnight-900 dark:text-white mb-2">Payment Successful</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Redirecting to your orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-horizon-50 dark:bg-midnight-950 py-16 relative">
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="relative z-10 max-w-lg mx-auto px-4">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-3xl font-display font-bold text-midnight-900 dark:text-white mb-2">Credit Card Payment</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Enter your credit card details to complete the payment.</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5 animate-slide-up">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Cardholder Name</label>
            <input name="cardholderName" value={form.cardholderName} onChange={handleChange} placeholder="John Doe" className="input-field" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Card Number</label>
            <input name="cardNumber" value={form.cardNumber} onChange={handleChange} placeholder="1234 5678 9012 3456" maxLength={19} className="input-field" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Expiry</label>
              <input name="expiry" value={form.expiry} onChange={handleChange} placeholder="MM/YY" maxLength={5} className="input-field" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">CVV</label>
              <input name="cvv" value={form.cvv} onChange={handleChange} placeholder="123" maxLength={4} className="input-field" required />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-2">{error}</p>
          )}

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Processing...' : 'Pay Now'}
          </button>

          <p className="text-xs text-gray-400 text-center">Your payment information is processed securely via SSL encryption.</p>
        </form>
      </div>
    </div>
  )
}
