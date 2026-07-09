import { Link } from 'react-router-dom'
import { useRecentlyViewed } from '../context/RecentlyViewedContext'

export default function RecentlyViewed() {
  const { items } = useRecentlyViewed()
  if (!items || items.length === 0) return null

  return (
    <div className="container-wide py-10">
      <h2 className="text-lg font-display font-bold text-midnight-900 dark:text-white mb-6 uppercase tracking-wider">Recently Viewed</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.slice(0, 6).map(item => (
          <Link key={item.productId || item.id} to={`/product/${item.productId || item.id}`} className="group">
            <div className="aspect-square bg-gray-100 dark:bg-midnight-800 rounded-lg overflow-hidden mb-2">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No image</div>
              )}
            </div>
            <p className="text-xs text-midnight-900 dark:text-white truncate">{item.name || 'Product'}</p>
            {item.price && <p className="text-xs font-semibold text-horizon-600">${Number(item.price).toFixed(2)}</p>}
          </Link>
        ))}
      </div>
    </div>
  )
}
