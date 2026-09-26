<?php
/**
 * WDH main navigation data.
 *
 * This is the single source of truth for the site's main navigation. The
 * same array below is rendered by includes/header.php into BOTH the
 * desktop mega-menu panels and the mobile accordion tree, so the markup
 * is never duplicated between desktop/mobile or across pages.
 *
 * URL policy (per the navigation brief):
 *   - Items that already have a real page/anchor on the site link to it.
 *   - Items with no existing page/anchor yet link to the closest existing
 *     hub page for that topic (e.g. every Business Email sub-item links
 *     to business-email.php) so nothing 404s.
 *   - Items with NO reasonable existing page at all are marked
 *     'new' => true and point at contact.php (or the new ai-solutions.php
 *     hub created for this task) as an interim landing spot. These are
 *     listed in full in the delivery notes.
 */

function wdh_nav_data(): array {
    return [
        [
            'key' => 'domains', 'icon' => 'domains', 'label_key' => 'nav_domains', 'href' => 'domains.php',
            'panel_title' => 'Domains', 'panel_icon' => 'domains',
            'columns' => [
                [ [ 'heading' => null, 'items' => [
                    ['label' => 'Domain Search', 'href' => 'domains.php', 'icon' => 'domain-search'],
                    ['label' => 'Register a Domain', 'href' => 'domains.php', 'icon' => 'domain-register'],
                    ['label' => 'Domain Pricing', 'href' => 'domains.php', 'icon' => 'domain-pricing'],
                    ['label' => 'Transfer a Domain', 'href' => 'domain-transfer.php', 'icon' => 'domain-transfer'],
                    ['label' => 'Domain Reseller', 'href' => 'contact.php', 'icon' => 'domain-reseller', 'new' => true],
                ] ] ],
            ],
            'footer_link' => ['label' => 'View All Domain Services', 'href' => 'domains.php'],
        ],
        [
            'key' => 'hosting', 'icon' => 'hosting', 'label_key' => 'nav_hosting', 'href' => 'hosting.php',
            'panel_title' => 'Hosting', 'panel_icon' => 'hosting',
            'columns' => [
                [ [ 'heading' => 'Web Hosting', 'items' => [
                    ['label' => 'Web Hosting', 'href' => 'hosting.php#plans', 'icon' => 'web-hosting'],
                    ['label' => 'Business Hosting', 'href' => 'hosting.php#plans', 'icon' => 'business-hosting'],
                    ['label' => 'WordPress Hosting', 'href' => 'hosting.php#plans', 'icon' => 'wordpress-hosting', 'new' => true],
                    ['label' => 'WooCommerce Hosting', 'href' => 'hosting.php#plans', 'icon' => 'woocommerce-hosting', 'new' => true],
                    ['label' => 'E-commerce Hosting', 'href' => 'hosting.php#plans', 'icon' => 'ecommerce-hosting', 'new' => true],
                ] ] ],
                [
                    [ 'heading' => 'Specialized Hosting', 'items' => [
                        ['label' => 'Reseller Hosting', 'href' => 'hosting.php#plans', 'icon' => 'reseller-hosting'],
                        ['label' => 'AI Automation Hosting', 'href' => 'ai-solutions.php#ai-hosting', 'icon' => 'ai-automation-hosting', 'new' => true],
                        ['label' => 'Self-Hosted n8n', 'href' => 'ai-solutions.php#n8n', 'icon' => 'self-hosted-n8n', 'new' => true],
                    ] ],
                    [ 'heading' => 'Services', 'items' => [
                        ['label' => 'Hosting Transfer', 'href' => 'contact.php', 'icon' => 'hosting-transfer', 'new' => true],
                    ] ],
                ],
            ],
            'promo' => ['title' => 'Power Your Business Online', 'sub' => 'High performance hosting with 99.9% uptime.', 'icon' => 'hosting'],
        ],
        [
            'key' => 'servers', 'icon' => 'servers', 'label_key' => 'nav_servers', 'href' => 'servers.php',
            'panel_title' => 'Servers', 'panel_icon' => 'servers',
            'columns' => [
                [ [ 'heading' => 'Server Hosting', 'items' => [
                    ['label' => 'VPS Servers', 'href' => 'servers.php#vps', 'icon' => 'vps-servers'],
                    ['label' => 'Dedicated Servers', 'href' => 'servers.php', 'icon' => 'dedicated-servers'],
                    ['label' => 'Managed VPS', 'href' => 'servers.php#vps', 'icon' => 'managed-vps', 'new' => true],
                    ['label' => 'USA VPS', 'href' => 'servers.php#vps', 'icon' => 'usa-vps', 'new' => true],
                ] ] ],
                [ [ 'heading' => 'Server Services', 'items' => [
                    ['label' => 'Linux Servers', 'href' => 'servers.php', 'icon' => 'linux-servers', 'new' => true],
                    ['label' => 'Server Management', 'href' => 'contact.php', 'icon' => 'server-management', 'new' => true],
                    ['label' => 'Server Migration', 'href' => 'contact.php', 'icon' => 'server-migration', 'new' => true],
                ] ] ],
            ],
            'promo' => ['title' => 'Reliable. Scalable. Secure.', 'sub' => 'High-performance servers in USA data centers.', 'icon' => 'servers'],
        ],
        [
            'key' => 'websites', 'icon' => 'websites', 'label_key' => 'nav_websites', 'href' => 'services.php',
            'panel_title' => 'Websites', 'panel_icon' => 'websites',
            'columns' => [
                [ [ 'heading' => 'Website Development', 'items' => [
                    ['label' => 'Website Design', 'href' => 'services.php', 'icon' => 'website-design'],
                    ['label' => 'WordPress Development', 'href' => 'services.php', 'icon' => 'wordpress-development', 'new' => true],
                    ['label' => 'WooCommerce Development', 'href' => 'services.php', 'icon' => 'woocommerce-development', 'new' => true],
                    ['label' => 'Website Redesign', 'href' => 'services.php', 'icon' => 'website-redesign', 'new' => true],
                ] ] ],
                [
                    [ 'heading' => 'Website Services', 'items' => [
                        ['label' => 'Website Maintenance', 'href' => 'services.php', 'icon' => 'website-maintenance', 'new' => true],
                        ['label' => 'Website Migration', 'href' => 'services.php', 'icon' => 'website-migration', 'new' => true],
                        ['label' => 'Website Error Fixing', 'href' => 'services.php', 'icon' => 'website-error-fixing', 'new' => true],
                        ['label' => 'Website Hack Fixing', 'href' => 'security.php', 'icon' => 'website-hack-fixing', 'new' => true],
                        ['label' => 'Website Speed Optimization', 'href' => 'services.php', 'icon' => 'website-speed', 'new' => true],
                    ] ],
                    [ 'heading' => 'Marketing', 'items' => [
                        ['label' => 'SEO Services', 'href' => 'services.php', 'icon' => 'seo-services', 'new' => true],
                    ] ],
                ],
            ],
            'promo' => ['title' => 'Reliable. Scalable. Secure.', 'sub' => 'High-performance servers in USA data centers.', 'icon' => 'websites'],
        ],
        [
            'key' => 'ai-solutions', 'icon' => 'ai-solutions', 'label_key' => 'nav_ai', 'short_label' => 'AI', 'href' => 'ai-solutions.php', 'badge' => 'NEW',
            'panel_title' => 'AI Solutions', 'panel_icon' => 'ai-solutions', 'accent' => 'ai',
            'columns' => [
                [ [ 'heading' => 'AI Development', 'items' => [
                    ['label' => 'AI Website Development', 'href' => 'ai-solutions.php#development', 'icon' => 'ai-website-dev', 'new' => true],
                    ['label' => 'AI Web Applications', 'href' => 'ai-solutions.php#development', 'icon' => 'ai-web-apps', 'new' => true],
                    ['label' => 'AI Chatbots', 'href' => 'ai-solutions.php#development', 'icon' => 'ai-chatbots', 'new' => true],
                    ['label' => 'AI API Integration', 'href' => 'ai-solutions.php#development', 'icon' => 'ai-api-integration', 'new' => true],
                ] ] ],
                [ [ 'heading' => 'AI Automation', 'items' => [
                    ['label' => 'AI Automation', 'href' => 'ai-solutions.php#automation', 'icon' => 'ai-automation', 'new' => true],
                    ['label' => 'n8n Automation', 'href' => 'ai-solutions.php#automation', 'icon' => 'n8n-automation', 'new' => true],
                    ['label' => 'AI Agents', 'href' => 'ai-solutions.php#automation', 'icon' => 'ai-agents', 'new' => true],
                    ['label' => 'Business Process Automation', 'href' => 'ai-solutions.php#automation', 'icon' => 'business-process-automation', 'new' => true],
                ] ] ],
                [
                    [ 'heading' => 'AI Infrastructure', 'items' => [
                        ['label' => 'AI Automation Hosting', 'href' => 'ai-solutions.php#ai-hosting', 'icon' => 'ai-automation-hosting', 'new' => true],
                        ['label' => 'Self-Hosted n8n', 'href' => 'ai-solutions.php#n8n', 'icon' => 'self-hosted-n8n', 'new' => true],
                    ] ],
                    [ 'heading' => 'Custom AI', 'items' => [
                        ['label' => 'Custom AI Solutions', 'href' => 'ai-solutions.php#custom', 'icon' => 'custom-ai-solutions', 'new' => true],
                    ] ],
                ],
            ],
            'promo' => ['title' => 'Build smarter. Automate more.', 'sub' => 'AI-powered solutions for modern businesses.', 'icon' => 'sparkles', 'cta' => 'Explore AI', 'accent' => 'ai'],
        ],
        [
            'key' => 'business-email', 'icon' => 'business-email', 'label_key' => 'nav_email', 'short_label' => 'Email', 'href' => 'business-email.php',
            'panel_title' => 'Business Email', 'panel_icon' => 'business-email',
            'columns' => [
                [ [ 'heading' => 'Email Solutions', 'items' => [
                    ['label' => 'Business Email', 'href' => 'business-email.php', 'icon' => 'business-email'],
                    ['label' => 'Microsoft 365', 'href' => 'business-email.php', 'icon' => 'microsoft-365', 'new' => true],
                    ['label' => 'Google Workspace', 'href' => 'business-email.php', 'icon' => 'google-workspace', 'new' => true],
                ] ] ],
                [ [ 'heading' => 'Email Services', 'items' => [
                    ['label' => 'Email Migration', 'href' => 'business-email.php', 'icon' => 'email-migration', 'new' => true],
                    ['label' => 'Email Security', 'href' => 'business-email.php', 'icon' => 'email-security', 'new' => true],
                    ['label' => 'SMTP & Mail Server', 'href' => 'business-email.php', 'icon' => 'smtp-mail-server', 'new' => true],
                    ['label' => 'Email Deliverability', 'href' => 'business-email.php', 'icon' => 'email-deliverability', 'new' => true],
                ] ] ],
            ],
            'footer_link' => ['label' => 'View All Email Plans', 'href' => 'business-email.php'],
        ],
        [
            'key' => 'security', 'icon' => 'security', 'label_key' => 'nav_security', 'href' => 'security.php',
            'panel_title' => 'Security', 'panel_icon' => 'security',
            'columns' => [
                [ [ 'heading' => 'Website Security', 'items' => [
                    ['label' => 'Website Security', 'href' => 'security.php', 'icon' => 'website-security'],
                    ['label' => 'SSL Certificates', 'href' => 'security.php', 'icon' => 'ssl-certificates', 'new' => true],
                    ['label' => 'Malware Removal', 'href' => 'security.php', 'icon' => 'malware-removal', 'new' => true],
                    ['label' => 'Website Hack Fixing', 'href' => 'security.php', 'icon' => 'website-hack-fixing', 'new' => true],
                ] ] ],
                [ [ 'heading' => 'Infrastructure Security', 'items' => [
                    ['label' => 'Firewall Protection', 'href' => 'security.php', 'icon' => 'firewall-protection', 'new' => true],
                    ['label' => 'DDoS Protection', 'href' => 'security.php', 'icon' => 'ddos-protection', 'new' => true],
                    ['label' => 'Security Audit', 'href' => 'security.php', 'icon' => 'security-audit', 'new' => true],
                ] ] ],
                [ [ 'heading' => 'Protection & Backup', 'items' => [
                    ['label' => 'Daily Backup', 'href' => 'security.php', 'icon' => 'daily-backup', 'new' => true],
                    ['label' => 'Website Monitoring', 'href' => 'security.php', 'icon' => 'website-monitoring', 'new' => true],
                ] ] ],
            ],
            'footer_link' => ['label' => 'View All Security Services', 'href' => 'security.php'],
        ],
        [
            'key' => 'more', 'icon' => 'more', 'label_key' => 'nav_more', 'href' => 'services.php',
            'panel_title' => 'More', 'panel_icon' => 'more',
            'columns' => [
                [ [ 'heading' => 'Company', 'items' => [
                    ['label' => 'About Us', 'href' => 'services.php', 'icon' => 'about-us', 'new' => true],
                    ['label' => 'Why Choose WDH?', 'href' => 'services.php', 'icon' => 'why-wdh', 'new' => true],
                    ['label' => 'Our Infrastructure', 'href' => 'services.php', 'icon' => 'our-infrastructure', 'new' => true],
                ] ] ],
                [ [ 'heading' => 'Support', 'items' => [
                    ['label' => 'Support', 'href' => 'support.php', 'icon' => 'support'],
                    ['label' => 'Knowledge Base', 'href' => 'support.php', 'icon' => 'knowledge-base', 'new' => true],
                    ['label' => 'FAQs', 'href' => 'support.php', 'icon' => 'faqs', 'new' => true],
                ] ] ],
                [ [ 'heading' => 'Contact', 'items' => [
                    ['label' => 'Contact Us', 'href' => 'contact.php', 'icon' => 'contact-us'],
                ] ] ],
            ],
        ],
    ];
}
