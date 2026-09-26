<?php
function provisioning_type(string $itemType): string {
    return match ($itemType) {
        'domain' => 'domain_registration',
        'hosting' => 'hosting_provision',
        'server', 'vps', 'dedicated' => 'server_provision',
        'email' => 'email_provision',
        default => 'service_activation',
    };
}
function provisioning_provider(string $itemType): string {
    return $itemType === 'domain' ? 'resellerclub' : 'manual';
}
function queue_order_provisioning(PDO $db, int $orderId): int {
    $st=$db->prepare('SELECT o.user_id, oi.* FROM orders o JOIN order_items oi ON oi.order_id=o.id WHERE o.id=? ORDER BY oi.id');
    $st->execute([$orderId]); $items=$st->fetchAll(); $count=0;
    foreach($items as $it){
        $exists=$db->prepare('SELECT id FROM provisioning_jobs WHERE order_item_id=? LIMIT 1'); $exists->execute([$it['id']]);
        if($exists->fetchColumn()) continue;
        $job=$db->prepare('INSERT INTO provisioning_jobs(order_id,order_item_id,user_id,job_type,provider,status) VALUES(?,?,?,?,?,?)');
        $job->execute([$orderId,$it['id'],$it['user_id'],provisioning_type($it['item_type']),provisioning_provider($it['item_type']),'queued']); $count++;
    }
    return $count;
}
function provision_job(PDO $db, int $jobId): array {
    $db->beginTransaction();
    try {
        $st=$db->prepare('SELECT * FROM provisioning_jobs WHERE id=? FOR UPDATE'); $st->execute([$jobId]); $job=$st->fetch();
        if(!$job) throw new RuntimeException('Provisioning job not found.');
        if(in_array($job['status'],['completed','cancelled'],true)){ $db->commit(); return ['ok'=>true,'message'=>'Job already completed or cancelled.']; }
        $db->prepare("UPDATE provisioning_jobs SET status='processing', attempts=attempts+1, started_at=NOW(), error_message=NULL WHERE id=?")->execute([$jobId]);
        $st=$db->prepare('SELECT oi.*,o.order_number,o.currency FROM order_items oi JOIN orders o ON o.id=oi.order_id WHERE oi.id=?'); $st->execute([$job['order_item_id']]); $item=$st->fetch();
        if(!$item) throw new RuntimeException('Order item not found.');
        // External provisioning is deliberately not executed without provider credentials/API setup.
        // For non-domain products, we can safely create the customer service record for Admin to configure.
        if($item['item_type']==='domain') {
            // Domain availability is checked at cart time. Actual registration is intentionally
            // a fulfillment action so WDH can verify payment and purchase through its registrar.
            // Never mark a domain as externally registered unless an explicit external reference is recorded.
            $exists=$db->prepare('SELECT id FROM customer_services WHERE user_id=? AND service_name=? AND domain_name <=> ? LIMIT 1');
            $exists->execute([$job['user_id'],$item['description'],$item['domain_name'] ?? null]);
            $serviceId=$exists->fetchColumn();
            if(!$serviceId){
                $expiry=date('Y-m-d',strtotime('+1 year'));
                $ins=$db->prepare('INSERT INTO customer_services(user_id,product_id,service_name,service_type,domain_name,service_reference,status,expires_at,renewal_price,renewal_currency,renewal_cycle,notes) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)');
                $ins->execute([$job['user_id'],$item['product_id'] ?: null,$item['description'],'domain',$item['domain_name'] ?? null,'ORD-'.$item['order_number'],'pending_setup',$expiry,$item['unit_price'],$item['currency'],'yearly','Domain order awaiting registrar fulfillment for '.$item['order_number'].'.']);
                $serviceId=(int)$db->lastInsertId();
            }
            $db->prepare("UPDATE provisioning_jobs SET service_id=?, status='queued', external_reference=NULL WHERE id=?")->execute([$serviceId,$jobId]);
            // Every domain service gets a dedicated management record. Actual registrar purchase,
            // registration dates, nameservers and EPP/Auth code are filled by Admin after manual fulfillment.
            $db->prepare('INSERT IGNORE INTO domain_services(customer_service_id,registrar_name,domain_lock) VALUES(?,?,1)')
                ->execute([$serviceId, 'Manual Registrar']);
            $db->commit(); return ['ok'=>true,'message'=>'Domain fulfillment record prepared. Registrar registration remains a manual Admin action.'];
        } else {
            $type = provisioning_type($item['item_type']);
            $serviceType = match($item['item_type']) { 'hosting'=>'hosting', 'server'=>'server', 'vps'=>'server', 'dedicated'=>'server', 'email'=>'email', default=>'service' };
            $exists=$db->prepare('SELECT id FROM customer_services WHERE user_id=? AND service_name=? AND domain_name <=> ? LIMIT 1');
            $exists->execute([$job['user_id'],$item['description'],$item['domain_name'] ?? null]);
            $serviceId=$exists->fetchColumn();
            if(!$serviceId){
                $cycle=$item['billing_cycle'] ?: 'monthly';
                $expiry = $cycle==='yearly' ? date('Y-m-d',strtotime('+1 year')) : date('Y-m-d',strtotime('+1 month'));
                $ins=$db->prepare('INSERT INTO customer_services(user_id,product_id,service_name,service_type,domain_name,service_reference,status,expires_at,renewal_price,renewal_currency,renewal_cycle,notes) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)');
                $ins->execute([$job['user_id'],$item['product_id'] ?: null,$item['description'],$serviceType,$item['domain_name'] ?? null,'ORD-'.$item['order_number'],'pending_setup',$expiry,$item['unit_price'],$item['currency'],$cycle,'Created from paid order '.$item['order_number'].'. Configure login details/provisioning from Admin Services.']);
                $serviceId=(int)$db->lastInsertId();
            }
            $db->prepare('UPDATE provisioning_jobs SET service_id=? WHERE id=?')->execute([$serviceId,$jobId]);
        }
        $db->prepare("UPDATE provisioning_jobs SET status='completed', completed_at=NOW(), external_reference=? WHERE id=?")->execute(['PENDING-EXTERNAL-'.$jobId,$jobId]);
        $db->commit(); return ['ok'=>true,'message'=>'Provisioning job completed. External provider activation can now be recorded.'];
    } catch(Throwable $e){ if($db->inTransaction())$db->rollBack(); $db->prepare("UPDATE provisioning_jobs SET status='failed', error_message=?, updated_at=NOW() WHERE id=?")->execute([substr($e->getMessage(),0,255),$jobId]); return ['ok'=>false,'message'=>$e->getMessage()]; }
}
