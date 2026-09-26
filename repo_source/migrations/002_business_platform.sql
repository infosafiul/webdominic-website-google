CREATE TABLE IF NOT EXISTS order_items (
 id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, order_id BIGINT UNSIGNED NOT NULL, item_type VARCHAR(30) NOT NULL, product_id BIGINT UNSIGNED NULL, domain_name VARCHAR(253) NULL, description VARCHAR(255) NOT NULL, unit_price DECIMAL(12,2) NOT NULL, currency CHAR(3) NOT NULL DEFAULT 'BDT', billing_cycle VARCHAR(20) NULL, quantity INT NOT NULL DEFAULT 1, created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(id), KEY idx_order_items_order(order_id), KEY idx_order_items_product(product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS fund_requests (
 id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, user_id BIGINT UNSIGNED NOT NULL, amount DECIMAL(12,2) NOT NULL, method VARCHAR(60) NOT NULL, transaction_id VARCHAR(120) NULL, sender_number VARCHAR(40) NULL, status VARCHAR(30) NOT NULL DEFAULT 'pending', admin_note VARCHAR(255) NULL, created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 PRIMARY KEY(id), KEY idx_fund_user(user_id), KEY idx_fund_status(status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS customer_services (
 id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, user_id BIGINT UNSIGNED NOT NULL, product_id BIGINT UNSIGNED NULL, service_name VARCHAR(160) NOT NULL, service_type VARCHAR(40) NOT NULL, domain_name VARCHAR(253) NULL, username VARCHAR(120) NULL, login_url VARCHAR(255) NULL, status VARCHAR(30) NOT NULL DEFAULT 'active', expires_at DATE NULL, created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 PRIMARY KEY(id), KEY idx_service_user(user_id), KEY idx_service_product(product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO products(category,slug,name,short_description,monthly_price,yearly_price,currency,features_json,badge,sort_order) VALUES
('email','business-email-basic','Business Email Basic','Professional email for your business',199,2388,'BDT',JSON_ARRAY('5 Mailboxes','10 GB Storage','Webmail Access','Spam Protection','Mobile Support'),NULL,1),
('email','business-email-pro','Business Email Pro','More storage and mailboxes for growing teams',499,5988,'BDT',JSON_ARRAY('25 Mailboxes','50 GB Storage','Webmail Access','Advanced Spam Protection','Mobile Support','Priority Support'),'POPULAR',2),
('security','website-security','Website Security','Protect your website and business data',499,5988,'BDT',JSON_ARRAY('Malware Monitoring','Security Hardening','Threat Alerts','Firewall Protection','Expert Support'),NULL,1),
('security','backup-recovery','Backup & Recovery','Reliable backups and disaster recovery support',399,4788,'BDT',JSON_ARRAY('Daily Backups','Offsite Storage','Restore Support','Retention Management'),NULL,2),
('service','wordpress-design','WordPress Website Design','Professional WordPress website design',5000,50000,'BDT',JSON_ARRAY('Responsive Design','WordPress Setup','Modern UI','Basic SEO','Launch Support'),NULL,1),
('service','website-maintenance','Website Maintenance','Ongoing website updates and maintenance',1500,15000,'BDT',JSON_ARRAY('Updates','Backups','Security Checks','Bug Fixing','Technical Support'),NULL,2),
('service','seo-service','SEO Optimization','On-page SEO and technical optimization',3000,30000,'BDT',JSON_ARRAY('On-page SEO','Technical SEO','Meta Optimization','Performance Review','Reporting'),NULL,3)
ON DUPLICATE KEY UPDATE name=VALUES(name),short_description=VALUES(short_description),monthly_price=VALUES(monthly_price),yearly_price=VALUES(yearly_price),currency=VALUES(currency),features_json=VALUES(features_json),badge=VALUES(badge),sort_order=VALUES(sort_order);
