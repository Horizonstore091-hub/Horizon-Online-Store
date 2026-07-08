import { useState, useEffect } from 'react'
import AdminSidebar from '../components/AdminSidebar'

export default function AdminActivity() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/activity').then(r => r.json()).then(data => { setLogs(data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-midnight-950">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-midnight-900 dark:text-white mb-8">Activity Log</h1>
        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-horizon-600 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="admin-card overflow-hidden !p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-midnight-800/50">
                <tr><th className="text-left p-4 font-medium text-gray-500">User</th><th className="text-left p-4 font-medium text-gray-500">Action</th><th className="text-left p-4 font-medium text-gray-500">Details</th><th className="text-right p-4 font-medium text-gray-500">Date</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-midnight-800">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-midnight-800/30 transition-colors">
                    <td className="p-4 text-midnight-900 dark:text-white">{log.userName || 'Guest'}</td>
                    <td className="p-4"><span className="text-[10px] uppercase tracking-wider bg-gray-100 dark:bg-midnight-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">{log.action}</span></td>
                    <td className="p-4 text-gray-500 text-xs max-w-[300px] truncate">{log.details || '-'}</td>
                    <td className="p-4 text-right text-xs text-gray-400">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
                {logs.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-400">No activity logs yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
