import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'

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
    <div className="flex min-h-screen bg-gray-50 dark:bg-midnight-950">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-midnight-900 dark:text-white">Products</h1>
          <Link to="/admin/products/add" className="btn-primary text-xs">+ Add Product</Link>
        </div>
        <div className="admin-card overflow-hidden !p-0">
          {products.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No products yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-admin w-full text-sm">
                <thead className="bg-gray-50 dark:bg-midnight-800/50">
                  <tr className="text-left text-gray-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-medium">Product</th><th className="p-4 font-medium">Category</th><th className="p-4 font-medium">Price</th><th className="p-4 font-medium">Stock</th><th className="p-4 font-medium">Featured</th><th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-midnight-800">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-midnight-800/30 transition-colors">
                      <td className="p-4"><div className="flex items-center gap-3">{product.image && <img src={product.image} alt="" className="w-10 h-12 object-cover bg-gray-100 dark:bg-midnight-800 rounded" />}<span className="font-medium text-midnight-900 dark:text-white">{product.name}</span></div></td>
                      <td className="p-4 text-gray-500 dark:text-gray-400">{product.category}</td>
                      <td className="p-4 font-medium text-midnight-900 dark:text-white">${Number(product.price).toFixed(2)}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">{product.stock}</td>
                      <td className="p-4"><span className={`text-[10px] uppercase px-2 py-0.5 rounded-full ${product.featured ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-gray-100 dark:bg-midnight-800 text-gray-400 dark:text-gray-500'}`}>{product.featured ? 'Yes' : 'No'}</span></td>
                      <td className="p-4"><div className="flex gap-2"><Link to={`/admin/products/edit/${product.id}`} className="text-xs text-blue-500 hover:text-blue-700 uppercase tracking-wider">Edit</Link><button onClick={() => handleDelete(product.id, product.name)} className="text-xs text-red-500 hover:text-red-700 uppercase tracking-wider">Delete</button></div></td>
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

