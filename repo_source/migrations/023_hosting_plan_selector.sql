-- Milestone 23: Hosting architecture and tab-based plan selector
-- Customer-facing hosting remains resource-based; reseller is separate for multi-site use.

INSERT INTO products(category,slug,name,short_description,monthly_price,yearly_price,currency,features_json,badge,active,sort_order) VALUES
('hosting','hosting-1gb','1GB Hosting','For one small website',199,2388,'BDT',JSON_ARRAY('1 Website','1 GB SSD/NVMe Storage','Fair Bandwidth','Free SSL Certificate','cPanel / AAA Hosting','Daily Backup'),NULL,1,1),
('hosting','hosting-2gb','2GB Hosting','For small business websites',299,3588,'BDT',JSON_ARRAY('1 Website','2 GB SSD/NVMe Storage','Fair Bandwidth','Free SSL Certificate','cPanel / AAA Hosting','Daily Backup'),NULL,1,2),
('hosting','hosting-3gb','3GB Hosting','Balanced hosting for growing sites',399,4788,'BDT',JSON_ARRAY('1 Website','3 GB SSD/NVMe Storage','Fair Bandwidth','Free SSL Certificate','cPanel / AAA Hosting','Daily Backup'),NULL,1,3),
('hosting','hosting-5gb','5GB Hosting','A practical business starter',499,5988,'BDT',JSON_ARRAY('1 Website','5 GB SSD/NVMe Storage','Fair Bandwidth','Free SSL Certificate','cPanel / AAA Hosting','Daily Backup'),NULL,1,4),
('hosting','hosting-7gb','7GB Hosting','More room for business websites',699,8388,'BDT',JSON_ARRAY('1 Website','7 GB SSD/NVMe Storage','Fair Bandwidth','Free SSL Certificate','cPanel / AAA Hosting','Daily Backup'),NULL,1,5),
('hosting','hosting-10gb','10GB Hosting','Ideal for growing business websites',990,11880,'BDT',JSON_ARRAY('1 Website','10 GB SSD/NVMe Storage','Fair Bandwidth','Free SSL Certificate','cPanel / AAA Hosting','Daily Backup','Priority Support'),'MOST POPULAR',1,6),
('hosting','hosting-15gb','15GB Hosting','For larger business websites',1290,15480,'BDT',JSON_ARRAY('1 Website','15 GB SSD/NVMe Storage','Fair Bandwidth','Free SSL Certificate','cPanel / AAA Hosting','Daily Backup','Priority Support'),NULL,1,7),
('hosting','hosting-25gb','25GB Hosting','More storage for busy websites',1990,23880,'BDT',JSON_ARRAY('1 Website','25 GB SSD/NVMe Storage','Fair Bandwidth','Free SSL Certificate','cPanel / AAA Hosting','Daily Backup','Priority Support'),NULL,1,8),
('hosting','hosting-50gb','50GB Hosting','Large business website storage',3490,41880,'BDT',JSON_ARRAY('1 Website','50 GB SSD/NVMe Storage','Fair Bandwidth','Free SSL Certificate','cPanel / AAA Hosting','Daily Backup','Priority Support'),NULL,1,9),
('business_hosting','business-100gb','100GB Business Hosting','High-capacity hosting for larger websites',5990,71880,'BDT',JSON_ARRAY('1 Website','100 GB SSD/NVMe Storage','Fair Bandwidth','Free SSL Certificate','cPanel / AAA Hosting','Daily Backup','Priority Support','Business Support'),NULL,1,10),
('business_hosting','business-200gb','200GB Business Hosting','Extra-large capacity for business workloads',10990,131880,'BDT',JSON_ARRAY('1 Website','200 GB SSD/NVMe Storage','Fair Bandwidth','Free SSL Certificate','cPanel / AAA Hosting','Daily Backup','Priority Support','Business Support'),NULL,1,11),
('business_hosting','business-300gb','300GB Business Hosting','Enterprise-sized website storage',14990,179880,'BDT',JSON_ARRAY('1 Website','300 GB SSD/NVMe Storage','Fair Bandwidth','Free SSL Certificate','cPanel / AAA Hosting','Daily Backup','Priority Support','Business Support','Custom Support'),NULL,1,12),
('reseller','reseller-10','Reseller 10','For agencies and multiple websites',2490,29880,'BDT',JSON_ARRAY('10 cPanel Accounts','25 GB WHM Storage','Fair Bandwidth','WHM + cPanel','Free SSL','Daily Backup','1 Account = 1 Website'),NULL,1,1),
('reseller','reseller-25','Reseller 25','For growing website portfolios',4490,53880,'BDT',JSON_ARRAY('25 cPanel Accounts','50 GB WHM Storage','Fair Bandwidth','WHM + cPanel','Free SSL','Daily Backup','1 Account = 1 Website'),'POPULAR',1,2),
('reseller','reseller-50','Reseller 50','For larger agencies and teams',7990,95880,'BDT',JSON_ARRAY('50 cPanel Accounts','100 GB WHM Storage','High Capacity Fair Bandwidth','WHM + cPanel','Free SSL','Daily Backup','1 Account = 1 Website'),NULL,1,3),
('reseller','reseller-100','Reseller 100','For serious resellers and agencies',12990,155880,'BDT',JSON_ARRAY('100 cPanel Accounts','200 GB WHM Storage','High Capacity Fair Bandwidth','WHM + cPanel','Free SSL','Daily Backup','1 Account = 1 Website'),NULL,1,4),
('reseller','reseller-200','Reseller 200','For high-volume reseller hosting',21990,263880,'BDT',JSON_ARRAY('200 cPanel Accounts','300 GB WHM Storage','High Capacity Fair Bandwidth','WHM + cPanel','Free SSL','Daily Backup','1 Account = 1 Website'),NULL,1,5)
ON DUPLICATE KEY UPDATE
 name=VALUES(name),short_description=VALUES(short_description),monthly_price=VALUES(monthly_price),yearly_price=VALUES(yearly_price),currency=VALUES(currency),features_json=VALUES(features_json),badge=VALUES(badge),active=VALUES(active),sort_order=VALUES(sort_order);

-- Existing demo plans are retained for compatibility but no longer promise unlimited resources/websites.
UPDATE products SET features_json=JSON_ARRAY('1 Website','10 GB SSD/NVMe Storage','Fair Bandwidth','Free SSL Certificate','cPanel / AAA Hosting','Daily Backup') WHERE slug='basic-hosting';
UPDATE products SET features_json=JSON_ARRAY('1 Website','50 GB SSD/NVMe Storage','Fair Bandwidth','Free SSL Certificate','cPanel / AAA Hosting','Daily Backup','Free Domain (1 Year)') WHERE slug='standard-hosting';
UPDATE products SET features_json=JSON_ARRAY('1 Website','100 GB SSD/NVMe Storage','Fair Bandwidth','Free SSL Certificate','cPanel / AAA Hosting','Daily Backup','Free Domain (1 Year)','Priority Support') WHERE slug='premium-hosting';
UPDATE products SET features_json=JSON_ARRAY('1 Website','200 GB SSD/NVMe Storage','Fair Bandwidth','Free SSL Certificate','cPanel / AAA Hosting','Daily Backup','Free Domain (1 Year)','Dedicated IP','Priority Support') WHERE slug='business-hosting';

-- Custom request UX additions: avoid the word "Unlimited" and capture sales budget/bandwidth preference.
SET @db := DATABASE();
SET @sql := (SELECT IF(COUNT(*)=0,
 'ALTER TABLE custom_hosting_requests ADD COLUMN bandwidth_mode VARCHAR(40) NULL AFTER requested_transfer_gb',
 'SELECT 1') FROM information_schema.columns WHERE table_schema=@db AND table_name='custom_hosting_requests' AND column_name='bandwidth_mode');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;
SET @sql := (SELECT IF(COUNT(*)=0,
 'ALTER TABLE custom_hosting_requests ADD COLUMN budget_amount DECIMAL(12,2) NULL AFTER billing_cycle',
 'SELECT 1') FROM information_schema.columns WHERE table_schema=@db AND table_name='custom_hosting_requests' AND column_name='budget_amount');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;
SET @sql := (SELECT IF(COUNT(*)=0,
 'ALTER TABLE custom_hosting_requests ADD COLUMN budget_currency CHAR(3) NULL AFTER budget_amount',
 'SELECT 1') FROM information_schema.columns WHERE table_schema=@db AND table_name='custom_hosting_requests' AND column_name='budget_currency');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;
