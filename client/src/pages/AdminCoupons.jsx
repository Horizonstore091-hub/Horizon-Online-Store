import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

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
    <div className="min-h-screen bg-horizon-50 dark:bg-horizon-900">
      <AdminSidebar />
      <div className="admin-content max-w-4xl">
        <h1 className="text-2xl font-display font-bold text-horizon-900 dark:text-horizon-100 mb-8">Coupons</h1>

        <div className="bg-white dark:bg-horizon-800 p-6 mb-8">
          <h2 className="text-sm font-semibold text-horizon-900 dark:text-horizon-100 uppercase tracking-wider mb-4">Create Coupon</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-3 gap-3">
            <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="Code" required className="input-field text-xs" />
            <input value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} placeholder="Discount" type="number" step="0.01" required className="input-field text-xs" />
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="input-field text-xs">
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed ($)</option>
            </select>
            <input value={form.minOrder} onChange={e => setForm({ ...form, minOrder: e.target.value })} placeholder="Min order" type="number" className="input-field text-xs" />
            <input value={form.usageLimit} onChange={e => setForm({ ...form, usageLimit: e.target.value })} placeholder="Usage limit" type="number" className="input-field text-xs" />
            <input value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })} type="date" className="input-field text-xs" />
            <button type="submit" className="btn-primary text-xs col-span-3">Create Coupon</button>
          </form>
        </div>

        <div className="bg-white dark:bg-horizon-800 overflow-hidden">
          {coupons.length === 0 ? (
            <div className="p-6 text-center text-horizon-400 text-sm">No coupons yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-horizon-400 text-[10px] uppercase tracking-wider bg-horizon-50 dark:bg-horizon-700">
                  <th className="p-4 font-medium">Code</th>
                  <th className="p-4 font-medium">Discount</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Min Order</th>
                  <th className="p-4 font-medium">Used</th>
                  <th className="p-4 font-medium">Expires</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map(c => (
                  <tr key={c.id} className="border-b border-horizon-50 dark:border-horizon-700">
                    <td className="p-4 font-mono text-sm text-horizon-900 dark:text-horizon-100">{c.code}</td>
                    <td className="p-4 font-medium text-horizon-900 dark:text-horizon-100">{c.type === 'percentage' ? `${c.discount}%` : `$${c.discount}`}</td>
                    <td className="p-4 text-xs text-horizon-500">{c.type}</td>
                    <td className="p-4 text-horizon-500">${Number(c.minOrder).toFixed(2)}</td>
                    <td className="p-4 text-horizon-500">{c.usedCount}/{c.usageLimit || 'unlimited'}</td>
                    <td className="p-4 text-xs text-horizon-500">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : 'Never'}</td>
                    <td className="p-4">
                      <button onClick={() => handleDelete(c.id)} className="text-xs text-red-400 hover:text-red-600 uppercase tracking-wider">Delete</button>
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

function AdminSidebar() {
  return (
    <div className="admin-sidebar">
      <Link to="/admin" className="font-display text-xl font-bold text-white mb-10 block">HORIZON</Link>
      <p className="text-[10px] uppercase tracking-wider text-horizon-400 mb-6">Admin Panel</p>
      <nav className="space-y-2">
        <Link to="/admin" className="block py-2.5 px-3 text-sm text-horizon-300 hover:text-white hover:bg-horizon-800 rounded">Dashboard</Link>
        <Link to="/admin/products" className="block py-2.5 px-3 text-sm text-horizon-300 hover:text-white hover:bg-horizon-800 rounded">Products</Link>
        <Link to="/admin/orders" className="block py-2.5 px-3 text-sm text-horizon-300 hover:text-white hover:bg-horizon-800 rounded">Orders</Link>
        <Link to="/admin/coupons" className="block py-2.5 px-3 text-sm text-white bg-horizon-800 rounded">Coupons</Link>
        <Link to="/admin/messages" className="block py-2.5 px-3 text-sm text-horizon-300 hover:text-white hover:bg-horizon-800 rounded">Messages</Link>
      </nav>
      <Link to="/" className="block mt-10 text-xs text-horizon-500 hover:text-horizon-300 uppercase tracking-wider">Back to Store</Link>
    </div>
  )
}
