SET @db := DATABASE();
SET @sql := (SELECT IF(COUNT(*)=0,'ALTER TABLE customer_services ADD KEY idx_service_status_expiry(status,expires_at)','SELECT 1') FROM information_schema.statistics WHERE table_schema=@db AND table_name='customer_services' AND index_name='idx_service_status_expiry'); PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;
