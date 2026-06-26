import config from '@/content/config.json';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-12">
      <div className="container mx-auto px-6 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} {config.site.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
