-- WDH Milestone 10: customer notifications, credential audit and service lifecycle
CREATE TABLE IF NOT EXISTS notifications (
 id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
 user_id BIGINT UNSIGNED NOT NULL,
 type VARCHAR(40) NOT NULL DEFAULT 'general',
 title VARCHAR(180) NOT NULL,
 message TEXT NOT NULL,
 link_url VARCHAR(255) NULL,
 unique_key VARCHAR(190) NULL,
 is_read TINYINT(1) NOT NULL DEFAULT 0,
 created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
 read_at DATETIME NULL,
 PRIMARY KEY(id), KEY idx_notifications_user(user_id,is_read,created_at), UNIQUE KEY uq_notifications_unique(unique_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS service_credential_audit (
 id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
 service_id BIGINT UNSIGNED NOT NULL,
 admin_user_id BIGINT UNSIGNED NOT NULL,
 changed_fields VARCHAR(500) NOT NULL,
 created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(id), KEY idx_service_audit(service_id,created_at), KEY idx_service_audit_admin(admin_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET @db := DATABASE();
SET @sql := (SELECT IF(COUNT(*)=0,'ALTER TABLE customer_services ADD COLUMN activated_at DATETIME NULL AFTER status','SELECT 1') FROM information_schema.columns WHERE table_schema=@db AND table_name='customer_services' AND column_name='activated_at'); PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;
SET @sql := (SELECT IF(COUNT(*)=0,'ALTER TABLE customer_services ADD COLUMN last_credential_update_at DATETIME NULL AFTER activated_at','SELECT 1') FROM information_schema.columns WHERE table_schema=@db AND table_name='customer_services' AND column_name='last_credential_update_at'); PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;
UPDATE customer_services SET activated_at=COALESCE(activated_at,created_at) WHERE status='active';
