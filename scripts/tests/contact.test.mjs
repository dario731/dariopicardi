import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';

// Mirrors the token rules in src/pages/api/contact.ts
const secret = 'test-secret';
const sign = (issued) => `${issued}.${createHmac('sha256', secret).update(String(issued)).digest('hex').slice(0, 32)}`;
const verify = (token, minSeconds = 4, maxAgeMs = 6 * 60 * 60 * 1000) => {
  const [issued, sig] = token.split('.');
  if (!issued || !sig) return false;
  const expected = createHmac('sha256', secret).update(issued).digest('hex').slice(0, 32);
  if (sig !== expected) return false;
  const age = Date.now() - Number(issued);
  return age >= minSeconds * 1000 && age <= maxAgeMs;
};

test('token signed 10s ago verifies', () => assert.equal(verify(sign(Date.now() - 10_000)), true));
test('token signed just now is rejected (too fast)', () => assert.equal(verify(sign(Date.now())), false));
test('token older than 6h is rejected', () => assert.equal(verify(sign(Date.now() - 7 * 3600 * 1000)), false));
test('tampered token is rejected', () => assert.equal(verify(sign(Date.now() - 10_000).replace(/.$/, 'x')), false));

const clean = (v, max = 500) => String(v ?? '').replace(/<[^>]*>/g, '').trim().slice(0, max);
test('sanitizer strips tags and trims', () => assert.equal(clean('  <b>Hi</b> <script>x</script> '), 'Hi x'));
test('sanitizer caps length', () => assert.equal(clean('a'.repeat(600), 500).length, 500));
