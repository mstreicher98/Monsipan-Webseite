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

Die Seite läuft auf drei Arten. Empfohlen ist **C) Portainer mit Cloudflare Tunnel**.

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

### C) Portainer-Stack mit Cloudflare Tunnel (empfohlen)

Bei jedem Push auf `main` baut GitHub Actions (`.github/workflows/docker.yml`) das fertige Image
`ghcr.io/mstreicher98/monsipan-webseite:latest` für amd64 und arm64. Portainer lädt nur noch dieses Image herunter.

**Einmalig einrichten**

1. Das Image ist öffentlich (das Repository ist public), Portainer braucht daher keinen Registry-Zugang. Wird das Repository privat, in Portainer unter *Registries* ghcr.io mit einem GitHub-Token (Recht `read:packages`) hinterlegen.
2. In Cloudflare unter *Zero Trust → Networks → Tunnels* einen Tunnel anlegen, falls noch keiner läuft, und bei *Public Hostname* eintragen:
   - `monsipan.at`, Typ HTTP, Ziel `<IP des Servers>:8080` (cloudflared läuft bereits am Server) **oder** `web:80` (cloudflared aus dem Stack, siehe Variante B in `portainer-stack.yml`)
   - dasselbe für `www.monsipan.at` – die Seite leitet www automatisch auf die Adresse ohne www um
3. In Portainer *Stacks → Add stack → Web editor* den Inhalt von `portainer-stack.yml` einfügen und die Umgebungsvariablen setzen (mindestens `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`).
4. *Deploy the stack*. Danach über die Domain ein Test-Formular absenden.

**Neue Version einspielen:** Nach dem Push warten, bis der Workflow grün ist. Dann in Portainer den Stack öffnen und *Editor → Update the stack* mit **Re-pull image and redeploy** ausführen. Bei Portainer Business kann das ein Stack-Webhook übernehmen: URL als Secret `PORTAINER_WEBHOOK_URL` im GitHub-Repo hinterlegen.

**Hinweise zu Cloudflare**

- Unter *SSL/TLS → Edge Certificates* „Always Use HTTPS“ und HSTS aktivieren. Die Verbindung zwischen Cloudflare und Server läuft verschlüsselt durch den Tunnel.
- *Rocket Loader* ausschalten; er verändert das JavaScript und ist hier überflüssig.
- Den Port 8080 im Router **nicht** freigeben – der Zugang läuft nur über den Tunnel.
- Der Container übernimmt die echte Besucher-IP aus `CF-Connecting-IP` (`docker/apache-monsipan.conf`). Das braucht der Spamschutz des Kontaktformulars, sonst würden alle Besucher gemeinsam gezählt.
- Die Datenschutzerklärung nennt Cloudflare bereits als Auftragsverarbeiter. Den Auftragsverarbeitungsvertrag (DPA) im Cloudflare-Dashboard akzeptieren.

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
- [ ] Portainer-Stack anlegen, Tunnel-Hostnames eintragen, Test-Anfrage senden
- [ ] Team: Vorname von Herrn Dittrich klären (alte Seite: „Andreas“, Fotodatei: „Alexander“); Foto von Roland Krammer liegt vor, er steht aber nicht auf der Teamliste
- [ ] Neue, einheitliche Teamfotos und aktuelle Projektfotos, sobald vorhanden
