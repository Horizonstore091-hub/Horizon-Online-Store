import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, removeItem, updateQuantity, subtotal, coupon, discount, applyCoupon, removeCoupon } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [couponError, setCouponError] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    setCouponError('')
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim(), orderTotal: subtotal })
      })
      const data = await res.json()
      if (res.ok && data.valid) {
        applyCoupon(data.coupon, data.discount)
        setCouponCode('')
      } else {
        setCouponError(data.error || 'Invalid coupon')
      }
    } catch { setCouponError('Failed to validate coupon') }
    setCouponLoading(false)
  }

  const total = subtotal - discount

  if (items.length === 0) {
    return (
      <div className="pt-24 md:pt-28">
        <div className="container-wide py-20 text-center">
          <svg className="w-16 h-16 mx-auto text-horizon-200 dark:text-horizon-700 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
          <h1 className="text-2xl font-display font-bold text-horizon-900 dark:text-horizon-100 mb-3">Your cart is empty</h1>
          <p className="text-horizon-400 dark:text-horizon-500 text-sm mb-8">Discover our curated collection of premium essentials.</p>
          <Link to="/shop" className="btn-primary">Shop Now</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 md:pt-28">
      <div className="container-wide py-10">
        <h1 className="text-3xl font-display font-bold text-horizon-900 dark:text-horizon-100 mb-2">Shopping Cart</h1>
        <p className="text-horizon-400 dark:text-horizon-500 text-sm mb-10">{items.length} {items.length === 1 ? 'item' : 'items'}</p>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {items.map(item => (
              <div key={item.id} className="flex gap-4 md:gap-6 pb-6 border-b border-horizon-100 dark:border-horizon-700">
                <Link to={`/product/${item.id}`} className="w-20 h-24 md:w-24 md:h-28 bg-horizon-50 dark:bg-horizon-800 flex-shrink-0 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link to={`/product/${item.id}`}><h3 className="text-sm font-medium text-horizon-900 dark:text-horizon-100 hover:text-horizon-600 dark:hover:text-horizon-300 transition-colors">{item.name}</h3></Link>
                      <p className="text-xs text-horizon-400 dark:text-horizon-500 mt-0.5">{item.category}</p>
                    </div>
                    <p className="text-sm font-semibold text-horizon-900 dark:text-horizon-100">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-horizon-200 dark:border-horizon-700">
                      <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="px-2.5 py-1.5 text-xs text-horizon-600 dark:text-horizon-300 hover:text-horizon-900 dark:hover:text-horizon-100">−</button>
                      <span className="px-3 text-xs font-medium text-horizon-900 dark:text-horizon-100">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2.5 py-1.5 text-xs text-horizon-600 dark:text-horizon-300 hover:text-horizon-900 dark:hover:text-horizon-100">+</button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-xs text-horizon-400 hover:text-red-500 dark:hover:text-red-400 transition-colors uppercase tracking-wider">Remove</button>
                  </div>
                </div>
              </div>
            ))}
            <Link to="/shop" className="inline-block text-xs uppercase tracking-wider text-horizon-500 hover:text-horizon-900 dark:hover:text-horizon-100 transition-colors">Continue Shopping</Link>
          </div>

          <div className="lg:col-span-1">
            <div className="card p-6 space-y-4">
              <h2 className="text-sm font-semibold text-horizon-900 dark:text-horizon-100 uppercase tracking-wider">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-horizon-600 dark:text-horizon-300"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount ({coupon?.code})</span><span>-${discount.toFixed(2)}</span></div>}
                <div className="flex justify-between text-xs text-horizon-400"><span>Shipping</span><span>Free</span></div>
                <div className="border-t border-horizon-100 dark:border-horizon-700 pt-2 flex justify-between text-base font-semibold text-horizon-900 dark:text-horizon-100"><span>Total</span><span>${total.toFixed(2)}</span></div>
              </div>

              {!coupon ? (
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wider text-horizon-400 font-medium">Promo Code</p>
                  <div className="flex gap-2">
                    <input value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="Enter code" className="input-field text-xs flex-1" onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()} />
                    <button onClick={handleApplyCoupon} disabled={couponLoading} className="btn-primary text-xs px-4">{couponLoading ? '...' : 'Apply'}</button>
                  </div>
                  {couponError && <p className="text-xs text-red-500">{couponError}</p>}
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-600 font-medium">Code {coupon.code} applied</span>
                  <button onClick={removeCoupon} className="text-horizon-400 hover:text-red-500">Remove</button>
                </div>
              )}

              <Link to="/checkout" className="btn-primary w-full">Checkout — ${total.toFixed(2)}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
