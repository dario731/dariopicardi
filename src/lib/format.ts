export function formatDate(d: Date, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(d);
}

export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Split a title on "|" into lines for balanced display headings. */
export function lines(s: string): string[] {
  return s.split('|').map((l) => l.trim());
}
