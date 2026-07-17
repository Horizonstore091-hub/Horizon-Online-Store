import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import RecentlyViewed from '../components/RecentlyViewed'
import SEOHead from '../components/SEOHead'

function RevealOnScroll({ children, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el) } }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>{children}</div>
}

const slides = [
  { image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920', title: 'Beyond Premium', subtitle: 'Curated essentials for the modern connoisseur', cta: 'Shop the Collection', link: '/shop' },
  { image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1920', title: 'Engineered for Adventure', subtitle: 'Precision gear for life without limits', cta: 'Explore Now', link: '/shop' },
  { image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=1920', title: 'Crafted by Hand', subtitle: 'Artisanal pieces from master makers around the world', cta: 'View Collection', link: '/shop' },
];

const categoryIcons = {
  'Accessories': (
    <svg className="w-20 h-20 text-white/15 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 scale-50 group-hover:scale-100 group-hover:opacity-100 opacity-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'Electronics': (
    <svg className="w-20 h-20 text-white/15 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 scale-50 group-hover:scale-100 group-hover:opacity-100 opacity-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
    </svg>
  ),
  'Clothing': (
    <svg className="w-20 h-20 text-white/15 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 scale-50 group-hover:scale-100 group-hover:opacity-100 opacity-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25V9m-4.5 0L3 21h18L8.25 9m0 0h7.5" />
    </svg>
  ),
  'Home & Kitchen': (
    <svg className="w-20 h-20 text-white/15 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 scale-50 group-hover:scale-100 group-hover:opacity-100 opacity-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
    </svg>
  ),
  'Beauty': (
    <svg className="w-20 h-20 text-white/15 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 scale-50 group-hover:scale-100 group-hover:opacity-100 opacity-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  ),
  'Gadgets': (
    <svg className="w-20 h-20 text-white/15 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 scale-50 group-hover:scale-100 group-hover:opacity-100 opacity-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  'Sports & Outdoors': (
    <svg className="w-20 h-20 text-white/15 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 scale-50 group-hover:scale-100 group-hover:opacity-100 opacity-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 01-2.77.896m0 0a6.023 6.023 0 01-2.77-.896" />
    </svg>
  ),
};

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [categories, setCategories] = useState([])
  const [reviews, setReviews] = useState([])
  const [slideIdx, setSlideIdx] = useState(0)
  const [subscribed, setSubscribed] = useState(false)
  const [promoText, setPromoText] = useState('')
  const [promoEnabled, setPromoEnabled] = useState(false)
  const [promoTimeLeft, setPromoTimeLeft] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
    fetch('/api/products?featured=true').then(r => r.json()).then(setFeatured).catch(() => {})
    fetch('/api/products').then(r => r.json()).then(all => setNewArrivals(all.slice(0, 4))).catch(() => {})
    fetch('/api/products/categories').then(r => r.json()).then(setCategories).catch(() => {})
    fetch('/api/admin/pages').then(r => r.json()).then(data => {
      setPromoText(data.promo_banner_text || 'Free shipping on all orders over $200 - use code FREESHIP')
      setPromoEnabled(data.promo_banner_enabled === '1')
      if (data.promo_banner_target) {
        const target = new Date(data.promo_banner_target).getTime()
        const diff = Math.floor((target - Date.now()) / 1000)
        if (diff > 0) setPromoTimeLeft(diff)
      }
    }).catch(() => {})
    fetch('/api/reviews').then(r => r.json()).then(data => { if (data.length >= 3) setReviews(data.slice(0, 3)) }).catch(() => {
      setReviews([
        { userName: 'Sarah M.', text: 'The quality exceeded my expectations. The leather briefcase is absolutely stunning.', rating: 5, product: 'Heritage Leather Briefcase' },
        { userName: 'James K.', text: 'Shipping was fast and the watch is stunning. Will definitely order again.', rating: 4, product: 'ChronoMaster Automatic Watch' },
        { userName: 'Emily R.', text: 'The ceramic set is beautiful. Each piece feels handmade and unique.', rating: 5, product: 'Artisan Ceramic Set' },
      ])
    })
    const timer = setInterval(() => setPromoTimeLeft(t => Math.max(0, t - 1)), 1000)
    const interval = setInterval(() => setSlideIdx(i => (i + 1) % slides.length), 6000)
    return () => { clearInterval(interval); clearInterval(timer) }
  }, [])

  const handleSubscribe = async e => { e.preventDefault(); const email = e.target.querySelector('input[type=email]').value; try { await fetch('/api/newsletter/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, source: 'homepage' }) }) } catch {}; setSubscribed(true); setTimeout(() => setSubscribed(false), 4000) }

  return (
    <div>
      {promoEnabled && (
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white text-center py-2.5 text-xs tracking-wider flex items-center justify-center gap-3 flex-wrap">
          <span>{promoText}</span>
          {promoTimeLeft > 0 && (
            <span className="inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" /></svg>
              {Math.floor(promoTimeLeft / 3600)}h {Math.floor((promoTimeLeft % 3600) / 60)}m {promoTimeLeft % 60}s
            </span>
          )}
        </div>
      )}

      <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
        {slides.map((s, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === slideIdx ? 'opacity-100' : 'opacity-0'}`}>
            <img src={s.image} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-midnight-950/80 via-midnight-950/50 to-transparent" />
          </div>
        ))}
        <div className="relative z-10 h-full flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl animate-fade-in" key={slideIdx}>
            <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-horizon-400 animate-pulse" />
              <span className="text-horizon-200 text-[10px] uppercase tracking-[0.25em] font-medium">New Collection 2026</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white leading-tight mb-6">{slides[slideIdx].title}</h1>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-10 max-w-lg">{slides[slideIdx].subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={slides[slideIdx].link} className="btn-primary text-sm uppercase tracking-wider">{slides[slideIdx].cta}</Link>
              <Link to="/blog" className="btn-secondary text-sm uppercase tracking-wider !text-white !border-white/30 hover:!bg-white/10">Read Our Journal</Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setSlideIdx(i)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === slideIdx ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/60'}`} />
          ))}
        </div>
      </section>

      {categories.length > 0 && (
        <RevealOnScroll>
          <section className="py-20 max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-horizon-600 dark:text-horizon-400 text-sm uppercase tracking-[0.2em] font-medium">Browse</p>
              <h2 className="section-title mt-2">Shop by Category</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat, idx) => (
                <Link key={cat} to={`/shop/${encodeURIComponent(cat)}`}
                  className="group relative aspect-square glass-card flex items-center justify-center p-4 hover:bg-horizon-600 hover:text-white dark:hover:bg-horizon-700 transition-all duration-500 overflow-hidden">
                  {categoryIcons[cat] || (
                    <svg className="w-20 h-20 text-white/15 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 scale-50 group-hover:scale-100 group-hover:opacity-100 opacity-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  )}
                  <span className="relative text-sm font-medium text-midnight-900 dark:text-white group-hover:text-white transition-colors text-center z-10">{cat}</span>
                </Link>
              ))}
            </div>
          </section>
        </RevealOnScroll>
      )}

      <RevealOnScroll>
        <section className="py-20 bg-horizon-50 dark:bg-midnight-900/50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-horizon-600 dark:text-horizon-400 text-sm uppercase tracking-[0.2em] font-medium">Curated Collection</p>
              <h2 className="section-title mt-2">Best Sellers</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-md mx-auto text-sm">Each item selected for exceptional quality, design, and craftsmanship.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {featured.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            <div className="text-center mt-12">
              <Link to="/shop" className="btn-primary">View All Products</Link>
            </div>
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <section className="py-20 max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-horizon-600 dark:text-horizon-400 text-sm uppercase tracking-[0.2em] font-medium">Latest</p>
            <h2 className="section-title mt-2">New Arrivals</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="text-center mt-10">
            <Link to="/shop" className="btn-outline">Discover More</Link>
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <section className="py-20 bg-midnight-950 text-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-horizon-400 text-xs uppercase tracking-[0.25em] font-medium mb-4">The Horizon Standard</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Quality You Can Feel</h2>
            <p className="text-gray-400 max-w-lg mx-auto text-sm leading-relaxed mb-10">We partner with the world's finest makers to bring you products that last. Every item is rigorously tested and backed by our satisfaction guarantee.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-3xl mx-auto">
              {['Premium Materials', 'Free Returns', 'Fast Shipping', 'Secure Checkout'].map(item => (
                <div key={item} className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-horizon-600/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-horizon-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-xs uppercase tracking-[0.15em] text-gray-400 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <section className="py-20 max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-horizon-600 dark:text-horizon-400 text-sm uppercase tracking-[0.2em] font-medium">Real Reviews</p>
            <h2 className="section-title mt-2">What Our Customers Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((r, idx) => (
              <div key={r.userName || r.id} className="admin-card p-8">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => <span key={i} className={`text-sm ${i < r.rating ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}>★</span>)}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">{r.text}</p>
                <p className="text-sm font-medium text-midnight-900 dark:text-white">{r.userName || r.name}</p>
                <p className="text-xs text-gray-400">{r.product}</p>
              </div>
            ))}
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <section className="py-20 bg-horizon-50 dark:bg-midnight-900/50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-xl mx-auto text-center">
              <p className="text-horizon-600 dark:text-horizon-400 text-sm uppercase tracking-[0.2em] font-medium">Stay Connected</p>
              <h2 className="section-title mt-2 mb-4">Join the Horizon Circle</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Subscribe for early access to new drops, exclusive offers, and curated style inspiration.</p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input type="email" placeholder="Enter your email" className="input-field flex-1" required />
                <button type="submit" className="btn-primary whitespace-nowrap">Subscribe</button>
              </form>
            </div>
          </div>
        </section>
      </RevealOnScroll>

      <SEOHead title="Horizon - Premium Online Store" description="Discover premium products at Horizon. Shop the latest in fashion, tech, and lifestyle." />
      <RecentlyViewed />
      {subscribed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setSubscribed(false)}>
          <div className="glass-card p-8 max-w-sm mx-4 text-center animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 bg-horizon-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-2">Thank You!</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">You've been added to our mailing list. Welcome to the Horizon community.</p>
            <button onClick={() => setSubscribed(false)} className="btn-primary text-sm">Continue</button>
          </div>
        </div>
      )}
    </div>
  )
}
