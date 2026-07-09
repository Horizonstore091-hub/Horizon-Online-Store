import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const defaultMeta = {
  title: 'Horizon - Premium Online Store',
  description: 'Discover premium products at Horizon. Shop the latest in fashion, tech, and lifestyle.',
}

export default function SEOHead({ title, description, ogImage }) {
  const { pathname } = useLocation()

  useEffect(() => {
    const page = pathname === '/' ? 'home' : pathname.slice(1).split('/')[0]
    fetch(`/api/page-meta/${page}`).then(r => r.json()).then(meta => {
      if (meta?.title) document.title = meta.title
      else document.title = title || defaultMeta.title
      setMeta('description', meta?.description || description || defaultMeta.description)
      if (meta?.ogImage) setMeta('og:image', meta.ogImage)
      else if (ogImage) setMeta('og:image', ogImage)
    }).catch(() => {
      document.title = title || defaultMeta.title
      setMeta('description', description || defaultMeta.description)
    })
  }, [pathname, title, description, ogImage])

  return null
}

function setMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`)
  if (!el) { el = document.createElement('meta'); if (name.startsWith('og:')) el.setAttribute('property', name); else el.setAttribute('name', name); document.head.appendChild(el) }
  el.setAttribute('content', content)
}
