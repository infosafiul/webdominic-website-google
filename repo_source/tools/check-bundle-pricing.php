<?php
require_once __DIR__.'/../includes/bootstrap.php';

if (!$db) {
    echo "No DB connection.\n";
    exit;
}

echo "--- All TLDs and their tld column value ---\n";
$rows = $db->query("SELECT tld, registration_price FROM domain_pricing ORDER BY sort_order LIMIT 10")->fetchAll();
foreach ($rows as $r) {
    echo "tld=[" . $r['tld'] . "] price=" . $r['registration_price'] . "\n";
}

echo "\n--- Checking bundle-price columns ---\n";
try {
    $rows = $db->query("SELECT tld, registration_price, hosting_bundle_price, hosting_website_bundle_price FROM domain_pricing ORDER BY sort_order LIMIT 10")->fetchAll();
    foreach ($rows as $r) {
        echo "tld=" . $r['tld']
            . " price=" . $r['registration_price']
            . " hosting_bundle=" . var_export($r['hosting_bundle_price'], true)
            . " hosting_website_bundle=" . var_export($r['hosting_website_bundle_price'], true)
            . "\n";
    }
} catch (Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "This means migration 026 has NOT been applied yet — the columns don't exist.\n";
}
