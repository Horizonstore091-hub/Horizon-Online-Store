import { useCurrency } from '../context/CurrencyContext'

export default function CurrencySelector() {
  const { currencies, selected, setSelected } = useCurrency()
  if (!currencies || currencies.length === 0) return null

  return (
    <select
      value={selected?.code || 'USD'}
      onChange={e => {
        const c = currencies.find(cu => cu.code === e.target.value)
        if (c) setSelected(c)
      }}
      className="text-xs bg-transparent border border-gray-300 dark:border-midnight-700 rounded px-2 py-1 text-gray-700 dark:text-gray-300"
    >
      {currencies.map(c => (
        <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
      ))}
    </select>
  )
}
