-- Migration 025: Country Sub-Domains / Country-based Extensions
-- Requires the wdh_tld() fix in domains.php (longest-suffix match against
-- the known TLD list) to display/filter correctly — deploy that first.

INSERT INTO domain_pricing (tld, registration_price, renewal_price, transfer_price, currency, description, category, active, sort_order) VALUES
('.org.in', 1549, 1549, 1549, 'BDT', 'Organization India',    'country-sub', 1, 90),
('.co.in',  1549, 1549, 1549, 'BDT', 'Commercial India',      'country-sub', 1, 91),
('.in.net',  574,  574,  574, 'BDT', 'India Network',         'country-sub', 1, 92),
('.co.uk',  1211, 1211, 1211, 'BDT', 'UK Commercial',         'country-sub', 1, 93),
('.com.au', 1649, 1649, 1649, 'BDT', 'Australia Commercial',  'country-sub', 1, 94),
('.com.br', 1849, 1849, 1849, 'BDT', 'Brazil Commercial',     'country-sub', 1, 95),
('.com.co', 2786, 2786, 2786, 'BDT', 'Colombia Commercial',   'country-sub', 1, 96),
('.com.de', 1474, 1474, 1474, 'BDT', 'Germany Commercial',    'country-sub', 1, 97),
('.com.mx', 1911, 1911, 1911, 'BDT', 'Mexico Commercial',     'country-sub', 1, 98)
ON DUPLICATE KEY UPDATE registration_price=VALUES(registration_price),renewal_price=VALUES(renewal_price),transfer_price=VALUES(transfer_price),description=VALUES(description),category=VALUES(category),active=VALUES(active),sort_order=VALUES(sort_order);
