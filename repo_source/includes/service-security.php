<?php
function wdh_app_key(){
    global $config;
    $key=(string)($config['app_key']??'');
    return $key!=='' && strpos($key,'YOUR_')!==0 ? $key : '';
}
function wdh_encrypt_secret($plain){
    $key=wdh_app_key(); if($key==='' || $plain==='') return null;
    $key=hash('sha256',$key,true); $iv=random_bytes(12); $tag='';
    $cipher=openssl_encrypt($plain,'aes-256-gcm',$key,OPENSSL_RAW_DATA,$iv,$tag);
    return $cipher===false?null:base64_encode($iv.$tag.$cipher);
}
function wdh_decrypt_secret($encoded){
    $key=wdh_app_key(); if($key==='' || !$encoded) return '';
    $raw=base64_decode($encoded,true); if($raw===false || strlen($raw)<28) return '';
    $iv=substr($raw,0,12); $tag=substr($raw,12,16); $cipher=substr($raw,28); $key=hash('sha256',$key,true);
    $plain=openssl_decrypt($cipher,'aes-256-gcm',$key,OPENSSL_RAW_DATA,$iv,$tag);
    return $plain===false?'':$plain;
}
function wdh_mask_secret($value){
    $value=(string)$value; if($value==='') return 'Not provided';
    return str_repeat('•',max(8,min(16,strlen($value))));
}
