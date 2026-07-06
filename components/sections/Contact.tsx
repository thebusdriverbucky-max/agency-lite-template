import config from '@/content/config.json';
import Link from 'next/link';
import { type Config } from '@/lib/github';

export default function Contact() {
  const typedConfig = config as unknown as Config;
  const { contact } = typedConfig;
  const sectionOpacity = contact.opacity !== undefined ? contact.opacity : 1;
  const sectionLink = contact.link;

  return (
    <section
      id="contact"
      className="relative py-32 bg-bg border-t border-text/10 overflow-hidden"
      style={{ opacity: sectionOpacity }}
    >
      {sectionLink && (
        <Link
          href={sectionLink}
          className="absolute inset-0 z-20 cursor-pointer"
          aria-label={contact.title || "Contact link"}
        />
      )}

      {/* Premium Minimalist Background Decorations */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft, rich ambient glow centered on the section */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-accent blur-[85px] sm:blur-[120px]"
          style={{ opacity: 'var(--decor-glow-opacity, 0.12)' }}
        />

        {/* Concentric subtle decorative circles */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] border border-text rounded-full"
          style={{ opacity: 'var(--decor-line-text-opacity, 0.05)', borderWidth: 'var(--decor-border-width, 1px)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] border border-accent rounded-full"
          style={{ opacity: 'var(--decor-line-accent-opacity, 0.05)', borderWidth: 'var(--decor-border-width, 1px)' }}
        />
      </div>

      <div className="relative z-30 container mx-auto px-6 text-center flex flex-col items-center pointer-events-none">
        <div className="pointer-events-auto flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-bold text-text mb-6 tracking-tight">{contact.title}</h2>
          {contact.subtitle && (
            <p className="text-xl text-text/70 mb-10 max-w-2xl">{contact.subtitle}</p>
          )}
          <a
            href={`mailto:${contact.email}`}
            className="inline-flex items-center justify-center px-8 py-4 bg-accent text-bg rounded-full font-medium hover:opacity-90 transition-opacity text-lg"
          >
            {contact.buttonText}
          </a>
        </div>
      </div>
    </section>
  );
}
