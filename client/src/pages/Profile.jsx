import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const tabs = ['Profile', 'Wallet', 'Settings', 'Notifications', 'Orders', 'Wishlist'];

export default function Profile() {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Profile')
  const [profile, setProfile] = useState(null)
  const [orders, setOrders] = useState([])
  const [notifications, setNotifications] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [depositAmount, setDepositAmount] = useState('')
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
  const [editName, setEditName] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    const uid = user.id || user.token
    if (uid) {
      fetch(`/api/users/${uid}`).then(r => r.json()).then(data => {
        setProfile(data)
        setEditName(data.name || '')
      }).catch(() => {})
      fetch(`/api/users/${uid}/orders`).then(r => r.json()).then(setOrders).catch(() => {})
      fetch(`/api/users/${uid}/notifications`).then(r => r.json()).then(setNotifications).catch(() => {})
      fetch(`/api/wishlist/${uid}`).then(r => r.json()).then(setWishlist).catch(() => {})
    }
  }, [user, navigate])

  const handleNameSave = async () => {
    if (!editName.trim()) return
    setError(''); setMessage('')
    const uid = user?.id || user?.token
    const res = await fetch(`/api/users/${uid}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: editName.trim() }) })
    const data = await res.json()
    if (data.error) setError(data.error)
    else { setMessage('Name updated successfully'); setProfile(prev => ({ ...prev, name: editName.trim() })) }
  }

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return
    setError(''); setMessage('')
    const uid = user?.id || user?.token
    const res = await fetch(`/api/users/${uid}/wallet`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: parseFloat(depositAmount) }) })
    const data = await res.json()
    if (data.error) setError(data.error)
    else { setMessage(`$${depositAmount} added to wallet`); setDepositAmount(''); setProfile(prev => ({ ...prev, walletBalance: data.walletBalance })) }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (passwords.new !== passwords.confirm) { setError('Passwords do not match'); return }
    setError(''); setMessage('')
    const uid = user?.id || user?.token
    const res = await fetch(`/api/users/${uid}/password`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new }) })
    const data = await res.json()
    if (data.error) setError(data.error)
    else { setMessage('Password updated successfully'); setPasswords({ current: '', new: '', confirm: '' }) }
  }

  const handleLogout = () => { setShowLogoutModal(true) }
  const confirmLogout = () => { setShowLogoutModal(false); logout(); navigate('/login') }

  const markRead = async (nid) => {
    const uid = user?.id || user?.token
    await fetch(`/api/users/${uid}/notifications/${nid}/read`, { method: 'PUT' })
    setNotifications(prev => prev.map(n => n.id === nid ? { ...n, read: 1 } : n))
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-horizon-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="flex items-start gap-6 mb-10">
        <div className="w-16 h-16 rounded-full bg-horizon-100 dark:bg-horizon-900 flex items-center justify-center text-xl font-bold text-horizon-600 shrink-0">
          {profile.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-midnight-900 dark:text-white">{profile.name}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</p>
          <div className="flex items-center gap-4 mt-2">
            {profile.role === 'admin' && <span className="badge-info">Admin</span>}
          </div>
        </div>
        <button onClick={handleLogout} className="btn-secondary text-sm !py-2 !px-4">Logout</button>
      </div>

      <div className="flex gap-1 mb-8 border-b border-gray-200 dark:border-midnight-800 overflow-x-auto scrollbar-hide">
        {tabs.map(t => {
          let badge = null
          if (t === 'Notifications' && notifications.length > 0) badge = notifications.filter(n => !n.read).length
          if (t === 'Orders' && orders.length > 0) badge = orders.length
          return (
            <button key={t} onClick={() => setActiveTab(t)} className={`relative px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${activeTab === t ? 'border-horizon-600 text-horizon-600 dark:text-horizon-400 dark:border-horizon-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
              {t}
              {badge !== null && badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-horizon-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">{badge}</span>
              )}
            </button>
          )
        })}
      </div>

      {message && <div className="mb-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 text-sm text-emerald-600 dark:text-emerald-400">{message}</div>}
      {error && <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-600 dark:text-red-400">{error}</div>}

      {activeTab === 'Profile' && (
        <div className="admin-card">
          <h2 className="text-lg font-semibold text-midnight-900 dark:text-white mb-6">Profile Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Name</label><p className="text-midnight-900 dark:text-white">{profile.name}</p></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Email</label><p className="text-midnight-900 dark:text-white">{profile.email}</p></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Phone</label><p className="text-midnight-900 dark:text-white">{profile.phone || 'Not set'}</p></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Referral Code</label><p className="text-midnight-900 dark:text-white font-mono text-sm">{profile.referralCode}</p></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Wallet Balance</label><p className="text-midnight-900 dark:text-white font-semibold">${(profile.walletBalance || 0).toFixed(2)}</p></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Loyalty Points</label><p className="text-midnight-900 dark:text-white font-semibold">{profile.loyaltyPoints || 0} pts <span className="text-[10px] text-gray-400">(earn more by referring)</span></p></div>
          </div>
        </div>
      )}

      {activeTab === 'Wallet' && (
        <div className="space-y-6">
          <div className="admin-card">
            <h2 className="text-lg font-semibold mb-2">Wallet Balance</h2>
            <p className="text-4xl font-bold text-horizon-600">${(profile.walletBalance || 0).toFixed(2)}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{profile.loyaltyPoints || 0} loyalty points</p>
          </div>
          <div className="admin-card">
            <h2 className="text-lg font-semibold mb-4">Deposit Funds</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Add funds to your wallet and start shopping with ease.</p>
            <div className="flex gap-3">
              <input type="number" step="0.01" min="1" placeholder="Enter amount" className="input-field max-w-xs" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} />
              <button onClick={() => navigate('/deposit')} className="btn-primary btn-pulse">Deposit Now</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Settings' && (
        <div className="admin-card">
          <h2 className="text-lg font-semibold mb-6">Settings</h2>
          <div className="max-w-md space-y-6 mb-8">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Name</label>
              <div className="flex gap-3">
                <input type="text" className="input-field flex-1" value={editName} onChange={e => setEditName(e.target.value)} />
                <button onClick={handleNameSave} className="btn-primary">Save</button>
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>
          <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
            <div><label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Current Password</label><input type="password" className="input-field" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} required /></div>
            <div><label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">New Password</label><input type="password" className="input-field" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} required /></div>
            <div><label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Confirm New Password</label><input type="password" className="input-field" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} required /></div>
            <button type="submit" className="btn-primary">Update Password</button>
          </form>
        </div>
      )}

      {activeTab === 'Notifications' && (
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="admin-card text-center text-gray-500 dark:text-gray-400 py-10">No notifications</div>
          ) : (
            notifications.map(n => (
              <div key={n.id} className={`admin-card flex items-start gap-4 ${!n.read ? 'border-l-4 border-l-horizon-500' : ''}`} onClick={() => !n.read && markRead(n.id)}>
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.read ? 'bg-gray-300 dark:bg-gray-600' : 'bg-horizon-500'}`} />
                <div className="flex-1">
                  <p className={`text-sm ${n.read ? 'text-gray-500' : 'text-midnight-900 dark:text-white font-medium'}`}>{n.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{n.message}</p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{formatDate(n.createdAt)}</span>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'Orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="admin-card text-center text-gray-500 dark:text-gray-400 py-10">
              <p>No orders yet</p>
              <Link to="/shop" className="btn-primary inline-block mt-4">Place New Order</Link>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="admin-card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-mono text-sm text-horizon-600 font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className={`badge-${order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'danger' : order.status === 'pending' ? 'warning' : 'info'}`}>{order.status}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total: <span className="font-semibold text-midnight-900 dark:text-white">${order.total.toFixed(2)}</span></p>
                <p className="text-xs text-gray-400 mt-1">{order.items ? JSON.parse(order.items).length + ' items' : '0 items'}</p>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'Wishlist' && (
        <div className="space-y-4">
          {wishlist.length === 0 ? (
            <div className="admin-card text-center text-gray-500 dark:text-gray-400 py-10">
              <p>Your wishlist is empty</p>
              <Link to="/shop" className="btn-primary inline-block mt-4">Place New Order</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {wishlist.map(item => (
                <Link key={item.id} to={`/product/${item.productId || item.id}`} className="glass-card p-4 hover:shadow-lg transition-shadow">
                  {item.image && <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-lg mb-2" />}
                  <p className="text-sm font-medium text-midnight-900 dark:text-white truncate">{item.name}</p>
                  {item.price && <p className="text-xs text-horizon-600 font-semibold">${parseFloat(item.price).toFixed(2)}</p>}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)}>
          <div className="glass-card p-8 max-w-sm mx-4 text-center animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </div>
            <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-2">Sign Out</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Are you sure you want to sign out?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowLogoutModal(false)} className="btn-primary text-sm">Stay</button>
              <button onClick={confirmLogout} className="btn-outline text-sm text-red-500 border-red-200 hover:bg-red-50">Leave</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
