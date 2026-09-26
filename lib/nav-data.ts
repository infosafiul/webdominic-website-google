export interface NavSubItem {
  label: string;
  labelBn?: string;
  href: string;
  icon: string;
  new?: boolean;
}

export interface NavGroup {
  heading: string | null;
  headingBn?: string | null;
  items: NavSubItem[];
}

export interface NavPromo {
  title: string;
  titleBn?: string;
  sub: string;
  subBn?: string;
  icon: string;
  cta?: string;
  ctaBn?: string;
  accent?: 'ai' | 'blue';
}

export interface NavFooterLink {
  label: string;
  labelBn?: string;
  href: string;
}

export interface NavCategory {
  key: string;
  icon: string;
  labelKey: string;
  labelEn: string;
  labelBn: string;
  shortLabel?: string;
  shortLabelBn?: string;
  href: string;
  badge?: string;
  accent?: 'ai';
  panelTitle: string;
  panelTitleBn: string;
  panelIcon: string;
  columns: NavGroup[][];
  promo?: NavPromo;
  footerLink?: NavFooterLink;
}

export const WDH_NAV_DATA: NavCategory[] = [
  {
    key: 'domains',
    icon: 'domains',
    labelKey: 'nav_domains',
    labelEn: 'Domains',
    labelBn: 'ডোমেইন',
    href: 'domains.php',
    panelTitle: 'Domains',
    panelTitleBn: 'ডোমেইন সেবাসমূহ',
    panelIcon: 'domains',
    columns: [
      [
        {
          heading: null,
          items: [
            { label: 'Domain Search', labelBn: 'ডোমেইন সার্চ', href: 'domains.php', icon: 'domain-search' },
            { label: 'Register a Domain', labelBn: 'ডোমেইন রেজিস্ট্রেশন', href: 'domains.php', icon: 'domain-register' },
            { label: 'Domain Pricing', labelBn: 'ডোমেইন মূল্য তালিকা', href: 'domains.php', icon: 'domain-pricing' },
            { label: 'Transfer a Domain', labelBn: 'ডোমেইন ট্রান্সফার', href: 'domain-transfer.php', icon: 'domain-transfer' },
            { label: 'Domain Reseller', labelBn: 'ডোমেইন রিসেলার', href: 'contact.php', icon: 'domain-reseller', new: true },
          ],
        },
      ],
    ],
    footerLink: {
      label: 'View All Domain Services',
      labelBn: 'সকল ডোমেইন সেবা দেখুন',
      href: 'domains.php',
    },
  },
  {
    key: 'hosting',
    icon: 'hosting',
    labelKey: 'nav_hosting',
    labelEn: 'Hosting',
    labelBn: 'হোস্টিং',
    href: 'hosting.php',
    panelTitle: 'Hosting',
    panelTitleBn: 'হোস্টিং সলিউশন',
    panelIcon: 'hosting',
    columns: [
      [
        {
          heading: 'Web Hosting',
          headingBn: 'ওয়েব হোস্টিং',
          items: [
            { label: 'Web Hosting', labelBn: 'শেয়ার্ড ওয়েব হোস্টিং', href: 'hosting.php#plans', icon: 'web-hosting' },
            { label: 'Business Hosting', labelBn: 'বিজনেস হোস্টিং', href: 'hosting.php#plans', icon: 'business-hosting' },
            { label: 'WordPress Hosting', labelBn: 'ওয়ার্ডপ্রেস হোস্টিং', href: 'hosting.php#plans', icon: 'wordpress-hosting', new: true },
            { label: 'WooCommerce Hosting', labelBn: 'উকমার্স হোস্টিং', href: 'hosting.php#plans', icon: 'woocommerce-hosting', new: true },
            { label: 'E-commerce Hosting', labelBn: 'ই-কমার্স হোস্টিং', href: 'hosting.php#plans', icon: 'ecommerce-hosting', new: true },
          ],
        },
      ],
      [
        {
          heading: 'Specialized Hosting',
          headingBn: 'স্পেশালাইজড হোস্টিং',
          items: [
            { label: 'Reseller Hosting', labelBn: 'রিসেলার হোস্টিং (WHM)', href: 'hosting.php#plans', icon: 'reseller-hosting' },
            { label: 'AI Automation Hosting', labelBn: 'এআই অটোমেশন হোস্টিং', href: 'ai-solutions.php#ai-hosting', icon: 'ai-automation-hosting', new: true },
            { label: 'Self-Hosted n8n', labelBn: 'সেলফ-হোস্টেড n8n ক্লাউড', href: 'ai-solutions.php#n8n', icon: 'self-hosted-n8n', new: true },
          ],
        },
        {
          heading: 'Services',
          headingBn: 'সার্ভিসেস',
          items: [
            { label: 'Hosting Transfer', labelBn: 'হোস্টিং মাইগ্রেশন ও ট্রান্সফার', href: 'contact.php', icon: 'hosting-transfer', new: true },
          ],
        },
      ],
    ],
    promo: {
      title: 'Power Your Business Online',
      titleBn: 'আপনার ব্যবসাকে করুন আরও শক্তিশালী',
      sub: 'High performance hosting with 99.9% uptime.',
      subBn: '৯৯.৯% আপটাইম সহ উচ্চগতির NVMe হোস্টিং।',
      icon: 'hosting',
    },
  },
  {
    key: 'servers',
    icon: 'servers',
    labelKey: 'nav_servers',
    labelEn: 'Servers',
    labelBn: 'সার্ভার',
    href: 'servers.php',
    panelTitle: 'Servers',
    panelTitleBn: 'সার্ভার ইনফ্রাস্ট্রাকচার',
    panelIcon: 'servers',
    columns: [
      [
        {
          heading: 'Server Hosting',
          headingBn: 'সার্ভার হোস্টিং',
          items: [
            { label: 'VPS Servers', labelBn: 'ক্লাউড VPS সার্ভার', href: 'servers.php#vps', icon: 'vps-servers' },
            { label: 'Dedicated Servers', labelBn: 'ডেডিকেটেড সার্ভার', href: 'servers.php', icon: 'dedicated-servers' },
            { label: 'Managed VPS', labelBn: 'ম্যানেজড ভিপিএস', href: 'servers.php#vps', icon: 'managed-vps', new: true },
            { label: 'USA VPS', labelBn: 'ইউএসএ ডাটা সেন্টার ভিপিএস', href: 'servers.php#vps', icon: 'usa-vps', new: true },
          ],
        },
      ],
      [
        {
          heading: 'Server Services',
          headingBn: 'সার্ভার সেবাসমূহ',
          items: [
            { label: 'Linux Servers', labelBn: 'লিনাক্স সার্ভার সেটআপ', href: 'servers.php', icon: 'linux-servers', new: true },
            { label: 'Server Management', labelBn: 'সার্ভার ম্যানেজমেন্ট ও সাপোর্ট', href: 'contact.php', icon: 'server-management', new: true },
            { label: 'Server Migration', labelBn: 'সার্ভার ডেটা মাইগ্রেশন', href: 'contact.php', icon: 'server-migration', new: true },
          ],
        },
      ],
    ],
    promo: {
      title: 'Reliable. Scalable. Secure.',
      titleBn: 'নির্ভরযোগ্য। স্কেলেবল। নিরাপদ।',
      sub: 'High-performance servers in USA data centers.',
      subBn: 'ইউএসএ টিয়ার-৩ ডাটা সেন্টারে হাই পারফরম্যান্স সার্ভার।',
      icon: 'servers',
    },
  },
  {
    key: 'websites',
    icon: 'websites',
    labelKey: 'nav_websites',
    labelEn: 'Websites',
    labelBn: 'ওয়েবসাইট',
    href: 'services.php',
    panelTitle: 'Websites',
    panelTitleBn: 'ওয়েবসাইট সলিউশন',
    panelIcon: 'websites',
    columns: [
      [
        {
          heading: 'Website Development',
          headingBn: 'ওয়েবসাইট ডেভেলপমেন্ট',
          items: [
            { label: 'Website Design', labelBn: 'ওয়েবসাইট ডিজাইন', href: 'services.php', icon: 'website-design' },
            { label: 'WordPress Development', labelBn: 'ওয়ার্ডপ্রেস ডেভেলপমেন্ট', href: 'services.php', icon: 'wordpress-development', new: true },
            { label: 'WooCommerce Development', labelBn: 'উকমার্স শপ ডেভেলপমেন্ট', href: 'services.php', icon: 'woocommerce-development', new: true },
            { label: 'Website Redesign', labelBn: 'ওয়েবসাইট রিডিজাইন', href: 'services.php', icon: 'website-redesign', new: true },
          ],
        },
      ],
      [
        {
          heading: 'Website Services',
          headingBn: 'ওয়েবসাইট সার্ভিসেস',
          items: [
            { label: 'Website Maintenance', labelBn: 'ওয়েবসাইট মেইনটেন্যান্স', href: 'services.php', icon: 'website-maintenance', new: true },
            { label: 'Website Migration', labelBn: 'ওয়েবসাইট মাইগ্রেশন', href: 'services.php', icon: 'website-migration', new: true },
            { label: 'Website Error Fixing', labelBn: 'ওয়েবসাইট এরর ফিক্সিং', href: 'services.php', icon: 'website-error-fixing', new: true },
            { label: 'Website Hack Fixing', labelBn: 'হ্যাকড ওয়েবসাইট রিকভারি', href: 'security.php', icon: 'website-hack-fixing', new: true },
            { label: 'Website Speed Optimization', labelBn: 'স্পিড ও পারফরম্যান্স অপ্টিমাইজেশন', href: 'services.php', icon: 'website-speed', new: true },
          ],
        },
        {
          heading: 'Marketing',
          headingBn: 'মার্কেটিং',
          items: [
            { label: 'SEO Services', labelBn: 'এসইও (SEO) সার্ভিসেস', href: 'services.php', icon: 'seo-services', new: true },
          ],
        },
      ],
    ],
    promo: {
      title: 'Reliable. Scalable. Secure.',
      titleBn: 'আধুনিক ডিজাইন ও বিশ্বস্ত পারফরম্যান্স',
      sub: 'Professional web design built for results.',
      subBn: 'আপনার ব্র্যান্ডের জন্য আকর্ষণীয় ও রেসপনসিভ ওয়েবসাইট।',
      icon: 'websites',
    },
  },
  {
    key: 'ai-solutions',
    icon: 'ai-solutions',
    labelKey: 'nav_ai',
    labelEn: 'AI Solutions',
    labelBn: 'এআই সমাধান',
    shortLabel: 'AI',
    shortLabelBn: 'এআই',
    href: 'ai-solutions.php',
    badge: 'NEW',
    accent: 'ai',
    panelTitle: 'AI Solutions',
    panelTitleBn: 'এআই ও অটোমেশন সলিউশন',
    panelIcon: 'ai-solutions',
    columns: [
      [
        {
          heading: 'AI Development',
          headingBn: 'এআই ডেভেলপমেন্ট',
          items: [
            { label: 'AI Website Development', labelBn: 'এআই ওয়েবসাইট ডেভেলপমেন্ট', href: 'ai-solutions.php#development', icon: 'ai-website-dev', new: true },
            { label: 'AI Web Applications', labelBn: 'এআই ওয়েব অ্যাপ্লিকেশন', href: 'ai-solutions.php#development', icon: 'ai-web-apps', new: true },
            { label: 'AI Chatbots', labelBn: 'ইন্টেলিজেন্ট এআই চ্যাটবট', href: 'ai-solutions.php#development', icon: 'ai-chatbots', new: true },
            { label: 'AI API Integration', labelBn: 'এআই এপিআই ইন্টিগ্রেশন', href: 'ai-solutions.php#development', icon: 'ai-api-integration', new: true },
          ],
        },
      ],
      [
        {
          heading: 'AI Automation',
          headingBn: 'এআই অটোমেশন',
          items: [
            { label: 'AI Automation', labelBn: 'এআই ওয়ার্কফ্লো অটোমেশন', href: 'ai-solutions.php#automation', icon: 'ai-automation', new: true },
            { label: 'n8n Automation', labelBn: 'n8n ওয়ার্কফ্লো অটোমেশন', href: 'ai-solutions.php#automation', icon: 'n8n-automation', new: true },
            { label: 'AI Agents', labelBn: 'স্বায়ত্তশাসিত এআই এজেন্টস', href: 'ai-solutions.php#automation', icon: 'ai-agents', new: true },
            { label: 'Business Process Automation', labelBn: 'বিজনেস প্রসেস অটোমেশন', href: 'ai-solutions.php#automation', icon: 'business-process-automation', new: true },
          ],
        },
      ],
      [
        {
          heading: 'AI Infrastructure',
          headingBn: 'এআই ইনফ্রাস্ট্রাকচার',
          items: [
            { label: 'AI Automation Hosting', labelBn: 'এআই অটোমেশন হোস্টিং', href: 'ai-solutions.php#ai-hosting', icon: 'ai-automation-hosting', new: true },
            { label: 'Self-Hosted n8n', labelBn: 'প্রাইভেট n8n ক্লাউড', href: 'ai-solutions.php#n8n', icon: 'self-hosted-n8n', new: true },
          ],
        },
        {
          heading: 'Custom AI',
          headingBn: 'কাস্টম এআই',
          items: [
            { label: 'Custom AI Solutions', labelBn: 'কাস্টম এআই সলিউশন ও মডেল', href: 'ai-solutions.php#custom', icon: 'custom-ai-solutions', new: true },
          ],
        },
      ],
    ],
    promo: {
      title: 'Build smarter. Automate more.',
      titleBn: 'স্মার্ট চিন্তা। আরও দ্রুত অটোমেশন।',
      sub: 'AI-powered solutions for modern businesses.',
      subBn: 'আধুনিক ব্যবসার জন্য ডেডিকেটেড এআই ক্লাউড ও অটোমেশন।',
      icon: 'sparkles',
      cta: 'Explore AI',
      ctaBn: 'এআই সেবা দেখুন',
      accent: 'ai',
    },
  },
  {
    key: 'business-email',
    icon: 'business-email',
    labelKey: 'nav_email',
    labelEn: 'Business Email',
    labelBn: 'ইমেইল সেবা',
    shortLabel: 'Email',
    shortLabelBn: 'ইমেইল',
    href: 'business-email.php',
    panelTitle: 'Business Email',
    panelTitleBn: 'বিজনেস ইমেইল সমাধান',
    panelIcon: 'business-email',
    columns: [
      [
        {
          heading: 'Email Solutions',
          headingBn: 'ইমেইল সলিউশন',
          items: [
            { label: 'Business Email', labelBn: 'কর্পোরেট বিজনেস ইমেইল', href: 'business-email.php', icon: 'business-email' },
            { label: 'Microsoft 365', labelBn: 'মাইক্রোসফট ৩৬৫ সেটআপ', href: 'business-email.php', icon: 'microsoft-365', new: true },
            { label: 'Google Workspace', labelBn: 'গুগল ওয়ার্কস্পেস সেটআপ', href: 'business-email.php', icon: 'google-workspace', new: true },
          ],
        },
      ],
      [
        {
          heading: 'Email Services',
          headingBn: 'ইমেইল সেবাসমূহ',
          items: [
            { label: 'Email Migration', labelBn: 'ইমেইল মাইগ্রেশন সাপোর্ট', href: 'business-email.php', icon: 'email-migration', new: true },
            { label: 'Email Security', labelBn: 'ইমেইল সিকিউরিটি ও স্প্যাম গার্ড', href: 'business-email.php', icon: 'email-security', new: true },
            { label: 'SMTP & Mail Server', labelBn: 'এসএমটিপি ও মেইল সার্ভার', href: 'business-email.php', icon: 'smtp-mail-server', new: true },
            { label: 'Email Deliverability', labelBn: 'ইমেইল ডেলিভারিবিলিটি (SPF/DKIM/DMARC)', href: 'business-email.php', icon: 'email-deliverability', new: true },
          ],
        },
      ],
    ],
    footerLink: {
      label: 'View All Email Plans',
      labelBn: 'সকল ইমেইল প্যাকেজ দেখুন',
      href: 'business-email.php',
    },
  },
  {
    key: 'security',
    icon: 'security',
    labelKey: 'nav_security',
    labelEn: 'Security',
    labelBn: 'সিকিউরিটি',
    href: 'security.php',
    panelTitle: 'Security',
    panelTitleBn: 'ওয়েবসাইট ও ডাটা সিকিউরিটি',
    panelIcon: 'security',
    columns: [
      [
        {
          heading: 'Website Security',
          headingBn: 'ওয়েবসাইট সিকিউরিটি',
          items: [
            { label: 'Website Security', labelBn: 'ওয়েবসাইট সুরক্ষা সার্ভিস', href: 'security.php', icon: 'website-security' },
            { label: 'SSL Certificates', labelBn: 'এসএসএল (SSL) সার্টিফিকেট', href: 'security.php', icon: 'ssl-certificates', new: true },
            { label: 'Malware Removal', labelBn: 'ম্যালওয়্যার স্ক্যান ও ক্লিনআপ', href: 'security.php', icon: 'malware-removal', new: true },
            { label: 'Website Hack Fixing', labelBn: 'হ্যাকড সাইট রিকভারি', href: 'security.php', icon: 'website-hack-fixing', new: true },
          ],
        },
      ],
      [
        {
          heading: 'Infrastructure Security',
          headingBn: 'ইনফ্রাস্ট্রাকচার সিকিউরিটি',
          items: [
            { label: 'Firewall Protection', labelBn: 'ওয়েব অ্যাপ্লিকেশন ফায়ারওয়াল (WAF)', href: 'security.php', icon: 'firewall-protection', new: true },
            { label: 'DDoS Protection', labelBn: 'DDoS আক্রমণ প্রতিরোধ', href: 'security.php', icon: 'ddos-protection', new: true },
            { label: 'Security Audit', labelBn: 'সিকিউরিটি অডিট ও টেস্ট', href: 'security.php', icon: 'security-audit', new: true },
          ],
        },
      ],
      [
        {
          heading: 'Protection & Backup',
          headingBn: 'সুরক্ষা ও ব্যাকআপ',
          items: [
            { label: 'Daily Backup', labelBn: 'স্বয়ংক্রিয় ক্লাউড ব্যাকআপ', href: 'security.php', icon: 'daily-backup', new: true },
            { label: 'Website Monitoring', labelBn: '২৪/৭ আপটাইম ও সিকিউরিটি মনিটরিং', href: 'security.php', icon: 'website-monitoring', new: true },
          ],
        },
      ],
    ],
    footerLink: {
      label: 'View All Security Services',
      labelBn: 'সকল সিকিউরিটি সার্ভিস দেখুন',
      href: 'security.php',
    },
  },
  {
    key: 'more',
    icon: 'more',
    labelKey: 'nav_more',
    labelEn: 'More',
    labelBn: 'আরও',
    href: 'services.php',
    panelTitle: 'More',
    panelTitleBn: 'অন্যান্য সেবাসমূহ',
    panelIcon: 'more',
    columns: [
      [
        {
          heading: 'Company',
          headingBn: 'কোম্পানি',
          items: [
            { label: 'About Us', labelBn: 'আমাদের সম্পর্কে (২০০৪ সাল থেকে)', href: 'services.php', icon: 'about-us', new: true },
            { label: 'Why Choose WDH?', labelBn: 'কেন ডাব্লিউডিএইচ বেছে নেবেন?', href: 'services.php', icon: 'why-wdh', new: true },
            { label: 'Our Infrastructure', labelBn: 'আমাদের ইউএসএ ইনফ্রাস্ট্রাকচার', href: 'services.php', icon: 'our-infrastructure', new: true },
          ],
        },
      ],
      [
        {
          heading: 'Support',
          headingBn: 'সাপোর্ট',
          items: [
            { label: 'Support', labelBn: 'কাস্টমার সাপোর্ট ডটকম', href: 'support.php', icon: 'support' },
            { label: 'Knowledge Base', labelBn: 'হেল্প সেন্টার ও গাইড', href: 'support.php', icon: 'knowledge-base', new: true },
            { label: 'FAQs', labelBn: 'সাধারণ প্রশ্নোত্তর (FAQs)', href: 'support.php', icon: 'faqs', new: true },
          ],
        },
      ],
      [
        {
          heading: 'Contact',
          headingBn: 'যোগাযোগ',
          items: [
            { label: 'Contact Us', labelBn: 'সরাসরি যোগাযোগ করুন', href: 'contact.php', icon: 'contact-us' },
          ],
        },
      ],
    ],
  },
];
