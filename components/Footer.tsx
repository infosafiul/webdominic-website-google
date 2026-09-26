'use client';

import React from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/context';
import { Server, Phone, Mail, MapPin, ShieldCheck, Heart, Headphones } from 'lucide-react';

export default function Footer() {
  const { language, siteSettings, setActiveTab, switchUser } = useApp();

  return (
    <footer className="bg-[#030d1d] border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative h-8 w-44">
              <Image
                src="/images/logo-white.png"
                alt="WebDataHosts"
                fill
                className="object-contain object-left"
                referrerPolicy="no-referrer"
              />
            </div>

            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              {language === 'bn'
                ? '২০০৪ সাল থেকে নির্ভরযোগ্য হোস্টিং ও ডিজিটাল সমাধান, ব্যবসার দীর্ঘমেয়াদী সাফল্যের জন্য। উচ্চগতির NVMe SSD, ফ্রি SSL এবং দেশীয় বিকাশ পেমেন্ট সুবিধা।'
                : 'Reliable domains, hosting, servers, business email and digital solutions since 2004. High-performance NVMe storage with 24/7 support.'}
            </p>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>+1 (213) 986-7750 / +88-01841440202</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>support@webdominic.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Dhaka, Bangladesh & Los Angeles, USA</span>
              </div>
            </div>
          </div>

          {/* Column 1: Services from footer.php */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {language === 'bn' ? 'সেবাসমূহ' : 'Services'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab('domains')} className="hover:text-white transition cursor-pointer">
                  {language === 'bn' ? 'ডোমেইন রেজিস্ট্রেশন' : 'Domain Registration'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('hosting')} className="hover:text-white transition cursor-pointer">
                  {language === 'bn' ? 'ওয়েব হোস্টিং' : 'Web Hosting'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('vps')} className="hover:text-white transition cursor-pointer">
                  {language === 'bn' ? 'সার্ভার ও ক্লাউড VPS' : 'Cloud VPS Servers'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('business_email')} className="hover:text-white transition cursor-pointer">
                  {language === 'bn' ? 'বিজনেস ইমেইল' : 'Business Email'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('custom_hosting')} className="hover:text-white transition cursor-pointer">
                  {language === 'bn' ? 'কাস্টম হোস্টিং' : 'Custom Hosting'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('security')} className="hover:text-white transition cursor-pointer">
                  {language === 'bn' ? 'ওয়েবসাইট সিকিউরিটি' : 'Security & SSL'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Solutions from footer.php */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {language === 'bn' ? 'সমাধানসমূহ' : 'Solutions'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab('ai_solutions')} className="hover:text-white transition cursor-pointer text-purple-400">
                  {language === 'bn' ? 'এআই অটোমেশন ও বট' : 'AI Automation & Bots'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('reseller')} className="hover:text-white transition cursor-pointer">
                  {language === 'bn' ? 'রিসেলার সলিউশন' : 'Reseller Solutions'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('hosting')} className="hover:text-white transition cursor-pointer">
                  {language === 'bn' ? 'ই-কমার্স হোস্টিং' : 'E-Commerce Hosting'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('vps')} className="hover:text-white transition cursor-pointer">
                  {language === 'bn' ? 'ডেভেলপার সলিউশন' : 'Developer VPS'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('pricing')} className="hover:text-white transition cursor-pointer">
                  {language === 'bn' ? 'সকল মূল্য তালিকা' : 'Pricing Matrix'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {language === 'bn' ? 'কোম্পানি' : 'Company'}
            </h4>
            <ul className="space-y-2">
              <li>
                <span className="text-slate-400">
                  {language === 'bn' ? 'আমাদের সম্পর্কে (২০০৪ সাল থেকে)' : 'About Us (Since 2004)'}
                </span>
              </li>
              <li>
                <span className="text-slate-400">
                  {language === 'bn' ? 'ইউএসএ ডাটা সেন্টার' : 'USA Data Centers'}
                </span>
              </li>
              <li>
                <button onClick={() => setActiveTab('user_panel')} className="hover:text-white transition cursor-pointer">
                  {language === 'bn' ? 'ক্লায়েন্ট পোর্টাল' : 'Client Portal'}
                </button>
              </li>
              <li>
                <button onClick={() => switchUser('admin')} className="hover:text-amber-400 transition cursor-pointer text-amber-500/80">
                  {language === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin Panel'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Payment Methods */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {language === 'bn' ? 'পেমেন্ট মেথড' : 'Payment Methods'}
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E2136E]"></span>
                <span>বিকাশ (bKash) পেমেন্ট</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F7931E]"></span>
                <span>নগদ (Nagad) পেমেন্ট</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8C3494]"></span>
                <span>রকেট (Rocket) ডিবিবিএল</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>Visa / Mastercard / AMEX</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span>অ্যাকাউন্ট ওয়ালেট ব্যালেন্স</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Copyright & 24/7 Human Support */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-xs">
          <div>
            © 2004 – {new Date().getFullYear()} WebDominic / WDH. {language === 'bn' ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.'}
          </div>

          <div className="flex items-center gap-2 text-emerald-400">
            <Headphones className="w-4 h-4" />
            <span className="font-semibold">{language === 'bn' ? '২৪/৭ মানব সহায়তা' : '24/7 Human Support'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
