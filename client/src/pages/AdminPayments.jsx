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
    <div className="min-h-screen bg-horizon-50 dark:bg-horizon-900">
      <AdminSidebar />
      <div className="admin-content">
        <h1 className="text-2xl font-display font-bold text-horizon-900 dark:text-horizon-100 mb-8">Payment Settings</h1>

        <div className="mb-10">
          <h2 className="text-lg font-semibold text-horizon-900 dark:text-horizon-100 mb-4">Crypto Payments</h2>
          <div className="bg-white dark:bg-horizon-800 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-horizon-400 text-[10px] uppercase tracking-wider border-b border-horizon-100 dark:border-horizon-700">
                  <th className="p-4 font-medium">User</th><th className="p-4 font-medium">Currency</th><th className="p-4 font-medium">Amount</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {cryptoPayments.map(c => (
                  <tr key={c.id} className="border-b border-horizon-50 dark:border-horizon-800">
                    <td className="p-4 text-horizon-900 dark:text-horizon-100">{c.userName || c.userEmail || 'Guest'}</td>
                    <td className="p-4 text-horizon-600 dark:text-horizon-300">{c.currency}</td>
                    <td className="p-4 text-horizon-600 dark:text-horizon-300">${Number(c.amount).toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${
                        c.status === 'approved' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                        c.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                        'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                      }`}>{c.status || 'pending'}</span>
                    </td>
                    <td className="p-4 text-horizon-400 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {cryptoPayments.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-horizon-400">No crypto payments.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <form onSubmit={addMethod} className="flex gap-3 mb-8 items-end">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-horizon-400 font-medium">Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field text-sm mt-1" placeholder="Bitcoin" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-horizon-400 font-medium">Type</label>
            <select value={type} onChange={e => setType(e.target.value)} className="input-field text-sm mt-1">
              <option value="card">Card</option><option value="virtual_card">Virtual Card</option><option value="crypto">Crypto</option><option value="paypal">PayPal</option><option value="other">Other</option>
            </select>
          </div>
          <button type="submit" className="btn-primary text-xs">Add Method</button>
        </form>

        <div className="bg-white dark:bg-horizon-800 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-horizon-400 text-[10px] uppercase tracking-wider border-b border-horizon-100 dark:border-horizon-700">
                <th className="p-4 font-medium">Name</th><th className="p-4 font-medium">Type</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {methods.map(m => (
                <tr key={m.id} className="border-b border-horizon-50 dark:border-horizon-800">
                  <td className="p-4 text-horizon-900 dark:text-horizon-100">{m.name}</td>
                  <td className="p-4 text-horizon-600 dark:text-horizon-300 text-xs uppercase">{m.type.replace(/_/g, ' ')}</td>
                  <td className="p-4">
                    <button onClick={() => toggleMethod(m.id, m.enabled)} className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${m.enabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>{m.enabled ? 'Enabled' : 'Disabled'}</button>
                  </td>
                  <td className="p-4">
                    <button onClick={() => deleteMethod(m.id)} className="text-[10px] uppercase tracking-wider text-red-500 hover:text-red-700">Delete</button>
                  </td>
                </tr>
              ))}
              {methods.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-horizon-400">No payment methods.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}