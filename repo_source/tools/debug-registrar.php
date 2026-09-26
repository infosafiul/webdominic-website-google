<?php
/**
 * TEMPORARY DEBUG TOOL — shows the raw ResellerClub API response
 * so we can see exactly why availability checks are failing.
 * Delete this file after debugging (it can reveal HTTP-level errors).
 * Usage: php tools/debug-registrar.php wdhtest .com
 */
if (PHP_SAPI !== 'cli') { http_response_code(403); exit("CLI only\n"); }
require_once __DIR__.'/../includes/bootstrap.php';

$domain = $argv[1] ?? 'wdhtest';
$tld = ltrim($argv[2] ?? '.com', '.');
$sld = preg_replace('/[^a-z0-9-]/', '', strtolower($domain));

$c = registrar_config();
echo "Provider: {$c['provider']}\n";
echo "Environment: {$c['environment']}\n";
echo "auth_userid length: " . strlen($c['auth_userid']) . " (should be > 0)\n";
echo "api_key length: " . strlen($c['api_key']) . " (should be > 0)\n";
echo "Configured: " . (registrar_is_configured() ? 'YES' : 'NO') . "\n";
echo "API base URL: " . registrar_api_base() . "\n\n";

// Call the raw HTTP layer with the SAME params registrar_check_availability() now uses
$response = registrar_http_get('/domains/available.json', [
    'domain-name' => $sld,
    'tlds' => [$tld],
    'suggest-alternative' => 'false',
]);

echo "--- RAW HTTP RESPONSE ---\n";
echo "success: " . ($response['success'] ? 'true' : 'false') . "\n";
echo "http_code: " . ($response['http_code'] ?? 'n/a') . "\n";
if (isset($response['error'])) {
    echo "error: " . $response['error'] . "\n";
}
if (isset($response['detail'])) {
    echo "detail: " . $response['detail'] . "\n";
}
echo "data/response body:\n";
echo json_encode($response['data'] ?? $response['response'] ?? null, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";

echo "\n--- registrar_check_availability() RESULT (the real function used by domains.php) ---\n";
$result = registrar_check_availability($sld, $tld);
echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";