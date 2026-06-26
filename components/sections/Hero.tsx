import config from '@/content/config.json';
import Link from 'next/link';

export default function Hero() {
  const { hero } = config;
  return (
    <section className="min-h-screen flex items-center justify-center pt-16 bg-bg text-center">
      <div className="container mx-auto px-6 max-w-4xl flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-text mb-6 leading-tight">
          {hero.title}
        </h1>
        <p className="text-xl md:text-2xl text-text/70 mb-10 max-w-2xl">
          {hero.subtitle}
        </p>
        <Link
          href="#contact"
          className="bg-accent text-bg px-8 py-4 rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          {hero.ctaText}
        </Link>
      </div>
    </section>
  );
}
