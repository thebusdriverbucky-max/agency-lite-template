import config from '@/content/config.json';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-text/10 bg-bg py-12">
      <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-text/50 text-sm">
        <p>&copy; {new Date().getFullYear()} {config.site.name}. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy-policy" className="hover:text-accent transition-colors">
            {config.privacyPolicy?.title || 'Privacy Policy'}
          </Link>
          <Link href="/terms-of-service" className="hover:text-accent transition-colors">
            {config.termsOfService?.title || 'Terms of Service'}
          </Link>
        </div>
      </div>
    </footer>
  );
}
