import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Instrument_Sans, JetBrains_Mono } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { generateOrganizationSchema } from '@/lib/utils/seo';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/utils/constants';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0f',
};

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Free EV Tools Powered by EPA Data`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  manifest: '/manifest.json',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.evrangetools.com'),
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Free EV Tools Powered by EPA Data`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Free EV Tools Powered by EPA Data`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${plusJakarta.variable} ${instrumentSans.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <SchemaMarkup schema={generateOrganizationSchema()} />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
