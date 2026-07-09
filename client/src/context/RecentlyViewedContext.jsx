import { createContext, useContext, useEffect, useState } from 'react'

const RecentlyViewedContext = createContext()

export function RecentlyViewedProvider({ children }) {
  const [items, setItems] = useState([])

  const trackView = (productId) => {
    try {
      const auth = JSON.parse(localStorage.getItem('horizon-auth'))
      const userId = auth?.id || auth?.user?.id
      if (!userId) return
      fetch('/api/recently-viewed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId })
      }).catch(() => {})
      // Update local state
      setItems(prev => {
        const filtered = prev.filter(i => i.productId !== productId || !i.productId)
        return [{ productId, viewedAt: new Date().toISOString() }, ...filtered].slice(0, 12)
      })
    } catch {}
  }

  useEffect(() => {
    try {
      const auth = JSON.parse(localStorage.getItem('horizon-auth'))
      const userId = auth?.id || auth?.user?.id
      if (userId) fetch(`/api/recently-viewed/${userId}`).then(r => r.json()).then(setItems).catch(() => {})
    } catch {}
  }, [])

  return (
    <RecentlyViewedContext.Provider value={{ items, trackView }}>
      {children}
    </RecentlyViewedContext.Provider>
  )
}

export const useRecentlyViewed = () => useContext(RecentlyViewedContext)
