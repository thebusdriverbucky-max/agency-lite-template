import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import config from '@/content/config.json';

export const metadata = {
  title: `${config.termsOfService?.title || 'Terms of Service'} | ${config.site.name}`,
  description: config.site.description,
};

export default function TermsOfServicePage() {
  const termsData = config.termsOfService || {
    title: 'Terms of Service',
    text: 'Replace this starter text with terms reviewed for your agency, services, intellectual property, client engagement process, operating countries, and jurisdiction before launch.',
  };

  return (
    <main className="bg-bg min-h-screen text-text selection:bg-accent selection:text-bg flex flex-col justify-between">
      <div>
        <Header />
        <section className="py-32 md:py-40">
          <div className="container mx-auto px-6 max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-text mb-12 tracking-tight">
              {termsData.title}
            </h1>
            <div className="space-y-6 text-text/70 leading-relaxed text-lg">
              {termsData.text.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
