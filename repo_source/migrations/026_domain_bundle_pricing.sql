-- Migration 026: Domain + hosting/website bundle pricing
-- These are nullable on purpose: a TLD only shows a bundle hint once an
-- admin has actually set a bundle price for it. Leave both NULL to keep
-- that TLD showing its normal price only.
--
-- hosting_bundle_price          = domain's first-year price if hosting is also purchased
-- hosting_website_bundle_price  = domain's first-year price if hosting + a website plan are also purchased

ALTER TABLE domain_pricing ADD COLUMN hosting_bundle_price DECIMAL(10,2) DEFAULT NULL AFTER registration_price;
ALTER TABLE domain_pricing ADD COLUMN hosting_website_bundle_price DECIMAL(10,2) DEFAULT NULL AFTER hosting_bundle_price;

-- Confirmed policy, applied to every active TLD automatically:
--   with hosting            = registration price minus ৳100 (never below ৳0)
--   with hosting + website  = 50% of registration price
UPDATE domain_pricing
SET
    hosting_bundle_price = GREATEST(registration_price - 100, 0),
    hosting_website_bundle_price = ROUND(registration_price * 0.5, 2)
WHERE active = 1;

-- To override a specific TLD with a custom amount later, e.g.:
-- UPDATE domain_pricing SET hosting_bundle_price=1650, hosting_website_bundle_price=875 WHERE tld='.com';
