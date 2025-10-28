'use client';

import { useState } from 'react';
import { TimerObj } from '@/lib/types';

interface SetTimerModalProps {
  onClose: () => void;
  onSave: (timer: TimerObj) => void;
}

export default function SetTimerModal({ onClose, onSave }: SetTimerModalProps) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const handleSave = () => {
    if (hours === 0 && minutes === 0 && seconds === 0) {
      alert('시간을 설정해주세요!');
      return;
    }
    onSave({ hours, minutes, seconds });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-[var(--modal-bg-color-1)] backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[var(--bg-color-2)] rounded-2xl shadow-2xl w-[90%] max-w-lg p-6 animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-color-1)] transition-colors"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-center mb-6 text-[var(--text-color-1)]">
          타이머 설정
        </h2>

        <div className="flex justify-center gap-4 mb-8">
          <div className="flex flex-col items-center">
            <label className="text-sm text-[var(--text-color-2)] mb-2">시간</label>
            <input
              type="number"
              min="0"
              max="99"
              value={hours}
              onChange={(e) => setHours(Math.min(99, Math.max(0, parseInt(e.target.value) || 0)))}
              className="w-20 h-16 text-center text-2xl font-semibold rounded-xl border-2 border-[var(--border-color-2)] bg-[var(--bg-color-7)] text-[var(--text-color-1)] focus:outline-none focus:ring-2 focus:ring-[var(--bg-color-4)]"
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="text-sm text-[var(--text-color-2)] mb-2">분</label>
            <input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => setMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
              className="w-20 h-16 text-center text-2xl font-semibold rounded-xl border-2 border-[var(--border-color-2)] bg-[var(--bg-color-7)] text-[var(--text-color-1)] focus:outline-none focus:ring-2 focus:ring-[var(--bg-color-4)]"
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="text-sm text-[var(--text-color-2)] mb-2">초</label>
            <input
              type="number"
              min="0"
              max="59"
              value={seconds}
              onChange={(e) => setSeconds(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
              className="w-20 h-16 text-center text-2xl font-semibold rounded-xl border-2 border-[var(--border-color-2)] bg-[var(--bg-color-7)] text-[var(--text-color-1)] focus:outline-none focus:ring-2 focus:ring-[var(--bg-color-4)]"
            />
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full text-[var(--text-color-1)] hover:bg-[var(--bg-color-1)] transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-2.5 bg-gradient-to-r from-[var(--bg-color-4)] to-[var(--bg-color-6)] text-white rounded-full font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          >
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
