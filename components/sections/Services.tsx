import config from '@/content/config.json';
import { Code, Palette, Lightbulb } from 'lucide-react';

const icons = {
  Code: Code,
  Palette: Palette,
  Lightbulb: Lightbulb,
};

export default function Services() {
  const { services } = config;
  return (
    <section id="services" className="py-32 bg-zinc-950">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 tracking-tight">Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = icons[service.icon as keyof typeof icons] || Code;
            return (
              <div key={index} className="p-8 border border-white/10 rounded-2xl bg-black hover:border-white/20 transition-colors">
                <Icon className="w-10 h-10 text-white mb-6" strokeWidth={1.5} />
                <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
