import { useState, useEffect } from 'react'
import AdminSidebar from '../components/AdminSidebar'

export default function AdminSEO() {
  const [pages, setPages] = useState([])
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ page: '', title: '', description: '', ogImage: '' })

  useEffect(() => {
    fetch('/api/page-meta').then(r => r.json()).then(setPages).catch(() => {})
  }, [])

  const selectPage = (p) => { setSelected(p); setForm({ page: p.page, title: p.title || '', description: p.description || '', ogImage: p.ogImage || '' }) }

  const save = async () => {
    try {
      const res = await fetch(`/api/page-meta/${selected.page}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (res.ok) { const updated = await res.json(); setPages(pages.map(p => p.page === updated.page ? updated : p)); setSelected(updated); alert('Saved') }
    } catch { alert('Error saving') }
  }

  const pageOptions = ['home', 'shop', 'cart', 'checkout', 'about', 'contact', 'faq', 'blog', 'login', 'register', 'terms', 'privacy']

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-midnight-950">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold text-midnight-900 dark:text-white mb-6">SEO Metadata Editor</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="admin-card">
            <h2 className="text-sm font-semibold text-midnight-900 dark:text-white mb-3 uppercase tracking-wider">Pages</h2>
            <div className="space-y-1">
              {pageOptions.map(page => {
                const meta = pages.find(p => p.page === page)
                return (
                  <button key={page} onClick={() => selectPage(meta || { page, title: '', description: '', ogImage: '' })}
                    className={`w-full text-left px-3 py-2 text-sm rounded ${selected?.page === page ? 'bg-horizon-50 dark:bg-horizon-900/30 text-horizon-700 dark:text-horizon-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-midnight-800'}`}>
                    <span className="capitalize">{page.replace(/-/g, ' ')}</span>
                    {meta?.title && <span className="ml-2 text-[10px] text-emerald-500">&#10003;</span>}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="md:col-span-2">
            {selected ? (
              <div className="admin-card space-y-4">
                <h2 className="text-sm font-semibold text-midnight-900 dark:text-white uppercase tracking-wider">
                  Editing: <span className="capitalize text-horizon-600">{selected.page.replace(/-/g, ' ')}</span>
                </h2>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Meta Title</label>
                  <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-field text-sm w-full" placeholder="Page title for SEO" maxLength={70} />
                  <p className="text-[10px] text-gray-400 mt-1">{form.title.length}/70 characters</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Meta Description</label>
                  <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field text-sm w-full h-24 resize-none" placeholder="Page description for SEO" maxLength={160} />
                  <p className="text-[10px] text-gray-400 mt-1">{form.description.length}/160 characters</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">OG Image URL</label>
                  <input value={form.ogImage} onChange={e => setForm({...form, ogImage: e.target.value})} className="input-field text-sm w-full" placeholder="https://..." />
                </div>
                <button onClick={save} className="btn-primary text-sm">Save Metadata</button>
              </div>
            ) : (
              <div className="admin-card flex items-center justify-center h-48 text-gray-400 text-sm">Select a page to edit metadata</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
