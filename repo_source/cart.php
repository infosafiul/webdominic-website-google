<?php
require_once __DIR__.'/includes/bootstrap.php';

function wdh_cart_json($ok, $message = null, $httpCode = 200) {
    http_response_code($httpCode);
    header('Content-Type: application/json');
    $items = cart_items();
    $total = cart_total();
    $currency = $items[0]['currency'] ?? 'BDT';
    echo json_encode([
        'ok' => $ok,
        'message' => $message,
        'count' => count($items),
        'currency' => $currency,
        'subtotal' => $total,
        'vat' => 0,
        'total' => $total,
        'items' => array_map(function ($idx, $item) {
            return [
                'index' => $idx,
                'name' => $item['name'] ?? '',
                'type' => $item['type'] ?? '',
                'billing_cycle' => $item['billing_cycle'] ?? '',
                'price' => (float)($item['price'] ?? 0),
                'original_price' => isset($item['original_price']) ? (float)$item['original_price'] : null,
                'bundle_discount_applied' => !empty($item['bundle_discount_applied']),
                'currency' => $item['currency'] ?? 'BDT',
            ];
        }, array_keys($items), $items),
    ]);
    exit;
}

if(is_post()){
  verify_csrf(); $a=$_POST['action']??'';
  $isAjax = ($_POST['ajax'] ?? '') === '1';

  if($a==='remove'){
    remove_cart((int)$_POST['index']);
    if ($isAjax) wdh_cart_json(true);
    redirect('cart.php');
  }
  if($a==='clear'){
    $_SESSION['wdh_cart']=[];
    if ($isAjax) wdh_cart_json(true);
    redirect('cart.php');
  }
  if($a==='add'){
    if(!$db){
      if ($isAjax) wdh_cart_json(false, 'Catalog database is unavailable.', 503);
      http_response_code(503);exit('Catalog database is unavailable.');
    }
    $type=$_POST['type']??'';
    if($type==='domain'){
      $name=domain_query_normalize($_POST['name']??''); $parts=explode('.',$name,2); $sld=$parts[0]??''; $tld=isset($parts[1])?'.'.$parts[1]:'';
      $st=$db->prepare('SELECT * FROM domain_pricing WHERE tld=? AND active=1');$st->execute([$tld]);$p=$st->fetch();
      if(!$p||!domain_is_valid($sld)){
        if ($isAjax) wdh_cart_json(false, 'Invalid domain selection.', 400);
        http_response_code(400);exit('Invalid domain selection.');
      }
      $fullDomain = $sld.$p['tld'];
      $existing=cart_items();
      $alreadyInCart = false;
      foreach ($existing as $__item) {
        if (($__item['type'] ?? '') === 'domain' && strtolower((string)($__item['name'] ?? '')) === strtolower($fullDomain)) {
          $alreadyInCart = true;
          break;
        }
      }
      if ($alreadyInCart) {
        // Idempotent: same domain submitted more than once (e.g. a fast
        // double-click) shouldn't add a second copy — just report success
        // with the cart as it already stands.
        if ($isAjax) wdh_cart_json(true, 'This domain is already in your cart.');
        redirect('cart.php');
      }
      $availability = registrar_check_availability($sld, $p['tld']);
      if(($availability['available'] ?? false) !== true){
        if ($isAjax) wdh_cart_json(false, 'This domain is not currently available. Please search again.', 409);
        http_response_code(409);
        exit('This domain is not currently available. Please search again.');
      }
      if($existing && (($existing[0]['currency']??'') !== $p['currency'])){
        if ($isAjax) wdh_cart_json(false, 'You cannot mix BDT and USD items in the same order. Please checkout the current cart first.', 409);
        http_response_code(409); exit('You cannot mix BDT and USD items in the same order. Please checkout the current cart first.');
      }
      add_cart(['type'=>'domain','category'=>'domain','name'=>$fullDomain,'price'=>(float)$p['registration_price'],'currency'=>$p['currency'],'billing_cycle'=>'yearly','domain_name'=>$fullDomain,'availability_status'=>$availability['status'],'hosting_bundle_price'=>isset($p['hosting_bundle_price'])&&$p['hosting_bundle_price']!==null?(float)$p['hosting_bundle_price']:null,'hosting_website_bundle_price'=>isset($p['hosting_website_bundle_price'])&&$p['hosting_website_bundle_price']!==null?(float)$p['hosting_website_bundle_price']:null]);
    } elseif($type==='product') {
      $id=(int)($_POST['product_id']??0);$cycle=($_POST['billing_cycle']??'monthly')==='yearly'?'yearly':'monthly';
      $st=$db->prepare('SELECT * FROM products WHERE id=? AND active=1');$st->execute([$id]);$p=$st->fetch();
      if(!$p){
        if ($isAjax) wdh_cart_json(false, 'Product not found.', 404);
        http_response_code(404);exit('Product not found.');
      }
      $price=$cycle==='yearly'?(float)$p['yearly_price']:(float)$p['monthly_price'];
      $existing=cart_items();
      if($existing && (($existing[0]['currency']??'') !== $p['currency'])){
        if ($isAjax) wdh_cart_json(false, 'You cannot mix BDT and USD items in the same order. Please checkout the current cart first.', 409);
        http_response_code(409); exit('You cannot mix BDT and USD items in the same order. Please checkout the current cart first.');
      }
      add_cart(['type'=>'product','product_id'=>$p['id'],'category'=>$p['category'],'name'=>$p['name'],'price'=>$price,'currency'=>$p['currency'],'billing_cycle'=>$cycle]);
    } else {
      if ($isAjax) wdh_cart_json(false, 'Invalid cart item.', 400);
      http_response_code(400);exit('Invalid cart item.');
    }
    if ($isAjax) wdh_cart_json(true);
    redirect('cart.php');
  }
}
$items=cart_items();$total=cart_total();$currency=$items[0]['currency']??'BDT';
?><!doctype html><html lang="<?=e($LANG)?>"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Shopping Cart — WDH</title><link rel="stylesheet" href="assets/css/style.css?v=wdh-ui-v8"><link rel="stylesheet" href="assets/css/catalog.css?v=wdh-ui-v8"></head><body><?php require __DIR__.'/includes/header.php';?><main class="simple-page"><div class="breadcrumbs">Home › Cart</div><h1>Your Shopping Cart</h1><p>Review your selected WDH services before checkout.</p><div class="cart-layout"><section class="cart-card"><?php if(!$items):?><div class="empty"><h2>Your cart is empty</h2><a class="btn primary" href="domains.php">Search a Domain</a></div><?php else:foreach($items as $i=>$item):?><div class="cart-row"><div><strong><?=e($item['name'])?></strong><small><?=e(ucfirst($item['type']))?> · <?=e($item['billing_cycle']??'')?></small></div><div style="text-align:right"><?php if(!empty($item['bundle_discount_applied'])):?><small style="display:block;text-decoration:line-through;color:#b3bfd1;font-size:11px"><?=money($item['original_price']??0,$item['currency'])?></small><?php endif;?><b><?=money($item['price'],$item['currency'])?></b></div><form method="post"><?=csrf_field()?><input type="hidden" name="action" value="remove"><input type="hidden" name="index" value="<?=$i?>"><button class="icon-btn" aria-label="Remove item">×</button></form></div><?php endforeach;?><form method="post" style="margin-top:14px"><?=csrf_field()?><input type="hidden" name="action" value="clear"><button class="clear-btn">Clear Cart</button></form><?php endif;?></section><aside class="summary-card"><h2>Order Summary</h2><div>Subtotal <strong><?=money($total,$currency)?></strong></div><div>VAT / Tax <strong>৳0</strong></div><hr><div class="total">Total <strong><?=money($total,$currency)?></strong></div><?php if($items):?><a class="btn primary" href="checkout.php">Proceed to Checkout →</a><?php endif;?></aside></div></main><?php require __DIR__.'/includes/footer.php';?><script src="assets/js/app.js?v=wdh-ui-v8"></script></body></html>
