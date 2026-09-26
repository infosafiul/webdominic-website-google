<?php
if(session_status()!==PHP_SESSION_ACTIVE){$__secure=!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS']!=='off';session_start(['cookie_httponly'=>true,'cookie_secure'=>$__secure,'cookie_samesite'=>'Lax','use_strict_mode'=>true]);}
$config = require __DIR__.'/../config.php';
require_once __DIR__.'/../db.php';
require_once __DIR__.'/../includes/functions.php';
require_once __DIR__.'/communications.php';
require_once __DIR__.'/notifications.php';
require_once __DIR__.'/../includes/icons.php';
require_once __DIR__.'/../includes/service-security.php';
require_once __DIR__.'/../includes/security.php';
require_once __DIR__.'/../includes/lang.php';

$__valid_langs = ['en','bn'];
if (isset($_GET['lang']) && in_array($_GET['lang'], $__valid_langs, true)) {
    $LANG = $_GET['lang'];
    setcookie('wdh_lang', $LANG, [
        'expires' => time()+60*60*24*365, 'path' => '/', 'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'httponly' => true, 'samesite' => 'Lax'
    ]);
} elseif (isset($_COOKIE['wdh_lang']) && in_array($_COOKIE['wdh_lang'], $__valid_langs, true)) {
    $LANG = $_COOKIE['wdh_lang'];
} else {
    $LANG = 'en';
}
$T = $i18n[$LANG];
function t($key) { global $T; return $T[$key] ?? $key; }
function lang_url($lang) { $q = $_GET; $q['lang'] = $lang; return '?'.http_build_query($q); }

$__valid_currencies = ['bdt','usd'];
if (isset($_GET['currency']) && in_array($_GET['currency'], $__valid_currencies, true)) {
    $__cur = $_GET['currency'];
    setcookie('wdh_currency', $__cur, [
        'expires' => time()+60*60*24*365, 'path' => '/', 'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'httponly' => true, 'samesite' => 'Lax'
    ]);
} elseif (isset($_COOKIE['wdh_currency']) && in_array($_COOKIE['wdh_currency'], $__valid_currencies, true)) {
    $__cur = $_COOKIE['wdh_currency'];
} else {
    $__cur = ($LANG === 'bn') ? 'bdt' : 'usd';
}
$CURRENCY = strtoupper($__cur);
function currency_url($currency) { $q = $_GET; $q['currency'] = strtolower($currency); return '?'.http_build_query($q); }
