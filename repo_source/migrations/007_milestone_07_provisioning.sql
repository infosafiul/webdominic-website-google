-- WDH Milestone 07: service provisioning workflow
CREATE TABLE IF NOT EXISTS provisioning_jobs (
 id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
 order_id BIGINT UNSIGNED NOT NULL,
 order_item_id BIGINT UNSIGNED NULL,
 user_id BIGINT UNSIGNED NOT NULL,
 service_id BIGINT UNSIGNED NULL,
 job_type VARCHAR(40) NOT NULL,
 provider VARCHAR(80) NOT NULL DEFAULT 'manual',
 status VARCHAR(30) NOT NULL DEFAULT 'queued',
 attempts INT NOT NULL DEFAULT 0,
 external_reference VARCHAR(160) NULL,
 error_message VARCHAR(255) NULL,
 admin_note VARCHAR(255) NULL,
 queued_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
 started_at DATETIME NULL,
 completed_at DATETIME NULL,
 updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 PRIMARY KEY(id), KEY idx_prov_status(status), KEY idx_prov_order(order_id), KEY idx_prov_user(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
