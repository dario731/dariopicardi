import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';
import { getPublished } from '@lib/perspectives';

/** Static search index of published perspectives (title, excerpt, category, tags). */
export const GET: APIRoute = async () => {
  const entries = await getPublished('en');
  const index = await Promise.all(
    entries.map(async (e) => ({
      slug: e.id,
      title: e.data.title,
      excerpt: e.data.excerpt,
      category: (await getEntry(e.data.category))?.data.name ?? '',
      tags: e.data.tags,
      date: e.data.publishDate.toISOString().slice(0, 10),
    })),
  );
  return new Response(JSON.stringify(index), { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=300' } });
};
