import config from '@/content/config.json';
import Link from 'next/link';

export default function Hero() {
  const { hero } = config;
  return (
    <section className="min-h-screen flex items-center justify-center pt-16 bg-black text-center">
      <div className="container mx-auto px-6 max-w-4xl flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white mb-6 leading-tight">
          {hero.title}
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl">
          {hero.subtitle}
        </p>
        <Link
          href="#contact"
          className="bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-200 transition-colors"
        >
          {hero.ctaText}
        </Link>
      </div>
    </section>
  );
}
