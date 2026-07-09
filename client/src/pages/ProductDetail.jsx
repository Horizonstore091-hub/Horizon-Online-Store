import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'
import SEOHead from '../components/SEOHead'
import { useRecentlyViewed } from '../context/RecentlyViewedContext'

export default function ProductDetail() {
  const { id } = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [reviews, setReviews] = useState([])
  const [reviewStats, setReviewStats] = useState({ avg: 0, count: 0 })
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [wishlisted, setWishlisted] = useState(false)
  const [reviewForm, setReviewForm] = useState({ userName: '', rating: 5, title: '', text: '' })
  const { trackView } = useRecentlyViewed()

  useEffect(() => {
    setLoading(true)
    fetch(`/api/products/${id}`).then(r => r.json()).then(data => {
      setProduct(data)
      setLoading(false)
      if (data.category) {
        fetch(`/api/products?category=${encodeURIComponent(data.category)}`).then(r => r.json()).then(all => setRelated(all.filter(p => p.id !== data.id).slice(0, 4))).catch(() => {})
      }
      trackView(id)
    }).catch(() => setLoading(false))
    fetch(`/api/reviews/product/${id}`).then(r => r.json()).then(d => { setReviews(d.reviews || []); setReviewStats({ avg: d.avg, count: d.count }) }).catch(() => {})
    try {
      const auth = JSON.parse(localStorage.getItem('horizon-auth'))
      const uid = auth?.user?.id || auth?.id
      if (uid) fetch(`/api/wishlist/${uid}`).then(r => r.json()).then(list => { if (list.some(i => i.productId == id)) setWishlisted(true) }).catch(() => {})
    } catch {}
  }, [id])

  const handleAdd = () => { addItem(product, qty); setAdded(true); setTimeout(() => setAdded(false), 2500) }

  const handleWishlist = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem('horizon-auth'))
      const uid = auth?.user?.id || auth?.id
      if (!uid) return
      if (wishlisted) {
        await fetch('/api/wishlist', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: uid, productId: id }) })
        setWishlisted(false)
      } else {
        await fetch('/api/wishlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: uid, productId: id, name: product.name, price: product.price, image: product.image, category: product.category }) })
        setWishlisted(true)
      }
    } catch {}
  }

  const handleReviewSubmit = async e => {
    e.preventDefault()
    if (!reviewForm.userName || !reviewForm.text) return
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...reviewForm, productId: id, rating: parseInt(reviewForm.rating) })
      })
      if (res.ok) {
        const r = await res.json()
        setReviews(prev => [r, ...prev])
        setReviewForm({ userName: '', rating: 5, title: '', text: '' })
      }
    } catch {}
  }

  if (loading) return (
    <div className="pt-24 md:pt-28"><div className="container-wide py-10"><div className="grid md:grid-cols-2 gap-12 animate-pulse"><div className="aspect-[4/5] bg-horizon-100 dark:bg-horizon-800" /><div className="space-y-4"><div className="h-4 bg-horizon-100 dark:bg-horizon-800 w-1/4" /><div className="h-8 bg-horizon-100 dark:bg-horizon-800 w-3/4" /><div className="h-6 bg-horizon-100 dark:bg-horizon-800 w-1/4" /><div className="h-24 bg-horizon-100 dark:bg-horizon-800" /></div></div></div></div>
  )

  if (!product) return (
    <div className="pt-24 md:pt-28"><div className="container-wide py-20 text-center"><p className="text-horizon-400 text-lg">Product not found.</p><Link to="/shop" className="btn-primary mt-6 inline-flex">Continue Shopping</Link></div></div>
  )

  const images = (() => { try { return JSON.parse(product.images || '[]') } catch { return [] } })()
  const features = (() => { try { return JSON.parse(product.features || '[]') } catch { return [] } })()
  const specs = (() => { try { return JSON.parse(product.specifications || '{}') } catch { return {} } })()

  return (
    <div className="pt-24 md:pt-28">
      <SEOHead title={product.name + ' - Horizon'} description={product.description?.slice(0, 160)} ogImage={product.image} />
      <div className="container-wide py-10">
        {/* Breadcrumbs */}
        <nav className="text-xs text-horizon-400 uppercase tracking-wider mb-8">
          <Link to="/" className="hover:text-horizon-900 dark:hover:text-horizon-100">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-horizon-900 dark:hover:text-horizon-100">Shop</Link>
          <span className="mx-2">/</span>
          <Link to={`/shop/${encodeURIComponent(product.category)}`} className="hover:text-horizon-900 dark:hover:text-horizon-100">{product.category}</Link>
          <span className="mx-2">/</span>
          <span className="text-horizon-900 dark:text-horizon-100">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
          {/* Images */}
          <div>
            <div className="aspect-[4/5] bg-horizon-50 dark:bg-horizon-800 overflow-hidden mb-4">
              <img src={images[selectedImage] || product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={`w-16 h-20 flex-shrink-0 border-2 overflow-hidden ${selectedImage === i ? 'border-horizon-900 dark:border-horizon-100' : 'border-transparent'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <p className="text-[10px] uppercase tracking-[0.2em] text-horizon-400 font-medium mb-2">{product.category}</p>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-horizon-900 dark:text-horizon-100 mb-2">{product.name}</h1>

            {reviewStats.count > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <span key={i} className={`text-xs ${i < Math.round(reviewStats.avg) ? 'text-amber-400' : 'text-horizon-200 dark:text-horizon-700'}`}>★</span>)}</div>
                <span className="text-xs text-horizon-400">{reviewStats.avg} ({reviewStats.count} {reviewStats.count === 1 ? 'review' : 'reviews'})</span>
              </div>
            )}

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-2xl font-semibold text-horizon-900 dark:text-horizon-100">${Number(product.price).toFixed(2)}</span>
              {product.comparePrice && <span className="text-base text-horizon-300 dark:text-horizon-500 line-through">${Number(product.comparePrice).toFixed(2)}</span>}
              {product.comparePrice && <span className="text-xs text-red-500 font-medium">Save ${(product.comparePrice - product.price).toFixed(2)}</span>}
            </div>

            <p className="text-horizon-500 dark:text-horizon-300 text-sm leading-relaxed mb-6">{product.description}</p>

            {/* Features */}
            {features.length > 0 && (
              <div className="mb-6 pb-6 border-b border-horizon-100 dark:border-horizon-700">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-horizon-900 dark:text-horizon-100 mb-3">Key Features</h3>
                <ul className="space-y-1.5">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-horizon-600 dark:text-horizon-300">
                      <svg className="w-4 h-4 text-horizon-900 dark:text-horizon-100 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {Object.keys(specs).length > 0 && (
              <div className="mb-6 pb-6 border-b border-horizon-100 dark:border-horizon-700">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-horizon-900 dark:text-horizon-100 mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {Object.entries(specs).map(([k, v]) => (
                    <div key={k} className="text-sm"><span className="text-horizon-400">{k}:</span> <span className="text-horizon-600 dark:text-horizon-300">{v}</span></div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="mb-4">
              <p className="text-xs uppercase tracking-wider text-horizon-400 font-medium mb-2">Quantity</p>
              <div className="flex items-center border border-horizon-200 dark:border-horizon-700 w-32">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-horizon-600 dark:text-horizon-300 hover:text-horizon-900 dark:hover:text-horizon-100 transition-colors">−</button>
                <span className="flex-1 text-center text-sm font-medium py-2 text-horizon-900 dark:text-horizon-100">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-3 py-2 text-horizon-600 dark:text-horizon-300 hover:text-horizon-900 dark:hover:text-horizon-100 transition-colors">+</button>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleAdd} className={`flex-1 py-3.5 text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 ${added ? 'bg-green-600 text-white' : 'bg-horizon-900 dark:bg-horizon-100 text-white dark:text-horizon-900 hover:bg-horizon-700 dark:hover:bg-horizon-200'}`}>{added ? 'Added to Cart' : 'Add to Cart'}</button>
              <button onClick={handleWishlist} className={`px-4 py-3.5 border transition-all duration-300 ${wishlisted ? 'border-red-400 text-red-500 bg-red-50 dark:bg-red-900/20' : 'border-horizon-200 dark:border-horizon-700 text-horizon-600 dark:text-horizon-300 hover:border-red-400 hover:text-red-500'}`}>
                <svg className={`w-5 h-5 ${wishlisted ? 'heart-pop fill-red-500' : ''}`} fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
              </button>
              <Link to="/cart" className="px-6 py-3.5 border border-horizon-200 dark:border-horizon-700 text-horizon-600 dark:text-horizon-300 hover:border-horizon-900 dark:hover:border-horizon-100 hover:text-horizon-900 dark:hover:text-horizon-100 text-xs uppercase tracking-wider font-medium transition-all duration-300">View Cart</Link>
            </div>

            {/* Shipping & Returns */}
            <div className="mt-6 pt-6 border-t border-horizon-100 dark:border-horizon-700 space-y-2">
              <div className="flex items-center gap-2 text-xs text-horizon-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                Free shipping on orders over $200
              </div>
              <div className="flex items-center gap-2 text-xs text-horizon-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                30-day return policy, no questions asked
              </div>
              <div className="flex items-center gap-2 text-xs text-horizon-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                Secure checkout with 256-bit SSL
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-16 pt-12 border-t border-horizon-100 dark:border-horizon-700">
          <div className="max-w-3xl">
            <h2 className="text-xl font-display font-bold text-horizon-900 dark:text-horizon-100 mb-8">Customer Reviews</h2>
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.slice(0, 5).map(r => (
                  <div key={r.id} className="pb-6 border-b border-horizon-50 dark:border-horizon-800">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <span key={i} className={`text-xs ${i < r.rating ? 'text-amber-400' : 'text-horizon-200 dark:text-horizon-700'}`}>★</span>)}</div>
                      {r.title && <span className="text-sm font-medium text-horizon-900 dark:text-horizon-100">{r.title}</span>}
                    </div>
                    <p className="text-sm text-horizon-600 dark:text-horizon-300 mb-1">{r.text}</p>
                    <p className="text-xs text-horizon-400">{r.userName} — {new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-horizon-400 mb-6">No reviews yet. Be the first to review this product.</p>
            )}
            <form onSubmit={handleReviewSubmit} className="mt-8 card p-6 space-y-4">
              <h3 className="text-sm font-semibold text-horizon-900 dark:text-horizon-100">Write a Review</h3>
              <div className="grid grid-cols-2 gap-3">
                <input value={reviewForm.userName} onChange={e => setReviewForm({ ...reviewForm, userName: e.target.value })} placeholder="Your name" required className="input-field" />
                <select value={reviewForm.rating} onChange={e => setReviewForm({ ...reviewForm, rating: e.target.value })} className="input-field">
                  {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <input value={reviewForm.title} onChange={e => setReviewForm({ ...reviewForm, title: e.target.value })} placeholder="Review title (optional)" className="input-field" />
              <textarea value={reviewForm.text} onChange={e => setReviewForm({ ...reviewForm, text: e.target.value })} placeholder="Your review..." required rows={3} className="input-field resize-none" />
              <button type="submit" className="btn-primary">Submit Review</button>
            </form>
          </div>
        </section>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-16 pt-12 border-t border-horizon-100 dark:border-horizon-700">
            <h2 className="text-xl font-display font-bold text-horizon-900 dark:text-horizon-100 mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
