import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetch('/api/admin/orders').then(r => r.json()).then(setOrders).catch(() => {})
  }, [])

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status })
      })
      if (res.ok) setOrders(orders.map(o => o.id === id ? { ...o, status } : o))
    } catch {}
  }

  return (
    <div className="min-h-screen bg-horizon-50 dark:bg-horizon-900">
      <AdminSidebar />
      <div className="admin-content">
        <h1 className="text-2xl font-display font-bold text-horizon-900 dark:text-horizon-100 mb-8">Orders</h1>
        <div className="bg-white dark:bg-horizon-800 overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-6 text-center text-horizon-400 text-sm">No orders yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-horizon-400 text-[10px] uppercase tracking-wider bg-horizon-50 dark:bg-horizon-700">
                  <th className="p-4 font-medium">Order</th>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Items</th>
                  <th className="p-4 font-medium">Total</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items
                  return (
                    <tr key={order.id} className="border-b border-horizon-50 dark:border-horizon-700 hover:bg-horizon-50/50 dark:hover:bg-horizon-700/50 transition-colors">
                      <td className="p-4 font-mono text-xs text-horizon-900 dark:text-horizon-100">#{order.id.slice(0, 8)}</td>
                      <td className="p-4 font-medium text-horizon-900 dark:text-horizon-100">{order.customerName}</td>
                      <td className="p-4 text-horizon-500 dark:text-horizon-300">{order.customerEmail}</td>
                      <td className="p-4 text-xs text-horizon-500">{Array.isArray(items) ? items.map(i => `${i.name} x${i.quantity}`).join(', ') : ''}</td>
                      <td className="p-4 font-medium text-horizon-900 dark:text-horizon-100">${Number(order.total).toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${
                          order.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                          order.status === 'shipped' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                          order.status === 'cancelled' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                          'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                        }`}>{order.status}</span>
                      </td>
                      <td className="p-4 text-horizon-400 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)} className="text-xs border border-horizon-200 dark:border-horizon-700 px-2 py-1 bg-white dark:bg-horizon-800 text-horizon-900 dark:text-horizon-100">
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

function AdminSidebar() {
  return (
    <div className="admin-sidebar">
      <Link to="/admin" className="font-display text-xl font-bold text-white mb-10 block">HORIZON</Link>
      <p className="text-[10px] uppercase tracking-wider text-horizon-400 mb-6">Admin Panel</p>
      <nav className="space-y-2">
        <Link to="/admin" className="block py-2.5 px-3 text-sm text-horizon-300 hover:text-white hover:bg-horizon-800 rounded transition-all">Dashboard</Link>
        <Link to="/admin/products" className="block py-2.5 px-3 text-sm text-horizon-300 hover:text-white hover:bg-horizon-800 rounded transition-all">Products</Link>
        <Link to="/admin/orders" className="block py-2.5 px-3 text-sm text-white bg-horizon-800 rounded">Orders</Link>
        <Link to="/admin/coupons" className="block py-2.5 px-3 text-sm text-horizon-300 hover:text-white hover:bg-horizon-800 rounded transition-all">Coupons</Link>
        <Link to="/admin/messages" className="block py-2.5 px-3 text-sm text-horizon-300 hover:text-white hover:bg-horizon-800 rounded transition-all">Messages</Link>
      </nav>
      <Link to="/" className="block mt-10 text-xs text-horizon-500 hover:text-horizon-300 uppercase tracking-wider">Back to Store</Link>
    </div>
  )
}
