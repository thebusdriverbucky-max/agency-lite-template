import config from '@/content/config.json';
import Link from 'next/link';

export default function Hero() {
  const { hero } = config;
  const hasBg = Boolean(hero.backgroundImage);
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 bg-bg text-center overflow-hidden">
      {hasBg && (
        <>
          {/* Background image (URL from config). Falls back to plain bg if empty. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hero.backgroundImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Dark overlay so text stays readable over any image */}
          <div className="absolute inset-0 bg-bg/70" />
        </>
      )}
      <div className="relative container mx-auto px-6 max-w-4xl flex flex-col items-center">
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
