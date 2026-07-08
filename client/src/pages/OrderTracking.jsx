import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function OrderTracking() {
  const [orderNumber, setOrderNumber] = useState('')
  const [order, setOrder] = useState(null)
  const [tracking, setTracking] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLookup = async (e) => {
    e.preventDefault()
    if (!orderNumber.trim()) return
    setLoading(true)
    setError('')
    setOrder(null)
    try {
      const res = await fetch(`/api/orders/lookup/${orderNumber.trim()}`)
      if (res.ok) {
        const data = await res.json()
        setOrder(data.order)
        setTracking(data.tracking)
      } else {
        setError('Order not found. Please check your order number.')
      }
    } catch { setError('Failed to look up order') }
    setLoading(false)
  }

  const statusColor = (s) => {
    const map = { delivered: 'badge-success', cancelled: 'badge-danger', refunded: 'badge-danger', pending: 'badge-warning', paid: 'badge-info', processing: 'badge-info', shipped: 'badge-info' }
    return map[s] || 'badge-info'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-midnight-950 py-16">
      <div className="max-w-lg mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-display font-bold text-midnight-900 dark:text-white mb-2">Track Your Order</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Enter your order number to see the latest status.</p>
        </div>

        <form onSubmit={handleLookup} className="glass-card p-8 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Order Number</label>
            <input type="text" value={orderNumber} onChange={e => setOrderNumber(e.target.value)} placeholder="e.g. HZN-ABCD1234" className="input-field w-full" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Looking up...' : 'Track Order'}</button>
          {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-2">{error}</p>}
        </form>

        {order && (
          <div className="mt-8 space-y-6 animate-fade-in">
            <div className="glass-card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Order #{order.orderNumber}</p>
                  <p className="text-sm text-midnight-900 dark:text-white font-medium mt-1">{order.customerName}</p>
                </div>
                <span className={statusColor(order.status)}>{order.status}</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <p>Total: <span className="font-semibold text-midnight-900 dark:text-white">${Number(order.total).toFixed(2)}</span></p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="text-sm font-semibold text-midnight-900 dark:text-white mb-4 uppercase tracking-wider">Tracking History</h2>
              <div className="space-y-4">
                {tracking.map((t, idx) => (
                  <div key={t.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-horizon-600' : 'bg-gray-300 dark:bg-midnight-600'}`} />
                      {idx < tracking.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 dark:bg-midnight-700" />}
                    </div>
                    <div className="pb-4">
                      <p className={`text-sm font-medium capitalize ${idx === 0 ? 'text-horizon-600 dark:text-horizon-400' : 'text-midnight-900 dark:text-white'}`}>{t.status}</p>
                      <p className="text-xs text-gray-400">{new Date(t.createdAt).toLocaleString()}</p>
                      {t.note && <p className="text-xs text-gray-500 mt-0.5">{t.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Link to="/" className="text-sm text-horizon-600 dark:text-horizon-400 hover:underline">Back to Home</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
