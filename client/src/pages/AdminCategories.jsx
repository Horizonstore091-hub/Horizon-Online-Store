import { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '' });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = () => {
    setLoading(true);
    fetch('/api/admin/categories').then(r => r.json()).then(data => { setCategories(data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editing ? `/api/admin/categories/${editing}` : '/api/admin/categories';
    const method = editing ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setShowForm(false); setEditing(null); setForm({ name: '', description: '' }); load();
  };

  const editCat = (c) => { setForm({ name: c.name, description: c.description || '' }); setEditing(c.id); setShowForm(true); };

  const deleteCat = async (id) => {
    if (!confirm('Delete this category?')) return;
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' }); load();
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-midnight-950">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div><h1 className="text-2xl font-bold text-midnight-900 dark:text-white">Categories</h1><p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage product categories</p></div>
          <button onClick={() => { setEditing(null); setForm({ name: '', description: '' }); setShowForm(!showForm); }} className="btn-primary text-sm !py-2 !px-4">{showForm ? 'Cancel' : 'Add Category'}</button>
        </div>
        {showForm && (
          <form onSubmit={handleSubmit} className="admin-card mb-8 animate-slide-down">
            <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit Category' : 'Add Category'}</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label><input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label><input className="input-field" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
            </div>
            <button type="submit" className="btn-primary text-sm !py-2 !px-4">{editing ? 'Update' : 'Create'}</button>
          </form>
        )}
        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-horizon-600 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="admin-card overflow-hidden !p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-midnight-800/50">
                <tr><th className="text-left p-4 font-medium text-gray-500">Name</th><th className="text-left p-4 font-medium text-gray-500">Slug</th><th className="text-left p-4 font-medium text-gray-500">Description</th><th className="text-right p-4 font-medium text-gray-500">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-midnight-800">
                {categories.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-midnight-800/30 transition-colors">
                    <td className="p-4 text-midnight-900 dark:text-white font-medium">{c.name}</td>
                    <td className="p-4 text-gray-500">{c.slug}</td>
                    <td className="p-4 text-gray-500">{c.description}</td>
                    <td className="p-4 text-right"><button onClick={() => editCat(c)} className="text-horizon-600 hover:text-horizon-700 dark:text-horizon-400 mr-3">Edit</button><button onClick={() => deleteCat(c.id)} className="text-red-500 hover:text-red-600">Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
