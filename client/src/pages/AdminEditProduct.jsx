import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

export default function AdminEditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', description: '', price: '', comparePrice: '', category: '', stock: '0', featured: false, features: '', specifications: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/products/${id}`).then(r => r.json()).then(p => {
      const features = (() => { try { return JSON.parse(p.features || '[]').join('\n') } catch { return '' } })()
      const specs = (() => { try { const o = JSON.parse(p.specifications || '{}'); return Object.entries(o).map(([k, v]) => `${k}: ${v}`).join('\n') } catch { return '' } })()
      setForm({ name: p.name, description: p.description, price: p.price, comparePrice: p.comparePrice || '', category: p.category, stock: p.stock, featured: Boolean(p.featured), features, specifications: specs })
      setLoading(false)
    }).catch(() => navigate('/admin/products'))
  }, [id, navigate])

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, k === 'features' ? JSON.stringify(v.split('\n').filter(Boolean)) : k === 'specifications' ? JSON.stringify(Object.fromEntries(v.split('\n').filter(Boolean).map(l => l.split(':').map(s => s.trim())))) : v))
    fd.append('featured', form.featured ? 'true' : 'false')
    const fileInput = document.getElementById('productImage')
    if (fileInput?.files[0]) fd.append('image', fileInput.files[0])
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'PUT', body: fd })
      if (res.ok) navigate('/admin/products')
      else alert('Failed to update')
    } catch { alert('Failed to update') }
  }

  if (loading) return <div className="min-h-screen bg-horizon-50 dark:bg-horizon-900"><AdminSidebar /><div className="admin-content animate-pulse"><div className="h-6 bg-horizon-100 dark:bg-horizon-700 w-1/4 mb-8" /><div className="bg-white dark:bg-horizon-800 p-8 space-y-5"><div className="h-10 bg-horizon-100 dark:bg-horizon-700" /><div className="h-24 bg-horizon-100 dark:bg-horizon-700" /><div className="h-10 bg-horizon-100 dark:bg-horizon-700" /></div></div></div>

  return (
    <div className="min-h-screen bg-horizon-50 dark:bg-horizon-900">
      <AdminSidebar />
      <div className="admin-content max-w-3xl">
        <h1 className="text-2xl font-display font-bold text-horizon-900 dark:text-horizon-100 mb-8">Edit Product</h1>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-horizon-800 p-8 space-y-5">
          <div><label className="text-xs uppercase tracking-wider text-horizon-400 font-medium block mb-1">Product Name</label><input name="name" value={form.name} onChange={handleChange} required className="input-field" /></div>
          <div><label className="text-xs uppercase tracking-wider text-horizon-400 font-medium block mb-1">Description</label><textarea name="description" value={form.description} onChange={handleChange} required rows={4} className="input-field resize-none" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs uppercase tracking-wider text-horizon-400 font-medium block mb-1">Price ($)</label><input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required className="input-field" /></div>
            <div><label className="text-xs uppercase tracking-wider text-horizon-400 font-medium block mb-1">Compare Price ($)</label><input name="comparePrice" type="number" step="0.01" value={form.comparePrice} onChange={handleChange} className="input-field" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs uppercase tracking-wider text-horizon-400 font-medium block mb-1">Category</label><select name="category" value={form.category} onChange={handleChange} required className="input-field">{['Electronics', 'Clothing', 'Gadgets', 'Home & Kitchen', 'Beauty', 'Accessories'].map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className="text-xs uppercase tracking-wider text-horizon-400 font-medium block mb-1">Stock</label><input name="stock" type="number" value={form.stock} onChange={handleChange} className="input-field" /></div>
          </div>
          <div><label className="text-xs uppercase tracking-wider text-horizon-400 font-medium block mb-1">Features (one per line)</label><textarea name="features" value={form.features} onChange={handleChange} rows={3} className="input-field resize-none" /></div>
          <div><label className="text-xs uppercase tracking-wider text-horizon-400 font-medium block mb-1">Specifications (key: value)</label><textarea name="specifications" value={form.specifications} onChange={handleChange} rows={3} className="input-field resize-none" /></div>
          <div><label className="text-xs uppercase tracking-wider text-horizon-400 font-medium block mb-1">Product Image</label><input id="productImage" type="file" accept="image/*" className="text-sm text-horizon-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-medium file:bg-horizon-900 file:text-white hover:file:bg-horizon-700" /></div>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4" /><span className="text-sm text-horizon-600 dark:text-horizon-300">Featured product</span></label>
          <div className="flex gap-3 pt-4"><button type="submit" className="btn-primary">Update Product</button><Link to="/admin/products" className="btn-outline">Cancel</Link></div>
        </form>
      </div>
    </div>
  )
}

function AdminSidebar() {
  return (
    <div className="admin-sidebar">
      <Link to="/admin" className="font-display text-xl font-bold text-white mb-10 block">HORIZON</Link>
      <p className="text-[10px] uppercase tracking-wider text-horizon-400 mb-6">Admin Panel</p>
      <nav className="space-y-2">
        <Link to="/admin" className="block py-2.5 px-3 text-sm text-horizon-300 hover:text-white hover:bg-horizon-800 rounded">Dashboard</Link>
        <Link to="/admin/products" className="block py-2.5 px-3 text-sm text-horizon-300 hover:text-white hover:bg-horizon-800 rounded">Products</Link>
        <Link to="/admin/orders" className="block py-2.5 px-3 text-sm text-horizon-300 hover:text-white hover:bg-horizon-800 rounded">Orders</Link>
        <Link to="/admin/coupons" className="block py-2.5 px-3 text-sm text-horizon-300 hover:text-white hover:bg-horizon-800 rounded">Coupons</Link>
        <Link to="/admin/messages" className="block py-2.5 px-3 text-sm text-horizon-300 hover:text-white hover:bg-horizon-800 rounded">Messages</Link>
      </nav>
      <Link to="/" className="block mt-10 text-xs text-horizon-500 hover:text-horizon-300 uppercase tracking-wider">Back to Store</Link>
    </div>
  )
}
