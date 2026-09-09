/**
 * Typed access to src/data/site.json — the single source of truth for identity,
 * contact and social data. The JSON is editable by the team (Decap CMS →
 * "Site settings"); this module only adds types, derived values and helpers.
 */
import raw from './site.json';

export type Locale = 'en' | 'it';
export const defaultLocale: Locale = 'en';

/** Locales with a complete translation. IT is prepared but not published. */
export const publishedLocales: Locale[] = ['en'];

export const localeMeta: Record<Locale, { label: string; short: string; hreflang: string; og: string }> = {
  en: { label: 'English', short: 'EN', hreflang: 'en', og: 'en_US' },
  it: { label: 'Italiano', short: 'IT', hreflang: 'it', og: 'it_IT' },
};

export const site = {
  ...raw,
  url: (import.meta.env.PUBLIC_SITE_URL as string | undefined) || raw.url,
} as typeof raw;

/** Social profiles that have actually been approved (non-empty). */
export const socialLinks = (): { id: string; label: string; href: string }[] => {
  const labels: Record<string, string> = { linkedin: 'LinkedIn', instagram: 'Instagram', x: 'X', youtube: 'YouTube' };
  return Object.entries(site.social)
    .filter(([, href]) => typeof href === 'string' && href.length > 0)
    .map(([id, href]) => ({ id, label: labels[id] ?? id, href: href as string }));
};

export const sameAs = (): string[] => [site.organization.url, ...socialLinks().map((s) => s.href)];

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'Story', href: '/story' },
  { label: 'Global Career', href: '/global-career' },
  { label: 'BIZ & STYLE', href: '/biz-and-style' },
  { label: 'Perspectives', href: '/perspectives' },
  { label: 'Connect', href: '/connect' },
] as const;

export const footerNav = {
  explore: [
    { label: 'Story', href: '/story' },
    { label: 'Global Career', href: '/global-career' },
    { label: 'BIZ & STYLE', href: '/biz-and-style' },
    { label: 'The Operating Philosophy', href: '/philosophy' },
    { label: 'Perspectives', href: '/perspectives' },
  ],
  more: [
    { label: 'Media & Recognition', href: '/media' },
    { label: 'Biography', href: '/media/biography' },
    { label: 'Connect', href: '/connect' },
  ],
  legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Accessibility', href: '/accessibility' },
  ],
} as const;
