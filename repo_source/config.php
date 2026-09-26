<?php
return [
    'base_url' => 'https://webdominic.com/',
    'app_key' => '83120212d020e3bf476d61584aee1096c3b1cc3d5359c4f31328ece6cf39d025',
    
    'db' => [
        'host'    => 'localhost',
        'name'    => 'webdominco_bldv6-db',
        'user'    => 'webdominco_bldv6-usr',
        'pass'    => '3W42@{f?-0t=[XgC',
        'charset' => 'utf8mb4'
    ],

    'payments' => [
        'bkash_send'     => '01841440202',
        'bkash_merchant' => '01840100720',
        'nagad'          => '01840100720',
        'rocket'         => 'YOUR_ROCKET_NUMBER',
        'upay'           => 'YOUR_UPAY_NUMBER',
        'bank'           => 'YOUR_BANK_DETAILS',
        'taptap'         => 'Taptap Send — payment instructions will be configured here'
    ],

    'funds' => [
        'min' => 500,
        'max' => 200000
    ],

    'recaptcha' => [
        'enabled'    => false,
        'site_key'   => 'YOUR_RECAPTCHA_SITE_KEY',
        'secret_key' => 'YOUR_RECAPTCHA_SECRET_KEY',
        'min_score'  => 0.5,
    ],

    // ডোমেইন সার্চ ও ResellerClub API কনফিগারেশন
    'registrar' => [
        'provider'    => 'resellerclub',
        'environment' => 'production',
        'reseller_id' => '40618',              // এখানে আপনার Reseller ID বসাবেন
        'api_key'     => '3FyqJ0AFxkYc3cpak0ZNQzHbpsLvBVnG',   // এখানে আপনার ResellerClub API Key বসাবেন
        'server_ip'   => '205.209.96.147',      // আপনার সার্ভারের IP Address
        'timeout'     => 10
    ]
];