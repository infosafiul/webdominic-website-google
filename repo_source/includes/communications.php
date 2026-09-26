<?php
function wdh_queue_email($db,$to,$subject,$body,$type='general',$userId=null,$orderId=null,$serviceId=null){
    if(!$db || !filter_var($to,FILTER_VALIDATE_EMAIL) || trim($subject)==='' || trim($body)==='') return false;
    try{
        $st=$db->prepare('INSERT INTO email_queue(user_id,order_id,service_id,to_email,subject,body,email_type,status) VALUES(?,?,?,?,?,?,?,?)');
        $st->execute([$userId?(int)$userId:null,$orderId?(int)$orderId:null,$serviceId?(int)$serviceId:null,$to,trim($subject),$body,$type,'queued']);
        return (int)$db->lastInsertId();
    }catch(Throwable $e){return false;}
}
function wdh_log_communication($db,$message,$subject=null,$userId=null,$adminUserId=null,$orderId=null,$serviceId=null,$channel='portal',$direction='system'){
    if(!$db || trim($message)==='') return false;
    try{$st=$db->prepare('INSERT INTO communication_log(user_id,admin_user_id,order_id,service_id,channel,direction,subject,message) VALUES(?,?,?,?,?,?,?,?)');$st->execute([$userId?(int)$userId:null,$adminUserId?(int)$adminUserId:null,$orderId?(int)$orderId:null,$serviceId?(int)$serviceId:null,$channel,$direction,$subject,$message]);return true;}catch(Throwable $e){return false;}
}
function wdh_customer_message($db,$user,$title,$message,$link=null,$type='general',$orderId=null,$serviceId=null){
    if(!$user || empty($user['id'])) return false;
    $uid=(int)$user['id']; wdh_notify($db,$uid,$type,$title,$message,$link);
    $body=$title."\n\n".$message.($link?"\n\nOpen in your WDH portal: ".$link:'');
    $emailId=wdh_queue_email($db,$user['email']??'',$title.' — WDH',$body,$type,$uid,$orderId,$serviceId);
    wdh_log_communication($db,$message,$title,$uid,null,$orderId,$serviceId,'portal','system');
    return $emailId;
}
function wdh_process_email($db,$id){
    if(!$db || !$id) return false;
    try{
        $st=$db->prepare('SELECT * FROM email_queue WHERE id=?');$st->execute([(int)$id]);$row=$st->fetch();if(!$row)return false;
        if($row['status']==='sent')return true;
        $db->prepare("UPDATE email_queue SET attempts=attempts+1 WHERE id=?")->execute([$id]);
        $headers="MIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nFrom: WDH Support <support@wdhdomain.com>\r\n";
        $ok=function_exists('mail') ? @mail($row['to_email'],$row['subject'],$row['body'],$headers) : false;
        if($ok){$db->prepare("UPDATE email_queue SET status='sent',sent_at=NOW(),last_error=NULL WHERE id=?")->execute([$id]);return true;}
        $db->prepare("UPDATE email_queue SET status='failed',last_error=? WHERE id=?")->execute(['PHP mail() could not deliver the message on this server.',$id]);return false;
    }catch(Throwable $e){try{$db->prepare("UPDATE email_queue SET status='failed',last_error=? WHERE id=?")->execute([substr($e->getMessage(),0,500),$id]);}catch(Throwable $ignore){}return false;}
}
