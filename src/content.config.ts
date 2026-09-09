import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Content model. Everything the team edits lives here or in src/data/site.json.
 * Perspectives are MDX files: src/content/perspectives/<slug>.mdx
 * Structured data are JSON arrays in src/content/data/*.json (validated at build).
 * Decap CMS (public/admin/config.yml) edits the same files — no code changes needed.
 */
const locale = z.enum(['en', 'it']).default('en');

const seo = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonical: z.url().optional(),
    noindex: z.boolean().default(false),
  })
  .default({ noindex: false });

const perspectives = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/perspectives' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(120),
      excerpt: z.string().max(260),
      locale,
      author: reference('authors').default({ collection: 'authors', id: 'dario-picardi' }),
      category: reference('categories'),
      tags: z.array(z.string()).default([]),
      publishDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      /** Draft: never built. Scheduled: publishDate in the future → hidden until the next build after that date. */
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
      hero: z
        .object({
          image: image().optional(),
          alt: z.string().default(''),
          credit: z.string().optional(),
        })
        .optional(),
      related: z.array(reference('perspectives')).default([]),
      seo,
    }),
});

const categories = defineCollection({
  loader: file('./src/content/data/categories.json', { parser: (t) => JSON.parse(t).items }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    order: z.number().default(99),
  }),
});

const authors = defineCollection({
  loader: file('./src/content/data/authors.json', { parser: (t) => JSON.parse(t).items }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    image: z.string().optional(),
    sameAs: z.array(z.url()).default([]),
  }),
});

/** Proof-of-experience figures. Only verified figures belong here. */
const stats = defineCollection({
  loader: file('./src/content/data/stats.json', { parser: (t) => JSON.parse(t).items }),
  schema: z.object({
    id: z.string(),
    value: z.string(),
    label: z.string(),
    source: z.string(),
    order: z.number().default(99),
    home: z.boolean().default(true),
  }),
});

/** Career milestones — the editorial timeline on /global-career. */
const milestones = defineCollection({
  loader: file('./src/content/data/milestones.json', { parser: (t) => JSON.parse(t).items }),
  schema: z.object({
    id: z.string(),
    phase: z.enum(['learning', 'leading', 'building']),
    order: z.number(),
    years: z.string(),
    startYear: z.number().optional(),
    title: z.string(),
    organization: z.string().optional(),
    kind: z.enum(['education', 'role', 'venture', 'moment']).default('role'),
    location: z.string().optional(),
    places: z.array(z.string()).default([]),
    summary: z.string(),
    details: z.array(z.string()).default([]),
    status: z.enum(['verified', 'placeholder']).default('verified'),
    source: z.string().optional(),
  }),
});

/** Verified cities, regions and markets for the global map. */
const places = defineCollection({
  loader: file('./src/content/data/places.json', { parser: (t) => JSON.parse(t).items }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    country: z.string(),
    lat: z.number(),
    lng: z.number(),
    role: z.enum(['roots', 'education', 'hub', 'affiliate', 'base']),
    note: z.string(),
    labelSide: z.enum(['left', 'right', 'top', 'bottom']).default('right'),
    source: z.string().optional(),
  }),
});

/** Companies, brands, markets, partnerships — with accurate categories. */
const organizations = defineCollection({
  loader: file('./src/content/data/organizations.json', { parser: (t) => JSON.parse(t).items }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    category: z.enum(['executive', 'brand', 'market', 'partnership', 'ecosystem', 'education']),
    note: z.string(),
    order: z.number().default(99),
    source: z.string().optional(),
  }),
});

/** The Operating Philosophy. */
const principles = defineCollection({
  loader: file('./src/content/data/principles.json', { parser: (t) => JSON.parse(t).items }),
  schema: z.object({
    id: z.string(),
    order: z.number(),
    title: z.string(),
    line: z.string(),
    body: z.array(z.string()),
  }),
});

/** Signature leadership framework — six words. */
const framework = defineCollection({
  loader: file('./src/content/data/framework.json', { parser: (t) => JSON.parse(t).items }),
  schema: z.object({
    id: z.string(),
    order: z.number(),
    word: z.string(),
    line: z.string(),
    body: z.string(),
  }),
});

/** Media, speaking, events, press, recognition. Only verified items are published. */
const media = defineCollection({
  loader: file('./src/content/data/media.json', { parser: (t) => JSON.parse(t).items }),
  schema: z.object({
    id: z.string(),
    type: z.enum(['interview', 'speaking', 'event', 'commentary', 'role', 'recognition', 'video', 'press']),
    title: z.string(),
    outlet: z.string().optional(),
    date: z.coerce.date().optional(),
    dateLabel: z.string().optional(),
    location: z.string().optional(),
    url: z.url().optional(),
    videoUrl: z.url().optional(),
    summary: z.string().optional(),
    published: z.boolean().default(false),
    source: z.string().optional(),
  }),
});

export const collections = { perspectives, categories, authors, stats, milestones, places, organizations, principles, framework, media };
