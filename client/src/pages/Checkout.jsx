import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Checkout() {
  const { items, subtotal, discount, coupon, clearCart } = useCart()
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '',
    address: '', city: '', zip: '', phone: user?.phone || ''
  })
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [placing, setPlacing] = useState(false)
  const [done, setDone] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('crypto')
  const [paymentMethods, setPaymentMethods] = useState([])
  const [orderCreated, setOrderCreated] = useState(null)
  const [walletBalance, setWalletBalance] = useState(null)
  const shippingPrices = { standard: 0, express: 12, overnight: 25 }
  const shippingCost = shippingPrices[shippingMethod] || 0
  const total = subtotal - discount + shippingCost

  useEffect(() => {
    fetch('/api/admin/payments').then(r => r.json()).then(setPaymentMethods).catch(() => {})
  }, [])

  useEffect(() => {
    try {
      const auth = JSON.parse(localStorage.getItem('horizon-auth'))
      const uid = auth?.id || auth?.user?.id
      if (uid) {
        fetch(`/api/users/${uid}`).then(r => r.json()).then(p => {
          if (p.walletBalance !== undefined) setWalletBalance(p.walletBalance)
        }).catch(() => {})
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      const auth = JSON.parse(localStorage.getItem('horizon-auth'))
      if (!auth?.id && !auth?.user?.id) {
        navigate('/login')
      }
    } catch {
      navigate('/login')
    }
  }, [navigate])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    if (items.length === 0) return
    if (paymentMethod === 'wallet' && (walletBalance === null || walletBalance <= 0)) return
    setPlacing(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: token || null,
          customerName: form.name, customerEmail: form.email,
          customerAddress: form.address, customerCity: form.city,
          customerZip: form.zip, customerPhone: form.phone,
          items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
          total, shippingMethod, couponCode: coupon?.code || null, discount,
          paymentMethod, status: 'pending_payment'
        })
      })
      if (res.ok) {
        const order = await res.json()
        clearCart()
        setOrderCreated(order)

        if (paymentMethod === 'crypto') {
          navigate(`/crypto-payment/${order.id}`)
        } else if (paymentMethod === 'gift_card') {
          navigate(`/gift-card-payment/${order.id}`)
        } else if (paymentMethod === 'wallet') {
          setOrderId(`#HZN-${order.id.slice(0, 8).toUpperCase()}`)
          setDone(true)
        } else {
          setOrderId(`#HZN-${order.id.slice(0, 8).toUpperCase()}`)
          setDone(true)
        }
      } else alert('Something went wrong.')
    } catch { alert('Something went wrong.') }
    setPlacing(false)
  }

  if (items.length === 0 && !done) {
    return (
      <div className="pt-24 md:pt-28"><div className="container-wide py-20 text-center">
        <h1 className="text-2xl font-display font-bold text-horizon-900 dark:text-horizon-100 mb-3">Your cart is empty</h1>
        <Link to="/shop" className="btn-primary mt-4 inline-flex">Shop Now</Link>
      </div></div>
    )
  }

  if (done) {
    return (
      <div className="pt-24 md:pt-28"><div className="container-wide py-20 text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 className="text-3xl font-display font-bold text-horizon-900 dark:text-horizon-100 mb-3">Order Confirmed!</h1>
        <p className="text-horizon-400 dark:text-horizon-500 text-sm mb-2">Thank you for your purchase.</p>
        <p className="text-sm font-mono text-horizon-600 dark:text-horizon-300 mb-8">{orderId}</p>
        <div className="flex gap-4 justify-center">
          <Link to="/shop" className="btn-primary">Continue Shopping</Link>
          <Link to="/orders" className="btn-outline">View Orders</Link>
        </div>
      </div></div>
    )
  }

  return (
    <div className="pt-24 md:pt-28">
      <div className="container-wide py-10">
        <h1 className="text-3xl font-display font-bold text-horizon-900 dark:text-horizon-100 mb-10">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-5 gap-10">
            <div className="md:col-span-3 space-y-6">
              <div className="card p-6">
                <h2 className="text-sm font-semibold text-horizon-900 dark:text-horizon-100 uppercase tracking-wider mb-4">Contact</h2>
                <div className="grid grid-cols-2 gap-3">
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" required className="input-field" />
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required className="input-field" />
                </div>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone (optional)" className="input-field mt-3" />
              </div>

              <div className="card p-6">
                <h2 className="text-sm font-semibold text-horizon-900 dark:text-horizon-100 uppercase tracking-wider mb-4">Shipping</h2>
                <input name="address" value={form.address} onChange={handleChange} placeholder="Street address" required className="input-field mb-3" />
                <div className="grid grid-cols-2 gap-3">
                  <input name="city" value={form.city} onChange={handleChange} placeholder="City" required className="input-field" />
                  <input name="zip" value={form.zip} onChange={handleChange} placeholder="ZIP code" required className="input-field" />
                </div>
              </div>

              <div className="card p-6">
                <h2 className="text-sm font-semibold text-horizon-900 dark:text-horizon-100 uppercase tracking-wider mb-4">Shipping Method</h2>
                <div className="space-y-3">
                  {[
                    { value: 'standard', label: 'Standard Shipping', desc: '5-7 business days', price: 0 },
                    { value: 'express', label: 'Express Shipping', desc: '2-3 business days', price: 12 },
                    { value: 'overnight', label: 'Overnight Shipping', desc: 'Next business day', price: 25 },
                  ].map(s => (
                    <label key={s.value} className={`flex items-center justify-between p-3 border cursor-pointer transition-colors ${shippingMethod === s.value ? 'border-horizon-900 dark:border-horizon-100 bg-horizon-50 dark:bg-horizon-800' : 'border-horizon-200 dark:border-horizon-700 hover:border-horizon-400'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="shipping" value={s.value} checked={shippingMethod === s.value} onChange={e => setShippingMethod(e.target.value)} className="text-horizon-900" />
                        <div><p className="text-sm font-medium text-horizon-900 dark:text-horizon-100">{s.label}</p><p className="text-xs text-horizon-400">{s.desc}</p></div>
                      </div>
                      <span className="text-sm font-medium text-horizon-900 dark:text-horizon-100">{s.price === 0 ? 'Free' : `$${s.price}`}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <h2 className="text-sm font-semibold text-horizon-900 dark:text-horizon-100 uppercase tracking-wider mb-4">Payment</h2>
                <div className="space-y-3">
                  {(paymentMethods.filter(p => p.enabled).length > 0 ? paymentMethods.filter(p => p.enabled) : [
                    { name: 'Cryptocurrency', type: 'crypto', instructions: 'BTC, ETH, or USDT. Recommended for fast payments.', recommended: true },
                    { name: 'Gift Card', type: 'gift_card', instructions: 'Enter your gift card code or upload an image. Recommended.', recommended: true },
                    { name: 'Wallet', type: 'wallet', instructions: 'Pay using your account wallet balance.' },
                  ]).map(p => (
                    <label key={p.id || p.type} className={`flex items-start gap-3 p-3 border cursor-pointer transition-colors ${paymentMethod === p.type ? 'border-horizon-900 dark:border-horizon-100 bg-horizon-50 dark:bg-horizon-800' : 'border-horizon-200 dark:border-horizon-700 hover:border-horizon-400'}`}>
                      <input type="radio" name="payment" value={p.type} checked={paymentMethod === p.type} onChange={e => setPaymentMethod(e.target.value)} className="text-horizon-900 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-horizon-900 dark:text-horizon-100">{p.name}</p>
                          {p.recommended && <span className="text-[9px] uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 font-semibold">Recommended</span>}
                        </div>
                        <p className="text-xs text-horizon-400 mt-0.5">{p.instructions}</p>
                        {p.type === 'wallet' && walletBalance !== null && walletBalance <= 0 && (
                          <p className="text-xs text-red-500 mt-1">Insufficient balance. Please deposit or choose another method.</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-horizon-400 mt-3">Your payment information is processed securely via SSL encryption.</p>
              </div>

              <button type="submit" disabled={placing || (paymentMethod === 'wallet' && walletBalance !== null && walletBalance <= 0)} className="btn-primary w-full disabled:opacity-50 btn-pulse">
                {placing ? 'Processing...' : `Place Order — $${total.toFixed(2)}${shippingCost > 0 ? ` (incl. $${shippingCost} shipping)` : ''}`}
              </button>
            </div>

            <div className="md:col-span-2">
              <div className="card p-6">
                <h2 className="text-sm font-semibold text-horizon-900 dark:text-horizon-100 uppercase tracking-wider mb-4">Order Summary</h2>
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-horizon-600 dark:text-horizon-300">{item.name} <span className="text-horizon-400 dark:text-horizon-500">x{item.quantity}</span></span>
                      <span className="text-horizon-900 dark:text-horizon-100 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-horizon-100 dark:border-horizon-700 pt-3 space-y-1.5">
                    <div className="flex justify-between text-sm text-horizon-600 dark:text-horizon-300"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                    {discount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
                    <div className="flex justify-between text-sm text-horizon-600 dark:text-horizon-300"><span>Shipping ({shippingMethod})</span><span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span></div>
                    <div className="border-t border-horizon-100 dark:border-horizon-700 pt-2 flex justify-between text-base font-semibold text-horizon-900 dark:text-horizon-100"><span>Total</span><span>${total.toFixed(2)}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
