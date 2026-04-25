import type { Metadata } from 'next';
import { Amiri, Playfair_Display } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LanguageProvider } from '@/i18n';
import '@/styles/globals.css';

const amiri = Amiri({
  variable: '--font-amiri',
  subsets: ['latin', 'arabic'],
  weight: ['400', '700'],
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  variable: '--font-playfair-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'RATQ — Community Platform',
    template: '%s | RATQ Community Platform',
  },
  description:
    'A community-driven hub for discovering, distributing, and governing Quranic development assets. Libraries, SDKs, datasets, APIs, and scholarly resources.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${amiri.variable} ${playfairDisplay.variable}`}>
      <body className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
        <LanguageProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
