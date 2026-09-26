<?php
/**
 * WDH Domain Registrar Adapter
 *
 * ResellerClub / OrderBox HTTP API integration.
 *
 * Revision 3:
 * The previous batch response path could normalize a valid ResellerClub
 * response incorrectly and the UI then displayed every result as
 * "Unavailable".
 *
 * The batch function now deliberately performs one availability request per
 * TLD using registrar_check_availability(), which is the same code path used
 * by tools/test-registrar-api.php. This makes the web result page and the
 * CLI test use the same availability logic.
 */

function registrar_config(): array {
    $config = require __DIR__.'/../config.php';
    $r = $config['registrar'] ?? [];

    // ResellerClub's "auth-userid" parameter IS the Reseller ID.
    // config.php stores this under 'reseller_id'; also accept 'auth_userid'
    // and 'username' for backward compatibility with older config files.
    $userid = (string)($r['reseller_id'] ?? $r['auth_userid'] ?? $r['username'] ?? '');

    return [
        'provider'  => strtolower((string)($r['provider'] ?? 'resellerclub')),
        'username'  => $userid,
        'auth_userid' => $userid,
        'reseller_id' => $userid,
        'api_key'   => (string)($r['api_key'] ?? ''),
        'environment' => strtolower((string)($r['environment'] ?? 'production')),
    ];
}

function registrar_is_configured(): bool {
    $c = registrar_config();

    return $c['provider'] === 'resellerclub'
        && $c['auth_userid'] !== ''
        && $c['api_key'] !== ''
        && !preg_match('/^YOUR_/i', $c['auth_userid'])
        && !preg_match('/^YOUR_/i', $c['api_key']);
}

function registrar_api_base(): string {
    $c = registrar_config();

    /*
     * ResellerClub production API.
     * The test environment is retained for compatibility with the existing
     * configuration if it is explicitly selected.
     */
    if ($c['environment'] === 'test' || $c['environment'] === 'sandbox') {
        return 'https://test.httpapi.com/api';
    }

    return 'https://httpapi.com/api';
}

function registrar_build_url(string $path, array $params): string {
    $c = registrar_config();

    $params['auth-userid'] = $c['auth_userid'];
    $params['api-key'] = $c['api_key'];

    /*
     * ResellerClub's API reads repeated plain keys for multi-value
     * parameters (e.g. "tlds=com&tlds=net"), not PHP's default bracket
     * notation ("tlds[0]=com&tlds[1]=net"), which their backend does not
     * recognize as an array and reports as "No TLDs are selected".
     */
    $pairs = [];
    foreach ($params as $key => $value) {
        if (is_array($value)) {
            foreach ($value as $v) {
                $pairs[] = rawurlencode((string)$key) . '=' . rawurlencode((string)$v);
            }
        } else {
            $pairs[] = rawurlencode((string)$key) . '=' . rawurlencode((string)$value);
        }
    }

    return rtrim(registrar_api_base(), '/')
        . '/'
        . ltrim($path, '/')
        . '?'
        . implode('&', $pairs);
}

function registrar_parse_response(string $body, int $errno, string $curlError, int $httpCode): array {
    if ($body === '' || $errno) {
        return [
            'success' => false,
            'error' => 'Registrar connection failed.',
            'detail' => $curlError ?: ('cURL error '.$errno),
            'http_code' => $httpCode,
        ];
    }

    $data = json_decode($body, true);

    if (!is_array($data)) {
        return [
            'success' => false,
            'error' => 'Registrar returned an unreadable response.',
            'http_code' => $httpCode,
        ];
    }

    return ['success' => true, 'data' => $data, 'http_code' => $httpCode];
}

/**
 * Fire several GET requests concurrently via curl_multi and return their
 * parsed responses in the same order as $requests. Each entry in $requests
 * is ['path' => string, 'params' => array]. This is what lets a 70-TLD
 * search finish in roughly one round-trip's time instead of stacking up
 * several sequential chunk requests.
 */
function registrar_http_get_multi(array $requests, int $maxConcurrent = 3, int $waveDelayMicroseconds = 150000): array {
    if (!$requests) return [];

    $results = [];
    $waves = array_chunk($requests, max(1, $maxConcurrent), true);
    $waveCount = count($waves);
    $waveIndex = 0;

    foreach ($waves as $wave) {
        $mh = curl_multi_init();
        $handles = [];

        foreach ($wave as $i => $req) {
            $url = registrar_build_url($req['path'], $req['params']);
            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_CONNECTTIMEOUT => 10,
                CURLOPT_TIMEOUT => 25,
                CURLOPT_SSL_VERIFYPEER => true,
                CURLOPT_SSL_VERIFYHOST => 2,
                CURLOPT_HTTPHEADER => ['Accept: application/json'],
            ]);
            curl_multi_add_handle($mh, $ch);
            $handles[$i] = $ch;
        }

        $running = null;
        do {
            $status = curl_multi_exec($mh, $running);
            if ($running) curl_multi_select($mh, 1.0);
        } while ($running && $status === CURLM_OK);

        foreach ($handles as $i => $ch) {
            $body = curl_multi_getcontent($ch) ?: '';
            $errno = curl_errno($ch);
            $error = curl_error($ch);
            $http = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $results[$i] = registrar_parse_response($body, $errno, $error, $http);
            curl_multi_remove_handle($mh, $ch);
            curl_close($ch);
        }
        curl_multi_close($mh);

        $waveIndex++;
        // Small pause between waves (not after the last one) so we don't
        // hammer the registrar's rate limiter with back-to-back bursts.
        if ($waveIndex < $waveCount && $waveDelayMicroseconds > 0) {
            usleep($waveDelayMicroseconds);
        }
    }

    ksort($results);
    return $results;
}

function registrar_http_get(string $path, array $params): array {
    $url = registrar_build_url($path, $params);

    $ch = curl_init($url);

    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_TIMEOUT => 25,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
        CURLOPT_HTTPHEADER => [
            'Accept: application/json',
        ],
    ]);

    $body = curl_exec($ch);
    $errno = curl_errno($ch);
    $error = curl_error($ch);
    $http = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);

    curl_close($ch);

    if ($body === false || $errno) {
        return [
            'success' => false,
            'error' => 'Registrar connection failed.',
            'detail' => $error ?: ('cURL error '.$errno),
            'http_code' => $http,
        ];
    }

    $data = json_decode($body, true);

    /*
     * ResellerClub may return a JSON object for this endpoint. If the body
     * cannot be decoded, preserve the raw response for an internal caller
     * without exposing credentials.
     */
    if (!is_array($data)) {
        return [
            'success' => false,
            'error' => 'Registrar returned an invalid response.',
            'http_code' => $http,
        ];
    }

    if ($http >= 400) {
        return [
            'success' => false,
            'error' => 'Registrar HTTP error.',
            'http_code' => $http,
            'response' => $data,
        ];
    }

    return [
        'success' => true,
        'http_code' => $http,
        'data' => $data,
    ];
}

/**
 * Normalize the many response shapes returned by ResellerClub/OrderBox.
 */
function registrar_normalize_api_node($node): array {
    if (is_string($node) || is_numeric($node) || is_bool($node)) {
        $value = strtolower(trim((string)$node));

        if (in_array($value, ['available', 'true', '1', 'yes'], true)) {
            return [
                'available' => true,
                'status' => 'available',
                'registrar_cost' => null,
            ];
        }

        if (in_array($value, ['unavailable', 'false', '0', 'no', 'regthroughothers', 'yours', 'registered', 'taken'], true)) {
            return [
                'available' => false,
                'status' => 'unavailable',
                'registrar_cost' => null,
            ];
        }
    }

    if (!is_array($node)) {
        return [
            'available' => false,
            'status' => 'error',
            'registrar_cost' => null,
        ];
    }

    $status = '';

    foreach ([
        $node['status'] ?? null,
        $node['availability'] ?? null,
        $node['available'] ?? null,
        $node['isAvailable'] ?? null,
    ] as $candidate) {
        if ($candidate === null || $candidate === '') {
            continue;
        }

        if (is_bool($candidate) || is_numeric($candidate)) {
            $status = ((int)$candidate === 1) ? 'available' : 'unavailable';
        } else {
            $status = strtolower(trim((string)$candidate));
        }

        break;
    }

    if (in_array($status, ['true', '1', 'yes'], true)) {
        $status = 'available';
    }

    if (in_array($status, ['false', '0', 'no'], true)) {
        $status = 'unavailable';
    }

    /*
     * ResellerClub's available.json can return several distinct "taken"
     * statuses, not just the literal word "unavailable":
     *   - regthroughothers: registered, via a different registrar
     *   - yours: already registered under this reseller account
     * Both mean the domain is NOT available — treating them as an unknown
     * status (falling through to 'error') is what caused clearly-taken
     * domains like a registered .com to sit stuck on "Pending" instead of
     * showing "Not available".
     */
    if (in_array($status, ['regthroughothers', 'yours', 'registered', 'taken'], true)) {
        $status = 'unavailable';
    }

    if (!in_array($status, ['available', 'unavailable', 'error'], true)) {
        $status = 'error';
    }

    $cost = null;

    foreach ([
        $node['customer_price'] ?? null,
        $node['selling_price'] ?? null,
        $node['price'] ?? null,
        $node['costHash'] ?? null,
        $node['cost'] ?? null,
    ] as $candidate) {
        if (is_numeric($candidate)) {
            $cost = $candidate;
            break;
        }

        if (is_array($candidate)) {
            foreach ($candidate as $v) {
                if (is_numeric($v)) {
                    $cost = $v;
                    break 2;
                }
            }
        }
    }

    return [
        'available' => $status === 'available',
        'status' => $status,
        'registrar_cost' => $cost,
        'customer_price' => $node['customer_price'] ?? null,
        'price' => $node['price'] ?? null,
        'raw' => $node,
    ];
}

/**
 * Check one domain.
 *
 * This is the same method used by the CLI tool.
 */
function registrar_check_availability(string $sld, string $tld): array {
    $sld = strtolower(trim($sld));
    $tld = strtolower(ltrim(trim($tld), '.'));

    if ($sld === '' || $tld === '') {
        return [
            'available' => false,
            'status' => 'error',
            'error' => 'Invalid domain name.',
        ];
    }

    if (!registrar_is_configured()) {
        return [
            'available' => false,
            'status' => 'error',
            'error' => 'Registrar is not configured.',
        ];
    }

    $domain = $sld.'.'.$tld;

    /*
     * ResellerClub's available.json endpoint expects the SLD and TLD as
     * two separate parameters — 'domain-name' (SLD only) and 'tlds' (array).
     * Sending the full "sld.tld" string in 'domain-name' with no 'tlds'
     * parameter causes the API to respond with {"error":"No TLDs are
     * selected"} for every request, which this adapter was previously
     * misreading as a generic failure.
     */
    $response = registrar_http_get('/domains/available.json', [
        'domain-name' => $sld,
        'tlds' => [$tld],
        'suggest-alternative' => 'false',
    ]);

    if (!$response['success']) {
        return [
            'available' => false,
            'status' => 'error',
            'error' => $response['error'] ?? 'Registrar request failed.',
            'detail' => $response['detail'] ?? null,
        ];
    }

    $data = $response['data'] ?? [];

    /*
     * Standard ResellerClub shape:
     * {
     *   "example.com": {
     *      "status": "available",
     *      ...
     *   }
     * }
     *
     * Be tolerant of a direct node or a nested data/result wrapper too.
     */
    $node = null;

    if (isset($data[$domain])) {
        $node = $data[$domain];
    } elseif (isset($data['data'][$domain])) {
        $node = $data['data'][$domain];
    } elseif (isset($data['result'][$domain])) {
        $node = $data['result'][$domain];
    } elseif (
        isset($data['status']) ||
        isset($data['available']) ||
        isset($data['availability'])
    ) {
        $node = $data;
    } elseif (count($data) === 1) {
        $first = reset($data);
        $node = $first;
    }

    $normalized = registrar_normalize_api_node($node);

    $normalized['domain'] = $domain;

    return $normalized;
}

function registrar_status_label(array $result): string {
    $status = strtolower((string)($result['status'] ?? ''));

    if ($status === 'available' || !empty($result['available'])) {
        return 'Available';
    }

    if ($status === 'error') {
        return 'Error';
    }

    return 'Unavailable';
}

/**
 * Check multiple TLDs.
 *
 * ResellerClub's available.json accepts multiple 'tlds' values in a single
 * request and returns one result node per "sld.tld" key — so instead of one
 * HTTP round-trip per TLD (70 sequential requests for the full catalog,
 * which is what made domain search feel slow), this sends the TLDs in
 * chunks and reads all results for a chunk from one response.
 *
 * Safety net: if a chunk's response can't be parsed into per-domain nodes
 * (unexpected shape, HTTP error, etc.), that chunk automatically falls back
 * to the proven single-domain method (registrar_check_availability) for
 * just those TLDs, so a parsing surprise never silently reports everything
 * as unavailable again.
 */
/**
 * Check multiple TLDs.
 *
 * ResellerClub's available.json accepts multiple 'tlds' values in a single
 * request and returns one result node per "sld.tld" key. TLDs are sent in
 * chunks, and — unlike earlier — all chunk requests fire CONCURRENTLY via
 * curl_multi instead of one after another, so a 70-TLD search takes roughly
 * one round-trip's time instead of stacking up 5 sequential requests.
 *
 * Reliability: ResellerClub can occasionally return a per-domain error for
 * a handful of TLDs inside an otherwise-successful batch response (rate
 * limiting / transient flakiness on their end) — that showed up as some
 * clearly-registered domains (e.g. .com) sitting in "Pending" instead of
 * "Not available". Any TLD that comes back with an error status is
 * automatically retried once, in parallel, before the results are
 * returned, instead of leaving it for the person to click "Try Again".
 *
 * Safety net: if a whole chunk's response can't be parsed into per-domain
 * nodes at all (unexpected shape, HTTP error, etc.), that chunk falls back
 * to the single-domain method for just those TLDs.
 */
function registrar_check_availability_batch(string $sld, array $tlds): array {
    $sld = strtolower(trim($sld));

    $cleanTlds = [];
    foreach ($tlds as $t) {
        $t = strtolower(ltrim(trim((string)$t), '.'));
        if ($t !== '') $cleanTlds[] = $t;
    }

    $out = [];
    if ($sld === '' || !$cleanTlds) return $out;

    if (!registrar_is_configured()) {
        foreach ($cleanTlds as $t) {
            $out[$sld.'.'.$t] = [
                'available' => false,
                'status' => 'error',
                'error' => 'Registrar is not configured.',
            ];
        }
        return $out;
    }

    $chunkSize = 15;
    $chunks = array_chunk($cleanTlds, $chunkSize);

    $requests = [];
    foreach ($chunks as $chunkTlds) {
        $requests[] = [
            'path' => '/domains/available.json',
            'params' => [
                'domain-name' => $sld,
                'tlds' => $chunkTlds,
                'suggest-alternative' => 'false',
            ],
        ];
    }

    $responses = registrar_http_get_multi($requests);

    foreach ($chunks as $i => $chunkTlds) {
        $response = $responses[$i] ?? ['success' => false, 'error' => 'No response.'];

        if (!$response['success']) {
            foreach ($chunkTlds as $t) {
                $domain = $sld.'.'.$t;
                $out[$domain] = [
                    'available' => false,
                    'status' => 'error',
                    'error' => $response['error'] ?? 'Registrar request failed.',
                    'detail' => $response['detail'] ?? null,
                    'domain' => $domain,
                ];
            }
            continue;
        }

        $data = $response['data'] ?? [];
        $matchedAny = false;

        foreach ($chunkTlds as $t) {
            $domain = $sld.'.'.$t;
            $node = null;

            if (isset($data[$domain])) {
                $node = $data[$domain];
            } elseif (isset($data['data'][$domain])) {
                $node = $data['data'][$domain];
            } elseif (isset($data['result'][$domain])) {
                $node = $data['result'][$domain];
            }

            if ($node !== null) {
                $matchedAny = true;
                $normalized = registrar_normalize_api_node($node);
                $normalized['domain'] = $domain;
                $out[$domain] = $normalized;
            }
        }

        // Nothing in this chunk's response matched any expected domain key —
        // the response shape wasn't what we expected. Fall back to the
        // proven single-call method for just this chunk instead of guessing.
        if (!$matchedAny) {
            foreach ($chunkTlds as $t) {
                $domain = $sld.'.'.$t;
                if (!isset($out[$domain])) {
                    $out[$domain] = registrar_check_availability($sld, $t);
                }
            }
        }
    }

    // Automatic parallel retry for any TLD that individually came back as
    // an error, even though its chunk otherwise succeeded.
    $retryTlds = [];
    foreach ($cleanTlds as $t) {
        $domain = $sld.'.'.$t;
        if (($out[$domain]['status'] ?? '') === 'error') {
            $retryTlds[] = $t;
        }
    }

    if ($retryTlds) {
        usleep(400000); // let any short rate-limit window pass before retrying
        $retryRequests = [];
        foreach ($retryTlds as $t) {
            $retryRequests[] = [
                'path' => '/domains/available.json',
                'params' => [
                    'domain-name' => $sld,
                    'tlds' => [$t],
                    'suggest-alternative' => 'false',
                ],
            ];
        }
        $retryResponses = registrar_http_get_multi($retryRequests, 2, 200000);

        foreach ($retryTlds as $i => $t) {
            $domain = $sld.'.'.$t;
            $response = $retryResponses[$i] ?? ['success' => false];
            if (!$response['success']) continue;

            $data = $response['data'] ?? [];
            $node = $data[$domain] ?? ($data['data'][$domain] ?? ($data['result'][$domain] ?? null));
            if ($node !== null) {
                $normalized = registrar_normalize_api_node($node);
                $normalized['domain'] = $domain;
                $out[$domain] = $normalized;
            }
        }
    }

    return $out;
}
