import work from '@/content/work.json';
import Image from 'next/image';

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-32 bg-zinc-950">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 tracking-tight">Selected Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {work.map((project) => (
            <div key={project.id} className="group cursor-pointer">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 mb-6 border border-white/10">
                {/* Fallback layout if no images */}
                <div className="absolute inset-0 flex items-center justify-center text-zinc-800 text-6xl font-bold opacity-20">
                  {project.title.substring(0, 1)}
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2 group-hover:text-gray-300 transition-colors">{project.title}</h3>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-400 border border-gray-800 rounded-full px-3 py-1 bg-zinc-900">{project.category}</span>
                <p className="text-gray-500 text-sm truncate">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
