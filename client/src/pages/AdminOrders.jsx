import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'

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
    <div className="flex min-h-screen bg-gray-50 dark:bg-midnight-950">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-midnight-900 dark:text-white mb-8">Orders</h1>
        <div className="admin-card overflow-hidden !p-0">
          {orders.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No orders yet.</div>
          ) : (
            <table className="table-admin w-full text-sm">
              <thead className="bg-gray-50 dark:bg-midnight-800/50">
                <tr className="text-left text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Order</th><th className="p-4 font-medium">Customer</th><th className="p-4 font-medium">Email</th><th className="p-4 font-medium">Items</th><th className="p-4 font-medium">Total</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Date</th><th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-midnight-800">
                {orders.map(order => {
                  let items = order.items; try { if (typeof items === 'string') items = JSON.parse(items) } catch { items = [] }
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-midnight-800/30 transition-colors">
                      <td className="p-4 font-mono text-xs text-midnight-900 dark:text-white">#{order.id.slice(0, 8)}</td>
                      <td className="p-4 font-medium text-midnight-900 dark:text-white">{order.customerName}</td>
                      <td className="p-4 text-gray-500 dark:text-gray-400">{order.customerEmail}</td>
                      <td className="p-4 text-xs text-gray-500">{Array.isArray(items) ? items.map(i => `${i.name} x${i.quantity}`).join(', ') : ''}</td>
                      <td className="p-4 font-medium text-midnight-900 dark:text-white">${Number(order.total).toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          order.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                          order.status === 'shipped' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                          order.status === 'cancelled' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                          'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                        }`}>{order.status}</span>
                      </td>
                      <td className="p-4 text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)} className="text-xs border border-gray-200 dark:border-midnight-700 px-2 py-1 bg-white dark:bg-midnight-900 text-midnight-900 dark:text-white rounded">
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

