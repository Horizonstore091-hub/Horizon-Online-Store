import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AddressBook() {
  const { user } = useAuth()
  const [addresses, setAddresses] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ label: 'Home', fullName: '', street: '', city: '', state: '', zip: '', country: 'US', phone: '', isDefault: false })

  useEffect(() => {
    if (user?.id) fetch(`/api/addresses/${user.id}`).then(r => r.json()).then(setAddresses).catch(() => {})
  }, [user?.id])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const resetForm = () => { setForm({ label: 'Home', fullName: '', street: '', city: '', state: '', zip: '', country: 'US', phone: '', isDefault: false }); setEditing(null); setShowForm(false) }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!user?.id) return
    const body = { ...form, userId: user.id, isDefault: form.isDefault ? 1 : 0 }
    try {
      if (editing) {
        const res = await fetch(`/api/addresses/${editing}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        if (res.ok) { const updated = await res.json(); setAddresses(addresses.map(a => a.id === editing ? updated : a)); resetForm() }
      } else {
        const res = await fetch('/api/addresses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        if (res.ok) { const created = await res.json(); setAddresses([...addresses, created]); resetForm() }
      }
    } catch {}
  }

  const deleteAddress = async id => {
    try { await fetch(`/api/addresses/${id}`, { method: 'DELETE' }); setAddresses(addresses.filter(a => a.id !== id)) } catch {}
  }

  const startEdit = addr => { setForm({ ...addr, isDefault: !!addr.isDefault }); setEditing(addr.id); setShowForm(true) }

  return (
    <div className="pt-24 md:pt-28">
      <div className="container-wide py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-display font-bold text-midnight-900 dark:text-white">Address Book</h1>
          <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-primary text-sm">Add Address</button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="admin-card p-6 mb-6 max-w-lg">
            <h2 className="font-semibold text-midnight-900 dark:text-white mb-4">{editing ? 'Edit Address' : 'New Address'}</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-gray-500">Label</label><select name="label" value={form.label} onChange={handleChange} className="input-field text-sm w-full"><option>Home</option><option>Work</option><option>Other</option></select></div>
                <div><label className="text-xs text-gray-500">Full Name</label><input name="fullName" value={form.fullName} onChange={handleChange} className="input-field text-sm w-full" required /></div>
              </div>
              <div><label className="text-xs text-gray-500">Street</label><input name="street" value={form.street} onChange={handleChange} className="input-field text-sm w-full" required /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-xs text-gray-500">City</label><input name="city" value={form.city} onChange={handleChange} className="input-field text-sm w-full" required /></div>
                <div><label className="text-xs text-gray-500">State</label><input name="state" value={form.state} onChange={handleChange} className="input-field text-sm w-full" /></div>
                <div><label className="text-xs text-gray-500">ZIP</label><input name="zip" value={form.zip} onChange={handleChange} className="input-field text-sm w-full" required /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-gray-500">Country</label><input name="country" value={form.country} onChange={handleChange} className="input-field text-sm w-full" /></div>
                <div><label className="text-xs text-gray-500">Phone</label><input name="phone" value={form.phone} onChange={handleChange} className="input-field text-sm w-full" /></div>
              </div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isDefault} onChange={e => setForm({...form, isDefault: e.target.checked})} /> Set as default</label>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary text-sm">{editing ? 'Update' : 'Save'}</button>
                <button type="button" onClick={resetForm} className="btn-outline text-sm">Cancel</button>
              </div>
            </div>
          </form>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addresses.map(addr => (
            <div key={addr.id} className={`admin-card relative ${addr.isDefault ? 'ring-2 ring-horizon-500' : ''}`}>
              {addr.isDefault && <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider text-horizon-600 font-semibold">Default</span>}
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">{addr.label}</p>
              <p className="text-sm font-medium text-midnight-900 dark:text-white">{addr.fullName}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{addr.street}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.zip}</p>
              {addr.phone && <p className="text-xs text-gray-500 mt-1">{addr.phone}</p>}
              <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-midnight-800">
                <button onClick={() => startEdit(addr)} className="text-xs text-horizon-600 hover:underline">Edit</button>
                <button onClick={() => deleteAddress(addr.id)} className="text-xs text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          ))}
          {addresses.length === 0 && <p className="text-sm text-gray-400 col-span-full">No addresses saved yet.</p>}
        </div>
      </div>
    </div>
  )
}
