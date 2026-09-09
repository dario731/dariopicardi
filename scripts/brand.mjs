/**
 * Generates the small brand assets that cannot be live text:
 *   public/favicon.svg, favicon.ico (PNG-in-ICO), apple-touch-icon.png,
 *   icon-192.png, icon-512.png, site.webmanifest, og-default.jpg,
 *   media/dario-picardi-portrait.jpg, media/dario-picardi-author.jpg
 * Run: node scripts/brand.mjs   (also runs before `astro build` via prebuild)
 */
import sharp from 'sharp';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const PUB = resolve('public');
mkdirSync(resolve(PUB, 'media'), { recursive: true });

const NOTTE = '#0c0b0a';
const AVORIO = '#f4eee3';
const BRONZO = '#c4a575';

// Monogram: a serif "D" with a bronze point — drawn as paths so no font is required.
const mono = (size) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
  <rect width="64" height="64" rx="8" fill="${NOTTE}"/>
  <path d="M19 15h13c11.6 0 19 6.6 19 17s-7.4 17-19 17H19V15zm7 5.6v22.8h5.6c7.6 0 12.2-4.3 12.2-11.4S39.2 20.6 31.6 20.6H26z" fill="${AVORIO}"/>
  <circle cx="50" cy="49" r="3.2" fill="${BRONZO}"/>
</svg>`;

writeFileSync(resolve(PUB, 'favicon.svg'), mono(64));
const png = async (size) => sharp(Buffer.from(mono(size))).png().toBuffer();
writeFileSync(resolve(PUB, 'apple-touch-icon.png'), await png(180));
writeFileSync(resolve(PUB, 'icon-192.png'), await png(192));
writeFileSync(resolve(PUB, 'icon-512.png'), await png(512));

// favicon.ico — an ICO container holding one 32×32 PNG entry.
const p32 = await png(32);
const ico = Buffer.alloc(6 + 16 + p32.length);
ico.writeUInt16LE(0, 0); ico.writeUInt16LE(1, 2); ico.writeUInt16LE(1, 4);
ico.writeUInt8(32, 6); ico.writeUInt8(32, 7); ico.writeUInt8(0, 8); ico.writeUInt8(0, 9);
ico.writeUInt16LE(1, 10); ico.writeUInt16LE(32, 12); ico.writeUInt32LE(p32.length, 14); ico.writeUInt32LE(22, 18);
p32.copy(ico, 22);
writeFileSync(resolve(PUB, 'favicon.ico'), ico);

writeFileSync(
  resolve(PUB, 'site.webmanifest'),
  JSON.stringify({ name: 'Dario Picardi', short_name: 'Dario Picardi', icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }], theme_color: NOTTE, background_color: NOTTE, display: 'browser' }, null, 2),
);

// Portrait copies for schema.org / authors (public URLs).
const portrait = resolve('src/assets/images/portrait-dario-bw-tmp.jpg');
if (existsSync(portrait)) {
  await sharp(portrait).resize(800, 1000, { fit: 'cover' }).jpeg({ quality: 82, mozjpeg: true }).toFile(resolve(PUB, 'media/dario-picardi-portrait.jpg'));
  await sharp(portrait).resize(320, 320, { fit: 'cover', position: 'top' }).jpeg({ quality: 82, mozjpeg: true }).toFile(resolve(PUB, 'media/dario-picardi-author.jpg'));
}

// Default social image 1200×630: portrait on the right, typographic line on the left.
// Text is drawn as SVG; if the renderer lacks the serif, it falls back to a generic serif — acceptable for a default card.
const W = 1200, H = 630;
const right = existsSync(portrait) ? await sharp(portrait).resize(504, 630, { fit: 'cover', position: 'top' }).grayscale().toBuffer() : null;
const text = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${NOTTE}"/>
  <rect x="0" y="0" width="696" height="${H}" fill="${NOTTE}"/>
  <line x1="72" y1="118" x2="120" y2="118" stroke="${BRONZO}" stroke-width="2"/>
  <text x="132" y="124" font-family="Inter, Helvetica, Arial, sans-serif" font-size="17" letter-spacing="4" fill="${BRONZO}">DARIO PICARDI</text>
  <g font-family="Newsreader, 'Iowan Old Style', Georgia, 'Times New Roman', serif" font-size="58" fill="${AVORIO}">
    <text x="72" y="270">Born in Italy.</text>
    <text x="72" y="342">Shaped by the world.</text>
    <text x="72" y="414">Building from Miami.</text>
  </g>
  <text x="72" y="500" font-family="Inter, Helvetica, Arial, sans-serif" font-size="18" fill="#8b8378">International executive · Entrepreneur · Investor</text>
  <text x="72" y="530" font-family="Inter, Helvetica, Arial, sans-serif" font-size="18" fill="#8b8378">Founder &amp; President, BIZ &amp; STYLE</text>
  <text x="72" y="584" font-family="Inter, Helvetica, Arial, sans-serif" font-size="15" letter-spacing="3" fill="${BRONZO}">DARIOPICARDI.COM</text>
</svg>`;
let og = sharp(Buffer.from(text));
if (right) og = og.composite([{ input: right, left: 696, top: 0 }]);
await og.jpeg({ quality: 86, mozjpeg: true }).toFile(resolve(PUB, 'og-default.jpg'));
console.log('brand assets written');
