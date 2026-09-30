// Fotos liegen in src/assets/team/ (Dateiname im Feld "photo").
export type Person = {
  name: string;
  role: string;
  photo: string;
  phone?: string;
  email?: string;
  group: 'buero' | 'baustelle';
};

export const team: Person[] = [
  { name: 'Helmuth Kantner', role: 'Geschäftsführer', photo: 'Helmut_Kantner.webp', phone: '+43 664 465 21 10', email: 'office@monsipan.com', group: 'buero' },
  { name: 'Karin Kuch', role: 'Sekretariat', photo: 'Karin_Kuch.webp', phone: '+43 1 706 20 06', email: 'k-kuch@monsipan.com', group: 'buero' },
  { name: 'Kristina Levai', role: 'Sekretariat', photo: 'Kristina_Levai.webp', phone: '+43 1 706 20 06', group: 'buero' },
  { name: 'Thomas Fröschl', role: 'Vorarbeiter', photo: 'Thomas_Froeschl.webp', phone: '+43 664 468 81 51', group: 'baustelle' },
  { name: 'Herbert Singer', role: 'Vorarbeiter', photo: 'Herbert_Singer.webp', phone: '+43 664 474 02 88', group: 'baustelle' },
  { name: 'Andreas Dittrich', role: 'Vorarbeiter', photo: 'Alexander_Dittrich.webp', group: 'baustelle' },
  { name: 'Dominik Haberl', role: 'Vorarbeiter', photo: 'Dominik_Haberl.webp', group: 'baustelle' },
  { name: 'Erich Singer', role: 'Vorarbeiter', photo: 'Erich_Singer.webp', group: 'baustelle' },
  { name: 'Halil Masca', role: 'Vorarbeiter', photo: 'Halil_Masca.webp', group: 'baustelle' },
  { name: 'Mikajel Ugurlu', role: 'Vorarbeiter', photo: 'Mikajel_Ugurlu.webp', group: 'baustelle' },
];

export const tel = (p: string) => 'tel:' + p.replace(/[^\d+]/g, '');
