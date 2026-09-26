<?php
// WDH CLI email queue worker. Run from cron, not from the browser.
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require_once __DIR__.'/../includes/bootstrap.php';
if (!$db) exit(1);
$st=$db->query("SELECT id FROM email_queue WHERE status IN ('queued','failed') AND attempts < 5 ORDER BY id ASC LIMIT 25");
foreach($st->fetchAll(PDO::FETCH_COLUMN) as $id){ wdh_process_email($db,(int)$id); }
