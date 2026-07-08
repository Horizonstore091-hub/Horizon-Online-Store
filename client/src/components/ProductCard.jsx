import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const { isLoggedIn, token } = useAuth()
  const [wishlisted, setWishlisted] = useState(false)

  useEffect(() => {
    if (!isLoggedIn || !token) return
    fetch(`/api/wishlist/${token}`).then(r => r.json()).then(list => {
      if (list.some(i => i.productId == product.id)) setWishlisted(true)
    }).catch(() => {})
  }, [token, isLoggedIn, product.id])

  const handleWishlist = async e => {
    e.preventDefault()
    e.stopPropagation()
    if (!isLoggedIn) return window.location.href = '/login'
    try {
      if (wishlisted) {
        await fetch('/api/wishlist', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: token, productId: product.id }) })
        setWishlisted(false)
      } else {
        await fetch('/api/wishlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: token, productId: product.id }) })
        setWishlisted(true)
      }
    } catch {}
  }

  return (
    <div className="product-card group">
      <Link to={`/product/${product.id}`} className="block">
        <div className="product-card-image aspect-[4/5]">
          <img src={product.image || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
          <div className="product-card-overlay" />
          {product.comparePrice && <span className="absolute top-3 left-3 bg-white/90 dark:bg-horizon-900/90 text-horizon-900 dark:text-horizon-100 text-[10px] font-semibold uppercase tracking-wider px-2 py-1">Sale</span>}
          {product.stock === 0 ? (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-1">Sold Out</span>
          ) : product.stock <= (product.lowStockAlert || 5) && (
            <span className={`absolute ${product.comparePrice ? 'top-12' : 'top-3'} left-3 bg-amber-500 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-1`}>Low Stock</span>
          )}
          <button onClick={handleWishlist} className={`absolute top-3 right-3 p-2 rounded-full transition-all ${wishlisted ? 'bg-red-50 dark:bg-red-900/30' : 'bg-white/80 dark:bg-horizon-900/80 opacity-0 group-hover:opacity-100 hover:bg-white dark:hover:bg-horizon-900'}`}>
            <svg className={`w-4 h-4 transition-all ${wishlisted ? 'text-red-500 fill-red-500 heart-pop' : 'text-horizon-600 dark:text-horizon-300'}`} fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
          </button>
        </div>
      </Link>
      <div className="mt-4 space-y-1">
        <p className="text-[10px] uppercase tracking-[0.15em] text-horizon-400 dark:text-horizon-500 font-medium">{product.category}</p>
        <Link to={`/product/${product.id}`}><h3 className="text-sm font-medium text-horizon-900 dark:text-horizon-100 group-hover:text-horizon-600 dark:group-hover:text-horizon-300 transition-colors">{product.name}</h3></Link>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-horizon-900 dark:text-horizon-100">${Number(product.price).toFixed(2)}</span>
          {product.comparePrice && <span className="text-xs text-horizon-300 dark:text-horizon-500 line-through">${Number(product.comparePrice).toFixed(2)}</span>}
        </div>
      </div>
      <button onClick={() => addItem(product)} className="mt-3 w-full py-2.5 text-xs uppercase tracking-[0.15em] font-medium bg-horizon-900 dark:bg-horizon-100 text-white dark:text-horizon-900 hover:bg-horizon-700 dark:hover:bg-horizon-200 transition-all duration-300">Add to Cart</button>
    </div>
  )
}
