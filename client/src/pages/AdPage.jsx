import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

const adSlugs = {
  'chronomaster-watch': { name: 'ChronoMaster Automatic Watch', tagline: 'Swiss Precision. Timeless Design.', discount: '35% OFF', color: 'bg-horizon-900' },
  'heritage-briefcase': { name: 'Heritage Leather Briefcase', tagline: 'Crafted for the Driven.', discount: '30% OFF', color: 'bg-amber-900' },
  'apex-headphones': { name: 'Apex Wireless Headphones', tagline: 'Hear the Difference.', discount: '25% OFF', color: 'bg-blue-900' },
  'merino-blazer': { name: 'Merino Wool Travel Blazer', tagline: 'Travel the World in Style.', discount: '25% OFF', color: 'bg-stone-900' },
}

export default function AdPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const ad = adSlugs[slug]

  useEffect(() => {
    if (!ad) return
    fetch(`/api/products?search=${encodeURIComponent(ad.name.split(' ')[0])}`)
      .then(r => r.json()).then(data => {
        const match = data.find(p => p.name === ad.name)
        if (match) setProduct(match)
      }).catch(() => {})
  }, [slug, ad])

  if (!ad) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center"><p className="text-horizon-400 text-lg mb-4">Ad not found</p><Link to="/shop" className="btn-primary">Shop Now</Link></div>
    </div>
  )

  return (
    <div className={`min-h-screen ${ad.color} text-white`}>
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            {product && (
              <img src={product.image} alt={ad.name} className="w-full max-w-md mx-auto rounded-lg shadow-2xl" />
            )}
          </div>
          <div className="order-1 md:order-2">
            <p className="text-amber-400 text-xs uppercase tracking-[0.25em] font-semibold mb-3">Exclusive Offer</p>
            <p className="text-5xl md:text-7xl font-bold text-amber-400 mb-4">{ad.discount}</p>
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-3">{ad.name}</h1>
            <p className="text-xl text-horizon-200 mb-8">{ad.tagline}</p>
            <ul className="space-y-2 text-sm text-horizon-200 mb-8">
              <li className="flex items-center gap-2"><svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" /></svg> Premium materials & craftsmanship</li>
              <li className="flex items-center gap-2"><svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" /></svg> Free shipping & 30-day returns</li>
              <li className="flex items-center gap-2"><svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" /></svg> Limited stock available</li>
            </ul>
            {product ? (
              <Link to={`/product/${product.id}`} className="bg-amber-400 text-horizon-900 px-10 py-4 text-sm font-bold uppercase tracking-wider hover:bg-amber-300 transition-all inline-block">
                Shop Now — ${Number(product.price).toFixed(2)}
              </Link>
            ) : (
              <Link to="/shop?search=watch" className="bg-amber-400 text-horizon-900 px-10 py-4 text-sm font-bold uppercase tracking-wider hover:bg-amber-300 transition-all inline-block">
                Shop Now
              </Link>
            )}
            <div className="mt-6 flex gap-4 text-xs text-horizon-400">
              <span>Secure checkout</span>
              <span>Free shipping</span>
              <span>30-day returns</span>
            </div>
          </div>
        </div>
      </div>
      <footer className="border-t border-white/10 py-6 text-center text-xs text-horizon-400">
        <div className="max-w-7xl mx-auto px-4">
          <p>&copy; 2025 HORIZON. All rights reserved. | <Link to="/privacy" className="hover:text-white">Privacy</Link> | <Link to="/terms" className="hover:text-white">Terms</Link></p>
        </div>
      </footer>
    </div>
  )
}
