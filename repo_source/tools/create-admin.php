<?php
// CLI helper for first-time fresh deployment. Run from SSH:
// php tools/create-admin.php
if (PHP_SAPI !== 'cli') { http_response_code(403); exit('CLI only.'); }
$config = require __DIR__.'/../config.php';
if (($config['app_key'] ?? '') === 'YOUR_LONG_RANDOM_APP_KEY' || trim((string)($config['app_key'] ?? '')) === '') {
    fwrite(STDERR, "Set a real app_key in config.php before creating the first admin.\n"); exit(1);
}
require __DIR__.'/../db.php';
if (!$db) { fwrite(STDERR, "Database connection failed. Check config.php.\n"); exit(1); }
$ask=function(string $label): string { $v=trim((string)readline($label)); return $v; };
$name=$ask('Admin full name: '); $email=strtolower($ask('Admin email: ')); $pass=$ask('Admin password: ');
if($name===''||!filter_var($email,FILTER_VALIDATE_EMAIL)){fwrite(STDERR,"Invalid name/email.\n");exit(1);} 
if(strlen($pass)<10||!preg_match('/[A-Z]/',$pass)||!preg_match('/[a-z]/',$pass)||!preg_match('/[0-9]/',$pass)){fwrite(STDERR,"Password must be 10+ chars and include upper/lowercase and a number.\n");exit(1);} 
$st=$db->prepare('SELECT id FROM users WHERE email=? LIMIT 1');$st->execute([$email]);if($st->fetchColumn()){fwrite(STDERR,"An account with this email already exists.\n");exit(1);} 
$st=$db->prepare('INSERT INTO users(email,password_hash,full_name,role,account_balance) VALUES(?,?,?,?,0)');$st->execute([$email,password_hash($pass,PASSWORD_DEFAULT),$name,'admin']);
fwrite(STDOUT,"Admin account created successfully.\n");
