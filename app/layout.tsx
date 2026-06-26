import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import config from "@/content/config.json";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: config.site.name,
  description: config.site.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className={`${inter.className} min-h-full flex flex-col bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}
