<?php
require_once __DIR__.'/includes/bootstrap.php'; require_admin();
$notice=''; $error='';
if(is_post()){
    verify_csrf();
    if(($_POST['action']??'')==='run'){
        $cmd='php '.escapeshellarg(__DIR__.'/cron/process-service-lifecycle.php').' 2>&1';
        $output=shell_exec($cmd);
        $notice='Lifecycle worker executed.'.($output?' '.$output:'');
    } else { $error='Invalid action.'; }
}
$summary=['active'=>0,'expiring'=>0,'expired'=>0];
if($db){
    try{
        $summary['active']=(int)$db->query("SELECT COUNT(*) FROM customer_services WHERE status='active'")->fetchColumn();
        $summary['expiring']=(int)$db->query("SELECT COUNT(*) FROM customer_services WHERE status='active' AND expires_at IS NOT NULL AND expires_at BETWEEN CURDATE() AND DATE_ADD(CURDATE(),INTERVAL 30 DAY)")->fetchColumn();
        $summary['expired']=(int)$db->query("SELECT COUNT(*) FROM customer_services WHERE status='expired' OR (status='active' AND expires_at<CURDATE())")->fetchColumn();
    }catch(Throwable $e){$error=$e->getMessage();}
}
$rows=$db?$db->query("SELECT cs.id,cs.service_name,cs.status,cs.expires_at,u.full_name,u.email FROM customer_services cs LEFT JOIN users u ON u.id=cs.user_id WHERE cs.expires_at IS NOT NULL ORDER BY cs.expires_at ASC LIMIT 100")->fetchAll():[];
?><!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Service Lifecycle — WDH Admin</title><link rel="stylesheet" href="assets/css/style.css?v=wdh-ui-v8"><link rel="stylesheet" href="assets/css/catalog.css?v=wdh-ui-v8"></head><body><?php require __DIR__.'/includes/header.php';?><main class="admin-page"><div class="portal-welcome"><div><span class="eyebrow mint">SERVICE LIFECYCLE</span><h1>Expiry & Renewal Operations</h1><p>Review service expiry status and run the daily lifecycle worker.</p></div><div class="actions"><form method="post"><?=csrf_field()?><button class="btn primary" name="action" value="run">Run Lifecycle Now</button></form><a class="btn secondary" href="admin-services.php">Customer Services</a></div></div><?php if($notice):?><div class="alert success-alert"><?=e($notice)?></div><?php endif;?><?php if($error):?><div class="alert error"><?=e($error)?></div><?php endif;?><section class="dashboard-grid"><div class="dash-card"><span>Active Services</span><strong><?=number_format($summary['active'])?></strong></div><div class="dash-card"><span>Expiring in 30 Days</span><strong><?=number_format($summary['expiring'])?></strong></div><div class="dash-card"><span>Expired</span><strong><?=number_format($summary['expired'])?></strong></div></section><section class="admin-section"><div class="section-head"><span class="eyebrow mint">EXPIRY QUEUE</span><h2>Services by Expiry Date</h2></div><div class="admin-table"><?php if(!$rows):?><div class="empty">No expiring services found.</div><?php else:foreach($rows as $r):?><div class="admin-row"><div><strong><?=e($r['service_name'])?></strong><small><?=e($r['full_name']??'')?> · <?=e($r['email']??'')?></small></div><span class="badge"><?=e($r['status'])?></span><small><?=e($r['expires_at'])?></small><a class="btn primary small" href="service-edit.php?id=<?=$r['id']?>">Manage</a></div><?php endforeach;endif;?></div></section></main><?php require __DIR__.'/includes/footer.php';?></body></html>
