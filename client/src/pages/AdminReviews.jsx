import { useState, useEffect } from 'react'
import AdminSidebar from '../components/AdminSidebar'

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    fetch('/api/reviews').then(r => r.json()).then(setReviews).catch(() => {})
  }, [])

  const updateRating = (id, rating) => {
    fetch(`/api/admin/reviews/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: Math.max(1, Math.min(5, parseInt(rating))) })
    }).then(r => r.json()).then(updated => setReviews(reviews.map(r => r.id === updated.id ? updated : r))).catch(() => {})
  }

  const updateText = (id, text) => {
    fetch(`/api/admin/reviews/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    }).then(r => r.json()).then(updated => setReviews(reviews.map(r => r.id === updated.id ? updated : r))).catch(() => {})
  }

  const deleteReview = id => {
    if (!confirm('Delete this review?')) return
    fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' }).then(() => setReviews(reviews.filter(r => r.id !== id))).catch(() => {})
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-midnight-950">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-midnight-900 dark:text-white mb-8">Customer Reviews</h1>
        <div className="admin-card overflow-hidden !p-0">
          <table className="table-admin w-full text-sm">
            <thead className="bg-gray-50 dark:bg-midnight-800/50">
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">User</th><th className="p-4 font-medium">Rating</th><th className="p-4 font-medium">Text</th><th className="p-4 font-medium">Product</th><th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-midnight-800">
              {reviews.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-midnight-800/30 transition-colors">
                  <td className="p-4 text-midnight-900 dark:text-white">{r.userName}</td>
                  <td className="p-4">
                    <select value={r.rating} onChange={e => updateRating(r.id, e.target.value)} className="text-sm border border-gray-200 dark:border-midnight-700 bg-white dark:bg-midnight-900 px-2 py-1 rounded text-midnight-900 dark:text-white">
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>)}
                    </select>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300 text-xs max-w-xs">
                    <input defaultValue={r.text} onBlur={e => updateText(r.id, e.target.value)} className="input-field text-xs w-full" />
                  </td>
                  <td className="p-4 text-xs text-gray-400">{r.product || '--'}</td>
                  <td className="p-4">
                    <button onClick={() => deleteReview(r.id)} className="text-[10px] uppercase tracking-wider text-red-500 hover:text-red-700">Delete</button>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-400">No reviews yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
