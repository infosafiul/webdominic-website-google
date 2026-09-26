<?php
function security_client_ip(){ return substr((string)($_SERVER['REMOTE_ADDR']??''),0,45); }
function auth_rate_limited($db,$identifier){
 if(!$db)return false; $identifier=strtolower(trim((string)$identifier)); if($identifier==='')return false;
 try{$s=$db->prepare('SELECT * FROM auth_rate_limits WHERE identifier=? LIMIT 1');$s->execute([$identifier]);$r=$s->fetch(); if(!$r)return false; $now=time(); if(!empty($r['blocked_until']) && strtotime($r['blocked_until'])>$now)return true; if(strtotime($r['window_started_at']) < $now-900){$db->prepare('DELETE FROM auth_rate_limits WHERE identifier=?')->execute([$identifier]);return false;} return (int)$r['attempts']>=8;}catch(Throwable $e){return false;}
}
function auth_rate_record_failure($db,$identifier){
 if(!$db)return; $identifier=strtolower(trim((string)$identifier)); if($identifier==='')return; $ip=security_client_ip(); try{$s=$db->prepare('SELECT * FROM auth_rate_limits WHERE identifier=? LIMIT 1');$s->execute([$identifier]);$r=$s->fetch(); if(!$r){$st=$db->prepare('INSERT INTO auth_rate_limits(identifier,ip_address,attempts,window_started_at) VALUES(?,?,1,NOW())');$st->execute([$identifier,$ip]);return;} $start=strtotime($r['window_started_at']); if($start<time()-900){$st=$db->prepare('UPDATE auth_rate_limits SET attempts=1,ip_address=?,window_started_at=NOW(),blocked_until=NULL WHERE identifier=?');$st->execute([$ip,$identifier]);return;} $attempts=(int)$r['attempts']+1; $blocked=$attempts>=8?date('Y-m-d H:i:s',time()+900):null; $st=$db->prepare('UPDATE auth_rate_limits SET attempts=?,ip_address=?,blocked_until=? WHERE identifier=?');$st->execute([$attempts,$ip,$blocked,$identifier]);}catch(Throwable $e){}
}
function auth_rate_clear($db,$identifier){if(!$db)return;try{$db->prepare('DELETE FROM auth_rate_limits WHERE identifier=?')->execute([strtolower(trim((string)$identifier))]);}catch(Throwable $e){}}

/**
 * Optional Google reCAPTCHA v3 integration.
 * It is disabled until a valid site key + secret key are configured.
 * Site key is safe for browser use; secret key is server-side only.
 */
function recaptcha_config(): array {
    global $config;
    $r = $config['recaptcha'] ?? [];
    $enabled = !empty($r['enabled']);
    $site = trim((string)($r['site_key'] ?? ''));
    $secret = trim((string)($r['secret_key'] ?? ''));
    if ($site === '' || $secret === '' || preg_match('/^YOUR_/i', $site) || preg_match('/^YOUR_/i', $secret)) {
        $enabled = false;
    }
    return [
        'enabled' => $enabled,
        'site_key' => $site,
        'secret_key' => $secret,
        'min_score' => max(0.1, min(0.9, (float)($r['min_score'] ?? 0.5))),
    ];
}

function recaptcha_field(string $action): string {
    $c = recaptcha_config();
    if (!$c['enabled']) return '<input type="hidden" name="recaptcha_token" value="">';
    $action = preg_replace('/[^A-Za-z0-9_\-]/', '', $action) ?: 'submit';
    $site = htmlspecialchars($c['site_key'], ENT_QUOTES, 'UTF-8');
    return '<input type="hidden" name="recaptcha_token" id="recaptcha_token_'.htmlspecialchars($action,ENT_QUOTES,'UTF-8').'" value="">'
        .'<script src="https://www.google.com/recaptcha/api.js?render='.$site.'" async defer></script>'
        .'<script>(function(){function run(){if(!window.grecaptcha)return;grecaptcha.ready(function(){grecaptcha.execute(\''.$site.'\',{action:\''.$action.'\'}).then(function(t){var e=document.getElementById(\'recaptcha_token_'.addslashes($action).'\');if(e)e.value=t;});});} if(document.readyState===\'loading\')document.addEventListener(\'DOMContentLoaded\',run);else run();})();</script>';
}

function verify_recaptcha(string $action, ?string $token): bool {
    $c = recaptcha_config();
    if (!$c['enabled']) return true;
    $token = trim((string)$token);
    if ($token === '' || strlen($token) > 4096) return false;
    $ch = curl_init('https://www.google.com/recaptcha/api/siteverify');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query(['secret'=>$c['secret_key'],'response'=>$token,'remoteip'=>security_client_ip()], '', '&', PHP_QUERY_RFC3986),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 4,
        CURLOPT_TIMEOUT => 8,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
    ]);
    $body = curl_exec($ch);
    $ok = $body !== false && curl_errno($ch) === 0;
    curl_close($ch);
    if (!$ok) return false;
    $data = json_decode($body, true);
    if (!is_array($data) || empty($data['success'])) return false;
    $score = isset($data['score']) ? (float)$data['score'] : 0.0;
    $returnedAction = (string)($data['action'] ?? '');
    return hash_equals($action, $returnedAction) && $score >= $c['min_score'];
}

function public_form_guard(?PDO $db = null, string $action = 'submit', string $token = ''): void {
    if (is_post() && trim((string)($_POST['website'] ?? '')) !== '') {
        http_response_code(403);
        exit('Security verification failed.');
    }
    if (is_post() && !verify_recaptcha($action, $token)) {
        http_response_code(403);
        exit('Security verification failed. Please try again.');
    }
}
