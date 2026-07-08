import { useState, useEffect } from 'react'
import AdminSidebar from '../components/AdminSidebar'

export default function AdminWalletAddresses() {
  const [addresses, setAddresses] = useState([])
  const [form, setForm] = useState({ currency: '', address: '', network: '' })
  const [editing, setEditing] = useState(null)

  const load = () => {
    fetch('/api/admin/wallet-addresses').then(r => r.json()).then(setAddresses).catch(() => {})
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.currency || !form.address) return
    if (editing) {
      await fetch(`/api/admin/wallet-addresses/${editing}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
    } else {
      await fetch('/api/admin/wallet-addresses', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
    }
    setForm({ currency: '', address: '', network: '' })
    setEditing(null)
    load()
  }

  const startEdit = (w) => {
    setEditing(w.id)
    setForm({ currency: w.currency, address: w.address, network: w.network || '' })
  }

  const deleteAddress = async (id) => {
    if (!confirm('Delete this address?')) return
    await fetch(`/api/admin/wallet-addresses/${id}`, { method: 'DELETE' })
    load()
  }

  const toggleActive = async (id, active) => {
    await fetch(`/api/admin/wallet-addresses/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: active ? 0 : 1 })
    })
    load()
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-midnight-950">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-midnight-900 dark:text-white mb-8">Wallet Addresses</h1>

        <form onSubmit={handleSubmit} className="admin-card mb-8">
          <h2 className="text-sm font-semibold text-midnight-900 dark:text-white mb-4">{editing ? 'Edit' : 'Add'} Wallet Address</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div><label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Currency</label>
              <select value={form.currency} onChange={e => setForm({...form, currency: e.target.value})} className="input-field w-full" required>
                <option value="">Select...</option>
                <option value="Bitcoin (BTC)">Bitcoin (BTC)</option>
                <option value="Ethereum (ETH)">Ethereum (ETH)</option>
                <option value="USDT (ERC-20)">USDT (ERC-20)</option>
                <option value="USDT (TRC-20)">USDT (TRC-20)</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div><label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Wallet Address</label>
              <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="input-field w-full font-mono text-xs" required /></div>
            <div><label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Network</label>
              <input type="text" value={form.network} onChange={e => setForm({...form, network: e.target.value})} className="input-field w-full" placeholder="ERC-20, TRC-20, etc." /></div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary text-sm">{editing ? 'Update' : 'Add'}</button>
            {editing && <button type="button" onClick={() => { setEditing(null); setForm({ currency: '', address: '', network: '' }) }} className="btn-outline text-sm">Cancel</button>}
          </div>
        </form>

        <div className="admin-card overflow-hidden !p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-midnight-800/50">
              <tr><th className="text-left p-4 font-medium text-gray-500">Currency</th><th className="text-left p-4 font-medium text-gray-500">Address</th><th className="text-left p-4 font-medium text-gray-500">Network</th><th className="text-left p-4 font-medium text-gray-500">Status</th><th className="text-right p-4 font-medium text-gray-500">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-midnight-800">
              {addresses.map(w => (
                <tr key={w.id} className="hover:bg-gray-50 dark:hover:bg-midnight-800/30 transition-colors">
                  <td className="p-4 font-medium text-midnight-900 dark:text-white">{w.currency}</td>
                  <td className="p-4 font-mono text-xs text-gray-600 dark:text-gray-300 max-w-[300px] truncate">{w.address}</td>
                  <td className="p-4 text-gray-500">{w.network || '-'}</td>
                  <td className="p-4">
                    <button onClick={() => toggleActive(w.id, w.active)} className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${w.active ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>{w.active ? 'Active' : 'Inactive'}</button>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => startEdit(w)} className="text-[10px] uppercase tracking-wider text-blue-500 hover:text-blue-700">Edit</button>
                    <button onClick={() => deleteAddress(w.id)} className="text-[10px] uppercase tracking-wider text-red-500 hover:text-red-700">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
