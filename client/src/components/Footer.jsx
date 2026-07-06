import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-horizon-950 dark:bg-black text-horizon-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="font-display text-2xl font-bold text-white">HORIZON</Link>
            <p className="mt-3 text-sm text-horizon-400 leading-relaxed">Curated essentials for the modern lifestyle. Thoughtfully selected, impeccably crafted.</p>
            <div className="mt-4 flex gap-3">
              <a href="#" className="text-horizon-500 hover:text-white transition-colors" title="Instagram">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-3a4.5 4.5 0 01-4.5-4.5v-1.5" /></svg>
              </a>
              <a href="#" className="text-horizon-500 hover:text-white transition-colors" title="Twitter">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
              </a>
              <a href="#" className="text-horizon-500 hover:text-white transition-colors" title="Pinterest">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 4.5h16.5A2.25 2.25 0 0122.5 6.75v10.5a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 17.25V6.75A2.25 2.25 0 013.75 4.5z" /></svg>
              </a>
              <a href="#" className="text-horizon-500 hover:text-white transition-colors" title="TikTok">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white text-xs uppercase tracking-[0.15em] font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              {['All', 'Electronics', 'Clothing', 'Gadgets', 'Home & Kitchen', 'Beauty', 'Accessories'].map(cat => (
                <li key={cat}><Link to={`/shop/${cat === 'All' ? '' : encodeURIComponent(cat)}`} className="text-sm text-horizon-400 hover:text-white transition-colors">{cat}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white text-xs uppercase tracking-[0.15em] font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-horizon-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-horizon-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="text-sm text-horizon-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/facebook-ads" className="text-sm text-horizon-400 hover:text-white transition-colors">Special Offers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-xs uppercase tracking-[0.15em] font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-sm text-horizon-400 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/privacy" className="text-sm text-horizon-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-horizon-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/faq" className="text-sm text-horizon-400 hover:text-white transition-colors">Shipping & Returns</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-xs uppercase tracking-[0.15em] font-semibold mb-4">Account</h4>
            <ul className="space-y-2">
              <li><Link to="/login" className="text-sm text-horizon-400 hover:text-white transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="text-sm text-horizon-400 hover:text-white transition-colors">Register</Link></li>
              <li><Link to="/orders" className="text-sm text-horizon-400 hover:text-white transition-colors">Order History</Link></li>
              <li><Link to="/wishlist" className="text-sm text-horizon-400 hover:text-white transition-colors">Wishlist</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-horizon-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-horizon-500">&copy; 2025 HORIZON. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-horizon-500">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/faq" className="hover:text-white transition-colors">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
