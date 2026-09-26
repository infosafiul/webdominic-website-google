<?php
require_once __DIR__.'/includes/bootstrap.php';
// Guest checkout: a first-time visitor can create the customer account during checkout.

$items=cart_items(); if(!$items) redirect('cart.php');
$error=''; $accountError=''; $currency=$items[0]['currency']; $total=cart_total(); $user=current_user();
if(count(array_unique(array_map(fn($x)=>$x['currency'],$items)))>1)$error='Please checkout items with the same currency together.';
if(is_post()&&!$error){
  verify_csrf();public_form_guard($db, 'checkout', $_POST['recaptcha_token'] ?? '');
  $method=$_POST['method']??'';
  if(!$db)$error='Database connection is not available.';
  elseif(!in_array($method,['balance','bkash','nagad','rocket','bank'],true))$error='Please choose a payment method.';
  else{
    try{
      $db->beginTransaction();
      // When not logged in, create the customer account in the same transaction as the order.
      if(!$user){
        $name=trim($_POST['account_name']??'');
        $email=trim(strtolower($_POST['account_email']??''));
        $pass=(string)($_POST['account_password']??'');
        $confirm=(string)($_POST['account_password_confirm']??'');
        if($name==='' || !filter_var($email,FILTER_VALIDATE_EMAIL)) throw new RuntimeException('Please enter a valid name and email address.');
        if(!password_is_strong($pass)) throw new RuntimeException('Password must be at least 10 characters and include uppercase, lowercase, and a number.');
        if($pass!==$confirm) throw new RuntimeException('Passwords do not match.');
        $check=$db->prepare('SELECT id FROM users WHERE email=? LIMIT 1');$check->execute([$email]);
        if($check->fetchColumn()) throw new RuntimeException('An account with this email already exists. Please login and continue checkout.');
        $ins=$db->prepare('INSERT INTO users(email,password_hash,full_name,role,account_balance) VALUES(?,?,?,"client",0)');
        $ins->execute([$email,password_hash($pass,PASSWORD_DEFAULT),$name]);
        $uid=(int)$db->lastInsertId();
        $user=['id'=>$uid,'email'=>$email,'full_name'=>$name,'role'=>'client','account_balance'=>0];
      } else {
        $uid=(int)$user['id'];
      }
      if($method==='balance'){
        if($currency!=='BDT') throw new RuntimeException('Account balance checkout is currently available for BDT orders only.');
        $st=$db->prepare('SELECT account_balance FROM users WHERE id=? FOR UPDATE');$st->execute([$uid]);$balance=(float)$st->fetchColumn();
        if($balance<$total) throw new RuntimeException('Insufficient account balance. Please add funds or choose another payment method.');
      }
      $orderNo='WDH-'.date('Ymd').'-'.strtoupper(bin2hex(random_bytes(3)));
      $st=$db->prepare('INSERT INTO orders(order_number,user_id,total,currency,status,fulfillment_status) VALUES(?,?,?,?,?,?)');$st->execute([$orderNo,$uid,$total,$currency,$method==='balance'?'paid':'pending',$method==='balance'?'ready_for_fulfillment':'awaiting_payment']);$orderId=(int)$db->lastInsertId();
      $itemSt=$db->prepare('INSERT INTO order_items(order_id,item_type,product_id,product_category,domain_name,description,unit_price,currency,billing_cycle,quantity) VALUES(?,?,?,?,?,?,?,?,?,?)');
      foreach($items as $ci)$itemSt->execute([$orderId,$ci['type'],$ci['product_id']??null,$ci['category']??($ci['type']??'service'),$ci['type']==='domain'?($ci['domain_name']??$ci['name']??null):null,$ci['name']??'Service',(float)$ci['price'],$ci['currency']??$currency,$ci['billing_cycle']??($ci['type']==='domain'?'yearly':'monthly'),1]);
      if($method==='balance'){
        $db->prepare('UPDATE users SET account_balance=account_balance-? WHERE id=?')->execute([$total,$uid]);
        $db->prepare('INSERT INTO balance_transactions(user_id,type,amount,reference,status) VALUES(?,?,?,?,?)')->execute([$uid,'order_debit',$total,'Order '.$orderNo,'approved']);
        $db->prepare('INSERT INTO payments(order_id,user_id,method,amount,currency,status) VALUES(?,?,?,?,?,?)')->execute([$orderId,$uid,$method,$total,$currency,'approved']);
      } else {
        $db->prepare('INSERT INTO payments(order_id,user_id,method,amount,currency,transaction_id,sender_number,status) VALUES(?,?,?,?,?,?,?,?)')->execute([$orderId,$uid,$method,$total,$currency,trim($_POST['transaction_id']??''),trim($_POST['sender_number']??''),'pending']);
      }
      $invoiceNo='INV-'.date('Ymd').'-'.strtoupper(bin2hex(random_bytes(3)));
      $invoiceStatus=$method==='balance'?'paid':'unpaid';
      $invoicePaid=$method==='balance'?'NOW()':'NULL';
      $db->prepare("INSERT INTO invoices(order_id,user_id,invoice_number,subtotal,tax,total,currency,status,paid_at) VALUES(?,?,?,?,?,?,?,?,$invoicePaid)")->execute([$orderId,$uid,$invoiceNo,$total,0,$total,$currency,$invoiceStatus]);
      $db->commit();
      if(!isset($_SESSION['wdh_user']) || (int)($_SESSION['wdh_user']['id']??0)!==$uid){ session_regenerate_id(true); $_SESSION['wdh_user']=$user; }
      // Paid orders enter the manual fulfillment/provisioning queue. External provider actions remain admin-controlled.
      if($method==='balance'){ try { queue_order_provisioning($db,$orderId); } catch(Throwable $queueError) { /* queue failure is visible to Admin via order status and can be retried */ } }
      $userNow=current_user();
      if($method==='balance') { wdh_customer_message($db,$userNow,'Payment received','Your order '.$orderNo.' has been paid from your WDH account balance and is now waiting for fulfillment.','order-details.php?order='.urlencode($orderNo),'payment_received',$orderId); } else { wdh_customer_message($db,$userNow,'Order received','Your order '.$orderNo.' was received. Your payment submission is pending administrator verification.','order-details.php?order='.urlencode($orderNo),'order_received',$orderId); }
      $_SESSION['wdh_cart']=[]; $_SESSION['wdh_last_order']=$orderNo; redirect('order-complete.php?order='.urlencode($orderNo));
    }catch(Throwable $e){if($db->inTransaction())$db->rollBack();$error=$e->getMessage();}
  }
}
?><!doctype html><html lang="<?=e($LANG)?>"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Checkout — WDH</title><link rel="stylesheet" href="assets/css/style.css?v=wdh-ui-v8"><link rel="stylesheet" href="assets/css/catalog.css?v=wdh-ui-v8"></head><body><?php require __DIR__.'/includes/header.php';?><main class="simple-page"><div class="breadcrumbs">Home › Cart › Checkout</div><h1>Secure Checkout</h1><div class="cart-layout"><section class="cart-card"><?php if($error):?><div class="alert error"><?=e($error)?></div><?php endif;?>
<?php if(!$user):?>
<div class="cart-card" style="margin-bottom:18px;background:#f7fbff;border:1px solid #dbeafe;box-shadow:none">
  <h2 style="margin-top:0">Create your WDH account</h2>
  <p class="muted">New to WDH? Create your account here and continue with this checkout. Your cart will stay with you.</p>
  <label>Full Name<input name="account_name" form="checkout-form" required autocomplete="name"></label>
  <label>Email<input type="email" name="account_email" form="checkout-form" required autocomplete="email"></label>
  <label>Password<input type="password" name="account_password" form="checkout-form" minlength="10" required autocomplete="new-password"></label>
  <label>Confirm Password<input type="password" name="account_password_confirm" form="checkout-form" minlength="10" required autocomplete="new-password"></label>
  <small class="muted">10+ characters with uppercase, lowercase and a number.</small>
  <p style="margin-bottom:0">Already have an account? <a href="login.php?return=checkout.php">Login first</a> and then continue checkout.</p>
</div>
<?php else:?>
<div class="cart-card" style="margin-bottom:18px;background:#f7fbff;border:1px solid #dbeafe;box-shadow:none"><strong>Checkout as <?=e($user['full_name']??$user['email'])?></strong><div class="muted"><?=e($user['email'])?></div></div>
<?php endif;?>
<h2>Payment Method</h2><label class="payment-option"><input type="radio" name="method" value="balance" form="checkout-form" required> Account Balance — <?=money((float)(current_user()['account_balance']??0),'BDT')?></label><label class="payment-option"><input type="radio" name="method" value="bkash" form="checkout-form"> bKash</label><label class="payment-option"><input type="radio" name="method" value="nagad" form="checkout-form"> Nagad</label><label class="payment-option"><input type="radio" name="method" value="rocket" form="checkout-form"> Rocket</label><label class="payment-option"><input type="radio" name="method" value="bank" form="checkout-form"> Bank Transfer</label><form id="checkout-form" method="post"><?=csrf_field()?><input type="text" name="website" value="" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true"><?=recaptcha_field('checkout')?><div class="payment-extra"><label>Transaction ID (if applicable)<input name="transaction_id" maxlength="120"></label><label>Sender Number (if applicable)<input name="sender_number" maxlength="40"></label></div><p class="muted">Manual payments remain pending until an administrator verifies the submitted transaction.</p><button class="btn primary">Place Order →</button></form></section><aside class="summary-card"><h2>Order Summary</h2><?php foreach($items as $item):?><div><?=e($item['name'])?><strong><?=money($item['price'],$item['currency'])?></strong></div><?php endforeach;?><hr><div class="total">Total <strong><?=money($total,$currency)?></strong></div></aside></div></main><?php require __DIR__.'/includes/footer.php';?></body></html>
