import config from '@/content/config.json';
import Link from 'next/link';
import { type Config } from '@/lib/github';

export default function Hero() {
  const typedConfig = config as unknown as Config;
  const { hero } = typedConfig;
  const hasBg = Boolean(hero.backgroundImage);
  const imgOpacity = hero.imageOpacity !== undefined ? hero.imageOpacity : 1;
  const sectionOpacity = hero.opacity !== undefined ? hero.opacity : 1;
  const sectionLink = hero.link;

  return (
    <section
      className="relative min-h-screen flex items-center justify-center pt-16 bg-bg text-center overflow-hidden"
      style={{ opacity: sectionOpacity }}
    >
      {hasBg && (
        <>
          {/* Background image (URL from config). Falls back to plain bg if empty. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hero.backgroundImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: imgOpacity }}
          />
          {/* Dark overlay so text stays readable over any image */}
          <div className="absolute inset-0 bg-bg/70" />
        </>
      )}

      {sectionLink && (
        <Link
          href={sectionLink}
          className="absolute inset-0 z-20 cursor-pointer"
          aria-label={hero.title || "Section link"}
        />
      )}

      {/* Premium Minimalist Background Decorations */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft Ambient Glow (blends beautifully on solid backgrounds, and adds depth on images) */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] md:w-[800px] h-[300px] sm:h-[500px] md:h-[800px] rounded-full bg-accent blur-[80px] sm:blur-[120px] transition-opacity duration-1000"
          style={{ opacity: `calc(var(--decor-glow-opacity, 0.12) * ${hasBg ? 0.4 : 1.0})` }}
        />

        {/* Elegant Thin Circle Outlines */}
        <div
          className="absolute -top-[10%] -right-[10%] w-[350px] md:w-[700px] h-[350px] md:h-[700px] border border-accent rounded-full"
          style={{ opacity: 'var(--decor-line-accent-opacity, 0.10)', borderWidth: 'var(--decor-border-width, 1px)' }}
        />
        <div
          className="absolute -bottom-[20%] -left-[10%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] border border-text rounded-full"
          style={{ opacity: 'var(--decor-line-text-opacity, 0.05)', borderWidth: 'var(--decor-border-width, 1px)' }}
        />

        {/* Subtle decorative scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-text/40">Scroll</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-accent/50 to-transparent animate-pulse" />
        </div>
      </div>

      <div className="relative z-30 container mx-auto px-6 max-w-4xl flex flex-col items-center pointer-events-none">
        <div className="pointer-events-auto flex flex-col items-center">
          <h1
            className="text-5xl md:text-7xl font-extrabold tracking-tighter text-text mb-6 leading-tight opacity-0 animate-fade-in-up"
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            {hero.title}
          </h1>
          <p
            className="text-xl md:text-2xl text-text/70 mb-10 max-w-2xl opacity-0 animate-fade-in-up"
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            {hero.subtitle}
          </p>
          <Link
            href="#contact"
            className="bg-accent text-bg px-8 py-4 rounded-full font-medium hover:opacity-90 transition-opacity opacity-0 animate-fade-in-up"
            style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
          >
            {hero.ctaText}
          </Link>
        </div>
      </div>
    </section>
  );
}
