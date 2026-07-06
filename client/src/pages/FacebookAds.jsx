import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function FacebookAds() {
  const [products, setProducts] = useState([])
  const [timeLeft, setTimeLeft] = useState(3600 * 24 * 2)

  useEffect(() => {
    fetch('/api/products?featured=true').then(r => r.json()).then(data => setProducts(data.slice(0, 4))).catch(() => {})
    fetch('/api/admin/pages').then(r => r.json()).then(settings => {
      if (settings.ads_countdown_target) {
        const target = new Date(settings.ads_countdown_target).getTime()
        const diff = Math.floor((target - Date.now()) / 1000)
        if (diff > 0) setTimeLeft(diff)
      }
    }).catch(() => {})
    const timer = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000)
    return () => clearInterval(timer)
  }, [])

  const hours = Math.floor(timeLeft / 3600)
  const minutes = Math.floor((timeLeft % 3600) / 60)
  const seconds = timeLeft % 60

  return (
    <div className="min-h-screen bg-white dark:bg-horizon-950">
      {/* Hero */}
      <section className="relative bg-horizon-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920" alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-horizon-900/90 via-horizon-900/70 to-horizon-900" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
          <p className="text-amber-400 text-xs uppercase tracking-[0.25em] font-semibold mb-4">Limited Time Offer</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-4">The <span className="text-amber-400">Exclusive</span> Collection</h1>
          <p className="text-horizon-300 text-lg md:text-xl max-w-2xl mx-auto mb-8">Premium essentials at exceptional prices. Curated by HORIZON for those who demand the best.</p>
          <div className="flex justify-center gap-4 md:gap-8 mb-10">
            {[
              { label: 'Hours', value: hours },
              { label: 'Minutes', value: minutes },
              { label: 'Seconds', value: seconds },
            ].map(t => (
              <div key={t.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-white/10 backdrop-blur-sm px-4 md:px-6 py-3 rounded">{String(t.value).padStart(2, '0')}</div>
                <p className="text-[10px] uppercase tracking-wider text-horizon-400 mt-2">{t.label}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/shop" className="bg-amber-400 text-horizon-900 px-10 py-4 text-sm font-bold uppercase tracking-wider hover:bg-amber-300 transition-all">Shop the Sale</a>
            <a href="/shop" className="border-2 border-white text-white px-10 py-4 text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-horizon-900 transition-all">Explore Collection</a>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-10 border-y border-horizon-100 dark:border-horizon-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '50K+', label: 'Happy Customers' },
              { value: '4.9', label: 'Avg. Rating' },
              { value: '15K+', label: 'Orders Shipped' },
              { value: '30-Day', label: 'Free Returns' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-horizon-900 dark:text-horizon-100">{s.value}</p>
                <p className="text-xs text-horizon-400 dark:text-horizon-500 uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-horizon-400 dark:text-horizon-500 font-medium">Best Sellers</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-horizon-900 dark:text-horizon-100 mt-2">Trending Now</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map(p => (
              <a key={p.id} href={`/product/${p.id}`} className="group">
                <div className="aspect-square bg-horizon-50 dark:bg-horizon-800 overflow-hidden mb-3">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <p className="text-xs text-horizon-400 dark:text-horizon-500 uppercase tracking-wider">{p.category}</p>
                <h3 className="text-sm font-medium text-horizon-900 dark:text-horizon-100 mt-0.5">{p.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-horizon-900 dark:text-horizon-100">${Number(p.price).toFixed(2)}</span>
                  {p.comparePrice && <span className="text-xs text-horizon-300 dark:text-horizon-500 line-through">${Number(p.comparePrice).toFixed(2)}</span>}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-horizon-50 dark:bg-horizon-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-horizon-400 dark:text-horizon-500 font-medium">Real Reviews</p>
            <h2 className="text-3xl font-display font-bold text-horizon-900 dark:text-horizon-100 mt-2">What Customers Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah M.', text: 'The quality exceeded my expectations. The leather briefcase is absolutely stunning.', rating: 5 },
              { name: 'James K.', text: 'Shipping was incredibly fast and the watch looks even better in person. Already planning my next purchase.', rating: 5 },
              { name: 'Emily R.', text: 'I was hesitant about the price but the headphones are truly premium. Best investment for my setup.', rating: 5 },
            ].map(t => (
              <div key={t.name} className="bg-white dark:bg-horizon-800 p-8">
                <div className="flex gap-1 mb-4">{[...Array(t.rating)].map((_, i) => <span key={i} className="text-amber-400 text-lg">★</span>)}</div>
                <p className="text-horizon-600 dark:text-horizon-300 text-sm leading-relaxed mb-4">{t.text}</p>
                <p className="text-sm font-medium text-horizon-900 dark:text-horizon-100">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { title: 'Premium Quality', desc: 'Hand-selected from the world\'s finest makers' },
              { title: 'Free Returns', desc: '30-day satisfaction guarantee' },
              { title: 'Fast & Free', desc: 'Free express shipping over $200' },
              { title: 'Secure Checkout', desc: '256-bit SSL encryption' },
            ].map(item => (
              <div key={item.title} className="text-center">
                <h3 className="text-sm font-semibold text-horizon-900 dark:text-horizon-100 mb-1">{item.title}</h3>
                <p className="text-xs text-horizon-400 dark:text-horizon-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-horizon-900 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold mb-4">Don't Miss Out</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">This Offer Won't Last</h2>
          <p className="text-horizon-300 text-sm mb-8">Sale ends when the timer hits zero. Join thousands of happy customers.</p>
          <a href="/shop" className="bg-amber-400 text-horizon-900 px-12 py-4 text-sm font-bold uppercase tracking-wider hover:bg-amber-300 transition-all inline-block">Shop Now — Up to 40% Off</a>
        </div>
      </section>

      <footer className="bg-horizon-950 text-horizon-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs">
          <p>&copy; 2025 HORIZON. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-3">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/shop" className="hover:text-white transition-colors">Shop Now</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
