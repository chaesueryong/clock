'use client';

import { useEffect } from 'react';
import { useSystemStore, defaultSettings } from '@/lib/stores/useSystemStore';
import { LS } from '@/lib/utils/localStorage';
import { AppSettings } from '@/lib/types';

export default function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { settings, updateSettings } = useSystemStore();

  useEffect(() => {
    // Load settings from localStorage on mount
    if (typeof window !== 'undefined') {
      const savedSettings = LS.get<AppSettings>(LS.appSettings, null);
      if (savedSettings) {
        updateSettings(savedSettings);
      }
    }
  }, []);

  useEffect(() => {
    // Apply segment colors to CSS variables
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--segment-color-active', settings.segmentColors.active);
      root.style.setProperty('--segment-color-inactive', settings.segmentColors.inactive);
      root.style.setProperty('--segment-color-background', settings.segmentColors.background);
      root.style.setProperty('--segment-color-glow', settings.segmentColors.glow);
    }
  }, [settings]);

  return <>{children}</>;
}
