import config from '@/content/config.json';

export default function About() {
  const { about } = config;
  return (
    <section id="about" className="py-32 bg-black">
      <div className="container mx-auto px-6 max-w-3xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-tight">{about.title}</h2>
        <p className="text-xl text-gray-400 leading-relaxed">
          {about.text}
        </p>
      </div>
    </section>
  );
}
