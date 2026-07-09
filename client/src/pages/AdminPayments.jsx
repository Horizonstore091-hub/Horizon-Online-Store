import { useState, useEffect } from 'react'
import AdminSidebar from '../components/AdminSidebar'

export default function AdminPayments() {
  const [methods, setMethods] = useState([])
  const [name, setName] = useState('')
  const [type, setType] = useState('card')
  const [cryptoPayments, setCryptoPayments] = useState([])

  useEffect(() => {
    fetch('/api/admin/payments').then(r => r.json()).then(setMethods).catch(() => {})
    fetch('/api/admin/crypto-payments').then(r => r.json()).then(setCryptoPayments).catch(() => {})
  }, [])

  const addMethod = e => {
    e.preventDefault()
    if (!name.trim()) return
    fetch('/api/admin/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type })
    }).then(r => r.json()).then(pm => { setMethods([...methods, pm]); setName('') }).catch(() => {})
  }

  const toggleMethod = (id, enabled) => {
    fetch(`/api/admin/payments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: !enabled })
    }).then(r => r.json()).then(updated => setMethods(methods.map(m => m.id === updated.id ? updated : m))).catch(() => {})
  }

  const deleteMethod = id => {
    fetch(`/api/admin/payments/${id}`, { method: 'DELETE' }).then(() => setMethods(methods.filter(m => m.id !== id))).catch(() => {})
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-midnight-950">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-midnight-900 dark:text-white mb-8">Payment Settings</h1>

        <div className="mb-10">
          <h2 className="text-sm font-semibold text-midnight-900 dark:text-white mb-4">Crypto Payments</h2>
          <div className="admin-card overflow-hidden !p-0">
            <table className="table-admin w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">User</th><th className="p-4 font-medium">Currency</th><th className="p-4 font-medium">Amount</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-midnight-800">
                {cryptoPayments.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-midnight-800/30 transition-colors">
                    <td className="p-4 text-midnight-900 dark:text-white">{c.userName || c.userEmail || 'Guest'}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{c.currency}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">${Number(c.amount).toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        c.status === 'approved' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                        c.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                        'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                      }`}>{c.status || 'pending'}</span>
                    </td>
                    <td className="p-4 text-gray-400 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {cryptoPayments.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-400">No crypto payments.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <form onSubmit={addMethod} className="admin-card mb-8">
          <h2 className="text-sm font-semibold text-midnight-900 dark:text-white mb-4">Add Payment Method</h2>
          <div className="flex gap-3 items-end flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field text-sm w-full" placeholder="Bitcoin" />
            </div>
            <div className="min-w-[120px]">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="input-field text-sm w-full">
                <option value="crypto">Crypto</option><option value="paypal">PayPal</option><option value="other">Other</option>
              </select>
            </div>
            <button type="submit" className="btn-primary text-sm">Add Method</button>
          </div>
        </form>

        <h2 className="text-sm font-semibold text-midnight-900 dark:text-white mb-4">Existing Methods</h2>
        <div className="admin-card overflow-hidden !p-0">
          <table className="table-admin w-full text-sm">
            <thead className="bg-gray-50 dark:bg-midnight-800/50">
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Name</th><th className="p-4 font-medium">Type</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-midnight-800">
              {methods.map(m => (
                <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-midnight-800/30 transition-colors">
                  <td className="p-4 text-midnight-900 dark:text-white">{m.name}</td>
                  <td className="p-4 text-gray-500 text-xs uppercase">{m.type.replace(/_/g, ' ')}</td>
                  <td className="p-4">
                    <button onClick={() => toggleMethod(m.id, m.enabled)} className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${m.enabled ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>{m.enabled ? 'Enabled' : 'Disabled'}</button>
                  </td>
                  <td className="p-4">
                    <button onClick={() => deleteMethod(m.id)} className="text-[10px] uppercase tracking-wider text-red-500 hover:text-red-700">Delete</button>
                  </td>
                </tr>
              ))}
              {methods.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-400">No payment methods.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}