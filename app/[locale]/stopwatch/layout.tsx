import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '스톱워치 - 랩타임 기록 스톱워치',
  description: '밀리초 단위 정확도의 온라인 스톱워치. 랩타임 기록, 최고/최저 랩타임 자동 표시. 무제한 랩타임 저장.',
  keywords: ['스톱워치', '온라인 스톱워치', '랩타임', '스포츠 타이머', '운동 타이머', '정밀 스톱워치', 'stopwatch', 'lap timer', 'online stopwatch'],
  openGraph: {
    title: '스톱워치 - 랩타임 기록 스톱워치 | WWCLOCK',
    description: '밀리초 단위 정확도의 온라인 스톱워치. 랩타임 기록, 최고/최저 랩타임 자동 표시.',
    url: 'https://wwclock.app/stopwatch',
  },
  alternates: {
    canonical: 'https://wwclock.app/stopwatch',
  },
};

export default function StopwatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
