import { useState, useEffect } from 'react'
import AdminSidebar from '../components/AdminSidebar'

export default function AdminAbandonedCarts() {
  const [carts, setCarts] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetch('/api/abandoned-carts').then(r => r.json()).then(setCarts).catch(() => {})
  }, [])

  const sendReminder = async (id) => {
    try {
      const res = await fetch(`/api/abandoned-carts/${id}/send-reminder`, { method: 'POST' })
      if (res.ok) { setCarts(carts.map(c => c.id === id ? { ...c, reminderSent: (c.reminderSent || 0) + 1 } : c)); alert('Reminder sent!') }
    } catch { alert('Failed') }
  }

  const filtered = filter === 'all' ? carts : carts.filter(c => c.status === filter)

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-midnight-950">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-midnight-900 dark:text-white">Abandoned Carts</h1>
            <p className="text-sm text-gray-500 mt-1">{carts.filter(c => c.status === 'active').length} active abandoned carts</p>
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'recovered'].map(s => (
              <button key={s} onClick={() => setFilter(s)} className={`text-xs px-3 py-1.5 rounded ${filter === s ? 'bg-horizon-600 text-white' : 'bg-gray-100 dark:bg-midnight-800 text-gray-600 dark:text-gray-400'}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="admin-card overflow-hidden !p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100 dark:border-midnight-800">
                <th className="p-4 font-medium">User</th><th className="p-4 font-medium">Email</th><th className="p-4 font-medium">Items</th><th className="p-4 font-medium">Subtotal</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Reminders</th><th className="p-4 font-medium">Updated</th><th className="p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b border-gray-50 dark:border-midnight-800/50 hover:bg-gray-50 dark:hover:bg-midnight-800/30">
                  <td className="p-4 text-midnight-900 dark:text-white">{c.userName || c.userId || 'Guest'}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{c.email || c.userEmail || '-'}</td>
                  <td className="p-4 text-gray-600">{Array.isArray(c.items) ? c.items.length : (typeof c.items === 'string' ? JSON.parse(c.items||'[]').length : 0)}</td>
                  <td className="p-4 font-medium">${Number(c.subtotal).toFixed(2)}</td>
                  <td className="p-4"><span className={`text-[10px] uppercase px-2 py-0.5 ${c.status === 'active' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{c.status}</span></td>
                  <td className="p-4 text-gray-500">{c.reminderSent || 0}</td>
                  <td className="p-4 text-gray-400 text-xs">{new Date(c.updatedAt || c.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    {c.status === 'active' && <button onClick={() => sendReminder(c.id)} className="text-[10px] uppercase text-horizon-600 hover:underline">Send Reminder</button>}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-gray-400">No carts found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
