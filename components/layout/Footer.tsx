import config from '@/content/config.json';

export default function Footer() {
  return (
    <footer className="border-t border-text/10 bg-bg py-12">
      <div className="container mx-auto px-6 text-center text-text/50 text-sm">
        <p>&copy; {new Date().getFullYear()} {config.site.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
