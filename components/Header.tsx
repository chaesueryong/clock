'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSystemStore } from '@/lib/stores/useSystemStore';
import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import SettingsModal from './modals/SettingsModal';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const { darkMode, toggleDarkMode } = useSystemStore();
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Initialize dark mode from localStorage
    if (typeof window !== 'undefined') {
      const savedDarkMode = localStorage.getItem('dark') === 'true';
      if (savedDarkMode && !darkMode) {
        toggleDarkMode();
      }
    }
  }, []);

  const switchLocale = () => {
    const newLocale = locale === 'ko' ? 'en' : 'ko';
    // Remove current locale from pathname
    const pathnameWithoutLocale = pathname.replace(/^\/(ko|en)/, '') || '/';
    // Redirect to new locale
    const newPath = newLocale === 'ko' ? pathnameWithoutLocale : `/${newLocale}${pathnameWithoutLocale}`;
    router.push(newPath);
  };

  // Get pathname without locale for comparison
  const pathnameWithoutLocale = pathname.replace(/^\/(ko|en)/, '') || '/';

  const navItems = [
    { href: '/', label: t('alarm.title'), icon: '⏰' },
    { href: '/timer', label: t('timer.title'), icon: '⏲️' },
    { href: '/stopwatch', label: t('stopwatch.title'), icon: '⏱️' },
    { href: '/clock', label: t('worldClock.title'), icon: '🌍' },
  ];

  return (
    <header className="sticky top-0 z-50 glass backdrop-blur-xl shadow-md transition-all duration-300 border-b border-[var(--border-color-1)]">
      <div className="max-w-[1200px] mx-auto px-3 sm:px-6 h-[60px] sm:h-[70px] flex items-center justify-between gap-2 sm:gap-4">
        <Link href="/" className="logo-link transition-transform duration-300 hover:scale-105">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-[20px] sm:text-[28px] animate-pulse-custom">⏰</span>
            <span className="text-base sm:text-2xl font-bold bg-gradient-to-r from-[#67CDFD] to-[#0088C7] bg-clip-text text-transparent">
              WWCLOCK
            </span>
          </div>
        </Link>

        <nav className="flex gap-1 sm:gap-3">
          {navItems.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-300 relative
                ${
                  pathnameWithoutLocale === href
                    ? 'text-[var(--bg-color-4)] bg-[var(--bg-color-1)] font-bold'
                    : 'text-[var(--text-color-2)] hover:text-[var(--bg-color-4)] hover:bg-[var(--bg-color-1)]'
                }
              `}
            >
              <span className="text-base sm:text-lg transition-transform duration-300 hover:scale-125">
                {icon}
              </span>
              <span className="hidden md:inline text-[15px] font-semibold">{label}</span>
              {pathnameWithoutLocale === href && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/5 h-0.5 bg-gradient-to-r from-[var(--bg-color-4)] to-[var(--bg-color-6)] rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex gap-2 sm:gap-3 items-center">
          <button
            onClick={switchLocale}
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-[var(--bg-color-1)] rounded-lg sm:rounded-xl transition-all duration-300 hover:bg-[var(--bg-color-4)] hover:scale-110 active:scale-95 font-semibold text-xs sm:text-sm"
            title="Switch language"
            aria-label="Switch language"
          >
            {locale === 'ko' ? 'EN' : 'KO'}
          </button>
          <button
            onClick={toggleDarkMode}
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-[var(--bg-color-1)] rounded-lg sm:rounded-xl transition-all duration-300 hover:bg-[var(--bg-color-4)] hover:rotate-[15deg] hover:scale-110 active:rotate-[15deg] active:scale-95"
            title={locale === 'ko' ? '다크모드 전환' : 'Toggle dark mode'}
            aria-label="Toggle dark mode"
          >
            <span className="text-base sm:text-xl">{darkMode ? '🌙' : '☀️'}</span>
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="hidden sm:flex w-10 h-10 items-center justify-center bg-[var(--bg-color-1)] rounded-xl transition-all duration-300 hover:bg-[var(--bg-color-4)] hover:rotate-[15deg] hover:scale-110 active:rotate-[15deg] active:scale-95"
            title={locale === 'ko' ? '설정' : 'Settings'}
            aria-label="Open settings"
          >
            <span className="text-xl">⚙️</span>
          </button>
        </div>
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </header>
  );
}
