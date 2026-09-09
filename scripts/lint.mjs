/**
 * Lightweight lint without extra dependencies:
 *  - copy standards: banned phrases from the brief must not appear in copy/data
 *  - data integrity: milestone place IDs exist, categories referenced by drafts exist,
 *    stats/media/organizations have unique IDs
 *  - `astro check` handles TypeScript.
 * Run: npm run lint
 */
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

let problems = 0;
const fail = (msg) => { problems++; console.log(`✗ ${msg}`); };

const banned = ['visionary leader', 'serial entrepreneur', 'disruptor', 'game changer', 'game-changer', 'global citizen', 'passionate professional', 'unparalleled', 'world-renowned', 'dynamic entrepreneur', 'thought leader', 'synerg'];
const copyFiles = ['src/i18n/en.ts', ...readdirSync('src/content/data').map((f) => join('src/content/data', f))];
for (const f of copyFiles) {
  const text = readFileSync(resolve(f), 'utf8').toLowerCase();
  for (const b of banned) if (text.includes(b)) fail(`${f}: banned phrase “${b}”`);
}

const read = (f) => JSON.parse(readFileSync(resolve('src/content/data', f), 'utf8')).items;
const places = new Set(read('places.json').map((p) => p.id));
for (const m of read('milestones.json')) for (const p of m.places ?? []) if (!places.has(p)) fail(`milestone ${m.id}: unknown place “${p}”`);
const cats = new Set(read('categories.json').map((c) => c.id));
for (const f of readdirSync('src/content/perspectives')) {
  const src = readFileSync(join('src/content/perspectives', f), 'utf8');
  const m = src.match(/^category:\s*(\S+)/m);
  if (!m) fail(`${f}: missing category`);
  else if (!cats.has(m[1])) fail(`${f}: unknown category “${m[1]}”`);
}
for (const f of ['stats.json', 'media.json', 'organizations.json', 'principles.json', 'framework.json', 'milestones.json', 'places.json']) {
  const ids = read(f).map((x) => x.id);
  const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dup.length) fail(`${f}: duplicate ids ${dup.join(', ')}`);
}
// Media: only verified items are published
for (const m of read('media.json')) if (m.published && /placeholder/i.test(m.title)) fail(`media ${m.id}: placeholder marked as published`);

console.log(problems ? `\n${problems} problem(s).` : '✓ lint clean');
process.exit(problems ? 1 : 0);
