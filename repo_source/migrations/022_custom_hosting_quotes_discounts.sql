-- WDH Milestone 22: Custom Hosting Quotes + Per-Order Negotiated Discounts
CREATE TABLE IF NOT EXISTS custom_hosting_requests (
 id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
 user_id BIGINT UNSIGNED NOT NULL,
 domain_name VARCHAR(253) NULL,
 requested_storage_gb DECIMAL(12,2) NOT NULL DEFAULT 0,
 requested_transfer_gb DECIMAL(12,2) NULL,
 requested_websites INT NULL,
 requested_mailboxes INT NULL,
 control_panel VARCHAR(80) NULL,
 management_type VARCHAR(40) NOT NULL DEFAULT 'managed',
 billing_cycle VARCHAR(20) NOT NULL DEFAULT 'monthly',
 requirements TEXT NULL,
 status VARCHAR(30) NOT NULL DEFAULT 'submitted',
 admin_note TEXT NULL,
 quoted_price DECIMAL(12,2) NULL,
 quoted_currency CHAR(3) NULL,
 quoted_product_name VARCHAR(160) NULL,
 quoted_at DATETIME NULL,
 converted_order_id BIGINT UNSIGNED NULL,
 created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 PRIMARY KEY(id),
 KEY idx_custom_hosting_user(user_id,created_at),
 KEY idx_custom_hosting_status(status,created_at),
 KEY idx_custom_hosting_order(converted_order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_discounts (
 id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
 order_id BIGINT UNSIGNED NOT NULL,
 admin_user_id BIGINT UNSIGNED NOT NULL,
 discount_type VARCHAR(20) NOT NULL DEFAULT 'fixed',
 discount_value DECIMAL(12,2) NOT NULL DEFAULT 0,
 discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
 reason VARCHAR(255) NULL,
 created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(id),
 UNIQUE KEY uq_order_discount(order_id),
 KEY idx_discount_admin(admin_user_id,created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET @db := DATABASE();
SET @sql := (SELECT IF(COUNT(*)=0,
 'ALTER TABLE invoices ADD COLUMN discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0 AFTER tax',
 'SELECT 1') FROM information_schema.columns WHERE table_schema=@db AND table_name='invoices' AND column_name='discount_amount');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

SET @sql := (SELECT IF(COUNT(*)=0,
 'ALTER TABLE orders ADD COLUMN discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0 AFTER total',
 'SELECT 1') FROM information_schema.columns WHERE table_schema=@db AND table_name='orders' AND column_name='discount_amount');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;
