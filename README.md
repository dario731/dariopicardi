# dariopicardi.com

The personal website of **Dario Picardi** — *Born in Italy. Shaped by the world. Building from Miami.*

An editorial, cinematic profile of an Italian-born international executive, entrepreneur, investor and founder of BIZ & STYLE. Built with Astro 7, TypeScript, self-hosted variable fonts, content collections (MDX + JSON), a Decap CMS editorial interface, a server-rendered contact endpoint, and a GTM-ready analytics data layer. No UI framework, no animation library, no third-party script unless configured.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # generates brand assets, then builds dist/ (+ Netlify function for /api/contact and /connect)
npm run preview    # serve the production build locally
npm run check      # Astro + TypeScript diagnostics
npm run lint       # copy standards + data integrity
npm test           # unit tests (contact token rules, publication rules)
npm run qa         # post-build audit of dist/ (links, headings, metadata, alt text)
```

Node 22.12+ is required.

## Documentation

| Document | What it covers |
|---|---|
| [docs/CREATIVE-SYSTEM.md](docs/CREATIVE-SYSTEM.md) | Concept, palette, typography, motion, imagery rules, component inventory |
| [docs/CONTENT-MANAGEMENT.md](docs/CONTENT-MANAGEMENT.md) | How the team edits everything without touching code: Perspectives, data, settings, scheduling, languages |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Netlify setup, environment variables, CMS login, forms/CRM, analytics, redirects, security headers |
| [docs/VERIFIED-CONTENT.md](docs/VERIFIED-CONTENT.md) | Every factual claim on the site, its source, and the contradictions flagged for Dario |
| [docs/CHECKLISTS.md](docs/CHECKLISTS.md) | Asset replacement, pre-launch, post-launch analytics, and **Content Required From Dario** |

## Structure

```
src/
  pages/            routes (index, story, global-career, biz-and-style, philosophy, perspectives/*, media/*, connect/*, legal, api/contact)
  components/       layout · editorial · home · career · perspectives · connect · ui
  content/          perspectives/*.mdx (articles) · data/*.json (milestones, places, stats, organizations, principles, framework, media, categories, authors)
  content.config.ts schemas — every data file is validated at build time
  data/site.json    identity, contact, social, downloads (single source of truth) · site.ts typed access + navigation
  i18n/en.ts        every line of page copy (IT prepared: add it.ts and set publishedLocales)
  lib/              seo (JSON-LD) · track (dataLayer bus + attribution) · reveal (motion) · perspectives · consent · format
  styles/           tokens.css (design tokens) · base.css (reset, type, primitives)
  assets/images/    source photographs (optimized by Astro at build)
public/             brand assets (generated), admin/ (Decap CMS), robots, manifest
scripts/            brand.mjs (icons + social card) · world.mjs (map outline) · qa.mjs · lint.mjs · tests/
docs/               documentation
```

## Principles the codebase enforces

- **Nothing unverified is rendered.** Placeholders are labelled as such; `media.json` items publish only with `published: true`; social links appear only when set.
- **Copy lives in one place** (`src/i18n/en.ts`) and data in JSON validated by schemas; the CMS edits the same files.
- **Performance by construction:** static HTML, `<Picture>` with AVIF/WebP, self-hosted fonts with preload, no runtime framework, motion via CSS + one IntersectionObserver, GTM only after consent.
- **Accessibility:** semantic landmarks, one `<h1>` per page, skip link, keyboard-operable menu/tabs/map, visible focus, reduced-motion support, text alternatives for the map and the route line.
