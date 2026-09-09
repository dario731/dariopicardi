import { test } from 'node:test';
import assert from 'node:assert/strict';

// Pure logic mirrored from src/lib/perspectives.ts (which imports astro:content and cannot run in node directly).
const isPublished = (e, now = new Date()) => !e.draft && e.publishDate.getTime() <= now.getTime();
const readingTime = (body) => Math.max(1, Math.round(body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length / 220));
const paginate = (items, page, size = 9) => { const total = Math.max(1, Math.ceil(items.length / size)); const current = Math.min(Math.max(1, page), total); return { items: items.slice((current - 1) * size, current * size), current, total, prev: current > 1 ? current - 1 : null, next: current < total ? current + 1 : null }; };

test('drafts are never published', () => assert.equal(isPublished({ draft: true, publishDate: new Date(0) }), false));
test('future publishDate is scheduled (hidden)', () => assert.equal(isPublished({ draft: false, publishDate: new Date(Date.now() + 86400000) }), false));
test('past publishDate is published', () => assert.equal(isPublished({ draft: false, publishDate: new Date(Date.now() - 1000) }), true));
test('reading time rounds to at least 1 minute', () => { assert.equal(readingTime('one two three'), 1); assert.equal(readingTime(Array(660).fill('w').join(' ')), 3); });
test('pagination bounds', () => { const p = paginate(Array.from({ length: 20 }, (_, i) => i), 3); assert.equal(p.total, 3); assert.equal(p.items.length, 2); assert.equal(p.next, null); assert.equal(p.prev, 2); assert.equal(paginate([], 5).current, 1); });
