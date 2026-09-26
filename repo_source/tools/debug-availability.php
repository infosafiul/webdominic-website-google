<?php
/**
 * TEMPORARY DIAGNOSTIC — run from SSH:
 *   php tools/debug-availability.php bdshops com
 * Shows the raw ResellerClub response + exact timing for ONE domain+TLD,
 * so we can see precisely what's happening if PENDING/errors persist.
 * Delete this file after debugging.
 */
if (PHP_SAPI !== 'cli') { http_response_code(403); exit("CLI only\n"); }
require_once __DIR__.'/../includes/bootstrap.php';
require_once __DIR__.'/../integrations/domain-registrar.php';

$sld = $argv[1] ?? 'bdshops';
$tld = strtolower(ltrim($argv[2] ?? 'com', '.'));

echo "Checking {$sld}.{$tld} ...\n\n";

$start = microtime(true);
$response = registrar_http_get('/domains/available.json', [
    'domain-name' => $sld,
    'tlds' => [$tld],
    'suggest-alternative' => 'false',
]);
$elapsed = round((microtime(true) - $start) * 1000);

echo "Time taken: {$elapsed} ms\n";
echo "success: " . ($response['success'] ? 'true' : 'false') . "\n";
echo "http_code: " . ($response['http_code'] ?? 'n/a') . "\n";
if (isset($response['error'])) echo "error: " . $response['error'] . "\n";
if (isset($response['detail'])) echo "detail: " . $response['detail'] . "\n";
echo "raw response:\n";
echo json_encode($response['data'] ?? $response['response'] ?? null, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n\n";

echo "--- Running it 3 more times back-to-back (to check for rate-limit flakiness) ---\n";
for ($i = 1; $i <= 3; $i++) {
    $t0 = microtime(true);
    $r = registrar_http_get('/domains/available.json', [
        'domain-name' => $sld,
        'tlds' => [$tld],
        'suggest-alternative' => 'false',
    ]);
    $ms = round((microtime(true) - $t0) * 1000);
    $node = $r['data'][$sld.'.'.$tld] ?? null;
    echo "Try {$i}: {$ms}ms, success=" . ($r['success']?'y':'n') . ", node=" . json_encode($node) . "\n";
}
