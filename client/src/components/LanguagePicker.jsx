import { useState, useRef, useEffect } from 'react';

const languages = [
  { code: 'en', name: 'English', flag: 'US' },
  { code: 'es', name: 'Espanol', flag: 'ES' },
  { code: 'fr', name: 'Francais', flag: 'FR' },
  { code: 'de', name: 'Deutsch', flag: 'DE' },
];

export default function LanguagePicker() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(languages[0]);
  const [loading, setLoading] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const switchLanguage = async (lang) => {
    setCurrent(lang);
    setOpen(false);
    setLoading(true);
    try {
      await fetch(`/api/translations?locale=${lang.code}`);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} disabled={loading} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 hover:text-horizon-600 dark:hover:text-horizon-400 transition-colors px-2 py-1 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-midnight-600 dark:border-midnight-700 dark:bg-midnight-900">
        <span className="text-base leading-none">{current.flag === 'US' ? '\uD83C\uDDFA\uD83C\uDDF8' : ''}</span>
        <span>{current.code.toUpperCase()}</span>
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 glass rounded-xl premium-shadow-lg overflow-hidden z-50 animate-scale-in">
          {languages.map(lang => (
            <button key={lang.code} onClick={() => switchLanguage(lang)} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-midnight-800 ${current.code === lang.code ? 'text-horizon-600 dark:text-horizon-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
              <span className="text-base">{lang.flag === 'US' ? '\uD83C\uDDFA\uD83C\uDDF8' : ''}</span>
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
