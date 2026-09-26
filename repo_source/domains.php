<?php
require_once __DIR__.'/includes/bootstrap.php';

/*
 * WDH STEP 2 — Domain Search Results
 * Uses the existing ResellerClub adapter and existing site helpers.
 * No registrar credentials are stored in this file.
 */

$rawDomain = trim((string)($_GET['domain'] ?? ''));
$selectedExtension = trim((string)($_GET['extension'] ?? ''));

$domain = strtolower($rawDomain);
$domain = preg_replace('/\s+/', '', $domain);
$domain = preg_replace('/^https?:\/\//', '', $domain);
$domain = preg_replace('/^www\./', '', $domain);
$domain = trim($domain, ". \t\n\r\0\x0B");

/*
 * TLDs + prices come from the domain_pricing table (already used by
 * cart.php) instead of a hardcoded list, so the search page always matches
 * what is actually sellable/priced — no separate "list of TLDs" to keep in
 * sync by hand, and prices show immediately instead of "shown at checkout".
 */
$allTlds = ['com','net','org','info','biz','shop']; // fallback if DB is unavailable
$pricingByTld = [];
$categoryByTld = [];

if ($db) {
    try {
        try {
            $priceRows = $db->query(
                "SELECT tld, registration_price, hosting_bundle_price, hosting_website_bundle_price, currency, description, category FROM domain_pricing WHERE active=1 ORDER BY sort_order ASC"
            )->fetchAll();
        } catch (Throwable $e) {
            // Bundle-price columns (migration 026) not applied yet on this
            // database — fall back to the query without them so pricing
            // still works; bundle hints just won't show until migrated.
            $priceRows = $db->query(
                "SELECT tld, registration_price, currency, description, category FROM domain_pricing WHERE active=1 ORDER BY sort_order ASC"
            )->fetchAll();
        }

        if ($priceRows) {
            $allTlds = [];
            foreach ($priceRows as $row) {
                $tldClean = ltrim(strtolower((string)$row['tld']), '.');
                $allTlds[] = $tldClean;
                $pricingByTld[$tldClean] = [
                    'price' => (float)$row['registration_price'],
                    'currency' => (string)$row['currency'],
                    'description' => $row['description'] ?: null,
                    'hosting_bundle_price' => isset($row['hosting_bundle_price']) && $row['hosting_bundle_price'] !== null ? (float)$row['hosting_bundle_price'] : null,
                    'hosting_website_bundle_price' => isset($row['hosting_website_bundle_price']) && $row['hosting_website_bundle_price'] !== null ? (float)$row['hosting_website_bundle_price'] : null,
                ];
                $categoryByTld[$tldClean] = $row['category'] ?: '';
            }
        }
    } catch (Throwable $e) {
        // Keep the fallback TLD list; the page still works without pricing.
    }
}

// Category tab metadata — labels + counts, built from whatever categories
// actually exist in the data (no hardcoded assumption about what's priced).
$categoryLabels = [
    'popular'     => 'Popular',
    'business'    => 'Business',
    'technology'  => 'Technology',
    'ecommerce'   => 'E-commerce',
    'education'   => 'Education',
    'country'     => 'Country',
    'country-sub' => 'Country Sub-Domains',
];
$categoryCounts = [];
foreach ($categoryByTld as $cat) {
    if ($cat === '') continue;
    $categoryCounts[$cat] = ($categoryCounts[$cat] ?? 0) + 1;
}
$categoryTabs = [];
foreach ($categoryLabels as $slug => $label) {
    if (!empty($categoryCounts[$slug])) {
        $categoryTabs[$slug] = ['label' => $label, 'count' => $categoryCounts[$slug]];
    }
}

if ($selectedExtension !== '') {
    $selectedExtension = strtolower(ltrim($selectedExtension, '.'));
    if (!in_array($selectedExtension, $allTlds, true)) {
        $selectedExtension = '';
    }
}

$sld = $domain;
if (strpos($domain, '.') !== false) {
    $parts = explode('.', $domain);
    $last = array_pop($parts);
    if (in_array($last, $allTlds, true)) {
        $sld = implode('.', $parts);
        if ($selectedExtension === '') {
            $selectedExtension = $last;
        }
    }
}

$sld = preg_replace('/[^a-z0-9-]/', '', strtolower($sld));

$results = [];
$searched = $sld !== '';

if ($searched) {
    /*
     * registrar_check_availability_batch() now sends real batched requests
     * (multiple TLDs per HTTP call, chunked) with automatic per-TLD fallback
     * if a chunk's response shape is ever unexpected. This replaced a
     * one-request-per-TLD loop that made a 70-TLD search do 70 sequential
     * round-trips to ResellerClub — the main cause of slow search results.
     */
    $results = registrar_check_availability_batch($sld, $allTlds);
}

// Summary used for the status banner above the results list.
// Domains already in the cart render as "Added to Cart" (disabled) instead
// of a clickable Add to Cart button.
$cartDomainNames = [];
foreach (cart_items() as $__ci) {
    if (($__ci['type'] ?? '') === 'domain' && !empty($__ci['name'])) {
        $cartDomainNames[strtolower($__ci['name'])] = true;
    }
}

// The banner must reflect the EXACT domain the person searched for
// (sld + the extension they typed or picked), not just whichever TLD
// happens to be available first in the full results list — congratulating
// someone on ".biz" when they searched "bdshops.com" (and .com is taken)
// is misleading.
$requestedTld = $selectedExtension;
if ($requestedTld === '' && in_array('com', $allTlds, true)) {
    $requestedTld = 'com';
}
$requestedDomain = ($searched && $requestedTld !== '') ? $sld.'.'.$requestedTld : null;
$requestedStatus = null; // 'available' | 'unavailable' | 'error' | null (unknown)

$bestChoiceDomain = null; // first available domain overall, used for the row "BEST CHOICE" badge
$anyAvailable = false;
$anyCheckError = false;
foreach ($results as $domainName => $result) {
    $s = isset($result['available']) && $result['available'] ? 'available'
        : (isset($result['status']) && $result['status'] === 'error' ? 'error' : 'unavailable');
    if ($s === 'available') {
        $anyAvailable = true;
        if ($bestChoiceDomain === null) $bestChoiceDomain = $domainName;
    } elseif ($s === 'error') {
        $anyCheckError = true;
    }
    if ($requestedDomain !== null && strtolower($domainName) === strtolower($requestedDomain)) {
        $requestedStatus = $s;
    }
}

function wdh_domain_price(array $result, ?array $pricing): ?array {
    // Prefer our own domain_pricing table — it's what checkout actually
    // charges, unlike the registrar's raw API price (often absent/wholesale).
    if ($pricing && is_numeric($pricing['price'] ?? null)) {
        return ['amount' => (float)$pricing['price'], 'currency' => $pricing['currency'] ?? 'BDT'];
    }

    $candidates = [
        $result['customer_price'] ?? null,
        $result['price'] ?? null,
        $result['selling_price'] ?? null,
        $result['registrar_cost'] ?? null,
    ];

    foreach ($candidates as $value) {
        if (is_numeric($value)) {
            return ['amount' => (float)$value, 'currency' => 'BDT'];
        }
        if (is_array($value)) {
            foreach ($value as $v) {
                if (is_numeric($v)) {
                    return ['amount' => (float)$v, 'currency' => 'BDT'];
                }
            }
        }
    }
    return null;
}

function wdh_tld(string $domain, array $knownTlds = []): string {
    $domain = strtolower($domain);
    $best = '';
    foreach ($knownTlds as $t) {
        $t = ltrim(strtolower((string)$t), '.');
        $suffix = '.' . $t;
        if (substr($domain, -strlen($suffix)) === $suffix && strlen($t) > strlen($best)) {
            $best = $t;
        }
    }
    if ($best !== '') return $best;

    // Fallback (no known-TLD list given, or no match): last-dot behavior.
    $p = strrpos($domain, '.');
    return $p === false ? '' : substr($domain, $p + 1);
}

function wdh_domain_status(array $result): string {
    if (!empty($result['available'])) return 'available';
    if (isset($result['status'])) {
        $s = strtolower((string)$result['status']);
        if ($s === 'available') return 'available';
        if ($s === 'unavailable') return 'unavailable'; // registrar confirmed: taken
        if ($s === 'error') return 'error'; // lookup failed — status unknown, not confirmed taken
    }
    return 'unavailable';
}

function wdh_tld_color(string $tld): array {
    // Matches the approved reference palette exactly for these TLDs.
    static $explicit = [
        'com'  => ['#4e9cff', '#1769ff'],
        'net'  => ['#34d399', '#059669'],
        'org'  => ['#fb923c', '#ea580c'],
        'info' => ['#a78bfa', '#7c3aed'],
        'biz'  => ['#2dd4bf', '#0d9488'],
        'shop' => ['#f472b6', '#db2777'],
    ];
    if (isset($explicit[$tld])) return $explicit[$tld];

    // Every other TLD gets a consistent (not random — same TLD always gets
    // the same color) pick from a broader palette, so every extension has
    // its own distinct look without hand-mapping all ~70 of them.
    static $palette = [
        ['#fbbf24', '#d97706'], // amber
        ['#60a5fa', '#2563eb'], // sky blue
        ['#f87171', '#dc2626'], // red
        ['#818cf8', '#4f46e5'], // indigo
        ['#4ade80', '#16a34a'], // emerald
        ['#e879f9', '#a21caf'], // fuchsia
        ['#38bdf8', '#0284c7'], // cyan-blue
        ['#fb7185', '#e11d48'], // rose
        ['#a3e635', '#65a30d'], // lime
        ['#c084fc', '#9333ea'], // violet
        ['#fca5a5', '#b91c1c'], // soft red
        ['#5eead4', '#0f766e'], // teal-2
    ];
    $index = crc32($tld) % count($palette);
    return $palette[$index];
}

function wdh_domain_description(string $tld, ?array $pricing): string {
    if ($pricing && !empty($pricing['description'])) {
        return $pricing['description'];
    }
    return match ($tld) {
        'com'  => 'Best for businesses and brands',
        'net'  => 'Great for technology and networks',
        'org'  => 'Ideal for organizations and communities',
        'info' => 'Perfect for information-based websites',
        'biz'  => 'A professional choice for business',
        'shop' => 'Built for online stores and ecommerce',
        'xyz'  => 'Modern and trendy extension',
        'co'   => 'Short, brand-friendly domain',
        default => 'A great domain for your website',
    };
}
?>
<!doctype html>
<html lang="<?=e($LANG)?>">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title><?= $searched ? 'Search Results for '.e($requestedDomain ?? $sld).' — WDH' : 'Domain Search — WDH' ?></title>
<link rel="stylesheet" href="assets/css/style.css?v=wdh-ui-v9">
<link rel="stylesheet" href="assets/css/catalog.css?v=wdh-step2-v1">
</head>
<body>
<?php require __DIR__.'/includes/header.php'; ?>

<main class="domain-results-page">
    <div class="domain-results-shell">

        <div class="domain-results-topcard">
            <div class="domain-results-heading">
                <div>
                    <div class="breadcrumbs"><a href="index.php">Home</a> › <a href="domains.php">Domains</a> › Search Results</div>
                    <?php if ($searched): ?>
                        <span class="eyebrow mint">DOMAIN SEARCH</span>
                        <h1>Search Results for <span>"<?=e($requestedDomain ?? $sld)?>"</span></h1>
                        <p>Choose your perfect domain name from the list below.</p>
                    <?php else: ?>
                        <span class="eyebrow mint">DOMAIN SEARCH</span>
                        <h1>Find Your Perfect Domain</h1>
                        <p>Search for a domain name and check live availability.</p>
                    <?php endif; ?>
                </div>
                <div class="domain-results-art" aria-hidden="true">
                    <svg viewBox="0 0 240 170" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="200" cy="30" r="26" fill="#ffffff" opacity=".5"/>
                        <circle cx="26" cy="140" r="14" fill="#ffffff" opacity=".45"/>
                        <rect x="18" y="24" width="188" height="120" rx="16" fill="#ffffff"/>
                        <rect x="18" y="24" width="188" height="28" rx="16" fill="#e9f1ff"/>
                        <rect x="18" y="40" width="188" height="12" fill="#e9f1ff"/>
                        <circle cx="34" cy="38" r="4" fill="#ff8b8b"/>
                        <circle cx="48" cy="38" r="4" fill="#ffd27a"/>
                        <circle cx="62" cy="38" r="4" fill="#7fe3a6"/>
                        <rect x="34" y="66" width="140" height="14" rx="7" fill="#eef3fb"/>
                        <rect x="34" y="66" width="70" height="14" rx="7" fill="#1769ff"/>
                        <text x="40" y="76" font-family="Arial, sans-serif" font-size="9" fill="#ffffff" font-weight="700">www.yourbrand</text>
                        <rect x="34" y="92" width="90" height="9" rx="4.5" fill="#dbe6f6"/>
                        <rect x="34" y="108" width="120" height="9" rx="4.5" fill="#dbe6f6"/>
                        <rect x="34" y="124" width="70" height="9" rx="4.5" fill="#dbe6f6"/>
                        <g transform="translate(150,96)">
                            <circle cx="18" cy="18" r="16" fill="none" stroke="#1769ff" stroke-width="5"/>
                            <line x1="30" y1="30" x2="42" y2="42" stroke="#1769ff" stroke-width="6" stroke-linecap="round"/>
                        </g>
                        <circle cx="212" cy="120" r="5" fill="#7fe3a6"/>
                        <circle cx="30" cy="20" r="4" fill="#ffd27a"/>
                    </svg>
                </div>
            </div>

            <section class="domain-results-search">
                <form action="domains.php" method="get" class="domain-results-form">
                    <div class="domain-results-input">
                        <label class="sr-only" for="domain-search-input">Domain name</label>
                        <input id="domain-search-input" name="domain" value="<?=e($requestedDomain ?? $sld)?>" placeholder="e.g. yourbrand.com" autocomplete="on">
                    </div>
                    <button class="btn primary domain-results-submit" type="submit">Search Again</button>
                </form>
            </section>
        </div>

        <?php if ($searched): ?>
            <?php if ($requestedStatus === 'available' && $requestedDomain): ?>
                <div class="domain-status-banner success">
                    <div class="domain-status-banner-grid">
                        <span class="domain-status-banner-icon"><?=icon('check-circle')?></span>
                        <div class="domain-status-banner-text">
                            <strong>Congratulations! <?=e($requestedDomain)?> is available.</strong>
                            <p>Grab it now before someone else does — add it to your cart below.</p>
                        </div>
                        <?php $__reqPricing = $pricingByTld[$requestedTld] ?? null; ?>
                        <?php if ($__reqPricing && (!empty($__reqPricing['hosting_bundle_price']) || !empty($__reqPricing['hosting_website_bundle_price']))): ?>
                            <span class="domain-gift-icon-plain" aria-hidden="true"><?=icon('gift')?></span>
                            <div class="domain-discount-line">
                                <strong>Get Discount!</strong>
                                <?php if (!empty($__reqPricing['hosting_bundle_price'])): ?>
                                    <mark>৳100 off with Hosting purchase,</mark>
                                <?php endif; ?>
                                <?php if (!empty($__reqPricing['hosting_website_bundle_price'])): ?>
                                    or <mark><?=e(money($__reqPricing['hosting_website_bundle_price'], 'BDT'))?> with Domain + Hosting + Website combo</mark>
                                <?php endif; ?>
                            </div>
                        <?php endif; ?>
                    </div>
                    <?php $__bestInCart = isset($cartDomainNames[strtolower($requestedDomain)]); ?>
                    <div class="domain-status-banner-actions">
                        <form method="post" action="cart.php" class="domain-status-banner-cta js-cart-add" data-domain="<?=e($requestedDomain)?>">
                            <?=csrf_field()?>
                            <input type="hidden" name="action" value="add">
                            <input type="hidden" name="type" value="domain">
                            <input type="hidden" name="name" value="<?=e($requestedDomain)?>">
                            <input type="hidden" name="domain_name" value="<?=e($requestedDomain)?>">
                            <input type="hidden" name="domain" value="<?=e($requestedDomain)?>">
                            <input type="hidden" name="tld" value="<?=e($requestedTld)?>">
                            <button class="btn primary small<?=$__bestInCart?' is-in-cart':''?>" type="submit" <?=$__bestInCart?'disabled':''?>>
                                <?=$__bestInCart?'✓ Added to Cart':'Add to Cart →'?>
                            </button>
                        </form>
                        <a class="btn primary small domain-banner-continue<?=$__bestInCart?'':' is-disabled'?>" href="domains.php" <?=$__bestInCart?'':'aria-disabled="true" tabindex="-1" onclick="return false;"'?>>Continue Shopping →</a>
                    </div>
                </div>
            <?php elseif ($requestedStatus === 'unavailable' && $requestedDomain): ?>
                <div class="domain-status-banner taken">
                    <span class="domain-status-banner-icon"><?=icon('x-circle')?></span>
                    <div class="domain-status-banner-text">
                        <strong>Sorry, <?=e($requestedDomain)?> is not available.</strong>
                        <p><?php if ($anyAvailable): ?>It's already registered — check the available alternatives below.<?php else: ?>It's already registered, and none of the other checked extensions are free either. Try a different name.<?php endif; ?></p>
                    </div>
                </div>
                <?php if ($anyAvailable && $bestChoiceDomain): ?>
                    <?php
                        $__altTld = wdh_tld($bestChoiceDomain, $allTlds);
                        $__altPricing = $pricingByTld[$__altTld] ?? null;
                        $__altPrice = wdh_domain_price($results[$bestChoiceDomain] ?? [], $__altPricing);
                        $__altInCart = isset($cartDomainNames[strtolower($bestChoiceDomain)]);
                    ?>
                    <div class="domain-alt-card">
                        <span class="domain-alt-badge">Great alternative</span>
                        <div class="domain-alt-row">
                            <div class="domain-alt-info">
                                <h3><?=e($bestChoiceDomain)?></h3>
                                <p><?=e(wdh_domain_description($__altTld, $__altPricing))?></p>
                            </div>
                            <div class="domain-alt-price">
                                <?php if ($__altPrice !== null): ?>
                                    <strong><?=e(money($__altPrice['amount'], $__altPrice['currency']))?></strong><small>/year</small>
                                <?php endif; ?>
                            </div>
                            <form method="post" action="cart.php" class="js-cart-add" data-domain="<?=e($bestChoiceDomain)?>">
                                <?=csrf_field()?>
                                <input type="hidden" name="action" value="add">
                                <input type="hidden" name="type" value="domain">
                                <input type="hidden" name="name" value="<?=e($bestChoiceDomain)?>">
                                <input type="hidden" name="domain_name" value="<?=e($bestChoiceDomain)?>">
                                <input type="hidden" name="domain" value="<?=e($bestChoiceDomain)?>">
                                <input type="hidden" name="tld" value="<?=e($__altTld)?>">
                                <button class="btn primary<?=$__altInCart?' is-in-cart':''?>" type="submit" <?=$__altInCart?'disabled':''?>>
                                    <?=$__altInCart?'✓ Added to Cart':'Make it yours →'?>
                                </button>
                            </form>
                        </div>
                        <?php if ($__altPricing && (!empty($__altPricing['hosting_bundle_price']) || !empty($__altPricing['hosting_website_bundle_price']))): ?>
                            <div class="domain-discount-line">
                                <span class="domain-gift-icon-plain" aria-hidden="true"><?=icon('gift')?></span>
                                <span>
                                    <strong>Get Discount!</strong>
                                    <?php if (!empty($__altPricing['hosting_bundle_price'])): ?>
                                        <mark>৳100 off with Hosting purchase,</mark>
                                    <?php endif; ?>
                                    <?php if (!empty($__altPricing['hosting_website_bundle_price'])): ?>
                                        or <mark><?=e(money($__altPricing['hosting_website_bundle_price'], 'BDT'))?> with Domain + Hosting + Website combo</mark>
                                    <?php endif; ?>
                                </span>
                            </div>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
            <?php elseif ($requestedStatus === 'error' && $requestedDomain): ?>
                <div class="domain-status-banner checking">
                    <span class="domain-status-banner-icon"><?=icon('alert-circle')?></span>
                    <div class="domain-status-banner-text">
                        <strong>We couldn't verify <?=e($requestedDomain)?> right now.</strong>
                        <p>Try again below, or check one of the other extensions in the list.</p>
                    </div>
                </div>
            <?php elseif (!$anyAvailable && !$anyCheckError): ?>
                <div class="domain-status-banner taken">
                    <span class="domain-status-banner-icon"><?=icon('x-circle')?></span>
                    <div class="domain-status-banner-text">
                        <strong>All checked extensions for "<?=e($sld)?>" are already registered.</strong>
                        <p>Try a different name, or pick another extension below.</p>
                    </div>
                </div>
            <?php elseif ($anyCheckError): ?>
                <div class="domain-status-banner checking">
                    <span class="domain-status-banner-icon"><?=icon('alert-circle')?></span>
                    <div class="domain-status-banner-text">
                        <strong>We couldn't verify some extensions for "<?=e($sld)?>".</strong>
                        <p>The results below show what we could confirm — try again for the rest.</p>
                    </div>
                </div>
            <?php endif; ?>
        <?php endif; ?>

        <?php if ($searched): ?>
            <?php
                $defaultCategory = isset($categoryTabs['popular']) ? 'popular' : '';
            ?>
            <?php if ($categoryTabs): ?>
                <div class="domain-category-tabs" role="tablist">
                    <?php foreach ($categoryTabs as $slug => $tab): ?>
                        <button type="button" class="domain-category-tab<?=$defaultCategory===$slug?' is-active':''?>" data-category="<?=e($slug)?>">
                            <?=e($tab['label'])?> <em>(<?=$tab['count']?>)</em>
                        </button>
                    <?php endforeach; ?>
                    <button type="button" class="domain-category-tab<?=$defaultCategory===''?' is-active':''?>" data-category="">
                        All Extensions <em>(<?=count($allTlds)?>)</em>
                    </button>
                </div>
            <?php endif; ?>

            <div class="domain-results-layout">

                <aside class="domain-filter-card">
                    <div class="domain-filter-title">
                        <h2>Filter Results</h2>
                        <button type="button" class="domain-filter-toggle" aria-expanded="false">Filter</button>
                    </div>

                    <div class="domain-filter-body">
                        <div class="domain-filter-group">
                            <span>BY PRICE</span>
                            <label><input type="radio" name="filter-price" value="" checked> <span>All Prices</span></label>
                            <label><input type="radio" name="filter-price" value="0-1000"> <span>Under ৳1,000</span></label>
                            <label><input type="radio" name="filter-price" value="1000-2000"> <span>৳1,000 – ৳2,000</span></label>
                            <label><input type="radio" name="filter-price" value="2000-999999"> <span>Above ৳2,000</span></label>
                        </div>

                        <div class="domain-filter-group">
                            <span>OTHER FILTERS</span>
                            <label><input type="checkbox" id="available-only"> <span>Show Available Only</span></label>
                        </div>

                        <button type="button" class="domain-clear-filters">Clear Filters ↻</button>
                    </div>
                </aside>

                <section class="domain-results-main">
                    <div class="domain-results-toolbar">
                        <strong><?=count($results)?> domain<?=count($results)===1?'':'s'?> checked</strong>
                        <span>Live registrar availability</span>
                    </div>

                    <div class="domain-result-table" id="domain-result-list">
                        <div class="domain-result-table-head">
                            <span>Domain Name</span>
                            <span>Price / Year</span>
                        </div>
                        <?php
                        $bestChoiceAssigned = false;
                        foreach ($results as $domainName => $result):
                            $status = wdh_domain_status($result);
                            $tld = wdh_tld($domainName, $allTlds);
                            $pricing = $pricingByTld[$tld] ?? null;
                            $price = wdh_domain_price($result, $pricing);
                            $isAvailable = $status === 'available';
                            $isChecking = $status === 'error';

                            $isBestChoice = $isAvailable && !$bestChoiceAssigned;
                            if ($isBestChoice) $bestChoiceAssigned = true;
                        ?>
                            <article class="domain-result-row<?=$isBestChoice?' is-best-choice':''?>"
                                     data-extension="<?=e($tld)?>"
                                     data-available="<?=$isAvailable?'1':'0'?>"
                                     data-price="<?=$isAvailable && $price !== null ? (int)$price['amount'] : ''?>"
                                     data-category="<?=e($categoryByTld[$tld] ?? '')?>"
                                     data-sld="<?=e($sld)?>"
                                     data-tld="<?=e($tld)?>">
                                <?php $__tldColor = wdh_tld_color($tld); ?>
                                <div class="domain-result-icon<?=strlen($tld)>7?' is-long':''?>" style="background:linear-gradient(135deg,<?=e($__tldColor[0])?>,<?=e($__tldColor[1])?>)">.<?=e($tld)?></div>

                                <div class="domain-result-info">
                                    <h2>
                                        <?=e($domainName)?>
                                        <?php if ($isBestChoice): ?><span class="domain-badge best">BEST CHOICE</span><?php endif; ?>
                                        <?php if (!$isAvailable && !$isChecking): ?><span class="domain-badge taken">TAKEN</span><?php endif; ?>
                                        <?php if ($isChecking): ?><span class="domain-badge checking">PENDING</span><?php endif; ?>
                                    </h2>
                                    <p><?=e(wdh_domain_description($tld, $pricing))?></p>
                                </div>

                                <div class="domain-result-price">
                                    <?php if ($isAvailable && $price !== null): ?>
                                        <strong><?=e(money($price['amount'], $price['currency']))?></strong><small>/year</small>
                                    <?php elseif ($isAvailable): ?>
                                        <strong>—</strong><small>at checkout</small>
                                    <?php endif; ?>
                                </div>

                                <div class="domain-result-action">
                                    <?php if ($isAvailable): ?>
                                        <?php $__rowInCart = isset($cartDomainNames[strtolower($domainName)]); ?>
                                        <form method="post" action="cart.php" class="js-cart-add" data-domain="<?=e($domainName)?>">
                                            <?=csrf_field()?>
                                            <input type="hidden" name="action" value="add">
                                            <input type="hidden" name="type" value="domain">
                                            <input type="hidden" name="name" value="<?=e($domainName)?>">
                                            <input type="hidden" name="domain_name" value="<?=e($domainName)?>">
                                            <input type="hidden" name="domain" value="<?=e($domainName)?>">
                                            <input type="hidden" name="tld" value="<?=e($tld)?>">
                                            <button class="btn <?=$isBestChoice?'primary':'secondary'?> small<?=$__rowInCart?' is-in-cart':''?>" type="submit" <?=$__rowInCart?'disabled':''?>>
                                                <?=$__rowInCart?'✓ Added to Cart':'Add to Cart →'?>
                                            </button>
                                        </form>
                                    <?php elseif ($isChecking): ?>
                                        <button type="button" class="btn secondary small js-recheck">Try Again</button>
                                    <?php else: ?>
                                        <a class="btn secondary small" href="https://www.whois.com/whois/<?=e($domainName)?>" target="_blank" rel="noopener">Whois</a>
                                    <?php endif; ?>
                                </div>
                            </article>
                        <?php endforeach; ?>
                    </div>
                    <button type="button" class="domain-show-more domain-show-more-results" data-target="results" hidden>Show More</button>
                </section>

                <aside class="domain-cart-preview">
                    <div class="domain-cart-preview-head">
                        <h2>Your Cart<span id="domain-cart-count"><?php if (cart_items()): ?> (<?=count(cart_items())?>)<?php endif; ?></span></h2>
                        <a href="cart.php">View Cart →</a>
                    </div>
                    <div id="domain-cart-error" class="domain-cart-error" hidden></div>
                    <div id="domain-cart-body">
                        <?php $__cartItems = cart_items(); ?>
                        <?php if (!$__cartItems): ?>
                            <p>Your selected domains and services will appear here after you add them to the cart.</p>
                            <div class="domain-cart-summary-row"><span>Subtotal</span><strong>—</strong></div>
                            <div class="domain-cart-summary-row"><span>VAT/Tax</span><strong>—</strong></div>
                            <div class="domain-cart-total"><span>Total</span><strong>—</strong></div>
                        <?php else: ?>
                            <div class="domain-cart-items">
                                <?php foreach ($__cartItems as $__ciKey => $__ci): ?>
                                    <div class="domain-cart-item-row">
                                        <div class="domain-cart-item-name-wrap">
                                            <span class="domain-cart-item-name" title="<?=e($__ci['name'] ?? '')?>"><?=e($__ci['name'] ?? '')?></span>
                                            <small>1 Year Registration</small>
                                        </div>
                                        <div class="domain-cart-item-price">
                                            <?php if (!empty($__ci['bundle_discount_applied'])): ?>
                                                <small class="domain-cart-was"><?=e(money($__ci['original_price'] ?? 0, $__ci['currency'] ?? 'BDT'))?></small>
                                            <?php endif; ?>
                                            <strong><?=e(money($__ci['price'] ?? 0, $__ci['currency'] ?? 'BDT'))?></strong>
                                        </div>
                                        <form method="post" action="cart.php" class="domain-cart-remove js-cart-remove">
                                            <?=csrf_field()?>
                                            <input type="hidden" name="action" value="remove">
                                            <input type="hidden" name="index" value="<?=(int)$__ciKey?>">
                                            <button type="submit" aria-label="Remove">✕</button>
                                        </form>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                            <div class="domain-cart-summary-row"><span>Subtotal</span><strong><?=e(money(cart_total(), $__cartItems[0]['currency'] ?? 'BDT'))?></strong></div>
                            <div class="domain-cart-summary-row"><span>VAT/Tax</span><strong>৳0</strong></div>
                            <div class="domain-cart-total"><span>Total</span><strong><?=e(money(cart_total(), $__cartItems[0]['currency'] ?? 'BDT'))?></strong></div>
                            <a class="btn primary domain-cart-continue" href="domains.php">Continue Shopping →</a>
                            <a class="btn secondary domain-cart-checkout" href="checkout.php">Proceed to Checkout →</a>
                        <?php endif; ?>
                    </div>
                    <div class="domain-why">
                        <h3>Why Choose WDH?</h3>
                        <p>✓ No hidden fees</p>
                        <p>✓ Easy domain management</p>
                        <p>✓ Free WHOIS privacy*</p>
                        <p>✓ 24/7 expert support</p>
                    </div>
                    <div class="domain-help-card">
                        <span class="domain-help-icon"><?=icon('headset')?></span>
                        <div>
                            <strong>Need Help?</strong>
                            <p>Our domain experts are here to help you 24/7.</p>
                        </div>
                        <a class="btn secondary small" href="contact.php">Talk to a Specialist 🎧</a>
                    </div>
                </aside>
            </div>
        <?php else: ?>
            <section class="domain-search-empty">
                <div class="domain-search-empty-icon">⌕</div>
                <h2>Search for your next domain</h2>
                <p>Enter a domain name above to check live availability.</p>
            </section>
        <?php endif; ?>

    </div>
</main>

<script src="assets/js/domain-results.js?v=wdh-step2-v1"></script>
<?php require __DIR__.'/includes/footer.php'; ?>
</body>
</html>
