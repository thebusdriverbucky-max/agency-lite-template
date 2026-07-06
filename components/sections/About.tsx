import config from '@/content/config.json';

export default function About() {
  const { about } = config;
  return (
    <section id="about" className="relative py-32 bg-bg overflow-hidden">
      {/* Premium Minimalist Background Decorations */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft Accent Glow behind the text */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[400px] h-[280px] sm:h-[400px] rounded-full bg-accent blur-[80px] sm:blur-[100px]"
          style={{ opacity: 'var(--decor-glow-opacity, 0.08)' }}
        />

        {/* Elegant vertical line from top to connect sections */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-gradient-to-b from-text/10 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-6 max-w-3xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-text mb-8 tracking-tight">{about.title}</h2>
        <p className="text-xl text-text/70 leading-relaxed">
          {about.text}
        </p>
      </div>
    </section>
  );
}
