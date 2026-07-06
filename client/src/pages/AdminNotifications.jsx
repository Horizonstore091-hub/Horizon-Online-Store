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
    <div className="min-h-screen bg-horizon-50 dark:bg-horizon-900">
      <AdminSidebar badges={badges} />
      <div className="admin-content">
        <h1 className="text-2xl font-display font-bold text-horizon-900 dark:text-horizon-100 mb-8">Notifications</h1>

        <form onSubmit={addNotif} className="flex gap-3 mb-8 items-end">
          <div className="flex-1">
            <label className="text-[10px] uppercase tracking-wider text-horizon-400 font-medium">Message</label>
            <input type="text" value={message} onChange={e => setMessage(e.target.value)} className="input-field text-sm mt-1" placeholder="Free shipping on all orders..." />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-horizon-400 font-medium">Type</label>
            <select value={type} onChange={e => setType(e.target.value)} className="input-field text-sm mt-1">
              <option value="info">Info</option><option value="promo">Promo</option><option value="alert">Alert</option>
            </select>
          </div>
          <button type="submit" className="btn-primary text-xs">Add</button>
        </form>

        <div className="bg-white dark:bg-horizon-800 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-horizon-400 text-[10px] uppercase tracking-wider border-b border-horizon-100 dark:border-horizon-700">
                <th className="p-4 font-medium">Message</th><th className="p-4 font-medium">Type</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Date</th><th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notifs.map(n => (
                <tr key={n.id} className="border-b border-horizon-50 dark:border-horizon-800">
                  <td className="p-4 text-horizon-900 dark:text-horizon-100 text-xs">{n.message}</td>
                  <td className="p-4 text-horizon-600 text-xs uppercase">{n.type}</td>
                  <td className="p-4">
                    <button onClick={() => toggleNotif(n.id, n.active)} className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${n.active ? 'bg-green-100 dark:bg-green-900/30 text-green-700' : 'bg-red-100 dark:bg-red-900/30 text-red-700'}`}>{n.active ? 'Active' : 'Inactive'}</button>
                  </td>
                  <td className="p-4 text-horizon-400 text-xs">{new Date(n.createdAt).toLocaleDateString()}</td>
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
