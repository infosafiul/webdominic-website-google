'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context';
import {
  Shield,
  Users,
  Globe,
  Receipt,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  PlusCircle,
  CreditCard,
  DollarSign,
  TrendingUp,
  Search,
  ExternalLink,
  LifeBuoy,
  XCircle,
  FileText,
  Calendar,
  Layers,
  Edit2,
  Phone,
  Mail,
  MessageSquare,
  Wallet,
  RefreshCw,
  Sparkles,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  Server
} from 'lucide-react';
import { CustomerDomain, CustomerService, Order, SupportTicket, UserProfile } from '@/lib/types';

export default function AdminDashboard() {
  const {
    currentUser,
    users,
    orders,
    invoices,
    domains,
    services,
    tickets,
    domainPrices,
    walletTransactions,
    updateDomainPrice,
    approvePaymentAndOrder,
    rejectOrder,
    sendCustomBill,
    addTicketReply,
    payFromWallet,
    adminAdjustWalletBalance,
    generateRecurringBill,
    generateAllMonthlyRecurringBills,
    sendExpiryNotification
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'monthly_expiry' | 'send_bill' | 'wallets' | 'orders' | 'pricing' | 'tickets'>('monthly_expiry');

  // Month and service filter
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedServiceType, setSelectedServiceType] = useState<'all' | 'domain' | 'service'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Bulk action notification state
  const [bulkActionNotice, setBulkActionNotice] = useState<string | null>(null);

  // Custom bill state
  const [selectedUserId, setSelectedUserId] = useState<number>(users[2]?.id || users[1]?.id || 2);
  const [billTitle, setBillTitle] = useState('বার্ষিক ডোমেইন ও হোস্টিং রিকারিং বিল');
  const [billItemDesc, setBillItemDesc] = useState('ডোমেইন ও হোস্টিং বাৎসরিক রিকারেন্ট রিনিউয়াল');
  const [billAmount, setBillAmount] = useState('6249');
  const [billDueDate, setBillDueDate] = useState('2027-02-15');
  const [billSentSuccess, setBillSentSuccess] = useState(false);

  // Notification Modal (Email / WhatsApp preview)
  const [notificationModal, setNotificationModal] = useState<{
    isOpen: boolean;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    serviceName: string;
    expiryDate: string;
    renewalPrice: number;
    channel: 'email' | 'whatsapp' | 'sms';
    itemType: 'domain' | 'service';
    itemId: string;
    messageText: string;
  } | null>(null);

  // Manual Wallet Adjustment Modal
  const [manualWalletModal, setManualWalletModal] = useState<{
    isOpen: boolean;
    userId: number;
    userName: string;
    currentBalance: number;
    amount: string;
    type: 'credit' | 'debit';
    note: string;
  } | null>(null);

  // Quick ticket reply
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');

  // Domain price editing
  const [editingTldId, setEditingTldId] = useState<number | null>(null);
  const [editPriceVal, setEditPriceVal] = useState<number>(0);

  // Days left calculation
  const getDaysLeft = (expiryDateStr: string) => {
    const expiry = new Date(expiryDateStr);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Build unified expiring items list (both Domains & Hosting)
  const allExpiringItems: {
    id: string;
    itemType: 'domain' | 'service';
    name: string;
    serviceCategory: string;
    userId: number;
    user?: UserProfile;
    registrationDate: string;
    expiryDate: string;
    daysLeft: number;
    renewalPrice: number;
    currency: 'BDT' | 'USD';
    autoRenew: boolean;
    autoRenewFromWallet?: boolean;
    recurringBillGenerated?: boolean;
    recurringInvoiceId?: string;
    lastReminderSentAt?: string;
  }[] = [
    ...domains.map(d => ({
      id: d.id,
      itemType: 'domain' as const,
      name: d.domainName,
      serviceCategory: 'ডোমেইন রেজিস্ট্রেশন',
      userId: d.userId,
      user: users.find(u => u.id === d.userId),
      registrationDate: d.registrationDate,
      expiryDate: d.expiryDate,
      daysLeft: getDaysLeft(d.expiryDate),
      renewalPrice: d.renewalPrice,
      currency: d.currency,
      autoRenew: d.autoRenew,
      autoRenewFromWallet: d.autoRenewFromWallet,
      recurringBillGenerated: d.recurringBillGenerated,
      recurringInvoiceId: d.recurringInvoiceId,
      lastReminderSentAt: d.lastReminderSentAt
    })),
    ...services.map(s => ({
      id: s.id,
      itemType: 'service' as const,
      name: s.serviceName,
      serviceCategory: s.serviceType,
      userId: s.userId,
      user: users.find(u => u.id === s.userId),
      registrationDate: s.activatedAt,
      expiryDate: s.expiresAt,
      daysLeft: getDaysLeft(s.expiresAt),
      renewalPrice: s.renewalPrice,
      currency: s.currency,
      autoRenew: true,
      autoRenewFromWallet: s.autoRenewFromWallet,
      recurringBillGenerated: s.recurringBillGenerated,
      recurringInvoiceId: s.recurringInvoiceId,
      lastReminderSentAt: s.lastReminderSentAt
    }))
  ];

  // Filter items based on month, service type, and search query
  const filteredExpiringItems = allExpiringItems.filter(item => {
    // Month filter
    if (selectedMonth !== 'all' && !item.expiryDate.startsWith(selectedMonth)) {
      return false;
    }
    // Type filter
    if (selectedServiceType !== 'all' && item.itemType !== selectedServiceType) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchUser = item.user?.fullName.toLowerCase().includes(q) || item.user?.email.toLowerCase().includes(q) || item.user?.phone.includes(q);
      return matchName || matchUser;
    }
    return true;
  }).sort((a, b) => a.daysLeft - b.daysLeft);

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const totalRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);

  // Month stats for selected month
  const totalRenewalAmount = filteredExpiringItems.reduce((acc, it) => acc + it.renewalPrice, 0);
  const totalDomainCount = filteredExpiringItems.filter(it => it.itemType === 'domain').length;
  const totalServiceCount = filteredExpiringItems.filter(it => it.itemType === 'service').length;
  const recurringBillsReadyCount = filteredExpiringItems.filter(it => it.recurringBillGenerated).length;

  // Actions
  const handleInitiateSingleBill = (item: typeof allExpiringItems[0]) => {
    try {
      const newInv = generateRecurringBill(item.itemType, item.id);
      setBulkActionNotice(`${item.name}-এর জন্য রিকারিং ইনভয়েস (#${newInv.invoiceNumber}) তৈরি করে ক্লায়েন্টের কাছে পাঠানো হয়েছে!`);
      setTimeout(() => setBulkActionNotice(null), 4000);
    } catch (err: any) {
      alert(err.message || 'বিল তৈরিতে সমস্যা হয়েছে');
    }
  };

  const handleBulkGenerateMonthlyBills = () => {
    if (selectedMonth === 'all') {
      alert('অনুগ্রহ করে নির্দিষ্ট একটি মাস (যেমন: ফেব্রুয়ারি ২০২৭ বা অক্টোবর ২০২৬) নির্বাচন করুন।');
      return;
    }
    const count = generateAllMonthlyRecurringBills(selectedMonth);
    if (count === 0) {
      setBulkActionNotice('এই মাসের সকল সার্ভিসের জন্য ইতিমধ্যে রিকারিং বিল তৈরি করা আছে!');
    } else {
      setBulkActionNotice(`${selectedMonth} মাসের ${count}টি এক্সপায়ারিং সার্ভিসের জন্য সফলভাবে রিকারেন্ট বিল জেনারেট করা হয়েছে!`);
    }
    setTimeout(() => setBulkActionNotice(null), 4500);
  };

  const handleOpenNotificationModal = (item: typeof allExpiringItems[0], channel: 'email' | 'whatsapp' | 'sms') => {
    const user = item.user;
    const phone = user?.phone?.replace(/[^0-9]/g, '') || '8801841440202';
    const cleanPhone = phone.startsWith('88') ? phone : `88${phone}`;
    const msg = `আসসালামু আলাইকুম ${user?.fullName || 'গ্রাহক'}, WebDominic থেকে আপনার ${item.name} (${item.serviceCategory}) সার্ভিসের বাৎসরিক মেয়াদ আগামী ${item.expiryDate} তারিখে শেষ হবে। নবায়ন ফি ৳${item.renewalPrice.toLocaleString()}। আপনার অ্যাকাউন্টে ব্যালেন্স থাকলে অটো-অ্যাডজাস্ট হবে অথবা ড্যাশবোর্ড থেকে bKash/Nagad এ পরিশোধ করুন: https://webdominic.com/client`;

    setNotificationModal({
      isOpen: true,
      clientName: user?.fullName || 'গ্রাহক',
      clientEmail: user?.email || '',
      clientPhone: cleanPhone,
      serviceName: item.name,
      expiryDate: item.expiryDate,
      renewalPrice: item.renewalPrice,
      channel,
      itemType: item.itemType,
      itemId: item.id,
      messageText: msg
    });
  };

  const handleConfirmSendNotification = () => {
    if (!notificationModal) return;
    const res = sendExpiryNotification(notificationModal.itemType, notificationModal.itemId, notificationModal.channel);

    if (notificationModal.channel === 'whatsapp' && res.channelUrl) {
      window.open(res.channelUrl, '_blank');
    } else {
      alert(res.message);
    }
    setNotificationModal(null);
  };

  const handleAutoAdjustFromWallet = async (item: typeof allExpiringItems[0]) => {
    const user = item.user;
    if (!user) return;
    if (user.accountBalance < item.renewalPrice) {
      alert(`ক্লায়েন্টের অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই। ক্লায়েন্টের ব্যালেন্স: ৳${user.accountBalance}, প্রয়োজনীয়: ৳${item.renewalPrice}। প্রথমে ক্লায়েন্টকে ব্যালেন্স টপ-আপ করতে বলুন।`);
      return;
    }

    const confirmAdjust = confirm(`মিস্টার ${user.fullName}-এর ওয়ালেট ব্যালেন্স (৳${user.accountBalance}) থেকে ৳${item.renewalPrice} কেটে কি ${item.name} ১ বছরের জন্য রিনিউ করবেন?`);
    if (!confirmAdjust) return;

    // Find invoice or generate recurring bill first
    let invId = item.recurringInvoiceId;
    if (!invId) {
      const newInv = generateRecurringBill(item.itemType, item.id);
      invId = newInv.id;
    }

    const res = await payFromWallet(invId);
    alert(res.message);
  };

  const handleSendBillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(billAmount) || 0;
    if (amountNum <= 0) {
      alert('সঠিক টাকার পরিমাণ লিখুন');
      return;
    }

    sendCustomBill({
      userId: selectedUserId,
      title: billTitle,
      items: [{ description: billItemDesc, amount: amountNum }],
      dueDate: billDueDate,
      currency: 'BDT',
    });

    setBillSentSuccess(true);
    setTimeout(() => setBillSentSuccess(false), 3500);
  };

  const handleSaveManualWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualWalletModal) return;
    const amt = parseFloat(manualWalletModal.amount) || 0;
    if (amt <= 0) {
      alert('সঠিক টাকার পরিমাণ লিখুন');
      return;
    }
    const finalAmount = manualWalletModal.type === 'credit' ? amt : -amt;
    adminAdjustWalletBalance(manualWalletModal.userId, finalAmount, manualWalletModal.note || 'অ্যাডমিন ম্যানুয়াল অ্যাডজাস্টমেন্ট');
    setManualWalletModal(null);
    alert('ক্লায়েন্টের ওয়ালেট ব্যালেন্স সফলভাবে আপডেট করা হয়েছে!');
  };

  const handleAdminTicketReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !adminReplyText.trim()) return;
    addTicketReply(selectedTicket.id, adminReplyText.trim(), 'admin');
    setAdminReplyText('');
    alert('উত্তর সফলভাবে পাঠানো হয়েছে!');
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-950 min-h-screen text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Admin Header */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/50 via-slate-900 to-indigo-950/60 border border-amber-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-inner">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  অ্যাডমিন ব্যাকএন্ড কন্ট্রোল
                </span>
                <span className="text-xs text-slate-400">WDH Management Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                মুহাম্মদ শফিউল আজম (অ্যাডমিন)
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                মাসিক ডোমেইন ও হোস্টিং এক্সপায়ারি ট্র্যাকিং, রিকারেন্ট ইনভয়েস জেনারেটর, ক্লায়েন্ট যোগাযোগ ও ওয়ালেট ব্যালেন্স মনিটরিং
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveAdminTab('send_bill')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>কাস্টমারকে কাস্টম বিল পাঠান</span>
            </button>
          </div>
        </div>

        {/* Global Business Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>মোট পরিশোধিত আয়</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">
              ৳{totalRevenue.toLocaleString('bn-BD')}
            </div>
            <span className="text-[11px] text-slate-400">সিস্টেমে পেইড ইনভয়েস থেকে</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>পেন্ডিং পেমেন্ট ভেরিফিকেশন</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">
              {pendingOrders.length} টি
            </div>
            <span className="text-[11px] text-slate-400">বিকাশ / নগদ TrxID যাচাই বাকি</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>মাসিক এক্সপায়ারি সার্ভিস</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-black text-rose-400">
              {allExpiringItems.filter(d => d.daysLeft <= 30 && d.daysLeft > 0).length} টি
            </div>
            <span className="text-[11px] text-slate-400">পরবর্তী ৩০ দিনে রিকারেন্ট বিল রিমাইন্ডার</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>মোট ক্লায়েন্ট ও ওয়ালেট</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-cyan-400">
              {users.filter(u => u.role === 'client').length} জন
            </div>
            <span className="text-[11px] text-slate-400">সক্রিয় ক্লায়েন্ট ওয়ালেট ম্যানেজমেন্ট</span>
          </div>
        </div>

        {/* Admin Subtabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveAdminTab('monthly_expiry')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeAdminTab === 'monthly_expiry'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>মাসিক এক্সপায়ারি ও রিকারিং বিলিং ({allExpiringItems.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('wallets')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeAdminTab === 'wallets'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>ক্লায়েন্ট ওয়ালেট ব্যালেন্স ও ট্রানজাকশন ({users.filter(u => u.role === 'client').length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('send_bill')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeAdminTab === 'send_bill'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>কাস্টম বিল জেনারেটর (Invoice)</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeAdminTab === 'orders'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>অর্ডার ও পেমেন্ট ভেরিফিকেশন ({orders.length})</span>
            {pendingOrders.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px]">
                {pendingOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveAdminTab('pricing')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeAdminTab === 'pricing'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>ডোমেইন মূল্য তালিকা</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('tickets')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeAdminTab === 'tickets'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <LifeBuoy className="w-4 h-4" />
            <span>সাপোর্ট ইনবক্স ({tickets.length})</span>
          </button>
        </div>

        {/* Tab 1: Monthly Expiry & Recurring Billing Tracker (Requested by User!) */}
        {activeAdminTab === 'monthly_expiry' && (
          <div className="space-y-6">
            {/* Action Notice Alert */}
            {bulkActionNotice && (
              <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 text-sm flex items-center justify-between gap-3 shadow-xl animate-fade-in">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-semibold">{bulkActionNotice}</span>
                </div>
                <button
                  onClick={() => setBulkActionNotice(null)}
                  className="text-xs bg-emerald-500/20 hover:bg-emerald-500/30 px-3 py-1 rounded-lg text-white"
                >
                  ঠিক আছে
                </button>
              </div>
            )}

            {/* Filter Bar */}
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-400" />
                    <span>মাসভিত্তিক এক্সপায়ারি ও রিকারেন্ট বিলিং মনিটর</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    মাসে মাসে কোন কোন ক্লায়েন্টের ডোমেইন ও হোস্টিং এক্সপায়ার হবে তা ট্র্যাক করুন, ১-ক্লিকে রিকারেন্ট বিল তৈরি করুন এবং ইমেইল/হোয়াটসঅ্যাপে যোগাযোগ করুন।
                  </p>
                </div>

                {/* Bulk generate button */}
                <button
                  onClick={handleBulkGenerateMonthlyBills}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg transition flex items-center gap-2 shrink-0"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {selectedMonth === 'all'
                      ? 'নির্বাচিত মাসের রিকারেন্ট বিল তৈরি করুন'
                      : `${selectedMonth} মাসের সব রিকারেন্ট বিল একসাথে জেনারেট করুন`}
                  </span>
                </button>
              </div>

              {/* Month Selector Pills */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  মাস নির্বাচন করুন (Filter by Month):
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setSelectedMonth('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      selectedMonth === 'all'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    সকল মাস ({allExpiringItems.length})
                  </button>

                  <button
                    onClick={() => setSelectedMonth('2026-09')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      selectedMonth === '2026-09'
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
                    <span>এই মাস: সেপ্টেম্বর ২০২৬ ({allExpiringItems.filter(i => i.expiryDate.startsWith('2026-09')).length})</span>
                  </button>

                  <button
                    onClick={() => setSelectedMonth('2026-10')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      selectedMonth === '2026-10'
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    অক্টোবর ২০২৬ ({allExpiringItems.filter(i => i.expiryDate.startsWith('2026-10')).length})
                  </button>

                  <button
                    onClick={() => setSelectedMonth('2026-11')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      selectedMonth === '2026-11'
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    নভেম্বর ২০২৬ ({allExpiringItems.filter(i => i.expiryDate.startsWith('2026-11')).length})
                  </button>

                  <button
                    onClick={() => setSelectedMonth('2026-12')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      selectedMonth === '2026-12'
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    ডিসেম্বর ২০২৬ ({allExpiringItems.filter(i => i.expiryDate.startsWith('2026-12')).length})
                  </button>

                  <button
                    onClick={() => setSelectedMonth('2027-01')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      selectedMonth === '2027-01'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    জানুয়ারি ২০২৭ [রিকারেন্ট বিল মাস] ({allExpiringItems.filter(i => i.expiryDate.startsWith('2027-01')).length})
                  </button>

                  <button
                    onClick={() => setSelectedMonth('2027-02')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border border-cyan-500/40 ${
                      selectedMonth === '2027-02'
                        ? 'bg-cyan-600 text-white shadow-md'
                        : 'bg-slate-800 text-cyan-300 hover:bg-slate-700'
                    }`}
                  >
                    ফেব্রুয়ারি ২০২৭ [মিস্টার আব্দুর রহিম এক্সপায়ারি] ({allExpiringItems.filter(i => i.expiryDate.startsWith('2027-02')).length})
                  </button>
                </div>
              </div>

              {/* Service Type & Search Input */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-[11px] text-slate-400 font-semibold shrink-0">সার্ভিস ফিল্টার:</span>
                  <div className="flex items-center rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
                    <button
                      onClick={() => setSelectedServiceType('all')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition ${
                        selectedServiceType === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      সব ({filteredExpiringItems.length})
                    </button>
                    <button
                      onClick={() => setSelectedServiceType('domain')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition ${
                        selectedServiceType === 'domain' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      ডোমেইন ({totalDomainCount})
                    </button>
                    <button
                      onClick={() => setSelectedServiceType('service')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition ${
                        selectedServiceType === 'service' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      হোস্টিং ({totalServiceCount})
                    </button>
                  </div>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="ডোমেইন বা গ্রাহকের নাম দিয়ে খুঁজুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Monthly Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs text-slate-400 block">নির্বাচিত মাসে এক্সপায়ারি সংখ্যা</span>
                <span className="text-2xl font-black text-white mt-1 block">
                  {filteredExpiringItems.length} টি
                </span>
                <span className="text-[11px] text-slate-400">
                  {totalDomainCount} টি ডোমেইন + {totalServiceCount} টি হোস্টিং
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs text-slate-400 block">মোট রিকারেন্ট বিলের অঙ্ক</span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">
                  ৳{totalRenewalAmount.toLocaleString('bn-BD')}
                </span>
                <span className="text-[11px] text-emerald-500/90">প্রত্যাশিত বাৎসরিক রিনিউয়াল ফি</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs text-slate-400 block">রিকারেন্ট বিল প্রস্তুত / পাঠানো</span>
                <span className="text-2xl font-black text-amber-400 mt-1 block">
                  {recurringBillsReadyCount} / {filteredExpiringItems.length}
                </span>
                <span className="text-[11px] text-slate-400">ইনভয়েস জেনারেট সম্পন্ন</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs text-slate-400 block">ওয়ালেট অটো-অ্যাডজাস্ট সক্রিয়</span>
                <span className="text-2xl font-black text-cyan-400 mt-1 block">
                  {filteredExpiringItems.filter(i => i.autoRenewFromWallet).length} টি
                </span>
                <span className="text-[11px] text-cyan-400/90">ব্যালেন্স থাকলে ১ ক্লিকে সমন্বয়</span>
              </div>
            </div>

            {/* Detailed Table */}
            <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-4">গ্রাহক (Client)</th>
                    <th className="p-4">সার্ভিসের নাম ও ধরন</th>
                    <th className="p-4">মেয়াদ শেষ (Expiry Date)</th>
                    <th className="p-4">বাকি দিন</th>
                    <th className="p-4">রিকারিং বিল</th>
                    <th className="p-4">ওয়ালেট ব্যালেন্স</th>
                    <th className="p-4">বিল স্ট্যাটাস</th>
                    <th className="p-4 text-right">পদক্ষেপ (Actions)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredExpiringItems.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400">
                        নির্বাচিত ফিল্টারে কোনো এক্সপায়ারি সার্ভিস পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    filteredExpiringItems.map((item) => {
                      const isUrgent = item.daysLeft <= 30 && item.daysLeft > 0;
                      const isExpired = item.daysLeft <= 0;
                      const clientWallet = item.user?.accountBalance || 0;
                      const hasSufficientBalance = clientWallet >= item.renewalPrice;

                      return (
                        <tr
                          key={`${item.itemType}-${item.id}`}
                          className={`hover:bg-slate-850/60 transition ${
                            item.user?.id === 3 ? 'bg-blue-950/20' : ''
                          }`}
                        >
                          {/* Client Info */}
                          <td className="p-4">
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{item.user?.fullName || 'অজানা গ্রাহক'}</span>
                              {item.user?.id === 3 && (
                                <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">
                                  রহিম
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">{item.user?.email}</div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3 text-slate-500" />
                              <span>{item.user?.phone || 'N/A'}</span>
                            </div>
                          </td>

                          {/* Service Info */}
                          <td className="p-4">
                            <div className="font-mono font-bold text-white flex items-center gap-1.5">
                              {item.itemType === 'domain' ? (
                                <Globe className="w-3.5 h-3.5 text-blue-400" />
                              ) : (
                                <Server className="w-3.5 h-3.5 text-indigo-400" />
                              )}
                              <span>{item.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {item.serviceCategory} • শুরু: {item.registrationDate}
                            </span>
                          </td>

                          {/* Expiry Date */}
                          <td className="p-4">
                            <div className="font-medium text-slate-200">
                              {item.expiryDate}
                            </div>
                            <span className="text-[10px] text-slate-500 block">
                              ১ বছর মেয়াদ চক্র
                            </span>
                          </td>

                          {/* Days Left */}
                          <td className="p-4">
                            {isExpired ? (
                              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-bold">
                                মেয়াদ শেষ!
                              </span>
                            ) : isUrgent ? (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1 w-max">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                                <span>{item.daysLeft} দিন বাকি</span>
                              </span>
                            ) : (
                              <span className="text-slate-300 font-medium">
                                {item.daysLeft} দিন বাকি
                              </span>
                            )}
                          </td>

                          {/* Renewal Bill Amount */}
                          <td className="p-4">
                            <div className="font-bold text-emerald-400">
                              ৳{item.renewalPrice.toLocaleString('bn-BD')}
                            </div>
                            <span className="text-[10px] text-slate-400">বাৎসরিক রিকারেন্ট</span>
                          </td>

                          {/* Client Wallet Balance */}
                          <td className="p-4">
                            <div className={`font-mono font-bold ${hasSufficientBalance ? 'text-emerald-400' : 'text-slate-300'}`}>
                              ৳{clientWallet.toLocaleString('bn-BD')}
                            </div>
                            {item.autoRenewFromWallet ? (
                              <span className="text-[10px] text-cyan-400 block font-medium">
                                ✓ অটো-অ্যাডজাস্ট চালু
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500 block">
                                ম্যানুয়াল বিলিং
                              </span>
                            )}
                          </td>

                          {/* Bill / Invoice Status */}
                          <td className="p-4">
                            {item.recurringBillGenerated ? (
                              <div className="space-y-0.5">
                                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-semibold block w-max">
                                  বিল পাঠানো হয়েছে
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono block">
                                  {item.recurringInvoiceId}
                                </span>
                              </div>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] block w-max">
                                বিল তৈরি বাকি
                              </span>
                            )}
                            {item.lastReminderSentAt && (
                              <span className="text-[9px] text-slate-500 block mt-0.5">
                                শেষ রিমাইন্ডার: {item.lastReminderSentAt}
                              </span>
                            )}
                          </td>

                          {/* Action Buttons */}
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {/* 1. Send Recurring Bill */}
                              {!item.recurringBillGenerated ? (
                                <button
                                  onClick={() => handleInitiateSingleBill(item)}
                                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition shadow flex items-center gap-1"
                                  title="রিকারেন্ট বিল ইনভয়েস তৈরি করে গ্রাহককে পাঠান"
                                >
                                  <Receipt className="w-3 h-3" />
                                  <span>বিল পাঠান</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleInitiateSingleBill(item)}
                                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition flex items-center gap-1"
                                  title="পুনরায় ইনভয়েস ইস্যু করুন"
                                >
                                  <RefreshCw className="w-3 h-3" />
                                  <span>পুনঃবিল</span>
                                </button>
                              )}

                              {/* 2. Send Email Reminder */}
                              <button
                                onClick={() => handleOpenNotificationModal(item, 'email')}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 transition"
                                title="ইমেইল রিমাইন্ডার পাঠান"
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </button>

                              {/* 3. Send WhatsApp Notification */}
                              <button
                                onClick={() => handleOpenNotificationModal(item, 'whatsapp')}
                                className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-400 border border-emerald-800/60 transition"
                                title="সরাসরি WhatsApp নোটিশ পাঠান"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </button>

                              {/* 4. Wallet Auto-Deduct / Instant Pay */}
                              {hasSufficientBalance && (
                                <button
                                  onClick={() => handleAutoAdjustFromWallet(item)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition flex items-center gap-1 shadow-md shadow-emerald-600/30"
                                  title="ক্লায়েন্টের ওয়ালেট ব্যালেন্স থেকে ১-ক্লিকে টাকা কেটে মেয়াদ ১ বছর বাড়ান"
                                >
                                  <Wallet className="w-3 h-3" />
                                  <span>ওয়ালেট অ্যাডজাস্ট</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Client Wallets & Transactions */}
        {activeAdminTab === 'wallets' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-emerald-400" />
                  <span>ক্লায়েন্ট ওয়ালেট ব্যালেন্স ও সমন্বয় হিস্ট্রি</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  ক্লায়েন্টরা বিকাশ/নগদে যে টাকা টপ-আপ করে তা এখান থেকে মনিটর করুন এবং ডোমেইন-হোস্টিং বিল সমন্বয় পরিচালনা করুন।
                </p>
              </div>
            </div>

            {/* Client Wallets Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {users.filter(u => u.role === 'client').map((user) => (
                <div key={user.id} className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-white text-base">{user.fullName}</h4>
                        <span className="text-[10px] text-slate-500">#{user.id}</span>
                      </div>
                      <p className="text-xs text-slate-400">{user.email}</p>
                      <p className="text-xs text-slate-400">{user.phone}</p>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Wallet className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-slate-400">বর্তমান ওয়ালেট ব্যালেন্স</span>
                    <span className="text-xl font-mono font-black text-emerald-400">
                      ৳{user.accountBalance.toLocaleString('bn-BD')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setManualWalletModal({
                        isOpen: true,
                        userId: user.id,
                        userName: user.fullName,
                        currentBalance: user.accountBalance,
                        amount: '1000',
                        type: 'credit',
                        note: 'ম্যানুয়াল ডিপোজিট'
                      })}
                      className="flex-1 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition"
                    >
                      + ব্যালেন্স যোগ
                    </button>
                    <button
                      onClick={() => setManualWalletModal({
                        isOpen: true,
                        userId: user.id,
                        userName: user.fullName,
                        currentBalance: user.accountBalance,
                        amount: '500',
                        type: 'debit',
                        note: 'সার্ভিস চার্জ অ্যাডজাস্ট'
                      })}
                      className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 font-bold text-xs transition border border-rose-500/20"
                    >
                      - ব্যালেন্স কর্তন
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Wallet Transactions Log Table */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>সর্বশেষ ওয়ালেট ট্রানজাকশন লগ (টপ-আপ ও বিল সমন্বয়)</span>
              </h4>

              <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/80 shadow-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-4">তারিখ ও সময়</th>
                      <th className="p-4">গ্রাহক</th>
                      <th className="p-4">ধরনের বিবরণ</th>
                      <th className="p-4">পেমেন্ট মেথড</th>
                      <th className="p-4">TrxID / রেফারেন্স</th>
                      <th className="p-4">টাকার পরিমাণ</th>
                      <th className="p-4">পরবর্তী ব্যালেন্স</th>
                      <th className="p-4">স্ট্যাটাস</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {walletTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-850/50 transition">
                        <td className="p-4 text-slate-400 font-mono text-[11px]">{tx.createdAt}</td>
                        <td className="p-4 font-bold text-white">{tx.customerName || `Client #${tx.userId}`}</td>
                        <td className="p-4 text-slate-200">{tx.description}</td>
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
                            সম্পন্ন (Completed)
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Custom Bill Generator */}
        {activeAdminTab === 'send_bill' && (
          <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-400" />
                <span>কাস্টমারকে কাস্টম রিকারেন্ট বিল পাঠান</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                এখানে তথ্য পূরণ করে সাবমিট করলেই সংশ্লিষ্ট কাস্টমারের পোর্টালে ইনভয়েস জমা হবে এবং সে বিকাশ/নগদ বা ওয়ালেট দিয়ে বিল পরিশোধ করতে পারবে।
              </p>
            </div>

            {billSentSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>ইনভয়েস সফলভাবে তৈরি ও কাস্টমারের কাছে পাঠানো হয়েছে!</span>
              </div>
            )}

            <form onSubmit={handleSendBillSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">কাস্টমার নির্বাচন করুন</label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-medium"
                >
                  {users.filter(u => u.role === 'client').map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullName} ({u.email} - ওয়ালেট: ৳{u.accountBalance})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">বিলের শিরোনাম</label>
                <input
                  type="text"
                  value={billTitle}
                  onChange={(e) => setBillTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">সার্ভিস বিবরণ</label>
                <input
                  type="text"
                  value={billItemDesc}
                  onChange={(e) => setBillItemDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">মোট বিলের পরিমাণ (৳ BDT)</label>
                  <input
                    type="number"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">পরিশোধের শেষ তারিখ (Due Date)</label>
                  <input
                    type="date"
                    value={billDueDate}
                    onChange={(e) => setBillDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-medium"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl transition flex items-center justify-center gap-2 mt-4"
              >
                <Send className="w-4 h-4" />
                <span>ইনভয়েস তৈরি ও ক্লায়েন্টকে প্রেরণ করুন</span>
              </button>
            </form>
          </div>
        )}

        {/* Tab 4: Orders & bKash Verification */}
        {activeAdminTab === 'orders' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-400" />
                <span>অর্ডার ও পেমেন্ট ভেরিফিকেশন কিউ</span>
              </h3>
              <p className="text-xs text-slate-400">
                গ্রাহকরা বিকাশ বা নগদে ট্রানজাকশন আইডি দিয়ে অর্ডার সাবমিট করলে এখানে দেখতে পাবেন। ট্রানজাকশন যাচাই করে অ্যাপ্রুভ করলে সার্ভিস সাথে সাথে চালু হবে।
              </p>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/80 shadow-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-4">অর্ডার নং</th>
                    <th className="p-4">গ্রাহক</th>
                    <th className="p-4">পেমেন্ট মেথড ও TrxID</th>
                    <th className="p-4">অর্ডারের আইটেমসমূহ</th>
                    <th className="p-4">মোট বিল</th>
                    <th className="p-4">স্ট্যাটাস</th>
                    <th className="p-4 text-right">পদক্ষেপ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-850/50 transition">
                      <td className="p-4 font-mono font-bold text-white">{ord.orderNumber}</td>
                      <td className="p-4">
                        <div className="font-bold text-white">{ord.customerName}</div>
                        <div className="text-[11px] text-slate-400">{ord.customerPhone}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-bold uppercase text-[10px] border border-blue-800">
                          {ord.paymentMethod}
                        </span>
                        <div className="font-mono text-[11px] text-amber-300 font-semibold mt-1">
                          TrxID: {ord.transactionId || 'N/A'}
                        </div>
                        {ord.senderNumber && (
                          <div className="text-[10px] text-slate-400">প্রেরক: {ord.senderNumber}</div>
                        )}
                      </td>
                      <td className="p-4">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="text-slate-300">
                            • {it.name} ({it.billingCycle === 'yearly' ? 'বাৎসরিক' : 'মাসিক'})
                          </div>
                        ))}
                      </td>
                      <td className="p-4 font-mono font-bold text-emerald-400 text-sm">
                        ৳{ord.total.toLocaleString('bn-BD')}
                      </td>
                      <td className="p-4">
                        {ord.status === 'active' || ord.status === 'completed' ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                            সক্রিয় (Active)
                          </span>
                        ) : ord.status === 'cancelled' ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold">
                            বাতিল (Rejected)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold animate-pulse">
                            যাচাই অপেক্ষমান
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {ord.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => approvePaymentAndOrder(ord.id)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md shadow-emerald-600/20"
                            >
                              অ্যাপ্রুভ ও সার্ভিস চালু
                            </button>
                            <button
                              onClick={() => rejectOrder(ord.id)}
                              className="px-2.5 py-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 text-xs transition"
                            >
                              রিজেক্ট
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500">কার্যক্রম সম্পন্ন</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: TLD Pricing Editor */}
        {activeAdminTab === 'pricing' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-400" />
                <span>ডোমেইন মূল্য তালিকা (TLD Pricing Manager)</span>
              </h3>
              <p className="text-xs text-slate-400">
                এখানে ডোমেইন রেজিস্ট্রেশন, নবায়ন ও ট্রান্সফার মূল্য লাইভ আপডেট করতে পারবেন।
              </p>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/80 shadow-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-4">TLD এক্সটেনশন</th>
                    <th className="p-4">রেজিস্ট্রেশন ফি</th>
                    <th className="p-4">হোস্টিং বান্ডেল ডিসকাউন্ট</th>
                    <th className="p-4">নবায়ন ফি (Renewal)</th>
                    <th className="p-4">পদক্ষেপ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {domainPrices.map((tld) => {
                    const isEditing = editingTldId === tld.id;

                    return (
                      <tr key={tld.id} className="hover:bg-slate-850/50 transition">
                        <td className="p-4 font-mono font-bold text-white text-sm">{tld.tld}</td>
                        <td className="p-4 font-mono">৳{tld.registrationPrice}</td>
                        <td className="p-4 font-mono text-emerald-400 font-bold">
                          ৳{tld.hostingBundlePrice} (হোস্টিংয়ের সাথে)
                        </td>
                        <td className="p-4 font-mono">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editPriceVal}
                              onChange={(e) => setEditPriceVal(Number(e.target.value))}
                              className="w-24 bg-slate-950 border border-amber-500 rounded p-1 text-white text-xs font-mono"
                            />
                          ) : (
                            `৳${tld.renewalPrice}`
                          )}
                        </td>
                        <td className="p-4">
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  updateDomainPrice(tld.id, { renewalPrice: editPriceVal });
                                  setEditingTldId(null);
                                }}
                                className="px-2 py-1 rounded bg-emerald-600 text-white text-[11px] font-bold"
                              >
                                সংরক্ষণ
                              </button>
                              <button
                                onClick={() => setEditingTldId(null)}
                                className="px-2 py-1 rounded bg-slate-800 text-slate-400 text-[11px]"
                              >
                                বাতিল
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingTldId(tld.id);
                                setEditPriceVal(tld.renewalPrice);
                              }}
                              className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition flex items-center gap-1"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>মূল্য পরিবর্তন</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 6: Support Tickets */}
        {activeAdminTab === 'tickets' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-3">
              <h3 className="text-base font-bold text-white">টিকেট তালিকা</h3>
              <div className="space-y-2">
                {tickets.map((tkt) => (
                  <button
                    key={tkt.id}
                    onClick={() => setSelectedTicket(tkt)}
                    className={`w-full text-left p-4 rounded-2xl border transition ${
                      selectedTicket?.id === tkt.id
                        ? 'bg-blue-950/40 border-blue-500 text-white'
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
                    <p className="text-xs text-slate-400 mt-1">{tkt.customerName}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              {selectedTicket ? (
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                  <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs text-slate-400">{selectedTicket.ticketNumber}</span>
                      <h3 className="text-lg font-bold text-white mt-0.5">{selectedTicket.subject}</h3>
                      <p className="text-xs text-slate-400">গ্রাহক: {selectedTicket.customerName}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                      {selectedTicket.status}
                    </span>
                  </div>

                  <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {selectedTicket.messages.map((m) => (
                      <div
                        key={m.id}
                        className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                          m.sender === 'admin'
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

                  <form onSubmit={handleAdminTicketReply} className="pt-2 border-t border-slate-800 space-y-2">
                    <textarea
                      rows={3}
                      placeholder="অ্যাডমিন হিসেবে উত্তর লিখুন..."
                      value={adminReplyText}
                      onChange={(e) => setAdminReplyText(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    ></textarea>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>উত্তর পাঠান</span>
                    </button>
                  </form>
                </div>
              ) : (
                <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 text-slate-400">
                  <LifeBuoy className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                  <p className="text-sm">একটি টিকেট নির্বাচন করুন</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal: Notification Preview (Email / WhatsApp) */}
        {notificationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  {notificationModal.channel === 'whatsapp' ? (
                    <MessageSquare className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Mail className="w-5 h-5 text-blue-400" />
                  )}
                  <h3 className="font-bold text-white text-base">
                    {notificationModal.channel === 'whatsapp' ? 'WhatsApp রিমাইন্ডার মেসেজ' : 'ইমেইল রিমাইন্ডার নোটিফিকেশন'}
                  </h3>
                </div>
                <button
                  onClick={() => setNotificationModal(null)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>প্রাপক (Recipient):</span>
                    <span className="text-white font-bold">{notificationModal.clientName}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>যোগাযোগ:</span>
                    <span className="text-slate-200 font-mono">
                      {notificationModal.channel === 'whatsapp' ? `+${notificationModal.clientPhone}` : notificationModal.clientEmail}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>সার্ভিস:</span>
                    <span className="text-amber-300 font-semibold">{notificationModal.serviceName}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>মেয়াদ শেষ:</span>
                    <span className="text-rose-400 font-semibold">{notificationModal.expiryDate}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>নবায়ন ফি:</span>
                    <span className="text-emerald-400 font-bold">৳{notificationModal.renewalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">মেসেজের প্রিভিউ:</label>
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 leading-relaxed font-sans text-xs">
                    {notificationModal.messageText}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleConfirmSendNotification}
                  className={`flex-1 py-3 rounded-2xl font-bold text-xs transition shadow-lg flex items-center justify-center gap-2 ${
                    notificationModal.channel === 'whatsapp'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {notificationModal.channel === 'whatsapp' ? 'WhatsApp ওপেন ও সেন্ড করুন' : 'ইমেইল সেন্ড করুন'}
                  </span>
                </button>
                <button
                  onClick={() => setNotificationModal(null)}
                  className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  বাতিল
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Manual Wallet Adjustment */}
        {manualWalletModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-white text-base">
                    {manualWalletModal.type === 'credit' ? 'ওয়ালেটে ব্যালেন্স জমা (Credit)' : 'ওয়ালেট থেকে ব্যালেন্স কর্তন (Debit)'}
                  </h3>
                </div>
                <button
                  onClick={() => setManualWalletModal(null)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>ক্লায়েন্ট:</span>
                  <span className="text-white font-bold">{manualWalletModal.userName}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>বর্তমান ব্যালেন্স:</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    ৳{manualWalletModal.currentBalance.toLocaleString('bn-BD')}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSaveManualWallet} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">টাকার পরিমাণ (৳ BDT)</label>
                  <input
                    type="number"
                    value={manualWalletModal.amount}
                    onChange={(e) => setManualWalletModal({ ...manualWalletModal, amount: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">কারণ বা রেফারেন্স নোট</label>
                  <input
                    type="text"
                    value={manualWalletModal.note}
                    onChange={(e) => setManualWalletModal({ ...manualWalletModal, note: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                    placeholder="যেমন: বিকাশ ক্যাশ ডিপোজিট বা ডোমেইন রিফান্ড"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition"
                  >
                    ব্যালেন্স আপডেট করুন
                  </button>
                  <button
                    type="button"
                    onClick={() => setManualWalletModal(null)}
                    className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
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
