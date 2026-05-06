import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic, Playfair_Display } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LanguageProvider } from '@/i18n';
import { AuthProvider } from '@/hooks/useAuth';
import '@/styles/globals.css';

const plexSansArabic = IBM_Plex_Sans_Arabic({
  variable: '--font-plex-sans-arabic',
  subsets: ['latin', 'arabic'],
  weight: ['400', '500', '600', '700'],
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
    <html lang="ar" dir="rtl" className={`${plexSansArabic.variable} ${playfairDisplay.variable}`}>
      <body className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
        <LanguageProvider>
          <AuthProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
