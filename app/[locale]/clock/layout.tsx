import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '세계시계 - 세계 시간 확인',
  description: '전 세계 주요 도시의 현재 시간을 한눈에. 18개 주요 도시 지원. 서울과의 시차 표시. 실시간 업데이트.',
  keywords: ['세계시계', '세계 시간', '시차', '타임존', '도시별 시간', '국제 시간', 'world clock', 'timezone', 'international time'],
  openGraph: {
    title: '세계시계 - 세계 시간 확인 | WWCLOCK',
    description: '전 세계 주요 도시의 현재 시간을 한눈에. 18개 주요 도시 지원. 서울과의 시차 표시.',
    url: 'https://wwclock.app/clock',
  },
  alternates: {
    canonical: 'https://wwclock.app/clock',
  },
};

export default function ClockLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
