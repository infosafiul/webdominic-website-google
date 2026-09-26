<?php
require_once __DIR__.'/includes/bootstrap.php';
$pageTitle = 'AI Solutions';
?><!doctype html><html lang="<?=e($LANG)?>"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title><?=e($pageTitle)?> — WDH</title><meta name="description" content="AI-powered websites, chatbots, automation and self-hosted n8n from WDH Web Data Hosting."><link rel="stylesheet" href="assets/css/style.css?v=wdh-ui-v8"><link rel="stylesheet" href="assets/css/catalog.css?v=wdh-ui-v8"></head><body>
<?php require __DIR__.'/includes/header.php'; ?>
<main class="product-page">

<section class="product-hero">
  <div>
    <div class="breadcrumbs">Home › AI Solutions</div>
    <span class="eyebrow">RELIABLE WDH SOLUTIONS</span>
    <h1>AI-Powered Solutions Built for Modern Businesses</h1>
    <p>From AI-built websites and chatbots to full workflow automation with n8n — we design, host and support the AI tooling your business actually needs.</p>
    <div class="actions"><a class="btn primary" href="#development">Explore AI Solutions →</a><a class="btn secondary" href="contact.php">Talk to a Specialist</a></div>
    <div class="hero-points"><span>✓ Custom-built, not templated</span><span>✓ Hosted &amp; supported by WDH</span><span>✓ Secure &amp; Reliable</span></div>
  </div>
  <div class="server-art"><div class="rack"></div><div class="floating-note"><?= nav_icon('sparkles') ?> <strong>Build smarter.</strong><small>Automate more with AI.</small></div></div>
</section>

<section class="domain-inline"><strong><?= nav_icon('domains') ?> Find Your Perfect Domain</strong><form action="domains.php" method="get"><input name="domain" placeholder="e.g. yourdomain.com"><select name="extension"><option>.com</option><option>.net</option><option>.org</option><option>.info</option><option>.biz</option><option>.shop</option></select><button class="btn primary">Search Domain</button></form></section>

<section class="plans" id="development">
  <div class="section-head"><span class="eyebrow mint">AI DEVELOPMENT</span><h2>Built With AI, Made for Your Business</h2><p>Websites, applications and chatbots designed and developed with AI-assisted workflows.</p></div>
  <div class="features">
    <article class="feature"><div class="ficon blue"><?= nav_icon('ai-website-dev') ?></div><h3>AI Website Development</h3><p>Fast, modern websites built with AI-assisted design and development.</p><a href="contact.php">Talk to us →</a></article>
    <article class="feature"><div class="ficon green"><?= nav_icon('ai-web-apps') ?></div><h3>AI Web Applications</h3><p>Custom web apps with AI features built in from day one.</p><a href="contact.php">Talk to us →</a></article>
    <article class="feature"><div class="ficon purple"><?= nav_icon('ai-chatbots') ?></div><h3>AI Chatbots</h3><p>Trained chatbots for support, sales and lead capture on your site.</p><a href="contact.php">Talk to us →</a></article>
    <article class="feature"><div class="ficon orange"><?= nav_icon('ai-api-integration') ?></div><h3>AI API Integration</h3><p>Connect your existing systems to AI models and services.</p><a href="contact.php">Talk to us →</a></article>
  </div>
</section>

<section class="plans" id="automation">
  <div class="section-head"><span class="eyebrow mint">AI AUTOMATION</span><h2>Automate the Repetitive Work</h2><p>Workflow automation that connects your tools and removes manual busywork.</p></div>
  <div class="features">
    <article class="feature"><div class="ficon blue"><?= nav_icon('ai-automation') ?></div><h3>AI Automation</h3><p>End-to-end automation for repetitive business processes.</p><a href="contact.php">Talk to us →</a></article>
    <article class="feature"><div class="ficon teal"><?= nav_icon('n8n-automation') ?></div><h3>n8n Automation</h3><p>Custom workflow automation built on n8n, hosted by WDH.</p><a href="contact.php">Talk to us →</a></article>
    <article class="feature"><div class="ficon pink"><?= nav_icon('ai-agents') ?></div><h3>AI Agents</h3><p>Autonomous AI agents that handle multi-step tasks for your team.</p><a href="contact.php">Talk to us →</a></article>
    <article class="feature"><div class="ficon green"><?= nav_icon('business-process-automation') ?></div><h3>Business Process Automation</h3><p>Map and automate your business's day-to-day workflows.</p><a href="contact.php">Talk to us →</a></article>
  </div>
</section>

<section class="plans" id="ai-hosting">
  <div class="section-head"><span class="eyebrow mint">AI INFRASTRUCTURE</span><h2>Hosting Built for AI Workloads</h2><p>Reliable, secured infrastructure to run your automation and AI tools around the clock.</p></div>
  <div class="features">
    <article class="feature"><div class="ficon blue"><?= nav_icon('ai-automation-hosting') ?></div><h3>AI Automation Hosting</h3><p>Managed hosting tuned for automation platforms and AI workloads.</p><a href="contact.php">Talk to us →</a></article>
    <article class="feature" id="n8n"><div class="ficon teal"><?= nav_icon('self-hosted-n8n') ?></div><h3>Self-Hosted n8n</h3><p>Your own private n8n instance, hosted, secured and maintained by WDH.</p><a href="contact.php">Talk to us →</a></article>
  </div>
</section>

<section class="plans" id="custom">
  <div class="section-head"><span class="eyebrow mint">CUSTOM AI</span><h2>Something More Specific in Mind?</h2><p>Tell us what you're trying to build — we'll scope a custom AI solution around it.</p></div>
  <div class="features">
    <article class="feature"><div class="ficon purple"><?= nav_icon('custom-ai-solutions') ?></div><h3>Custom AI Solutions</h3><p>Tailored AI development, automation and integration for unique needs.</p><a href="contact.php">Talk to us →</a></article>
  </div>
</section>

<section class="why-strip">
  <div><?= nav_icon('ai-agents') ?> <strong>Human-Reviewed AI</strong><small>Every build is checked by our team</small></div>
  <div><?= nav_icon('website-security') ?> <strong>Secure by Default</strong><small>Hosted on WDH infrastructure</small></div>
  <div><?= nav_icon('support') ?> <strong>24/7 Expert Support</strong><small>Real human support</small></div>
  <div><?= nav_icon('daily-backup') ?> <strong>Daily Backups</strong><small>Keep your data safe</small></div>
  <div><?= nav_icon('managed-vps') ?> <strong>Fully Managed</strong><small>We handle the maintenance</small></div>
</section>

</main>
<?php require __DIR__.'/includes/footer.php'; ?>
<script src="assets/js/app.js?v=wdh-ui-v8"></script>
</body></html>
