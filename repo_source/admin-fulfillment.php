<?php
require_once __DIR__.'/includes/bootstrap.php'; require_admin();
$notice=''; $error='';
if(is_post()){
 verify_csrf();
 try{
  if(!$db) throw new RuntimeException('Database unavailable.');
  $id=(int)($_POST['order_id']??0); $action=$_POST['action']??'';
  $note=trim($_POST['note']??'');
  $delivery=trim($_POST['expected_delivery']??'');
  $db->beginTransaction();
  $st=$db->prepare('SELECT * FROM orders WHERE id=? FOR UPDATE'); $st->execute([$id]); $order=$st->fetch();
  if(!$order) throw new RuntimeException('Order not found.');
  if($action==='start'){
   if(!in_array($order['status'],['paid','active'],true)) throw new RuntimeException('Only paid orders can enter fulfillment.');
   $db->prepare("UPDATE orders SET fulfillment_status='in_progress',fulfillment_note=?,expected_delivery=?,fulfillment_started_at=COALESCE(fulfillment_started_at,NOW()) WHERE id=?")->execute([$note,$delivery,$id]);
   if($note!=='') $db->prepare('INSERT INTO fulfillment_notes(order_id,admin_user_id,note_text) VALUES(?,?,?)')->execute([$id,current_user()['id'],$note]);
   $notice='Fulfillment started.';
  } elseif($action==='ready'){
   if(!in_array($order['status'],['paid','active'],true)) throw new RuntimeException('Order must be paid before it can be completed.');
   $db->prepare("UPDATE orders SET status='active',fulfillment_status='completed',fulfillment_note=?,expected_delivery=?,fulfillment_completed_at=NOW() WHERE id=?")->execute([$note,$delivery,$id]);
   $db->prepare("UPDATE provisioning_jobs SET status='completed',provider_purchase_status=CASE WHEN provider_purchase_status='not_started' THEN 'recorded' ELSE provider_purchase_status END,ready_at=NOW(),fulfillment_note=? WHERE order_id=? AND status NOT IN ('cancelled')")->execute([$note,$id]);
   if($note!=='') $db->prepare('INSERT INTO fulfillment_notes(order_id,admin_user_id,note_type,note_text) VALUES(?,?,?,?)')->execute([$id,current_user()['id'],'completion',$note]);
   $notice='Order marked ready/active. Customer service records can now be completed in Manage Services.';
  } elseif($action==='hold'){
   $db->prepare("UPDATE orders SET fulfillment_status='on_hold',fulfillment_note=? WHERE id=?")->execute([$note,$id]);
   if($note!=='') $db->prepare('INSERT INTO fulfillment_notes(order_id,admin_user_id,note_type,note_text) VALUES(?,?,?,?)')->execute([$id,current_user()['id'],'hold',$note]);
   $notice='Order placed on hold.';
  } elseif($action==='resume'){
   $db->prepare("UPDATE orders SET fulfillment_status='in_progress',fulfillment_note=? WHERE id=?")->execute([$note,$id]);
   $notice='Fulfillment resumed.';
  } else throw new RuntimeException('Invalid fulfillment action.');
  $db->commit();
  $us=$db->prepare('SELECT * FROM users WHERE id=?');$us->execute([$order['user_id']]);$uu=$us->fetch();

  if($uu){ if($action==='start') wdh_customer_message($db,$uu,'Order fulfillment started','Your order '.$order['order_number'].' is now being prepared. We are working on your service setup.','order-details.php?order='.urlencode($order['order_number']),'fulfillment_started',(int)$order['id']); elseif($action==='hold') wdh_customer_message($db,$uu,'Order temporarily on hold','Your order '.$order['order_number'].' is temporarily on hold. WDH will continue the setup once the required step is resolved.','order-details.php?order='.urlencode($order['order_number']),'fulfillment_hold',(int)$order['id']); elseif($action==='resume') wdh_customer_message($db,$uu,'Order fulfillment resumed','Your order '.$order['order_number'].' is back in fulfillment.','order-details.php?order='.urlencode($order['order_number']),'fulfillment_resumed',(int)$order['id']); elseif($action==='ready') wdh_customer_message($db,$uu,'Order ready','Your order '.$order['order_number'].' has been completed and marked ready/active. Please check your WDH Client Portal for service access details.','order-details.php?order='.urlencode($order['order_number']),'fulfillment_completed',(int)$order['id']); }
 }catch(Throwable $e){ if($db&&$db->inTransaction())$db->rollBack(); $error=$e->getMessage(); }
}
$rows=$db?$db->query("SELECT o.*,u.full_name,u.email,(SELECT COUNT(*) FROM provisioning_jobs pj WHERE pj.order_id=o.id) jobs,(SELECT COUNT(*) FROM customer_services cs WHERE cs.user_id=o.user_id AND cs.created_at>=o.created_at) services_created FROM orders o LEFT JOIN users u ON u.id=o.user_id WHERE o.status IN ('paid','active') AND o.fulfillment_status NOT IN ('completed','cancelled','refunded') ORDER BY o.id DESC")->fetchAll():[];
?><!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Manual Fulfillment — WDH Admin</title><link rel="stylesheet" href="assets/css/style.css?v=wdh-ui-v8"><link rel="stylesheet" href="assets/css/catalog.css?v=wdh-ui-v8"></head><body><?php require __DIR__.'/includes/header.php';?><main class="admin-page"><div class="portal-welcome"><div><span class="eyebrow mint">MANUAL OPERATIONS</span><h1>Fulfillment Center</h1><p>Paid VPS, Dedicated, Hosting and other orders are fulfilled manually. Provider details remain internal.</p></div><div class="actions"><a class="btn secondary" href="admin-provisioning.php">Provisioning Queue</a><a class="btn secondary" href="admin-orders.php">Orders</a></div></div><?php if($notice):?><div class="alert success-alert"><?=e($notice)?></div><?php endif;?><?php if($error):?><div class="alert error"><?=e($error)?></div><?php endif;?><div class="admin-table"><?php if(!$rows):?><div class="empty">No paid orders are waiting for manual fulfillment.</div><?php else:foreach($rows as $r):?><div class="admin-row" style="display:block"><div style="display:flex;justify-content:space-between;gap:20px;align-items:flex-start"><div><strong><?=e($r['order_number'])?></strong><small><?=e($r['full_name']??'Customer')?> · <?=e($r['email']??'')?> · <?=money($r['total'],$r['currency'])?></small></div><span class="badge"><?=e(str_replace('_',' ',ucfirst($r['fulfillment_status'])))?></span></div><div style="margin-top:12px"><small>Expected delivery: <?=e($r['expected_delivery']??'Not set')?> · Jobs: <?=e($r['jobs'])?></small></div><form method="post" style="margin-top:12px"><?=csrf_field()?><input type="hidden" name="order_id" value="<?=$r['id']?>"><div class="form-grid"><label>Expected delivery<input name="expected_delivery" value="<?=e($r['expected_delivery']??'')?>" placeholder="3–5 hours / 5–12 hours / 1–2 business days"></label><label>Internal fulfillment note<input name="note" value="<?=e($r['fulfillment_note']??'')?>" placeholder="Provider/package/purchase/configuration note"></label></div><div class="actions"><button class="btn primary" name="action" value="start">Start Fulfillment</button><button class="btn secondary" name="action" value="hold">Put On Hold</button><?php if($r['fulfillment_status']==='on_hold'):?><button class="btn secondary" name="action" value="resume">Resume</button><?php endif;?><button class="btn primary" name="action" value="ready">Mark Ready / Active</button><a class="btn secondary" href="order-details.php?order=<?=urlencode($r['order_number'])?>">View Order</a></div></form></div><?php endforeach;endif;?></div></main><?php require __DIR__.'/includes/footer.php';?></body></html>
