-- WDH Milestone 12: automated service lifecycle / expiry processing
CREATE TABLE IF NOT EXISTS service_lifecycle_log (
 id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
 service_id BIGINT UNSIGNED NOT NULL,
 user_id BIGINT UNSIGNED NOT NULL,
 event_type VARCHAR(50) NOT NULL,
 event_date DATE NOT NULL,
 details VARCHAR(500) NULL,
 created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(id),
 UNIQUE KEY uq_service_lifecycle_event(service_id,event_type,event_date),
 KEY idx_lifecycle_user(user_id,created_at),
 KEY idx_lifecycle_type(event_type,created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET @db := DATABASE();
SET @sql := (SELECT IF(COUNT(*)=0,'ALTER TABLE customer_services ADD KEY idx_service_lifecycle(status,expires_at,user_id)','SELECT 1') FROM information_schema.statistics WHERE table_schema=@db AND table_name='customer_services' AND index_name='idx_service_lifecycle');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;
