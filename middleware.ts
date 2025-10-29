import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Don't use locale prefix for default locale (ko)
  localePrefix: 'as-needed',

  // Automatically detect locale from browser Accept-Language header
  localeDetection: true,
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ko|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)'],
};
