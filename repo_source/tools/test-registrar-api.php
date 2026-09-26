<?php
/**
 * CLI-only ResellerClub availability test. Never prints credentials.
 * Usage: php tools/test-registrar-api.php example .com
 */
if (PHP_SAPI !== 'cli') { http_response_code(403); exit("CLI only\n"); }
require_once __DIR__.'/../includes/bootstrap.php';
$domain = $argv[1] ?? 'wdh-api-test';
$tld = $argv[2] ?? '.com';
$parts = explode('.', trim(strtolower($domain)), 2);
$sld = preg_replace('/[^a-z0-9-]/', '', $parts[0] ?? $domain);
$tld = '.'.ltrim(preg_replace('/[^a-z.]/', '', $tld), '.');
$c = registrar_config();
echo "Provider: {$c['provider']}\n";
echo "Environment: {$c['environment']}\n";
echo "Configured: ".(registrar_is_configured()?'YES':'NO')."\n";
if (!$sld) exit("Invalid test domain.\n");
$r = registrar_check_availability($sld, $tld);
echo "Domain: {$sld}{$tld}\n";
echo "Status: ".($r['status'] ?? 'unknown')."\n";
echo "Available: ".(($r['available'] ?? null) === true ? 'YES' : (($r['available'] ?? null) === false ? 'NO' : 'UNKNOWN'))."\n";
if (!empty($r['error'])) echo "Result: availability service returned an error.\n";
