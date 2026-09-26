<?php
require_once __DIR__.'/includes/bootstrap.php';
if(current_user() && $db){record_login_activity($db,(int)current_user()['id'],'logout');}
$_SESSION=[];
if(ini_get('session.use_cookies')){ $p=session_get_cookie_params(); setcookie(session_name(),'',time()-42000,$p['path'],$p['domain'],$p['secure'],$p['httponly']); }
session_destroy();
redirect('index.php');
