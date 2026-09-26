'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context';
import {
  Globe,
  Server,
  Receipt,
  LifeBuoy,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shield,
  RotateCw,
  ExternalLink,
  Lock,
  Unlock,
  CreditCard,
  PlusCircle,
  Copy,
  ChevronRight,
  Send,
  Download,
  Calendar,
  Layers,
  HardDrive,
  Wallet,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  XCircle,
  Check
} from 'lucide-react';
import { CustomerDomain, CustomerService, Invoice, SupportTicket } from '@/lib/types';

export default function UserDashboard() {
  const {
    currentUser,
    domains,
    services,
    invoices,
    tickets,
    walletTransactions,
    topUpWallet,
    payFromWallet,
    autoRenewServiceFromWallet,
    toggleAutoRenewFromWallet,
    updateNameservers,
    toggleDomainLock,
    toggleDomainAutoRenew,
    renewDomain,
    payInvoice,
    createSupportTicket,
    addTicketReply,
    siteSettings,
    setActiveTab
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'domains' | 'services' | 'invoices' | 'wallet' | 'tickets'>('domains');
  const [selectedDomainForNs, setSelectedDomainForNs] = useState<CustomerDomain | null>(null);
  const [nsInput1, setNsInput1] = useState('');
  const [nsInput2, setNsInput2] = useState('');
  const [activeInvoiceForPay, setActiveInvoiceForPay] = useState<Invoice | null>(null);
  const [invoiceTrxId, setInvoiceTrxId] = useState('');
  const [invoicePayMethod, setInvoicePayMethod] = useState('bkash');
  const [viewInvoiceModal, setViewInvoiceModal] = useState<Invoice | null>(null);

  // Top Up Modal State
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('2000');
  const [topUpMethod, setTopUpMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'bank'>('bkash');
  const [topUpTrxId, setTopUpTrxId] = useState('');
  const [topUpSenderNumber, setTopUpSenderNumber] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);

  // Quick Action feedback notice
  const [actionNotice, setActionNotice] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Renew modal for specific domain/service
  const [renewTarget, setRenewTarget] = useState<{ type: 'domain' | 'service'; item: CustomerDomain | CustomerService } | null>(null);

  // New ticket state
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<SupportTicket['category']>('Domain');
  const [ticketPriority, setTicketPriority] = useState<SupportTicket['priority']>('normal');
  const [ticketMsg, setTicketMsg] = useState('');

  // Selected ticket for chat
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');

  // Filter items for current user (or show all if admin viewing user portal)
  const userDomains = domains.filter(d => currentUser.role === 'admin' ? true : d.userId === currentUser.id);
  const userServices = services.filter(s => currentUser.role === 'admin' ? true : s.userId === currentUser.id);
  const userInvoices = invoices.filter(i => currentUser.role === 'admin' ? true : i.userId === currentUser.id);
  const userTickets = tickets.filter(t => currentUser.role === 'admin' ? true : t.userId === currentUser.id);
  const userWalletTransactions = walletTransactions.filter(t => currentUser.role === 'admin' ? true : t.userId === currentUser.id);

  // Expiry calculation helper
  const getDaysLeft = (expiryDateStr: string) => {
    const expiry = new Date(expiryDateStr);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Find any active recurring unpaid invoices for this user
  const recurringUnpaidInvoices = userInvoices.filter(i => i.status === 'unpaid' && (i.isRecurring || i.title.toLowerCase().includes('renewal') || i.title.includes('রিকারিং') || i.title.includes('রিনিউয়াল')));

  const handleOpenNsModal = (dom: CustomerDomain) => {
    setSelectedDomainForNs(dom);
    setNsInput1(dom.nameservers[0] || 'ns1.wdhdomain.com');
    setNsInput2(dom.nameservers[1] || 'ns2.wdhdomain.com');
  };

  const handleSaveNs = () => {
    if (!selectedDomainForNs) return;
    updateNameservers(selectedDomainForNs.id, [nsInput1, nsInput2]);
    setSelectedDomainForNs(null);
    setActionNotice({ message: 'নেমসার্ভার সফলভাবে আপডেট করা হয়েছে!', type: 'success' });
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handlePayInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInvoiceForPay) return;
    await payInvoice(activeInvoiceForPay.id, invoicePayMethod === 'bkash' ? 'bKash (বিকাশ)' : invoicePayMethod, invoiceTrxId);
    setActiveInvoiceForPay(null);
    setInvoiceTrxId('');
    setActionNotice({ message: 'ইনভয়েস পেমেন্ট সফল হয়েছে! ধন্যবাদ।', type: 'success' });
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Top Up Wallet Submit
  const handleTopUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(topUpAmount) || 0;
    if (amt <= 0) {
      alert('সঠিক টাকার পরিমাণ লিখুন');
      return;
    }
    if (!topUpTrxId.trim()) {
      alert('অনুগ্রহ করে বিকাশ/নগদ ট্রানজাকশন আইডি (TrxID) লিখুন');
      return;
    }

    const success = await topUpWallet(amt, topUpMethod, topUpTrxId.trim(), topUpSenderNumber.trim());
    if (success) {
      setShowTopUpModal(false);
      setTopUpTrxId('');
      setTopUpSenderNumber('');
      setActionNotice({ message: `অভিনন্দন! আপনার ওয়ালেটে ৳${amt.toLocaleString()} সফলভাবে টপ-আপ করা হয়েছে।`, type: 'success' });
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  // Instant pay recurring invoice from wallet
  const handlePayRecurringFromWallet = async (invId: string) => {
    const res = await payFromWallet(invId);
    setActionNotice({
      message: res.message,
      type: res.success ? 'success' : 'error'
    });
    setTimeout(() => setActionNotice(null), 4500);
  };

  // Direct auto-renew service from wallet button
  const handleDirectRenewFromWallet = async (type: 'domain' | 'service', itemId: string) => {
    const res = await autoRenewServiceFromWallet(type, itemId);
    setRenewTarget(null);
    setActionNotice({
      message: res.message,
      type: res.success ? 'success' : 'error'
    });
    setTimeout(() => setActionNotice(null), 4500);
  };

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSupportTicket({
      subject: ticketSubject,
      category: ticketCategory,
      priority: ticketPriority,
      message: ticketMsg,
    });
    setShowNewTicketModal(false);
    setTicketSubject('');
    setTicketMsg('');
    setActionNotice({ message: 'নতুন সাপোর্ট টিকেট সফলভাবে তৈরি করা হয়েছে!', type: 'success' });
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;
    addTicketReply(selectedTicket.id, replyText.trim(), 'customer');
    setReplyText('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-950 min-h-screen text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Welcome Header */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border border-blue-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold">
                কাস্টমার ড্যাশবোর্ড
              </span>
              <span className="text-xs text-slate-400 font-mono">Client ID: #{currentUser.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 flex items-center gap-2">
              <span>স্বাগতম, {currentUser.fullName}</span>
              {currentUser.id === 3 && (
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/30">
                  Mr. Abdur Rahim
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              আপনার রেজিস্টার্ড ডোমেইন, হোস্টিং সার্ভিস, ওয়ালেট ব্যালেন্স এবং রিকারিং বিল এখান থেকে পরিচালনা করুন।
            </p>
          </div>

          {/* Wallet Balance Display & Top-Up CTA */}
          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-emerald-500/30 text-right shadow-inner">
              <span className="text-[11px] text-slate-400 block font-medium">অ্যাকাউন্ট ওয়ালেট ব্যালেন্স</span>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                  ৳{currentUser.accountBalance.toLocaleString('bn-BD')}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowTopUpModal(true)}
              className="px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center gap-2 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>ব্যালেন্স টপ-আপ</span>
            </button>
          </div>
        </div>

        {/* Action Notice Alert */}
        {actionNotice && (
          <div className={`p-4 rounded-2xl border text-sm flex items-center justify-between gap-3 shadow-xl animate-fade-in ${
            actionNotice.type === 'success'
              ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
              : actionNotice.type === 'error'
              ? 'bg-rose-950/50 border-rose-500/50 text-rose-300'
              : 'bg-blue-950/50 border-blue-500/50 text-blue-300'
          }`}>
            <div className="flex items-center gap-2.5">
              {actionNotice.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
              <span className="font-semibold">{actionNotice.message}</span>
            </div>
            <button
              onClick={() => setActionNotice(null)}
              className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg text-white"
            >
              ঠিক আছে
            </button>
          </div>
        )}

        {/* Prominent Recurring Billing Banner (The exact flow requested by user!) */}
        {recurringUnpaidInvoices.length > 0 && (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/60 border border-amber-500/40 shadow-2xl space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0 mt-0.5">
                  <Receipt className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold uppercase tracking-wider border border-amber-500/30">
                      রিকারেন্ট বিল নোটিশ
                    </span>
                    <span className="text-xs text-slate-400">মেয়াদ শেষ হওয়ার ৩০ দিন পূর্বের ইনভয়েস</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white mt-1">
                    {recurringUnpaidInvoices[0].title}
                  </h3>
                  <p className="text-xs text-amber-200/90 mt-0.5">
                    পরিশোধের শেষ তারিখ: <span className="font-bold text-white">{recurringUnpaidInvoices[0].dueAt}</span> • মোট বিল: <span className="font-bold text-emerald-400 font-mono">৳{recurringUnpaidInvoices[0].total.toLocaleString('bn-BD')}</span>
                  </p>
                </div>
              </div>

              {/* Action buttons on recurring bill */}
              <div className="flex items-center gap-2 flex-wrap">
                {currentUser.accountBalance >= recurringUnpaidInvoices[0].total ? (
                  <button
                    onClick={() => handlePayRecurringFromWallet(recurringUnpaidInvoices[0].id)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>ওয়ালেট থেকে ১-ক্লিকে অ্যাডজাস্ট করুন</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setTopUpAmount((recurringUnpaidInvoices[0].total - currentUser.accountBalance).toString());
                      setShowTopUpModal(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>ঘাটতি ব্যালেন্স টপ-আপ করুন</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setActiveInvoiceForPay(recurringUnpaidInvoices[0]);
                  }}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
                >
                  বিকাশ/নগদে দিন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Expiring Soon Notice if any */}
        {userDomains.some(d => getDaysLeft(d.expiryDate) <= 30 && getDaysLeft(d.expiryDate) > 0) && (
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                <AlertTriangle className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">
                  জরুরী রিনিউয়াল সতর্কতা: আপনার ডোমেইনের মেয়াদ শীঘ্রই শেষ হচ্ছে!
                </h4>
                <p className="text-xs text-amber-300/90 mt-0.5">
                  মেয়াদ শেষ হওয়ার আগে রিনিউ করুন যাতে ওয়েবসাইট বন্ধ না হয়। অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স থাকলে অটো-অ্যাডজাস্ট হবে।
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveSubTab('domains')}
              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shrink-0"
            >
              ডোমেইন তালিকা দেখুন
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('domains')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeSubTab === 'domains'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>আমার ডোমেইনসমূহ ({userDomains.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('services')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeSubTab === 'services'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>হোস্টিং ও সার্ভিস ({userServices.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('wallet')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeSubTab === 'wallet'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>ওয়ালেট স্টেটমেন্ট ও হিস্ট্রি ({userWalletTransactions.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('invoices')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeSubTab === 'invoices'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>ইনভয়েস ও বিলিং ({userInvoices.length})</span>
            {userInvoices.some(i => i.status === 'unpaid') && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('tickets')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeSubTab === 'tickets'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <LifeBuoy className="w-4 h-4" />
            <span>সাপোর্ট টিকেট ({userTickets.length})</span>
          </button>
        </div>

        {/* Tab 1: My Domains */}
        {activeSubTab === 'domains' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">আমার সক্রিয় ডোমেইনসমূহ</h3>
                <p className="text-xs text-slate-400">প্রতিটি ডোমেইনের মেয়াদ শেষ হওয়ার তারিখ, বাৎসরিক রিকারিং রিনিউয়াল এবং ওয়ালেট অটো-অ্যাডজাস্ট পরিচালনা করুন</p>
              </div>

              <button
                onClick={() => setActiveTab('domains')}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>নতুন ডোমেইন খুঁজুন</span>
              </button>
            </div>

            {userDomains.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 text-slate-400">
                <Globe className="w-12 h-12 mx-auto text-slate-600 mb-3" />
                <h4 className="font-bold text-white text-base">কোনো ডোমেইন নেই</h4>
                <p className="text-xs text-slate-400 mt-1">আপনার কোনো ডোমেইন এখনো রেজিস্টার্ড করা হয়নি।</p>
                <button
                  onClick={() => setActiveTab('domains')}
                  className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                >
                  ডোমেইন সার্চ করুন
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {userDomains.map((dom) => {
                  const daysLeft = getDaysLeft(dom.expiryDate);
                  const isExpiringSoon = daysLeft <= 30 && daysLeft > 0;
                  const isExpired = daysLeft <= 0;
                  const hasWalletBalance = currentUser.accountBalance >= dom.renewalPrice;

                  return (
                    <div
                      key={dom.id}
                      className={`p-5 rounded-3xl border transition shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                        isExpiringSoon
                          ? 'bg-amber-950/20 border-amber-500/40'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Left: Domain Name & Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-mono text-lg font-black text-white tracking-wide">
                            {dom.domainName}
                          </span>

                          {/* Status Badge */}
                          {isExpired ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold">
                              মেয়াদোত্তীর্ণ (Expired)
                            </span>
                          ) : isExpiringSoon ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                              <span>{daysLeft} দিন বাকি আছে (জরুরি রিনিউয়াল)</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                              সক্রিয় (Active) • {daysLeft} দিন বাকি
                            </span>
                          )}

                          {/* Auto-renew from Wallet badge */}
                          {dom.autoRenewFromWallet && (
                            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-semibold flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-cyan-400" />
                              <span>ওয়ালেট অটো-অ্যাডজাস্ট সক্রিয়</span>
                            </span>
                          )}
                        </div>

                        {/* Dates & Pricing */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-slate-400">
                          <div>
                            রেজিস্ট্রেশন: <span className="text-slate-200 font-medium">{dom.registrationDate}</span>
                          </div>
                          <div>
                            মেয়াদ শেষ: <span className="text-amber-300 font-bold">{dom.expiryDate}</span>
                          </div>
                          <div>
                            বাৎসরিক নবায়ন ফি: <span className="text-emerald-400 font-mono font-bold">৳{dom.renewalPrice.toLocaleString('bn-BD')}</span>
                          </div>
                          <div>
                            রেজিস্ট্রার: <span className="text-slate-300">{dom.registrarName}</span>
                          </div>
                        </div>

                        {/* Nameservers preview */}
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                          <span>নেমসার্ভার:</span>
                          <span className="text-slate-300">{dom.nameservers.join(', ')}</span>
                          <button
                            onClick={() => handleOpenNsModal(dom)}
                            className="text-blue-400 hover:text-blue-300 underline font-sans ml-1 text-xs"
                          >
                            পরিবর্তন
                          </button>
                        </div>
                      </div>

                      {/* Right: Actions & Auto-Renew Switch */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                        {/* Auto-Deduct Toggle */}
                        <button
                          onClick={() => toggleAutoRenewFromWallet('domain', dom.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-medium transition border flex items-center gap-1.5 ${
                            dom.autoRenewFromWallet
                              ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                          title="মেয়াদ শেষ হওয়ার সময় ওয়ালেট ব্যালেন্স থেকে স্বয়ংক্রিয়ভাবে নবায়ন ফি কেটে নেওয়া হবে"
                        >
                          <Wallet className="w-3.5 h-3.5" />
                          <span>{dom.autoRenewFromWallet ? 'অটো-অ্যাডজাস্ট: চালু' : 'অটো-অ্যাডজাস্ট: বন্ধ'}</span>
                        </button>

                        {/* Renew Now CTA */}
                        {hasWalletBalance ? (
                          <button
                            onClick={() => handleDirectRenewFromWallet('domain', dom.id)}
                            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
                          >
                            <Wallet className="w-4 h-4" />
                            <span>ওয়ালেট থেকে ১-ক্লিকে রিনিউ</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => renewDomain(dom.id, 1)}
                            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-1.5"
                          >
                            <RotateCw className="w-4 h-4" />
                            <span>রিনিউ ইনভয়েস তৈরি</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: My Hosting Services */}
        {activeSubTab === 'services' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">আমার সক্রিয় হোস্টিং ও সার্ভার</h3>
                <p className="text-xs text-slate-400">আপনার cPanel হোস্টিং, বিজনেস ইমেইল এবং সার্ভার মেয়াদ পরিচালনা করুন</p>
              </div>

              <button
                onClick={() => setActiveTab('hosting')}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>নতুন হোস্টিং কিনুন</span>
              </button>
            </div>

            {userServices.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 text-slate-400">
                <HardDrive className="w-12 h-12 mx-auto text-slate-600 mb-3" />
                <h4 className="font-bold text-white text-base">কোনো হোস্টিং সক্রিয় নেই</h4>
                <p className="text-xs text-slate-400 mt-1">আপনার অ্যাকাউন্টে এখনো কোনো হোস্টিং সার্ভিস চালু হয়নি।</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {userServices.map((srv) => {
                  const daysLeft = getDaysLeft(srv.expiresAt);
                  const isExpiringSoon = daysLeft <= 30 && daysLeft > 0;
                  const hasWalletBalance = currentUser.accountBalance >= srv.renewalPrice;

                  return (
                    <div
                      key={srv.id}
                      className={`p-5 rounded-3xl border transition shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                        isExpiringSoon
                          ? 'bg-amber-950/20 border-amber-500/40'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-bold text-lg text-white">
                            {srv.serviceName}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
                            {srv.serviceType}
                          </span>
                          <span className="font-mono text-xs text-blue-400 font-semibold">
                            ({srv.domainName})
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-slate-400">
                          <div>
                            চালু হওয়ার তারিখ: <span className="text-slate-200">{srv.activatedAt}</span>
                          </div>
                          <div>
                            মেয়াদ শেষ: <span className="text-amber-300 font-bold">{srv.expiresAt}</span> ({daysLeft} দিন বাকি)
                          </div>
                          <div>
                            নবায়ন ফি: <span className="text-emerald-400 font-mono font-bold">৳{srv.renewalPrice.toLocaleString('bn-BD')}</span> ({srv.renewalCycle === 'yearly' ? 'বাৎসরিক' : 'মাসিক'})
                          </div>
                        </div>

                        {srv.cpanelUrl && (
                          <div className="text-[11px] text-slate-400 flex items-center gap-2">
                            <span>cPanel Login:</span>
                            <span className="text-slate-200 font-mono">{srv.username || 'user'}</span>
                            <a
                              href={srv.cpanelUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 underline"
                            >
                              <span>কন্ট্রোল প্যানেল ওপেন করুন</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* Auto-Deduct Toggle */}
                        <button
                          onClick={() => toggleAutoRenewFromWallet('service', srv.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-medium transition border flex items-center gap-1.5 ${
                            srv.autoRenewFromWallet
                              ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <Wallet className="w-3.5 h-3.5" />
                          <span>{srv.autoRenewFromWallet ? 'অটো-অ্যাডজাস্ট: চালু' : 'অটো-অ্যাডজাস্ট: বন্ধ'}</span>
                        </button>

                        {hasWalletBalance ? (
                          <button
                            onClick={() => handleDirectRenewFromWallet('service', srv.id)}
                            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-1.5"
                          >
                            <Wallet className="w-4 h-4" />
                            <span>ওয়ালেট থেকে রিনিউ</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setTopUpAmount((srv.renewalPrice - currentUser.accountBalance).toString());
                              setShowTopUpModal(true);
                            }}
                            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
                          >
                            টপ-আপ করে রিনিউ
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Wallet Statement & Transactions */}
        {activeSubTab === 'wallet' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 font-medium">আপনার বর্তমান একাউন্ট ব্যালেন্স</span>
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono mt-1">
                  ৳{currentUser.accountBalance.toLocaleString('bn-BD')}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  এই ব্যালেন্স থেকে আপনার ডোমেইন ও হোস্টিংয়ের রিকারেন্ট বিল স্বয়ংক্রিয়ভাবে বা ১-ক্লিকে পরিশোধ করা যায়।
                </p>
              </div>

              <button
                onClick={() => setShowTopUpModal(true)}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition flex items-center gap-2 shrink-0"
              >
                <PlusCircle className="w-5 h-5" />
                <span>ব্যালেন্স টপ-আপ করুন</span>
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-blue-400" />
                <span>ওয়ালেট স্টেটমেন্ট ও ট্রানজাকশন হিস্ট্রি</span>
              </h4>

              {userWalletTransactions.length === 0 ? (
                <div className="p-8 text-center rounded-3xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs">
                  আপনার অ্যাকাউন্টে এখনো কোনো পূর্ববর্তী ওয়ালেট ট্রানজাকশন নেই।
                </div>
              ) : (
                <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/80 shadow-xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-4">তারিখ</th>
                        <th className="p-4">বিবরণ (Description)</th>
                        <th className="p-4">পেমেন্ট মেথড</th>
                        <th className="p-4">TrxID / রেফারেন্স</th>
                        <th className="p-4">টাকার পরিমাণ</th>
                        <th className="p-4">পরবর্তী ব্যালেন্স</th>
                        <th className="p-4">স্ট্যাটাস</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {userWalletTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-850/50 transition">
                          <td className="p-4 text-slate-400 font-mono text-[11px]">{tx.createdAt}</td>
                          <td className="p-4 font-bold text-white">{tx.description}</td>
                          <td className="p-4 text-slate-300">{tx.paymentMethod || 'Wallet'}</td>
                          <td className="p-4 font-mono text-slate-400">{tx.transactionId || tx.referenceId || '-'}</td>
                          <td className="p-4 font-mono font-bold">
                            {tx.type === 'topup' ? (
                              <span className="text-emerald-400">+৳{tx.amount.toLocaleString()}</span>
                            ) : (
                              <span className="text-rose-400">-৳{tx.amount.toLocaleString()}</span>
                            )}
                          </td>
                          <td className="p-4 font-mono text-slate-300">
                            {tx.balanceAfter !== undefined ? `৳${tx.balanceAfter.toLocaleString()}` : '-'}
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                              সম্পন্ন
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Invoices & Billing */}
        {activeSubTab === 'invoices' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">আমার ইনভয়েস ও পেমেন্ট হিস্ট্রি</h3>

            <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/80 shadow-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-4">ইনভয়েস নং</th>
                    <th className="p-4">বিবরণ</th>
                    <th className="p-4">তারিখ</th>
                    <th className="p-4">মেয়াদ শেষ</th>
                    <th className="p-4">মোট বিল</th>
                    <th className="p-4">স্ট্যাটাস</th>
                    <th className="p-4 text-right">পদক্ষেপ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {userInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-850/50 transition">
                      <td className="p-4 font-mono font-bold text-white">{inv.invoiceNumber}</td>
                      <td className="p-4 font-medium text-slate-200">
                        {inv.title}
                        {inv.isRecurring && (
                          <span className="ml-1.5 px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono">
                            রিকারেন্ট
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-slate-400">{inv.createdAt}</td>
                      <td className="p-4 text-amber-300">{inv.dueAt}</td>
                      <td className="p-4 font-mono font-bold text-emerald-400">
                        ৳{inv.total.toLocaleString('bn-BD')}
                      </td>
                      <td className="p-4">
                        {inv.status === 'paid' ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                            পরিশোধিত (Paid)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold animate-pulse">
                            বকেয়া (Unpaid)
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {inv.status === 'unpaid' ? (
                            <>
                              {currentUser.accountBalance >= inv.total ? (
                                <button
                                  onClick={() => handlePayRecurringFromWallet(inv.id)}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md shadow-emerald-600/30 flex items-center gap-1"
                                >
                                  <Wallet className="w-3.5 h-3.5" />
                                  <span>ওয়ালেট পেমেন্ট</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => setActiveInvoiceForPay(inv)}
                                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow"
                                >
                                  পেমেন্ট করুন
                                </button>
                              )}
                            </>
                          ) : (
                            <button
                              onClick={() => setViewInvoiceModal(inv)}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition flex items-center gap-1"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>রসিদ</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Support Tickets */}
        {activeSubTab === 'tickets' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">আমার সাপোর্ট টিকেট</h3>
              <button
                onClick={() => setShowNewTicketModal(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>নতুন টিকেট খুলুন</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-2">
                {userTickets.map((tkt) => (
                  <button
                    key={tkt.id}
                    onClick={() => setSelectedTicket(tkt)}
                    className={`w-full text-left p-4 rounded-2xl border transition ${
                      selectedTicket?.id === tkt.id
                        ? 'bg-blue-950/50 border-blue-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono text-slate-400">{tkt.ticketNumber}</span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px]">
                        {tkt.category}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-white line-clamp-1">{tkt.subject}</h4>
                    <p className="text-[11px] text-slate-400 mt-1">{tkt.updatedAt}</p>
                  </button>
                ))}
              </div>

              <div className="lg:col-span-2">
                {selectedTicket ? (
                  <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                    <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                      <div>
                        <span className="font-mono text-xs text-slate-400">{selectedTicket.ticketNumber}</span>
                        <h3 className="text-lg font-bold text-white mt-0.5">{selectedTicket.subject}</h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold">
                        {selectedTicket.status}
                      </span>
                    </div>

                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                      {selectedTicket.messages.map((m) => (
                        <div
                          key={m.id}
                          className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                            m.sender === 'customer'
                              ? 'bg-blue-600/20 border border-blue-500/30 ml-8'
                              : 'bg-slate-950 border border-slate-800 mr-8'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                            <span>{m.senderName}</span>
                            <span>{m.createdAt}</span>
                          </div>
                          <p className="text-slate-200 leading-relaxed">{m.message}</p>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleSendReply} className="pt-2 border-t border-slate-800 space-y-2">
                      <textarea
                        rows={3}
                        placeholder="আপনার উত্তর লিখুন..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                      ></textarea>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>বার্তা পাঠান</span>
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 text-slate-400">
                    <LifeBuoy className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                    <p className="text-sm">বার্তা দেখার জন্য একটি টিকেট নির্বাচন করুন</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal: Top-Up Wallet Modal */}
        {showTopUpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <div className="bg-[#081f44] border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-scale-up">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-base">ওয়ালেট ব্যালেন্স টপ-আপ করুন</h3>
                    <p className="text-[11px] text-slate-400">বিকাশ বা নগদ দিয়ে ব্যালেন্স যোগ করুন</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTopUpModal(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Amount Pills */}
              <div className="space-y-1.5">
                <label className="block text-slate-300 text-xs font-bold">টাকার পরিমাণ নির্বাচন করুন (৳ BDT)</label>
                <div className="grid grid-cols-4 gap-2">
                  {['1000', '2000', '3500', '5000'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopUpAmount(amt)}
                      className={`py-2 rounded-xl text-xs font-mono font-bold transition border ${
                        topUpAmount === amt
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      +৳{Number(amt).toLocaleString()}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono text-sm font-bold focus:outline-none focus:border-emerald-500 mt-2"
                  placeholder="কাস্টম টাকার পরিমাণ লিখুন"
                  required
                />
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="block text-slate-300 text-xs font-bold">পেমেন্ট মেথড নির্বাচন করুন</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTopUpMethod('bkash')}
                    className={`p-3 rounded-2xl border text-left transition ${
                      topUpMethod === 'bkash'
                        ? 'bg-pink-950/40 border-pink-500 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs">bKash (বিকাশ)</div>
                    <div className="text-[10px] text-pink-400 font-mono">মার্চেন্ট পেমেন্ট</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTopUpMethod('nagad')}
                    className={`p-3 rounded-2xl border text-left transition ${
                      topUpMethod === 'nagad'
                        ? 'bg-orange-950/40 border-orange-500 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs">Nagad (নগদ)</div>
                    <div className="text-[10px] text-orange-400 font-mono">মার্চেন্ট পেমেন্ট</div>
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">মার্চেন্ট / পেমেন্ট নম্বর:</span>
                  <div className="flex items-center gap-1.5 font-mono font-bold text-emerald-400">
                    <span>{siteSettings.bkashMerchantNumber}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(siteSettings.bkashMerchantNumber)}
                      className="p-1 hover:text-white"
                      title="কপি করুন"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {copiedNumber && (
                  <span className="text-[10px] text-emerald-400 font-bold block text-right">
                    ✓ নম্বর কপি করা হয়েছে!
                  </span>
                )}
                <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2">
                  আপনার বিকাশ বা নগদ অ্যাপ থেকে <strong>Payment</strong> অপশনে গিয়ে উপরে উল্লেখিত নম্বরে ৳{Number(topUpAmount || 0).toLocaleString()} টাকা পাঠান এবং প্রাপ্ত <strong>TrxID</strong> নিচে দিন।
                </p>
              </div>

              {/* TrxID Form */}
              <form onSubmit={handleTopUpSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    ট্রানজাকশন আইডি (TrxID) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={topUpTrxId}
                    onChange={(e) => setTopUpTrxId(e.target.value)}
                    placeholder="যেমন: BK9A87XYZ4"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono uppercase font-bold focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    প্রেরক মোবাইল নম্বর (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={topUpSenderNumber}
                    onChange={(e) => setTopUpSenderNumber(e.target.value)}
                    placeholder="যেমন: 01711223344"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-xl transition"
                  >
                    টপ-আপ সম্পন্ন করুন
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTopUpModal(false)}
                    className="px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                  >
                    বাতিল
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Change Nameservers */}
        {selectedDomainForNs && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
              <h3 className="font-bold text-white text-base">
                নেমসার্ভার আপডেট - {selectedDomainForNs.domainName}
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Nameserver 1</label>
                  <input
                    type="text"
                    value={nsInput1}
                    onChange={(e) => setNsInput1(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Nameserver 2</label>
                  <input
                    type="text"
                    value={nsInput2}
                    onChange={(e) => setNsInput2(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleSaveNs}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow"
                >
                  সংরক্ষণ করুন
                </button>
                <button
                  onClick={() => setSelectedDomainForNs(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  বাতিল
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Direct Pay Invoice Modal */}
        {activeInvoiceForPay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-base">ইনভয়েস পেমেন্ট</h3>
                <button onClick={() => setActiveInvoiceForPay(null)} className="text-slate-400 hover:text-white">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>ইনভয়েস:</span>
                  <span className="text-white font-bold">{activeInvoiceForPay.invoiceNumber}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>মোট বিল:</span>
                  <span className="text-emerald-400 font-mono font-bold text-sm">
                    ৳{activeInvoiceForPay.total.toLocaleString('bn-BD')}
                  </span>
                </div>
              </div>

              {currentUser.accountBalance >= activeInvoiceForPay.total && (
                <button
                  onClick={() => {
                    handlePayRecurringFromWallet(activeInvoiceForPay.id);
                    setActiveInvoiceForPay(null);
                  }}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2"
                >
                  <Wallet className="w-4 h-4" />
                  <span>ওয়ালেট ব্যালেন্স থেকে ১-ক্লিকে পরিশোধ করুন</span>
                </button>
              )}

              <form onSubmit={handlePayInvoiceSubmit} className="space-y-3 text-xs pt-2 border-t border-slate-800">
                <span className="text-slate-400 font-semibold block">অথবা বিকাশ/নগদে পরিশোধ করুন:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setInvoicePayMethod('bkash')}
                    className={`flex-1 py-2 rounded-xl border text-xs font-bold ${
                      invoicePayMethod === 'bkash' ? 'bg-pink-950/40 border-pink-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    bKash (বিকাশ)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInvoicePayMethod('nagad')}
                    className={`flex-1 py-2 rounded-xl border text-xs font-bold ${
                      invoicePayMethod === 'nagad' ? 'bg-orange-950/40 border-orange-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Nagad (নগদ)
                  </button>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">পেমেন্ট TrxID</label>
                  <input
                    type="text"
                    value={invoiceTrxId}
                    onChange={(e) => setInvoiceTrxId(e.target.value)}
                    placeholder="যেমন: BK991207TX"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono uppercase"
                    required
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow"
                  >
                    পেমেন্ট নিশ্চিত করুন
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveInvoiceForPay(null)}
                    className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                  >
                    বাতিল
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: View Invoice Receipt */}
        {viewInvoiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-white text-base">অফিসিয়াল ইনভয়েস রসিদ</h3>
                  <span className="font-mono text-xs text-slate-400">{viewInvoiceModal.invoiceNumber}</span>
                </div>
                <button onClick={() => setViewInvoiceModal(null)} className="text-slate-400 hover:text-white">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>গ্রাহকের নাম:</span>
                    <span className="text-white font-bold">{viewInvoiceModal.customerName}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>তারিখ:</span>
                    <span className="text-slate-200">{viewInvoiceModal.createdAt}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>পেমেন্ট মাধ্যম:</span>
                    <span className="text-emerald-400 font-bold">{viewInvoiceModal.paymentMethod || 'Wallet'}</span>
                  </div>
                  {viewInvoiceModal.transactionId && (
                    <div className="flex justify-between text-slate-400">
                      <span>TrxID:</span>
                      <span className="font-mono text-slate-200">{viewInvoiceModal.transactionId}</span>
                    </div>
                  )}
                </div>

                <div className="border border-slate-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-3">বিবরণ</th>
                        <th className="p-3 text-right">মূল্য</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {viewInvoiceModal.items.map((it, idx) => (
                        <tr key={idx}>
                          <td className="p-3 text-slate-200">{it.description}</td>
                          <td className="p-3 text-right font-mono text-emerald-400 font-bold">
                            ৳{it.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-950 border-t border-slate-800 font-bold">
                      <tr>
                        <td className="p-3 text-white">মোট পরিশোধিত:</td>
                        <td className="p-3 text-right font-mono text-emerald-400 text-sm">
                          ৳{viewInvoiceModal.total.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setViewInvoiceModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: New Support Ticket */}
        {showNewTicketModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-base">নতুন সাপোর্ট টিকেট খুলুন</h3>
                <button onClick={() => setShowNewTicketModal(false)} className="text-slate-400 hover:text-white">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTicketSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">ক্যাটাগরি</label>
                  <select
                    value={ticketCategory}
                    onChange={(e: any) => setTicketCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                  >
                    <option value="Domain">ডোমেইন সেবা</option>
                    <option value="Hosting">হোস্টিং সেবা</option>
                    <option value="Billing">বিলিং ও পেমেন্ট</option>
                    <option value="Technical">কারিগরি সহায়তা</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">বিষয় (Subject)</label>
                  <input
                    type="text"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="যেমন: ডোমেইন DNS রেকর্ড আপডেট"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">বিস্তারিত বার্তা</label>
                  <textarea
                    rows={4}
                    value={ticketMsg}
                    onChange={(e) => setTicketMsg(e.target.value)}
                    placeholder="আপনার সমস্যা বা প্রশ্নের বিস্তারিত লিখুন..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                    required
                  ></textarea>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow"
                  >
                    টিকেট সাবমিট করুন
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewTicketModal(false)}
                    className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                  >
                    বাতিল
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
