import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([])
  const [form, setForm] = useState({ code: '', discount: '', type: 'percentage', minOrder: '0', usageLimit: '0', expiresAt: '' })

  useEffect(() => {
    fetch('/api/coupons').then(r => r.json()).then(setCoupons).catch(() => {})
  }, [])

  const handleCreate = async e => {
    e.preventDefault()
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
      })
      if (res.ok) {
        const coupon = await res.json()
        setCoupons([coupon, ...coupons])
        setForm({ code: '', discount: '', type: 'percentage', minOrder: '0', usageLimit: '0', expiresAt: '' })
      }
    } catch {}
  }

  const handleDelete = async id => {
    if (!window.confirm('Delete this coupon?')) return
    try {
      await fetch(`/api/coupons/${id}`, { method: 'DELETE' })
      setCoupons(coupons.filter(c => c.id !== id))
    } catch {}
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-midnight-950">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-midnight-900 dark:text-white mb-8">Coupons</h1>

        <form onSubmit={handleCreate} className="admin-card mb-8">
          <h2 className="text-sm font-semibold text-midnight-900 dark:text-white mb-4 uppercase tracking-wider">Create Coupon</h2>
          <div className="grid md:grid-cols-3 gap-3">
            <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="Code" required className="input-field text-sm" />
            <input value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} placeholder="Discount" type="number" step="0.01" required className="input-field text-sm" />
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="input-field text-sm">
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed ($)</option>
            </select>
            <input value={form.minOrder} onChange={e => setForm({ ...form, minOrder: e.target.value })} placeholder="Min order" type="number" className="input-field text-sm" />
            <input value={form.usageLimit} onChange={e => setForm({ ...form, usageLimit: e.target.value })} placeholder="Usage limit" type="number" className="input-field text-sm" />
            <input value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })} type="date" className="input-field text-sm" />
          </div>
          <button type="submit" className="btn-primary text-sm mt-4">Create Coupon</button>
        </form>

        <div className="admin-card overflow-hidden !p-0">
          {coupons.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No coupons yet.</div>
          ) : (
            <table className="table-admin w-full text-sm">
              <thead className="bg-gray-50 dark:bg-midnight-800/50">
                <tr className="text-left text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Code</th><th className="p-4 font-medium">Discount</th><th className="p-4 font-medium">Type</th><th className="p-4 font-medium">Min Order</th><th className="p-4 font-medium">Used</th><th className="p-4 font-medium">Expires</th><th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-midnight-800">
                {coupons.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-midnight-800/30 transition-colors">
                    <td className="p-4 font-mono text-sm text-midnight-900 dark:text-white">{c.code}</td>
                    <td className="p-4 font-medium text-midnight-900 dark:text-white">{c.type === 'percentage' ? `${c.discount}%` : `$${c.discount}`}</td>
                    <td className="p-4 text-xs text-gray-500">{c.type}</td>
                    <td className="p-4 text-gray-500">${Number(c.minOrder).toFixed(2)}</td>
                    <td className="p-4 text-gray-500">{c.usedCount}/{c.usageLimit || 'unlimited'}</td>
                    <td className="p-4 text-xs text-gray-500">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : 'Never'}</td>
                    <td className="p-4">
                      <button onClick={() => handleDelete(c.id)} className="text-xs text-red-500 hover:text-red-700 uppercase tracking-wider">Delete</button>
                    </td>
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

