'use client';

import { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import { LS } from '@/lib/utils/localStorage';
import { WorldClock } from '@/lib/types';
import AddWorldClockModal from '@/components/modals/AddWorldClockModal';

export default function ClockPage() {
  const [currentTime, setCurrentTime] = useState({ time: '', date: '' });
  const [worldClocks, setWorldClocks] = useState<WorldClock[]>([]);
  const [clockTimes, setClockTimes] = useState<{ [key: string]: string }>({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Load saved world clocks
    const saved = LS.get<WorldClock[]>(LS.worldClocks, []);
    setWorldClocks(saved || []);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const m = moment.tz('Asia/Seoul');
      const amOrPm = m.format('a') === 'am' ? '오전' : '오후';
      const time = m.format('hh:mm:ss');
      const date = m.format('YYYY년 MM월 DD일');
      const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][m.day()];

      setCurrentTime({
        time: `${amOrPm} ${time}`,
        date: `${date} ${dayOfWeek}`,
      });

      // Update world clock times
      const times: { [key: string]: string } = {};
      worldClocks.forEach((clock) => {
        const clockTime = moment.tz(clock.timezone);
        const amPm = clockTime.format('a') === 'am' ? '오전' : '오후';
        times[clock.id] = `${amPm} ${clockTime.format('hh:mm:ss')}`;
      });
      setClockTimes(times);
    }, 1000);

    return () => clearInterval(interval);
  }, [worldClocks]);

  const addClock = (clock: Omit<WorldClock, 'id'>) => {
    const newClock: WorldClock = {
      ...clock,
      id: Date.now().toString(),
    };
    const updated = [...worldClocks, newClock];
    setWorldClocks(updated);
    LS.set(LS.worldClocks, updated);
    setShowModal(false);
  };

  const deleteClock = (id: string) => {
    const updated = worldClocks.filter((c) => c.id !== id);
    setWorldClocks(updated);
    LS.set(LS.worldClocks, updated);
  };

  const getTimeDifference = (timezone: string) => {
    const seoulTime = moment.tz('Asia/Seoul');
    const targetTime = moment.tz(timezone);
    const diff = targetTime.utcOffset() - seoulTime.utcOffset();
    const hours = Math.floor(Math.abs(diff) / 60);
    const sign = diff >= 0 ? '+' : '-';
    return `${sign}${hours}시간`;
  };

  return (
    <div className="max-w-[1200px] mx-auto p-3 sm:p-5 min-h-[500px] sm:min-h-[700px] bg-gradient-to-br from-[var(--bg-color-1)] to-[var(--bg-color-2)] rounded-2xl sm:rounded-3xl my-3 sm:my-5 shadow-2xl transition-all duration-300 hover:shadow-3xl">
      <div className="flex flex-col items-center">
        <div className="animate-fade-in p-3 sm:p-10 flex flex-col items-center mb-6 sm:mb-8">
          <div className="text-base mb-4 font-light text-[var(--text-color-2)] tracking-[2px] uppercase">
            현재시간 (서울)
          </div>
          <div
            className="text-4xl sm:text-7xl mb-4 font-bold text-[var(--text-color-1)]"
            style={{ fontFeatureSettings: '"tnum"', fontVariantNumeric: 'tabular-nums' }}
          >
            {currentTime.time}
          </div>
          <div className="text-lg sm:text-xl mb-6 sm:mb-8 font-light text-[var(--text-color-2)]">{currentTime.date}</div>

          <button
            onClick={() => setShowModal(true)}
            className="px-6 sm:px-9 py-2.5 sm:py-3.5 bg-gradient-to-r from-[#5ABD8C] to-[#34A853] text-white rounded-full font-semibold text-sm sm:text-base shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 flex items-center gap-2"
          >
            <span>➕</span>
            <span>시계 추가</span>
          </button>
        </div>

        {worldClocks.length > 0 && (
          <div className="w-full max-w-4xl px-2 sm:px-4">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-[var(--text-color-1)]">
              세계 시계 ({worldClocks.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {worldClocks.map((clock) => (
                <div
                  key={clock.id}
                  className="p-6 bg-[var(--bg-color-2)] rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 relative"
                >
                  <button
                    onClick={() => deleteClock(clock.id)}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-100 text-red-500 transition-colors"
                  >
                    ✕
                  </button>
                  <div className="mb-2">
                    <div className="text-2xl font-bold text-[var(--text-color-1)]">
                      {clock.city}
                    </div>
                    <div className="text-sm text-[var(--text-color-2)]">
                      {clock.country} {getTimeDifference(clock.timezone)}
                    </div>
                  </div>
                  <div
                    className="text-2xl sm:text-4xl font-bold text-[var(--text-color-1)]"
                    style={{ fontFeatureSettings: '"tnum"', fontVariantNumeric: 'tabular-nums' }}
                  >
                    {clockTimes[clock.id] || '--:--:--'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {worldClocks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌍</div>
            <p className="text-lg text-[var(--text-color-2)]">
              세계 여러 도시의 시간을 추가해보세요!
            </p>
          </div>
        )}
      </div>

      {showModal && (
        <AddWorldClockModal onClose={() => setShowModal(false)} onSave={addClock} />
      )}
    </div>
  );
}
