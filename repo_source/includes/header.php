<?php
$flag = $LANG === 'bn' ? 'flag-bd' : 'flag-us';
require_once __DIR__.'/nav-icons.php';
require_once __DIR__.'/nav-data.php';
$__nav = wdh_nav_data();
?>
<link rel="stylesheet" href="assets/css/mega-nav.css?v=wdh-nav-v1">
<link rel="stylesheet" href="assets/css/custom.css?v=wdh-custom-v1">
<div class="topbar">
  <div class="topbar-inner">
    <div class="contact" aria-label="Contact information">
      <a href="tel:+12139867750"><?= icon('phone','tb-icon') ?> <span>+1 (213) 986-7750</span></a>
      <a href="mailto:support@wdhdomain.com"><?= icon('mail','tb-icon') ?> <span>support@wdhdomain.com</span></a>
    </div>
    <div class="topbar-right">
      <div class="lang-switch">
        <button class="top-control" type="button" aria-haspopup="true" aria-expanded="false" data-menu-toggle="language-menu">
          <?= icon($flag,'tb-flag') ?> <span><?= t('topbar_lang_label') ?></span> <?= icon('chevron-down','tb-chev') ?>
        </button>
        <div class="lang-menu" id="language-menu">
          <a href="<?= lang_url('en') ?>"><?= icon('flag-us','tb-flag') ?> English</a>
          <a href="<?= lang_url('bn') ?>"><?= icon('flag-bd','tb-flag') ?> বাংলা</a>
        </div>
      </div>
      <div class="currency-switch">
        <a class="currency-control" href="<?= currency_url($CURRENCY === 'BDT' ? 'usd' : 'bdt') ?>" aria-label="Switch currency"><?= $CURRENCY === 'BDT' ? '৳ BDT' : '$ USD' ?> <?= icon('chevron-down','tb-chev') ?></a>
      </div>
    </div>
  </div>
</div>
<header class="header">
  <a class="logo" href="index.php" aria-label="Web Data Hosting home"><img src="assets/images/logo-white.png" alt="WebDataHosts" height="30"></a>

  <div class="mobile-header-actions">
    <a class="cart" href="cart.php" aria-label="Shopping cart"><span class="cart-icon-wrap"><img src="assets/images/icon-cart.png" alt="" class="header-icon-img"><b><?= cart_count() ?></b></span></a>
    <button class="mobile-menu" id="mobile-menu" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="main-nav">
      <?= nav_icon('menu','icon-menu-open') ?>
      <?= nav_icon('close','icon-menu-close') ?>
    </button>
  </div>

  <div class="nav-scrim" id="nav-scrim" hidden></div>

  <nav class="mega-nav" id="main-nav" aria-label="Main navigation">
    <div class="mega-nav-mobile-head">
      <img src="assets/images/logo-white.png" alt="WebDataHosts" class="mega-nav-mobile-logo">
      <button type="button" class="mega-nav-close" id="mega-nav-close" aria-label="Close menu"><?= nav_icon('close') ?></button>
    </div>
    <ul class="mega-list">
      <?php foreach ($__nav as $i => $cat): $panelId = 'mega-panel-'.$cat['key']; ?>
      <li class="mega-item<?= isset($cat['accent']) ? ' mega-item--'.$cat['accent'] : '' ?>">
        <div class="mega-trigger-row">
          <a class="mega-trigger" href="<?= e($cat['href']) ?>" data-mega-trigger="<?= $cat['key'] ?>">
            <?= nav_icon($cat['icon'],'mega-trigger-icon') ?>
            <span class="mega-trigger-full"><?= t($cat['label_key']) ?></span>
            <span class="mega-trigger-short"><?= e(($LANG === 'bn' ? ($cat['short_label_bn'] ?? null) : ($cat['short_label'] ?? null)) ?? t($cat['label_key'])) ?></span>
            <?php if (!empty($cat['badge'])): ?><span class="mega-badge"><?= e($cat['badge']) ?></span><?php endif; ?>
          </a>
          <button type="button" class="mega-chevron-btn" aria-expanded="false" aria-controls="<?= $panelId ?>" aria-label="Toggle <?= e($cat['panel_title']) ?> menu">
            <?= nav_icon('chevron-down','mega-chevron') ?>
          </button>
        </div>
        <div class="mega-panel" id="<?= $panelId ?>" role="menu" aria-label="<?= e($cat['panel_title']) ?> menu">
          <div class="mega-panel-inner">
            <div class="mega-panel-head">
              <span class="mega-panel-head-icon"><?= nav_icon($cat['panel_icon']) ?></span>
              <strong><?= e($cat['panel_title']) ?></strong>
            </div>
            <div class="mega-cols mega-cols-<?= count($cat['columns']) ?>">
              <?php foreach ($cat['columns'] as $col): ?>
              <div class="mega-col">
                <?php foreach ($col as $group): ?>
                <div class="mega-group">
                  <?php if (!empty($group['heading'])): ?><h4><?= e($group['heading']) ?></h4><?php endif; ?>
                  <ul>
                    <?php foreach ($group['items'] as $item): ?>
                    <li><a href="<?= e($item['href']) ?>" role="menuitem"><?= nav_icon($item['icon'],'mega-link-icon') ?><span><?= e($item['label']) ?></span></a></li>
                    <?php endforeach; ?>
                  </ul>
                </div>
                <?php endforeach; ?>
              </div>
              <?php endforeach; ?>
            </div>
            <?php if (!empty($cat['promo'])): $p = $cat['promo']; ?>
            <a class="mega-promo<?= isset($p['accent']) ? ' mega-promo--'.$p['accent'] : '' ?>" href="<?= e($cat['href']) ?>">
              <span class="mega-promo-icon"><?= nav_icon($p['icon']) ?></span>
              <span class="mega-promo-text"><strong><?= e($p['title']) ?></strong><small><?= e($p['sub']) ?></small></span>
              <?php if (!empty($p['cta'])): ?><span class="mega-promo-cta"><?= e($p['cta']) ?> <?= nav_icon('arrow-right') ?></span><?php endif; ?>
            </a>
            <?php endif; ?>
            <?php if (!empty($cat['footer_link'])): ?>
            <a class="mega-footer-link" href="<?= e($cat['footer_link']['href']) ?>"><?= e($cat['footer_link']['label']) ?> <?= nav_icon('arrow-right') ?></a>
            <?php endif; ?>
          </div>
        </div>
      </li>
      <?php endforeach; ?>
    </ul>

    <div class="mega-nav-mobile-foot">
      <div class="mega-mobile-btn-row">
        <?php if (current_user()): ?>
          <a class="mega-mobile-btn" href="client.php"><?= nav_icon('client-portal') ?> <?= t('nav_portal') ?></a>
        <?php else: ?>
          <a class="mega-mobile-btn" href="login.php"><?= nav_icon('login') ?> My Account</a>
        <?php endif; ?>
        <a class="mega-mobile-btn mega-mobile-btn--ghost" href="cart.php"><?= nav_icon('cart') ?> Cart (<?= cart_count() ?>)</a>
      </div>
      <?php if (current_user()): ?>
        <a class="mega-mobile-logout" href="logout.php">Logout</a>
      <?php endif; ?>
      <a class="mega-mobile-contact" href="tel:+12139867750"><?= nav_icon('contact-us') ?> <span><strong>+1 (213) 986-7750</strong><small>24/7 Human Support</small></span></a>
    </div>
  </nav>

  <div class="header-actions">
    <a class="cart" href="cart.php" aria-label="Shopping cart"><?= nav_icon('cart') ?><b><?= cart_count() ?></b></a>
    <?php if (current_user()): $unread = wdh_unread_notifications($db,(int)current_user()['id']); ?>
      <a class="cart notification-link" href="notifications.php" aria-label="Notifications"><?= icon('bell') ?><b><?= $unread ?></b></a>
    <?php endif; ?>
    <?php if (current_user()): ?>
      <div class="account-switch">
        <button class="account-control account-control--labeled" type="button" aria-haspopup="true" aria-expanded="false" data-menu-toggle="account-menu" aria-label="Account menu"><?= nav_icon('client-portal','w-4') ?> <span>My Account</span></button>
        <div class="account-menu" id="account-menu">
          <a href="client.php"><?= t('nav_portal') ?></a>
          <a href="logout.php">Logout</a>
        </div>
      </div>
    <?php else: ?>
      <a class="portal" href="login.php"><?= nav_icon('login','w-4') ?> <span>My Account</span></a>
    <?php endif; ?>
  </div>
</header>
<script src="assets/js/mega-nav.js?v=wdh-nav-v1" defer></script>
