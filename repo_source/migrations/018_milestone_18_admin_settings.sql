CREATE TABLE IF NOT EXISTS site_settings (
 id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
 setting_key VARCHAR(120) NOT NULL,
 setting_value TEXT NULL,
 setting_type VARCHAR(20) NOT NULL DEFAULT 'text',
 is_public TINYINT(1) NOT NULL DEFAULT 0,
 updated_by BIGINT UNSIGNED NULL,
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 PRIMARY KEY (id), UNIQUE KEY uq_site_setting_key(setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO site_settings (setting_key,setting_value,setting_type,is_public) VALUES
('business_name','WDH — Web Data Hosting','text',1),
('support_email','support@wdhdomain.com','email',1),
('support_phone','+1 (213) 986-7750','text',1),
('default_server_markup','40','number',0),
('default_service_currency','BDT','text',0),
('manual_fulfillment_enabled','1','boolean',0),
('domain_api_mode','demo','text',0),
('maintenance_mode','0','boolean',0)
ON DUPLICATE KEY UPDATE setting_key=VALUES(setting_key);
