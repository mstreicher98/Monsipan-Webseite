// Entfernt nach dem Build Bilddateien in dist/_astro, auf die keine Seite verweist
// (Astro legt die Originale zusätzlich zu den optimierten Varianten ab).
import fs from 'node:fs';
import path from 'node:path';

const dist = 'dist';
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const texts = walk(dist)
  .filter((f) => /\.(html|css|js|xml|json|php)$/.test(f))
  .map((f) => fs.readFileSync(f, 'utf8'))
  .join('\n');

let removed = 0, bytes = 0;
for (const f of fs.readdirSync(path.join(dist, '_astro'))) {
  if (!/\.(webp|avif|jpe?g|png|gif)$/i.test(f)) continue;
  if (texts.includes(f)) continue;
  const p = path.join(dist, '_astro', f);
  bytes += fs.statSync(p).size;
  fs.unlinkSync(p);
  removed++;
}
console.log(`prune-dist: ${removed} ungenutzte Bilder entfernt (${(bytes / 1e6).toFixed(1)} MB)`);
