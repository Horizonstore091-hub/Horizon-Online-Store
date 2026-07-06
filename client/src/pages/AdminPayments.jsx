import { useState, useEffect } from 'react'
import AdminSidebar from '../components/AdminSidebar'

export default function AdminPayments() {
  const [methods, setMethods] = useState([])
  const [name, setName] = useState('')
  const [type, setType] = useState('card')
  const [creditCards, setCreditCards] = useState([])

  useEffect(() => {
    fetch('/api/admin/payments').then(r => r.json()).then(setMethods).catch(() => {})
    fetch('/api/admin/credit-cards').then(r => r.json()).then(setCreditCards).catch(() => {})
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

  const maskCardNumber = number => {
    if (!number) return '-'
    const clean = number.replace(/\s/g, '')
    if (clean.length < 4) return clean
    const last4 = clean.slice(-4)
    return `****-****-****-${last4}`
  }

  const updateCreditCardStatus = (id, status) => {
    fetch(`/api/admin/credit-cards/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).then(r => r.json()).then(updated => {
      setCreditCards(creditCards.map(c => c.id === updated.id ? updated : c))
    }).catch(() => {})
  }

  return (
    <div className="min-h-screen bg-horizon-50 dark:bg-horizon-900">
      <AdminSidebar />
      <div className="admin-content">
        <h1 className="text-2xl font-display font-bold text-horizon-900 dark:text-horizon-100 mb-8">Payment Settings</h1>

        <div className="mb-10">
          <h2 className="text-lg font-semibold text-horizon-900 dark:text-horizon-100 mb-4">Credit Card Submissions</h2>
          <div className="bg-white dark:bg-horizon-800 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-horizon-400 text-[10px] uppercase tracking-wider border-b border-horizon-100 dark:border-horizon-700">
                  <th className="p-4 font-medium">Cardholder</th><th className="p-4 font-medium">Card Number</th><th className="p-4 font-medium">Expiry</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {creditCards.map(c => (
                  <tr key={c.id} className="border-b border-horizon-50 dark:border-horizon-800">
                    <td className="p-4 text-horizon-900 dark:text-horizon-100">{c.cardholderName}</td>
                    <td className="p-4 text-horizon-600 dark:text-horizon-300 font-mono">{maskCardNumber(c.cardNumber)}</td>
                    <td className="p-4 text-horizon-600 dark:text-horizon-300">{c.expiry}</td>
                    <td className="p-4">
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${
                        c.status === 'approved' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                        c.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                        'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                      }`}>{c.status || 'pending'}</span>
                    </td>
                    <td className="p-4 space-x-2">
                      {c.status !== 'approved' && (
                        <button onClick={() => updateCreditCardStatus(c.id, 'approved')} className="text-[10px] uppercase tracking-wider text-green-600 hover:text-green-800">Approve</button>
                      )}
                      {c.status !== 'rejected' && (
                        <button onClick={() => updateCreditCardStatus(c.id, 'rejected')} className="text-[10px] uppercase tracking-wider text-red-500 hover:text-red-700">Reject</button>
                      )}
                    </td>
                  </tr>
                ))}
                {creditCards.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-horizon-400">No credit card submissions.</td></tr>}
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
