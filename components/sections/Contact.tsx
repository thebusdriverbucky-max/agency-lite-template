import config from '@/content/config.json';

export default function Contact() {
  const { contact } = config;
  return (
    <section id="contact" className="py-32 bg-black border-t border-white/10">
      <div className="container mx-auto px-6 text-center flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-10 tracking-tight">{contact.title}</h2>
        <a
          href={`mailto:${contact.email}`}
          className="inline-flex items-center justify-center px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors text-lg"
        >
          {contact.buttonText}
        </a>
      </div>
    </section>
  );
}

