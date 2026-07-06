import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

const cardTypes = [
  { value: 'iTunes', label: 'iTunes Gift Card' },
  { value: 'Razer Gold', label: 'Razer Gold Gift Card' },
  { value: 'Amazon', label: 'Amazon Gift Card' },
  { value: 'Other', label: 'Other' },
]

export default function GiftCardPayment() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [cardType, setCardType] = useState('iTunes')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [userId, setUserId] = useState(null)
  const [uploadMethod, setUploadMethod] = useState('code')
  const [giftCardImage, setGiftCardImage] = useState(null)
  const [imageConfirmed, setImageConfirmed] = useState(false)

  useEffect(() => {
    try {
      const auth = JSON.parse(localStorage.getItem('horizon-auth'))
      if (auth?.id) setUserId(auth.id)
      else if (auth?.user?.id) setUserId(auth.user.id)
    } catch {}
  }, [])

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setGiftCardImage(reader.result)
        setImageConfirmed(false)
        setError('')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSend = async () => {
    if (uploadMethod === 'code' && !code.trim()) {
      setError('Please enter a gift card code')
      return
    }
    if (uploadMethod === 'image') {
      if (!giftCardImage) {
        setError('Please upload a gift card image')
        return
      }
      if (!imageConfirmed) {
        setError('Please confirm the uploaded image')
        return
      }
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/giftcards/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          orderId: orderId || null,
          cardType,
          code: uploadMethod === 'code' ? code.trim() : null,
          imageData: uploadMethod === 'image' ? giftCardImage : null,
          method: uploadMethod,
        }),
      })
      if (res.ok) {
        setSuccess(true)
      } else {
        const data = await res.json()
        setError(data.error || 'Submission failed')
      }
    } catch { setError('Something went wrong') }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-horizon-50 dark:bg-midnight-950 flex items-center justify-center px-4">
        <div className="glass-card p-10 max-w-md mx-auto text-center animate-scale-in">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-2xl font-display font-bold text-midnight-900 dark:text-white mb-2">Gift Card Submitted</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Your gift card has been sent to admin for review. You will be notified once it is approved.</p>
          <Link to="/orders" className="btn-primary text-sm">View Orders</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-horizon-50 dark:bg-midnight-950 py-16 relative">
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="relative z-10 max-w-lg mx-auto px-4">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-3xl font-display font-bold text-midnight-900 dark:text-white mb-2">Gift Card Payment</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Send your gift card details to admin for verification.</p>
          <span className="inline-block mt-2 badge-info text-xs">Recommended</span>
        </div>

        <div className="glass-card p-8 space-y-6 animate-slide-up">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Card Type</label>
            <select value={cardType} onChange={e => setCardType(e.target.value)} className="input-field w-full">
              {cardTypes.map(ct => (
                <option key={ct.value} value={ct.value}>{ct.label}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 mb-2">
            <button onClick={() => { setUploadMethod('code'); setError('') }} className={`flex-1 py-2 text-xs uppercase tracking-wider font-medium rounded-lg transition-all ${uploadMethod === 'code' ? 'bg-horizon-600 text-white' : 'bg-gray-100 dark:bg-midnight-800 text-gray-600 dark:text-gray-300'}`}>Enter Code</button>
            <button onClick={() => { setUploadMethod('image'); setError('') }} className={`flex-1 py-2 text-xs uppercase tracking-wider font-medium rounded-lg transition-all ${uploadMethod === 'image' ? 'bg-horizon-600 text-white' : 'bg-gray-100 dark:bg-midnight-800 text-gray-600 dark:text-gray-300'}`}>Upload Image</button>
          </div>

          {uploadMethod === 'code' ? (
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Gift Card Code</label>
              <input value={code} onChange={e => setCode(e.target.value)} placeholder="Enter gift card code" className="input-field w-full" />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Upload Gift Card Image</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-midnight-600 rounded-xl p-6 text-center">
                {giftCardImage ? (
                  <div className="space-y-3">
                    <img src={giftCardImage} alt="Gift card" className="max-h-40 mx-auto rounded-lg" />
                    {!imageConfirmed ? (
                      <button onClick={() => setImageConfirmed(true)} className="btn-primary text-xs">Confirm Upload</button>
                    ) : (
                      <span className="inline-block text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full">Image confirmed</span>
                    )}
                    <button onClick={() => { setGiftCardImage(null); setImageConfirmed(false) }} className="block mx-auto text-xs text-red-500 hover:text-red-600">Remove</button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <svg className="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                    <p className="text-sm text-gray-500">Click to upload gift card image</p>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-2">{error}</p>
          )}

          <button onClick={handleSend} disabled={loading} className="btn-primary w-full">
            {loading ? 'Sending...' : 'Send'}
          </button>

          <p className="text-xs text-gray-400 text-center">Your gift card details will be sent to admin for manual verification.</p>
        </div>
      </div>
    </div>
  )
}
