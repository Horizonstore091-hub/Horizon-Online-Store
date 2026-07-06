import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProductCard from '../components/ProductCard'

export default function WishlistPage() {
  const { token, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState([])

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return }
    fetch(`/api/wishlist/${token}`).then(r => r.json()).then(data => setItems(data || [])).catch(() => {})
  }, [token, isLoggedIn, navigate])

  const handleRemove = async (productId) => {
    try {
      await fetch('/api/wishlist', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: token, productId })
      })
      setItems(items.filter(i => i.productId !== productId))
    } catch {}
  }

  return (
    <div className="pt-24 md:pt-28">
      <div className="container-wide py-16 md:py-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="section-subtitle">Account</p>
            <h1 className="section-title mt-1">My Wishlist</h1>
          </div>
          <Link to="/shop" className="btn-outline text-xs">Shop</Link>
        </div>

        {items.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-horizon-400 dark:text-horizon-500 text-sm mb-4">Your wishlist is empty.</p>
            <Link to="/shop" className="btn-primary">Discover Products</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.wid} className="card p-4 flex items-center gap-4">
                <Link to={`/product/${item.productId}`} className="w-16 h-20 bg-horizon-50 dark:bg-horizon-800 overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.productId}`}><h3 className="text-sm font-medium text-horizon-900 dark:text-horizon-100 hover:text-horizon-600 dark:hover:text-horizon-300">{item.name}</h3></Link>
                  <p className="text-xs text-horizon-400 mt-0.5">{item.category}</p>
                  <p className="text-sm font-semibold text-horizon-900 dark:text-horizon-100 mt-1">${Number(item.price).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Link to={`/product/${item.productId}`} className="btn-primary text-xs px-4 py-2">View</Link>
                  <button onClick={() => handleRemove(item.productId)} className="text-xs text-horizon-400 hover:text-red-500 uppercase tracking-wider">Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
