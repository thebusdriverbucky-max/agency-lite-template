import work from '@/content/work.json';
import config from '@/content/config.json';
import Link from 'next/link';
import { type Config } from '@/lib/github';

export default function Portfolio() {
  const typedConfig = config as unknown as Config;
  const { portfolioConfig } = typedConfig;
  const sectionOpacity = portfolioConfig?.opacity !== undefined ? portfolioConfig.opacity : 1;
  const sectionLink = portfolioConfig?.link;

  return (
    <section
      id="portfolio"
      className="relative py-32 bg-bg overflow-hidden"
      style={{ opacity: sectionOpacity }}
    >
      {sectionLink && (
        <Link
          href={sectionLink}
          className="absolute inset-0 z-20 cursor-pointer"
          aria-label="Portfolio link"
        />
      )}

      {/* Premium Minimalist Background Decorations */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft Ambient Glow on the bottom-left */}
        <div
          className="absolute bottom-1/4 left-0 w-[250px] sm:w-[450px] h-[250px] sm:h-[450px] rounded-full bg-accent blur-[80px] sm:blur-[120px]"
          style={{ opacity: 'var(--decor-glow-opacity, 0.04)' }}
        />

        {/* Giant subtle outline circle on the right */}
        <div
          className="absolute -right-40 top-1/4 w-[300px] sm:w-[650px] h-[300px] sm:h-[650px] border border-accent rounded-full"
          style={{ opacity: 'var(--decor-line-accent-opacity, 0.05)', borderWidth: 'var(--decor-border-width, 1px)' }}
        />
      </div>

      <div className="relative z-30 container mx-auto px-6 pointer-events-none">
        <div className="pointer-events-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-16 tracking-tight">Selected Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {work.map((project) => (
              <div key={project.id} className="group cursor-pointer">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-text/5 mb-6 border border-text/10">
                  {project.image && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={project.image}
                      alt={project.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}
                  {/* Fallback layout if no images */}
                  <div className="absolute inset-0 flex items-center justify-center text-text text-6xl font-bold opacity-10 pointer-events-none">
                    {project.title.substring(0, 1)}
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-text mb-2 group-hover:text-accent transition-colors">{project.title}</h3>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-text/70 border border-text/10 rounded-full px-3 py-1 bg-text/5">{project.category}</span>
                  <p className="text-text/50 text-sm truncate">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
