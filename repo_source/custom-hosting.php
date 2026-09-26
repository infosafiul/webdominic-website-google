<?php
require_once __DIR__.'/includes/bootstrap.php';
require_login();
$u=current_user(); $error=''; $success='';
$prefillDomain=trim((string)($_GET['domain']??''));
if(is_post()){
  verify_csrf(); public_form_guard($db,'custom_hosting',$_POST['recaptcha_token']??'');
  try{
    if(!$db) throw new RuntimeException('Database is unavailable.');
    $storage=parse_storage_gb($_POST['requested_storage_gb']??0);
    if($storage<=0) throw new RuntimeException('Please enter the storage requirement.');
    $domain=trim((string)($_POST['domain_name']??''));
    $websites=trim((string)($_POST['requested_websites']??'')); $websitesVal=$websites===''?1:(int)$websites;
    if($websitesVal<1) $websitesVal=1;
    if($websitesVal>1) throw new RuntimeException('For more than one website, please choose Reseller Hosting so each website can have its own cPanel account.');
    $mailboxes=trim((string)($_POST['requested_mailboxes']??'')); $mailboxesVal=$mailboxes===''?null:(int)$mailboxes;
    if($mailboxesVal!==null && $mailboxesVal<0) $mailboxesVal=null;
    $cycle=in_array($_POST['billing_cycle']??'monthly',['monthly','yearly'],true)?$_POST['billing_cycle']:'monthly';
    $management=in_array($_POST['management_type']??'managed',['unmanaged','managed','fully_managed'],true)?$_POST['management_type']:'managed';
    $bandwidth=in_array($_POST['bandwidth_mode']??'', ['standard','high','fair'], true)?$_POST['bandwidth_mode']:'standard';
    $budget=(float)($_POST['budget_amount']??0); $budgetVal=$budget>0?$budget:null;
    $requirements=trim((string)($_POST['requirements']??''));
    if(strlen($requirements)>5000) throw new RuntimeException('Additional requirements are too long.');
    $transfer=trim((string)($_POST['requested_transfer_gb']??'')); $transferVal=$transfer===''?null:(float)$transfer;
    $control=in_array($_POST['control_panel']??'', ['cPanel','AAA Hosting'], true)?$_POST['control_panel']:'cPanel';
    $budgetCurrency=in_array($_POST['budget_currency']??'BDT',['BDT','USD'],true)?$_POST['budget_currency']:'BDT';
    $st=$db->prepare('INSERT INTO custom_hosting_requests(user_id,domain_name,requested_storage_gb,requested_transfer_gb,bandwidth_mode,requested_websites,requested_mailboxes,control_panel,management_type,billing_cycle,budget_amount,budget_currency,requirements,status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
    $st->execute([$u['id'],$domain!==''?$domain:null,$storage,$transferVal,$bandwidth,$websitesVal,$mailboxesVal,$control,$management,$cycle,$budgetVal,$budgetCurrency,$requirements,'submitted']);
    $id=(int)$db->lastInsertId();
    $success='Your custom hosting request #'.$id.' has been submitted. WDH will review your requirements and prepare a private quote.';
  }catch(Throwable $e){$error=$e->getMessage();}
}
?><!doctype html><html lang="<?=e($LANG)?>"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Custom Hosting — WDH</title><link rel="stylesheet" href="assets/css/style.css?v=wdh-ui-v8"><link rel="stylesheet" href="assets/css/catalog.css?v=wdh-ui-v8"><link rel="stylesheet" href="assets/css/hosting-plans.css?v=wdh-ui-v8"></head><body><?php require __DIR__.'/includes/header.php';?><main class="simple-page"><div class="breadcrumbs">Home › Hosting › Custom Hosting</div><div class="portal-welcome"><div><span class="eyebrow mint">CUSTOM HOSTING</span><h1>Build a Hosting Package Around Your Needs</h1><p>Need 120GB, 200GB, 300GB, 2TB or a special configuration? Tell us what you need and WDH will prepare a custom quote.</p></div><a class="btn secondary" href="hosting.php">Back to Hosting</a></div><?php if($success):?><div class="alert success-alert"><?=e($success)?></div><p><a class="btn primary" href="my-custom-hosting.php">View My Requests →</a></p><?php endif;?><?php if($error):?><div class="alert error"><?=e($error)?></div><?php endif;?><section class="cart-card custom-request-card"><form method="post"><?=csrf_field()?><input type="text" name="website" class="hp-field" autocomplete="off"><input type="hidden" name="recaptcha_token" value=""><div class="custom-request-grid">
<label>Domain Name <span>(optional)</span><input name="domain_name" value="<?=e($prefillDomain)?>" placeholder="example.com"></label>
<label>Storage Required <input type="text" name="requested_storage_gb" inputmode="decimal" required placeholder="120 GB, 200 GB, 2 TB"></label>
<label>Bandwidth Preference <select name="bandwidth_mode"><option value="standard">Standard Bandwidth</option><option value="high">High Bandwidth</option><option value="fair">Fair Bandwidth</option></select><small>We avoid “Unlimited” promises; actual capacity follows the selected infrastructure and fair-use policy.</small></label>
<label>Number of Websites <input type="number" min="1" step="1" name="requested_websites" value="1"><small>1 website per regular hosting account. More than one website requires Reseller Hosting.</small></label>
<label>Email Accounts <select name="requested_mailboxes"><option value="">Not specified</option><option value="5">5</option><option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="0">Unlimited*</option></select><small>*Subject to plan/provider fair-use limits.</small></label>
<label>Control Panel <select name="control_panel"><option>cPanel</option><option>AAA Hosting</option></select></label>
<label>Management <select name="management_type"><option value="managed">Managed</option><option value="fully_managed">Fully Managed</option><option value="unmanaged">Unmanaged</option></select></label>
<label>Billing Cycle <select name="billing_cycle"><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select></label>
<label>Preferred Budget <input type="number" min="0" step="1" name="budget_amount" placeholder="e.g. 5000"></label>
<label>Budget Currency <select name="budget_currency"><option value="BDT">BDT ৳</option><option value="USD">USD $</option></select></label>
</div><label>Bandwidth / Transfer Reference <span>(optional)</span><input type="number" min="1" step="1" name="requested_transfer_gb" placeholder="e.g. 3000 GB/month"><small>This is only an indication for our technical team; the final capacity depends on the infrastructure and plan.</small></label><label>Additional Requirements <span>(optional)</span><textarea name="requirements" rows="7" placeholder="Tell us about your traffic, applications, backups, email needs, preferred location, budget, or anything else."></textarea></label><?=recaptcha_field('custom_hosting')?><div class="actions"><button class="btn primary">Submit Custom Hosting Request →</button><a class="btn secondary" href="hosting.php#plans">View Hosting Plans</a></div></form></section></main><?php require __DIR__.'/includes/footer.php';?></body></html>
