import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('horizon-cookies');
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem('horizon-cookies', 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('horizon-cookies', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-consent animate-slide-up">
      <div className="cookie-consent-inner">
        <div className="flex-1">
          <h3 className="font-semibold text-midnight-900 dark:text-white text-sm">We Value Your Privacy</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            We use cookies to enhance your browsing experience and analyze our traffic.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={decline} className="btn-secondary text-sm !py-2 !px-5">Decline</button>
          <button onClick={accept} className="btn-primary text-sm !py-2 !px-5">Accept All</button>
        </div>
      </div>
    </div>
  );
}
