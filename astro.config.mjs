// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import netlify from '@astrojs/netlify';

/**
 * dariopicardi.com — personal website of Dario Picardi.
 *
 * Static by default. Only /api/contact is server-rendered (prerender = false).
 * Locales: EN (unprefixed, live) · IT (prepared, not built until a complete
 * translation exists — see docs/CONTENT-MANAGEMENT.md §Languages).
 */
const SITE = process.env.PUBLIC_SITE_URL || 'https://dariopicardi.com';

export default defineConfig({
  site: SITE,
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'auto' },
  adapter: netlify({ devFeatures: { environmentVariables: false, images: false, edgeFunctions: false } }),
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'it'],
    routing: { prefixDefaultLocale: false, redirectToDefaultLocale: false },
  },
  integrations: [
    mdx(),
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en-US', it: 'it-IT' } },
      filter: (page) => !page.includes('/api/') && !page.includes('/connect/thank-you') && !page.includes('/admin'),
      serialize(item) {
        if (item.url === `${SITE}/`) item.priority = 1.0;
        else if (/\/(story|global-career|biz-and-style|perspectives|connect)$/.test(item.url)) item.priority = 0.9;
        else if (/\/perspectives\//.test(item.url)) item.priority = 0.7;
        else item.priority = 0.5;
        return item;
      },
    }),
  ],
  image: {
    // Responsive images with sharp; deterministic output for long-lived caching.
    responsiveStyles: true,
    layout: 'constrained',
  },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  vite: { build: { cssMinify: 'lightningcss' } },
});
