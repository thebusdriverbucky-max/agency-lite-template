import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import config from "@/content/config.json";

const inter = Inter({
  subsets: ["latin"],
});

const siteUrl = config.site.url?.trim() || "https://example.com";
const keywords = config.site.keywords ?? [];
const ogImage = config.site.ogImage?.trim();
const twitter = config.site.twitter?.trim();
const locale = config.site.locale?.trim() || "en_US";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: config.site.name,
    template: `%s · ${config.site.name}`,
  },
  description: config.site.description,
  ...(keywords.length > 0 ? { keywords } : {}),
  applicationName: config.site.name,
  authors: [{ name: config.site.name }],
  creator: config.site.name,
  publisher: config.site.name,
  openGraph: {
    type: "website",
    locale,
    url: siteUrl,
    siteName: config.site.name,
    title: config.site.name,
    description: config.site.description,
    ...(ogImage ? { images: [{ url: ogImage }] } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: config.site.name,
    description: config.site.description,
    ...(twitter ? { creator: twitter } : {}),
    ...(ogImage ? { images: [{ url: ogImage }] } : {}),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" data-theme={config.theme}>
      <body className={`${inter.className} min-h-full flex flex-col bg-bg text-text`}>
        {children}
      </body>
    </html>
  );
}
