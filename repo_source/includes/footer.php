<?php $curSym = $CURRENCY === 'BDT' ? 'BDT ৳' : 'USD $'; $otherCur = $CURRENCY === 'BDT' ? 'usd' : 'bdt'; ?>
<footer class="footer">
  <div class="footer-grid">
    <div class="brand">
      <a href="index.php"><img src="assets/images/logo-white.png" alt="WebDataHosts" class="footer-logo-img"></a><strong>Web Data Hosting</strong><small>EST. 2004</small>
      <p><?= t('footer_tagline') ?></p>
      <div class="social" aria-label="Social links"><a href="#" aria-label="Facebook">f</a><a href="#" aria-label="X">𝕏</a><a href="#" aria-label="LinkedIn">in</a><a href="#" aria-label="YouTube">▶</a></div>
    </div>
    <div><h4><?= t('footer_services') ?></h4><a href="domains.php"><?= t('fs_1') ?></a><a href="hosting.php"><?= t('fs_2') ?></a><a href="servers.php"><?= t('fs_3') ?></a><a href="business-email.php"><?= t('fs_4') ?></a><a href="services.php"><?= t('fs_5') ?></a><a href="security.php"><?= t('fs_6') ?></a></div>
    <div><h4><?= t('footer_solutions') ?></h4><a href="services.php"><?= t('fsol_1') ?></a><a href="services.php"><?= t('fsol_2') ?></a><a href="services.php"><?= t('fsol_3') ?></a><a href="services.php"><?= t('fsol_4') ?></a><a href="services.php"><?= t('fsol_5') ?></a></div>
    <div><h4><?= t('footer_company') ?></h4><a href="services.php"><?= t('fc_1') ?></a><a href="services.php"><?= t('fc_2') ?></a><a href="services.php"><?= t('fc_3') ?></a><a href="services.php"><?= t('fc_4') ?></a><a href="services.php"><?= t('fc_5') ?></a></div>
    <div><h4><?= t('footer_resources') ?></h4><a href="services.php"><?= t('fr_1') ?></a><a href="services.php"><?= t('fr_2') ?></a><a href="services.php"><?= t('fr_3') ?></a><a href="services.php"><?= t('fr_4') ?></a><a href="services.php"><?= t('fr_5') ?></a></div>
    <div class="payments"><h4><?= t('footer_accept') ?></h4><div><span class="pay-badge bkash">bKash</span><span class="pay-badge nagad">নগদ</span><span class="pay-badge rocket">ROCKET</span></div><div><span class="pay-badge upay">upay</span><span class="pay-badge bank">BANK TRANSFER</span><span class="pay-badge taptap">taptap send</span></div></div>
  </div>
  <div class="footer-bottom">
    <div class="fb-selectors"><a class="pill-link" href="<?= currency_url($otherCur) ?>"><?= $curSym ?> <?= icon('chevron-down','tb-chev') ?></a><a class="pill-link" href="<?= lang_url($LANG === 'bn' ? 'en' : 'bn') ?>"><?= t('topbar_lang_label') ?> <?= icon('chevron-down','tb-chev') ?></a></div>
    <span><?= t('footer_copyright') ?></span><span><?= icon('headset','fb-icon') ?> <?= t('footer_support') ?></span><a href="tel:+12139867750"><?= icon('phone','fb-icon') ?> +1 (213) 986-7750</a><a href="mailto:support@wdhdomain.com"><?= icon('mail','fb-icon') ?> support@wdhdomain.com</a>
  </div>
</footer>
<?php
$chatEnabled = setting_value($db, 'live_chat_enabled', '1') === '1';
$chatProvider = strtolower(setting_value($db, 'live_chat_provider', 'tawk'));
$chatProperty = trim(setting_value($db, 'live_chat_property_id', ''));
$chatWidget = trim(setting_value($db, 'live_chat_widget_id', 'default'));
if ($chatEnabled && $chatProvider === 'tawk' && $chatProperty !== ''):
?>
<script type="text/javascript">
var Tawk_API=Tawk_API||{},Tawk_LoadStart=new Date();
(function(){var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];s1.async=true;s1.src='https://embed.tawk.to/<?= e($chatProperty) ?>/<?= e($chatWidget ?: 'default') ?>';s1.charset='UTF-8';s1.setAttribute('crossorigin','*');s0.parentNode.insertBefore(s1,s0);})();
</script>
<?php endif; ?>
