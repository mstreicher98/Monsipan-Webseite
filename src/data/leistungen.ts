// Leistungsbereiche. Die Bilder liegen in src/assets/projekte/<ordner>/,
// neue Bilder einfach in den passenden Ordner legen – die Galerie liest sie automatisch ein.
export type Leistung = {
  slug: string;
  title: string;
  /** Titel mit weichen Trennstellen für schmale Bildschirme */
  titleHyphen: string;
  short: string;
  lead: string;
  body: string[];
  points: string[];
  folder: string;
  cover: string;
  video?: { src: string; poster: string; label: string };
};

export const leistungen: Leistung[] = [
  {
    slug: 'laengsmarkierung',
    title: 'Längsmarkierung',
    titleHyphen: 'Längs­markierung',
    short: 'Mittel- und Randlinien auf Autobahnen, Schnell-, Bundes- und Landesstraßen.',
    lead: 'Mit Großgeräten tragen wir Mittel- und Randlinien auf Autobahnen, Schnellstraßen, Bundes- und Landesstraßen auf – gleichmäßig, maßhaltig und in hohem Tempo, damit Fahrbahnen rasch wieder freigegeben werden können.',
    body: [
      'Für die maschinelle Verlegung von Sondermarkierungen setzen wir eigene Anbauten an Lkw und Markiermaschine ein. So entstehen auch aufwendigere Markierungen maschinell, sauber und in gleichbleibender Qualität.',
      'Unsere LKW-Züge und Großmaschinen sind für Einsätze im Fließverkehr ausgerüstet und werden von eingespielten Partien bedient.',
    ],
    points: ['Mittel-, Rand- und Leitlinien', 'Sondermarkierungen mit Spezialanbauten', 'Autobahn, Schnellstraße, Bundes- und Landesstraße', 'Einsatz mit Großgeräten und LKW-Zügen'],
    folder: 'laengsmarkierung',
    cover: 'laengs_18.webp',
    video: { src: '/video/laengsmarkierung.mp4', poster: 'laengs_3.webp', label: 'Längsmarkierung im Einsatz' },
  },
  {
    slug: 'flaechenmarkierung',
    title: 'Flächenmarkierung',
    titleHyphen: 'Flächen­markierung',
    short: 'Rote Radfahrerüberfahrten, Kreuzungen, Fahrbahnteiler und farbige Verkehrsflächen.',
    lead: 'Rot eingefärbte Radfahrerüberfahrten, Kreuzungsbereiche und Fahrbahnteiler sind auf den ersten Blick erkennbar – und verhindern so Unfälle.',
    body: [
      'Farbige Flächen für einzelne Verkehrsteilnehmer gewinnen zunehmend an Bedeutung: Großflächige Beschichtungen machen Radwege, Begegnungszonen, Schutzwege und Ladeplätze für E-Fahrzeuge besser sichtbar und erleichtern die Orientierung im Straßenverkehr.',
      'Wir beraten zu Material, Griffigkeit und Farbton und führen die Arbeiten mit kurzen Sperrzeiten aus.',
    ],
    points: ['Radfahrerüberfahrten und Radwege', 'Kreuzungen und Fahrbahnteiler', 'Schutzwege, Piktogramme und Schriften', 'Begegnungszonen und E-Ladeplätze'],
    folder: 'flaechenmarkierung',
    cover: 'flaeche_10.webp',
  },
  {
    slug: 'taktiles-blindenleitsystem',
    title: 'Taktiles Blindenleitsystem',
    titleHyphen: 'Taktiles Blinden­leit­system',
    short: 'Tastbare Leitsysteme für blinde und sehbehinderte Menschen – innen wie außen.',
    lead: 'Für blinde und sehbehinderte Menschen sind taktile Leitsysteme unverzichtbar. Wir verlegen sie auf Asphalt, Beton, Fliesen und Kunststoffböden.',
    body: [
      'Im Außenbereich setzen wir auf Kaltplastik, die dauerhaft auf Asphalt und Beton haftet. Im Innenbereich verlegen wir je nach Untergrund und Gestaltung Kunststoffstreifen, Klebefolien sowie Stahl- oder Messingstreifen.',
      'Leitlinien, Aufmerksamkeitsfelder und Abzweigefelder planen wir gemeinsam mit Ihnen passend zu den örtlichen Gegebenheiten.',
    ],
    points: ['Kaltplastik auf Asphalt und Beton', 'Kunststoffstreifen und Klebefolie', 'Stahl- und Messingstreifen für Innenräume', 'Leitlinien und Aufmerksamkeitsfelder'],
    folder: 'blindenleitsystem',
    cover: 'blindenleitsystem_2.webp',
  },
  {
    slug: 'baustellenmarkierung',
    title: 'Baustellenmarkierung',
    titleHyphen: 'Baustellen­markierung',
    short: 'Temporäre Verkehrsführung in Signalorange – gesprüht oder als Folie verklebt.',
    lead: 'Baustellenmarkierungen in auffälligem Orange sorgen für eine sichere, gut sichtbare Verkehrsführung – ob als gesprühte Farbe oder als temporär verklebte Folie.',
    body: [
      'Wir verfügen über die passende Ausrüstung und hochwertige Materialien, um Umleitungen und Fahrstreifenverschwenkungen rasch herzustellen und nach Bauende wieder rückstandsarm zu entfernen.',
    ],
    points: ['Temporäre Markierung in Signalorange', 'Gesprühte Farbe oder temporäre Folie', 'Folienverlegegeräte für schnelle Umstellungen', 'Rückbau nach Bauende'],
    folder: 'baustellenmarkierung',
    cover: 'baustelle_2.webp',
  },
  {
    slug: 'demarkierung',
    title: 'Demarkierung & Kugelstrahlen',
    titleHyphen: 'Demarkierung & Kugel­strahlen',
    short: 'Ungültige Markierungen belagsschonend entfernen, Untergründe vorbereiten.',
    lead: 'Nicht lagerichtige oder ungültig gewordene Markierungen entfernen wir mechanisch – mit handgeführter Fräse oder Schleifmaschine.',
    body: [
      'Damit der Belag möglichst unversehrt bleibt, wählen wir die Abtragtechnik passend zu Material und Untergrund. Unser Maschinenpark umfasst acht Fräsen unterschiedlicher Größe.',
      'Im Innenbereich bereiten wir Untergründe für vollflächige Beschichtungen durch Schleifen oder Kugelstrahlen mit Absaugung vor – staubarm und mit sauberem Ergebnis.',
    ],
    points: ['Fräsen und Schleifen', 'Belagsschonende Abtragung', 'Kugelstrahlen mit Absaugung', 'Untergrundvorbereitung für Beschichtungen'],
    folder: 'demarkierung',
    cover: 'demarkierung_4.webp',
  },
  {
    slug: 'sonderprojekte',
    title: 'Sonder- & Künstlerprojekte',
    titleHyphen: 'Sonder- & Künstler­projekte',
    short: 'Spielfelder, Piktogramme, Schriftzüge und künstlerisch gestaltete Böden.',
    lead: 'Auf Wunsch setzen wir künstlerisch oder architektonisch gestaltete Markierungen um – vom Schulhof-Spielfeld bis zum Bodenkunstwerk.',
    body: [
      'Wir beraten Sie zu Farbgestaltung, Materialien und technischen Möglichkeiten und bringen dabei unsere langjährige Erfahrung ein. Ob Hüpfspiel, Verkehrsgarten, Firmenschriftzug oder großflächiges Muster: Wir übertragen Entwürfe maßstabsgetreu auf den Boden.',
    ],
    points: ['Spielfelder und Verkehrsgärten', 'Logos, Schriftzüge und Piktogramme', 'Künstlerische Bodengestaltung', 'Beratung zu Farbe und Material'],
    folder: 'sonderprojekte',
    cover: 'sonder_36.webp',
  },
  {
    slug: 'beschichtungen',
    title: 'Beschichtungen',
    titleHyphen: 'Beschich­tungen',
    short: 'Langlebige Schutzbeschichtungen für Garagen, Hallen, Werkstätten und Wege.',
    lead: 'Präzise und langlebige Beschichtungen schützen Oberflächen wirksam und verlängern ihre Lebensdauer – in der Industrie, in der Architektur und überall dort, wo besondere Anforderungen gelten.',
    body: [
      'Unsere Beschichtungssysteme schützen vor Abnutzung, Witterung und chemischer Belastung. Wir stimmen sie auf den jeweiligen Untergrund ab – Beton, Metall, Holz oder Kunststoff – und sorgen für optimale Haftung, Widerstandsfähigkeit und ein sauberes Erscheinungsbild.',
      'Von der funktionalen Schutzbeschichtung bis zur dekorativen Speziallösung erhalten Sie alles aus einer Hand, inklusive Untergrundvorbereitung und Markierung.',
    ],
    points: ['Garagen, Hallen und Werkstätten', 'Rad- und Gehwege', 'Schutz vor Abrieb, Witterung und Chemikalien', 'Beton, Metall, Holz und Kunststoff'],
    folder: 'beschichtungen',
    cover: 'beschichtung_5.webp',
  },
];
