import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function VirtualCardPayment() {
  const { orderId } = useParams()
  const [method, setMethod] = useState('upload')
  const [cardImage, setCardImage] = useState(null)
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleImageChange = e => {
    const file = e.target.files[0]
    if (file) setCardImage(file)
  }

  const handleSubmit = e => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-horizon-50 dark:bg-midnight-950 flex items-center justify-center px-4">
        <div className="glass-card p-10 max-w-md mx-auto text-center animate-scale-in">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-2xl font-display font-bold text-midnight-900 dark:text-white mb-2">Payment Submitted</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Your virtual card payment is being processed. We'll notify you once confirmed.</p>
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
          <h1 className="text-3xl font-display font-bold text-midnight-900 dark:text-white mb-2">Virtual Card Payment</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Upload a screenshot of your virtual card or enter card details manually.</p>
          <span className="inline-block mt-2 badge-info text-xs">Recommended</span>
        </div>

        <div className="glass-card p-8">
          <div className="flex gap-1 mb-6 border-b border-gray-200 dark:border-midnight-800">
            {[
              { id: 'upload', label: 'Upload Card Image' },
              { id: 'manual', label: 'Enter Card Details' },
            ].map(m => (
              <button key={m.id} onClick={() => setMethod(m.id)}
                className={`flex-1 pb-3 text-xs uppercase tracking-wider font-medium border-b-2 -mb-px transition-colors ${method === m.id ? 'border-horizon-600 text-horizon-600 dark:text-horizon-400 dark:border-horizon-400' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                {m.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {method === 'upload' ? (
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Card Screenshot</label>
                <div className="border-2 border-dashed border-gray-300 dark:border-midnight-600 rounded-xl p-10 text-center cursor-pointer hover:border-horizon-500 transition-colors">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="card-image" />
                  <label htmlFor="card-image" className="cursor-pointer">
                    {cardImage ? (
                      <p className="text-sm text-midnight-900 dark:text-white">{cardImage.name}</p>
                    ) : (
                      <div>
                        <svg className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                        <p className="text-sm text-gray-400">Click to upload card screenshot</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Card Number</label>
                  <input value={cardDetails.number} onChange={e => setCardDetails({...cardDetails, number: e.target.value})} placeholder="1234 5678 9012 3456" className="input-field" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Expiry</label>
                    <input value={cardDetails.expiry} onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})} placeholder="MM/YY" className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">CVV</label>
                    <input value={cardDetails.cvv} onChange={e => setCardDetails({...cardDetails, cvv: e.target.value})} placeholder="123" className="input-field" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Cardholder Name</label>
                  <input value={cardDetails.name} onChange={e => setCardDetails({...cardDetails, name: e.target.value})} placeholder="John Doe" className="input-field" required />
                </div>
              </>
            )}
            <button type="submit" className="btn-primary w-full">Submit Payment</button>
          </form>
        </div>
      </div>
    </div>
  )
}
