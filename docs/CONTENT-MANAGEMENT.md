# Content management

The team can change everything below **without editing source code**, either through the editorial interface at `/admin` (Decap CMS, after the one-time setup in DEPLOYMENT.md) or by editing the files directly in GitHub. Every save is a commit; every commit to `main` triggers a build on Netlify.

## What lives where

| Content | File | CMS section |
|---|---|---|
| Perspectives (articles) | `src/content/perspectives/<slug>.mdx` | Perspectives |
| Identity, contact, social links, downloads | `src/data/site.json` | Site settings → Identity, contact & social |
| Statistics (proof of experience) | `src/content/data/stats.json` | Site settings → Statistics |
| Career milestones (timeline) | `src/content/data/milestones.json` | Site settings → Career milestones |
| Global map places | `src/content/data/places.json` | Site settings → Global map places |
| Companies, brands, markets, partnerships | `src/content/data/organizations.json` | Site settings → Companies, brands, markets |
| Media, speaking, events, recognition | `src/content/data/media.json` | Site settings → Media, speaking & recognition |
| The Operating Philosophy | `src/content/data/principles.json` | Site settings → Operating Philosophy |
| Six-word framework | `src/content/data/framework.json` | Site settings → Six-word framework |
| Perspective categories | `src/content/data/categories.json` | Site settings → Perspective categories |
| Author profile | `src/content/data/authors.json` | Site settings → Authors |
| Page copy (headlines, paragraphs, labels) | `src/i18n/en.ts` | — (developer; every line is one place) |
| Photographs | `src/assets/images/` (optimized at build) and `public/media/` (served as-is) | Media library |

Every data file is validated against a schema (`src/content.config.ts`) when the site builds. A typo in a field name or an invalid value fails the build with a clear message instead of publishing broken content.

## Publishing a Perspective

1. In `/admin`, open **Perspectives → New Perspective** (or duplicate one of the draft frames already there — eleven themes are prepared as drafts).
2. Fill in title, excerpt (max 260 characters), category, tags, and the body in Markdown. Add a hero image (landscape, at least 2400px wide) with alt text.
3. **Draft** is on by default. Drafts are never built.
4. Set the **Publish date**. A date in the future *schedules* the piece: it stays hidden until a build runs on or after that date. Set up the daily build hook described in DEPLOYMENT.md so scheduled pieces appear automatically at the next morning build.
5. Turn Draft off and click **Publish** (with the editorial workflow enabled, the piece moves Draft → In review → Ready → Publish; each stage is a branch that can be previewed).

What happens automatically: reading time, publication date display, share buttons, related perspectives (explicit `related` slugs first, then same category), category page, pagination (9 per page), search index, RSS feed, sitemap entry, Article + BreadcrumbList structured data, Open Graph card (the hero image cropped to 1200×630, or the default card).

Rules: only pieces Dario has written or approved are published under his name. Categories are the fourteen in `categories.json`; add a new one there and it appears in the filter and the CMS dropdown after the next build (also add it to the `options` list in `public/admin/config.yml`).

## Editing facts

- **A number changes** (e.g. countries): edit `stats.json`. The homepage, Global Career page and biography update together.
- **A milestone is confirmed** (school name, degree dates): edit `milestones.json`, replace the `years` label, set `status` to `verified`. The “Dates to be confirmed” flag disappears.
- **A new market or city**: add to `places.json` with latitude/longitude and a role; it appears on the map, in the map list, and can be referenced by milestones.
- **A media appearance is verified**: add to `media.json` with `published: true`. Items with `published: false` are never rendered.
- **A social profile is approved**: paste the URL in `site.json → social`. Footer links and structured data (`sameAs`) pick it up.
- **The biography PDF is ready**: place it in `public/downloads/` and set `site.json → downloads.biographyPdf` to `/downloads/<file>.pdf`. The Media page switches from “pending” to a download link automatically.

## Photographs

Replace the temporary portrait by dropping the approved editorial portrait at `src/assets/images/portrait-dario-bw-tmp.jpg` (keep the filename, or update the imports in `Hero.astro`, `story.astro`, `media/biography.astro` and `scripts/brand.mjs`). Story chapters without a photograph render a labelled placeholder; give each chapter an image by adding it to the `images` map at the top of `src/pages/story.astro`. See CHECKLISTS.md → Asset replacement for the full manifest.

## Languages

The architecture is ready for Italian: `astro.config.mjs` declares `it`, routes would live under `/it/…`, and every copy string is keyed in `src/i18n/en.ts`. To launch Italian: create `src/i18n/it.ts` with the same shape, add `it` to `publishedLocales` in `src/data/site.ts`, and add the `/it` pages (copies of the English pages calling `getCopy('it')`). `hreflang` alternates and a language selector appear only when a second locale is published — nothing partially translated is ever shown.

## Editorial workflow summary

Write → Save (draft) → Preview → Review → Publish → Build (≈1 minute) → Live. Every step is a Git commit, so history and rollback are always available.
