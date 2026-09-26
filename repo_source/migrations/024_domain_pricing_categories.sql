-- Migration 024: Add TLD categories + full pricing list
-- Run this once. If you see "Duplicate column name 'category'" on the ALTER
-- TABLE line, that just means this migration was already applied — you can
-- skip that one line and still run the INSERT block safely (it's idempotent).

ALTER TABLE domain_pricing ADD COLUMN category VARCHAR(40) DEFAULT NULL AFTER description;
ALTER TABLE domain_pricing ADD INDEX idx_domain_category (category);

-- 1. Popular Domains / জনপ্রিয় ডোমেইন
INSERT INTO domain_pricing (tld, registration_price, renewal_price, transfer_price, currency, description, category, active, sort_order) VALUES
('.com',  1749, 1749, 1749, 'BDT', 'Commercial / Business',            'popular', 1, 1),
('.net',  1949, 1949, 1949, 'BDT', 'Network',                          'popular', 1, 2),
('.org',  1486, 1486, 1486, 'BDT', 'Organization',                     'popular', 1, 3),
('.biz',  1111, 1111, 1111, 'BDT', 'Business',                         'popular', 1, 4),
('.info',  724,  724,  724, 'BDT', 'Information',                      'popular', 1, 5),
('.me',    386,  386,  386, 'BDT', 'Personal',                         'popular', 1, 6),
('.cc',   1511, 1511, 1511, 'BDT', 'General / Alternative',            'popular', 1, 7)
ON DUPLICATE KEY UPDATE registration_price=VALUES(registration_price),renewal_price=VALUES(renewal_price),transfer_price=VALUES(transfer_price),description=VALUES(description),category=VALUES(category),active=VALUES(active),sort_order=VALUES(sort_order);

-- 2. Business Domains / ব্যবসায়িক ডোমেইন
INSERT INTO domain_pricing (tld, registration_price, renewal_price, transfer_price, currency, description, category, active, sort_order) VALUES
('.company',       1824, 1824, 1824, 'BDT', 'Company',                 'business', 1, 10),
('.business',      1699, 1699, 1699, 'BDT', 'Business',                'business', 1, 11),
('.agency',        1036, 1036, 1036, 'BDT', 'Agency',                  'business', 1, 12),
('.services',      1111, 1111, 1111, 'BDT', 'Services',                'business', 1, 13),
('.consulting',    6411, 6411, 6411, 'BDT', 'Consulting',              'business', 1, 14),
('.solutions',     3574, 3574, 3574, 'BDT', 'Business Solutions',      'business', 1, 15),
('.management',    3199, 3199, 3199, 'BDT', 'Management',              'business', 1, 16),
('.finance',      11824,11824,11824, 'BDT', 'Finance',                 'business', 1, 17),
('.group',         3449, 3449, 3449, 'BDT', 'Business Group',          'business', 1, 18),
('.marketing',     4936, 4936, 4936, 'BDT', 'Marketing',               'business', 1, 19),
('.support',       3199, 3199, 3199, 'BDT', 'Support',                 'business', 1, 20),
('.international', 1486, 1486, 1486, 'BDT', 'International',          'business', 1, 21),
('.works',         1036, 1036, 1036, 'BDT', 'Creative Business',       'business', 1, 22),
('.supply',        3199, 3199, 3199, 'BDT', 'Supply',                  'business', 1, 23),
('.partners',     11824,11824,11824, 'BDT', 'Business Partners',       'business', 1, 24),
('.equipment',     3199, 3199, 3199, 'BDT', 'Equipment',               'business', 1, 25),
('.domains',       4936, 4936, 4936, 'BDT', 'Domain Business',         'business', 1, 26),
('.capital',      11824,11824,11824, 'BDT', 'Capital / Investment',    'business', 1, 27)
ON DUPLICATE KEY UPDATE registration_price=VALUES(registration_price),renewal_price=VALUES(renewal_price),transfer_price=VALUES(transfer_price),description=VALUES(description),category=VALUES(category),active=VALUES(active),sort_order=VALUES(sort_order);

-- 3. Technology & Digital / প্রযুক্তি ও ডিজিটাল
INSERT INTO domain_pricing (tld, registration_price, renewal_price, transfer_price, currency, description, category, active, sort_order) VALUES
('.tech',        1450, 1450, 1450, 'BDT', 'Technology',                'technology', 1, 30),
('.ai',         12886,12886,12886, 'BDT', 'Artificial Intelligence',   'technology', 1, 31),
('.dev',         2249, 2249, 2249, 'BDT', 'Developer',                 'technology', 1, 32),
('.app',         2499, 2499, 2499, 'BDT', 'Application',               'technology', 1, 33),
('.cloud',       3524, 3524, 3524, 'BDT', 'Cloud',                     'technology', 1, 34),
('.systems',     2211, 2211, 2211, 'BDT', 'Systems',                   'technology', 1, 35),
('.digital',      449,  449,  449, 'BDT', 'Digital',                   'technology', 1, 36),
('.technology',  1111, 1111, 1111, 'BDT', 'Technology',                'technology', 1, 37),
('.software',    2011, 2011, 2011, 'BDT', 'Software',                  'technology', 1, 38),
('.network',     1049, 1049, 1049, 'BDT', 'Network',                   'technology', 1, 39),
('.email',        974,  974,  974, 'BDT', 'Email',                     'technology', 1, 40),
('.center',      1111, 1111, 1111, 'BDT', 'Center',                    'technology', 1, 41)
ON DUPLICATE KEY UPDATE registration_price=VALUES(registration_price),renewal_price=VALUES(renewal_price),transfer_price=VALUES(transfer_price),description=VALUES(description),category=VALUES(category),active=VALUES(active),sort_order=VALUES(sort_order);

-- 4. Online, E-commerce & Creative / অনলাইন, ই-কমার্স ও ক্রিয়েটিভ
INSERT INTO domain_pricing (tld, registration_price, renewal_price, transfer_price, currency, description, category, active, sort_order) VALUES
('.shop',     324,  324,  324, 'BDT', 'Online Shop',                   'ecommerce', 1, 50),
('.store',   1263, 1263, 1263, 'BDT', 'Online Store',                  'ecommerce', 1, 51),
('.online',  1074, 1074, 1074, 'BDT', 'Online Business',               'ecommerce', 1, 52),
('.site',     950,  950,  950, 'BDT', 'Website',                       'ecommerce', 1, 53),
('.space',    574,  574,  574, 'BDT', 'Space / Creative',              'ecommerce', 1, 54),
('.live',     511,  511,  511, 'BDT', 'Live / Streaming',              'ecommerce', 1, 55),
('.fun',      574,  574,  574, 'BDT', 'Fun / Entertainment',           'ecommerce', 1, 56),
('.blog',    3486, 3486, 3486, 'BDT', 'Blog',                          'ecommerce', 1, 57),
('.pro',      649,  649,  649, 'BDT', 'Professional',                  'ecommerce', 1, 58),
('.vision',  4936, 4936, 4936, 'BDT', 'Vision / Creative',             'ecommerce', 1, 59),
('.expert',  6411, 6411, 6411, 'BDT', 'Expert',                        'ecommerce', 1, 60)
ON DUPLICATE KEY UPDATE registration_price=VALUES(registration_price),renewal_price=VALUES(renewal_price),transfer_price=VALUES(transfer_price),description=VALUES(description),category=VALUES(category),active=VALUES(active),sort_order=VALUES(sort_order);

-- 5. Education / শিক্ষা
INSERT INTO domain_pricing (tld, registration_price, renewal_price, transfer_price, currency, description, category, active, sort_order) VALUES
('.academy',     5086, 5086, 5086, 'BDT', 'Academy',                   'education', 1, 70),
('.education',   3761, 3761, 3761, 'BDT', 'Education',                 'education', 1, 71),
('.university', 11824,11824,11824, 'BDT', 'University',                'education', 1, 72),
('.institute',   3199, 3199, 3199, 'BDT', 'Institute',                 'education', 1, 73)
ON DUPLICATE KEY UPDATE registration_price=VALUES(registration_price),renewal_price=VALUES(renewal_price),transfer_price=VALUES(transfer_price),description=VALUES(description),category=VALUES(category),active=VALUES(active),sort_order=VALUES(sort_order);

-- 6. Country Domains / দেশের ডোমেইন (single-label only; ones without a
-- confirmed Slab 3 price were left out on purpose — add them once priced)
INSERT INTO domain_pricing (tld, registration_price, renewal_price, transfer_price, currency, description, category, active, sort_order) VALUES
('.fr', 1124, 1124, 1124, 'BDT', 'France',              'country', 1, 80),
('.es', 1124, 1124, 1124, 'BDT', 'Spain',               'country', 1, 81),
('.nl', 1449, 1449, 1449, 'BDT', 'Netherlands',         'country', 1, 82),
('.eu',  861,  861,  861, 'BDT', 'European Union',      'country', 1, 83),
('.de', 1124, 1124, 1124, 'BDT', 'Germany',             'country', 1, 84),
('.us',  824,  824,  824, 'BDT', 'United States',       'country', 1, 85),
('.uk', 1211, 1211, 1211, 'BDT', 'United Kingdom',      'country', 1, 86),
('.co', 2436, 2436, 2436, 'BDT', 'Colombia / Global Business', 'country', 1, 87)
ON DUPLICATE KEY UPDATE registration_price=VALUES(registration_price),renewal_price=VALUES(renewal_price),transfer_price=VALUES(transfer_price),description=VALUES(description),category=VALUES(category),active=VALUES(active),sort_order=VALUES(sort_order);
