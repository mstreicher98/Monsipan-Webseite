<?php
/*
 * Kontaktformular-Versand für monsipan.at
 * Läuft auf jedem Webspace mit PHP 7.4+ und im Docker-Image.
 * Einstellungen: kontakt.config.php (optional überschrieben durch kontakt.config.local.php)
 */
declare(strict_types=1);

$config = require __DIR__ . '/kontakt.config.php';
if (is_file(__DIR__ . '/kontakt.config.local.php')) {
    $config = array_merge($config, (array) require __DIR__ . '/kontakt.config.local.php');
}

$wantsJson = stripos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false;

function respond(bool $ok, string $message, int $status = 200): void
{
    global $wantsJson;
    http_response_code($status);
    if ($wantsJson) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE);
    } else {
        // Ohne JavaScript: einfache Rückmeldeseite
        header('Content-Type: text/html; charset=utf-8');
        $title = $ok ? 'Danke für Ihre Anfrage' : 'Anfrage nicht gesendet';
        $msg = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
        echo "<!doctype html><html lang=\"de-AT\"><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">"
            . "<title>{$title} | Monsipan</title><body style=\"font-family:system-ui,sans-serif;max-width:40rem;margin:4rem auto;padding:0 1rem;line-height:1.6\">"
            . "<h1>{$title}</h1><p>{$msg}</p><p><a href=\"/kontakt/\">Zurück zur Webseite</a></p></body></html>";
    }
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(false, 'Bitte verwenden Sie das Kontaktformular.', 405);
}

$field = static function (string $key, int $max): string {
    $v = trim((string) ($_POST[$key] ?? ''));
    $v = str_replace("\0", '', $v);
    return mb_substr($v, 0, $max, 'UTF-8');
};
$line = static fn (string $v): string => trim(preg_replace('/[\r\n\t]+/', ' ', $v) ?? '');

$name    = $line($field('name', 120));
$company = $line($field('company', 160));
$email   = $line($field('email', 160));
$phone   = $line($field('phone', 60));
$topic   = $line($field('topic', 80));
$message = $field('message', 5000);
$privacy = ($_POST['privacy'] ?? '') === '1';

// Spamschutz 1: verstecktes Feld muss leer sein – Bots bekommen trotzdem "Erfolg"
if (($_POST['website'] ?? '') !== '') {
    respond(true, 'Danke! Ihre Anfrage ist bei uns angekommen.');
}
// Spamschutz 2: Formular darf nicht schneller als in 3 Sekunden ausgefüllt sein
$ts = (int) ($_POST['t'] ?? 0);
if ($ts > 0 && (int) (microtime(true) * 1000) - $ts < 3000) {
    respond(false, 'Das ging etwas zu schnell. Bitte versuchen Sie es noch einmal.', 429);
}

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Bitte geben Sie Name, eine gültige E-Mail-Adresse und Ihre Nachricht an.', 422);
}
if (!$privacy) {
    respond(false, 'Bitte bestätigen Sie die Datenschutzerklärung.', 422);
}

// Spamschutz 3: Anfragen pro IP und Stunde begrenzen (IP nur als Hash, max. 1 Stunde)
$limit = max(1, (int) $config['rate_limit']);
$store = sys_get_temp_dir() . '/monsipan-kontakt-rate.json';
$ipHash = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . __FILE__);
$now = time();
$fh = @fopen($store, 'c+');
if ($fh && flock($fh, LOCK_EX)) {
    $data = json_decode((string) stream_get_contents($fh), true) ?: [];
    foreach ($data as $k => $times) {
        $data[$k] = array_values(array_filter((array) $times, static fn ($t) => $t > $now - 3600));
        if (!$data[$k]) unset($data[$k]);
    }
    $count = count($data[$ipHash] ?? []);
    if ($count >= $limit) {
        flock($fh, LOCK_UN);
        fclose($fh);
        respond(false, 'Sie haben bereits mehrere Anfragen gesendet. Bitte versuchen Sie es später erneut.', 429);
    }
    $data[$ipHash][] = $now;
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode($data));
    fflush($fh);
    flock($fh, LOCK_UN);
    fclose($fh);
}

$subject = 'Anfrage über monsipan.at' . ($topic !== '' ? ': ' . $topic : '') . ' – ' . $name;
$body = "Neue Anfrage über das Kontaktformular auf monsipan.at\n"
    . str_repeat('-', 52) . "\n"
    . "Name:     {$name}\n"
    . ($company !== '' ? "Firma:    {$company}\n" : '')
    . "E-Mail:   {$email}\n"
    . ($phone !== '' ? "Telefon:  {$phone}\n" : '')
    . ($topic !== '' ? "Thema:    {$topic}\n" : '')
    . str_repeat('-', 52) . "\n\n"
    . $message . "\n\n"
    . str_repeat('-', 52) . "\n"
    . 'Gesendet am ' . date('d.m.Y \u\m H:i') . " Uhr. Antworten Sie direkt auf diese E-Mail.\n";

$sent = $config['smtp_host'] !== ''
    ? smtp_send($config, $subject, $body, $email, $name)
    : mail_send($config, $subject, $body, $email, $name);

if (!$sent) {
    error_log('[kontakt] Versand fehlgeschlagen');
    respond(false, 'Die Anfrage konnte gerade nicht gesendet werden.', 500);
}
respond(true, 'Danke! Ihre Anfrage ist bei uns angekommen. Wir melden uns in Kürze.');

/* ------------------------------------------------------------------ */

function encode_header(string $v): string
{
    return preg_match('/[^\x20-\x7E]/', $v) ? '=?UTF-8?B?' . base64_encode($v) . '?=' : $v;
}

function build_headers(array $c, string $replyTo, string $replyName): array
{
    $host = parse_url('https://' . ($_SERVER['HTTP_HOST'] ?? 'monsipan.at'), PHP_URL_HOST) ?: 'monsipan.at';
    return [
        'Date: ' . date('r'),
        'From: ' . encode_header($c['from_name']) . ' <' . $c['from'] . '>',
        'To: <' . $c['to'] . '>',
        'Reply-To: ' . encode_header($replyName) . ' <' . $replyTo . '>',
        'Message-ID: <' . bin2hex(random_bytes(12)) . '@' . $host . '>',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
        'X-Mailer: monsipan-kontakt',
    ];
}

function mail_send(array $c, string $subject, string $body, string $replyTo, string $replyName): bool
{
    $headers = array_filter(build_headers($c, $replyTo, $replyName), static fn ($h) => stripos($h, 'To:') !== 0 && stripos($h, 'Date:') !== 0);
    return mail($c['to'], encode_header($subject), chunk_split(base64_encode($body)), implode("\r\n", $headers), '-f' . $c['from']);
}

function smtp_send(array $c, string $subject, string $body, string $replyTo, string $replyName): bool
{
    $secure = strtolower((string) $c['smtp_secure']);
    $remote = ($secure === 'ssl' ? 'ssl://' : 'tcp://') . $c['smtp_host'] . ':' . $c['smtp_port'];
    $ctx = stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true]]);
    $fp = @stream_socket_client($remote, $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $ctx);
    if (!$fp) {
        error_log("[kontakt] SMTP-Verbindung fehlgeschlagen: {$errstr} ({$errno})");
        return false;
    }
    stream_set_timeout($fp, 15);

    $read = static function () use ($fp): string {
        $data = '';
        while (($line = fgets($fp, 515)) !== false) {
            $data .= $line;
            if (strlen($line) < 4 || $line[3] === ' ') break;
        }
        return $data;
    };
    $cmd = static function (string $command, array $expect, bool $secret = false) use ($fp, $read): bool {
        if ($command !== '') fwrite($fp, $command . "\r\n");
        $res = $read();
        $ok = in_array((int) substr($res, 0, 3), $expect, true);
        if (!$ok) error_log('[kontakt] SMTP: ' . ($secret ? '***' : substr(trim($command), 0, 60)) . ' -> ' . trim($res));
        return $ok;
    };

    $ehloHost = gethostname() ?: 'localhost';
    $ok = $cmd('', [220]) && $cmd('EHLO ' . $ehloHost, [250]);
    if ($ok && $secure === 'tls') {
        $ok = $cmd('STARTTLS', [220])
            && stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT | STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT)
            && $cmd('EHLO ' . $ehloHost, [250]);
    }
    if ($ok && $c['smtp_user'] !== '') {
        $ok = $cmd('AUTH LOGIN', [334]) && $cmd(base64_encode($c['smtp_user']), [334], true) && $cmd(base64_encode($c['smtp_pass']), [235], true);
    }
    $ok = $ok && $cmd('MAIL FROM:<' . $c['from'] . '>', [250]) && $cmd('RCPT TO:<' . $c['to'] . '>', [250, 251]) && $cmd('DATA', [354]);
    if ($ok) {
        $headers = build_headers($c, $replyTo, $replyName);
        $headers[] = 'Subject: ' . encode_header($subject);
        $msg = implode("\r\n", $headers) . "\r\n\r\n" . rtrim(chunk_split(base64_encode($body), 76, "\r\n")) . "\r\n.";
        $ok = $cmd($msg, [250], true);
    }
    $cmd('QUIT', [221]);
    fclose($fp);
    return $ok;
}
