<?php
require_once __DIR__.'/../integrations/domain-registrar.php';
require_once __DIR__.'/provisioning.php';
function e($v){return htmlspecialchars((string)$v,ENT_QUOTES,'UTF-8');}
function money($amount,$currency='BDT'){return strtoupper($currency)==='USD'?'$'.number_format((float)$amount,0):'৳'.number_format((float)$amount,0);}
function is_post(){return ($_SERVER['REQUEST_METHOD']??'GET')==='POST';}
function redirect($url){header('Location: '.$url);exit;}
function csrf_token(){if(empty($_SESSION['csrf']))$_SESSION['csrf']=bin2hex(random_bytes(32));return $_SESSION['csrf'];}
function csrf_field(){return '<input type="hidden" name="csrf" value="'.e(csrf_token()).'">';}
function verify_csrf(){if(!hash_equals($_SESSION['csrf']??'',$_POST['csrf']??'')){http_response_code(419);exit('Invalid request token.');}}
function current_user(){return $_SESSION['wdh_user']??null;}
function require_login(){if(!current_user())redirect('login.php');}
function require_admin(){$u=current_user();if(!$u||($u['role']??'')!=='admin'){http_response_code(403);exit('Forbidden');}}
function cart_items(){return wdh_apply_bundle_pricing($_SESSION['wdh_cart']??[]);}
function cart_count(){return count(cart_items());}
function add_cart($item){$_SESSION['wdh_cart'][]=$item;}
function remove_cart($index){if(isset($_SESSION['wdh_cart'][$index]))array_splice($_SESSION['wdh_cart'],$index,1);}

/*
 * Domain bundle-discount policy (confirmed):
 *   - Domain + hosting purchased together: ৳100 off the domain (first year).
 *   - Domain + hosting + a website plan (any package, first-year value
 *     >= ৳4,500) purchased together: 50% off the domain (first year).
 * The discount is computed live from whatever is currently in the cart —
 * it isn't locked in when the domain was added, since hosting/website
 * items are often added afterward. Array keys are preserved (not
 * reindexed) so index-based cart removal keeps working.
 */
function wdh_apply_bundle_pricing(array $items): array {
    // "Hosting" for this policy means any hosting/server-type package —
    // shared hosting, managed server, VPS, or dedicated server. Nothing
    // outside this list (security add-ons, email, etc.) qualifies.
    $hostingCategories = ['hosting', 'business_hosting', 'vps', 'dedicated', 'reseller'];

    // Adjust this category list once real website-design/build packages
    // exist in the products table — currently matches 'website' (future)
    // and 'service' (e.g. website-maintenance today). Must also meet the
    // ৳4,500 minimum-value policy to qualify.
    $websiteCategories = ['website', 'service'];
    $websiteMinPrice = 4500;

    $maxDiscountedDomains = 2;

    // Each hosting/website item pairs with exactly ONE domain — buying two
    // domains with a single hosting purchase only discounts the first
    // domain, not both. Domains are matched in cart order (first added,
    // first matched), and at most 2 domains total can ever be discounted.
    $domainKeys = [];
    $hostingKeys = [];
    $websiteKeys = [];

    foreach ($items as $key => $it) {
        $type = strtolower((string)($it['type'] ?? ''));
        $cat = strtolower((string)($it['category'] ?? $type));

        if ($type === 'domain') {
            $domainKeys[] = $key;
        } elseif (in_array($cat, $hostingCategories, true)) {
            $hostingKeys[] = $key;
        } elseif (in_array($cat, $websiteCategories, true)
            && strtoupper((string)($it['currency'] ?? 'BDT')) === 'BDT'
            && (float)($it['price'] ?? 0) >= $websiteMinPrice) {
            $websiteKeys[] = $key;
        }
    }

    $hostingPointer = 0;
    $websitePointer = 0;
    $discountedCount = 0;

    foreach ($domainKeys as $domainKey) {
        if ($discountedCount >= $maxDiscountedDomains) break;

        $it = $items[$domainKey];
        $hostingAvailable = $hostingPointer < count($hostingKeys);
        $websiteAvailable = $websitePointer < count($websiteKeys);

        $bundlePrice = null;

        if ($hostingAvailable && $websiteAvailable
            && isset($it['hosting_website_bundle_price']) && $it['hosting_website_bundle_price'] !== null) {
            $bundlePrice = (float)$it['hosting_website_bundle_price'];
            $hostingPointer++;
            $websitePointer++;
        } elseif ($hostingAvailable
            && isset($it['hosting_bundle_price']) && $it['hosting_bundle_price'] !== null) {
            $bundlePrice = (float)$it['hosting_bundle_price'];
            $hostingPointer++;
        }

        if ($bundlePrice !== null && $bundlePrice < (float)($it['price'] ?? 0)) {
            $items[$domainKey]['original_price'] = $it['price'];
            $items[$domainKey]['price'] = $bundlePrice;
            $items[$domainKey]['bundle_discount_applied'] = true;
            $discountedCount++;
        }
    }

    return $items;
}
function cart_total(){$total=0;foreach(cart_items() as $i)$total+=(float)($i['price']??0);return $total;}
function product_features($json){$a=json_decode((string)$json,true);return is_array($a)?$a:[];}
function fetch_products($db,$category){if(!$db)return[];$st=$db->prepare('SELECT * FROM products WHERE category=? AND active=1 ORDER BY sort_order,id');$st->execute([$category]);return $st->fetchAll();}
function fetch_domain_prices($db){if($db){return $db->query('SELECT * FROM domain_pricing WHERE active=1 ORDER BY sort_order,id')->fetchAll();}return [['tld'=>'.com','registration_price'=>1550,'renewal_price'=>1550,'transfer_price'=>1550,'description'=>'Perfect for business and personal use','active'=>1],['tld'=>'.net','registration_price'=>1850,'renewal_price'=>1850,'transfer_price'=>1850,'description'=>'Great for network and technology','active'=>1],['tld'=>'.org','registration_price'=>1770,'renewal_price'=>1770,'transfer_price'=>1770,'description'=>'Ideal for organizations and non-profits','active'=>1],['tld'=>'.info','registration_price'=>1450,'renewal_price'=>1450,'transfer_price'=>1450,'description'=>'Great for information and resource sites','active'=>1],['tld'=>'.biz','registration_price'=>1190,'renewal_price'=>1190,'transfer_price'=>1190,'description'=>'Best for businesses and companies','active'=>1],['tld'=>'.shop','registration_price'=>1990,'renewal_price'=>1990,'transfer_price'=>1990,'description'=>'Great for online stores and shops','active'=>1],['tld'=>'.xyz','registration_price'=>890,'renewal_price'=>890,'transfer_price'=>890,'description'=>'Modern and trendy extension','active'=>1],['tld'=>'.co','registration_price'=>2200,'renewal_price'=>2200,'transfer_price'=>2200,'description'=>'Short brand-friendly domain','active'=>1]];}
function domain_query_normalize($domain){$domain=trim(strtolower($domain));$domain=preg_replace('/\s+/','',$domain);$domain=preg_replace('/^https?:\/\//','',$domain);return trim($domain,'/.');}
function domain_is_valid($domain){return(bool)preg_match('/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i',$domain);}
function demo_domain_available($sld,$tld){$reserved=['google','facebook','amazon','microsoft','apple','openai','wdh','webdatahosting'];return!in_array(strtolower($sld),$reserved,true);}

function record_login_activity($db, $userId, $eventType='login_success') {
    if (!$db || !$userId) return;
    try {
        $ip = substr((string)($_SERVER['REMOTE_ADDR'] ?? ''), 0, 45);
        $ua = substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 500);
        $st = $db->prepare('INSERT INTO login_activity (user_id,event_type,ip_address,user_agent) VALUES (?,?,?,?)');
        $st->execute([(int)$userId, $eventType, $ip ?: null, $ua ?: null]);
    } catch (Throwable $e) { /* Security telemetry must never break login/logout. */ }
}

function parse_storage_gb($value): float {
    $v=trim(str_replace(',', '', strtolower((string)$value)));
    if ($v==='') return 0.0;
    if (!preg_match('/^([0-9]+(?:\.[0-9]+)?)\s*(tb|gb|mb)?$/i',$v,$m)) return 0.0;
    $n=(float)$m[1]; $unit=strtolower($m[2]??'gb');
    return match($unit){'tb'=>$n*1024,'mb'=>$n/1024,default=>$n};
}

function password_is_strong($password) {
    return is_string($password) && strlen($password) >= 10
        && preg_match('/[A-Z]/', $password)
        && preg_match('/[a-z]/', $password)
        && preg_match('/[0-9]/', $password);
}

function setting_value($db, $key, $fallback='') {
    if (!$db) return $fallback;
    try { $st=$db->prepare('SELECT setting_value FROM site_settings WHERE setting_key=? LIMIT 1'); $st->execute([$key]); $v=$st->fetchColumn(); return $v===false?$fallback:$v; } catch(Throwable $e){ return $fallback; }
}
function make_ticket_number($db) {
    $prefix='WDH-'.date('Ym').'-';
    for($i=0;$i<10;$i++){
        $n=$prefix.strtoupper(bin2hex(random_bytes(3)));
        try{$st=$db->prepare('SELECT id FROM support_tickets WHERE ticket_number=?');$st->execute([$n]);if(!$st->fetch())return $n;}catch(Throwable $e){break;}
    }
    return $prefix.time();
}
function ticket_statuses(){return ['open','pending','answered','resolved','closed'];}
function ticket_priorities(){return ['low','normal','high','urgent'];}
function ticket_categories(){return ['general','domain','hosting','vps_dedicated','business_email','security_backup','billing_payment'];}
function support_admin_email($db){return setting_value($db,'support_email','support@wdhdomain.com');}
