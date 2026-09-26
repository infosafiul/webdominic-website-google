'use client';

import React from 'react';
import { useApp } from '@/lib/context';
import {
  Shield,
  Zap,
  Lock,
  Headphones,
  Server,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  PhoneCall,
  Sparkles,
  Award
} from 'lucide-react';

export default function WhyChooseUsAndStats() {
  const { language, setActiveTab, siteSettings } = useApp();

  const features = [
    {
      icon: Server,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      titleBn: 'USA-ভিত্তিক ইনফ্রাস্ট্রাকচার',
      titleEn: 'USA-Based Infrastructure',
      descBn: 'যুক্তরাষ্ট্রের টপ-টিয়ার ডাটা সেন্টারের সেরা নেটওয়ার্ক কানেক্টিভিটি ও আল্ট্রা-লো লেটেন্সি।',
      descEn: 'Top-tier USA data center facilities delivering enterprise network connectivity and speed.'
    },
    {
      icon: Zap,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      titleBn: 'উচ্চ পারফরম্যান্স NVMe নেটওয়ার্ক',
      titleEn: 'High Performance NVMe Storage',
      descBn: 'সাধারণ এসএসডি থেকে ৫ গুণ দ্রুতগতির পিউর NVMe ড্রাইভ ও লাইটস্পিড ক্যাশিং সুবিধা।',
      descEn: 'Pure NVMe arrays and LiteSpeed enterprise servers ensure lightning-fast page load times.'
    },
    {
      icon: Shield,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      titleBn: 'এন্টারপ্রাইজ-গ্রেড নিরাপত্তা',
      titleEn: 'Enterprise-Grade Security',
      descBn: 'অ্যাডভান্সড ওয়েব অ্যাপ্লিকেশন ফায়ারওয়াল, DDoS সুরক্ষা এবং দৈনিক অটোমেটিক ম্যালওয়্যার স্ক্যান।',
      descEn: 'Proactive web application firewall, real-time DDoS mitigation, and daily automated scanning.'
    },
    {
      icon: Lock,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      titleBn: 'নিয়মিত ব্যাকআপ ও ডাটা সুরক্ষা',
      titleEn: 'Regular Cloud Backups',
      descBn: 'স্বয়ংক্রিয় অফসাইট ক্লাউড ব্যাকআপ। যেকোনো অনাকাঙ্ক্ষিত পরিস্থিতিতে এক ক্লিকে সাইট রিস্টোর।',
      descEn: 'Automated offsite snapshots with instant point-in-time restore for disaster recovery.'
    },
    {
      icon: Headphones,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      titleBn: '২৪/৭/৩৬৫ বিশেষজ্ঞ টেকনিক্যাল সাপোর্ট',
      titleEn: '24/7 Expert Technical Support',
      descBn: 'কোনো রোবট নয়, অভিজ্ঞ সিনিয়র সিস্টেম ইঞ্জিনিয়ার সরাসরি আপনার সমস্যা সমাধানে প্রস্তুত।',
      descEn: 'Real human system engineers available around the clock via live chat, phone, and ticketing.'
    }
  ];

  const stats = [
    { number: '২০+', numberEn: '20+', labelBn: 'বছরের অভিজ্ঞতা (২০০৪ সাল থেকে)', labelEn: 'Years Experience (Since 2004)' },
    { number: '১০,০০০+', numberEn: '10,000+', labelBn: 'সন্তুষ্ট গ্রাহক সারা বিশ্বে', labelEn: 'Satisfied Global Clients' },
    { number: '৬০,০০০+', numberEn: '60,000+', labelBn: 'ওয়েবসাইট হোস্টেড ও সুরক্ষিত', labelEn: 'Active Hosted Websites' },
    { number: '৯৯.৯%', numberEn: '99.9%', labelBn: 'আপটাইম গ্যারান্টি (SLA)', labelEn: 'Uptime SLA Guarantee' },
    { number: '২৪/৭/৩৬৫', numberEn: '24/7/365', labelBn: 'বিশেষজ্ঞ মানব সহায়তা', labelEn: 'Real Human Support' }
  ];

  return (
    <div>
      {/* 5 Pillars of WDH Section */}
      <section className="py-16 sm:py-24 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Award className="w-3.5 h-3.5" />
              {language === 'bn' ? 'কেন আমাদের বেছে নেবেন' : 'WHY CHOOSE WDH?'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {language === 'bn' ? (
                <>
                  বিশ্বাসযোগ্য অবকাঠামো।{' '}
                  <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                    আপনার ব্যবসার সাফল্যের জন্য।
                  </span>
                </>
              ) : (
                <>
                  Reliable Infrastructure Built for{' '}
                  <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                    Your Long-Term Success
                  </span>
                </>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {language === 'bn'
                ? '২০০৪ সাল থেকে বিশ্বস্ততার সাথে আমরা উদ্যোক্তা ও প্রাতিষ্ঠানিক ক্লায়েন্টদের উচ্চমানের হোস্টিং এবং ক্লাউড সমাধান দিয়ে আসছি।'
                : 'Since 2004, businesses across the globe have trusted WDH for rock-solid server performance and compassionate support.'}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const IconComp = f.icon;
              return (
                <div
                  key={i}
                  className={`p-6 sm:p-7 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition duration-300 space-y-3 ${
                    i === 4 ? 'md:col-span-2 lg:col-span-1' : ''
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${f.color}`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {language === 'bn' ? f.titleBn : f.titleEn}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {language === 'bn' ? f.descBn : f.descEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Live Statistics Counter Bar */}
      <section className="py-12 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-t border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
            {stats.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-blue-400 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
                  {language === 'bn' ? s.number : s.numberEn}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 font-medium">
                  {language === 'bn' ? s.labelBn : s.labelEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Consultation Call-to-Action */}
      <section className="py-16 sm:py-20 bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>{language === 'bn' ? 'বিনামূল্যে এক্সপার্ট কনসালটেশন' : 'Free Expert Consultation'}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight max-w-2xl mx-auto">
              {language === 'bn'
                ? 'সঠিক ডোমেইন বা হোস্টিং প্ল্যান বেছে নিতে সাহায্য দরকার?'
                : 'Need Help Choosing the Right Hosting or Domain?'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {language === 'bn'
                ? 'আমাদের টেকনিক্যাল এক্সপার্টরা আপনার ওয়েবসাইটের প্রয়োজনীয়তা অনুযায়ী সঠিক সমাধান বেছে দিতে বিনামূল্যে পরামর্শ দেবেন।'
                : 'Our infrastructure engineers are ready to evaluate your requirements and recommend the ideal hosting, VPS, or business email setup.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setActiveTab('custom_hosting')}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-500/25 transition flex items-center gap-2"
              >
                <span>{language === 'bn' ? 'কাস্টম প্যাকেজ তৈরি করুন →' : 'Build Custom Hosting →'}</span>
              </button>

              <a
                href={`tel:${siteSettings.supportPhone}`}
                className="px-6 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm transition flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>{language === 'bn' ? 'সরাসরি কল করুন: ' : 'Call Support: '}{siteSettings.supportPhone}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
