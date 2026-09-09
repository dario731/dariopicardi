/**
 * Post-build QA over dist/: internal links resolve, every page has exactly one
 * <h1>, a <title>, a meta description, a canonical, JSON-LD, alt on every
 * <img>, no placeholder tokens leaking, and no lorem ipsum.
 * Run: npm run build && npm run qa
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const DIST = resolve('dist');
if (!existsSync(DIST)) { console.error('dist/ not found — run `npm run build` first'); process.exit(1); }

const walk = (dir) => readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const html = walk(DIST).filter((p) => p.endsWith('.html') && !p.includes('admin'));
const routes = new Set(html.map((p) => '/' + relative(DIST, p).replace(/\\/g, '/').replace(/index\.html$/, '').replace(/\.html$/, '')).map((r) => (r === '/' ? '/' : r.replace(/\/$/, ''))));
const files = new Set(walk(DIST).map((p) => '/' + relative(DIST, p).replace(/\\/g, '/')));
const serverRoutes = ['/connect', '/api/contact'];

let problems = 0;
const warn = (file, msg) => { problems++; console.log(`✗ ${relative(DIST, file)} — ${msg}`); };

for (const file of html) {
  const src = readFileSync(file, 'utf8');
  const h1 = (src.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) warn(file, `${h1} <h1> elements`);
  if (!/<title>[^<]{5,}<\/title>/.test(src)) warn(file, 'missing <title>');
  if (!/<meta name="description" content="[^"]{20,}"/.test(src)) warn(file, 'missing meta description');
  if (!/<link rel="canonical"/.test(src)) warn(file, 'missing canonical');
  if (!/application\/ld\+json/.test(src)) warn(file, 'missing JSON-LD');
  const imgs = src.match(/<img\b[^>]*>/g) ?? [];
  for (const img of imgs) if (!/\balt=/.test(img)) warn(file, `img without alt: ${img.slice(0, 80)}`);
  if (/lorem ipsum/i.test(src)) warn(file, 'lorem ipsum found');
  if (/undefined|\[object Object\]|NaN\b/.test(src.replace(/<script[\s\S]*?<\/script>/g, ''))) warn(file, 'undefined/NaN leaked into markup');
  const links = [...src.matchAll(/href="(\/[^"#?]*)(?:[#?][^"]*)?"/g)].map((m) => m[1]);
  for (const l of new Set(links)) {
    const clean = l.replace(/\/$/, '') || '/';
    if (routes.has(clean) || files.has(l) || files.has(clean) || serverRoutes.includes(clean) || clean.startsWith('/_astro/') || clean === '/admin' || clean === '/admin/') continue;
    if (clean.startsWith('/media/') && files.has(clean)) continue;
    warn(file, `internal link not found: ${l}`);
  }
}

console.log(`\n${html.length} pages checked, ${problems} problem(s).`);
process.exit(problems ? 1 : 0);
