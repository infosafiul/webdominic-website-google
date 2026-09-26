'use client';

import React from 'react';
import {
  Globe,
  Server,
  Cpu,
  Monitor,
  Bot,
  Sparkles,
  Mail,
  Shield,
  MoreHorizontal,
  Search,
  Tag,
  RefreshCw,
  Users,
  Building2,
  Layout,
  ShoppingCart,
  ShoppingBag,
  Cog,
  MapPin,
  Terminal,
  Wrench,
  ArrowLeftRight,
  Palette,
  Bug,
  ShieldAlert,
  Zap,
  BarChart3,
  Code,
  AppWindow,
  MessageSquare,
  Network,
  Workflow,
  Wand2,
  LayoutGrid,
  ShieldCheck,
  Send,
  Lock,
  Flame,
  ScanEye,
  Database,
  Activity,
  Info,
  Award,
  LifeBuoy,
  BookOpen,
  HelpCircle,
  PhoneCall,
  HardDrive,
  CloudCog,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface NavIconProps {
  name: string;
  className?: string;
}

export default function NavIcon({ name, className = 'w-4 h-4' }: NavIconProps) {
  switch (name) {
    case 'domains':
    case 'domain-register':
      return <Globe className={className} />;
    case 'hosting':
    case 'web-hosting':
    case 'vps-servers':
    case 'smtp-mail-server':
    case 'our-infrastructure':
      return <Server className={className} />;
    case 'servers':
      return <Cpu className={className} />;
    case 'websites':
      return <Monitor className={className} />;
    case 'ai-solutions':
    case 'ai-agents':
      return <Bot className={className} />;
    case 'business-email':
    case 'google-workspace':
      return <Mail className={className} />;
    case 'security':
    case 'website-security':
      return <Shield className={className} />;
    case 'more':
      return <MoreHorizontal className={className} />;
    case 'domain-search':
      return <Search className={className} />;
    case 'domain-pricing':
      return <Tag className={className} />;
    case 'domain-transfer':
    case 'website-redesign':
      return <RefreshCw className={className} />;
    case 'domain-reseller':
    case 'reseller-hosting':
      return <Users className={className} />;
    case 'business-hosting':
      return <Building2 className={className} />;
    case 'wordpress-hosting':
    case 'wordpress-development':
      return <Layout className={className} />;
    case 'woocommerce-hosting':
    case 'woocommerce-development':
      return <ShoppingCart className={className} />;
    case 'ecommerce-hosting':
      return <ShoppingBag className={className} />;
    case 'ai-automation-hosting':
      return <CloudCog className={className} />;
    case 'self-hosted-n8n':
    case 'ai-automation':
    case 'n8n-automation':
    case 'business-process-automation':
      return <Workflow className={className} />;
    case 'hosting-transfer':
    case 'server-migration':
    case 'website-migration':
    case 'email-migration':
      return <ArrowLeftRight className={className} />;
    case 'dedicated-servers':
      return <HardDrive className={className} />;
    case 'managed-vps':
      return <Cog className={className} />;
    case 'usa-vps':
      return <MapPin className={className} />;
    case 'linux-servers':
      return <Terminal className={className} />;
    case 'server-management':
    case 'website-maintenance':
      return <Wrench className={className} />;
    case 'website-design':
      return <Palette className={className} />;
    case 'website-error-fixing':
      return <Bug className={className} />;
    case 'website-hack-fixing':
    case 'malware-removal':
    case 'ddos-protection':
      return <ShieldAlert className={className} />;
    case 'website-speed':
      return <Zap className={className} />;
    case 'seo-services':
      return <BarChart3 className={className} />;
    case 'ai-website-dev':
      return <Code className={className} />;
    case 'ai-web-apps':
      return <AppWindow className={className} />;
    case 'ai-chatbots':
      return <MessageSquare className={className} />;
    case 'ai-api-integration':
      return <Network className={className} />;
    case 'custom-ai-solutions':
      return <Wand2 className={className} />;
    case 'sparkles':
      return <Sparkles className={className} />;
    case 'microsoft-365':
      return <LayoutGrid className={className} />;
    case 'email-security':
    case 'shield-check':
      return <ShieldCheck className={className} />;
    case 'email-deliverability':
      return <Send className={className} />;
    case 'ssl-certificates':
      return <Lock className={className} />;
    case 'firewall-protection':
      return <Flame className={className} />;
    case 'security-audit':
      return <ScanEye className={className} />;
    case 'daily-backup':
      return <Database className={className} />;
    case 'website-monitoring':
      return <Activity className={className} />;
    case 'about-us':
      return <Info className={className} />;
    case 'why-wdh':
      return <Award className={className} />;
    case 'support':
      return <LifeBuoy className={className} />;
    case 'knowledge-base':
      return <BookOpen className={className} />;
    case 'faqs':
      return <HelpCircle className={className} />;
    case 'contact-us':
      return <PhoneCall className={className} />;
    case 'chevron-down':
      return <ChevronDown className={className} />;
    case 'chevron-right':
    default:
      return <ChevronRight className={className} />;
  }
}
