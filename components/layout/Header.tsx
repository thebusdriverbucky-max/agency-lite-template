import Link from 'next/link';
import config from '@/content/config.json';

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-bg/80 backdrop-blur-md border-b border-text/10">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-text font-bold tracking-tight">
          {config.site.name}
        </Link>
        <nav className="hidden md:flex gap-8 text-sm text-text/70">
          <Link href="#services" className="hover:text-accent transition-colors">Services</Link>
          <Link href="#about" className="hover:text-accent transition-colors">About</Link>
          <Link href="#portfolio" className="hover:text-accent transition-colors">Portfolio</Link>
          <Link href="#contact" className="hover:text-accent transition-colors">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
