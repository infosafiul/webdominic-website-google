'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context';
import {
  Search,
  CheckCircle,
  XCircle,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Headphones,
  Lock,
  Tag,
  ChevronRight,
  Check,
  Gift,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Flame
} from 'lucide-react';

export default function HeroDomainSearch() {
  const {
    language,
    currency,
    formatPrice,
    domainPrices,
    cart,
    addToCart,
    setIsCartOpen,
    setActiveTab,
    siteSettings
  } = useApp();

  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchedDomain, setSearchedDomain] = useState<string>('');
  const [searchedSld, setSearchedSld] = useState<string>('');
  const [searchedTld, setSearchedTld] = useState<string>('com');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);

  // Quick TLD pills from index.php
  const quickTlds = [
    { ext: '.com', bdt: 1650, usd: 15.50, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
    { ext: '.net', bdt: 860, usd: 8.60, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { ext: '.org', bdt: 1770, usd: 17.70, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { ext: '.info', bdt: 1860, usd: 18.60, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
    { ext: '.biz', bdt: 990, usd: 9.90, color: 'text-teal-400 bg-teal-500/10 border-teal-500/30' },
    { ext: '.shop', bdt: 1890, usd: 18.90, color: 'text-pink-400 bg-pink-500/10 border-pink-500/30' },
  ];

  // Specific TLD styling matching wdh_tld_color() from domains.php
  const getTldBadgeStyle = (tld: string) => {
    const clean = tld.replace('.', '').toLowerCase();
    switch (clean) {
      case 'com':
        return 'bg-blue-600/20 text-blue-400 border-blue-500/30';
      case 'net':
        return 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30';
      case 'org':
        return 'bg-amber-600/20 text-amber-400 border-amber-500/30';
      case 'info':
        return 'bg-purple-600/20 text-purple-400 border-purple-500/30';
      case 'biz':
        return 'bg-teal-600/20 text-teal-400 border-teal-500/30';
      case 'shop':
        return 'bg-pink-600/20 text-pink-400 border-pink-500/30';
      case 'xyz':
        return 'bg-violet-600/20 text-violet-400 border-violet-500/30';
      case 'ai':
        return 'bg-fuchsia-600/20 text-fuchsia-400 border-fuchsia-500/30';
      case 'tech':
      case 'dev':
        return 'bg-cyan-600/20 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30';
    }
  };

  // Known taken domain prefixes for realistic domain check simulation
  const registeredNames = new Set([
    'google', 'facebook', 'youtube', 'bkash', 'wdhdomain', 'apple', 'microsoft', 'amazon', 'twitter', 'netflix', 'daraz'
  ]);

  const handleSearch = (e?: React.FormEvent, customDomain?: string) => {
    if (e) e.preventDefault();
    const val = (customDomain ?? query).trim().toLowerCase();
    if (!val) return;

    setIsSearching(true);

    // Clean domain: remove http, www, trailing slashes
    let clean = val.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    clean = clean.replace(/[^a-z0-9.-]/g, '');

    let sld = clean;
    let tld = 'com';

    if (clean.includes('.')) {
      const parts = clean.split('.');
      tld = parts.pop() || 'com';
      sld = parts.join('.');
    }

    setTimeout(() => {
      setSearchedSld(sld);
      setSearchedTld(tld);
      setSearchedDomain(`${sld}.${tld}`);
      setHasSearched(true);
      setIsSearching(false);
    }, 250);
  };

  const handlePillClick = (ext: string) => {
    const cleanExt = ext.replace('.', '');
    const currentBase = searchedSld || query.replace(/^(https?:\/\/)?(www\.)?/, '').split('.')[0] || 'mybusiness';
    const target = `${currentBase}.${cleanExt}`;
    setQuery(target);
    handleSearch(undefined, target);
  };

  // Check if a specific domain is already in the Cart
  const isDomainInCart = (domainName: string) => {
    const lower = domainName.toLowerCase();
    return cart.some(
      (item) => item.type === 'domain' && item.domainName?.toLowerCase() === lower
    );
  };

  // Add Domain to Cart with immediate feedback
  const handleAddToCart = (domainName: string, tldStr: string, price: number) => {
    addToCart({
      type: 'domain',
      name: `ডোমেইন রেজিস্ট্রেশন (${domainName})`,
      domainName: domainName,
      billingCycle: 'yearly',
      price: price,
      currency: 'BDT',
      details: {
        tld: tldStr.startsWith('.') ? tldStr : `.${tldStr}`,
        nameservers: ['ns1.webdominic.com', 'ns2.webdominic.com'],
      },
    });

    setRecentlyAdded(domainName);
    setTimeout(() => setRecentlyAdded(null), 3000);
  };

  // Primary domain status calculation
  const isPrimaryDomainTaken = registeredNames.has(searchedSld) && (searchedTld === 'com' || searchedTld === 'net');
  const primaryDomainPrice = domainPrices.find((p) => p.tld === `.${searchedTld}`)?.registrationPrice || 1749;

  // Filter extensions based on category
  const filteredTlds = domainPrices.filter((dp) => {
    if (selectedCategory === 'all') return true;
    return dp.category === selectedCategory;
  });

  // Best alternative domain if primary is taken
  const alternativeTld = searchedTld === 'com' ? 'net' : 'com';
  const alternativeDomain = `${searchedSld}.${alternativeTld}`;
  const alternativePrice = domainPrices.find((p) => p.tld === `.${alternativeTld}`)?.registrationPrice || 1949;

  return (
    <div>
      {/* 1. Main Hero Section matching live index.php */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-[#061a3a] via-[#08224c] to-[#041126] border-b border-slate-800">
        <div className="absolute top-1/4 left-1/3 w-[550px] h-[350px] bg-blue-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[280px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>{language === 'bn' ? '২০০৪ সাল থেকে' : 'SINCE 2004'}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
                {language === 'bn' ? (
                  <>
                    আমরা শুধু হোস্ট করি না,<br />
                    আপনার ওয়েবসাইটকে<br />
                    <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                      সবসময় সচল রাখি।
                    </span>
                  </>
                ) : (
                  <>
                    We Don&apos;t Just Host Your Website.<br />
                    We Help{' '}
                    <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                      Keep It Running.
                    </span>
                  </>
                )}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                {language === 'bn'
                  ? 'বিজনেস হোস্টিং, ওয়েবসাইট, সার্ভার এবং ইমেইল সেবা — অভিজ্ঞ টেকনিক্যাল সাপোর্টের মাধ্যমে সার্বক্ষণিক পরিচালিত।'
                  : 'Business Hosting, Websites, Servers & Business Email — backed by experienced technical support.'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('hosting')}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-500/30 transition flex items-center gap-2 cursor-pointer"
                >
                  <span>{language === 'bn' ? 'সমাধান দেখুন' : 'Explore Solutions'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={`tel:${siteSettings.supportPhone}`}
                  className="px-6 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm transition flex items-center gap-2"
                >
                  <Headphones className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'bn' ? 'বিশেষজ্ঞের সাথে কথা বলুন' : 'Talk to a Specialist'}</span>
                </a>
              </div>

              {/* Trust Row */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <ShieldCheck className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span className="font-semibold leading-tight">
                    {language === 'bn' ? 'USA-ভিত্তিক ইনফ্রাস্ট্রাকচার' : 'USA-Based Infrastructure'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="font-semibold leading-tight">
                    {language === 'bn' ? '৯৯.৯% আপটাইম নিশ্চিত' : '99.9% Uptime Guarantee'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Headphones className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  <span className="font-semibold leading-tight">
                    {language === 'bn' ? '২৪/৭ বিশেষজ্ঞ সাপোর্ট' : '24/7 Expert Support'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Lock className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <span className="font-semibold leading-tight">
                    {language === 'bn' ? 'নিরাপত্তা ও নির্ভরযোগ্যতা' : 'Secure & Reliable'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#081e42]/90 border border-blue-500/30 shadow-2xl backdrop-blur-xl space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                      USA DATA CENTER ACTIVE
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                    Tier-3 USA DC
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {language === 'bn' ? 'যুক্তরাষ্ট্রভিত্তিক ইনফ্রাস্ট্রাকচার' : 'USA-Based Infrastructure Built for Businesses'}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {language === 'bn' ? 'নির্ভরযোগ্য। নিরাপদ। উচ্চ পারফরম্যান্স।' : 'Reliable. Secure. High Performance.'}
                  </p>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-200">
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px]">✓</div>
                    <span>{language === 'bn' ? 'উচ্চ পারফরম্যান্স NVMe সার্ভার' : 'High Performance NVMe Drives'}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px]">✓</div>
                    <span>{language === 'bn' ? '৯৯.৯% আপটাইম গ্যারান্টি (SLA)' : '99.9% Uptime Guarantee'}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px]">✓</div>
                    <span>{language === 'bn' ? 'এন্টারপ্রাইজ-গ্রেড নিরাপত্তা ও ফায়ারওয়াল' : 'Enterprise Web Firewall Protection'}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px]">✓</div>
                    <span>{language === 'bn' ? 'DDoS প্রশমন ও রিয়েলটাইম সুরক্ষা' : 'Advanced DDoS Attack Mitigation'}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px]">✓</div>
                    <span>{language === 'bn' ? 'নিয়মিত স্বয়ংক্রিয় ক্লাউড ব্যাকআপ' : 'Daily Automated Cloud Backups'}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Authentic Domain Search Section & Add-to-Cart Sequence matching domains.php */}
      <section id="domain-search-hub" className="py-12 bg-[#041126] border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Main Search Box */}
          <div className="p-6 sm:p-10 rounded-3xl bg-[#081e42] border border-blue-500/30 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {language === 'bn' ? 'আপনার পছন্দের ডোমেইন খুঁজুন' : 'Find Your Perfect Domain'}
                  </h2>
                  <p className="text-xs text-slate-300">
                    {language === 'bn'
                      ? 'আপনার ব্র্যান্ডের জন্য সঠিক ডোমেইন নামটি খুঁজে নিন এবং সহজেই নিবন্ধন করুন।'
                      : 'Search for your domain name and build your online identity.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Search Input Form */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-2xl bg-[#030d1e] border border-slate-700">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: yourcompany.com বা আপনার পছন্দের নাম' : 'Have a name in mind? Find a domain.'}
                  className="w-full pl-12 pr-4 py-3 bg-transparent text-white text-sm sm:text-base focus:outline-none placeholder:text-slate-500 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isSearching}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30 disabled:opacity-60"
              >
                {isSearching ? (
                  <span>{language === 'bn' ? 'যাচাই করা হচ্ছে...' : 'Searching...'}</span>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>{language === 'bn' ? 'ডোমেইন খুঁজুন' : 'Search Domain'}</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick TLD Pills matching repo index.php */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {quickTlds.map((tld) => (
                <button
                  key={tld.ext}
                  type="button"
                  onClick={() => handlePillClick(tld.ext)}
                  className={`px-3 py-2 rounded-xl border flex items-center gap-2 text-xs font-bold transition cursor-pointer ${tld.color}`}
                >
                  <span className="text-sm font-black">{tld.ext}</span>
                  <span className="text-[11px] text-slate-200">
                    {currency === 'BDT' ? `৳${tld.bdt}` : `$${tld.usd.toFixed(2)}`}
                    <small className="text-slate-400 font-normal">/yr</small>
                  </span>
                </button>
              ))}

              <button
                type="button"
                onClick={() => setActiveTab('pricing')}
                className="text-xs text-blue-400 hover:text-cyan-300 font-semibold px-2 py-1 flex items-center gap-1 ml-auto cursor-pointer"
              >
                <span>{language === 'bn' ? 'সকল ডোমেইন মূল্য দেখুন' : 'View All Domains'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3. STEP 2: Live Availability Status Banner & Cart Sequence matching domains.php */}
          {hasSearched && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              {/* If Searched Domain is AVAILABLE */}
              {!isPrimaryDomainTaken ? (
                <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/40 border-2 border-emerald-500/50 shadow-2xl space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-500/40">
                        <CheckCircle className="w-7 h-7" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-lg sm:text-2xl font-black text-white flex items-center gap-2">
                          <span>{language === 'bn' ? 'অভিনন্দন!' : 'Congratulations!'}</span>
                          <span className="text-emerald-400 font-mono underline decoration-emerald-500/50">
                            {searchedDomain}
                          </span>
                          <span>{language === 'bn' ? 'ডোমেইনটি খালি আছে।' : 'is available.'}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300">
                          {language === 'bn'
                            ? 'অন্য কেউ নেওয়ার আগেই এখনই আপনার কার্টে যোগ করুন।'
                            : 'Grab it now before someone else does — add it to your cart below.'}
                        </p>
                      </div>
                    </div>

                    {/* Price and Cart Actions */}
                    <div className="flex items-center gap-4 self-end md:self-center">
                      <div className="text-right">
                        <div className="text-xl sm:text-2xl font-black text-white">
                          {formatPrice(primaryDomainPrice)}
                        </div>
                        <div className="text-[10px] text-slate-400">/year</div>
                      </div>

                      {isDomainInCart(searchedDomain) ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled
                            className="px-5 py-3 rounded-xl bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 font-bold text-xs flex items-center gap-1.5 cursor-default"
                          >
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>{language === 'bn' ? '✓ কার্টে যোগ করা হয়েছে' : '✓ Added to Cart'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsCartOpen(true)}
                            className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <span>{language === 'bn' ? 'কার্ট দেখুন →' : 'View Cart →'}</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddToCart(searchedDomain, searchedTld, primaryDomainPrice)}
                          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-emerald-600/30 transition cursor-pointer"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>{language === 'bn' ? 'কার্টে যোগ করুন →' : 'Add to Cart →'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Bundle Discount Line from domains.php */}
                  <div className="pt-3 border-t border-emerald-900/40 flex items-center gap-2.5 text-xs text-amber-300">
                    <Gift className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>
                      <strong className="text-white">{language === 'bn' ? 'বিশেষ ডিসকাউন্ট অফার:' : 'Get Discount!'}</strong>{' '}
                      {language === 'bn'
                        ? 'হোস্টিং প্যাকেজের সাথে কিনলে ডোমেইনের দামে ৳১০০ বিশেষ ছাড়, অথবা ডোমেইন + হোস্টিং + ওয়েবসাইট কম্বোতে আকর্ষণীয় প্যাকেজ অফার!'
                        : '৳100 off with Hosting purchase, or special combo pricing with Domain + Hosting + Website!'}
                    </span>
                  </div>
                </div>
              ) : (
                /* If Searched Domain is TAKEN */
                <div className="space-y-4">
                  <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-rose-950/40 border border-rose-500/40 shadow-xl flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0 border border-rose-500/40">
                      <XCircle className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                        <span>{language === 'bn' ? 'দুঃখিত,' : 'Sorry,'}</span>
                        <span className="text-rose-400 font-mono underline">{searchedDomain}</span>
                        <span>{language === 'bn' ? 'ডোমেইনটি আগেই বুকড হয়ে গেছে।' : 'is not available.'}</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        {language === 'bn'
                          ? 'এটি ইতিমধ্যে নিবন্ধিত — নিচে প্রস্তাবিত বিকল্প এক্সটেনশনগুলো দেখুন।'
                          : "It's already registered — check the available alternatives below."}
                      </p>
                    </div>
                  </div>

                  {/* Great Alternative Card matching domains.php */}
                  <div className="p-6 rounded-3xl bg-[#082046] border border-blue-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-wider border border-blue-500/30">
                        {language === 'bn' ? 'সেরা বিকল্প' : 'Great Alternative'}
                      </span>
                      <h3 className="text-xl font-black text-white font-mono">{alternativeDomain}</h3>
                      <p className="text-xs text-slate-300">
                        {alternativeTld === 'net'
                          ? 'Great for technology and business networks'
                          : 'Best for businesses and brands'}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xl font-black text-white">{formatPrice(alternativePrice)}</div>
                        <div className="text-[10px] text-slate-400">/year</div>
                      </div>

                      {isDomainInCart(alternativeDomain) ? (
                        <button
                          type="button"
                          disabled
                          className="px-4 py-2.5 rounded-xl bg-emerald-600/30 text-emerald-300 font-bold text-xs flex items-center gap-1.5 cursor-default border border-emerald-500/40"
                        >
                          <Check className="w-4 h-4" />
                          <span>{language === 'bn' ? '✓ কার্টে যোগ করা হয়েছে' : '✓ Added to Cart'}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddToCart(alternativeDomain, alternativeTld, alternativePrice)}
                          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-blue-600/30"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'কার্টে যোগ করুন →' : 'Add to Cart →'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Category Tabs Filter from domains.php */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-400 font-semibold mr-1">
                  {language === 'bn' ? 'ক্যাটাগরি ফিল্টার:' : 'Filter Extensions:'}
                </span>
                {[
                  { id: 'all', label: language === 'bn' ? 'সকল এক্সটেনশন' : 'All Extensions' },
                  { id: 'popular', label: language === 'bn' ? 'জনপ্রিয় (Popular)' : 'Popular' },
                  { id: 'ecommerce', label: language === 'bn' ? 'ই-কমার্স (eCommerce)' : 'E-commerce' },
                  { id: 'technology', label: language === 'bn' ? 'টেকনোলজি (Tech)' : 'Technology' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer border ${
                      selectedCategory === cat.id
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/25'
                        : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* 5. Full Extension Result Grid matching domains.php result cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredTlds.map((item) => {
                  const fullCandidate = `${searchedSld}${item.tld}`;
                  const isTaken = registeredNames.has(searchedSld) && (item.tld === '.com' || item.tld === '.net');
                  const inCart = isDomainInCart(fullCandidate);
                  const isBestChoice = fullCandidate === searchedDomain && !isTaken;

                  return (
                    <div
                      key={item.tld}
                      className={`p-4 rounded-2xl border transition duration-200 flex items-center justify-between gap-4 ${
                        isBestChoice
                          ? 'bg-[#09224c] border-blue-500 shadow-lg'
                          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-md font-mono text-xs font-black border ${getTldBadgeStyle(
                              item.tld
                            )}`}
                          >
                            {item.tld}
                          </span>
                          <span className="font-bold text-white text-sm font-mono truncate">
                            {fullCandidate}
                          </span>
                          {!isTaken ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              Available
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                              Taken
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate max-w-xs">{item.description}</p>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right">
                          <div className="text-sm font-black text-white">
                            {formatPrice(item.registrationPrice)}
                          </div>
                          <div className="text-[9px] text-slate-500">/year</div>
                        </div>

                        {!isTaken ? (
                          inCart ? (
                            <button
                              type="button"
                              disabled
                              className="px-3 py-1.5 rounded-xl bg-emerald-600/30 text-emerald-300 font-bold text-xs flex items-center gap-1 border border-emerald-500/40 cursor-default"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{language === 'bn' ? 'কার্টে আছে' : 'In Cart'}</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAddToCart(fullCandidate, item.tld, item.registrationPrice)}
                              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-blue-600/30"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>{language === 'bn' ? 'অর্ডার করুন' : 'Add to Cart'}</span>
                            </button>
                          )
                        ) : (
                          <span className="text-xs font-semibold text-slate-500 px-3 py-1.5">
                            {language === 'bn' ? 'বুকড' : 'Taken'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bundle Promo Offer Banner from index.php */}
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/30 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {language === 'bn' ? 'হোস্টিং প্যাকেজে ডোমেইনের দামে ৫০% পর্যন্ত ছাড়!' : 'Domain price up to 50% off with hosting'}
                </h3>
                <p className="text-xs text-slate-300">
                  {language === 'bn'
                    ? 'হোস্টিং প্ল্যানের সাথে ডোমেইন কিনুন এবং প্রথম বছরের মূল্যে বিশেষ ছাড় উপভোগ করুন।'
                    : "Buy your domain together with a hosting or website plan and save on the domain's first-year price."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('hosting')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs whitespace-nowrap transition cursor-pointer"
            >
              {language === 'bn' ? 'অফারটি দেখুন →' : 'See Offer →'}
            </button>
          </div>
        </div>
      </section>

      {/* Floating Toast Notification when any Domain is Added to Cart */}
      {recentlyAdded && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#09224c] border-2 border-emerald-500 text-white shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="text-xs font-bold">
              {language === 'bn' ? 'ডোমেইন কার্টে যোগ হয়েছে!' : 'Domain Added to Cart!'}
            </div>
            <div className="text-[11px] text-emerald-300 font-mono">{recentlyAdded}</div>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="ml-2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer"
          >
            {language === 'bn' ? 'কার্ট খুলুন' : 'Open Cart'}
          </button>
        </div>
      )}
    </div>
  );
}
