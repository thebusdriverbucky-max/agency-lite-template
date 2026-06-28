'use client';

import { usePathname } from 'next/navigation';
import config from '@/content/config.json';

export default function WhatsAppButton() {
  const pathname = usePathname();
  const whatsappNumber = config.site.whatsapp?.trim();
  const whatsappMessage = config.site.whatsappMessage?.trim();

  // Hide on admin routes so it doesn't get in the way of the editor UI
  if (pathname?.startsWith('/admin')) return null;

  if (!whatsappNumber) return null;

  // Clean phone number of any non-numeric characters (except maybe the plus, but wa.me prefers just digits)
  const cleanNumber = whatsappNumber.replace(/\D/g, '');

  let whatsappUrl = `https://wa.me/${cleanNumber}`;
  if (whatsappMessage) {
    whatsappUrl += `?text=${encodeURIComponent(whatsappMessage)}`;
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl hover:bg-[#20ba5a] hover:scale-110 active:scale-95 transition-all duration-300 group"
    >
      {/* Outer pulsing ring for visual engagement */}
      <span className="absolute inset-0 rounded-full bg-[#25D366]/30 animate-ping opacity-75 pointer-events-none group-hover:animate-none" />

      {/* SVG WhatsApp Brand Icon */}
      <svg
        className="w-8 h-8 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.013-5.101-2.861-6.958C16.427 1.99 13.97 1.013 11.96 1.013c-5.438 0-9.863 4.373-9.867 9.801-.001 1.968.513 3.889 1.492 5.607l-.986 3.59 3.693-.957zm11.455-7.38c-.322-.161-1.905-.94-2.2-1.047-.295-.108-.51-.161-.724.161-.215.322-.83.1.047-.1.02-.132.215-.24.321-.497.108-.258.054-.485-.027-.646-.08-.161-.724-1.745-.992-2.39-.262-.629-.53-.544-.724-.554l-.617-.01c-.215 0-.563.08-.858.459-.295.38-1.127 1.101-1.127 2.685 0 1.584 1.154 3.114 1.315 3.329.161.215 2.27 3.466 5.5 4.86.768.331 1.368.528 1.835.675.77.244 1.472.21 2.025.11.617-.11 1.905-.779 2.174-1.492.27-.712.27-1.322.188-1.449-.08-.127-.295-.215-.617-.376z" />
      </svg>
    </a>
  );
}
