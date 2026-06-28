import config from '@/content/config.json';

export default function Contact() {
  const { contact } = config;
  return (
    <section id="contact" className="py-32 bg-bg border-t border-text/10">
      <div className="container mx-auto px-6 text-center flex flex-col items-center">
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
    </section>
  );
}
