'use client';

import React from 'react';
import { useApp } from '@/lib/context';
import {
  Bot,
  Sparkles,
  Workflow,
  Cpu,
  Mail,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Zap,
  Layers,
  Terminal,
  Server
} from 'lucide-react';

export default function AiSolutionsSection() {
  const { language, setActiveTab, addToCart, setIsCartOpen, formatPrice } = useApp();

  const handleConsultAi = (solutionName: string) => {
    addToCart({
      type: 'service',
      name: solutionName,
      billingCycle: 'monthly',
      price: 4999,
      currency: 'BDT',
      details: {
        storage: 'Managed AI Cloud Stack'
      }
    });
    setIsCartOpen(true);
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>{language === 'bn' ? 'আধুনিক এআই ও অটোমেশন সলিউশন' : 'Modern AI & Workflow Automation Solutions'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {language === 'bn' ? (
              <>
                বুদ্ধিমান এআই এবং{' '}
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                  অটোমেশন ইনফ্রাস্ট্রাকচার
                </span>
              </>
            ) : (
              <>
                Build Smarter. Automate More with{' '}
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                  AI-Powered Cloud Infrastructure
                </span>
              </>
            )}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {language === 'bn'
              ? 'ওয়েবসাইট ইন্টেলিজেন্স, কাস্টমার সার্ভিস চ্যাটবট, n8n ওয়ার্কফ্লো অটোমেশন এবং ডেডিকেটেড এআই হোস্টিং — আধুনিক ব্যবসার জন্য সবকিছু এক ছাদের নিচে।'
              : 'AI web applications, 24/7 intelligent customer chatbots, self-hosted n8n workflows, and high-performance AI cloud hosting.'}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: AI Chatbots & Customer Service */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-purple-900/30 hover:border-purple-500/40 transition duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">
              {language === 'bn' ? 'এআই চ্যাটবট ও কাস্টমার অ্যাসিস্ট্যান্ট' : 'AI Chatbots & Intelligent Agents'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'bn'
                ? 'আপনার ওয়েবসাইটের পণ্য ও সেবার তথ্য শিখে ২৪/৭ কাস্টমারদের প্রশ্নের তাৎক্ষণিক জবাব প্রদানকারী কাস্টম এআই বট।'
                : 'Custom-trained conversational chatbots answering customer queries 24/7 with zero latency.'}
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
                <span>{language === 'bn' ? 'বাংলা ও ইংরেজি উভয় ভাষায় সাবলীল' : 'Bilingual Bangla & English'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
                <span>{language === 'bn' ? 'ফেসবুক পেজ ও ওয়েবসাইটে ইন্টিগ্রেশন' : 'Website & Facebook Messenger sync'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
                <span>{language === 'bn' ? 'অর্ডার গ্রহণ ও টিকিট স্বয়ংক্রিয় হ্যান্ডলিং' : 'Auto order intake & ticket routing'}</span>
              </li>
            </ul>
            <div className="pt-2">
              <button
                onClick={() => handleConsultAi('Custom AI Chatbot Setup')}
                className="w-full py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-semibold text-xs transition flex items-center justify-center gap-1.5"
              >
                <span>{language === 'bn' ? 'চ্যাটবট সেবা শুরু করুন' : 'Deploy AI Chatbot'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: n8n Workflow Automation */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-indigo-900/30 hover:border-indigo-500/40 transition duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition">
              <Workflow className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">
              {language === 'bn' ? 'সেলফ-হোস্টেড n8n অটোমেশন' : 'Self-Hosted n8n Workflow Automation'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'bn'
                ? 'জ্যাপিয়ার বা মেক-এর বিকল্প হিসেবে আনলিমিটেড ডেটাবেস, সিআরএম, ইনভয়েস ও ইমেইল ওয়ার্কফ্লো অটোমেশন রান করুন।'
                : 'Run unlimited automated workflows across databases, CRM, billing, and SMS/WhatsApp with private dedicated n8n.'}
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
                <span>{language === 'bn' ? 'আনলিমিটেড এক্সিকিউশন ও নো-কোড ওয়ার্কফ্লো' : 'Unlimited executions, zero per-task charges'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
                <span>{language === 'bn' ? 'বিকাশ ও নগদ পেমেন্ট গেটওয়ে নোটিফিকেশন' : 'Automated bKash & SMS triggers'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
                <span>{language === 'bn' ? 'সম্পূর্ণ নিজস্ব ডেটা নিরাপত্তা ও প্রাইভেসি' : '100% private cloud data ownership'}</span>
              </li>
            </ul>
            <div className="pt-2">
              <button
                onClick={() => handleConsultAi('Self-Hosted n8n Automation Instance')}
                className="w-full py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-semibold text-xs transition flex items-center justify-center gap-1.5"
              >
                <span>{language === 'bn' ? 'n8n ইনস্ট্যান্স শুরু করুন' : 'Launch n8n Cloud'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: AI Web Apps & Dedicated Hosting */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-cyan-900/30 hover:border-cyan-500/40 transition duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center group-hover:scale-110 transition">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">
              {language === 'bn' ? 'এআই ক্লাউড ও জেনারেটিভ অ্যাপ হোস্টিং' : 'AI Web Applications & GPU Hosting'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'bn'
                ? 'পাইথন, ফ্লাস্ক, নেক্সট-জেএস কিংবা ল্যাংচেইন অ্যাপ্লিকেশনের জন্য অপ্টিমাইজড ক্লাউড স্ট্যাক ও হাই-মেমরি সার্ভার।'
                : 'Optimized high-memory Linux environments tailored for Python, FastAPI, Next.js, and GenAI models.'}
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>{language === 'bn' ? 'ডকার ও কুবারনেটস রেডি ইনফ্রাস্ট্রাকচার' : 'Docker & containerized deployment'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>{language === 'bn' ? 'ইউএসএ ডাটা সেন্টার ও আল্ট্রা-লো লেটেন্সি' : 'USA Tier-3 Data Center network'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>{language === 'bn' ? '২৪/৭ ক্লাউড সিস্টেম অ্যাডমিন সাপোর্ট' : '24/7 dedicated DevOps engineer support'}</span>
              </li>
            </ul>
            <div className="pt-2">
              <button
                onClick={() => handleConsultAi('AI Cloud Server Hosting')}
                className="w-full py-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 font-semibold text-xs transition flex items-center justify-center gap-1.5"
              >
                <span>{language === 'bn' ? 'এআই হোস্টিং অর্ডার করুন' : 'Order AI Server'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Business Email & Security Quick Bar */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 items-center shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center flex-shrink-0 border border-blue-500/30">
              <Mail className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">
                {language === 'bn' ? 'কর্পোরেট বিজনেস ইমেইল সমাধান' : 'Corporate Business Email Solutions'}
              </h4>
              <p className="text-xs text-slate-400">
                {language === 'bn'
                  ? 'আপনার ডোমেইনে (@yourbrand.com) প্রফেশনাল ইমেইল, ওয়েবমেইল, অ্যান্টি-স্প্যাম সুরক্ষা এবং গুগল ওয়ার্কস্পেস সেটআপ।'
                  : 'Professional email on your domain, IMAP/POP3, webmail, Google Workspace & Microsoft 365 migration.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">
                {language === 'bn' ? 'এন্টারপ্রাইজ সিকিউরিটি ও ফ্রি SSL' : 'Enterprise Security & Free SSL'}
              </h4>
              <p className="text-xs text-slate-400">
                {language === 'bn'
                  ? 'স্বয়ংক্রিয় Let\'s Encrypt SSL, রিয়েলটাইম ম্যালওয়্যার স্ক্যানিং ও শক্তিশালী ক্লাউডফ্লেয়ার ডিডস সুরক্ষা।'
                  : 'Free Let\'s Encrypt SSL, daily malware removal, proactive web firewall & automated offsite backups.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
