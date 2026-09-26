<?php
require_once __DIR__.'/includes/bootstrap.php';
require_admin();

$today=date('Y-m-d');
$defaultFrom=date('Y-m-d',strtotime('-30 days'));
$from=preg_match('/^\d{4}-\d{2}-\d{2}$/',$_GET['from']??'')?$_GET['from']:$defaultFrom;
$to=preg_match('/^\d{4}-\d{2}-\d{2}$/',$_GET['to']??'')?$_GET['to']:$today;
if($from>$to){$tmp=$from;$from=$to;$to=$tmp;}

if(isset($_GET['export']) && $_GET['export']==='orders'){
  if(!$db){http_response_code(503);exit('Database unavailable.');}
  $st=$db->prepare("SELECT o.order_number,o.status,o.fulfillment_status,o.total,o.currency,o.created_at,u.full_name,u.email FROM orders o LEFT JOIN users u ON u.id=o.user_id WHERE DATE(o.created_at) BETWEEN ? AND ? ORDER BY o.created_at DESC");
  $st->execute([$from,$to]);
  header('Content-Type: text/csv; charset=utf-8');
  header('Content-Disposition: attachment; filename=wdh-orders-'.$from.'-to-'.$to.'.csv');
  $out=fopen('php://output','w');
  fputcsv($out,['Order Number','Customer','Email','Status','Fulfillment','Total','Currency','Created At']);
  while($r=$st->fetch(PDO::FETCH_ASSOC)) fputcsv($out,[$r['order_number'],$r['full_name']??'',$r['email']??'',$r['status'],$r['fulfillment_status']??'',$r['total'],$r['currency'],$r['created_at']]);
  fclose($out);exit;
}

$empty=['orders'=>0,'new_clients'=>0,'active_services'=>0,'expiring'=>0,'expired'=>0,'pending_payments'=>0,'approved_bdt'=>0,'approved_usd'=>0,'fulfillment'=>0];
$summary=$empty;$monthly=[];$statusRows=[];$topProducts=[];$recent=[];$error='';
if(!$db){$error='Database unavailable.';}else try{
  $q=function($sql,$params=[])use($db){$s=$db->prepare($sql);$s->execute($params);return $s;};
  $summary['orders']=(int)$q('SELECT COUNT(*) FROM orders WHERE DATE(created_at) BETWEEN ? AND ?',[$from,$to])->fetchColumn();
  $summary['new_clients']=(int)$q("SELECT COUNT(*) FROM users WHERE role='client' AND DATE(created_at) BETWEEN ? AND ?",[$from,$to])->fetchColumn();
  $summary['active_services']=(int)$q("SELECT COUNT(*) FROM customer_services WHERE status='active'")->fetchColumn();
  $summary['expiring']=(int)$q("SELECT COUNT(*) FROM customer_services WHERE status='active' AND expires_at IS NOT NULL AND expires_at BETWEEN NOW() AND DATE_ADD(NOW(),INTERVAL 30 DAY)")->fetchColumn();
  $summary['expired']=(int)$q("SELECT COUNT(*) FROM customer_services WHERE status='expired' OR (status='active' AND expires_at IS NOT NULL AND expires_at < NOW())")->fetchColumn();
  $summary['pending_payments']=(int)$q("SELECT COUNT(*) FROM payments WHERE status='pending'")->fetchColumn();
  $summary['approved_bdt']=(float)$q("SELECT COALESCE(SUM(amount),0) FROM payments WHERE status='approved' AND currency='BDT' AND DATE(created_at) BETWEEN ? AND ?",[$from,$to])->fetchColumn();
  $summary['approved_usd']=(float)$q("SELECT COALESCE(SUM(amount),0) FROM payments WHERE status='approved' AND currency='USD' AND DATE(created_at) BETWEEN ? AND ?",[$from,$to])->fetchColumn();
  $summary['fulfillment']=(int)$q("SELECT COUNT(*) FROM orders WHERE fulfillment_status IN ('ready_for_fulfillment','in_progress','on_hold')")->fetchColumn();

  $monthly=$q("SELECT DATE_FORMAT(created_at,'%Y-%m') period, COUNT(*) orders, COALESCE(SUM(CASE WHEN currency='BDT' AND status='approved' THEN amount ELSE 0 END),0) bdt, COALESCE(SUM(CASE WHEN currency='USD' AND status='approved' THEN amount ELSE 0 END),0) usd FROM payments WHERE status='approved' AND DATE(created_at) BETWEEN ? AND ? GROUP BY DATE_FORMAT(created_at,'%Y-%m') ORDER BY period",[$from,$to])->fetchAll();
  $statusRows=$q("SELECT status,COUNT(*) total FROM orders WHERE DATE(created_at) BETWEEN ? AND ? GROUP BY status ORDER BY total DESC",[$from,$to])->fetchAll();
  $topProducts=$q("SELECT oi.description,COUNT(*) qty,COALESCE(SUM(oi.unit_price),0) gross,MAX(oi.currency) currency FROM order_items oi INNER JOIN orders o ON o.id=oi.order_id WHERE DATE(o.created_at) BETWEEN ? AND ? GROUP BY oi.description ORDER BY qty DESC,gross DESC LIMIT 10",[$from,$to])->fetchAll();
  $recent=$q("SELECT o.order_number,o.status,o.fulfillment_status,o.total,o.currency,o.created_at,u.full_name FROM orders o LEFT JOIN users u ON u.id=o.user_id WHERE DATE(o.created_at) BETWEEN ? AND ? ORDER BY o.created_at DESC LIMIT 12",[$from,$to])->fetchAll();
}catch(Throwable $e){$error=$e->getMessage();}

function report_url($extra=[]){$base=['from'=>$_GET['from']??'','to'=>$_GET['to']??''];foreach($extra as $k=>$v)$base[$k]=$v;return 'admin-reports.php?'.http_build_query(array_filter($base,fn($v)=>$v!==''));}
?><!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Business Reports — WDH Admin</title><link rel="stylesheet" href="assets/css/style.css?v=wdh-ui-v8"><link rel="stylesheet" href="assets/css/catalog.css?v=wdh-ui-v8"></head><body><?php require __DIR__.'/includes/header.php';?><main class="admin-page">
<div class="portal-welcome"><div><span class="eyebrow mint">BUSINESS INTELLIGENCE</span><h1>Reports & Operations</h1><p>Monitor sales, payments, customers, services and fulfillment without exposing internal provider data.</p></div><div class="actions"><a class="btn secondary" href="admin.php">Admin Dashboard</a><a class="btn primary" href="<?=e(report_url(['export'=>'orders']))?>">Export Orders CSV</a></div></div>
<?php if($error):?><div class="alert error"><?=e($error)?></div><?php endif;?>
<form class="report-filter" method="get"><label>From<input type="date" name="from" value="<?=e($from)?>"></label><label>To<input type="date" name="to" value="<?=e($to)?>"></label><button class="btn primary">Apply Range</button><a class="btn secondary" href="admin-reports.php">Last 30 Days</a></form>
<div class="dashboard-grid admin-stats"><div class="dash-card"><span>Orders</span><strong><?=number_format($summary['orders'])?></strong></div><div class="dash-card"><span>New Clients</span><strong><?=number_format($summary['new_clients'])?></strong></div><div class="dash-card"><span>Approved BDT</span><strong>৳<?=number_format($summary['approved_bdt'],0)?></strong></div><div class="dash-card"><span>Approved USD</span><strong>$<?=number_format($summary['approved_usd'],2)?></strong></div><div class="dash-card"><span>Active Services</span><strong><?=number_format($summary['active_services'])?></strong></div><div class="dash-card"><span>Expiring ≤ 30 Days</span><strong><?=number_format($summary['expiring'])?></strong></div><div class="dash-card"><span>Expired</span><strong><?=number_format($summary['expired'])?></strong></div><div class="dash-card"><span>Pending Payments</span><strong><?=number_format($summary['pending_payments'])?></strong></div></div>
<section class="admin-section"><div class="section-head"><span class="eyebrow mint">REVENUE TREND</span><h2>Approved Payments by Month</h2></div><div class="admin-table"><?php if(!$monthly):?><div class="empty">No approved payments in this period.</div><?php else:foreach($monthly as $m):?><div class="admin-row"><div><strong><?=e($m['period'])?></strong><small><?=number_format($m['orders'])?> approved payment<?=((int)$m['orders']===1?'':'s')?></small></div><span>BDT ৳<?=number_format($m['bdt'],0)?></span><span>USD $<?=number_format($m['usd'],2)?></span></div><?php endforeach;endif;?></div></section>
<section class="admin-section"><div class="section-head"><span class="eyebrow mint">ORDER MIX</span><h2>Order Status</h2></div><div class="admin-table"><?php if(!$statusRows):?><div class="empty">No orders in this period.</div><?php else:foreach($statusRows as $s):?><div class="admin-row"><strong><?=e($s['status'])?></strong><span><?=number_format($s['total'])?></span></div><?php endforeach;endif;?></div></section>
<section class="admin-section"><div class="section-head"><span class="eyebrow mint">TOP PRODUCTS</span><h2>Most Ordered Products</h2></div><div class="admin-table"><?php if(!$topProducts):?><div class="empty">No product sales in this period.</div><?php else:foreach($topProducts as $p):?><div class="admin-row"><div><strong><?=e($p['description'])?></strong><small><?=number_format($p['qty'])?> order item<?=((int)$p['qty']===1?'':'s')?></small></div><span><?=money($p['gross'],$p['currency'])?></span></div><?php endforeach;endif;?></div></section>
<section class="admin-section"><div class="section-head"><span class="eyebrow mint">RECENT ORDERS</span><h2>Operational View</h2></div><div class="admin-table"><?php if(!$recent):?><div class="empty">No orders in this period.</div><?php else:foreach($recent as $r):?><div class="admin-row"><div><strong><?=e($r['order_number'])?></strong><small><?=e($r['full_name']??'Guest')?> · <?=e($r['created_at'])?></small></div><span class="badge"><?=e($r['status'])?></span><span><?=money($r['total'],$r['currency'])?></span><a class="btn secondary small" href="order-details.php?order=<?=urlencode($r['order_number'])?>">View</a></div><?php endforeach;endif;?></div></section>
<section class="admin-section"><div class="section-head"><span class="eyebrow mint">OPERATIONS</span><h2>Quick Actions</h2></div><div class="portal-links"><a href="admin-payments.php">💳 Verify Payments</a><a href="admin-fulfillment.php">📦 Fulfillment Queue</a><a href="admin-service-lifecycle.php">⏱️ Service Lifecycle</a><a href="admin-services.php">🖥️ Customer Services</a><a href="admin-clients.php">👥 Clients</a><a href="admin-communications.php">✉️ Communications</a><a href="admin-server-products.php">🗄️ Server Products</a></div></section>
</main><?php require __DIR__.'/includes/footer.php';?></body></html>
