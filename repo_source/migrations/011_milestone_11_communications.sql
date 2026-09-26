-- WDH Milestone 11: payment & customer communication operations
CREATE TABLE IF NOT EXISTS email_queue (
 id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
 user_id BIGINT UNSIGNED NULL,
 order_id BIGINT UNSIGNED NULL,
 service_id BIGINT UNSIGNED NULL,
 to_email VARCHAR(190) NOT NULL,
 subject VARCHAR(255) NOT NULL,
 body TEXT NOT NULL,
 email_type VARCHAR(60) NOT NULL DEFAULT 'general',
 status ENUM('queued','sent','failed','cancelled') NOT NULL DEFAULT 'queued',
 attempts INT UNSIGNED NOT NULL DEFAULT 0,
 last_error VARCHAR(500) NULL,
 sent_at DATETIME NULL,
 created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(id), KEY idx_email_queue_status(status,created_at), KEY idx_email_queue_user(user_id,created_at), KEY idx_email_queue_order(order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS communication_log (
 id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
 user_id BIGINT UNSIGNED NULL,
 admin_user_id BIGINT UNSIGNED NULL,
 order_id BIGINT UNSIGNED NULL,
 service_id BIGINT UNSIGNED NULL,
 channel ENUM('email','portal') NOT NULL DEFAULT 'portal',
 direction ENUM('outbound','inbound','system') NOT NULL DEFAULT 'system',
 subject VARCHAR(255) NULL,
 message TEXT NOT NULL,
 created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(id), KEY idx_comm_user(user_id,created_at), KEY idx_comm_order(order_id,created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
