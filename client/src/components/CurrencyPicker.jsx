import { useState, useRef, useEffect } from 'react';

const currencies = [
  { code: 'USD', symbol: '$', name: 'USD' },
  { code: 'EUR', symbol: '\u20AC', name: 'EUR' },
  { code: 'GBP', symbol: '\u00A3', name: 'GBP' },
  { code: 'JPY', symbol: '\u00A5', name: 'JPY' },
];

export default function CurrencyPicker() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(currencies[0]);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-horizon-600 dark:hover:text-horizon-400 transition-colors px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-midnight-800">
        <span className="font-medium">{current.symbol}</span>
        <span>{current.code}</span>
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-28 glass rounded-xl premium-shadow-lg overflow-hidden z-50 animate-scale-in">
          {currencies.map(c => (
            <button key={c.code} onClick={() => { setCurrent(c); setOpen(false); }} className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-midnight-800 ${current.code === c.code ? 'text-horizon-600 dark:text-horizon-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
              <span>{c.symbol}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
