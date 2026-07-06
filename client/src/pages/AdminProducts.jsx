import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function AdminProducts() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch('/api/admin/products').then(r => r.json()).then(setProducts).catch(() => {})
  }, [])

  const handleDelete = (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return
    fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      .then(r => r.ok && setProducts(products.filter(p => p.id !== id)))
      .catch(() => alert('Failed to delete'))
  }

  return (
    <div className="min-h-screen bg-horizon-50 dark:bg-horizon-900">
      <AdminSidebar />
      <div className="admin-content">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-display font-bold text-horizon-900 dark:text-horizon-100">Products</h1>
          <Link to="/admin/products/add" className="btn-primary text-xs">+ Add Product</Link>
        </div>
        <div className="bg-white dark:bg-horizon-800 overflow-hidden">
          {products.length === 0 ? (
            <div className="p-6 text-center text-horizon-400 text-sm">No products yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-horizon-400 text-[10px] uppercase tracking-wider bg-horizon-50 dark:bg-horizon-700">
                    <th className="p-4 font-medium">Product</th><th className="p-4 font-medium">Category</th><th className="p-4 font-medium">Price</th><th className="p-4 font-medium">Stock</th><th className="p-4 font-medium">Featured</th><th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} className="border-b border-horizon-50 dark:border-horizon-700 hover:bg-horizon-50/50 dark:hover:bg-horizon-700/50 transition-colors">
                      <td className="p-4"><div className="flex items-center gap-3">{product.image && <img src={product.image} alt="" className="w-10 h-12 object-cover bg-horizon-100 dark:bg-horizon-700" />}<span className="font-medium text-horizon-900 dark:text-horizon-100">{product.name}</span></div></td>
                      <td className="p-4 text-horizon-500 dark:text-horizon-300">{product.category}</td>
                      <td className="p-4 font-medium text-horizon-900 dark:text-horizon-100">${Number(product.price).toFixed(2)}</td>
                      <td className="p-4 text-horizon-600 dark:text-horizon-300">{product.stock}</td>
                      <td className="p-4"><span className={`text-[10px] uppercase px-2 py-0.5 ${product.featured ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-horizon-100 dark:bg-horizon-700 text-horizon-400 dark:text-horizon-500'}`}>{product.featured ? 'Yes' : 'No'}</span></td>
                      <td className="p-4"><div className="flex gap-2"><Link to={`/admin/products/edit/${product.id}`} className="text-xs text-horizon-500 hover:text-horizon-900 dark:hover:text-horizon-100 uppercase tracking-wider">Edit</Link><button onClick={() => handleDelete(product.id, product.name)} className="text-xs text-red-400 hover:text-red-600 uppercase tracking-wider">Delete</button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
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
        <Link to="/admin/products" className="block py-2.5 px-3 text-sm text-white bg-horizon-800 rounded">Products</Link>
        <Link to="/admin/orders" className="block py-2.5 px-3 text-sm text-horizon-300 hover:text-white hover:bg-horizon-800 rounded">Orders</Link>
        <Link to="/admin/coupons" className="block py-2.5 px-3 text-sm text-horizon-300 hover:text-white hover:bg-horizon-800 rounded">Coupons</Link>
        <Link to="/admin/messages" className="block py-2.5 px-3 text-sm text-horizon-300 hover:text-white hover:bg-horizon-800 rounded">Messages</Link>
      </nav>
      <Link to="/" className="block mt-10 text-xs text-horizon-500 hover:text-horizon-300 uppercase tracking-wider">Back to Store</Link>
    </div>
  )
}
