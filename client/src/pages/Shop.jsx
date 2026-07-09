import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import SEOHead from '../components/SEOHead'

const categories = ['Electronics', 'Clothing', 'Gadgets', 'Home & Kitchen', 'Beauty', 'Accessories']

export default function Shop() {
  const { category } = useParams()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (searchQuery) params.set('search', searchQuery)
    const qs = params.toString()
    fetch(`/api/products${qs ? '?' + qs : ''}`)
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [category, searchQuery])

  const activeCat = category || 'all'
  const title = searchQuery ? `Search: "${searchQuery}"` : category || 'All Products'

  return (
    <div className="pt-24 md:pt-28">
      <SEOHead title={title + ' - Horizon'} description={`Browse our ${category || 'full'} collection at Horizon.`} />
      <div className="container-wide py-10">
        <div className="mb-10">
          <p className="section-subtitle">{category || (searchQuery ? 'Search Results' : 'The Collection')}</p>
          <h1 className="section-title mt-1">{title}</h1>
        </div>

        {!searchQuery && (
          <div className="flex flex-wrap gap-2 mb-10">
            <Link to="/shop" className={`px-4 py-2 text-xs uppercase tracking-wider font-medium border transition-all duration-300 ${activeCat === 'all' ? 'bg-horizon-900 dark:bg-horizon-100 text-white dark:text-horizon-900 border-horizon-900 dark:border-horizon-100' : 'border-horizon-200 dark:border-horizon-700 text-horizon-500 dark:text-horizon-400 hover:border-horizon-900 dark:hover:border-horizon-100 hover:text-horizon-900 dark:hover:text-horizon-100'}`}>All</Link>
            {categories.map(cat => (
              <Link key={cat} to={`/shop/${encodeURIComponent(cat)}`} className={`px-4 py-2 text-xs uppercase tracking-wider font-medium border transition-all duration-300 ${activeCat === cat ? 'bg-horizon-900 dark:bg-horizon-100 text-white dark:text-horizon-900 border-horizon-900 dark:border-horizon-100' : 'border-horizon-200 dark:border-horizon-700 text-horizon-500 dark:text-horizon-400 hover:border-horizon-900 dark:hover:border-horizon-100 hover:text-horizon-900 dark:hover:text-horizon-100'}`}>{cat}</Link>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse"><div className="aspect-[4/5] bg-horizon-100 dark:bg-horizon-800" /><div className="mt-4 space-y-2"><div className="h-3 bg-horizon-100 dark:bg-horizon-800 w-1/3" /><div className="h-4 bg-horizon-100 dark:bg-horizon-800 w-2/3" /><div className="h-4 bg-horizon-100 dark:bg-horizon-800 w-1/4" /></div></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-horizon-300 dark:text-horizon-400 text-lg">No products found.</p>
            <Link to="/shop" className="btn-primary mt-6 inline-flex">View All Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
