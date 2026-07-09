import { createContext, useContext, useState, useEffect } from 'react'

const CurrencyContext = createContext()

export function CurrencyProvider({ children }) {
  const [currencies, setCurrencies] = useState([])
  const [selected, setSelected] = useState(null)
  const [rates, setRates] = useState({})

  useEffect(() => {
    fetch('/api/currencies').then(r => r.json()).then(data => {
      setCurrencies(data)
      const def = data.find(c => c.isDefault) || data[0]
      setSelected(def || { code: 'USD', symbol: '$', rate: 1 })
      const r = {}
      data.forEach(c => { r[c.code] = c.rate })
      setRates(r)
    }).catch(() => {
      setSelected({ code: 'USD', symbol: '$', rate: 1 })
    })
  }, [])

  // Fetch live rates from free API as fallback
  useEffect(() => {
    if (selected?.code === 'USD') return
    fetch('https://open.er-api.com/v6/latest/USD').then(r => r.json()).then(data => {
      if (data?.rates) setRates(prev => ({ ...prev, ...data.rates }))
    }).catch(() => {})
  }, [selected?.code])

  const convert = (amountUSD) => {
    if (!selected || !rates[selected.code]) return amountUSD
    return amountUSD * (1 / rates['USD']) * rates[selected.code]
  }

  const format = (amountUSD) => {
    const converted = convert(amountUSD)
    const symbol = selected?.symbol || '$'
    return `${symbol}${converted.toFixed(2)}`
  }

  return (
    <CurrencyContext.Provider value={{ currencies, selected, setSelected, convert, format, rates }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => useContext(CurrencyContext)
