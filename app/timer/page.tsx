'use client';

import { useState, useEffect, useRef } from 'react';
import { LS } from '@/lib/utils/localStorage';
import { TimerObj, TimerPreset } from '@/lib/types';
import { NotificationManager } from '@/lib/utils/notifications';
import SetTimerModal from '@/components/modals/SetTimerModal';
import ConfirmTimerModal from '@/components/modals/ConfirmTimerModal';

export default function TimerPage() {
  const [time, setTime] = useState({ days: '', hours: '00', minutes: '00', seconds: '00' });
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showSetModal, setShowSetModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [pauseTime, setPauseTime] = useState<number | null>(null);
  const [timerObj, setTimerObj] = useState<TimerObj | null>(null);
  const [presets, setPresets] = useState<TimerPreset[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load saved timer
    const savedTimer = LS.get<TimerObj>(LS.timerObj, null);
    const savedEndTime = LS.get<number>(LS.timerEndDate, null);
    const savedPauseTime = LS.get<number>(LS.timerPauseTime, null);
    const savedPresets = LS.get<TimerPreset[]>(LS.timerPresets, []);

    setTimerObj(savedTimer);
    setPresets(savedPresets || []);

    if (savedEndTime) {
      setEndTime(savedEndTime);
      if (savedPauseTime) {
        setPauseTime(savedPauseTime);
        setIsPaused(true);
        updateTimer(savedPauseTime, savedEndTime);
      } else {
        startTimer(true, savedEndTime);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const updateTimer = (current: number, end: number) => {
    const diff = end - current;
    if (diff <= 0) {
      setTime({ days: '', hours: '00', minutes: '00', seconds: '00' });
      setIsRunning(false);
      setShowConfirmModal(true);
      NotificationManager.showTimerNotification();
      clearTimer();
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setTime({
      days: days > 0 ? String(days) : '',
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
    });
  };

  const startTimer = (fromBackground = false, savedEndTime?: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    let newEndTime: number;

    if (savedEndTime) {
      newEndTime = savedEndTime;
    } else if (endTime && isPaused && pauseTime) {
      newEndTime = endTime + (Date.now() - pauseTime);
      setEndTime(newEndTime);
    } else if (timerObj) {
      const now = Date.now();
      newEndTime = now + (timerObj.hours * 3600 + timerObj.minutes * 60 + timerObj.seconds) * 1000;
      setEndTime(newEndTime);
    } else {
      return;
    }

    setIsRunning(true);
    setIsPaused(false);
    LS.set(LS.timerEndDate, newEndTime);
    LS.remove(LS.timerPauseTime);

    if (!fromBackground) {
      intervalRef.current = setInterval(() => {
        updateTimer(Date.now(), newEndTime);
      }, 100);
    }
  };

  const stopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const now = Date.now();
    setPauseTime(now);
    setIsPaused(true);
    setIsRunning(false);
    LS.set(LS.timerPauseTime, now);
  };

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTime({ days: '', hours: '00', minutes: '00', seconds: '00' });
    setIsRunning(false);
    setIsPaused(false);
    setEndTime(null);
    setPauseTime(null);
    LS.remove(LS.timerEndDate);
    LS.remove(LS.timerPauseTime);
  };

  const clearTimer = () => {
    resetTimer();
    setTimerObj(null);
    LS.remove(LS.timerObj);
  };

  const handleSetTimer = (timer: TimerObj) => {
    setTimerObj(timer);
    LS.set(LS.timerObj, timer);
    setShowSetModal(false);

    const now = Date.now();
    const newEndTime = now + (timer.hours * 3600 + timer.minutes * 60 + timer.seconds) * 1000;
    setEndTime(newEndTime);
    startTimer(false, newEndTime);
  };

  const usePreset = (preset: TimerPreset) => {
    const timer: TimerObj = {
      hours: preset.hours,
      minutes: preset.minutes,
      seconds: preset.seconds,
    };
    handleSetTimer(timer);
  };

  const saveAsPreset = () => {
    if (!timerObj) return;
    const name = prompt('프리셋 이름을 입력하세요:');
    if (!name) return;

    const newPreset: TimerPreset = {
      id: Date.now().toString(),
      name,
      ...timerObj,
    };

    const updated = [...presets, newPreset];
    setPresets(updated);
    LS.set(LS.timerPresets, updated);
  };

  const deletePreset = (id: string) => {
    const updated = presets.filter((p) => p.id !== id);
    setPresets(updated);
    LS.set(LS.timerPresets, updated);
  };

  return (
    <div className="max-w-[1200px] mx-auto p-10 min-h-[700px] bg-gradient-to-br from-[var(--bg-color-1)] to-[var(--bg-color-2)] rounded-3xl my-5 shadow-2xl transition-all duration-300 hover:shadow-3xl">
      <div className="flex flex-col items-center">
        <div className="text-lg mb-10 font-light text-[var(--text-color-2)] tracking-[2px] uppercase">
          ⏲️ 타이머
        </div>

        <div className="animate-fade-in flex items-center gap-5 mb-20">
          {time.days && (
            <div className="text-5xl font-bold text-[var(--bg-color-4)]">
              {time.days}<span className="text-2xl font-semibold text-[var(--text-color-2)] ml-2">일</span>
            </div>
          )}
          <div className="flex items-center text-[80px] font-bold">
            <span
              className="min-w-[100px] text-center text-[var(--text-color-1)]"
              style={{ fontFeatureSettings: '"tnum"', fontVariantNumeric: 'tabular-nums' }}
            >
              {time.hours}
            </span>
            <span className="opacity-50 animate-blink">:</span>
            <span
              className="min-w-[100px] text-center text-[var(--text-color-1)]"
              style={{ fontFeatureSettings: '"tnum"', fontVariantNumeric: 'tabular-nums' }}
            >
              {time.minutes}
            </span>
            <span className="opacity-50 animate-blink">:</span>
            <span
              className="min-w-[100px] text-center text-[var(--text-color-1)]"
              style={{ fontFeatureSettings: '"tnum"', fontVariantNumeric: 'tabular-nums' }}
            >
              {time.seconds}
            </span>
          </div>
        </div>

        <div className="flex gap-4 flex-wrap justify-center mb-8">
          {!isRunning && !isPaused && (
            <button
              onClick={() => setShowSetModal(true)}
              className="px-8 py-3.5 bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] text-white rounded-full font-semibold text-base shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl min-w-[140px] flex items-center justify-center gap-2"
            >
              <span>⚙️</span>
              <span>타이머설정</span>
            </button>
          )}
          {isPaused && (
            <>
              <button
                onClick={resetTimer}
                className="px-8 py-3.5 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white rounded-full font-semibold text-base shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl min-w-[140px] flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                <span>재설정</span>
              </button>
              <button
                onClick={() => startTimer()}
                className="px-8 py-3.5 bg-gradient-to-r from-[var(--bg-color-4)] to-[var(--bg-color-6)] text-white rounded-full font-semibold text-base shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl min-w-[140px] flex items-center justify-center gap-2"
              >
                <span>▶️</span>
                <span>계속하기</span>
              </button>
            </>
          )}
          {isRunning && (
            <button
              onClick={stopTimer}
              className="px-8 py-3.5 bg-gradient-to-r from-[var(--bg-color-5)] to-[#F7B628] text-white rounded-full font-semibold text-base shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl min-w-[140px] flex items-center justify-center gap-2"
            >
              <span>⏸</span>
              <span>중지</span>
            </button>
          )}
          {timerObj && (isPaused || isRunning) && (
            <button
              onClick={saveAsPreset}
              className="px-6 py-3.5 bg-[var(--bg-color-1)] text-[var(--text-color-1)] rounded-full font-semibold text-base shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              💾 프리셋 저장
            </button>
          )}
        </div>

        {presets.length > 0 && (
          <div className="w-full max-w-2xl mt-4">
            <h3 className="text-lg font-semibold mb-3 text-[var(--text-color-1)]">타이머 프리셋</h3>
            <div className="grid grid-cols-2 gap-3">
              {presets.map((preset) => (
                <div
                  key={preset.id}
                  className="flex items-center justify-between p-3 bg-[var(--bg-color-2)] rounded-xl shadow-md"
                >
                  <button
                    onClick={() => usePreset(preset)}
                    className="flex-1 text-left"
                  >
                    <div className="font-semibold text-[var(--text-color-1)]">{preset.name}</div>
                    <div className="text-sm text-[var(--text-color-2)]">
                      {preset.hours}시간 {preset.minutes}분 {preset.seconds}초
                    </div>
                  </button>
                  <button
                    onClick={() => deletePreset(preset.id)}
                    className="ml-2 px-3 py-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showSetModal && (
        <SetTimerModal onClose={() => setShowSetModal(false)} onSave={handleSetTimer} />
      )}

      {showConfirmModal && (
        <ConfirmTimerModal onConfirm={() => setShowConfirmModal(false)} />
      )}
    </div>
  );
}
