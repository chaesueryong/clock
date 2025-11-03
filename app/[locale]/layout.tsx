import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';
import '../globals.css';
import Header from '@/components/Header';
import StructuredData from '@/components/StructuredData';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.home' });

  return {
    metadataBase: new URL('https://wwclock.app'),
    title: {
      default: t('title'),
      template: '%s | WWCLOCK',
    },
    description: t('description'),
    keywords: ['alarm', 'timer', 'stopwatch', 'world clock', 'online clock', 'free alarm', 'online timer', 'lap time', 'world time', '알람', '타이머', '스톱워치', '세계시계'],
    authors: [{ name: 'WWCLOCK' }],
    creator: 'WWCLOCK',
    publisher: 'WWCLOCK',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    manifest: '/manifest.json',
    openGraph: {
      type: 'website',
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      url: `https://wwclock.app${locale === 'ko' ? '' : `/${locale}`}`,
      title: t('title'),
      description: t('description'),
      siteName: 'WWCLOCK',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'WWCLOCK',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `https://wwclock.app${locale === 'ko' ? '' : `/${locale}`}`,
      languages: {
        'ko': 'https://wwclock.app',
        'en': 'https://wwclock.app/en',
      },
    },
    verification: {
      google: 'google-site-verification-code',
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <StructuredData locale={locale} />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <div className="flex flex-col h-screen">
            <Header />
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
