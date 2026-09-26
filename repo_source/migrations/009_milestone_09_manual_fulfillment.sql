-- WDH Milestone 09: Manual fulfillment and order operations
ALTER TABLE orders
  ADD COLUMN fulfillment_status VARCHAR(30) NOT NULL DEFAULT 'awaiting_payment',
  ADD COLUMN fulfillment_note VARCHAR(500) NULL,
  ADD COLUMN expected_delivery VARCHAR(120) NULL,
  ADD COLUMN fulfillment_started_at DATETIME NULL,
  ADD COLUMN fulfillment_completed_at DATETIME NULL,
  ADD COLUMN customer_notified_at DATETIME NULL;

ALTER TABLE provisioning_jobs
  ADD COLUMN fulfillment_mode VARCHAR(30) NOT NULL DEFAULT 'manual',
  ADD COLUMN provider_purchase_status VARCHAR(30) NOT NULL DEFAULT 'not_started',
  ADD COLUMN provider_purchase_cost DECIMAL(12,2) NULL,
  ADD COLUMN provider_order_reference VARCHAR(160) NULL,
  ADD COLUMN fulfillment_note VARCHAR(500) NULL,
  ADD COLUMN ready_at DATETIME NULL,
  ADD COLUMN customer_notified_at DATETIME NULL;

CREATE TABLE IF NOT EXISTS fulfillment_notes (
 id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
 order_id BIGINT UNSIGNED NOT NULL,
 admin_user_id BIGINT UNSIGNED NOT NULL,
 note_type VARCHAR(40) NOT NULL DEFAULT 'internal',
 note_text TEXT NOT NULL,
 created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(id), KEY idx_fulfillment_order(order_id), KEY idx_fulfillment_admin(admin_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Align existing paid orders with manual fulfillment.
UPDATE orders SET fulfillment_status='ready_for_fulfillment' WHERE status IN ('paid','active') AND fulfillment_status='awaiting_payment';
UPDATE orders SET fulfillment_status='cancelled' WHERE status='cancelled' AND fulfillment_status='awaiting_payment';
UPDATE orders SET fulfillment_status='refunded' WHERE status='refunded' AND fulfillment_status='awaiting_payment';
UPDATE provisioning_jobs SET fulfillment_mode='manual' WHERE fulfillment_mode IS NULL OR fulfillment_mode='';
