<?php
return [
 'base_url' => 'https://YOUR-NEW-DOMAIN.com',
 'app_key' => 'YOUR_LONG_RANDOM_APP_KEY',
 'db'=>[
  'host'=>'localhost',
  'name'=>'webdominom_mvp-db',
  'user'=>'YOUR_DB_USER',
  'pass'=>'YOUR_DB_PASSWORD',
  'charset'=>'utf8mb4'
 ],
 'payments'=>[
  'bkash_send'=>'YOUR_BKASH_SEND_NUMBER',
  'bkash_merchant'=>'YOUR_BKASH_MERCHANT_NUMBER',
  'nagad'=>'YOUR_NAGAD_NUMBER',
  'rocket'=>'YOUR_ROCKET_NUMBER',
  'upay'=>'YOUR_UPAY_NUMBER',
  'bank'=>'YOUR_BANK_DETAILS',
  'taptap'=>'Taptap Send — payment instructions will be configured here'
 ],
 'funds'=>['min'=>500,'max'=>200000],
 'recaptcha'=>[
  'enabled'=>false,
  'site_key'=>'YOUR_RECAPTCHA_SITE_KEY',
  'secret_key'=>'YOUR_RECAPTCHA_SECRET_KEY',
  'min_score'=>0.5,
 ]
];