'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSystemStore } from '@/lib/stores/useSystemStore';
import { useEffect } from 'react';

export default function Header() {
  const pathname = usePathname();
  const { darkMode, toggleDarkMode } = useSystemStore();

  useEffect(() => {
    // Initialize dark mode from localStorage
    if (typeof window !== 'undefined') {
      const savedDarkMode = localStorage.getItem('dark') === 'true';
      if (savedDarkMode && !darkMode) {
        toggleDarkMode();
      }
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-color-2)] shadow-md backdrop-blur-md transition-all duration-300">
      <div className="max-w-[1200px] mx-auto px-6 h-[70px] flex items-center justify-between">
        <Link href="/" className="logo-link transition-transform duration-300 hover:scale-105">
          <div className="flex items-center gap-2">
            <span className="text-[28px] animate-pulse-custom">⏰</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#67CDFD] to-[#0088C7] bg-clip-text text-transparent">
              WWCLOCK
            </span>
          </div>
        </Link>

        <nav className="flex gap-3">
          {[
            { href: '/', label: '알람', icon: '⏰' },
            { href: '/timer', label: '타이머', icon: '⏲️' },
            { href: '/stopwatch', label: '스톱워치', icon: '⏱️' },
            { href: '/clock', label: '시계', icon: '🌍' },
          ].map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all duration-300 relative
                ${
                  pathname === href
                    ? 'text-[var(--bg-color-4)] bg-[var(--bg-color-1)] font-bold'
                    : 'text-[var(--text-color-2)] hover:text-[var(--bg-color-4)] hover:bg-[var(--bg-color-1)]'
                }
              `}
            >
              <span className="text-lg transition-transform duration-300 hover:scale-125">
                {icon}
              </span>
              <span className="text-[15px] font-semibold">{label}</span>
              {pathname === href && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/5 h-0.5 bg-gradient-to-r from-[var(--bg-color-4)] to-[var(--bg-color-6)] rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex gap-4 items-center">
          <button
            onClick={toggleDarkMode}
            className="w-10 h-10 flex items-center justify-center bg-[var(--bg-color-1)] rounded-xl transition-all duration-300 hover:bg-[var(--bg-color-4)] hover:rotate-[15deg] hover:scale-110 active:rotate-[15deg] active:scale-95"
            title="다크모드 전환"
            aria-label="Toggle dark mode"
          >
            <span className="text-xl">{darkMode ? '🌙' : '☀️'}</span>
          </button>
          <button
            className="w-10 h-10 flex items-center justify-center bg-[var(--bg-color-1)] rounded-xl transition-all duration-300 hover:bg-[var(--bg-color-4)] hover:rotate-[15deg] hover:scale-110 active:rotate-[15deg] active:scale-95"
            title="설정"
            aria-label="Open settings"
          >
            <span className="text-xl">⚙️</span>
          </button>
        </div>
      </div>
    </header>
  );
}
