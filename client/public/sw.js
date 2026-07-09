const CACHE = 'horizon-v1'
const urlsToCache = ['/', '/shop', '/cart', '/login', '/register']

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(urlsToCache)))
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim())
})

self.addEventListener('fetch', e => {
  if (e.request.url.includes('/api/')) return
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (res.status === 200) {
        const clone = res.clone()
        caches.open(CACHE).then(cache => cache.put(e.request, clone))
      }
      return res
    }))
  )
})
