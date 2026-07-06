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
    <div className="min-h-screen bg-horizon-50 dark:bg-horizon-900">
      <AdminSidebar />
      <div className="admin-content">
        <h1 className="text-2xl font-display font-bold text-horizon-900 dark:text-horizon-100 mb-8">Customer Reviews</h1>
        <div className="bg-white dark:bg-horizon-800 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-horizon-400 text-[10px] uppercase tracking-wider border-b border-horizon-100 dark:border-horizon-700">
                <th className="p-4 font-medium">User</th><th className="p-4 font-medium">Rating</th><th className="p-4 font-medium">Text</th><th className="p-4 font-medium">Product</th><th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(r => (
                <tr key={r.id} className="border-b border-horizon-50 dark:border-horizon-800">
                  <td className="p-4 text-horizon-900 dark:text-horizon-100">{r.userName}</td>
                  <td className="p-4">
                    <select value={r.rating} onChange={e => updateRating(r.id, e.target.value)} className="text-sm border border-horizon-200 dark:border-horizon-700 bg-white dark:bg-horizon-800 px-2 py-1">
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>)}
                    </select>
                  </td>
                  <td className="p-4 text-horizon-600 dark:text-horizon-300 text-xs max-w-xs">
                    <input defaultValue={r.text} onBlur={e => updateText(r.id, e.target.value)} className="input-field text-xs w-full" />
                  </td>
                  <td className="p-4 text-xs text-horizon-400">{r.product || '--'}</td>
                  <td className="p-4">
                    <button onClick={() => deleteReview(r.id)} className="text-[10px] uppercase tracking-wider text-red-500 hover:text-red-700">Delete</button>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-horizon-400">No reviews yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
