import { useState, useEffect } from 'react'
import AdminSidebar from '../components/AdminSidebar'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', role: 'customer', isSuspended: false, kycStatus: 'none', password: '' })

  useEffect(() => {
    fetch('/api/admin/users').then(r => r.json()).then(setUsers).catch(() => {})
  }, [])

  const openEdit = u => {
    setEditing(u.id)
    setEditForm({
      name: u.name,
      email: u.email,
      phone: u.phone || '',
      role: u.role || 'customer',
      isSuspended: u.isSuspended || false,
      kycStatus: u.kycStatus || 'none',
      password: ''
    })
  }

  const cancelEdit = () => setEditing(null)

  const saveEdit = async () => {
    const body = {
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      role: editForm.role,
      isSuspended: editForm.isSuspended,
      kycStatus: editForm.kycStatus
    }
    if (editForm.password) body.password = editForm.password
    try {
      const res = await fetch(`/api/admin/users/${editing}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      })
      if (res.ok) {
        const updated = await res.json()
        setUsers(users.map(u => u.id === editing ? { ...u, ...updated } : u))
        setEditing(null)
      }
    } catch {}
  }

  const deleteUser = id => {
    if (!confirm('Delete this user?')) return
    fetch(`/api/admin/users/${id}`, { method: 'DELETE' }).then(() => setUsers(users.filter(u => u.id !== id))).catch(() => {})
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-midnight-950">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-midnight-900 dark:text-white mb-8">Users</h1>
        <div className="admin-card overflow-hidden !p-0">
          <table className="table-admin w-full text-sm">
            <thead className="bg-gray-50 dark:bg-midnight-800/50">
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Password</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Phone</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">KYC</th>
                <th className="p-4 font-medium">Joined</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-midnight-800">
              {users.map(u => editing === u.id ? (
                <tr key={u.id} className="bg-gray-50 dark:bg-midnight-800/30">
                  <td className="p-2">
                    <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="input-field text-xs w-full" placeholder="Name" />
                  </td>
                  <td className="p-2 text-horizon-400 font-mono text-[10px] break-all max-w-[160px]">{u.password || '--'}</td>
                  <td className="p-2">
                    <input value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="input-field text-xs w-full" placeholder="Email" />
                  </td>
                  <td className="p-2">
                    <input value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="input-field text-xs w-full" placeholder="Phone" />
                  </td>
                  <td className="p-2">
                    <select value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})} className="input-field text-xs">
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <select value={editForm.kycStatus} onChange={e => setEditForm({...editForm, kycStatus: e.target.value})} className="input-field text-xs">
                      <option value="none">None</option>
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="p-2 text-horizon-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-2">
                    <div className="flex flex-col gap-1">
                      <label className="flex items-center gap-1 text-[10px] text-horizon-500">
                        <input type="checkbox" checked={editForm.isSuspended} onChange={e => setEditForm({...editForm, isSuspended: e.target.checked})} />
                        Suspended
                      </label>
                      <input value={editForm.password} onChange={e => setEditForm({...editForm, password: e.target.value})} type="password" className="input-field text-[10px] w-full" placeholder="New password" />
                      <div className="flex gap-1 mt-1">
                        <button onClick={saveEdit} className="btn-primary text-[10px] !py-1 !px-2">Save</button>
                        <button onClick={cancelEdit} className="btn-outline text-[10px] !py-1 !px-2">Cancel</button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={u.id} className={`hover:bg-gray-50 dark:hover:bg-midnight-800/30 transition-colors ${u.isSuspended ? 'bg-red-50 dark:bg-red-900/10' : ''}`}>
                  <td className="p-4 text-midnight-900 dark:text-white">
                    {u.name}
                    {u.isSuspended && <span className="ml-2 text-[10px] uppercase tracking-wider text-red-600 dark:text-red-400 font-medium">Suspended</span>}
                    {u.role === 'admin' && <span className="ml-2 text-[10px] uppercase tracking-wider text-blue-600 dark:text-blue-400 font-medium">Admin</span>}
                  </td>
                  <td className="p-4 text-gray-400 font-mono text-[10px] break-all max-w-[200px]">{u.password || '--'}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{u.email}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{u.phone || '--'}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-300 capitalize">{u.role || 'customer'}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-300 capitalize">{u.kycStatus || 'none'}</td>
                  <td className="p-4 text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => openEdit(u)} className="text-[10px] uppercase tracking-wider text-blue-500 hover:text-blue-700">Edit</button>
                    {u.role !== 'admin' && (
                      <button onClick={() => deleteUser(u.id)} className="text-[10px] uppercase tracking-wider text-red-500 hover:text-red-700">Delete</button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-gray-400">No users found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
