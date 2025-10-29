export default function StructuredData({ locale = 'ko' }: { locale?: string }) {
  const content = locale === 'ko' ? {
    description: '무료 온라인 시계 앱. 알람 설정, 타이머, 스톱워치, 세계시계 기능을 한 곳에서.',
    featureList: [
      '다중 알람 설정',
      '반복 알람',
      '타이머 프리셋',
      '랩타임 기록',
      '세계시계',
      '브라우저 알림',
    ],
    priceCurrency: 'KRW',
    inLanguage: 'ko-KR',
  } : {
    description: 'Free online clock app. Alarm, timer, stopwatch, and world clock features in one place.',
    featureList: [
      'Multiple alarms',
      'Recurring alarms',
      'Timer presets',
      'Lap time recording',
      'World clock',
      'Browser notifications',
    ],
    priceCurrency: 'USD',
    inLanguage: 'en-US',
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'WWCLOCK',
    description: content.description,
    url: 'https://wwclock.app',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: content.priceCurrency,
    },
    featureList: content.featureList,
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
    inLanguage: content.inLanguage,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
