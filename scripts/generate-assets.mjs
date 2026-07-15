// Génère les assets graphiques dérivés :
//   - public/og-image.jpg (1200x630, Open Graph)
//   - public/favicon-32.png, public/apple-touch-icon.png (fallbacks du favicon.svg)
// Usage : node scripts/generate-assets.mjs
import sharp from 'sharp';

const W = 1200;
const H = 630;

const background = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3D1434"/>
      <stop offset="0.5" stop-color="#591d4c"/>
      <stop offset="1" stop-color="#81286b"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <circle cx="1060" cy="70" r="240" fill="#81286b" opacity="0.45"/>
  <circle cx="110" cy="580" r="200" fill="#F8E1F3" opacity="0.06"/>
  <text x="600" y="392" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="46" font-weight="600" fill="#F8E1F3">Gestion de patrimoine</text>
  <text x="600" y="450" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="46" font-weight="600" fill="#F8E1F3">pour les professionnels de santé</text>
  <text x="600" y="540" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="27" fill="#E096D0">patrimed.fr — RDV visio gratuit, 6j/7 jusqu'à 23h</text>
</svg>`;

const logo = await sharp('public/images/logo-patrimed-white.svg', { density: 300 })
  .resize({ width: 560 })
  .png()
  .toBuffer();

await sharp(Buffer.from(background))
  .composite([{ input: logo, left: Math.round((W - 560) / 2), top: 150 }])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile('public/og-image.jpg');

await sharp('public/favicon.svg', { density: 300 }).resize(32, 32).png().toFile('public/favicon-32.png');
await sharp('public/favicon.svg', { density: 300 }).resize(180, 180).png().toFile('public/apple-touch-icon.png');

console.log('OK : og-image.jpg, favicon-32.png, apple-touch-icon.png générés.');
