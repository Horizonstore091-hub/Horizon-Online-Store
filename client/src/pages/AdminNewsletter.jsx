import { useState, useEffect } from 'react'
import AdminSidebar from '../components/AdminSidebar'

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([])

  useEffect(() => {
    fetch('/api/newsletter').then(r => r.json()).then(setSubscribers).catch(() => {})
  }, [])

  const active = subscribers.filter(s => s.subscribed)
  const total = subscribers.length

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-midnight-950">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-midnight-900 dark:text-white">Newsletter Subscribers</h1>
            <p className="text-sm text-gray-500 mt-1">{active.length} active / {total} total</p>
          </div>
        </div>

        <div className="admin-card overflow-hidden !p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100 dark:border-midnight-800">
                <th className="p-4 font-medium">Email</th><th className="p-4 font-medium">Name</th><th className="p-4 font-medium">Source</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map(s => (
                <tr key={s.id} className="border-b border-gray-50 dark:border-midnight-800/50">
                  <td className="p-4 text-midnight-900 dark:text-white">{s.email}</td>
                  <td className="p-4 text-gray-600">{s.name || '-'}</td>
                  <td className="p-4 text-gray-500 text-xs uppercase">{s.source}</td>
                  <td className="p-4">{s.subscribed ? <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 uppercase">Active</span> : <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 uppercase">Unsubscribed</span>}</td>
                  <td className="p-4 text-gray-400 text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {subscribers.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-400">No subscribers yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
