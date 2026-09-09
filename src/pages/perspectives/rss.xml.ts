import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getEntry } from 'astro:content';
import { getPublished } from '@lib/perspectives';
import { site } from '@data/site';

export async function GET(context: APIContext) {
  const entries = await getPublished('en');
  const items = await Promise.all(
    entries.map(async (e) => {
      const category = await getEntry(e.data.category);
      return {
        title: e.data.title,
        description: e.data.excerpt,
        pubDate: e.data.publishDate,
        link: `/perspectives/${e.id}`,
        categories: [category?.data.name ?? '', ...e.data.tags].filter(Boolean),
        author: site.name,
      };
    }),
  );
  return rss({
    title: `Perspectives — ${site.name}`,
    description: 'Perspectives on international business, commerce, market entry, investment, leadership, Miami and the life behind the work — by Dario Picardi.',
    site: context.site ?? site.url,
    items,
    customData: `<language>en-us</language><image><url>${site.url}/icon-512.png</url><title>${site.name}</title><link>${site.url}</link></image>`,
    trailingSlash: false,
  });
}
