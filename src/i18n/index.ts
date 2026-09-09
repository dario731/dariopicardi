/**
 * Locale helpers. EN is unprefixed; IT (and future languages) are prefixed.
 * Only locales in `publishedLocales` get hreflang alternates and a language
 * selector — the selector is not rendered until a second language is complete.
 */
import { site, defaultLocale, publishedLocales, localeMeta, type Locale } from '@data/site';
import { en } from './en';

export type Copy = typeof en;

const copies: Partial<Record<Locale, Copy>> = { en };

export function getCopy(locale: Locale = defaultLocale): Copy {
  return copies[locale] ?? en;
}

export function localePath(path: string, locale: Locale = defaultLocale): string {
  if (locale === defaultLocale) return path;
  return `/${locale}${path === '/' ? '' : path}`;
}

/** hreflang alternates for a path — only published locales, plus x-default. */
export function alternates(path: string): { hreflang: string; href: string }[] {
  const out = publishedLocales.map((l) => ({ hreflang: localeMeta[l].hreflang, href: `${site.url}${localePath(path, l) === '/' ? '' : localePath(path, l)}` }));
  out.push({ hreflang: 'x-default', href: `${site.url}${path === '/' ? '' : path}` });
  return out;
}

export const published = publishedLocales;
export type { Locale };
