import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Logo from './Logo'

const categories = ['Electronics', 'Clothing', 'Gadgets', 'Home & Kitchen', 'Beauty', 'Accessories']

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [catOpen, setCatOpen] = useState(false)
  const [notifCount, setNotifCount] = useState(0)
  const [walletBalance, setWalletBalance] = useState(null)
  const { itemCount } = useCart()
  const { isLoggedIn, user, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const searchRef = useRef(null)
  const catRef = useRef(null)

  useEffect(() => { setMenuOpen(false); setSearchOpen(false); setCatOpen(false) }, [location])
  useEffect(() => { if (searchOpen && searchRef.current) searchRef.current.focus() }, [searchOpen])
  useEffect(() => {
    function handleClick(e) { if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    try {
      const auth = JSON.parse(localStorage.getItem('horizon-auth'))
      const uid = auth?.user?.id || auth?.id
      if (uid) {
        fetch(`/api/users/${uid}/notifications`).then(r => r.json()).then(data => {
          setNotifCount(data.filter ? data.filter(n => !n.read).length : 0)
        }).catch(() => {})
        fetch(`/api/users/${uid}`).then(r => r.json()).then(p => {
          if (p.walletBalance !== undefined) setWalletBalance(p.walletBalance)
        }).catch(() => {})
      }
    } catch {}
  }, [])

  const handleSearch = e => {
    e.preventDefault()
    if (searchQuery.trim()) { navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`); setSearchOpen(false); setSearchQuery('') }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center"><Logo className="h-8" /></Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className={`text-xs uppercase tracking-[0.15em] font-medium transition-colors ${location.pathname === '/' ? 'text-midnight-900 dark:text-white' : 'text-gray-400 hover:text-midnight-900 dark:hover:text-white'}`}>Home</Link>
            <div className="relative" ref={catRef}>
              <button onClick={() => setCatOpen(!catOpen)} className={`text-xs uppercase tracking-[0.15em] font-medium transition-colors flex items-center gap-1 ${location.pathname.startsWith('/shop') ? 'text-midnight-900 dark:text-white' : 'text-gray-400 hover:text-midnight-900 dark:hover:text-white'}`}>
                Shop
                <svg className={`w-3 h-3 transition-transform ${catOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
              </button>
              {catOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 glass rounded-xl premium-shadow-lg py-2 animate-slide-down z-50">
                  <Link to="/shop" className="block px-4 py-2 text-xs uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-midnight-800">All Products</Link>
                  {categories.map(cat => (
                    <Link key={cat} to={`/shop/${encodeURIComponent(cat)}`} className="block px-4 py-2 text-xs uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-midnight-800">{cat}</Link>
                  ))}
                </div>
              )}
            </div>
            <Link to="/blog" className={`text-xs uppercase tracking-[0.15em] font-medium transition-colors ${location.pathname === '/blog' ? 'text-midnight-900 dark:text-white' : 'text-gray-400 hover:text-midnight-900 dark:hover:text-white'}`}>Journal</Link>
            <Link to="/about" className={`text-xs uppercase tracking-[0.15em] font-medium transition-colors ${location.pathname === '/about' ? 'text-midnight-900 dark:text-white' : 'text-gray-400 hover:text-midnight-900 dark:hover:text-white'}`}>About</Link>
            <Link to="/contact" className={`text-xs uppercase tracking-[0.15em] font-medium transition-colors ${location.pathname === '/contact' ? 'text-midnight-900 dark:text-white' : 'text-gray-400 hover:text-midnight-900 dark:hover:text-white'}`}>Contact</Link>
          </nav>

          <div className="flex items-center gap-1">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-gray-600 dark:text-gray-200 hover:text-midnight-900 dark:hover:text-white transition-colors dark:border dark:border-midnight-600 dark:rounded-lg" title="Search">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
            </button>
            <button onClick={toggle} className="p-2 text-gray-600 dark:text-gray-200 hover:text-midnight-900 dark:hover:text-white transition-colors dark:border dark:border-midnight-600 dark:rounded-lg" title="Toggle theme">
              {dark ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
              )}
            </button>
            <Link to="/profile" className="relative p-2 text-gray-600 dark:text-gray-200 hover:text-midnight-900 dark:hover:text-white transition-colors" title="Notifications">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
              {notifCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-horizon-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{notifCount > 9 ? '9+' : notifCount}</span>}
            </Link>
            <Link to="/wishlist" className="p-2 text-gray-600 dark:text-gray-200 hover:text-midnight-900 dark:hover:text-white transition-colors" title="Wishlist">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
            </Link>
            <Link to="/cart" className="relative p-2 text-gray-600 dark:text-gray-200 hover:text-midnight-900 dark:hover:text-white transition-colors" title="Cart">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
              {itemCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-midnight-900 dark:bg-white text-white dark:text-midnight-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{itemCount}</span>}
            </Link>
            {isLoggedIn ? (
              <div className="hidden md:flex items-center gap-2 ml-1">
                {user?.role === 'admin' && <Link to="/admin" className="text-[10px] uppercase tracking-wider text-horizon-600 dark:text-horizon-400 hover:text-horizon-700 transition-colors">Admin</Link>}
                <Link to="/profile" className="p-2 text-gray-600 dark:text-gray-200 hover:text-midnight-900 dark:hover:text-white transition-colors" title="Profile">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                </Link>
                <span className="text-xs text-gray-700 dark:text-gray-200 max-w-[80px] truncate">{user?.name}</span>
                {walletBalance !== null && <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">${Number(walletBalance).toFixed(2)}</span>}
                <Link to="/profile" className="btn-primary text-[10px] !py-1.5 !px-3 !rounded-lg">My Account</Link>
              </div>
            ) : (
              <Link to="/login" className="hidden md:inline-block btn-primary text-[10px] !py-1.5 !px-4 !rounded-lg">Sign In</Link>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-600 dark:text-gray-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-gray-100 dark:border-midnight-800 bg-white dark:bg-midnight-950 animate-slide-down">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input ref={searchRef} type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search products..." className="input-field flex-1 text-sm" />
              <button type="submit" className="btn-primary text-xs px-6">Search</button>
              <button type="button" onClick={() => setSearchOpen(false)} className="text-xs text-gray-400 hover:text-midnight-900 dark:hover:text-white uppercase tracking-wider">Close</button>
            </form>
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-midnight-800 bg-white dark:bg-midnight-950 animate-slide-down">
          <div className="px-4 py-4 space-y-2">
            {['Home', 'Shop', 'Journal', 'About', 'Contact'].map(p => (
              <Link key={p} to={p === 'Home' ? '/' : p === 'Journal' ? '/blog' : `/${p.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="block text-sm uppercase tracking-[0.15em] font-medium py-2 text-gray-600 dark:text-gray-300">{p}</Link>
            ))}
            <div className="border-t border-gray-100 dark:border-midnight-700 pt-2 mt-2">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 px-2">Categories</p>
              {categories.map(cat => (
                <Link key={cat} to={`/shop/${encodeURIComponent(cat)}`} onClick={() => setMenuOpen(false)} className="block text-xs uppercase tracking-wider py-1.5 px-2 text-gray-500 dark:text-gray-400">{cat}</Link>
              ))}
            </div>
            <div className="border-t border-gray-100 dark:border-midnight-700 pt-2 mt-2 flex gap-4 flex-wrap">
              {isLoggedIn ? (
                <>
                  <span className="text-xs text-gray-700 dark:text-gray-200 px-2">{user?.name}</span>
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-xs uppercase tracking-wider text-gray-600 dark:text-gray-300">My Account</Link>
                  <Link to="/orders" onClick={() => setMenuOpen(false)} className="text-xs uppercase tracking-wider text-gray-600 dark:text-gray-300">Orders</Link>
                  <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="text-xs uppercase tracking-wider text-gray-600 dark:text-gray-300">Wishlist</Link>
                </>
              ) : (
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-primary text-[10px] !py-1.5 !px-3 !rounded-lg inline-block">Sign In</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
