import { useState, useEffect } from 'react'
import AdminSidebar from '../components/AdminSidebar'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    fetch('/api/contact').then(r => r.json()).then(setMessages).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-horizon-50 dark:bg-horizon-900">
      <AdminSidebar />
      <div className="admin-content">
        <h1 className="text-2xl font-display font-bold text-horizon-900 dark:text-horizon-100 mb-8">Contact Messages</h1>
        <div className="bg-white dark:bg-horizon-800 overflow-hidden">
          {messages.length === 0 ? (
            <div className="p-6 text-center text-horizon-400 text-sm">No messages yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-horizon-400 text-[10px] uppercase tracking-wider bg-horizon-50 dark:bg-horizon-700">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Subject</th>
                  <th className="p-4 font-medium">Message</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {messages.map(m => (
                  <tr key={m.id} className="border-b border-horizon-50 dark:border-horizon-700">
                    <td className="p-4 font-medium text-horizon-900 dark:text-horizon-100">{m.name}</td>
                    <td className="p-4 text-horizon-500">{m.email}</td>
                    <td className="p-4 text-horizon-500 text-xs">{m.subject || '--'}</td>
                    <td className="p-4 text-horizon-600 dark:text-horizon-300 text-xs max-w-xs truncate">{m.message}</td>
                    <td className="p-4 text-horizon-400 text-xs">{new Date(m.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
