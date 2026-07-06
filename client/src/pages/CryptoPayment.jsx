import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

export default function CryptoPayment() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [wallets, setWallets] = useState([])
  const [selected, setSelected] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/admin/wallet-addresses').then(r => r.json()).then(setWallets).catch(() => {})
  }, [])

  const copyAddress = () => {
    if (selected) {
      navigator.clipboard.writeText(selected.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-horizon-50 dark:bg-midnight-950 py-16 relative">
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="relative z-10 max-w-lg mx-auto px-4">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-3xl font-display font-bold text-midnight-900 dark:text-white mb-2">Cryptocurrency Payment</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Select your currency and send the exact amount to the wallet address below.</p>
        </div>

        {!selected ? (
          <div className="animate-fade-in">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-4">Select Currency</p>
            <div className="space-y-3">
              {wallets.map((w, i) => (
                <button key={w.id} onClick={() => setSelected(w)}
                  className="w-full text-left glass-card p-5 hover:bg-horizon-600 hover:text-white group transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${i * 80}ms` }}>
                  <p className="text-sm font-medium group-hover:text-white">{w.currency}</p>
                  {w.network && <p className="text-xs text-gray-400 group-hover:text-white/70 mt-0.5">Network: {w.network}</p>}
                </button>
              ))}
              {wallets.length === 0 && <p className="text-sm text-gray-400 text-center py-10">No wallet addresses configured yet.</p>}
            </div>
          </div>
        ) : (
          <div className="glass-card p-8 space-y-6 animate-scale-in">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-horizon-100 dark:bg-horizon-900 flex items-center justify-center">
                <svg className="w-7 h-7 text-horizon-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">Send to</p>
              <p className="text-sm font-semibold text-midnight-900 dark:text-white mt-1">{selected.currency}</p>
              {selected.network && <p className="text-xs text-gray-400">Network: {selected.network}</p>}
            </div>
            <div className="bg-horizon-50 dark:bg-midnight-800 rounded-xl p-4 border border-gray-200 dark:border-midnight-700">
              <p className="font-mono text-xs break-all text-midnight-900 dark:text-white select-all">{selected.address}</p>
            </div>
            <button onClick={copyAddress} className="btn-primary w-full">
              {copied ? 'Address Copied!' : 'Copy Wallet Address'}
            </button>
            <p className="text-xs text-gray-400 text-center">Send the exact order amount to the address above. Your order will be processed once the transaction is confirmed.</p>
            <div className="flex gap-3">
              <button onClick={() => { setSelected(null); setCopied(false) }} className="btn-outline text-sm flex-1">Back</button>
              <Link to={`/confirm-deposit/${orderId}`} className="btn-primary text-sm flex-1 text-center">I've Sent Payment</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
