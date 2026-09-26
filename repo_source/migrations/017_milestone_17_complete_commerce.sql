-- WDH Milestone 17: complete commerce-flow integration
SET @db := DATABASE();
SET @sql := (SELECT IF(COUNT(*)=0,
 'ALTER TABLE order_items ADD COLUMN product_category VARCHAR(40) NULL AFTER product_id',
 'SELECT 1') FROM information_schema.columns WHERE table_schema=@db AND table_name='order_items' AND column_name='product_category');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

SET @sql := (SELECT IF(COUNT(*)=0,
 'ALTER TABLE customer_services ADD COLUMN service_reference VARCHAR(160) NULL AFTER domain_name',
 'SELECT 1') FROM information_schema.columns WHERE table_schema=@db AND table_name='customer_services' AND column_name='service_reference');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

-- Backfill product category for existing product order items where possible.
UPDATE order_items oi
LEFT JOIN products p ON p.id=oi.product_id
SET oi.product_category=COALESCE(oi.product_category,p.category,oi.item_type)
WHERE oi.product_category IS NULL;
