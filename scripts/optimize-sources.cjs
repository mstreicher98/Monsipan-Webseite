// Einmalig bzw. nach dem Hinzufügen neuer Fotos: Quellbilder auf max. 2000 px
// verkleinern und als WebP (Qualität 80) speichern. Kleinere Bilder bleiben unverändert.
const fs = require('fs'), path = require('path'), sharp = require('sharp');
const MAX = 2000;
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
(async () => {
  let before = 0, after = 0;
  for (const f of walk('src/assets').filter((f) => /\.(webp|jpe?g|png)$/i.test(f))) {
    const buf = fs.readFileSync(f);
    const meta = await sharp(buf).metadata();
    before += buf.length;
    if (Math.max(meta.width, meta.height) <= MAX && buf.length < 400 * 1024) { after += buf.length; continue; }
    const out = await sharp(buf).rotate().resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
    if (out.length < buf.length) {
      const target = f.replace(/\.(jpe?g|png)$/i, '.webp');
      fs.writeFileSync(target, out);
      if (target !== f) fs.unlinkSync(f);
      after += out.length;
    } else after += buf.length;
  }
  console.log(`vorher ${(before / 1e6).toFixed(1)} MB, nachher ${(after / 1e6).toFixed(1)} MB`);
})();
