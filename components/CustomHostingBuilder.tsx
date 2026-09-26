'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context';
import {
  Sliders,
  HardDrive,
  Cpu,
  Mail,
  Globe,
  Shield,
  Zap,
  CheckCircle2,
  Send,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

export default function CustomHostingBuilder() {
  const { language, currency, formatPrice, submitCustomHostingRequest, setActiveTab, currentUser } = useApp();

  const [domainName, setDomainName] = useState('');
  const [storageGb, setStorageGb] = useState<number>(120);
  const [transferGb, setTransferGb] = useState<number>(3000);
  const [bandwidthMode, setBandwidthMode] = useState<'standard' | 'high' | 'fair'>('high');
  const [websites, setWebsites] = useState<number>(1);
  const [mailboxes, setMailboxes] = useState<number>(25);
  const [controlPanel, setControlPanel] = useState<'cPanel' | 'AAA Hosting'>('cPanel');
  const [managementType, setManagementType] = useState<'managed' | 'fully_managed' | 'unmanaged'>('managed');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [budgetAmount, setBudgetAmount] = useState<number>(4500);
  const [requirements, setRequirements] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Approximate price calculation based on selections
  const calculateEstimatedPrice = () => {
    let base = 500;
    base += storageGb * 25; // 25 BDT per GB
    if (bandwidthMode === 'high') base += 500;
    if (bandwidthMode === 'fair') base += 200;
    if (managementType === 'managed') base += 1000;
    if (managementType === 'fully_managed') base += 2500;
    if (controlPanel === 'cPanel') base += 800;
    base += mailboxes * 15;
    if (billingCycle === 'yearly') {
      base = base * 10; // 2 months free on yearly
    }
    return base;
  };

  const estimatedPrice = calculateEstimatedPrice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const id = await submitCustomHostingRequest({
        domainName: domainName.trim() || undefined,
        requestedStorageGb: storageGb,
        requestedTransferGb: transferGb,
        bandwidthMode,
        requestedWebsites: websites,
        requestedMailboxes: mailboxes,
        controlPanel,
        managementType,
        billingCycle,
        budgetAmount: budgetAmount || undefined,
        budgetCurrency: currency,
        requirements: requirements.trim() || 'Custom hosting package requested via web form.',
      });
      setSubmittedId(id);
    } catch {
      // Error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Sliders className="w-3.5 h-3.5" />
          {language === 'bn' ? 'কাস্টম হোস্টিং বিল্ডার' : 'Custom Hosting Builder'}
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          {language === 'bn' ? (
            <>
              আপনার ব্যবসার প্রয়োজন মতো তৈরি করুন{' '}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                কাস্টম হোস্টিং
              </span>
            </>
          ) : (
            <>
              Build a Hosting Package{' '}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                Around Your Exact Needs
              </span>
            </>
          )}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {language === 'bn'
            ? '১০০জিবি, ২০০জিবি, ৫০০জিবি, ১টিবি কিংবা স্পেশাল রিসোর্স কনফিগারেশন — আপনার চাহিদা অনুযায়ী আমরা ডেডিকেটেড কোটেশন প্রস্তুত করব।'
            : 'Need 120GB, 200GB, 300GB, 2TB or a specialized configuration? Tell us what you need and our technical team will prepare a custom proposal.'}
        </p>
      </div>

      {submittedId ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-emerald-500/40 text-center space-y-4 max-w-2xl mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {language === 'bn' ? 'কাস্টম রিকোয়েস্ট সফলভাবে জমা হয়েছে!' : 'Custom Request Submitted Successfully!'}
          </h2>
          <p className="text-sm text-slate-300">
            {language === 'bn'
              ? `আপনার রিকোয়েস্ট আইডি #${submittedId} রেকর্ড করা হয়েছে। আমাদের টেকনিক্যাল টিম আপনার প্রয়োজনীয়তা বিশ্লেষণ করে ২৪ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করবে।`
              : `Your request #${submittedId} has been received. Our infrastructure team will review your specifications and prepare a private quote.`}
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setActiveTab('user_panel')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
            >
              {language === 'bn' ? 'আমার ড্যাশবোর্ডে দেখুন' : 'View My Requests'}
            </button>
            <button
              onClick={() => { setSubmittedId(null); }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
            >
              {language === 'bn' ? 'আরেকটি কনফিগার করুন' : 'Configure Another'}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Builder Controls Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-xl">
            {/* Domain Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                {language === 'bn' ? 'ডোমেইন নাম (ঐচ্ছিক)' : 'Domain Name (Optional)'}
              </label>
              <input
                type="text"
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
                placeholder="e.g. yourcompany.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Storage Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4 text-blue-400" />
                  <span>{language === 'bn' ? 'স্টোরেজ প্রয়োজন (NVMe SSD)' : 'Required Storage (NVMe SSD)'}</span>
                </label>
                <span className="text-sm font-black text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                  {storageGb >= 1000 ? `${(storageGb / 1000).toFixed(1)} TB` : `${storageGb} GB`}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="2000"
                step="10"
                value={storageGb}
                onChange={(e) => setStorageGb(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>10 GB</span>
                <span>120 GB</span>
                <span>300 GB</span>
                <span>1 TB</span>
                <span>2 TB</span>
              </div>
            </div>

            {/* Bandwidth Mode */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>{language === 'bn' ? 'ব্যান্ডউইথ অগ্রাধিকার' : 'Bandwidth Preference'}</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'standard', labelBn: 'স্ট্যান্ডার্ড', labelEn: 'Standard', desc: 'নরমাল ট্রাফিকের জন্য' },
                  { id: 'high', labelBn: 'হাই ব্যান্ডউইথ', labelEn: 'High Bandwidth', desc: 'ই-কমার্স ও মিডিয়া সাইট' },
                  { id: 'fair', labelBn: 'ফেয়ার-ইউজ পলিসি', labelEn: 'Fair Use Policy', desc: 'আনমিটারড ফ্রেন্ডলি' },
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBandwidthMode(b.id as any)}
                    className={`p-3 rounded-2xl border text-left transition ${
                      bandwidthMode === b.id
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{language === 'bn' ? b.labelBn : b.labelEn}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{b.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Websites & Mailboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{language === 'bn' ? 'ওয়েবসাইটের সংখ্যা' : 'Number of Websites'}</span>
                </label>
                <select
                  value={websites}
                  onChange={(e) => setWebsites(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value={1}>১টি ওয়েবসাইট (ডেডিকেটেড cPanel একাউন্ট)</option>
                  <option value={5}>৫টি ওয়েবসাইট (রিসেলার আর্কিটেকচার)</option>
                  <option value={15}>১৫টি ওয়েবসাইট (রিসেলার / WHM)</option>
                  <option value={50}>৫০+ ওয়েবসাইট (ক্লাউড রিসেলার)</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  * একাধিক ওয়েবসাইটের জন্য আলাদা cPanel ও WHM একাউন্ট প্রদান করা হয়।
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{language === 'bn' ? 'বিজনেস ইমেইল একাউন্ট' : 'Email Accounts'}</span>
                </label>
                <select
                  value={mailboxes}
                  onChange={(e) => setMailboxes(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value={5}>৫টি বিজনেস ইমেইল</option>
                  <option value={10}>১০টি বিজনেস ইমেইল</option>
                  <option value={25}>২৫টি বিজনেস ইমেইল</option>
                  <option value={50}>৫০টি বিজনেস ইমেইল</option>
                  <option value={100}>১০০+ কর্পোরেট মেইলবক্স</option>
                </select>
              </div>
            </div>

            {/* Control Panel & Management Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  {language === 'bn' ? 'কন্ট্রোল প্যানেল' : 'Control Panel'}
                </label>
                <div className="flex gap-2">
                  {['cPanel', 'AAA Hosting'].map((cp) => (
                    <button
                      key={cp}
                      type="button"
                      onClick={() => setControlPanel(cp as any)}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                        controlPanel === cp
                          ? 'bg-blue-600/20 border-blue-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {cp}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  {language === 'bn' ? 'ম্যানেজমেন্ট টাইপ' : 'Management Type'}
                </label>
                <select
                  value={managementType}
                  onChange={(e) => setManagementType(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="managed">ম্যানেজড (সার্ভার মেইনটেন্যান্স সহ)</option>
                  <option value="fully_managed">ফুলি ম্যানেজড (২৪/৭ ডেডিকেটেড ইঞ্জিনিয়ার)</option>
                  <option value="unmanaged">আনম্যানেজড (রুট এক্সেস ও সেলফ ম্যানেজ)</option>
                </select>
              </div>
            </div>

            {/* Billing Cycle & Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  {language === 'bn' ? 'বিলিং সাইকেল' : 'Billing Cycle'}
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                      billingCycle === 'monthly'
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {language === 'bn' ? 'মাসিক বিলিং' : 'Monthly'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('yearly')}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                      billingCycle === 'yearly'
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {language === 'bn' ? 'বার্ষিক (২ মাস ফ্রি)' : 'Yearly (2 Mo Free)'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  {language === 'bn' ? `পছন্দের বাজেট (${currency})` : `Preferred Budget (${currency})`}
                </label>
                <input
                  type="number"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(Number(e.target.value))}
                  placeholder="e.g. 5000"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Requirements Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                {language === 'bn' ? 'অন্যান্য রিকোয়ারমেন্ট বা বিশেষ চাহিদা' : 'Additional Requirements'}
              </label>
              <textarea
                rows={3}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="আপনার সাইটের সম্ভাব্য ট্রাফিক, ব্যাকআপ রিকোয়ারমেন্ট, ডাটা সেন্টার পছন্দ (যেমন: USA/Singapore) ইত্যাদি বিস্তারিত লিখুন..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? (language === 'bn' ? 'জমা দেওয়া হচ্ছে...' : 'Submitting...')
                  : (language === 'bn' ? 'কাস্টম কোটেশনের জন্য সাবমিট করুন →' : 'Request Custom Quote →')}
              </span>
            </button>
          </form>

          {/* Real-Time Price Summary & Highlights Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                <span>{language === 'bn' ? 'কনফিগারেশন সারাংশ' : 'Configuration Summary'}</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">{language === 'bn' ? 'স্টোরেজ' : 'Storage'}:</span>
                  <span className="font-bold text-white">{storageGb} GB NVMe SSD</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">{language === 'bn' ? 'ব্যান্ডউইথ মোড' : 'Bandwidth'}:</span>
                  <span className="font-bold text-emerald-400 uppercase">{bandwidthMode}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">{language === 'bn' ? 'ওয়েবসাইট সংখ্যা' : 'Websites'}:</span>
                  <span className="font-bold text-white">{websites}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">{language === 'bn' ? 'ইমেইল একাউন্ট' : 'Email'}:</span>
                  <span className="font-bold text-white">{mailboxes} Accounts</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">{language === 'bn' ? 'প্যানেল' : 'Panel'}:</span>
                  <span className="font-bold text-indigo-400">{controlPanel}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">{language === 'bn' ? 'ম্যানেজমেন্ট' : 'Management'}:</span>
                  <span className="font-bold text-amber-400 capitalize">{managementType.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <div className="text-[11px] text-slate-400">
                  {language === 'bn' ? 'আনুমানিক প্রাক্কলন' : 'Estimated Price'} ({billingCycle}):
                </div>
                <div className="text-2xl font-black text-white mt-1">
                  {formatPrice(estimatedPrice)}
                  <span className="text-xs text-slate-400 font-normal">
                    /{billingCycle === 'monthly' ? (language === 'bn' ? 'মাস' : 'mo') : (language === 'bn' ? 'বছর' : 'yr')}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  * চূড়ান্ত মূল্য অবকাঠামোগত প্রয়োজনীয়তা ও কাস্টম অপ্টিমাইজেশনের উপর নির্ভর করে অনুমোদিত হবে।
                </p>
              </div>
            </div>

            {/* Why WDH Custom */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {language === 'bn' ? 'কাস্টম প্যাকেজের বিশেষ সুবিধাসমূহ' : 'Custom Package Highlights'}
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{language === 'bn' ? 'ডেডিকেটেড রিসোর্স গ্যারান্টি (No Overselling)' : 'Dedicated resource guarantee'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{language === 'bn' ? 'ফ্রি সাইট ও cPanel মাইগ্রেশন সাপোর্ট' : 'Free site & cPanel migration support'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{language === 'bn' ? 'স্বয়ংক্রিয় ক্লাউড ব্যাকআপ ও ডিডস সুরক্ষা' : 'Automatic cloud backup & DDoS protection'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{language === 'bn' ? 'বিকাশ ও নগদে মাসিক বা বার্ষিক বিলিং' : 'bKash / Nagad convenient local billing'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
