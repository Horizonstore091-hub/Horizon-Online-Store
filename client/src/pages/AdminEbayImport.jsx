import { useState } from 'react'
import AdminSidebar from '../components/AdminSidebar'

export default function AdminEbayImport() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState({})
  const [error, setError] = useState('')

  const search = async e => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true); setError('')
    try {
      const res = await fetch(`/api/admin/ebay/search?q=${encodeURIComponent(query.trim())}&limit=24`)
      if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      setResults(await res.json())
    } catch (err) { setError(err.message) }
    setLoading(false)
  }

  const importProduct = async epid => {
    setImporting(s => ({ ...s, [epid]: true }))
    try {
      const res = await fetch('/api/admin/ebay/import', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ epid }) })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      setResults(results.map(r => r.epid === epid ? { ...r, imported: true } : r))
    } catch (err) { alert(err.message) }
    setImporting(s => ({ ...s, [epid]: false }))
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-midnight-950">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-midnight-900 dark:text-white mb-2">eBay Product Import</h1>
        <p className="text-sm text-gray-500 mb-8">Search eBay's catalog and import products directly into your store.</p>

        <form onSubmit={search} className="flex gap-3 mb-8">
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search eBay catalog..." className="input-field flex-1 text-sm" />
          <button type="submit" disabled={loading} className="btn-primary text-sm disabled:opacity-50">
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6"><p className="text-sm text-red-600 dark:text-red-400">{error}</p></div>}

        {results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.map(r => (
              <div key={r.epid} className="admin-card !p-0 overflow-hidden flex flex-col">
                <div className="h-40 bg-gray-100 dark:bg-midnight-800 overflow-hidden">
                  {r.image ? <img src={r.image} alt={r.title} className="w-full h-full object-contain" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No image</div>}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-xs font-medium text-midnight-900 dark:text-white line-clamp-2 mb-2">{r.title}</p>
                  {r.price && <p className="text-sm font-bold text-horizon-600 dark:text-horizon-400 mb-2">${r.price.toFixed(2)}</p>}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {Object.entries(r.aspects || {}).slice(0, 3).map(([k, v]) => (
                      <span key={k} className="text-[10px] bg-gray-100 dark:bg-midnight-800 text-gray-500 px-1.5 py-0.5 rounded">{v}</span>
                    ))}
                  </div>
                  <div className="mt-auto">
                    <button onClick={() => importProduct(r.epid)} disabled={importing[r.epid] || r.imported} className={`w-full text-xs py-2 rounded-lg font-medium transition-colors ${r.imported ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'btn-primary !py-2 text-center disabled:opacity-50'}`}>
                      {importing[r.epid] ? 'Importing...' : r.imported ? 'Imported' : 'Import'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
