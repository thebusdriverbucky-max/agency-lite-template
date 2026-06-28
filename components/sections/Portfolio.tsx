import work from '@/content/work.json';

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-32 bg-bg">
      <div className="container mx-auto px-6">
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
    </section>
  );
}
