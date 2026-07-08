import { useState, useEffect } from 'react'
import AdminSidebar from '../components/AdminSidebar'

export default function AdminNotifications() {
  const [notifs, setNotifs] = useState([])
  const [message, setMessage] = useState('')
  const [type, setType] = useState('info')
  const [badges, setBadges] = useState({})

  useEffect(() => {
    fetch('/api/admin/notifications/all').then(r => r.json()).then(setNotifs).catch(() => {})
    fetch('/api/admin/deposits?status=pending')
      .then(r => r.json())
      .then(data => setBadges(b => ({ ...b, Payments: data.length || 0 })))
      .catch(() => {})
    fetch('/api/admin/orders?status=pending')
      .then(r => r.json())
      .then(data => setBadges(b => ({ ...b, Orders: data.length || 0 })))
      .catch(() => {})
  }, [])

  const addNotif = e => {
    e.preventDefault()
    if (!message.trim()) return
    fetch('/api/admin/notifications', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, type })
    }).then(r => r.json()).then(n => { setNotifs([n, ...notifs]); setMessage('') }).catch(() => {})
  }

  const toggleNotif = (id, active) => {
    fetch(`/api/admin/notifications/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active })
    }).then(r => r.json()).then(updated => setNotifs(notifs.map(n => n.id === updated.id ? updated : n))).catch(() => {})
  }

  const deleteNotif = id => {
    fetch(`/api/admin/notifications/${id}`, { method: 'DELETE' }).then(() => setNotifs(notifs.filter(n => n.id !== id))).catch(() => {})
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-midnight-950">
      <AdminSidebar badges={badges} />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-midnight-900 dark:text-white mb-8">Notifications</h1>

        <form onSubmit={addNotif} className="flex gap-3 mb-8 items-end flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Message</label>
            <input type="text" value={message} onChange={e => setMessage(e.target.value)} className="input-field text-sm w-full" placeholder="Free shipping on all orders..." />
          </div>
          <div className="min-w-[120px]">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Type</label>
            <select value={type} onChange={e => setType(e.target.value)} className="input-field text-sm w-full">
              <option value="info">Info</option><option value="promo">Promo</option><option value="alert">Alert</option>
            </select>
          </div>
          <button type="submit" className="btn-primary text-sm !py-2">Add</button>
        </form>

        <div className="admin-card overflow-hidden !p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-midnight-800/50">
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Message</th><th className="p-4 font-medium">Type</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Date</th><th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-midnight-800">
              {notifs.map(n => (
                <tr key={n.id} className="hover:bg-gray-50 dark:hover:bg-midnight-800/30 transition-colors">
                  <td className="p-4 text-midnight-900 dark:text-white text-xs">{n.message}</td>
                  <td className="p-4 text-xs uppercase text-gray-500">{n.type}</td>
                  <td className="p-4">
                    <button onClick={() => toggleNotif(n.id, n.active)} className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${n.active ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>{n.active ? 'Active' : 'Inactive'}</button>
                  </td>
                  <td className="p-4 text-gray-400 text-xs">{new Date(n.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <button onClick={() => deleteNotif(n.id)} className="text-[10px] uppercase tracking-wider text-red-500 hover:text-red-700">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
