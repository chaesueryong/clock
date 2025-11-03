'use client';

import { useState } from 'react';
import { Alarm } from '@/lib/types';

interface SetAlarmModalProps {
  onClose: () => void;
  onSave: (alarm: Omit<Alarm, 'id' | 'createdAt'>) => void;
  editAlarm?: Alarm | null;
}

export default function SetAlarmModal({ onClose, onSave, editAlarm }: SetAlarmModalProps) {
  const [amPm, setAmPm] = useState(editAlarm?.amPm || '오전');
  const [hour, setHour] = useState(editAlarm?.hour || '07');
  const [minute, setMinute] = useState(editAlarm?.minute || '00');
  const [alarmName, setAlarmName] = useState(editAlarm?.alarmName || '');
  const [alarmMusic, setAlarmMusic] = useState(editAlarm?.alarmMusic || '새소리');
  const [repeat, setRepeat] = useState<string[]>(editAlarm?.repeat || []);

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  const weekDays = [
    { key: '월', label: '월' },
    { key: '화', label: '화' },
    { key: '수', label: '수' },
    { key: '목', label: '목' },
    { key: '금', label: '금' },
    { key: '토', label: '토' },
    { key: '일', label: '일' },
  ];

  const toggleRepeat = (day: string) => {
    setRepeat((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    const hourNum = parseInt(hour);
    const fullTime = amPm === '오전'
      ? `${hourNum === 12 ? 0 : hourNum}:${minute}`
      : `${hourNum === 12 ? 12 : hourNum + 12}:${minute}`;

    onSave({
      amPm,
      hour,
      minute,
      alarmName,
      alarmMusic,
      fullTime,
      enabled: true,
      repeat,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[var(--modal-bg-color-1)] backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[var(--bg-color-2)] rounded-2xl shadow-2xl w-[95%] sm:w-[90%] max-w-2xl p-4 sm:p-6 animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-color-1)] transition-colors"
        >
          ✕
        </button>

        <h2 className="text-lg sm:text-xl font-bold text-center mb-4 sm:mb-6 text-[var(--text-color-1)]">
          {editAlarm ? '알람 수정' : '알람 설정'}
        </h2>

        <div className="space-y-4 sm:space-y-6">
          {/* 시간 선택 */}
          <div className="flex items-center gap-3 sm:gap-4">
            <label className="w-24 text-sm font-medium text-[var(--text-color-1)]">
              시간 선택
            </label>
            <div className="flex-1 flex gap-2 sm:gap-3">
              <select
                value={amPm}
                onChange={(e) => setAmPm(e.target.value)}
                className="px-3 sm:px-4 py-2 rounded-full border border-[var(--border-color-2)] bg-[var(--bg-color-7)] text-[var(--text-color-1)] text-sm sm:text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--bg-color-4)]"
              >
                <option>오전</option>
                <option>오후</option>
              </select>

              <select
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                className="px-3 sm:px-4 py-2 rounded-full border border-[var(--border-color-2)] bg-[var(--bg-color-7)] text-[var(--text-color-1)] text-sm sm:text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--bg-color-4)]"
              >
                {hours.map((h) => (
                  <option key={h} value={h}>
                    {h}시
                  </option>
                ))}
              </select>

              <select
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                className="px-3 sm:px-4 py-2 rounded-full border border-[var(--border-color-2)] bg-[var(--bg-color-7)] text-[var(--text-color-1)] text-sm sm:text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--bg-color-4)]"
              >
                {minutes.map((m) => (
                  <option key={m} value={m}>
                    {m}분
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 반복 */}
          <div className="flex items-start gap-3 sm:gap-4">
            <label className="w-24 text-sm font-medium text-[var(--text-color-1)] pt-2">
              반복
            </label>
            <div className="flex-1 flex gap-2 flex-wrap">
              {weekDays.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => toggleRepeat(key)}
                  className={`w-10 h-10 rounded-full font-semibold transition-all duration-300 ${
                    repeat.includes(key)
                      ? 'bg-[var(--bg-color-4)] text-white'
                      : 'bg-[var(--bg-color-1)] text-[var(--text-color-2)] hover:bg-[var(--bg-color-3)]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 알람 이름 */}
          <div className="flex items-center gap-3 sm:gap-4">
            <label className="w-24 text-sm font-medium text-[var(--text-color-1)]">
              알람 이름
            </label>
            <input
              type="text"
              value={alarmName}
              onChange={(e) => setAlarmName(e.target.value)}
              placeholder="알람 이름을 입력하세요"
              className="flex-1 px-3 sm:px-4 py-2 rounded-full border border-[var(--border-color-2)] bg-[var(--bg-color-7)] text-[var(--text-color-1)] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[var(--bg-color-4)]"
            />
          </div>

          {/* 알림음 */}
          <div className="flex items-center gap-3 sm:gap-4">
            <label className="w-24 text-sm font-medium text-[var(--text-color-1)]">
              알림음
            </label>
            <select
              value={alarmMusic}
              onChange={(e) => setAlarmMusic(e.target.value)}
              className="flex-1 px-3 sm:px-4 py-2 rounded-full border border-[var(--border-color-2)] bg-[var(--bg-color-7)] text-[var(--text-color-1)] text-sm sm:text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--bg-color-4)]"
            >
              <option>새소리</option>
              <option>벨소리</option>
              <option>차임벨</option>
              <option>기타</option>
            </select>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-2 sm:gap-3 justify-center mt-6 sm:mt-8">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2.5 rounded-full text-[var(--text-color-1)] text-sm sm:text-base hover:bg-[var(--bg-color-1)] transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-5 sm:px-8 py-2.5 bg-gradient-to-r from-[var(--bg-color-4)] to-[var(--bg-color-6)] text-white rounded-full font-semibold text-sm sm:text-base shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          >
            {editAlarm ? '수정하기' : '설정하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
