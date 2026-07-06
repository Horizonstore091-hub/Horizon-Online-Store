import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function OrderHistory() {
  const { token, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return }
    fetch(`/api/users/${token}/orders`).then(r => r.json()).then(data => setOrders(data || [])).catch(() => {})
  }, [token, isLoggedIn, navigate])

  // Fallback: fetch all orders via admin if user orders endpoint doesn't return data
  useEffect(() => {
    if (orders.length === 0) {
      fetch('/api/admin/orders').then(r => r.json()).then(data => {
        if (Array.isArray(data)) setOrders(data.filter(o => o.userId === token))
      }).catch(() => {})
    }
  }, [token, orders.length])

  return (
    <div className="pt-24 md:pt-28">
      <div className="container-wide py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="section-subtitle">Account</p>
              <h1 className="section-title mt-1">Order History</h1>
            </div>
            <Link to="/profile" className="btn-outline text-xs">Profile</Link>
          </div>

          {orders.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-horizon-400 dark:text-horizon-500 text-sm mb-4">No orders yet.</p>
              <Link to="/shop" className="btn-primary">Start Shopping</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => {
                const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items
                return (
                  <div key={order.id} className="card p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm font-mono text-horizon-900 dark:text-horizon-100">#{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-xs text-horizon-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${
                        order.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                        order.status === 'shipped' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                        order.status === 'cancelled' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                        'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                      }`}>{order.status}</span>
                    </div>
                    <div className="text-xs text-horizon-500 dark:text-horizon-400 space-y-1">
                      {Array.isArray(items) && items.map((item, i) => (
                        <p key={i}>{item.name} x{item.quantity} — ${(item.price * item.quantity).toFixed(2)}</p>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-horizon-100 dark:border-horizon-700 flex justify-between items-center">
                      <span className="text-sm font-semibold text-horizon-900 dark:text-horizon-100">Total: ${Number(order.total).toFixed(2)}</span>
                      <span className="text-xs text-horizon-400">Shipping: {order.shippingMethod || 'standard'}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
