'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/context';
import {
  Globe,
  HardDrive,
  Cpu,
  Server,
  Mail,
  Shield,
  Bot,
  Layers,
  Sparkles,
  ShoppingCart,
  User,
  Phone,
  Mail as MailIcon,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  ShieldAlert,
  CreditCard,
  Headphones,
  CheckCircle,
  Zap,
  Sliders
} from 'lucide-react';

export default function Navbar() {
  const {
    language,
    setLanguage,
    currency,
    setCurrency,
    currentUser,
    switchUser,
    cart,
    setIsCartOpen,
    activeTab,
    setActiveTab,
    siteSettings,
    orders,
    domains
  } = useApp();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const expiringCount = domains.filter((d) => d.status === 'expiring_soon').length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  const handleNavClick = (tabKey: any) => {
    setActiveTab(tabKey);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#061a3a]/95 backdrop-blur-md border-b border-slate-800/80 shadow-xl select-none">
      {/* Top Bar with Helpline, Currency & Language */}
      <div className="bg-[#030f24] border-b border-slate-800/60 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Since 2004 & Support Contacts */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {language === 'bn' ? '২০০৪ সাল থেকে – আপনার বিশ্বস্ত অংশীদার' : 'Since 2004 – Trusted by Businesses'}
            </span>
            <div className="hidden md:flex items-center gap-4 text-slate-400 text-[11px]">
              <a href="tel:+12139867750" className="hover:text-blue-400 flex items-center gap-1">
                <Phone className="w-3 h-3 text-blue-400" />
                <span>+1 (213) 986-7750 / +88-01841440202</span>
              </a>
              <a href="mailto:support@webdominic.com" className="hover:text-blue-400 flex items-center gap-1">
                <MailIcon className="w-3 h-3 text-blue-400" />
                <span>support@webdominic.com</span>
              </a>
            </div>
          </div>

          {/* Right: Currency, Language & Demo Role Switcher */}
          <div className="flex items-center gap-3">
            {/* Payment Badge */}
            <span className="hidden sm:inline-block bg-blue-950 text-blue-300 px-2 py-0.5 rounded text-[10px] border border-blue-800/60 font-medium">
              বিকাশ • নগদ • রকেট • কার্ড
            </span>

            {/* Language Switcher */}
            <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => setLanguage('bn')}
                className={`px-2 py-0.5 rounded font-semibold transition ${
                  language === 'bn' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded font-semibold transition ${
                  language === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
            </div>

            {/* Currency Switcher */}
            <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => setCurrency('BDT')}
                className={`px-2 py-0.5 rounded font-semibold transition ${
                  currency === 'BDT' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                ৳ BDT
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-2 py-0.5 rounded font-semibold transition ${
                  currency === 'USD' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                $ USD
              </button>
            </div>

            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-md text-[11px] font-medium border border-slate-700 transition"
              >
                {currentUser.role === 'admin' ? (
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Shield className="w-3 h-3" /> {language === 'bn' ? 'অ্যাডমিন' : 'Admin'}
                  </span>
                ) : currentUser.id === 99 ? (
                  <span className="flex items-center gap-1 text-slate-300">
                    <Globe className="w-3 h-3" /> {language === 'bn' ? 'ভিজিটর' : 'Visitor'}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-blue-400 font-medium">
                    <User className="w-3 h-3" /> {currentUser.fullName.split(' ')[0]}
                  </span>
                )}
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div
                  className="absolute right-0 mt-1 w-64 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50 text-xs"
                  onClick={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {language === 'bn' ? 'মোড পরিবর্তন করুন (Demo Switcher)' : 'Switch Role View'}
                  </div>
                  <button
                    onClick={() => switchUser('guest')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-blue-400" />
                      <span>{language === 'bn' ? 'পাবলিক ভিজিটর মোড' : 'Public Visitor'}</span>
                    </span>
                    <span className="text-[10px] text-slate-500">Home</span>
                  </button>
                  <button
                    onClick={() => switchUser('client')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{language === 'bn' ? 'কামরুল হাসান (Client #2)' : 'Client: Kamrul Hasan'}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">৳১,২৫০</span>
                  </button>
                  <button
                    onClick={() => switchUser('rahim')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-800 text-slate-200 flex items-center justify-between bg-blue-500/5"
                  >
                    <span className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{language === 'bn' ? 'মিস্টার আব্দুর রহিম (Client #3)' : 'Client: Mr. Abdur Rahim'}</span>
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-400">৳৩,৫০০</span>
                  </button>
                  <button
                    onClick={() => switchUser('admin')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-800 text-slate-200 flex items-center justify-between border-t border-slate-800 mt-1"
                  >
                    <span className="flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-amber-400" />
                      <span>{language === 'bn' ? 'অ্যাডমিন (মুহাম্মদ শফিউল আজম)' : 'Admin (Safiul Azam)'}</span>
                    </span>
                    {pendingOrdersCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px]">
                        {pendingOrdersCount} {language === 'bn' ? 'পেন্ডিং' : 'Pending'}
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand Logo with Image */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group py-2"
        >
          <div className="relative h-9 w-44 sm:w-52">
            <Image
              src="/images/logo-white.png"
              alt="Web Data Hosting"
              fill
              className="object-contain object-left"
              priority
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Desktop Mega Navigation Bar */}
        <nav className="hidden xl:flex items-center gap-1 text-[13.5px] font-semibold text-slate-200">
          {/* 1. Domains */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('domains')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => handleNavClick('domains')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition ${
                activeTab === 'domains' || activeDropdown === 'domains'
                  ? 'text-blue-400 bg-white/5'
                  : 'hover:text-blue-300'
              }`}
            >
              <span>{language === 'bn' ? 'ডোমেইন' : 'Domains'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'domains' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'domains' && (
              <div className="absolute top-full left-0 w-72 p-3 rounded-2xl bg-[#081f44] border border-slate-700 shadow-2xl space-y-1 z-50">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  {language === 'bn' ? 'ডোমেইন সেবাসমূহ' : 'Domain Services'}
                </div>
                <button
                  onClick={() => handleNavClick('domains')}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-600/20 text-slate-200 hover:text-blue-300 flex items-center gap-2.5 text-xs transition"
                >
                  <Globe className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="font-bold">{language === 'bn' ? 'ডোমেইন সার্চ' : 'Domain Search'}</div>
                    <div className="text-[10px] text-slate-400">{language === 'bn' ? 'নতুন ডোমেইন খুঁজুন ও রেজিস্টার করুন' : 'Search and register new domains'}</div>
                  </div>
                </button>
                <button
                  onClick={() => handleNavClick('pricing')}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-600/20 text-slate-200 hover:text-blue-300 flex items-center gap-2.5 text-xs transition"
                >
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-bold">{language === 'bn' ? 'ডোমেইন মূল্য তালিকা' : 'Domain Pricing'}</div>
                    <div className="text-[10px] text-slate-400">{language === 'bn' ? 'সকল TLD ও রিনিউয়াল ফি' : 'Full TLD list & renewal pricing'}</div>
                  </div>
                </button>
                <button
                  onClick={() => handleNavClick('domains')}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-600/20 text-slate-200 hover:text-blue-300 flex items-center gap-2.5 text-xs transition"
                >
                  <ArrowRight className="w-4 h-4 text-indigo-400" />
                  <div>
                    <div className="font-bold">{language === 'bn' ? 'ডোমেইন ট্রান্সফার' : 'Domain Transfer'}</div>
                    <div className="text-[10px] text-slate-400">{language === 'bn' ? 'সহজে আপনার ডোমেইন WDH এ আনুন' : 'Migrate domain seamlessly'}</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 2. Hosting */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('hosting')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => handleNavClick('hosting')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition ${
                activeTab === 'hosting' || activeDropdown === 'hosting'
                  ? 'text-blue-400 bg-white/5'
                  : 'hover:text-blue-300'
              }`}
            >
              <span>{language === 'bn' ? 'হোস্টিং' : 'Hosting'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'hosting' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'hosting' && (
              <div className="absolute top-full -left-10 w-80 p-3 rounded-2xl bg-[#081f44] border border-slate-700 shadow-2xl space-y-1 z-50">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  {language === 'bn' ? 'হোস্টিং সলিউশনসমূহ' : 'Hosting Solutions'}
                </div>
                <button
                  onClick={() => handleNavClick('hosting')}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-600/20 text-slate-200 hover:text-blue-300 flex items-center gap-2.5 text-xs transition"
                >
                  <HardDrive className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="font-bold">{language === 'bn' ? 'শেয়ার্ড ওয়েব হোস্টিং' : 'Shared Web Hosting'}</div>
                    <div className="text-[10px] text-slate-400">{language === 'bn' ? '1GB থেকে 50GB NVMe cPanel প্ল্যান' : 'Fast cPanel hosting with free SSL'}</div>
                  </div>
                </button>
                <button
                  onClick={() => handleNavClick('hosting')}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-600/20 text-slate-200 hover:text-blue-300 flex items-center gap-2.5 text-xs transition"
                >
                  <Server className="w-4 h-4 text-indigo-400" />
                  <div>
                    <div className="font-bold">{language === 'bn' ? 'বিজনেস হোস্টিং' : 'Business Hosting'}</div>
                    <div className="text-[10px] text-slate-400">{language === 'bn' ? '100GB থেকে 300GB ডেডিকেটেড রিসোর্স' : 'Heavy traffic & e-commerce ready'}</div>
                  </div>
                </button>
                <button
                  onClick={() => handleNavClick('reseller')}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-600/20 text-slate-200 hover:text-blue-300 flex items-center gap-2.5 text-xs transition"
                >
                  <Layers className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="font-bold">{language === 'bn' ? 'রিসেলার হোস্টিং (WHM)' : 'Reseller Hosting'}</div>
                    <div className="text-[10px] text-slate-400">{language === 'bn' ? 'একাধিক ক্লায়েন্ট ও cPanel অ্যাকাউন্ট পরিচালনা' : 'White-label hosting business'}</div>
                  </div>
                </button>
                <button
                  onClick={() => handleNavClick('custom_hosting')}
                  className="w-full text-left px-3 py-2 rounded-xl bg-blue-600/10 hover:bg-blue-600/25 text-blue-300 flex items-center gap-2.5 text-xs transition border border-blue-500/20"
                >
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="font-bold">{language === 'bn' ? 'কাস্টম হোস্টিং বিল্ডার' : 'Custom Hosting Builder'}</div>
                    <div className="text-[10px] text-slate-300">{language === 'bn' ? '১২০GB, ২০০GB বা ২TB কাস্টম রিকোয়েস্ট' : 'Build exact package around your needs'}</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 3. Servers */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('servers')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => handleNavClick('vps')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition ${
                activeTab === 'vps' || activeDropdown === 'servers'
                  ? 'text-blue-400 bg-white/5'
                  : 'hover:text-blue-300'
              }`}
            >
              <span>{language === 'bn' ? 'সার্ভার' : 'Servers'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'servers' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'servers' && (
              <div className="absolute top-full -left-10 w-72 p-3 rounded-2xl bg-[#081f44] border border-slate-700 shadow-2xl space-y-1 z-50">
                <button
                  onClick={() => handleNavClick('vps')}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-600/20 text-slate-200 hover:text-blue-300 flex items-center gap-2.5 text-xs transition"
                >
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="font-bold">{language === 'bn' ? 'ক্লাউড KVM VPS' : 'Cloud KVM VPS'}</div>
                    <div className="text-[10px] text-slate-400">USA Tier-3 Data Center, Root Access</div>
                  </div>
                </button>
                <button
                  onClick={() => handleNavClick('vps')}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-600/20 text-slate-200 hover:text-blue-300 flex items-center gap-2.5 text-xs transition"
                >
                  <Server className="w-4 h-4 text-indigo-400" />
                  <div>
                    <div className="font-bold">{language === 'bn' ? 'ডেডিকেটেড সার্ভার' : 'Dedicated Servers'}</div>
                    <div className="text-[10px] text-slate-400">100% Bare Metal Enterprise Power</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 4. Websites */}
          <button
            onClick={() => handleNavClick('websites')}
            className={`px-3 py-2 rounded-lg transition ${
              activeTab === 'websites' ? 'text-blue-400 bg-white/5' : 'hover:text-blue-300'
            }`}
          >
            {language === 'bn' ? 'ওয়েবসাইট' : 'Websites'}
          </button>

          {/* 5. AI Solutions (NEW Highlighted) */}
          <button
            onClick={() => handleNavClick('ai_solutions')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition ${
              activeTab === 'ai_solutions'
                ? 'text-purple-300 bg-purple-500/15 border border-purple-500/30'
                : 'text-purple-300 hover:text-purple-200 hover:bg-purple-900/20'
            }`}
          >
            <Bot className="w-4 h-4 text-purple-400" />
            <span>{language === 'bn' ? 'এআই সমাধান' : 'AI Solutions'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[9px] font-black uppercase tracking-wider animate-pulse">
              NEW
            </span>
          </button>

          {/* 6. Business Email */}
          <button
            onClick={() => handleNavClick('business_email')}
            className={`px-3 py-2 rounded-lg transition ${
              activeTab === 'business_email' ? 'text-blue-400 bg-white/5' : 'hover:text-blue-300'
            }`}
          >
            {language === 'bn' ? 'ইমেইল সেবা' : 'Business Email'}
          </button>

          {/* 7. Security */}
          <button
            onClick={() => handleNavClick('security')}
            className={`px-3 py-2 rounded-lg transition ${
              activeTab === 'security' ? 'text-blue-400 bg-white/5' : 'hover:text-blue-300'
            }`}
          >
            {language === 'bn' ? 'সিকিউরিটি' : 'Security'}
          </button>

          {/* 8. More / Pricing */}
          <button
            onClick={() => handleNavClick('pricing')}
            className={`px-3 py-2 rounded-lg transition ${
              activeTab === 'pricing' ? 'text-blue-400 bg-white/5' : 'hover:text-blue-300'
            }`}
          >
            {language === 'bn' ? 'মূল্য তালিকা' : 'Pricing'}
          </button>
        </nav>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          {/* Cart Drawer Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200 hover:text-white hover:border-blue-500 transition cursor-pointer"
            title="কার্ট দেখুন"
          >
            <ShoppingCart className="w-5 h-5 text-blue-400" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-black flex items-center justify-center shadow-lg shadow-blue-500/50 animate-bounce">
                {cart.length}
              </span>
            )}
          </button>

          {/* User / Client Portal Button */}
          {currentUser.role === 'admin' ? (
            <button
              onClick={() => handleNavClick('admin_panel')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                activeTab === 'admin_panel'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Control'}</span>
              {pendingOrdersCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              )}
            </button>
          ) : (
            <button
              onClick={() => handleNavClick('user_panel')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                activeTab === 'user_panel'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/30'
                  : 'bg-blue-500/10 text-blue-300 border-blue-500/30 hover:bg-blue-500/20'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'bn' ? 'ক্লায়েন্ট পোর্টাল' : 'Client Portal'}</span>
              {expiringCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              )}
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#071d42] border-b border-slate-800 px-4 py-4 space-y-2 text-sm shadow-2xl">
          <button
            onClick={() => handleNavClick('home')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200"
          >
            {language === 'bn' ? 'হোমপেজ' : 'Home'}
          </button>
          <button
            onClick={() => handleNavClick('domains')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center gap-2"
          >
            <Globe className="w-4 h-4 text-blue-400" />
            <span>{language === 'bn' ? 'ডোমেইন রেজিস্ট্রেশন ও সার্চ' : 'Domains'}</span>
          </button>
          <button
            onClick={() => handleNavClick('hosting')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center gap-2"
          >
            <HardDrive className="w-4 h-4 text-indigo-400" />
            <span>{language === 'bn' ? 'ওয়েব হোস্টিং প্যাকেজসমূহ' : 'Hosting Plans'}</span>
          </button>
          <button
            onClick={() => handleNavClick('custom_hosting')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-cyan-300 flex items-center gap-2"
          >
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>{language === 'bn' ? 'কাস্টম হোস্টিং বিল্ডার' : 'Custom Hosting Builder'}</span>
          </button>
          <button
            onClick={() => handleNavClick('vps')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center gap-2"
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>{language === 'bn' ? 'ক্লাউড VPS সার্ভার' : 'Cloud VPS'}</span>
          </button>
          <button
            onClick={() => handleNavClick('ai_solutions')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-purple-300 flex items-center gap-2"
          >
            <Bot className="w-4 h-4 text-purple-400" />
            <span>{language === 'bn' ? 'এআই সমাধান ও n8n অটোমেশন' : 'AI Solutions'}</span>
          </button>
          <button
            onClick={() => handleNavClick('pricing')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200"
          >
            {language === 'bn' ? 'সকল মূল্য তালিকা' : 'Pricing'}
          </button>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('user_panel')}
              className="w-full text-center py-2.5 rounded-xl bg-blue-600 text-white font-semibold"
            >
              {language === 'bn' ? 'আমার ক্লায়েন্ট পোর্টাল' : 'Client Portal'}
            </button>
            <button
              onClick={() => { switchUser('admin'); handleNavClick('admin_panel'); }}
              className="w-full text-center py-2 rounded-xl bg-slate-800 text-amber-400 text-xs font-semibold"
            >
              {language === 'bn' ? 'অ্যাডমিন প্যানেলে যান' : 'Switch to Admin Panel'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
