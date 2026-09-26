<?php
require_once __DIR__.'/includes/bootstrap.php';
require_login();

$u=current_user();
$error='';
$prefService=(int)($_GET['service_id']??0);
$prefCat=$_GET['category']??'general';

function save_ticket_upload(PDO $db, int $ticketId, int $messageId, int $userId, array $f, string $role='client') {
    if(($f['error']??UPLOAD_ERR_NO_FILE)===UPLOAD_ERR_NO_FILE) return;
    if(($f['error']??UPLOAD_ERR_OK)!==UPLOAD_ERR_OK) throw new RuntimeException('Attachment upload failed.');
    if((int)$f['size']>5*1024*1024) throw new RuntimeException('Attachment must be 5 MB or smaller.');
    $allowed=['pdf'=>'application/pdf','png'=>'image/png','jpg'=>'image/jpeg','jpeg'=>'image/jpeg','webp'=>'image/webp','txt'=>'text/plain','zip'=>'application/zip'];
    $ext=strtolower(pathinfo($f['name'],PATHINFO_EXTENSION));
    $mime=(new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']);
    $ok=isset($allowed[$ext]) && ($mime===$allowed[$ext] || (in_array($ext,['jpg','jpeg'],true)&&$mime==='image/jpeg'));
    if(!$ok) throw new RuntimeException('Unsupported attachment type.');
    $stored=bin2hex(random_bytes(16)).'.'.$ext;
    $dir=__DIR__.'/uploads/tickets/';
    if(!is_dir($dir)&&!mkdir($dir,0750,true)) throw new RuntimeException('Could not create attachment storage.');
    $dest=$dir.$stored;
    if(!move_uploaded_file($f['tmp_name'],$dest)) throw new RuntimeException('Could not store attachment.');
    $db->prepare($role==='admin'
        ? 'INSERT INTO support_ticket_attachments(ticket_id,message_id,admin_id,original_name,stored_name,mime_type,file_size,sha256) VALUES(?,?,?,?,?,?,?,?)'
        : 'INSERT INTO support_ticket_attachments(ticket_id,message_id,user_id,original_name,stored_name,mime_type,file_size,sha256) VALUES(?,?,?,?,?,?,?,?)'
    )->execute([$ticketId,$messageId,$userId,substr($f['name'],0,255),$stored,$mime,(int)$f['size'],hash_file('sha256',$dest)]);
}

if(is_post()){
    verify_csrf();public_form_guard($db, 'support', $_POST['recaptcha_token'] ?? '');
    $subject=trim($_POST['subject']??'');
    $message=trim($_POST['message']??'');
    $cat=$_POST['category']??'general';
    $priority=$_POST['priority']??'normal';
    $serviceId=(int)($_POST['service_id']??0);
    $orderId=(int)($_POST['order_id']??0);
    if(!in_array($cat,ticket_categories(),true)) $cat='general';
    if(!in_array($priority,ticket_priorities(),true)) $priority='normal';
    try{
        if(!$db) throw new RuntimeException('Database unavailable.');
        if($subject===''||mb_strlen($subject)>200) throw new RuntimeException('Please enter a valid subject.');
        if($message==='') throw new RuntimeException('Please describe your issue.');
        if($serviceId){$s=$db->prepare('SELECT id FROM customer_services WHERE id=? AND user_id=?');$s->execute([$serviceId,$u['id']]);if(!$s->fetch()) throw new RuntimeException('Invalid service selected.');}
        if($orderId){$o=$db->prepare('SELECT id FROM orders WHERE id=? AND user_id=?');$o->execute([$orderId,$u['id']]);if(!$o->fetch()) throw new RuntimeException('Invalid order selected.');}
        $db->beginTransaction();
        $num=make_ticket_number($db);
        $db->prepare('INSERT INTO support_tickets(ticket_number,user_id,service_id,order_id,category,priority,subject,status) VALUES(?,?,?,?,?,?,?,?)')->execute([$num,$u['id'],$serviceId?:null,$orderId?:null,$cat,$priority,$subject,'open']);
        $tid=(int)$db->lastInsertId();
        $db->prepare('INSERT INTO support_ticket_messages(ticket_id,sender_user_id,sender_role,message) VALUES(?,?,?,?)')->execute([$tid,$u['id'],'client',$message]);
        $msgId=(int)$db->lastInsertId();
        if(isset($_FILES['attachment'])) save_ticket_upload($db,$tid,$msgId,$u['id'],$_FILES['attachment'],'client');
        $db->prepare('INSERT INTO support_ticket_events(ticket_id,actor_user_id,event_type,details) VALUES(?,?,?,?)')->execute([$tid,$u['id'],'ticket_created','Customer opened ticket']);
        $db->commit();
        $body="New support ticket $num\nCustomer: {$u['full_name']} <{$u['email']}>\nSubject: $subject\n\n$message";
        wdh_queue_email($db,support_admin_email($db),'New support ticket '.$num,$body,'support',null,$orderId?:null,$serviceId?:null);
        wdh_log_communication($db,$message,$subject,$u['id'],null,$orderId?:null,$serviceId?:null,'support','client');
        redirect('ticket.php?id='.$tid);
    }catch(Throwable $e){if($db&&$db->inTransaction())$db->rollBack();$error=$e->getMessage();}
}

$services=[];
if($db){$q=$db->prepare('SELECT id,service_name,domain_name,status FROM customer_services WHERE user_id=? ORDER BY id DESC');$q->execute([$u['id']]);$services=$q->fetchAll();}
$orders=[];
if($db){$q=$db->prepare('SELECT id,order_number,status,total,currency FROM orders WHERE user_id=? ORDER BY id DESC LIMIT 30');$q->execute([$u['id']]);$orders=$q->fetchAll();}
$tickets=[];
if($db){$q=$db->prepare('SELECT * FROM support_tickets WHERE user_id=? ORDER BY updated_at DESC LIMIT 20');$q->execute([$u['id']]);$tickets=$q->fetchAll();}
?>
<!doctype html><html lang="<?=e($LANG)?>"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Support — WDH</title><link rel="stylesheet" href="assets/css/style.css?v=wdh-ui-v8"><link rel="stylesheet" href="assets/css/catalog.css?v=wdh-ui-v8"></head><body>
<?php require __DIR__.'/includes/header.php';?>
<main class="portal-page"><div class="breadcrumbs">Home › Client Portal › Support</div><div class="portal-welcome"><div><span class="eyebrow mint">SUPPORT</span><h1>How can we help?</h1><p>Open a ticket and our support team will follow up.</p></div><a class="btn secondary" href="client.php">Dashboard</a></div>
<?php if($error):?><div class="alert error"><?=e($error)?></div><?php endif;?>
<section class="cart-card" style="max-width:900px"><div class="section-head"><span class="eyebrow mint">CREATE TICKET</span><h2>Tell us what you need</h2></div><form method="post" enctype="multipart/form-data"><?=csrf_field()?><input type="text" name="website" value="" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true"><?=recaptcha_field('support')?><div class="form-grid">
<label>Category<select name="category"><?php foreach(ticket_categories() as $c):?><option value="<?=e($c)?>" <?=($prefCat===$c)?'selected':''?>><?=e(ucwords(str_replace('_',' / ',$c)))?></option><?php endforeach;?></select></label>
<label>Priority<select name="priority"><?php foreach(ticket_priorities() as $p):?><option value="<?=e($p)?>"><?=e(ucfirst($p))?></option><?php endforeach;?></select></label>
<label>Related Service<select name="service_id"><option value="0">No specific service</option><?php foreach($services as $s):?><option value="<?=$s['id']?>" <?=((int)$prefService===(int)$s['id'])?'selected':''?>><?=e($s['service_name'].($s['domain_name']?' — '.$s['domain_name']:''))?></option><?php endforeach;?></select></label>
<label>Related Order<select name="order_id"><option value="0">No specific order</option><?php foreach($orders as $o):?><option value="<?=$o['id']?>"><?=e($o['order_number'].' — '.$o['status'])?></option><?php endforeach;?></select></label>
</div><label>Subject<input name="subject" maxlength="200" required></label><label>Message<textarea name="message" rows="8" required placeholder="Describe your problem, what you tried, and what you need from WDH."></textarea></label><label>Attachment (optional, max 5 MB)<input type="file" name="attachment" accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.zip"></label><button class="btn primary">Create Support Ticket →</button></form></section>
<section class="cart-card"><h2>Your Recent Tickets</h2><?php if(!$tickets):?><p class="muted">No tickets yet.</p><?php else:foreach($tickets as $t):?><div class="detail-line"><div><strong><?=e($t['ticket_number'])?></strong><span><?=e($t['subject'])?></span></div><span><?=e(ucfirst($t['status']))?></span><a class="btn secondary small" href="ticket.php?id=<?=$t['id']?>">Open</a></div><?php endforeach;endif;?></section>
</main><?php require __DIR__.'/includes/footer.php';?></body></html>
