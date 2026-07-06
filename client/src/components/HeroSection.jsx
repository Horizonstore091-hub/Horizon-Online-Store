import { Link } from 'react-router-dom'

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-horizon-900 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920"
          alt=""
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-horizon-900 via-horizon-900/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-xl animate-fade-in">
          <p className="text-horizon-300 text-xs uppercase tracking-[0.25em] font-medium mb-4">
            New Collection 2026
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight mb-6">
            Essentials
            <br />
            <span className="text-horizon-200">Reimagined.</span>
          </h1>
          <p className="text-horizon-300 text-base md:text-lg leading-relaxed mb-10 max-w-md">
            Curated pieces designed for the way you live. Premium materials, timeless design, uncompromising quality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/shop" className="btn-primary bg-white text-horizon-900 hover:bg-horizon-100">
              Shop the Collection
            </Link>
            <Link to="/shop/New%20Arrivals" className="btn-outline border-white text-white hover:bg-white hover:text-horizon-900">
              View Lookbook
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </section>
  )
}
