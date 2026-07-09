import { useState, useEffect } from 'react'
import AdminSidebar from '../components/AdminSidebar'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    fetch('/api/contact').then(r => r.json()).then(setMessages).catch(() => {})
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-midnight-950">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-midnight-900 dark:text-white mb-8">Contact Messages</h1>
        <div className="admin-card overflow-hidden !p-0">
          {messages.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No messages yet.</div>
          ) : (
            <table className="table-admin w-full text-sm">
              <thead className="bg-gray-50 dark:bg-midnight-800/50">
                <tr className="text-left text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Name</th><th className="p-4 font-medium">Email</th><th className="p-4 font-medium">Subject</th><th className="p-4 font-medium">Message</th><th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-midnight-800">
                {messages.map(m => (
                  <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-midnight-800/30 transition-colors">
                    <td className="p-4 font-medium text-midnight-900 dark:text-white">{m.name}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{m.email}</td>
                    <td className="p-4 text-gray-500 text-xs">{m.subject || '--'}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300 text-xs max-w-xs truncate">{m.message}</td>
                    <td className="p-4 text-gray-400 text-xs">{new Date(m.createdAt).toLocaleDateString()}</td>
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
