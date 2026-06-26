import Link from 'next/link';
import config from '@/content/config.json';

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-white font-bold tracking-tight">
          {config.site.name}
        </Link>
        <nav className="hidden md:flex gap-8 text-sm text-gray-300">
          <Link href="#services" className="hover:text-white transition-colors">Services</Link>
          <Link href="#about" className="hover:text-white transition-colors">About</Link>
          <Link href="#portfolio" className="hover:text-white transition-colors">Portfolio</Link>
          <Link href="#contact" className="hover:text-white transition-colors">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
