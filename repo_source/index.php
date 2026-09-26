<?php require_once __DIR__.'/includes/bootstrap.php'; ?>
<!doctype html>
<html lang="<?= htmlspecialchars($LANG, ENT_QUOTES, 'UTF-8') ?>" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#061a3a">
  <title><?= $LANG === 'bn' ? 'WDH — ডোমেইন, হোস্টিং, সার্ভার ও বিজনেস সলিউশন' : 'WDH — Domains, Hosting, Servers & Business Solutions' ?></title>
  <meta name="description" content="<?= $LANG === 'bn' ? 'WDH Web Data Hosting থেকে নির্ভরযোগ্য ডোমেইন, হোস্টিং, সার্ভার, বিজনেস ইমেইল ও ডিজিটাল সেবা।' : 'Reliable domains, hosting, servers, business email and digital solutions from WDH Web Data Hosting.' ?>">
  <link rel="stylesheet" href="assets/css/style.css?v=wdh-ui-v8">
</head>
<body>
<?php require __DIR__.'/includes/header.php'; ?>
<main>
<section class="hero">
  <div class="hero-bg" aria-hidden="true"></div>
  <div class="hero-inner">
    <div class="hero-copy">
      <span class="eyebrow hero-eyebrow"><?= t('hero_badge') ?></span>
      <h1><?= t('hero_h1_l1') ?><br><?= t('hero_h1_l2') ?><br><span class="hero-white"><?= t('hero_h1_l3a') ?></span> <span class="hero-gradient"><?= t('hero_h1_l3b') ?></span></h1>
      <p><?= t('hero_sub') ?></p>
      <div class="actions">
        <a class="btn primary hero-primary" href="services.php"><?= t('hero_cta_primary') ?> <?= icon('arrow-right') ?></a>
        <a class="btn secondary hero-secondary" href="services.php"><?= t('hero_cta_secondary') ?> <?= icon('headset') ?></a>
      </div>
      <div class="trust">
        <span><i class="trust-icon"><?= icon('shield') ?></i><b><?= t('trust_1') ?></b></span>
        <span><i class="trust-icon circle"><?= icon('check-circle') ?></i><b><?= t('trust_2') ?></b></span>
        <span><i class="trust-icon headset"><?= icon('headset') ?></i><b><?= t('trust_3') ?></b></span>
        <span><i class="trust-icon shield-check"><?= icon('shield-check') ?></i><b><?= t('trust_4') ?></b></span>
      </div>
    </div>
    <div class="hero-visual">
      <div class="hero-card">
        <div class="quote"><?= icon('quote') ?></div>
        <h2><?= t('hero_card_h') ?></h2>
        <p><?= t('hero_card_sub') ?></p>
        <ul>
          <li><?= t('hero_card_1') ?></li>
          <li><?= t('hero_card_2') ?></li>
          <li><?= t('hero_card_3') ?></li>
          <li><?= t('hero_card_4') ?></li>
          <li><?= t('hero_card_5') ?></li>
        </ul>
        <div class="slider" aria-hidden="true"><button type="button">←</button><div><b></b><i></i><i></i><i></i></div><button type="button">→</button></div>
      </div>
    </div>
  </div>
</section>

<section class="domain-search" aria-label="Domain search">
  <div class="domain-head">
    <div class="domain-title">
      <strong><?= icon('globe') ?></strong>
      <div><h2><?= t('domain_h') ?></h2><p><?= t('domain_sub') ?></p></div>
    </div>
    <form action="domains.php" method="get">
      <input name="domain" autocomplete="on" placeholder="Have a name in mind? Find a domain.">
      <button class="btn primary" type="submit"><?= icon('search') ?> <span class="btn-text-full"><?= t('domain_search_btn') ?></span><span class="btn-text-short">Search</span></button>
    </form>
  </div>
  <?php
    $tlds = [
      ['.com','blue','1650','15.50'], ['.net','green','860','8.60'], ['.org','orange','1770','17.70'],
      ['.info','purple','1860','18.60'], ['.biz','teal','990','9.90'], ['.shop','pink','1890','18.90'],
    ];
    $priceSym = $CURRENCY === 'BDT' ? '৳' : '$';
  ?>
  <div class="domain-prices">
    <?php foreach ($tlds as $tld): ?>
      <a class="tld <?= $tld[1] ?>" href="domains.php?extension=<?= ltrim($tld[0], '.') ?>">
        <b><?= $tld[0] ?></b><span><?= $priceSym ?><?= $CURRENCY === 'BDT' ? $tld[2] : $tld[3] ?> <small>/year</small></span>
      </a>
    <?php endforeach; ?>
    <a class="pricing" href="domains.php"><?= t('domain_view_all') ?> →</a>
  </div>
</section>

<section class="bundle-promo">
  <div class="bundle-promo-inner">
    <div class="bundle-promo-icon"><?= icon('tag') ?></div>
    <div class="bundle-promo-text">
      <h3>Domain price up to 50% off with hosting</h3>
      <p>Buy your domain together with a hosting or website plan and save on the domain's first-year price.</p>
    </div>
    <a class="btn primary" href="domains.php">See Offer →</a>
  </div>
</section>

<section class="section why-section">
  <div class="section-head"><span class="eyebrow mint"><?= t('why_eyebrow') ?></span><h2><?= t('why_h') ?></h2></div>
  <div class="features">
    <?php $features=[['red','flag-us','f1'],['green','building','f2'],['purple','shield-check','f3'],['orange','lock','f4'],['blue','headset','f5']]; foreach($features as $f): ?>
      <article class="feature"><div class="ficon <?=$f[0]?>"><?= icon($f[1]) ?></div><h3><?= t($f[2].'_title') ?></h3><p><?= t($f[2].'_desc') ?></p><a href="services.php"><?= t('learn_more') ?> →</a></article>
    <?php endforeach; ?>
  </div>
</section>

<section class="section services">
  <div class="section-head"><span class="eyebrow cyan"><?= t('services_eyebrow') ?></span><h2><?= t('services_h_a') ?> <span><?= t('services_h_b') ?></span></h2><p><?= t('services_sub') ?></p></div>
  <div class="service-grid">
    <?php $services=[['blue','globe','s1','domains.php'],['green','server','s2','hosting.php'],['purple','mail','s3','business-email.php'],['teal','server','s4','servers.php'],['blue','monitor','s5','services.php'],['orange','shield-check','s6','security.php'],['pink','grid','s7','services.php'],['teal','briefcase','s8','services.php'],['green','headset','s9','services.php'],['purple','lock','s10','security.php']]; foreach($services as $s): ?>
      <article class="service <?=$s[0]?>">
        <div class="service-top"><span class="sicon <?=$s[0]?>"><?= icon($s[1]) ?></span><h3><?= t($s[2].'_title') ?></h3></div>
        <p><?= t($s[2].'_desc') ?></p>
        <a href="<?=$s[3]?>" class="service-cta"><?= t($s[2].'_cta') ?> →</a>
      </article>
    <?php endforeach; ?>
  </div>
</section>

<section class="stats" aria-label="WDH statistics">
  <div><i class="stat-icon"><?= icon('building') ?></i><div class="stat-text"><b><?= t('stat_1_n') ?></b><span><?= t('stat_1_l') ?></span></div></div>
  <div><i class="stat-icon"><?= icon('grid') ?></i><div class="stat-text"><b><?= t('stat_2_n') ?></b><span><?= t('stat_2_l') ?></span></div></div>
  <div><i class="stat-icon"><?= icon('server') ?></i><div class="stat-text"><b><?= t('stat_3_n') ?></b><span><?= t('stat_3_l') ?></span></div></div>
  <div><i class="stat-icon"><?= icon('check-circle') ?></i><div class="stat-text"><b><?= t('stat_4_n') ?></b><span><?= t('stat_4_l') ?></span></div></div>
  <div><i class="stat-icon"><?= icon('headset') ?></i><div class="stat-text"><b><?= t('stat_5_n') ?></b><span><?= t('stat_5_l') ?></span></div></div>
</section>

<section class="final-cta">
  <div class="illustration" aria-hidden="true"></div>
  <div><h2><?= t('cta_h') ?></h2><p><?= t('cta_sub') ?></p></div>
  <div class="cta-buttons"><a class="btn primary" href="services.php"><?= t('cta_btn_1') ?> <?= icon('arrow-right') ?></a><a class="btn secondary" href="services.php"><?= t('cta_btn_2') ?> <?= icon('headset') ?></a></div>
</section>
</main>
<?php require __DIR__.'/includes/footer.php'; ?>
<script src="assets/js/app.js?v=wdh-ui-v8"></script>
</body></html>
