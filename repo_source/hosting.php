<?php
require_once __DIR__.'/includes/bootstrap.php';
$shared=[]; if($db){$st=$db->prepare("SELECT * FROM products WHERE category='hosting' AND active=1 AND slug LIKE 'hosting-%' ORDER BY sort_order,id"); $st->execute(); $shared=$st->fetchAll();}
$business=fetch_products($db,'business_hosting');
$reseller=fetch_products($db,'reseller');
$pageTitle='Web Hosting';
?><!doctype html><html lang="<?=e($LANG)?>"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title><?=e($pageTitle)?> — WDH</title><link rel="stylesheet" href="assets/css/style.css?v=wdh-ui-v8"><link rel="stylesheet" href="assets/css/catalog.css?v=wdh-ui-v8"><link rel="stylesheet" href="assets/css/hosting-plans.css?v=wdh-ui-v8"></head><body><?php require __DIR__.'/includes/header.php';?>
<main class="hosting-page">
  <section class="hosting-hero">
    <div class="hosting-hero-copy">
      <div class="breadcrumbs">Home › Hosting</div>
      <span class="eyebrow mint">RELIABLE HOSTING SOLUTIONS</span>
      <h1>Fast, Reliable &amp; Secure <span>Hosting Solutions</span> for Your Online Success</h1>
      <p>Choose the right amount of space for your website — from 1GB plans to large 300GB business hosting, or build a custom package around your exact needs.</p>
      <div class="actions"><a class="btn primary" href="#plans">Choose a Hosting Plan →</a><a class="btn secondary" href="custom-hosting.php">Request Custom Hosting</a></div>
      <div class="hosting-trust"><span>✓ 99.9% Uptime Target</span><span>✓ Fair Bandwidth</span><span>✓ Free SSL</span><span>✓ 24/7 Expert Support</span></div>
    </div>
    <div class="hosting-hero-art" aria-hidden="true"><div class="host-rack"><span></span><span></span><span></span><span></span></div><div class="host-cloud">☁</div><div class="host-shield">✓</div></div>
  </section>

  <section class="hosting-domain-mini"><div class="domain-title"><strong><?=icon('globe','icon')?></strong><div><h2>Find Your Perfect Domain</h2><p>Search your domain and build your online identity.</p></div></div><form action="domains.php" method="get"><input name="domain" placeholder="e.g. yourdomain.com"><select name="extension"><option>.com</option><option>.net</option><option>.org</option><option>.info</option><option>.biz</option><option>.shop</option></select><button class="btn primary">Search Domain</button></form></section>

  <section class="hosting-section" id="plans">
    <div class="section-head"><span class="eyebrow mint">CHOOSE THE RIGHT FIT</span><h2>Hosting Plans That <span>Match Your Needs</span></h2><p>Start small, scale confidently, and move to reseller or custom hosting when your requirements grow.</p></div>
    <div class="hosting-category-tabs" role="tablist" aria-label="Hosting categories">
      <button class="hosting-category active" data-category="shared" role="tab" aria-selected="true">🗄️ <strong>Shared Hosting</strong><small>Perfect for one website</small></button>
      <button class="hosting-category" data-category="business" role="tab" aria-selected="false">🏢 <strong>Business Hosting</strong><small>More storage &amp; resources</small></button>
      <button class="hosting-category" data-category="reseller" role="tab" aria-selected="false">👥 <strong>Reseller Hosting</strong><small>For multiple websites</small></button>
      <button class="hosting-category" data-category="custom" role="tab" aria-selected="false">⚙️ <strong>Custom Hosting</strong><small>Build your own package</small></button>
    </div>

    <div class="hosting-panels">
      <div class="hosting-panel active" data-panel="shared">
        <div class="storage-pills" aria-label="Shared hosting storage selector"><?php $shownShared=[]; foreach($shared as $p){if(!preg_match('/(\d+)\s*GB/i',$p['name'],$m)) continue; $gb=(int)$m[1]; if(isset($shownShared[$gb])) continue; $shownShared[$gb]=$p['id']; ?><button class="storage-pill<?=count($shownShared)===1?' active':''?>" data-product-id="<?=$p['id']?>" data-gb="<?=$gb?>" type="button"><?=$gb?>GB</button><?php } ?><a class="storage-pill custom-pill" href="custom-hosting.php">Custom</a></div>
        <div class="hosting-selected-grid">
          <?php foreach($shared as $p): ?><article class="hosting-plan-card<?=(!isset($firstShared)?' active-plan':'')?>" data-product-card="<?=$p['id']?>" data-storage="<?=preg_match('/(\d+)\s*GB/i',$p['name'],$m)?(int)$m[1]:0?>" style="display:<?=isset($firstShared)?'none':'grid'?>" data-category-card="shared"><?php $firstShared=true; ?><?php if($p['badge']):?><span class="plan-badge"><?=e($p['badge'])?></span><?php endif;?><div><h3><?=e($p['name'])?></h3><p><?=e($p['short_description'])?></p></div><div class="price-line"><?=money($p['monthly_price'],$p['currency'])?><small>/month</small></div><div class="price-note">Yearly: <?=money($p['yearly_price'],$p['currency'])?></div><ul><?php foreach(product_features($p['features_json']) as $f):?><li>✓ <?=e($f)?></li><?php endforeach;?></ul><div class="plan-actions"><form method="post" action="cart.php"><?=csrf_field()?><input type="hidden" name="action" value="add"><input type="hidden" name="type" value="product"><input type="hidden" name="product_id" value="<?=$p['id']?>"><input type="hidden" name="billing_cycle" value="monthly"><button class="btn primary">Choose Monthly →</button></form><form method="post" action="cart.php"><?=csrf_field()?><input type="hidden" name="action" value="add"><input type="hidden" name="type" value="product"><input type="hidden" name="product_id" value="<?=$p['id']?>"><input type="hidden" name="billing_cycle" value="yearly"><button class="btn secondary">Choose Yearly</button></form></div></article><?php endforeach;?></div>
        <aside class="custom-callout"><span>Need a different size?</span><strong>Request a Custom Hosting Quote</strong><p>120GB, 200GB, 2TB or a custom configuration — tell us what you need.</p><a class="btn secondary" href="custom-hosting.php">Build Custom Hosting →</a></aside>
      </div>

      <div class="hosting-panel" data-panel="business">
        <div class="storage-pills"><?php $first=false; foreach($business as $p){if(!preg_match('/(\d+)\s*GB/i',$p['name'],$m)) continue; $gb=(int)$m[1]; if(!$first){$first=true;} ?><button class="storage-pill<?= $gb===100?' active':''?>" data-product-id="<?=$p['id']?>" type="button"><?=$gb?>GB</button><?php } ?><a class="storage-pill custom-pill" href="custom-hosting.php">Custom</a></div>
        <div class="business-plan-grid"><?php foreach($business as $p):?><article class="hosting-plan-card business-card" data-product-card="<?=$p['id']?>" style="display:<?=strpos($p['slug'],'100gb')!==false?'grid':'none'?>" data-category-card="business"><?php if($p['badge']):?><span class="plan-badge"><?=e($p['badge'])?></span><?php endif;?><h3><?=e($p['name'])?></h3><p><?=e($p['short_description'])?></p><div class="price-line"><?=money($p['monthly_price'],$p['currency'])?><small>/month</small></div><div class="price-note">Yearly: <?=money($p['yearly_price'],$p['currency'])?></div><ul><?php foreach(product_features($p['features_json']) as $f):?><li>✓ <?=e($f)?></li><?php endforeach;?></ul><div class="plan-actions"><form method="post" action="cart.php"><?=csrf_field()?><input type="hidden" name="action" value="add"><input type="hidden" name="type" value="product"><input type="hidden" name="product_id" value="<?=$p['id']?>"><input type="hidden" name="billing_cycle" value="monthly"><button class="btn primary">Choose Plan →</button></form></div></article><?php endforeach;?></div>
      </div>

      <div class="hosting-panel" data-panel="reseller">
        <div class="storage-pills reseller-pills"><?php foreach($reseller as $p){preg_match('/(\d+)/',$p['slug'],$m); $accounts=$m[1]??''; ?><button class="storage-pill<?=strpos($p['slug'],'reseller-25')!==false?' active':''?>" data-product-id="<?=$p['id']?>" type="button"><?=e($accounts)?> Accounts</button><?php } ?><a class="storage-pill custom-pill" href="custom-hosting.php">Custom</a></div>
        <div class="reseller-note"><strong>More than one website?</strong><span>Regular hosting is designed for one website per hosting account. For multiple websites, choose Reseller Hosting with WHM + cPanel accounts.</span></div>
        <div class="business-plan-grid"><?php foreach($reseller as $p):?><article class="hosting-plan-card reseller-card" data-product-card="<?=$p['id']?>" style="display:<?=strpos($p['slug'],'reseller-25')!==false?'grid':'none'?>" data-category-card="reseller"><?php if($p['badge']):?><span class="plan-badge"><?=e($p['badge'])?></span><?php endif;?><h3><?=e($p['name'])?></h3><p><?=e($p['short_description'])?></p><div class="price-line"><?=money($p['monthly_price'],$p['currency'])?><small>/month</small></div><div class="price-note">Yearly: <?=money($p['yearly_price'],$p['currency'])?></div><ul><?php foreach(product_features($p['features_json']) as $f):?><li>✓ <?=e($f)?></li><?php endforeach;?></ul><div class="plan-actions"><form method="post" action="cart.php"><?=csrf_field()?><input type="hidden" name="action" value="add"><input type="hidden" name="type" value="product"><input type="hidden" name="product_id" value="<?=$p['id']?>"><input type="hidden" name="billing_cycle" value="monthly"><button class="btn primary">Choose Reseller →</button></form></div></article><?php endforeach;?></div>
      </div>

      <div class="hosting-panel custom-panel" data-panel="custom">
        <div class="custom-layout"><div class="custom-copy"><span class="eyebrow mint">CUSTOM HOSTING</span><h3>Build a package around your business.</h3><p>Need 120GB, 200GB, 300GB, 2TB or a special setup? Tell us your requirements and preferred budget. We'll prepare a private quote for you.</p><div class="custom-rule"><strong>Multiple websites?</strong><span>2+ websites are handled through our Reseller Hosting model with separate cPanel accounts.</span></div><a class="btn primary" href="custom-hosting.php">Request Custom Quote →</a></div><div class="custom-mini-form"><div><label>Storage <input readonly value="e.g. 120 GB, 200 GB, 2 TB"></label><label>Bandwidth <select><option>Standard Bandwidth</option><option>High Bandwidth</option><option>Fair Bandwidth</option></select></label></div><div><label>Websites <input readonly value="1"></label><label>Email Accounts <input readonly value="e.g. 10 or custom"></label></div><div><label>Control Panel <input readonly value="cPanel / AAA Hosting"></label><label>Management <input readonly value="Managed / Fully Managed / Unmanaged"></label></div><div><label>Budget <input readonly value="e.g. ৳5,000 / month"></label><label>Billing <input readonly value="Monthly / Yearly"></label></div><label>Additional Requirements <textarea readonly rows="4" placeholder="Tell us anything else you need..."></textarea></div></div>
      </div>
    </div>
  </section>

  <section class="hosting-benefits"><div><i>🚀</i><strong>Fast &amp; Reliable</strong><small>Optimized SSD/NVMe hosting.</small></div><div><i>🛡️</i><strong>Secure &amp; Protected</strong><small>SSL, backups and security.</small></div><div><i>🌐</i><strong>One Website, One Account</strong><small>Clear hosting architecture.</small></div><div><i>👥</i><strong>Reseller Ready</strong><small>WHM + cPanel for multiple sites.</small></div><div><i>🎧</i><strong>24/7 Support</strong><small>Real technical assistance.</small></div></section>
  <section class="hosting-cta"><div><span class="eyebrow mint">NOT SURE WHICH OPTION FITS?</span><h2>Need help choosing the right hosting?</h2><p>Tell us what you are building and we'll recommend the right plan — or prepare a custom quote.</p></div><div class="actions"><a class="btn primary" href="contact.php">Talk to a Specialist →</a><a class="btn secondary" href="support.php">Open Support</a></div></section>
</main>
<?php require __DIR__.'/includes/footer.php';?><script src="assets/js/app.js?v=wdh-ui-v8"></script><script>
(function(){const tabs=[...document.querySelectorAll('.hosting-category')],panels=[...document.querySelectorAll('.hosting-panel')];
function showCat(name){tabs.forEach(t=>{const on=t.dataset.category===name;t.classList.toggle('active',on);t.setAttribute('aria-selected',on?'true':'false')});panels.forEach(p=>p.classList.toggle('active',p.dataset.panel===name));}
tabs.forEach(t=>t.addEventListener('click',()=>showCat(t.dataset.category)));
function bindPanel(panel){const pills=[...panel.querySelectorAll('.storage-pill[data-product-id]')];if(!pills.length)return;pills.forEach(p=>p.addEventListener('click',()=>{pills.forEach(x=>x.classList.remove('active'));p.classList.add('active');const id=p.dataset.productId;panel.querySelectorAll('[data-product-card]').forEach(c=>{c.style.display=c.dataset.productCard===id?'grid':'none';});}));}
panels.forEach(bindPanel);
})();
</script></body></html>
