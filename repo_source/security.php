<?php
require_once __DIR__.'/includes/bootstrap.php'; require_login();
$u=current_user(); $error=''; $notice='';
if(is_post()){
  verify_csrf();
  try{
    $action=$_POST['action']??'';
    if($action==='password'){
      $current=$_POST['current_password']??''; $new=$_POST['new_password']??''; $confirm=$_POST['confirm_password']??'';
      $st=$db->prepare('SELECT password_hash FROM users WHERE id=? LIMIT 1'); $st->execute([(int)$u['id']]); $row=$st->fetch();
      if(!$row || !password_verify($current,$row['password_hash'])) throw new RuntimeException('Your current password is incorrect.');
      if(!password_is_strong($new)) throw new RuntimeException('New password must be at least 10 characters and include uppercase, lowercase and a number.');
      if($new!==$confirm) throw new RuntimeException('New passwords do not match.');
      if(password_verify($new,$row['password_hash'])) throw new RuntimeException('Choose a different password.');
      $st=$db->prepare('UPDATE users SET password_hash=? WHERE id=?'); $st->execute([password_hash($new,PASSWORD_DEFAULT),(int)$u['id']]);
      record_login_activity($db,(int)$u['id'],'password_changed');
      session_regenerate_id(true); $notice='Password changed successfully. Please use your new password next time you sign in.';
    } elseif($action==='logout_all') {
      record_login_activity($db,(int)$u['id'],'logout_all_requested');
      session_regenerate_id(true); $notice='Other active browser sessions cannot be remotely invalidated by this release; your current session remains active.';
    }
  }catch(Throwable $e){$error=$e->getMessage();}
}
$activities=[];
try{$st=$db->prepare('SELECT event_type,ip_address,user_agent,created_at FROM login_activity WHERE user_id=? ORDER BY id DESC LIMIT 10');$st->execute([(int)$u['id']]);$activities=$st->fetchAll();}catch(Throwable $e){}
?><!doctype html><html lang="<?=e($LANG)?>"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Security — WDH</title><link rel="stylesheet" href="assets/css/style.css?v=wdh-ui-v8"><link rel="stylesheet" href="assets/css/catalog.css?v=wdh-ui-v8"></head><body><?php require __DIR__.'/includes/header.php';?><main class="simple-page"><div class="breadcrumbs">Home › Client Portal › Security</div><div class="portal-welcome"><div><span class="eyebrow mint">ACCOUNT SECURITY</span><h1>Security &amp; Login Activity</h1><p>Keep your account protected and review recent sign-in activity.</p></div></div><?php if($notice):?><div class="alert success-alert"><?=e($notice)?></div><?php endif;?><?php if($error):?><div class="alert error"><?=e($error)?></div><?php endif;?><div class="dashboard-grid"><section class="cart-card"><span class="eyebrow mint">PASSWORD</span><h2>Change your password</h2><p>Use a strong, unique password for your WDH account.</p><form method="post"><?=csrf_field()?><input type="hidden" name="action" value="password"><label>Current Password<input type="password" name="current_password" autocomplete="current-password" required></label><label>New Password<input type="password" name="new_password" autocomplete="new-password" minlength="10" required></label><label>Confirm New Password<input type="password" name="confirm_password" autocomplete="new-password" minlength="10" required></label><button class="btn primary">Change Password →</button></form></section><section class="cart-card"><span class="eyebrow mint">SECURITY ACTIVITY</span><h2>Recent activity</h2><p>Recent security events associated with your account.</p><?php if(!$activities):?><div class="alert">No recent security activity recorded.</div><?php else:?><div style="overflow:auto"><table class="data-table"><thead><tr><th>Event</th><th>IP</th><th>Date</th></tr></thead><tbody><?php foreach($activities as $a):?><tr><td><?=e(ucwords(str_replace('_',' ',$a['event_type'])))?></td><td><?=e($a['ip_address']??'—')?></td><td><?=e($a['created_at'])?></td></tr><?php endforeach;?></tbody></table></div><?php endif;?></section></div></main><?php require __DIR__.'/includes/footer.php';?></body></html>
