'use client';

import { useState, useRef } from 'react';
import { useSystemStore } from '@/lib/stores/useSystemStore';
import { LS } from '@/lib/utils/localStorage';
import { AppSettings } from '@/lib/types';

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const { settings, updateSettings, resetSettings } = useSystemStore();
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [showImportSuccess, setShowImportSuccess] = useState(false);
  const [showImportError, setShowImportError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleColorChange = (key: keyof AppSettings['segmentColors'], value: string) => {
    setLocalSettings({
      ...localSettings,
      segmentColors: {
        ...localSettings.segmentColors,
        [key]: value,
      },
    });
  };

  const handleSave = () => {
    updateSettings(localSettings);
    onClose();
  };

  const handleReset = () => {
    resetSettings();
    setLocalSettings(useSystemStore.getState().settings);
  };

  const handleExport = () => {
    const settingsJson = LS.exportSettings();
    const blob = new Blob([settingsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wwclock-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const success = LS.importSettings(content);

      if (success) {
        setShowImportSuccess(true);
        setTimeout(() => setShowImportSuccess(false), 3000);
        // Reload settings from localStorage
        const savedSettings = LS.get<AppSettings>(LS.appSettings, null);
        if (savedSettings) {
          setLocalSettings(savedSettings);
          updateSettings(savedSettings);
        }
        // Reload page to apply all settings
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setShowImportError(true);
        setTimeout(() => setShowImportError(false), 3000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[var(--modal-bg-color-1)] backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[var(--bg-color-2)] rounded-2xl shadow-2xl w-[95%] sm:w-[90%] max-w-3xl p-4 sm:p-6 animate-fade-in-up max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-color-1)] transition-colors z-10"
        >
          ✕
        </button>

        <h2 className="text-lg sm:text-xl font-bold text-center mb-4 sm:mb-6 text-[var(--text-color-1)]">
          설정
        </h2>

        <div className="space-y-6">
          {/* 세그먼트 색상 설정 */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-[var(--text-color-1)]">
              세그먼트 색상
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Active Color */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-color-1)]">
                  활성 색상
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={localSettings.segmentColors.active}
                    onChange={(e) => handleColorChange('active', e.target.value)}
                    className="w-12 h-10 rounded-lg cursor-pointer border border-[var(--border-color-2)]"
                  />
                  <input
                    type="text"
                    value={localSettings.segmentColors.active}
                    onChange={(e) => handleColorChange('active', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-[var(--border-color-2)] bg-[var(--bg-color-7)] text-[var(--text-color-1)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--bg-color-4)]"
                  />
                </div>
              </div>

              {/* Inactive Color */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-color-1)]">
                  비활성 색상
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={localSettings.segmentColors.inactive}
                    onChange={(e) => handleColorChange('inactive', e.target.value)}
                    className="w-12 h-10 rounded-lg cursor-pointer border border-[var(--border-color-2)]"
                  />
                  <input
                    type="text"
                    value={localSettings.segmentColors.inactive}
                    onChange={(e) => handleColorChange('inactive', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-[var(--border-color-2)] bg-[var(--bg-color-7)] text-[var(--text-color-1)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--bg-color-4)]"
                  />
                </div>
              </div>

              {/* Background Color */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-color-1)]">
                  배경 색상
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={localSettings.segmentColors.background === 'transparent' ? '#000000' : localSettings.segmentColors.background}
                    onChange={(e) => handleColorChange('background', e.target.value)}
                    className="w-12 h-10 rounded-lg cursor-pointer border border-[var(--border-color-2)]"
                  />
                  <input
                    type="text"
                    value={localSettings.segmentColors.background}
                    onChange={(e) => handleColorChange('background', e.target.value)}
                    placeholder="transparent"
                    className="flex-1 px-3 py-2 rounded-lg border border-[var(--border-color-2)] bg-[var(--bg-color-7)] text-[var(--text-color-1)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--bg-color-4)]"
                  />
                </div>
              </div>

              {/* Glow Color */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-color-1)]">
                  글로우 색상
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={localSettings.segmentColors.glow}
                    onChange={(e) => handleColorChange('glow', e.target.value)}
                    className="w-12 h-10 rounded-lg cursor-pointer border border-[var(--border-color-2)]"
                  />
                  <input
                    type="text"
                    value={localSettings.segmentColors.glow}
                    onChange={(e) => handleColorChange('glow', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-[var(--border-color-2)] bg-[var(--bg-color-7)] text-[var(--text-color-1)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--bg-color-4)]"
                  />
                </div>
              </div>
            </div>

            {/* Color Preview */}
            <div className="p-6 rounded-xl border-2 border-[var(--border-color-2)] bg-[var(--bg-color-1)] flex items-center justify-center">
              <div
                className="text-6xl font-bold transition-all duration-300"
                style={{
                  color: localSettings.segmentColors.active,
                  textShadow: `0 0 20px ${localSettings.segmentColors.glow}, 0 0 40px ${localSettings.segmentColors.glow}`,
                  backgroundColor: localSettings.segmentColors.background,
                  padding: '16px 24px',
                  borderRadius: '12px',
                }}
              >
                12:34
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-[var(--text-color-1)]">
              표시 설정
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Font Size */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-color-1)]">
                  폰트 크기
                </label>
                <select
                  value={localSettings.fontSize}
                  onChange={(e) => setLocalSettings({ ...localSettings, fontSize: e.target.value as AppSettings['fontSize'] })}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border-color-2)] bg-[var(--bg-color-7)] text-[var(--text-color-1)] text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--bg-color-4)]"
                >
                  <option value="small">작게</option>
                  <option value="medium">보통</option>
                  <option value="large">크게</option>
                </select>
              </div>

              {/* Display Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-color-1)]">
                  디스플레이 유형
                </label>
                <select
                  value={localSettings.displayType}
                  onChange={(e) => setLocalSettings({ ...localSettings, displayType: e.target.value as AppSettings['displayType'] })}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border-color-2)] bg-[var(--bg-color-7)] text-[var(--text-color-1)] text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--bg-color-4)]"
                >
                  <option value="text">텍스트</option>
                  <option value="digital">디지털</option>
                  <option value="analog">아날로그</option>
                </select>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--bg-color-1)] transition-colors cursor-pointer">
                <span className="text-sm font-medium text-[var(--text-color-1)]">초 표시</span>
                <input
                  type="checkbox"
                  checked={localSettings.showSeconds}
                  onChange={(e) => setLocalSettings({ ...localSettings, showSeconds: e.target.checked })}
                  className="w-5 h-5 rounded cursor-pointer accent-[var(--bg-color-4)]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--bg-color-1)] transition-colors cursor-pointer">
                <span className="text-sm font-medium text-[var(--text-color-1)]">24시간 형식</span>
                <input
                  type="checkbox"
                  checked={localSettings.use24Hour}
                  onChange={(e) => setLocalSettings({ ...localSettings, use24Hour: e.target.checked })}
                  className="w-5 h-5 rounded cursor-pointer accent-[var(--bg-color-4)]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--bg-color-1)] transition-colors cursor-pointer">
                <span className="text-sm font-medium text-[var(--text-color-1)]">애니메이션 활성화</span>
                <input
                  type="checkbox"
                  checked={localSettings.enableAnimations}
                  onChange={(e) => setLocalSettings({ ...localSettings, enableAnimations: e.target.checked })}
                  className="w-5 h-5 rounded cursor-pointer accent-[var(--bg-color-4)]"
                />
              </label>
            </div>
          </div>

          {/* Import/Export */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-[var(--text-color-1)]">
              설정 파일
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleExport}
                className="px-4 py-3 rounded-xl bg-[var(--bg-color-4)] text-white font-medium hover:opacity-90 transition-opacity"
              >
                📤 설정 내보내기
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-3 rounded-xl bg-[var(--bg-color-5)] text-white font-medium hover:opacity-90 transition-opacity"
              >
                📥 설정 가져오기
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </div>

            {showImportSuccess && (
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-sm text-center">
                ✓ 설정을 성공적으로 가져왔습니다!
              </div>
            )}

            {showImportError && (
              <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 text-sm text-center">
                ✗ 설정 가져오기에 실패했습니다.
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[var(--border-color-2)]">
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-[var(--border-color-2)] text-[var(--text-color-1)] font-medium hover:bg-[var(--bg-color-1)] transition-colors"
            >
              초기화
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-3 rounded-xl bg-[var(--bg-color-4)] text-white font-medium hover:opacity-90 transition-opacity"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
