-- WDH Milestone 21: Domain Management + Support Ticketing + Live Chat integration

CREATE TABLE IF NOT EXISTS login_activity (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  event_type VARCHAR(40) NOT NULL,
  ip_address VARCHAR(45) NULL,
  user_agent VARCHAR(500) NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id), KEY idx_login_activity_user(user_id,created_at), KEY idx_login_activity_event(event_type,created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS domain_services (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  customer_service_id BIGINT UNSIGNED NOT NULL,
  registrar_name VARCHAR(120) NOT NULL DEFAULT 'Manual Registrar',
  registrar_url VARCHAR(255) NULL,
  registration_date DATE NULL,
  expiry_date DATE NULL,
  nameserver1 VARCHAR(255) NULL,
  nameserver2 VARCHAR(255) NULL,
  nameserver3 VARCHAR(255) NULL,
  nameserver4 VARCHAR(255) NULL,
  auto_renew TINYINT(1) NOT NULL DEFAULT 0,
  domain_lock TINYINT(1) NOT NULL DEFAULT 1,
  epp_code_enc TEXT NULL,
  registrar_login_url VARCHAR(255) NULL,
  internal_purchase_reference VARCHAR(160) NULL,
  internal_notes_enc TEXT NULL,
  customer_notes VARCHAR(1000) NULL,
  updated_by BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_domain_service(customer_service_id),
  KEY idx_domain_expiry(expiry_date),
  KEY idx_domain_registrar(registrar_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO domain_services(customer_service_id,registrar_name,domain_lock)
SELECT cs.id, 'Manual Registrar', 1 FROM customer_services cs
LEFT JOIN domain_services ds ON ds.customer_service_id=cs.id
WHERE LOWER(cs.service_type)='domain' AND ds.id IS NULL;

CREATE TABLE IF NOT EXISTS domain_transfer_requests (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  customer_service_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'requested',
  note TEXT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(id), KEY idx_domain_transfer_service(customer_service_id), KEY idx_domain_transfer_user(user_id), KEY idx_domain_transfer_status(status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS support_tickets (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ticket_number VARCHAR(40) NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  service_id BIGINT UNSIGNED NULL,
  order_id BIGINT UNSIGNED NULL,
  category VARCHAR(60) NOT NULL DEFAULT 'general',
  priority VARCHAR(20) NOT NULL DEFAULT 'normal',
  subject VARCHAR(200) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'open',
  assigned_admin_id BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  closed_at DATETIME NULL,
  PRIMARY KEY(id), UNIQUE KEY uq_ticket_number(ticket_number),
  KEY idx_ticket_user(user_id,updated_at), KEY idx_ticket_status(status,priority,updated_at), KEY idx_ticket_service(service_id), KEY idx_ticket_order(order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS support_ticket_messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ticket_id BIGINT UNSIGNED NOT NULL,
  sender_user_id BIGINT UNSIGNED NULL,
  sender_admin_id BIGINT UNSIGNED NULL,
  sender_role VARCHAR(20) NOT NULL DEFAULT 'client',
  message TEXT NOT NULL,
  is_internal TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id), KEY idx_ticket_messages(ticket_id,created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS support_ticket_attachments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ticket_id BIGINT UNSIGNED NOT NULL,
  message_id BIGINT UNSIGNED NULL,
  user_id BIGINT UNSIGNED NULL,
  admin_id BIGINT UNSIGNED NULL,
  original_name VARCHAR(255) NOT NULL,
  stored_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(120) NOT NULL,
  file_size BIGINT UNSIGNED NOT NULL,
  sha256 CHAR(64) NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id), KEY idx_ticket_attachments(ticket_id,created_at), KEY idx_attachment_message(message_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS support_ticket_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ticket_id BIGINT UNSIGNED NOT NULL,
  actor_user_id BIGINT UNSIGNED NULL,
  actor_admin_id BIGINT UNSIGNED NULL,
  event_type VARCHAR(50) NOT NULL,
  details VARCHAR(1000) NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id), KEY idx_ticket_events(ticket_id,created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS site_settings (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  setting_key VARCHAR(120) NOT NULL,
  setting_value TEXT NULL,
  setting_type VARCHAR(30) NOT NULL DEFAULT 'text',
  is_public TINYINT(1) NOT NULL DEFAULT 0,
  updated_by BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(id), UNIQUE KEY uq_site_setting(setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO site_settings(setting_key,setting_value,setting_type,is_public)
VALUES
 ('live_chat_provider','tawk','text',1),
 ('live_chat_property_id','','text',1),
 ('live_chat_widget_id','default','text',1),
 ('live_chat_enabled','1','boolean',1);
