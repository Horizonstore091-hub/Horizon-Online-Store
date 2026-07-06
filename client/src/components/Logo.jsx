export default function Logo({ className = 'h-8', showText = true }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full">
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40">
            <stop offset="0%" stopColor="#5c72b4" />
            <stop offset="100%" stopColor="#a2b1db" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="18" stroke="url(#logoGrad)" strokeWidth="2" fill="none" className="opacity-30" />
        <path d="M12 28L20 10L28 28H12Z" fill="url(#logoGrad)" />
        <path d="M16 22L20 14L24 22H16Z" fill="white" className="dark:fill-midnight-950" opacity="0.9" />
        <circle cx="20" cy="20" r="4" fill="url(#logoGrad)" opacity="0.6" />
      </svg>
      {showText && (
        <span className="font-bold text-xl text-midnight-900 dark:text-white tracking-tight">
          HORIZON
        </span>
      )}
    </div>
  );
}
