export default function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'WWCLOCK',
    description: '무료 온라인 시계 앱. 알람 설정, 타이머, 스톱워치, 세계시계 기능을 한 곳에서.',
    url: 'https://wwclock.app',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
    featureList: [
      '다중 알람 설정',
      '반복 알람',
      '타이머 프리셋',
      '랩타임 기록',
      '세계시계',
      '브라우저 알림',
    ],
    screenshot: 'https://wwclock.app/og-image.png',
    author: {
      '@type': 'Organization',
      name: 'WWCLOCK',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
    },
    inLanguage: 'ko-KR',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
