# Monsipan Bautenschutz – Webseite

Statische Firmenwebseite für die Monsipan Bautenschutz GesmbH (monsipan.at), gebaut mit [Astro](https://astro.build).
Das Ergebnis ist reines HTML/CSS mit wenig JavaScript. Nur das Kontaktformular braucht PHP.

## Schnellstart

```bash
npm install
npm run dev       # Entwicklung auf http://localhost:4321
npm run build     # fertige Seite in ./dist
npm run preview   # gebaute Seite lokal ansehen
```

Benötigt Node.js 22.12 oder neuer.

## Hosting

Die Seite läuft auf zwei Arten.

### A) Klassischer Webspace (z. B. World4You, easyname, Hetzner Webhosting)

1. `npm run build` ausführen.
2. Den **Inhalt** des Ordners `dist/` per FTP/SFTP in das Web-Verzeichnis hochladen, inklusive der versteckten Datei `.htaccess`.
3. Die Zugangsdaten für das Kontaktformular eintragen. Dazu `kontakt.config.php` auf dem Server anpassen oder eine eigene Datei `kontakt.config.local.php` anlegen, die nur die geänderten Werte zurückgibt:

   ```php
   <?php return [
       'smtp_host' => 'smtp.example.at',
       'smtp_user' => 'webseite@monsipan.at',
       'smtp_pass' => '…',
   ];
   ```

   Bleibt `smtp_host` leer, versendet der Webspace über die PHP-Funktion `mail()`.

Voraussetzungen: Apache mit PHP 7.4 oder neuer. HTTPS ist Pflicht; die `.htaccess` leitet automatisch auf HTTPS und die Adresse ohne `www` um.

> **Wichtig:** Die Seite nicht auf einem Hoster ganz ohne PHP ablegen (z. B. GitHub Pages, Netlify). Dort würde `kontakt.config.php` als Text ausgeliefert, und das Formular funktioniert nicht.

### B) Docker

```bash
cp .env.example .env    # SMTP-Zugangsdaten eintragen
docker compose up -d --build
```

Die Seite ist danach unter `http://<server>:8080` erreichbar. Das Image baut die Seite selbst (Node) und liefert sie über Apache und PHP aus. Für HTTPS einen Reverse Proxy davorschalten, z. B. Caddy, Traefik, Nginx Proxy Manager oder Portainer mit Proxy. Im Container ist die HTTPS-Umleitung der `.htaccess` abgeschaltet, weil der Proxy sie übernimmt.

Umgebungsvariablen: `MAIL_TO`, `MAIL_FROM`, `MAIL_FROM_NAME`, `SMTP_HOST`, `SMTP_PORT` (Standard 587), `SMTP_SECURE` (`tls` oder `ssl`), `SMTP_USER`, `SMTP_PASS`, `RATE_LIMIT` (Anfragen pro IP und Stunde, Standard 5).

## Inhalte pflegen

| Was | Wo |
| --- | --- |
| Firmendaten, Telefon, Öffnungszeiten, Ausstattungszahlen | `src/data/site.ts` |
| Leistungen (Texte, Titelbild, Video) | `src/data/leistungen.ts` |
| Team (Namen, Funktion, Telefon, Foto) | `src/data/team.ts` + Fotos in `src/assets/team/` |
| Referenzen | `src/data/referenzen.ts` |
| Projektbilder | einfach in `src/assets/projekte/<leistung>/` legen – die Galerie liest alle Bilder automatisch ein |
| Impressum / Datenschutz | `src/pages/impressum.astro`, `src/pages/datenschutzerklaerung.astro` |

Neue Fotos vor dem Einchecken verkleinern: `npm run optimize-images` begrenzt alle Quellbilder auf 2000 px und WebP. Beim Build erzeugt Astro daraus automatisch AVIF- und WebP-Varianten in passenden Größen.

## Technik im Überblick

- **Astro 7**, statische Ausgabe, keine Frameworks im Browser. Das JavaScript beschränkt sich auf Menü, Zähler, Galerie, Karte und Formular.
- **Schrift:** Overpass (selbst gehostet über Fontsource, keine Verbindung zu Google Fonts).
- **Bilder:** responsive AVIF und WebP, Lazy Loading. `scripts/prune-dist.mjs` entfernt nach dem Build ungenutzte Originale.
- **Animationen:** CSS-basiert. Die Markiermaschine im Hero, Linien, die beim Scrollen „fahren“ (Scroll-driven Animations, wo unterstützt), und native Seitenübergänge (View Transitions). Mit „Bewegung reduzieren“ im Betriebssystem werden alle Animationen abgeschaltet.
- **Datenschutz:** keine Cookies, kein Tracking. Google Maps lädt erst nach Klick (Zwei-Klick-Lösung).
- **SEO:** Meta- und Open-Graph-Tags, strukturierte Daten (LocalBusiness), `sitemap.xml`, `robots.txt`. Die alten URLs (`/projekte`, `/team`, `/referenzen`, `/kontakt`, `/impressum`, `/datenschutzerklaerung`) bleiben erhalten.

## Offene Punkte vor dem Livegang

- [ ] SMTP-Zugang für das Kontaktformular eintragen und einen Testversand machen
- [ ] Impressum prüfen: Gewerbewortlaut, Gewerbebehörde und Kammerzugehörigkeit bestätigen
- [ ] Datenschutzerklärung um den Namen des Hosting-Anbieters ergänzen
- [ ] Team: Vorname von Herrn Dittrich klären (alte Seite: „Andreas“, Fotodatei: „Alexander“); Foto von Roland Krammer liegt vor, er steht aber nicht auf der Teamliste
- [ ] Neue, einheitliche Teamfotos und aktuelle Projektfotos, sobald vorhanden
