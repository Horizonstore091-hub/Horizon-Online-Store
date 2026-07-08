import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function PromoAds() {
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
    <div className="min-h-screen bg-white dark:bg-midnight-950">
      <section className="relative bg-midnight-950 text-white overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920" alt="" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-midnight-950/95 via-midnight-950/80 to-midnight-950/40" />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-horizon-400 text-xs uppercase tracking-[0.25em] font-semibold mb-4">Limited Time Offer</p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-4">
              The <span className="gradient-text">Exclusive</span> Collection
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              Premium essentials at exceptional prices. Curated by Horizon for those who demand the best.
              Up to 40% off select items.
            </p>
            <div className="flex justify-center gap-4 md:gap-8 mb-10">
              {[
                { label: 'Hours', value: hours },
                { label: 'Minutes', value: minutes },
                { label: 'Seconds', value: seconds },
              ].map(t => (
                <div key={t.label} className="text-center">
                  <div className="text-3xl md:text-5xl font-bold glass px-5 md:px-8 py-3 md:py-4 rounded-2xl text-horizon-300">
                    {String(t.value).padStart(2, '0')}
                  </div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-2">{t.label}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop" className="btn-primary text-sm uppercase tracking-wider !px-10 !py-4">Shop the Sale</Link>
              <Link to="/shop" className="btn-secondary text-sm uppercase tracking-wider !text-white !border-white/30 hover:!bg-white/10 !px-10 !py-4">Explore Collection</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 border-y border-gray-100 dark:border-midnight-800 bg-horizon-50 dark:bg-midnight-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '50K+', label: 'Happy Customers', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
              { value: '4.9', label: 'Avg. Rating', icon: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z' },
              { value: '15K+', label: 'Orders Shipped', icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12' },
              { value: '30-Day', label: 'Free Returns', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            ].map(s => (
              <div key={s.label} className="text-center p-4">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-horizon-100 dark:bg-horizon-900/30 flex items-center justify-center">
                  <svg className="w-5 h-5 text-horizon-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.icon} /></svg>
                </div>
                <p className="text-2xl font-bold text-midnight-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-horizon-600 dark:text-horizon-400 text-xs uppercase tracking-[0.2em] font-medium">Best Sellers</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-midnight-900 dark:text-white mt-2">Trending Now</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-3 max-w-lg mx-auto">Our most popular picks at unbeatable prices — while they last.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map(p => (
              <Link key={p.id} to={`/product/${p.id}`} className="group">
                <div className="product-card overflow-hidden !p-0">
                  <div className="aspect-square overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">{p.category}</p>
                    <h3 className="text-sm font-medium text-midnight-900 dark:text-white mt-0.5 line-clamp-1">{p.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-midnight-900 dark:text-white">${Number(p.price).toFixed(2)}</span>
                      {p.comparePrice && <span className="text-xs text-gray-300 dark:text-gray-600 line-through">${Number(p.comparePrice).toFixed(2)}</span>}
                    </div>
                    {p.comparePrice && (
                      <div className="mt-2">
                        <span className="inline-block text-[10px] font-semibold text-white bg-red-500 px-2 py-0.5 rounded">
                          Save ${(Number(p.comparePrice) - Number(p.price)).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/shop" className="btn-outline">View All Deals</Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-horizon-50 dark:bg-midnight-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-horizon-600 dark:text-horizon-400 text-xs uppercase tracking-[0.2em] font-medium">Real Reviews</p>
            <h2 className="text-3xl font-display font-bold text-midnight-900 dark:text-white mt-2">What Our Customers Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah M.', text: 'The quality exceeded my expectations. The leather briefcase is absolutely stunning — worth every penny.', rating: 5, product: 'Heritage Leather Briefcase' },
              { name: 'James K.', text: 'Shipping was incredibly fast and the watch looks even better in person. Already planning my next purchase.', rating: 5, product: 'ChronoMaster Automatic Watch' },
              { name: 'Emily R.', text: 'I was hesitant about the price but the headphones are truly premium. Best investment for my home office setup.', rating: 4.5, product: 'Apex Wireless Headphones' },
            ].map(t => (
              <div key={t.name} className="glass-card p-8 text-center">
                <div className="flex justify-center gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-lg ${i < Math.floor(t.rating) ? 'text-amber-400' : i < t.rating ? 'text-amber-300' : 'text-gray-200 dark:text-gray-700'}`}>
                      {i < Math.floor(t.rating) ? '\u2605' : i < t.rating ? '\u2605' : '\u2605'}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <p className="text-sm font-medium text-midnight-900 dark:text-white">— {t.name}</p>
                <p className="text-xs text-gray-400 mt-1">{t.product}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { title: 'Premium Quality', desc: 'Hand-selected from the finest makers worldwide', icon: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z' },
              { title: 'Free Returns', desc: '30-day satisfaction guarantee, no questions asked', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
              { title: 'Fast & Free', desc: 'Free express shipping on all orders over $200', icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12' },
              { title: 'Secure Checkout', desc: '256-bit SSL encryption, your data is safe', icon: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z' },
            ].map(item => (
              <div key={item.title} className="admin-card text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-horizon-100 dark:bg-horizon-900/30 flex items-center justify-center">
                  <svg className="w-6 h-6 text-horizon-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} /></svg>
                </div>
                <h3 className="text-sm font-semibold text-midnight-900 dark:text-white mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-midnight-950 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-horizon-400 text-xs uppercase tracking-[0.25em] font-semibold mb-4">Don't Miss Out</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">This Offer Won't Last</h2>
          <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">Sale ends when the timer hits zero. Join thousands of happy Horizon customers who upgraded their lifestyle.</p>
          <Link to="/shop" className="btn-primary text-sm uppercase tracking-wider !px-12 !py-4 inline-block">Shop Now — Up to 40% Off</Link>
        </div>
      </section>

      <footer className="bg-midnight-950 border-t border-midnight-800 text-gray-500 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs">
          <p>&copy; 2026 Horizon. All rights reserved.</p>
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
