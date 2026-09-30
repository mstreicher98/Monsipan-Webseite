<?php
/*
 * Einstellungen für das Kontaktformular.
 *
 * Webspace: Werte hier direkt eintragen.
 * Docker:   Werte als Umgebungsvariablen setzen (siehe docker-compose.yml) –
 *           gesetzte Umgebungsvariablen haben Vorrang vor den Werten hier.
 *
 * Ist SMTP_HOST leer, wird die PHP-Funktion mail() des Webspace verwendet.
 */
$env = static function (string $key, string $default = ''): string {
    $v = getenv($key);
    return ($v === false || $v === '') ? $default : $v;
};

return [
    // Empfänger der Anfragen
    'to'          => $env('MAIL_TO', 'office@monsipan.com'),
    // Absenderadresse (muss zur Domain bzw. zum SMTP-Konto passen)
    'from'        => $env('MAIL_FROM', 'webseite@monsipan.at'),
    'from_name'   => $env('MAIL_FROM_NAME', 'Webseite monsipan.at'),

    // SMTP (empfohlen). Leer lassen, um mail() zu verwenden.
    'smtp_host'   => $env('SMTP_HOST', ''),
    'smtp_port'   => (int) $env('SMTP_PORT', '587'),
    'smtp_secure' => $env('SMTP_SECURE', 'tls'), // 'tls' (STARTTLS, Port 587) oder 'ssl' (Port 465)
    'smtp_user'   => $env('SMTP_USER', ''),
    'smtp_pass'   => $env('SMTP_PASS', ''),

    // Spamschutz: maximale Anfragen pro IP und Stunde
    'rate_limit'  => (int) $env('RATE_LIMIT', '5'),
];
