import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import StructuredData from '@/components/StructuredData';

export const metadata: Metadata = {
  metadataBase: new URL('https://wwclock.app'),
  title: {
    default: 'WWCLOCK - 무료 온라인 알람, 타이머, 스톱워치, 세계시계',
    template: '%s | WWCLOCK',
  },
  description: '무료 온라인 시계 앱. 알람 설정, 타이머, 스톱워치, 세계시계 기능을 한 곳에서. 모바일과 PC 모두 지원. 브라우저 알림 지원.',
  keywords: ['알람', '타이머', '스톱워치', '세계시계', '온라인 시계', '무료 알람', '온라인 타이머', '랩타임', '세계 시간', 'alarm', 'timer', 'stopwatch', 'world clock'],
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
    locale: 'ko_KR',
    url: 'https://wwclock.app',
    title: 'WWCLOCK - 무료 온라인 알람, 타이머, 스톱워치, 세계시계',
    description: '무료 온라인 시계 앱. 알람 설정, 타이머, 스톱워치, 세계시계 기능을 한 곳에서. 모바일과 PC 모두 지원.',
    siteName: 'WWCLOCK',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WWCLOCK - 다기능 시계 앱',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WWCLOCK - 무료 온라인 알람, 타이머, 스톱워치, 세계시계',
    description: '무료 온라인 시계 앱. 알람 설정, 타이머, 스톱워치, 세계시계 기능을 한 곳에서.',
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
    canonical: 'https://wwclock.app',
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <StructuredData />
      </head>
      <body className="antialiased">
        <div className="flex flex-col h-screen">
          <Header />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
