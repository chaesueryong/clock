'use client';

import { useEffect, useState, useCallback } from 'react';
import moment from 'moment-timezone';
import { LS } from '@/lib/utils/localStorage';
import { Alarm } from '@/lib/types';
import { NotificationManager } from '@/lib/utils/notifications';
import SetAlarmModal from '@/components/modals/SetAlarmModal';
import ConfirmAlarmModal from '@/components/modals/ConfirmAlarmModal';

export default function AlarmPage() {
  const [currentTime, setCurrentTime] = useState({ time: '', date: '' });
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [nextAlarm, setNextAlarm] = useState<Alarm | null>(null);
  const [timeToAlarm, setTimeToAlarm] = useState({ hours: '00', minutes: '00', seconds: '00' });
  const [showSetModal, setShowSetModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [triggeredAlarm, setTriggeredAlarm] = useState<Alarm | null>(null);
  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);

  // Load alarms from localStorage
  useEffect(() => {
    const savedAlarms = LS.get<Alarm[]>(LS.alarms, []);
    setAlarms(savedAlarms || []);
  }, []);

  // Update time and check alarms
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

      checkAlarms(m);
    }, 1000);

    return () => clearInterval(interval);
  }, [alarms]);

  const checkAlarms = useCallback((currentMoment: moment.Moment) => {
    const enabledAlarms = alarms.filter((a) => a.enabled);
    if (enabledAlarms.length === 0) {
      setNextAlarm(null);
      return;
    }

    interface NearestAlarm {
      alarm: Alarm;
      diff: number;
    }

    let nearest: NearestAlarm | null = null;
    const currentDay = ['일', '월', '화', '수', '목', '금', '토'][currentMoment.day()];

    enabledAlarms.forEach((alarm) => {
      // Check if alarm should repeat today
      if (alarm.repeat && alarm.repeat.length > 0 && !alarm.repeat.includes(currentDay)) {
        return;
      }

      const [hour, minute] = alarm.fullTime.split(':');
      let alarmTime = moment(currentMoment)
        .hour(parseInt(hour))
        .minute(parseInt(minute))
        .second(0);

      let diff = alarmTime.diff(currentMoment);

      if (diff < 0) {
        alarmTime.add(1, 'day');
        diff = alarmTime.diff(currentMoment);
      }

      if (!nearest || diff < nearest.diff) {
        nearest = { alarm, diff };
      }

      // Trigger alarm if it's time (within 1 second)
      if (diff >= 0 && diff <= 1000) {
        setTriggeredAlarm(alarm);
        setShowConfirmModal(true);
        NotificationManager.showAlarmNotification(
          alarm.alarmName || '알람',
          `${alarm.amPm} ${alarm.hour}:${alarm.minute}`
        );
      }
    });

    if (nearest) {
      const nearestAlarm: NearestAlarm = nearest;
      setNextAlarm(nearestAlarm.alarm);
      const duration = moment.duration(nearestAlarm.diff);
      setTimeToAlarm({
        hours: String(Math.floor(duration.asHours())).padStart(2, '0'),
        minutes: String(duration.minutes()).padStart(2, '0'),
        seconds: String(duration.seconds()).padStart(2, '0'),
      });
    }
  }, [alarms]);

  const saveAlarm = (alarmData: Omit<Alarm, 'id' | 'createdAt'>) => {
    let updatedAlarms: Alarm[];

    if (editingAlarm) {
      updatedAlarms = alarms.map((a) =>
        a.id === editingAlarm.id
          ? { ...alarmData, id: editingAlarm.id, createdAt: editingAlarm.createdAt }
          : a
      );
    } else {
      const newAlarm: Alarm = {
        ...alarmData,
        id: Date.now().toString(),
        createdAt: Date.now(),
      };
      updatedAlarms = [...alarms, newAlarm];
    }

    setAlarms(updatedAlarms);
    LS.set(LS.alarms, updatedAlarms);
    setShowSetModal(false);
    setEditingAlarm(null);
  };

  const deleteAlarm = (id: string) => {
    const updated = alarms.filter((a) => a.id !== id);
    setAlarms(updated);
    LS.set(LS.alarms, updated);
  };

  const toggleAlarm = (id: string) => {
    const updated = alarms.map((a) =>
      a.id === id ? { ...a, enabled: !a.enabled } : a
    );
    setAlarms(updated);
    LS.set(LS.alarms, updated);
  };

  const editAlarm = (alarm: Alarm) => {
    setEditingAlarm(alarm);
    setShowSetModal(true);
  };

  const confirmAlarm = () => {
    setShowConfirmModal(false);
    setTriggeredAlarm(null);
  };

  return (
    <div className="max-w-[1200px] mx-auto p-5 min-h-[700px] bg-gradient-to-br from-[var(--bg-color-1)] to-[var(--bg-color-2)] rounded-3xl my-5 shadow-2xl transition-all duration-300 hover:shadow-3xl">
      <div className="flex flex-col items-center">
        {nextAlarm && (
          <div className="animate-fade-in-up my-16 flex flex-col items-center">
            <div className="w-80 h-80 rounded-full border-[6px] border-[var(--bg-color-4)] flex flex-col items-center justify-center bg-gradient-to-br from-[var(--bg-color-2)] to-[var(--bg-color-1)] animate-pulse-ring">
              <div className="text-base mb-5 font-light opacity-80 tracking-wide">⏰ 다음 알람</div>
              <div className="text-5xl mb-5 font-light flex items-center gap-1">
                <span className="min-w-[60px] text-center">{timeToAlarm.hours}</span>
                <span className="opacity-50 animate-blink">:</span>
                <span className="min-w-[60px] text-center">{timeToAlarm.minutes}</span>
                <span className="opacity-50 animate-blink">:</span>
                <span className="min-w-[60px] text-center">{timeToAlarm.seconds}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">⏰</span>
                <span className="text-xl font-light">{`${nextAlarm.amPm} ${nextAlarm.hour}:${nextAlarm.minute}`}</span>
              </div>
              {nextAlarm.alarmName && (
                <div className="text-sm text-[var(--text-color-2)] mt-2 italic">{nextAlarm.alarmName}</div>
              )}
              {nextAlarm.repeat && nextAlarm.repeat.length > 0 && (
                <div className="text-xs text-[var(--text-color-2)] mt-1">
                  반복: {nextAlarm.repeat.join(', ')}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="animate-fade-in p-10 flex flex-col items-center">
          <div className="text-base mb-4 font-light text-[var(--text-color-2)] tracking-[2px] uppercase">
            현재시간
          </div>
          <div
            className="text-7xl mb-4 font-light bg-gradient-to-r from-[var(--text-color-1)] to-[var(--bg-color-4)] bg-clip-text text-transparent"
            style={{ fontFeatureSettings: '"tnum"', fontVariantNumeric: 'tabular-nums' }}
          >
            {currentTime.time}
          </div>
          <div className="text-xl mb-12 font-light text-[var(--text-color-2)]">{currentTime.date}</div>

          <button
            onClick={() => {
              setEditingAlarm(null);
              setShowSetModal(true);
            }}
            className="px-9 py-3.5 bg-gradient-to-r from-[var(--bg-color-4)] to-[var(--bg-color-6)] text-white rounded-full font-semibold text-base shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 flex items-center gap-2"
          >
            <span>{alarms.length === 0 ? '⏰' : '➕'}</span>
            <span>{alarms.length === 0 ? '알람설정' : '알람 추가'}</span>
          </button>
        </div>

        {alarms.length > 0 && (
          <div className="w-full max-w-3xl mt-8 px-4">
            <h3 className="text-xl font-semibold mb-4 text-[var(--text-color-1)]">
              알람 목록 ({alarms.length})
            </h3>
            <div className="space-y-3">
              {alarms
                .sort((a, b) => {
                  const [aH, aM] = a.fullTime.split(':').map(Number);
                  const [bH, bM] = b.fullTime.split(':').map(Number);
                  return aH * 60 + aM - (bH * 60 + bM);
                })
                .map((alarm) => (
                  <div
                    key={alarm.id}
                    className={`flex items-center justify-between p-5 bg-[var(--bg-color-2)] rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg hover:translate-x-1 ${
                      !alarm.enabled ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <input
                        type="checkbox"
                        checked={alarm.enabled}
                        onChange={() => toggleAlarm(alarm.id)}
                        className="w-6 h-6 cursor-pointer accent-[var(--bg-color-4)]"
                      />
                      <div className="flex-1">
                        <div className="text-3xl font-semibold text-[var(--text-color-1)]">
                          {alarm.amPm} {alarm.hour}:{alarm.minute}
                        </div>
                        {alarm.alarmName && (
                          <div className="text-sm text-[var(--text-color-2)] mt-1">{alarm.alarmName}</div>
                        )}
                        {alarm.repeat && alarm.repeat.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {alarm.repeat.map((day) => (
                              <span
                                key={day}
                                className="px-2 py-1 text-xs rounded-full bg-[var(--bg-color-4)] text-white"
                              >
                                {day}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editAlarm(alarm)}
                        className="px-4 py-2 bg-[var(--bg-color-4)] text-white rounded-lg hover:bg-[var(--bg-hover-color-1)] transition-colors"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => deleteAlarm(alarm.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {showSetModal && (
        <SetAlarmModal
          onClose={() => {
            setShowSetModal(false);
            setEditingAlarm(null);
          }}
          onSave={saveAlarm}
          editAlarm={editingAlarm}
        />
      )}

      {showConfirmModal && triggeredAlarm && (
        <ConfirmAlarmModal alarm={triggeredAlarm} onConfirm={confirmAlarm} />
      )}
    </div>
  );
}
