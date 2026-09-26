<?php
require_once __DIR__.'/../includes/bootstrap.php'; require_admin();
$checks=[];
$checks['PHP version']=PHP_VERSION;
$checks['OpenSSL']=extension_loaded('openssl')?'OK':'MISSING';
$checks['PDO MySQL']=extension_loaded('pdo_mysql')?'OK':'MISSING';
$checks['HTTPS']=(!empty($_SERVER['HTTPS'])&&$_SERVER['HTTPS']!=='off')?'OK':'WARNING';
$checks['APP_KEY']=function_exists('wdh_app_key')&&wdh_app_key()!==''?'OK':'ACTION REQUIRED';
$checks['Database']=$db?'CONNECTED':'UNAVAILABLE';
$checks['Writable cron logs']=is_writable(__DIR__)?'OK':'CHECK';
?><!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>System Health — WDH</title><link rel="stylesheet" href="../assets/css/style.css"><link rel="stylesheet" href="../assets/css/catalog.css"></head><body><?php require __DIR__.'/../includes/header.php';?><main class="admin-page"><div class="portal-welcome"><div><span class="eyebrow mint">PRODUCTION HEALTH</span><h1>System Health Check</h1><p>Quick administrator-only checks before production release.</p></div></div><section class="admin-section"><div class="admin-table"><?php foreach($checks as $k=>$v):?><div class="admin-row"><strong><?=e($k)?></strong><span><?=e($v)?></span></div><?php endforeach;?></div><p class="muted">This page does not expose database credentials or provider secrets. Remove or protect this tool if your deployment policy does not require it.</p></section></main><?php require __DIR__.'/../includes/footer.php';?></body></html>
