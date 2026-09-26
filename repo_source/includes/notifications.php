<?php
function wdh_notify($db,$userId,$type,$title,$message,$linkUrl=null,$uniqueKey=null){
    if(!$db || !$userId || trim($title)==='' || trim($message)==='') return false;
    try{
        if($uniqueKey){
            $st=$db->prepare('INSERT IGNORE INTO notifications(user_id,type,title,message,link_url,unique_key) VALUES(?,?,?,?,?,?)');
            return $st->execute([(int)$userId,$type,$title,$message,$linkUrl,$uniqueKey]);
        }
        $st=$db->prepare('INSERT INTO notifications(user_id,type,title,message,link_url) VALUES(?,?,?,?,?)');
        return $st->execute([(int)$userId,$type,$title,$message,$linkUrl]);
    }catch(Throwable $e){ return false; }
}
function wdh_notify_service_lifecycle($db,$service){
    if(!$db || !$service || empty($service['user_id']) || empty($service['id'])) return;
    $id=(int)$service['id']; $uid=(int)$service['user_id'];
    $status=strtolower((string)($service['status']??''));
    if($status==='active' && !empty($service['expires_at'])){
        try{
            $days=(int)floor((strtotime($service['expires_at'])-strtotime(date('Y-m-d')))/86400);
            if($days < 0){
                wdh_notify($db,$uid,'service_expired','Service expired','Your service "'.($service['service_name']??'Service').'" has expired. Please renew it if you want to continue using it.','my-services.php','service-expired-'.$id.'-'.date('Y-m-d',strtotime($service['expires_at'])));
            } elseif($days <= 7){
                wdh_notify($db,$uid,'service_expiry','Service expires soon','Your service "'.($service['service_name']??'Service').'" expires in '.$days.' day(s).','renew-service.php?id='.$id,'service-expiry-7-'.$id.'-'.date('Y-m-d'));
            } elseif($days <= 30){
                wdh_notify($db,$uid,'service_expiry','Service renewal reminder','Your service "'.($service['service_name']??'Service').'" expires in '.$days.' days.','renew-service.php?id='.$id,'service-expiry-30-'.$id.'-'.date('Y-m-d'));
            }
        }catch(Throwable $e){}
    }
}
function wdh_unread_notifications($db,$uid){
    if(!$db || !$uid) return 0; try{$st=$db->prepare('SELECT COUNT(*) FROM notifications WHERE user_id=? AND is_read=0');$st->execute([(int)$uid]);return (int)$st->fetchColumn();}catch(Throwable $e){return 0;}
}
