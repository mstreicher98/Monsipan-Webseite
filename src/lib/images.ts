import type { ImageMetadata } from 'astro';

const projekt = import.meta.glob<{ default: ImageMetadata }>('/src/assets/projekte/*/*.{webp,jpg,jpeg,png}', { eager: true });
const teamImgs = import.meta.glob<{ default: ImageMetadata }>('/src/assets/team/*.{webp,jpg,jpeg,png}', { eager: true });

const byName = (a: string, b: string) => a.localeCompare(b, 'de', { numeric: true });

/** Alle Bilder eines Leistungsordners, natürlich sortiert */
export function galleryOf(folder: string): { name: string; img: ImageMetadata }[] {
  return Object.entries(projekt)
    .filter(([path]) => path.includes(`/projekte/${folder}/`))
    .map(([path, mod]) => ({ name: path.split('/').pop()!, img: mod.default }))
    .sort((a, b) => byName(a.name, b.name));
}

export function projektImage(folder: string, file: string): ImageMetadata {
  const hit = projekt[`/src/assets/projekte/${folder}/${file}`];
  if (!hit) throw new Error(`Bild nicht gefunden: ${folder}/${file}`);
  return hit.default;
}

export function teamImage(file: string): ImageMetadata {
  const hit = teamImgs[`/src/assets/team/${file}`];
  if (!hit) throw new Error(`Teamfoto nicht gefunden: ${file}`);
  return hit.default;
}
