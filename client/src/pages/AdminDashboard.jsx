import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [deposits, setDeposits] = useState([])
  const [supportEmail, setSupportEmail] = useState('')
  const [slides, setSlides] = useState([
    { image: '', title: '', subtitle: '' },
    { image: '', title: '', subtitle: '' },
    { image: '', title: '', subtitle: '' },
  ])

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(setStats).catch(() => {})
    fetch('/api/admin/deposits?status=pending').then(r => r.json()).then(setDeposits).catch(() => {})
    fetch('/api/admin/pages').then(r => r.json()).then(data => {
      setSupportEmail(data.support_email || '')
      setSlides([
        { image: data.slideshow_slide1_image || '', title: data.slideshow_slide1_title || '', subtitle: data.slideshow_slide1_subtitle || '' },
        { image: data.slideshow_slide2_image || '', title: data.slideshow_slide2_title || '', subtitle: data.slideshow_slide2_subtitle || '' },
        { image: data.slideshow_slide3_image || '', title: data.slideshow_slide3_title || '', subtitle: data.slideshow_slide3_subtitle || '' },
      ])
    }).catch(() => {})
  }, [])

  const statusColor = (s) => {
    const map = { delivered: 'badge-success', cancelled: 'badge-danger', refunded: 'badge-danger', pending: 'badge-warning', paid: 'badge-info', processing: 'badge-info', shipped: 'badge-info' };
    return map[s] || 'badge-info';
  };

  const approveDeposit = async (id) => {
    try {
      await fetch(`/api/admin/deposits/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      })
      setDeposits(deposits.filter(d => d.id !== id))
    } catch {}
  }

  const rejectDeposit = async (id) => {
    try {
      await fetch(`/api/admin/deposits/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' })
      })
      setDeposits(deposits.filter(d => d.id !== id))
    } catch {}
  }

  const saveSupportEmail = () => {
    fetch('/api/admin/pages', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ support_email: supportEmail })
    }).then(() => alert('Support email saved!')).catch(() => {})
  }

  const saveSlideshow = () => {
    fetch('/api/admin/pages', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slideshow_slide1_image: slides[0].image,
        slideshow_slide1_title: slides[0].title,
        slideshow_slide1_subtitle: slides[0].subtitle,
        slideshow_slide2_image: slides[1].image,
        slideshow_slide2_title: slides[1].title,
        slideshow_slide2_subtitle: slides[1].subtitle,
        slideshow_slide3_image: slides[2].image,
        slideshow_slide3_title: slides[2].title,
        slideshow_slide3_subtitle: slides[2].subtitle,
      })
    }).then(() => alert('Slideshow saved!')).catch(() => {})
  }

  const updateSlide = (index, field, value) => {
    setSlides(slides.map((s, i) => i === index ? { ...s, [field]: value } : s))
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-midnight-950">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-midnight-900 dark:text-white">Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overview of your store</p>
          </div>
          <div className="flex gap-3">
            <Link to="/admin/products/add" className="btn-primary text-sm !py-2 !px-4">Add Product</Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats ? (
            <>
              <StatCard label="Products" value={stats.totalProducts} icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />} />
              <StatCard label="Orders" value={stats.totalOrders} icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />} />
              <StatCard label="Revenue" value={`$${Number(stats.revenue).toLocaleString('en-US', { minimumFractionDigits: 2 })}`} icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />} />
              <StatCard label="Users" value={stats.totalUsers} icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />} />
            </>
          ) : [...Array(4)].map((_, i) => (
            <div key={i} className="admin-card animate-pulse"><div className="h-3 bg-gray-200 dark:bg-midnight-700 rounded w-1/3 mb-3" /><div className="h-8 bg-gray-200 dark:bg-midnight-700 rounded w-1/2" /></div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="admin-card">
            <h2 className="font-semibold text-midnight-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Order Status</h2>
            <div className="space-y-3">
              {stats?.orderStatusCounts?.map(s => (
                <div key={s.status} className="flex items-center justify-between">
                  <span className="capitalize text-sm text-gray-600 dark:text-gray-400">{s.status}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-100 dark:bg-midnight-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${s.status === 'delivered' ? 'bg-emerald-500' : s.status === 'cancelled' ? 'bg-red-500' : s.status === 'pending' ? 'bg-amber-500' : 'bg-horizon-500'}`}
                        style={{ width: `${Math.min(100, (s.count / Math.max(1, stats.totalOrders)) * 100)}%` }} />
                    </div>
                    <span className="text-sm font-medium text-midnight-900 dark:text-white w-8 text-right">{s.count}</span>
                  </div>
                </div>
              ))}
              {(!stats?.orderStatusCounts || stats.orderStatusCounts.length === 0) && <p className="text-sm text-gray-400">No orders yet</p>}
            </div>
          </div>
          <div className="admin-card">
            <h2 className="font-semibold text-midnight-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-400">Revenue Today</p><p className="text-lg font-semibold text-midnight-900 dark:text-white">${Number(stats?.revenueToday || 0).toFixed(2)}</p></div>
              <div><p className="text-xs text-gray-400">Pending Orders</p><p className="text-lg font-semibold text-midnight-900 dark:text-white">{stats?.pendingOrders || 0}</p></div>
              <div><p className="text-xs text-gray-400">Processing</p><p className="text-lg font-semibold text-midnight-900 dark:text-white">{stats?.processingOrders || 0}</p></div>
              <div><p className="text-xs text-gray-400">Out of Stock</p><p className="text-lg font-semibold text-midnight-900 dark:text-white">{stats?.outOfStock || 0}</p></div>
            </div>
          </div>
        </div>

        <div className="admin-card overflow-hidden !p-0 mb-6">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-midnight-800">
            <h2 className="font-semibold text-midnight-900 dark:text-white text-sm uppercase tracking-wider">Recent Orders</h2>
          </div>
          {stats?.recentOrders?.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100 dark:border-midnight-800">
                  <th className="p-4 font-medium">Order</th><th className="p-4 font-medium">Customer</th><th className="p-4 font-medium">Total</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map(order => (
                  <tr key={order.id} className="border-b border-gray-50 dark:border-midnight-800/50 hover:bg-gray-50 dark:hover:bg-midnight-800/30 transition-colors">
                    <td className="p-4 font-mono text-xs text-horizon-600 font-medium">#{order.orderNumber || order.id.slice(0, 8).toUpperCase()}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{order.customerName}</td>
                    <td className="p-4 font-medium text-midnight-900 dark:text-white">${Number(order.total).toFixed(2)}</td>
                    <td className="p-4"><span className={statusColor(order.status)}>{order.status}</span></td>
                    <td className="p-4 text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="text-gray-400 text-sm p-6">No orders yet.</p>}
        </div>

        <div className="admin-card mb-6">
          <h2 className="font-semibold text-midnight-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Pending Deposits</h2>
          {deposits.length > 0 ? (
            <div className="space-y-3">
              {deposits.map(d => (
                <div key={d.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-midnight-800/50 rounded">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-midnight-900 dark:text-white">{d.userName || d.user?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">${Number(d.amount).toFixed(2)} &middot; {new Date(d.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => approveDeposit(d.id)} className="btn-primary text-[10px] !py-1 !px-3">Approve</button>
                    <button onClick={() => rejectDeposit(d.id)} className="btn-outline text-[10px] !py-1 !px-3 text-red-500 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-gray-400">No pending deposits.</p>}
        </div>

        <div className="admin-card mb-6">
          <h2 className="font-semibold text-midnight-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Support Email</h2>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Support Email Address</label>
              <input type="email" value={supportEmail} onChange={e => setSupportEmail(e.target.value)} className="input-field text-sm w-full" placeholder="support@horizon.com" />
            </div>
            <button onClick={saveSupportEmail} className="btn-primary text-sm !py-2 !px-4">Save</button>
          </div>
        </div>

        <div className="admin-card mb-6">
          <h2 className="font-semibold text-midnight-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Slideshow Editor</h2>
          <div className="space-y-4">
            {[0, 1, 2].map(i => (
              <div key={i} className="p-4 border border-gray-200 dark:border-midnight-700 rounded-lg">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Slide {i + 1}</p>
                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Image URL</label>
                    <input type="text" value={slides[i].image} onChange={e => updateSlide(i, 'image', e.target.value)} className="input-field text-sm w-full" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Title</label>
                    <input type="text" value={slides[i].title} onChange={e => updateSlide(i, 'title', e.target.value)} className="input-field text-sm w-full" placeholder="Slide title" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Subtitle</label>
                    <input type="text" value={slides[i].subtitle} onChange={e => updateSlide(i, 'subtitle', e.target.value)} className="input-field text-sm w-full" placeholder="Slide subtitle" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={saveSlideshow} className="btn-primary text-sm !py-2 !px-4 mt-4">Save Slideshow</button>
        </div>

      </div>
    </div>
  )
}

function StatCard({ label, value, icon }) {
  return (
    <div className="admin-card">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">{label}</p>
        <div className="w-8 h-8 rounded-lg bg-horizon-50 dark:bg-horizon-900/30 flex items-center justify-center">
          <svg className="w-4 h-4 text-horizon-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">{icon}</svg>
        </div>
      </div>
      <p className="text-2xl font-bold text-midnight-900 dark:text-white">{value}</p>
    </div>
  )
}
