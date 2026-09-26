'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context';
import {
  Check,
  Zap,
  Server,
  Sparkles,
  Layers,
  ArrowRight,
  Shield,
  HelpCircle,
  HardDrive,
  Sliders,
  Building2,
  Users
} from 'lucide-react';
import { HostingProduct } from '@/lib/types';

export default function HostingCatalog() {
  const { language, currency, formatPrice, products, addToCart, setIsCartOpen, setActiveTab } = useApp();
  const [activeCategory, setActiveCategory] = useState<'shared' | 'business' | 'reseller' | 'custom'>('shared');
  const [selectedStorageGb, setSelectedStorageGb] = useState<number>(10);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  // Filtered packages
  const sharedPlans = [
    {
      id: 20,
      gb: 1,
      name: '1GB Starter NVMe',
      monthlyPrice: 99,
      yearlyPrice: 999,
      descBn: 'ব্যক্তিগত ব্লগ ও টেস্ট প্রজেক্টের জন্য সেরা',
      descEn: 'Perfect for small personal sites and testing',
      features: ['১টি ওয়েবসাইট', '1 GB NVMe SSD', '10 GB Bandwidth', 'ফ্রি SSL সার্টিফিকেট', 'cPanel কন্ট্রোল প্যানেল', '২টি বিজনেস ইমেইল'],
      badge: 'সাশ্রয়ী'
    },
    {
      id: 21,
      gb: 5,
      name: '5GB Standard NVMe',
      monthlyPrice: 199,
      yearlyPrice: 1990,
      descBn: 'পোর্টফোলিও ও প্রফেশনাল ওয়েবসাইটের জন্য',
      descEn: 'Ideal for portfolios and business sites',
      features: ['১টি ওয়েবসাইট', '5 GB NVMe SSD', 'Fair Bandwidth', 'ফ্রি SSL সার্টিফিকেট', 'cPanel কন্ট্রোল প্যানেল', '৫টি বিজনেস ইমেইল', 'দৈনিক ক্লাউড ব্যাকআপ'],
    },
    {
      id: 1,
      gb: 10,
      name: '10GB Basic Hosting',
      monthlyPrice: 299,
      yearlyPrice: 2990,
      descBn: 'ছোট ও মাঝারি ব্যবসার সেরা প্যাকেজ',
      descEn: 'Great for growing websites and blogs',
      features: ['১টি ওয়েবসাইট', '10 GB Pure NVMe SSD', 'Fair Bandwidth', 'ফ্রি SSL সার্টিফিকেট', 'cPanel কন্ট্রোল প্যানেল', '১০টি বিজনেস ইমেইল', 'দৈনিক ব্যাকআপ'],
      badge: 'জনপ্রিয়'
    },
    {
      id: 22,
      gb: 20,
      name: '20GB Business NVMe',
      monthlyPrice: 449,
      yearlyPrice: 4490,
      descBn: 'ই-কমার্স ও সক্রিয় অনলাইন বিজনেসের জন্য',
      descEn: 'Perfect for active online stores & companies',
      features: ['১টি ওয়েবসাইট', '20 GB Pure NVMe SSD', 'আনমিটারড ব্যান্ডউইথ', 'ফ্রি প্রিমিয়াম SSL', 'cPanel + LiteSpeed', 'আনলিমিটেড ইমেইল একাউন্ট', 'অফসাইট অটো-ব্যাকআপ'],
      badge: 'সেরা পছন্দ'
    },
    {
      id: 2,
      gb: 50,
      name: '50GB Pro NVMe Hosting',
      monthlyPrice: 699,
      yearlyPrice: 6990,
      descBn: 'ভারী ডাটাবেস ও উচ্চ ভিজিটর ট্রাফিকের জন্য',
      descEn: 'High memory & performance for dynamic sites',
      features: ['১টি ওয়েবসাইট', '50 GB Ultra NVMe Storage', 'আনমিটারড ব্যান্ডউইথ', 'ফ্রি প্রিমিয়াম SSL', 'cPanel + LiteSpeed ক্যাশ', 'ডেডিকেটেড রিসোর্স পুল', '২৪/৭ ভিআইপি সাপোর্ট'],
    }
  ];

  const businessPlans = [
    {
      id: 3,
      gb: 100,
      name: '100GB Corporate Cloud',
      monthlyPrice: 999,
      yearlyPrice: 9990,
      descBn: 'কর্পোরেট পোর্টাল ও ই-কমার্স মার্কেটপ্লেসের জন্য',
      descEn: 'Enterprise level storage and computing resources',
      features: ['১টি ওয়েবসাইট (প্রয়োজনে রিসেলার একাউন্ট)', '100 GB NVMe Storage', 'আনমিটারড ট্রাফিক', 'cPanel / AAA Hosting', 'LiteSpeed Web Server', 'দৈনিক অটো ব্যাকআপ', 'Priority Support'],
      badge: 'কর্পোরেট'
    },
    {
      id: 4,
      gb: 200,
      name: '200GB Enterprise Hosting',
      monthlyPrice: 1799,
      yearlyPrice: 17990,
      descBn: 'লার্জ স্কেল ডাটাবেস ও মিডিয়া পোর্টালের জন্য',
      descEn: 'Maximum CPU & RAM allocation with NVMe storage',
      features: ['আনলিমিটেড ডাটাবেস', '200 GB Enterprise NVMe', 'আনমিটারড ট্রাফিক', 'ডেডিকেটেড আইপি অপশন', 'ফ্রি ওয়াইল্ডকার্ড SSL', 'প্রোঅ্যাকটিভ ম্যালওয়্যার ডিফেন্স', '২৪/৭ ডেডিকেটেড ম্যানেজার'],
      badge: 'পাওয়ারফুল'
    },
    {
      id: 5,
      gb: 300,
      name: '300GB Ultimate Cloud',
      monthlyPrice: 2499,
      yearlyPrice: 24990,
      descBn: 'মিশন ক্রিটিক্যাল প্রতিষ্ঠান ও সরকারি পোর্টাল',
      descEn: 'Top-tier isolated cloud hosting capacity',
      features: ['300 GB Pure NVMe SSD', 'আনমিটারড ব্যান্ডউইথ', 'ক্লাউডফ্লেয়ার এন্টারপ্রাইজ ইন্টিগ্রেশন', '৪ গিগাবাইট ডেডিকেটেড র্যাম', 'cPanel / WHM সাপোর্ট', 'ইনস্ট্যান্ট দুর্যোগ রিকভারি'],
    }
  ];

  const resellerPlans = [
    {
      id: 10,
      accounts: 25,
      name: 'Reseller 25 Accounts',
      monthlyPrice: 1299,
      yearlyPrice: 12990,
      descBn: 'হোস্টিং বিজনেস শুরু করার সেরা প্যাকেজ',
      descEn: 'Start your own hosting business with WHM',
      features: ['২৫টি cPanel একাউন্ট তৈরি সুবিধা', '50 GB NVMe SSD', 'WHM কন্ট্রোল প্যানেল', 'হোয়াইট-লেবেল ব্র্যান্ডিং', 'ফ্রি প্রাইভেট নেইমসার্ভার', 'অটোমেটিক SSL প্রতিটি ডোমেইনে'],
      badge: 'স্টার্টার রিসেলার'
    },
    {
      id: 11,
      accounts: 50,
      name: 'Reseller 50 Accounts',
      monthlyPrice: 2299,
      yearlyPrice: 22990,
      descBn: 'ওয়েব ডেভেলপমেন্ট এজেন্সি ও আইটি ফার্মের জন্য',
      descEn: 'Ideal for digital agencies managing client sites',
      features: ['৫০টি cPanel একাউন্ট তৈরি সুবিধা', '120 GB NVMe SSD', 'WHM এডমিন এক্সেস', 'কাস্টম প্যাকেজ তৈরীর ক্ষমতা', 'হোয়াইট লেবেল নেইমসার্ভার', '২৪/৭ রিসেলার প্রায়োরিটি সাপোর্ট'],
      badge: 'জনপ্রিয়'
    },
    {
      id: 12,
      accounts: 100,
      name: 'Reseller 100 Accounts',
      monthlyPrice: 3999,
      yearlyPrice: 39990,
      descBn: 'লার্জ হোস্টিং প্রোভাইডার ও এজেন্সির জন্য',
      descEn: 'High capacity infrastructure for large client bases',
      features: ['১০০টি cPanel একাউন্ট তৈরি সুবিধা', '250 GB Pure NVMe SSD', 'মাস্টার WHM কন্ট্রোল', 'ডেডিকেটেড আইপি সুবিধা', 'দৈনিক অফসাইট ব্যাকআপ', 'ভিআইপি ডিরেক্ট ইঞ্জিনিয়ার সাপোর্ট'],
    }
  ];

  const handleOrderPlan = (plan: any, cat: string) => {
    const isYearly = billingCycle === 'yearly';
    const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

    addToCart({
      type: cat as any,
      name: plan.name,
      billingCycle,
      price,
      currency: 'BDT',
      productId: plan.id,
      details: {
        storage: plan.gb ? `${plan.gb} GB NVMe` : `${plan.accounts} Accounts`,
      }
    });

    setIsCartOpen(true);
  };

  return (
    <section id="hosting-section" className="py-16 sm:py-24 bg-[#05152f] border-t border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header from repo */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            {language === 'bn' ? 'সুপারফাস্ট NVMe SSD ও অফিশিয়াল cPanel' : 'SUPERFAST NVMe SSD & OFFICIAL CPANEL'}
          </span>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {language === 'bn' ? (
              <>
                আপনার প্রয়োজনের সাথে মেলে এমন{' '}
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                  হোস্টিং প্ল্যান
                </span>
              </>
            ) : (
              <>
                Hosting Plans That{' '}
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                  Match Your Exact Needs
                </span>
              </>
            )}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {language === 'bn'
              ? 'ছোট থেকে শুরু করুন, আত্মবিশ্বাসের সাথে স্কেল করুন এবং আপনার ব্যবসা বাড়ার সাথে রিসেলার বা কাস্টম হোস্টিংয়ে উন্নীত হন।'
              : 'Start small, scale confidently, and upgrade to reseller or custom hosting as your requirements grow.'}
          </p>

          {/* Hosting Category Selector Tabs matching repo */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setActiveCategory('shared')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
                activeCategory === 'shared'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-850'
              }`}
            >
              <span>🗄️</span>
              <span>{language === 'bn' ? 'শেয়ার্ড হোস্টিং' : 'Shared Hosting'}</span>
            </button>

            <button
              onClick={() => setActiveCategory('business')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
                activeCategory === 'business'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-850'
              }`}
            >
              <span>🏢</span>
              <span>{language === 'bn' ? 'বিজনেস হোস্টিং' : 'Business Hosting'}</span>
            </button>

            <button
              onClick={() => setActiveCategory('reseller')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
                activeCategory === 'reseller'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-850'
              }`}
            >
              <span>👥</span>
              <span>{language === 'bn' ? 'রিসেলার হোস্টিং' : 'Reseller Hosting'}</span>
            </button>

            <button
              onClick={() => setActiveTab('custom_hosting')}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/30"
            >
              <span>⚙️</span>
              <span>{language === 'bn' ? 'কাস্টম হোস্টিং বিল্ডার' : 'Custom Hosting Builder'}</span>
            </button>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-xs ${billingCycle === 'monthly' ? 'text-white font-bold' : 'text-slate-400'}`}>
              {language === 'bn' ? 'মাসিক বিলিং' : 'Monthly Billing'}
            </span>
            <button
              type="button"
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-12 h-6 rounded-full bg-blue-600 p-0.5 transition-colors relative cursor-pointer"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs ${billingCycle === 'yearly' ? 'text-white font-bold' : 'text-slate-400'}`}>
                {language === 'bn' ? 'বার্ষিক বিলিং' : 'Yearly Billing'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                {language === 'bn' ? '২ মাস ফ্রি!' : '2 Months Free!'}
              </span>
            </div>
          </div>
        </div>

        {/* Content depending on selected category */}
        <div className="mt-12">
          {activeCategory === 'shared' && (
            <div className="space-y-8">
              {/* Storage Filter Pills matching repo */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {sharedPlans.map((p) => (
                  <button
                    key={p.gb}
                    onClick={() => setSelectedStorageGb(p.gb)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                      selectedStorageGb === p.gb
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/30'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p.gb}GB NVMe
                  </button>
                ))}
                <button
                  onClick={() => setActiveTab('custom_hosting')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition border bg-slate-900 border-slate-700 text-cyan-400 hover:border-cyan-400"
                >
                  Custom GB →
                </button>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sharedPlans.map((plan) => {
                  const isSelectedPill = selectedStorageGb === plan.gb;
                  const isYearly = billingCycle === 'yearly';
                  const displayPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

                  return (
                    <div
                      key={plan.id}
                      className={`p-6 sm:p-8 rounded-3xl transition duration-300 flex flex-col justify-between space-y-6 relative ${
                        isSelectedPill
                          ? 'bg-gradient-to-b from-[#082046] to-[#041228] border-2 border-blue-500 shadow-2xl shadow-blue-900/40 scale-[1.02]'
                          : 'bg-slate-900/80 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {plan.badge && (
                        <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-lg">
                          {plan.badge}
                        </div>
                      )}

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                          <p className="text-xs text-slate-300 mt-1">
                            {language === 'bn' ? plan.descBn : plan.descEn}
                          </p>
                        </div>

                        {/* Price Line */}
                        <div className="pt-2 border-t border-slate-800/80">
                          <div className="text-3xl font-black text-white">
                            {formatPrice(displayPrice)}
                            <span className="text-xs font-normal text-slate-400 ml-1">
                              /{isYearly ? (language === 'bn' ? 'বছর' : 'year') : (language === 'bn' ? 'মাস' : 'month')}
                            </span>
                          </div>
                          {isYearly && (
                            <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                              {language === 'bn' ? 'মাসিক মাত্র ' : 'Equivalent to '}
                              {formatPrice(Math.round(plan.yearlyPrice / 12))}
                              /{language === 'bn' ? 'মাস' : 'mo'}
                            </div>
                          )}
                        </div>

                        {/* Features List */}
                        <ul className="space-y-2 text-xs text-slate-200 pt-2 border-t border-slate-800/60">
                          {plan.features.map((feat, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => handleOrderPlan(plan, 'hosting')}
                        className={`w-full py-3 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
                          isSelectedPill
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/30'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white'
                        }`}
                      >
                        <span>{language === 'bn' ? 'অর্ডারের জন্য নির্বাচন করুন →' : 'Choose Plan →'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Custom Callout Box matching repo */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#071d42] via-slate-900 to-[#071d42] border border-blue-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="space-y-1">
                  <div className="text-xs text-cyan-400 font-bold uppercase tracking-wider">
                    {language === 'bn' ? 'ভিন্ন সাইজ বা স্পেশাল কনফিগারেশন দরকার?' : 'Need a Different Storage Size?'}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {language === 'bn' ? 'কাস্টম হোস্টিং কোটেশনের অনুরোধ পাঠান' : 'Request a Custom Hosting Quote'}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {language === 'bn'
                      ? '১২০জিবি, ২০০জিবি, ৫০০জিবি, ২টিবি কিংবা বিশেষ কোনো রিকোয়ারমেন্ট — আমাদের জানান, আমরা কাস্টম প্যাকেজ বানিয়ে দেব।'
                      : '120GB, 200GB, 2TB or custom configuration — tell us what you need.'}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('custom_hosting')}
                  className="px-5 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-cyan-600/30"
                >
                  <Sliders className="w-4 h-4" />
                  <span>{language === 'bn' ? 'কাস্টম হোস্টিং তৈরি করুন →' : 'Build Custom Hosting →'}</span>
                </button>
              </div>
            </div>
          )}

          {activeCategory === 'business' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {businessPlans.map((plan) => {
                const isYearly = billingCycle === 'yearly';
                const displayPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

                return (
                  <div
                    key={plan.id}
                    className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 transition duration-300 flex flex-col justify-between space-y-6 shadow-xl relative"
                  >
                    {plan.badge && (
                      <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-black uppercase tracking-wider">
                        {plan.badge}
                      </div>
                    )}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                        <p className="text-xs text-slate-300 mt-1">
                          {language === 'bn' ? plan.descBn : plan.descEn}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800">
                        <div className="text-3xl font-black text-white">
                          {formatPrice(displayPrice)}
                          <span className="text-xs font-normal text-slate-400 ml-1">
                            /{isYearly ? (language === 'bn' ? 'বছর' : 'year') : (language === 'bn' ? 'মাস' : 'month')}
                          </span>
                        </div>
                      </div>

                      <ul className="space-y-2 text-xs text-slate-200 pt-2 border-t border-slate-800/60">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => handleOrderPlan(plan, 'business_hosting')}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg"
                    >
                      <span>{language === 'bn' ? 'বিজনেস প্ল্যান অর্ডার করুন →' : 'Order Business Plan →'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {activeCategory === 'reseller' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/40 text-xs text-purple-200 flex items-center gap-3">
                <span className="text-lg">💡</span>
                <span>
                  {language === 'bn'
                    ? 'সাধারণ হোস্টিং অ্যাকাউন্ট একটিমাত্র ওয়েবসাইটের জন্য। একাধিক ওয়েবসাইট বা ক্লায়েন্ট সাইট পরিচালনার জন্য রিসেলার হোস্টিং (WHM + cPanel) সেরা পছন্দ।'
                    : 'Regular hosting is designed for one website per account. For multiple client websites, choose Reseller Hosting with dedicated WHM.'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {resellerPlans.map((plan) => {
                  const isYearly = billingCycle === 'yearly';
                  const displayPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

                  return (
                    <div
                      key={plan.id}
                      className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 transition duration-300 flex flex-col justify-between space-y-6 shadow-xl relative"
                    >
                      {plan.badge && (
                        <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-black uppercase tracking-wider">
                          {plan.badge}
                        </div>
                      )}
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                          <p className="text-xs text-slate-300 mt-1">
                            {language === 'bn' ? plan.descBn : plan.descEn}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-800">
                          <div className="text-3xl font-black text-white">
                            {formatPrice(displayPrice)}
                            <span className="text-xs font-normal text-slate-400 ml-1">
                              /{isYearly ? (language === 'bn' ? 'বছর' : 'year') : (language === 'bn' ? 'মাস' : 'month')}
                            </span>
                          </div>
                        </div>

                        <ul className="space-y-2 text-xs text-slate-200 pt-2 border-t border-slate-800/60">
                          {plan.features.map((feat, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => handleOrderPlan(plan, 'reseller')}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg"
                      >
                        <span>{language === 'bn' ? 'রিসেলার শুরু করুন →' : 'Order Reseller Plan →'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
