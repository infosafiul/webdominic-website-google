'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context';
import {
  X,
  CheckCircle2,
  Copy,
  CreditCard,
  Wallet,
  ArrowRight,
  ShieldCheck,
  Globe,
  Info,
  ExternalLink,
  Receipt,
  FileCheck
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (orderId: string, invoiceId: string) => void;
}

export default function CheckoutModal({ isOpen, onClose, onSuccess }: CheckoutModalProps) {
  const { cart, cartTotal, currentUser, processCheckout, siteSettings } = useApp();

  const [customerName, setCustomerName] = useState(currentUser.fullName || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser.email || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone || '+88-01711223344');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'bank' | 'wallet'>('bkash');
  const [transactionId, setTransactionId] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [ns1, setNs1] = useState('ns1.wdhdomain.com');
  const [ns2, setNs2] = useState('ns2.wdhdomain.com');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);

  if (!isOpen) return null;

  const hasDomains = cart.some(c => c.type === 'domain');

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod !== 'wallet' && !transactionId.trim()) {
      alert('অনুগ্রহ করে পেমেন্ট করার পর প্রাপ্ত ট্রানজেকশন আইডি (TrxID) প্রদান করুন।');
      return;
    }

    if (paymentMethod === 'wallet' && currentUser.accountBalance < cartTotal) {
      alert(`আপনার একাউন্টে পর্যাপ্ত ব্যালেন্স নেই। বর্তমান ব্যালেন্স: ৳${currentUser.accountBalance}, প্রয়োজন: ৳${cartTotal}`);
      return;
    }

    setIsProcessing(true);
    try {
      const res = await processCheckout({
        customerName,
        customerEmail,
        customerPhone,
        method: paymentMethod,
        transactionId: transactionId.trim(),
        senderNumber: senderNumber.trim(),
        customNameservers: hasDomains ? [ns1, ns2] : undefined,
      });

      onClose();
      onSuccess(res.orderId, res.invoiceId);
    } catch (err: any) {
      alert(`অর্ডার প্রসেস করতে ব্যর্থ হয়েছে: ${err?.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white">চেকআউট ও পেমেন্ট নিশ্চিতকরণ</h3>
              <p className="text-xs text-slate-400">ডোমেইন ও হোস্টিং অর্ডার সম্পন্ন করতে তথ্য পূরণ করুন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Order Summary Strip */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              অর্ডারের সংক্ষিপ্ত বিবরণ ({cart.length} টি আইটেম):
            </h4>
            <div className="space-y-1.5 text-xs text-slate-300">
              {cart.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="truncate mr-2 font-medium">• {item.name}</span>
                  <span className="font-bold text-white shrink-0">৳{item.price.toLocaleString('bn-BD')}</span>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-slate-800 flex items-center justify-between font-bold text-sm sm:text-base text-white">
                <span>মোট প্রদেয় বিল</span>
                <span className="text-blue-400 font-black text-lg">৳{cartTotal.toLocaleString('bn-BD')} BDT</span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              গ্রাহকের তথ্য (Customer Details):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">পুরো নাম *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="আপনার নাম"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">ইমেইল ঠিকানা *</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1 font-medium">মোবাইল নম্বর (যোগাযোগের জন্য) *</label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Optional Nameservers for Domains */}
          {hasDomains && (
            <div className="p-3.5 rounded-2xl bg-blue-950/20 border border-blue-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
                <Globe className="w-4 h-4 text-blue-400" />
                <span>ডোমেইন নেমসার্ভার কনফিগারেশন (Nameservers):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-slate-400 text-[11px] mb-0.5">Nameserver 1</label>
                  <input
                    type="text"
                    value={ns1}
                    onChange={(e) => setNs1(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[11px] mb-0.5">Nameserver 2</label>
                  <input
                    type="text"
                    value={ns2}
                    onChange={(e) => setNs2(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono text-[11px]"
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-400">
                ডিফল্ট ডিরেক্ট নেমসার্ভার নির্বাচন করা আছে। যেকোনো সময় পরিবর্তন করা যাবে।
              </p>
            </div>
          )}

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              পেমেন্ট মাধ্যম বেছে নিন (Payment Gateway):
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* bKash */}
              <button
                type="button"
                onClick={() => setPaymentMethod('bkash')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                  paymentMethod === 'bkash'
                    ? 'border-[#E2136E] bg-[#E2136E]/15 text-white shadow-lg shadow-[#E2136E]/20'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#E2136E] flex items-center justify-center text-white font-bold text-xs shadow">
                  বিকাশ
                </div>
                <span className="text-xs font-bold mt-1">bKash</span>
                <span className="text-[10px] text-[#E2136E] font-medium">সবচেয়ে জনপ্রিয়</span>
              </button>

              {/* Nagad */}
              <button
                type="button"
                onClick={() => setPaymentMethod('nagad')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                  paymentMethod === 'nagad'
                    ? 'border-[#F7931E] bg-[#F7931E]/15 text-white shadow-lg shadow-[#F7931E]/20'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#F7931E] flex items-center justify-center text-white font-bold text-xs shadow">
                  নগদ
                </div>
                <span className="text-xs font-bold mt-1">Nagad</span>
                <span className="text-[10px] text-[#F7931E] font-medium">ইনস্ট্যান্ট</span>
              </button>

              {/* Rocket */}
              <button
                type="button"
                onClick={() => setPaymentMethod('rocket')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                  paymentMethod === 'rocket'
                    ? 'border-[#8C3494] bg-[#8C3494]/15 text-white shadow-lg shadow-[#8C3494]/20'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#8C3494] flex items-center justify-center text-white font-bold text-xs shadow">
                  রকেট
                </div>
                <span className="text-xs font-bold mt-1">Rocket</span>
                <span className="text-[10px] text-[#8C3494] font-medium">ডিবিবিএল</span>
              </button>

              {/* Wallet Balance */}
              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                  paymentMethod === 'wallet'
                    ? 'border-emerald-500 bg-emerald-500/15 text-white shadow-lg shadow-emerald-500/20'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow">
                  <Wallet className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold mt-1">ওয়ালেট</span>
                <span className="text-[10px] text-emerald-400 font-medium">৳{currentUser.accountBalance}</span>
              </button>
            </div>

            {/* bKash Payment Instructions Guide */}
            {paymentMethod === 'bkash' && (
              <div className="p-4 rounded-2xl bg-[#E2136E]/10 border border-[#E2136E]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#E2136E]">
                    <span className="w-2 h-2 rounded-full bg-[#E2136E] animate-ping"></span>
                    <span>বিকাশ পেমেন্ট / সেন্ড মানি নির্দেশিকা:</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-[#E2136E]/20 text-white font-medium">
                    ব্যক্তিগত / মার্চেন্ট
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-[#E2136E]/20 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">বিকাশ প্রাপক নম্বর:</span>
                    <span className="font-mono text-base font-black text-white tracking-wider">
                      {siteSettings.bkashPersonalNumber}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyNumber(siteSettings.bkashPersonalNumber)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition"
                  >
                    <Copy className="w-3 h-3 text-[#E2136E]" />
                    <span>{copiedNumber ? 'কপি হয়েছে' : 'নম্বর কপি'}</span>
                  </button>
                </div>

                <ol className="text-xs text-slate-300 space-y-1 list-decimal list-inside leading-relaxed">
                  <li>আপনার বিকাশ অ্যাপে যান অথবা *247# ডায়াল করুন</li>
                  <li><strong>Send Money / Payment</strong> অপশন সিলেক্ট করুন</li>
                  <li>নম্বর দিন: <strong className="text-white font-mono">{siteSettings.bkashPersonalNumber}</strong></li>
                  <li>টাকার পরিমাণ লিখুন: <strong className="text-white">৳{cartTotal.toLocaleString('bn-BD')} BDT</strong></li>
                  <li>লেনদেন সফল হলে ফিরতি এসএমএস থেকে <strong>Transaction ID (TrxID)</strong> কপি করে নিচের বক্সে দিন</li>
                </ol>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-slate-300 text-xs mb-1 font-semibold">
                      বিকাশ TrxID (Transaction ID) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: BK9A7B39XQ"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full bg-slate-950 border border-[#E2136E]/50 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-[#E2136E]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-xs mb-1 font-semibold">
                      যে নম্বর থেকে পাঠিয়েছেন *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: 017XXXXXXXX"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Nagad / Rocket Instructions */}
            {(paymentMethod === 'nagad' || paymentMethod === 'rocket') && (
              <div className="p-4 rounded-2xl bg-orange-950/20 border border-orange-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-orange-400">
                  <span>{paymentMethod === 'nagad' ? 'নগদ' : 'রকেট'} পেমেন্ট নির্দেশিকা</span>
                  <span>নম্বর: {siteSettings.supportPhone}</span>
                </div>
                <p className="text-xs text-slate-300">
                  প্রদত্ত নম্বরে ৳{cartTotal.toLocaleString('bn-BD')} টাকা পাঠিয়ে TrxID নিচে লিখুন।
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 text-xs mb-1 font-semibold">TrxID *</label>
                    <input
                      type="text"
                      required
                      placeholder="Transaction ID"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full bg-slate-950 border border-orange-500/50 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-xs mb-1 font-semibold">প্রেরকের নম্বর *</label>
                    <input
                      type="text"
                      required
                      placeholder="01XXXXXXXXX"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Wallet Pay */}
            {paymentMethod === 'wallet' && (
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                  <span>অ্যাকাউন্ট ওয়ালেট ব্যালেন্স</span>
                  <span>বর্তমান ব্যালেন্স: ৳{currentUser.accountBalance}</span>
                </div>
                <p className="text-xs text-slate-300">
                  ওয়ালেট ব্যালেন্স থেকে ৳{cartTotal.toLocaleString('bn-BD')} সরাসরি কেটে নেওয়া হবে এবং কোনো যাচাইয়ের অপেক্ষা ছাড়াই ডোমেইন/হোস্টিং ইনস্ট্যান্ট অ্যাক্টিভেশন হবে।
                </p>
              </div>
            )}
          </div>

          {/* Action Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-base shadow-xl shadow-blue-600/30 transition transform active:scale-98 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span>অর্ডার প্রক্রিয়াকরণ হচ্ছে...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>পেমেন্ট নিশ্চিত করুন ও অর্ডার সম্পন্ন করুন (৳{cartTotal.toLocaleString('bn-BD')})</span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2">
              অর্ডার সম্পন্ন করার সাথে সাথে একটি অফিসিয়াল ইনভয়েস তৈরি হবে।
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
