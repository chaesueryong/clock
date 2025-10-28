import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '타이머 - 온라인 카운트다운 타이머',
  description: '정확한 온라인 타이머. 시, 분, 초 단위 설정. 타이머 프리셋 저장 기능. 일시정지/재개 지원. 완료 시 브라우저 알림.',
  keywords: ['타이머', '온라인 타이머', '카운트다운', '스톱워치 타이머', '무료 타이머', '타이머 프리셋', 'timer', 'countdown timer', 'online timer'],
  openGraph: {
    title: '타이머 - 온라인 카운트다운 타이머 | WWCLOCK',
    description: '정확한 온라인 타이머. 시, 분, 초 단위 설정. 타이머 프리셋 저장 기능. 완료 시 브라우저 알림.',
    url: 'https://wwclock.app/timer',
  },
  alternates: {
    canonical: 'https://wwclock.app/timer',
  },
};

export default function TimerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
