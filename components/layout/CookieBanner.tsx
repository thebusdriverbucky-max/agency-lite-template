'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import config from '@/content/config.json';

export default function CookieBanner() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setIsOpen(false);
  };

  // Hide on admin routes so it doesn't block the CMS UI
  if (pathname?.startsWith('/admin')) return null;

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 left-6 md:left-auto md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-bg border border-text/10 rounded-2xl p-6 shadow-2xl backdrop-blur-xl bg-opacity-95 flex flex-col gap-4">
        <div className="text-text/80 text-sm leading-relaxed">
          We use cookies to enhance your experience and analyze website traffic. By clicking "Accept", you consent to our use of cookies in accordance with our{' '}
          <Link href="/privacy-policy" className="text-accent underline hover:text-accent/80 transition-colors">
            {config.privacyPolicy?.title || 'Privacy Policy'}
          </Link>.
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-sm font-medium text-text/60 hover:text-text hover:bg-text/5 rounded-xl transition-all"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2 text-sm font-semibold bg-accent text-bg hover:bg-accent/90 rounded-xl transition-all shadow-md shadow-accent/10"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
