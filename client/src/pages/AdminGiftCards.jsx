import { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminGiftCards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ code: '', amount: '', senderName: '', recipientEmail: '', message: '' });
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    setLoading(true);
    fetch('/api/admin/giftcards').then(r => r.json()).then(data => { setCards(data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const createCard = async (e) => {
    e.preventDefault();
    await fetch('/api/admin/giftcards', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, amount: parseFloat(form.amount) }) });
    setShowForm(false); setForm({ code: '', amount: '', senderName: '', recipientEmail: '', message: '' }); load();
  };

  const toggleActive = async (id, active) => {
    await fetch(`/api/admin/giftcards/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: active ? 0 : 1 }) });
    load();
  };

  const deleteCard = async (id) => {
    if (!confirm('Delete this gift card?')) return;
    await fetch(`/api/admin/giftcards/${id}`, { method: 'DELETE' }); load();
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-midnight-950">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-midnight-900 dark:text-white">Gift Cards</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage gift cards</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm !py-2 !px-4">{showForm ? 'Cancel' : 'New Card'}</button>
        </div>

        {showForm && (
          <form onSubmit={createCard} className="admin-card mb-8 animate-slide-down">
            <h2 className="text-lg font-semibold mb-4">Create Gift Card</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Code</label><input className="input-field" value={form.code} onChange={e => setForm({...form, code: e.target.value})} required /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount ($)</label><input type="number" step="0.01" className="input-field" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sender Name</label><input className="input-field" value={form.senderName} onChange={e => setForm({...form, senderName: e.target.value})} /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recipient Email</label><input type="email" className="input-field" value={form.recipientEmail} onChange={e => setForm({...form, recipientEmail: e.target.value})} /></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label><input className="input-field" value={form.message} onChange={e => setForm({...form, message: e.target.value})} /></div>
            </div>
            <button type="submit" className="btn-primary text-sm !py-2 !px-4">Create</button>
          </form>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-horizon-600 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="admin-card overflow-hidden !p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-midnight-800/50">
                <tr><th className="text-left p-4 font-medium text-gray-500">Code</th><th className="text-left p-4 font-medium text-gray-500">Amount</th><th className="text-left p-4 font-medium text-gray-500">Balance</th><th className="text-left p-4 font-medium text-gray-500">Sender</th><th className="text-left p-4 font-medium text-gray-500">Status</th><th className="text-right p-4 font-medium text-gray-500">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-midnight-800">
                {cards.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-midnight-800/30 transition-colors">
                    <td className="p-4 font-mono text-sm text-midnight-900 dark:text-white font-medium">{c.code}</td>
                    <td className="p-4 text-midnight-900 dark:text-white">${c.amount.toFixed(2)}</td>
                    <td className="p-4 text-midnight-900 dark:text-white">${c.balance.toFixed(2)}</td>
                    <td className="p-4 text-gray-500">{c.senderName || '-'}</td>
                    <td className="p-4">{c.active ? <span className="badge-success">Active</span> : <span className="badge-danger">Used</span>}</td>
                    <td className="p-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => toggleActive(c.id, c.active)} className={`text-[10px] uppercase tracking-wider transition-colors ${c.active ? 'text-red-500 hover:text-red-600' : 'text-emerald-500 hover:text-emerald-600'}`}>
                          {c.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => deleteCard(c.id)} className="text-[10px] uppercase tracking-wider text-red-500 hover:text-red-700">Delete</button>
                      </div>
                    </td>
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
