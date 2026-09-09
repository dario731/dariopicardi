/**
 * Perspectives helpers: publication rules, reading time, sorting, related.
 *
 * Publication rule: an entry is public when `draft` is false AND `publishDate`
 * is not in the future at build time. Scheduled publication therefore needs a
 * build after the date — see docs/CONTENT-MANAGEMENT.md §Scheduling (a daily
 * Netlify build hook is the recommended way).
 */
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Perspective = CollectionEntry<'perspectives'>;

export const PAGE_SIZE = 9;

export function isPublished(entry: Perspective, now = new Date()): boolean {
  if (entry.data.draft) return false;
  return entry.data.publishDate.getTime() <= now.getTime();
}

export async function getPublished(locale: 'en' | 'it' = 'en'): Promise<Perspective[]> {
  const all = await getCollection('perspectives', (e) => e.data.locale === locale && isPublished(e));
  return all.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
}

export async function getDrafts(locale: 'en' | 'it' = 'en'): Promise<Perspective[]> {
  return getCollection('perspectives', (e) => e.data.locale === locale && !isPublished(e));
}

export function readingTime(body: string | undefined): number {
  if (!body) return 1;
  const text = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_>`~\-]/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function wordCount(body: string | undefined): number {
  if (!body) return 0;
  return body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
}

export async function withMeta(entries: Perspective[]) {
  return Promise.all(
    entries.map(async (entry) => {
      const category = await getEntry(entry.data.category);
      const author = await getEntry(entry.data.author);
      return {
        entry,
        slug: entry.id,
        path: `/perspectives/${entry.id}`,
        categoryName: category?.data.name ?? '',
        categoryId: category?.id ?? '',
        authorName: author?.data.name ?? '',
        readingTime: readingTime(entry.body),
      };
    }),
  );
}

/** Related: explicit `related` first, then same category, then most recent. */
export async function related(entry: Perspective, pool: Perspective[], limit = 3): Promise<Perspective[]> {
  const explicit = entry.data.related.map((r) => r.id);
  const out: Perspective[] = [];
  for (const id of explicit) {
    const e = pool.find((p) => p.id === id);
    if (e) out.push(e);
  }
  for (const p of pool) {
    if (out.length >= limit) break;
    if (p.id === entry.id || out.includes(p)) continue;
    if (p.data.category.id === entry.data.category.id) out.push(p);
  }
  for (const p of pool) {
    if (out.length >= limit) break;
    if (p.id === entry.id || out.includes(p)) continue;
    out.push(p);
  }
  return out.slice(0, limit);
}

export function paginate<T>(items: T[], page: number, size = PAGE_SIZE) {
  const total = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(Math.max(1, page), total);
  return {
    items: items.slice((current - 1) * size, current * size),
    current,
    total,
    prev: current > 1 ? current - 1 : null,
    next: current < total ? current + 1 : null,
  };
}
