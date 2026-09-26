<?php
/**
 * Single-domain recheck endpoint (AJAX).
 * Used by the "Try Again" button on a row whose availability check
 * previously errored — rechecks just that one TLD instead of reloading
 * the whole 70-TLD results page.
 */
require_once __DIR__.'/includes/bootstrap.php';
require_once __DIR__.'/integrations/domain-registrar.php';

header('Content-Type: application/json');

$sld = domain_query_normalize($_GET['sld'] ?? '');
$tld = strtolower(ltrim(trim((string)($_GET['tld'] ?? '')), '.'));

if (!domain_is_valid($sld) || $tld === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Invalid domain or extension.']);
    exit;
}

$pricing = null;
if ($db) {
    try {
        $st = $db->prepare('SELECT registration_price, currency, description FROM domain_pricing WHERE tld=? AND active=1');
        $st->execute(['.'.$tld]);
        $row = $st->fetch();
        if ($row) {
            $pricing = [
                'price' => (float)$row['registration_price'],
                'currency' => (string)$row['currency'],
                'description' => $row['description'] ?: null,
            ];
        }
    } catch (Throwable $e) {
        // Keep $pricing null; the row will just show "shown at checkout".
    }
}

$result = registrar_check_availability($sld, $tld);

$status = 'unavailable';
if (!empty($result['available'])) {
    $status = 'available';
} elseif (isset($result['status'])) {
    $s = strtolower((string)$result['status']);
    if ($s === 'available') $status = 'available';
    elseif ($s === 'error') $status = 'error';
}

$price = null;
if ($pricing && is_numeric($pricing['price'])) {
    $price = ['amount' => (float)$pricing['price'], 'currency' => $pricing['currency']];
}

echo json_encode([
    'ok' => true,
    'domain' => $sld.'.'.$tld,
    'sld' => $sld,
    'tld' => $tld,
    'status' => $status,
    'price' => $price,
    'price_formatted' => $price ? money($price['amount'], $price['currency']) : null,
    'description' => $pricing['description'] ?? null,
]);
