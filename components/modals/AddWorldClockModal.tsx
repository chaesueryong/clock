'use client';

import { useState } from 'react';
import { WorldClock } from '@/lib/types';
import moment from 'moment-timezone';

interface AddWorldClockModalProps {
  onClose: () => void;
  onSave: (clock: Omit<WorldClock, 'id'>) => void;
}

export default function AddWorldClockModal({ onClose, onSave }: AddWorldClockModalProps) {
  const [search, setSearch] = useState('');

  const timezones = [
    { timezone: 'Asia/Seoul', city: '서울', country: '대한민국' },
    { timezone: 'Asia/Tokyo', city: '도쿄', country: '일본' },
    { timezone: 'Asia/Shanghai', city: '상하이', country: '중국' },
    { timezone: 'Asia/Hong_Kong', city: '홍콩', country: '홍콩' },
    { timezone: 'Asia/Singapore', city: '싱가포르', country: '싱가포르' },
    { timezone: 'Asia/Bangkok', city: '방콕', country: '태국' },
    { timezone: 'Asia/Dubai', city: '두바이', country: 'UAE' },
    { timezone: 'Europe/London', city: '런던', country: '영국' },
    { timezone: 'Europe/Paris', city: '파리', country: '프랑스' },
    { timezone: 'Europe/Berlin', city: '베를린', country: '독일' },
    { timezone: 'Europe/Moscow', city: '모스크바', country: '러시아' },
    { timezone: 'America/New_York', city: '뉴욕', country: '미국' },
    { timezone: 'America/Los_Angeles', city: '로스앤젤레스', country: '미국' },
    { timezone: 'America/Chicago', city: '시카고', country: '미국' },
    { timezone: 'America/Toronto', city: '토론토', country: '캐나다' },
    { timezone: 'America/Sao_Paulo', city: '상파울루', country: '브라질' },
    { timezone: 'Australia/Sydney', city: '시드니', country: '호주' },
    { timezone: 'Pacific/Auckland', city: '오클랜드', country: '뉴질랜드' },
  ];

  const filteredTimezones = timezones.filter(
    (tz) =>
      tz.city.toLowerCase().includes(search.toLowerCase()) ||
      tz.country.toLowerCase().includes(search.toLowerCase()) ||
      tz.timezone.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (timezone: typeof timezones[0]) => {
    onSave(timezone);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[var(--modal-bg-color-1)] backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[var(--bg-color-2)] rounded-2xl shadow-2xl w-[95%] sm:w-[90%] max-w-2xl p-4 sm:p-6 animate-fade-in-up max-h-[70vh] sm:max-h-[80vh] overflow-hidden flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-color-1)] transition-colors z-10"
        >
          ✕
        </button>

        <h2 className="text-lg sm:text-xl font-bold text-center mb-3 sm:mb-4 text-[var(--text-color-1)]">
          세계 시계 추가
        </h2>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="도시 또는 국가 검색..."
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-[var(--border-color-2)] bg-[var(--bg-color-7)] text-[var(--text-color-1)] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[var(--bg-color-4)] mb-3 sm:mb-4"
        />

        <div className="overflow-y-auto flex-1">
          <div className="space-y-2">
            {filteredTimezones.map((tz) => {
              const now = moment.tz(tz.timezone);
              const offset = now.format('Z');
              return (
                <button
                  key={tz.timezone}
                  onClick={() => handleSelect(tz)}
                  className="w-full p-3 sm:p-4 text-left rounded-xl bg-[var(--bg-color-1)] hover:bg-[var(--bg-color-3)] transition-all duration-300 hover:translate-x-1"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-[var(--text-color-1)] text-sm sm:text-base">
                        {tz.city}
                      </div>
                      <div className="text-xs sm:text-sm text-[var(--text-color-2)]">
                        {tz.country} (UTC{offset})
                      </div>
                    </div>
                    <div className="text-lg sm:text-xl font-semibold text-[var(--text-color-1)]">
                      {now.format('HH:mm')}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
