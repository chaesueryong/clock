'use client';

import { useState, useEffect, useRef } from 'react';
import { LS } from '@/lib/utils/localStorage';
import { LapTime } from '@/lib/types';

export default function StopwatchPage() {
  const [time, setTime] = useState({ minutes: '00', seconds: '00', milliseconds: '00' });
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [pauseTime, setPauseTime] = useState<number | null>(null);
  const [lapTimes, setLapTimes] = useState<LapTime[]>([]);
  const [lastLapTime, setLastLapTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load saved stopwatch state
    const savedStartTime = LS.get<number>(LS.stopWatchStartDate, null);
    const savedPauseTime = LS.get<number>(LS.stopWatchPauseDate, null);
    const savedLaps = LS.get<LapTime[]>(LS.stopwatchLaps, []);
    const savedLastLap = LS.get<number>(LS.stopwatchLastLap, 0);

    setLapTimes(savedLaps || []);
    setLastLapTime(savedLastLap || 0);

    if (savedStartTime) {
      setStartTime(savedStartTime);
      if (savedPauseTime) {
        setPauseTime(savedPauseTime);
        setIsPaused(true);
        updateTime(savedPauseTime, savedStartTime);
      } else {
        startStopwatch(true, savedStartTime);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);

    return {
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
      milliseconds: String(milliseconds).padStart(2, '0'),
    };
  };

  const formatTimeDiff = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${String(milliseconds).padStart(2, '0')}s`;
  };

  const updateTime = (current: number, start: number) => {
    const elapsed = current - start;
    setTime(formatTime(elapsed));
    setPauseTime(current);
  };

  const updateLapHighlights = (laps: LapTime[]) => {
    if (laps.length < 2) return laps;

    let fastestMs = Infinity;
    let slowestMs = 0;
    let fastestIndex = -1;
    let slowestIndex = -1;

    const updated = laps.map((lap, index) => {
      if (lap.ms < fastestMs) {
        fastestMs = lap.ms;
        fastestIndex = index;
      }
      if (lap.ms > slowestMs) {
        slowestMs = lap.ms;
        slowestIndex = index;
      }
      return { ...lap, isFastest: false, isSlowest: false };
    });

    if (fastestIndex >= 0) updated[fastestIndex].isFastest = true;
    if (slowestIndex >= 0) updated[slowestIndex].isSlowest = true;

    return updated;
  };

  const startStopwatch = (fromBackground = false, savedStart?: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    let newStartTime: number;

    if (savedStart) {
      newStartTime = savedStart;
    } else if (startTime && isPaused && pauseTime) {
      newStartTime = startTime + (Date.now() - pauseTime);
      setStartTime(newStartTime);
    } else {
      newStartTime = Date.now();
      setStartTime(newStartTime);
    }

    setIsRunning(true);
    setIsPaused(false);
    LS.remove(LS.stopWatchPauseDate);
    LS.set(LS.stopWatchStartDate, newStartTime);

    if (!fromBackground) {
      intervalRef.current = setInterval(() => {
        updateTime(Date.now(), newStartTime);
      }, 10);
    }
  };

  const stopStopwatch = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const now = Date.now();
    setPauseTime(now);
    setIsPaused(true);
    setIsRunning(false);
    LS.set(LS.stopWatchPauseDate, now);
  };

  const resetStopwatch = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTime({ minutes: '00', seconds: '00', milliseconds: '00' });
    setIsRunning(false);
    setIsPaused(false);
    setStartTime(null);
    setPauseTime(null);
    setLapTimes([]);
    setLastLapTime(0);
    LS.remove(LS.stopWatchStartDate);
    LS.remove(LS.stopWatchPauseDate);
    LS.remove(LS.stopwatchLaps);
    LS.remove(LS.stopwatchLastLap);
  };

  const recordLap = () => {
    if (!pauseTime || !startTime) return;

    const currentTimeMs = pauseTime - startTime;
    const lapTimeMs = currentTimeMs - lastLapTime;

    const lapTime = formatTime(lapTimeMs);
    const lapTimeStr = `${lapTime.minutes}:${lapTime.seconds}.${lapTime.milliseconds}`;

    let diff = '';
    if (lapTimes.length > 0) {
      const prevLapMs = lapTimes[0].ms;
      const diffMs = lapTimeMs - prevLapMs;
      diff = (diffMs >= 0 ? '+' : '') + formatTimeDiff(Math.abs(diffMs));
    }

    const newLap: LapTime = {
      time: lapTimeStr,
      totalTime: `${time.minutes}:${time.seconds}.${time.milliseconds}`,
      ms: lapTimeMs,
      diff,
      isFastest: false,
      isSlowest: false,
    };

    const updatedLaps = updateLapHighlights([newLap, ...lapTimes]);
    setLapTimes(updatedLaps);
    setLastLapTime(currentTimeMs);

    LS.set(LS.stopwatchLaps, updatedLaps);
    LS.set(LS.stopwatchLastLap, currentTimeMs);
  };

  const clearLaps = () => {
    setLapTimes([]);
    setLastLapTime(0);
    LS.remove(LS.stopwatchLaps);
    LS.remove(LS.stopwatchLastLap);
  };

  return (
    <div className="max-w-[1200px] mx-auto p-10 min-h-[700px] bg-gradient-to-br from-[var(--bg-color-1)] to-[var(--bg-color-2)] rounded-3xl my-5 shadow-2xl transition-all duration-300 hover:shadow-3xl">
      <div className="flex flex-col items-center">
        <div className="text-lg mb-10 font-light text-[var(--text-color-2)] tracking-[2px] uppercase">
          ⏱️ 스톱워치
        </div>

        <div className="animate-fade-in mb-16">
          <div className="flex items-baseline gap-1">
            <span
              className="text-[80px] font-bold text-[var(--text-color-1)]"
              style={{ fontFeatureSettings: '"tnum"', fontVariantNumeric: 'tabular-nums' }}
            >
              {time.minutes}:{time.seconds}
            </span>
            <span
              className="text-4xl font-semibold text-[var(--text-color-2)]"
              style={{ fontFeatureSettings: '"tnum"', fontVariantNumeric: 'tabular-nums' }}
            >
              .{time.milliseconds}
            </span>
          </div>
        </div>

        <div className="flex gap-4 mb-10 flex-wrap justify-center">
          {isRunning && (
            <button
              onClick={recordLap}
              className="px-8 py-3.5 bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-full font-semibold text-base shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl min-w-[130px] flex items-center justify-center gap-2"
            >
              <span>📝</span>
              <span>기록</span>
            </button>
          )}
          {isRunning && (
            <button
              onClick={stopStopwatch}
              className="px-8 py-3.5 bg-gradient-to-r from-[var(--bg-color-5)] to-[#F7B628] text-white rounded-full font-semibold text-base shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl min-w-[130px] flex items-center justify-center gap-2"
            >
              <span>⏸</span>
              <span>중지</span>
            </button>
          )}
          {isPaused && (
            <>
              <button
                onClick={resetStopwatch}
                className="px-8 py-3.5 bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white rounded-full font-semibold text-base shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl min-w-[130px] flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                <span>초기화</span>
              </button>
              <button
                onClick={() => startStopwatch()}
                className="px-8 py-3.5 bg-gradient-to-r from-[var(--bg-color-4)] to-[var(--bg-color-6)] text-white rounded-full font-semibold text-base shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl min-w-[130px] flex items-center justify-center gap-2"
              >
                <span>▶️</span>
                <span>재시작</span>
              </button>
            </>
          )}
          {!isRunning && !isPaused && (
            <button
              onClick={() => startStopwatch()}
              className="px-8 py-3.5 bg-gradient-to-r from-[var(--bg-color-4)] to-[var(--bg-color-6)] text-white rounded-full font-semibold text-base shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl min-w-[130px] flex items-center justify-center gap-2"
            >
              <span>▶️</span>
              <span>시작</span>
            </button>
          )}
        </div>

        {lapTimes.length > 0 && (
          <div className="w-full max-w-2xl mt-4">
            <div className="flex justify-between items-center mb-4 px-4">
              <h3 className="text-lg font-semibold text-[var(--text-color-1)]">
                랩 타임 기록 ({lapTimes.length})
              </h3>
              <button
                onClick={clearLaps}
                className="text-2xl hover:bg-[var(--bg-color-1)] p-2 rounded-lg transition-all"
                title="기록 지우기"
              >
                🗑️
              </button>
            </div>
            <div className="max-h-[300px] overflow-y-auto rounded-2xl p-2 bg-[var(--bg-color-2)]">
              {lapTimes.map((lap, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 mb-2 rounded-xl transition-all duration-300 hover:translate-x-1 hover:shadow-lg animate-slide-in
                    ${
                      lap.isFastest
                        ? 'bg-gradient-to-r from-green-50 to-[var(--bg-color-1)] border-l-4 border-green-500'
                        : lap.isSlowest
                        ? 'bg-gradient-to-r from-red-50 to-[var(--bg-color-1)] border-l-4 border-red-500'
                        : 'bg-[var(--bg-color-1)]'
                    }
                  `}
                >
                  <div className="font-semibold text-[var(--text-color-2)] min-w-[40px]">
                    #{lapTimes.length - index}
                  </div>
                  <div
                    className="flex-1 text-center text-lg font-medium text-[var(--text-color-1)]"
                    style={{ fontFeatureSettings: '"tnum"', fontVariantNumeric: 'tabular-nums' }}
                  >
                    {lap.time}
                  </div>
                  {lap.diff && (
                    <div className="text-sm text-[var(--text-color-2)] min-w-[80px] text-right">
                      {lap.diff}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
