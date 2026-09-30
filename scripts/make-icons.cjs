// Erzeugt Favicons aus src/assets/logo.svg (Ausschnitt "Si" im Logo)
const fs = require('fs'), sharp = require('sharp');
const src = fs.readFileSync('src/assets/logo.svg', 'utf8');
const inner = src.match(/<path[^>]*fill="#FFEE02"[^>]*\/>/)[0];
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="1470 -40 680 680"><rect x="1470" y="-40" width="680" height="680" rx="120" fill="#2a2d30"/>${inner}</svg>`;
fs.writeFileSync('public/favicon.svg', icon);
(async () => {
  await sharp(Buffer.from(icon)).resize(32, 32).png().toFile('public/favicon-32.png');
  await sharp(Buffer.from(icon)).resize(180, 180).png().toFile('public/apple-touch-icon.png');
  console.log('ok');
})();
