import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

function ThemeToggle() {
  const { dark, toggle } = useTheme()
  return (
    <button onClick={toggle} className="mt-4 flex items-center gap-2 text-xs text-horizon-400 hover:text-horizon-200 transition-colors w-full">
      {dark ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
      )}
      <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
    </button>
  )
}

export default function AdminSidebar({ badges = {} }) {
  const { pathname } = useLocation()

  const links = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/products', label: 'Products' },
    { to: '/admin/orders', label: 'Orders' },
    { to: '/admin/coupons', label: 'Coupons' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/payments', label: 'Payments' },
    { to: '/admin/pages', label: 'Page Editor' },
    { to: '/admin/notifications', label: 'Notifications' },
    { to: '/admin/reviews', label: 'Reviews' },
    { to: '/admin/messages', label: 'Messages' },
    { to: '/admin/activity', label: 'Activity Log' },
    { to: '/admin/wallet-addresses', label: 'Wallet Addresses' },
    { to: '/admin/giftcards', label: 'Gift Cards' },
    { to: '/admin/abandoned-carts', label: 'Abandoned Carts' },
    { to: '/admin/newsletter', label: 'Newsletter' },
    { to: '/admin/seo', label: 'SEO Metadata' },
  ]

  return (
    <div className="admin-sidebar">
      <Link to="/admin" className="font-display text-xl font-bold text-white mb-10 block">HORIZON</Link>
      <p className="text-[10px] uppercase tracking-wider text-horizon-400 mb-6">Admin Panel</p>
      <nav className="space-y-1">
        {links.map(l => (
          <Link key={l.to} to={l.to} className={`flex items-center justify-between py-2.5 px-3 text-sm rounded ${pathname === l.to ? 'text-white bg-horizon-800' : 'text-horizon-300 hover:text-white hover:bg-horizon-800'}`}>
            <span>{l.label}</span>
            {badges[l.label] > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">{badges[l.label]}</span>
            )}
          </Link>
        ))}
      </nav>
      <Link to="/" className="block mt-6 text-xs text-horizon-500 hover:text-horizon-300 uppercase tracking-wider">Back to Store</Link>
      <ThemeToggle />
    </div>
  )
}
