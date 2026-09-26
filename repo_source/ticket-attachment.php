<?php
require_once __DIR__.'/includes/bootstrap.php';
require_login();
$id=(int)($_GET['id']??0);$u=current_user();
$st=$db->prepare('SELECT a.*,t.user_id FROM support_ticket_attachments a JOIN support_tickets t ON t.id=a.ticket_id WHERE a.id=? LIMIT 1');$st->execute([$id]);$a=$st->fetch();
if(!$a){http_response_code(404);exit('Attachment not found.');}
if(($u['role']??'')!=='admin' && (int)$a['user_id']!==(int)$u['id']){http_response_code(403);exit('Forbidden');}
$path=__DIR__.'/uploads/tickets/'.$a['stored_name'];if(!is_file($path)){http_response_code(404);exit('File missing.');}
header('Content-Type: '.($a['mime_type']?:'application/octet-stream'));header('Content-Length: '.filesize($path));header('Content-Disposition: attachment; filename="'.str_replace('"','',$a['original_name']).'"');readfile($path);exit;
