<?php
require_once __DIR__.'/includes/bootstrap.php';
require_admin();
$notice=''; $error='';

if(is_post()){
  verify_csrf();
  $id=(int)($_POST['id']??0);
  $status=$_POST['status']??'pending';
  if(!in_array($status,['pending','paid','active','cancelled','refunded'],true)) $error='Invalid order status.';
  elseif(!$db) $error='Database unavailable.';
  else {
    try {
      $db->beginTransaction();
      $st=$db->prepare('SELECT * FROM orders WHERE id=? FOR UPDATE');
      $st->execute([$id]); $order=$st->fetch();
      if(!$order) throw new RuntimeException('Order not found.');

      // A service may only be activated after an approved payment exists.
      if($status==='active'){
        $pay=$db->prepare("SELECT id FROM payments WHERE order_id=? AND status='approved' ORDER BY id DESC LIMIT 1");
        $pay->execute([$id]);
        if(!$pay->fetch()) throw new RuntimeException('This order cannot be activated until an approved payment is recorded.');
      }

      // Do not silently downgrade a paid/active order to pending.
      if(in_array($order['status'],['paid','active'],true) && $status==='pending'){
        throw new RuntimeException('Paid or active orders cannot be moved back to pending.');
      }

      $fulfillment=$order['fulfillment_status'] ?? 'pending';
      if($status==='active') $fulfillment='completed';
      elseif($status==='cancelled') $fulfillment='cancelled';
      elseif($status==='refunded') $fulfillment='refunded';
      elseif($status==='paid') $fulfillment='ready_for_fulfillment';

      $st=$db->prepare('UPDATE orders SET status=?, fulfillment_status=? WHERE id=?');
      $st->execute([$status,$fulfillment,$id]);

      if($status==='paid'){
        queue_order_provisioning($db,$id);
      }

      if($status==='active'){
        queue_order_provisioning($db,$id);
        $st=$db->prepare('SELECT * FROM order_items WHERE order_id=? ORDER BY id');
        $st->execute([$id]);
        foreach($st->fetchAll() as $it){
          $type=$it['item_type']==='domain'?'domain':(in_array($it['item_type'],['hosting','server','email','security','service'],true)?$it['item_type']:'service');
          $domain=$it['domain_name']??null;
          $exists=$db->prepare('SELECT id FROM customer_services WHERE user_id=? AND service_name=? AND domain_name <=> ? LIMIT 1');
          $exists->execute([$order['user_id'],$it['description'],$domain]);
          if(!$exists->fetch()){
            $db->prepare('INSERT INTO customer_services(user_id,product_id,service_name,service_type,domain_name,status,renewal_price,renewal_currency,renewal_cycle,notes) VALUES(?,?,?,?,?,?,?,?,?,?)')
              ->execute([$order['user_id'],$it['product_id']?:null,$it['description'],$type,$domain,'active',$it['unit_price'],$it['currency'],$it['billing_cycle']?:'yearly','Created from Order '.$order['order_number'].'; login details can be configured by Admin.']);
            $newServiceId=(int)$db->lastInsertId();
            if($type==='domain'){
              $db->prepare('INSERT IGNORE INTO domain_services(customer_service_id,registrar_name,domain_lock) VALUES(?,?,1)')->execute([$newServiceId,'Manual Registrar']);
            }
          }
        }
      }
      $al=$db->prepare('INSERT INTO audit_log(admin_user_id,action,entity_type,entity_id,details_json) VALUES(?,?,?,?,?)');
      $al->execute([current_user()['id'],'order_status_updated','order',$id,json_encode(['from'=>$order['status'],'to'=>$status,'ip'=>$_SERVER['REMOTE_ADDR']??''],JSON_UNESCAPED_SLASHES)]);
      $db->commit();
      $notice='Order status updated successfully.'.($status==='active'?' Customer service records were created where needed.':'');
    } catch(Throwable $e){ if($db->inTransaction()) $db->rollBack(); $error=$e->getMessage(); }
  }
}
$rows=$db?$db->query('SELECT o.*,u.full_name,u.email,(SELECT COUNT(*) FROM payments p WHERE p.order_id=o.id AND p.status="approved") AS approved_payments FROM orders o LEFT JOIN users u ON u.id=o.user_id ORDER BY o.id DESC')->fetchAll():[];
?><!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Admin Orders — WDH</title><link rel="stylesheet" href="assets/css/style.css?v=wdh-ui-v8"><link rel="stylesheet" href="assets/css/catalog.css?v=wdh-ui-v8"></head><body><?php require __DIR__.'/includes/header.php';?><main class="admin-page"><div class="portal-welcome"><div><span class="eyebrow mint">ADMIN</span><h1>Orders</h1><p>Review orders and move paid orders into fulfillment safely.</p></div><a class="btn secondary" href="admin.php">Pricing</a></div><?php if($notice):?><div class="alert success-alert"><?=e($notice)?></div><?php endif;?><?php if($error):?><div class="alert error"><?=e($error)?></div><?php endif;?><div class="admin-table"><?php if(!$rows):?><div class="empty">No orders yet.</div><?php else:foreach($rows as $r):?><form method="post" class="admin-row"><?=csrf_field()?><input type="hidden" name="id" value="<?=$r['id']?>"><div><strong><?=e($r['order_number'])?></strong><small><?=e($r['full_name']??'Guest')?> · <?=e($r['email']??'')?> · Approved payments: <?=e($r['approved_payments'])?></small></div><span><?=money($r['total'],$r['currency'])?></span><select name="status"><option value="pending" <?=$r['status']==='pending'?'selected':''?>>pending</option><option value="paid" <?=$r['status']==='paid'?'selected':''?>>paid</option><option value="active" <?=$r['status']==='active'?'selected':''?>>active</option><option value="cancelled" <?=$r['status']==='cancelled'?'selected':''?>>cancelled</option><option value="refunded" <?=$r['status']==='refunded'?'selected':''?>>refunded</option></select><a class="btn secondary small" href="order-details.php?order=<?=urlencode($r['order_number'])?>">View</a><button class="btn primary small">Update</button></form><?php endforeach;endif;?></div></main><?php require __DIR__.'/includes/footer.php';?></body></html>
