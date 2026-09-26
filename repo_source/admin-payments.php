<?php
require_once __DIR__.'/includes/bootstrap.php';
require_admin();
$notice=''; $error='';
if(is_post()){
  verify_csrf(); $id=(int)($_POST['id']??0); $status=$_POST['status']??'pending';
  if(!in_array($status,['pending','approved','rejected'],true)) $error='Invalid payment status.';
  elseif(!$db) $error='Database unavailable.';
  else try{
    $db->beginTransaction();
    $st=$db->prepare('SELECT * FROM payments WHERE id=? FOR UPDATE'); $st->execute([$id]); $p=$st->fetch();
    if(!$p) throw new RuntimeException('Payment not found.');
    $old=$p['status'];
    if($old==='approved' && $status==='approved') throw new RuntimeException('Payment is already approved.');
    $db->prepare('UPDATE payments SET status=? WHERE id=?')->execute([$status,$id]);
    if($status==='approved'){
      $db->prepare("UPDATE orders SET status='paid', fulfillment_status='ready_for_fulfillment' WHERE id=? AND status NOT IN ('cancelled','refunded')")->execute([$p['order_id']]);
      $db->prepare("UPDATE invoices SET status='paid', paid_at=NOW() WHERE order_id=?")->execute([$p['order_id']]);
      queue_order_provisioning($db,(int)$p['order_id']);
      $us=$db->prepare('SELECT * FROM users WHERE id=?');$us->execute([$p['user_id']]);
      if($uu=$us->fetch()) wdh_customer_message($db,$uu,'Payment confirmed','Your payment for order '.$p['order_id'].' has been verified. Your order is now ready for fulfillment.','my-orders.php','payment_confirmed',(int)$p['order_id']);
    } elseif($status==='rejected'){
      $db->prepare("UPDATE invoices SET status='unpaid', paid_at=NULL WHERE order_id=? AND status<>'paid'")->execute([$p['order_id']]);
      $us=$db->prepare('SELECT * FROM users WHERE id=?');$us->execute([$p['user_id']]);
      if($uu=$us->fetch()) wdh_customer_message($db,$uu,'Payment needs attention','Your payment submission for order '.$p['order_id'].' could not be approved. Please contact WDH support or submit the correct payment details.','my-orders.php','payment_rejected',(int)$p['order_id']);
    }
    $al=$db->prepare('INSERT INTO audit_log(admin_user_id,action,entity_type,entity_id,details_json) VALUES(?,?,?,?,?)');
    $al->execute([current_user()['id'],'payment_status_updated','payment',$id,json_encode(['from'=>$old,'to'=>$status,'ip'=>$_SERVER['REMOTE_ADDR']??''],JSON_UNESCAPED_SLASHES)]);
    $db->commit(); $notice='Payment updated successfully.';
  }catch(Throwable $e){if($db->inTransaction())$db->rollBack();$error=$e->getMessage();}
}
$rows=$db?$db->query('SELECT p.*,o.order_number,u.full_name,u.email FROM payments p LEFT JOIN orders o ON o.id=p.order_id LEFT JOIN users u ON u.id=p.user_id ORDER BY p.id DESC')->fetchAll():[];
?><!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Admin Payments — WDH</title><link rel="stylesheet" href="assets/css/style.css?v=wdh-ui-v8"><link rel="stylesheet" href="assets/css/catalog.css?v=wdh-ui-v8"></head><body><?php require __DIR__.'/includes/header.php';?><main class="admin-page"><div class="portal-welcome"><div><span class="eyebrow mint">ADMIN</span><h1>Payments</h1><p>Verify customer payment submissions with protected state transitions.</p></div></div><?php if($notice):?><div class="alert success-alert"><?=e($notice)?></div><?php endif;?><?php if($error):?><div class="alert error"><?=e($error)?></div><?php endif;?><div class="admin-table"><?php if(!$rows):?><div class="empty">No payments yet.</div><?php else:foreach($rows as $r):?><form method="post" class="admin-row"><?=csrf_field()?><input type="hidden" name="id" value="<?=$r['id']?>"><div><strong><?=e($r['order_number']??'')?></strong><small><?=e($r['full_name']??'')?> · <?=e($r['method'])?></small></div><span><?=money($r['amount'],$r['currency']??'BDT')?></span><small><?=e($r['transaction_id']??'')?> <?=e($r['sender_number']??'')?></small><select name="status"><option value="pending" <?=$r['status']==='pending'?'selected':''?>>pending</option><option value="approved" <?=$r['status']==='approved'?'selected':''?>>approved</option><option value="rejected" <?=$r['status']==='rejected'?'selected':''?>>rejected</option></select><button class="btn primary small">Save</button></form><?php endforeach;endif;?></div></main><?php require __DIR__.'/includes/footer.php';?></body></html>
