<?php
// WDH Milestone 12 — daily service lifecycle worker.
// Run from CLI only: php /home/CPANELUSER/public_html/cron/process-service-lifecycle.php
if (PHP_SAPI !== 'cli') { http_response_code(403); exit("CLI only.\n"); }
require_once dirname(__DIR__).'/includes/bootstrap.php';
if (!$db) { fwrite(STDERR,"Database unavailable.\n"); exit(1); }

$today = new DateTimeImmutable('today');
$processed = 0; $expired = 0; $reminders = 0; $errors = 0;

function lifecycle_event(PDO $db, int $serviceId, int $userId, string $type, string $date, string $details=''): bool {
    $st=$db->prepare('INSERT IGNORE INTO service_lifecycle_log(service_id,user_id,event_type,event_date,details) VALUES(?,?,?,?,?)');
    $st->execute([$serviceId,$userId,$type,$date,$details]);
    return $st->rowCount() > 0;
}
function lifecycle_customer(PDO $db, array $service, string $type, string $title, string $message, string $link): void {
    $uid=(int)$service['user_id'];
    $date=date('Y-m-d');
    $unique='lifecycle-'.$type.'-'.(int)$service['id'].'-'.$date;
    wdh_notify($db,$uid,$type,$title,$message,$link,$unique);
    $user=['id'=>$uid,'email'=>$service['email']??''];
    if (!empty($user['email'])) {
        wdh_queue_email($db,$user['email'],$title.' — WDH',$message.'\n\nOpen your WDH portal: '.$link,$type,$uid,null,(int)$service['id']);
    }
    wdh_log_communication($db,$message,$title,$uid,null,null,(int)$service['id'],'portal','system');
}

try {
    $rows=$db->query("SELECT cs.*,u.email FROM customer_services cs LEFT JOIN users u ON u.id=cs.user_id WHERE cs.expires_at IS NOT NULL AND cs.status IN ('active','expired') ORDER BY cs.id")->fetchAll();
    foreach($rows as $service){
        $processed++;
        $sid=(int)$service['id']; $uid=(int)$service['user_id'];
        try {
            $expiry=new DateTimeImmutable($service['expires_at']);
            $days=(int)$today->diff($expiry)->format('%r%a');
            if ($days < 0 && strtolower($service['status'])==='active') {
                $db->beginTransaction();
                $db->prepare("UPDATE customer_services SET status='expired' WHERE id=? AND status='active'")->execute([$sid]);
                $changed=lifecycle_event($db,$sid,$uid,'expired',$today->format('Y-m-d'),'Service automatically marked expired.');
                $db->commit();
                if($changed){
                    lifecycle_customer($db,$service,'service_expired','Service Expired','Your service "'.($service['service_name']??'Service').'" has expired. Please renew it to continue service availability.','my-services.php');
                    $expired++;
                }
                continue;
            }
            if ($days===7 || $days===30) {
                $type=$days===7?'service_expiry_7':'service_expiry_30';
                if(lifecycle_event($db,$sid,$uid,$type,$today->format('Y-m-d'),'Expiry reminder sent for '.$days.' days remaining.')){
                    lifecycle_customer($db,$service,$type,$days===7?'Service Expires in 7 Days':'Service Renewal Reminder','Your service "'.($service['service_name']??'Service').'" expires in '.$days.' days. Please renew before the expiry date.','renew-service.php?id='.$sid);
                    $reminders++;
                }
            }
        } catch(Throwable $e){ $errors++; }
    }
} catch(Throwable $e){ fwrite(STDERR,$e->getMessage()."\n"); exit(1); }

echo "Processed: $processed | Expired: $expired | Reminders: $reminders | Errors: $errors\n";
