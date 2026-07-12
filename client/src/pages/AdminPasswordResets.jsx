import { useState, useEffect } from 'react'
import AdminSidebar from '../components/AdminSidebar'

export default function AdminPasswordResets() {
  const [requests, setRequests] = useState([])
  const [sending, setSending] = useState({})

  useEffect(() => {
    fetch('/api/admin/password-resets').then(r => r.json()).then(setRequests).catch(() => {})
  }, [])

  const sendPassword = async email => {
    setSending(s => ({ ...s, [email]: true }))
    try {
      await fetch('/api/admin/password-resets/send-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
    } catch {}
    setSending(s => ({ ...s, [email]: false }))
  }

  const markResolved = async id => {
    await fetch(`/api/admin/password-resets/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'resolved' })
    })
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'resolved' } : r))
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-midnight-950">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-midnight-900 dark:text-white mb-8">Password Reset Requests</h1>
        <div className="admin-card overflow-hidden !p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-midnight-800/50">
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">User</th><th className="p-4 font-medium">Email</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Date</th><th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-midnight-800">
              {requests.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-midnight-800/30 transition-colors">
                  <td className="p-4 text-midnight-900 dark:text-white">{r.userName || '—'}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{r.userEmail}</td>
                  <td className="p-4">
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      r.status === 'resolved'
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                        : r.status === 'pending'
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                    }`}>{r.status}</span>
                  </td>
                  <td className="p-4 text-gray-400 text-xs">{new Date(r.createdAt).toLocaleString()}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => sendPassword(r.userEmail)} disabled={sending[r.userEmail] || r.status === 'resolved'} className="btn-primary text-[10px] !py-1.5 !px-3 disabled:opacity-50">
                        {sending[r.userEmail] ? 'Sending...' : 'Send Password'}
                      </button>
                      {r.status === 'pending' && (
                        <button onClick={() => markResolved(r.id)} className="btn-outline text-[10px] !py-1.5 !px-3">Mark Resolved</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-gray-400 text-sm">No password reset requests yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
