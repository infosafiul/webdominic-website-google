'use client';

import React from 'react';
import { useApp } from '@/lib/context';
import {
  X,
  Trash2,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  Globe,
  HardDrive,
  CreditCard,
  CheckCircle2
} from 'lucide-react';

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export default function CartDrawer({ onOpenCheckout }: CartDrawerProps) {
  const { cart, removeFromCart, clearCart, cartTotal, isCartOpen, setIsCartOpen } = useApp();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Cart Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">আপনার শপিং কার্ট</h3>
              <p className="text-xs text-slate-400">{cart.length} টি আইটেম যোগ করা হয়েছে</p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mb-3">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-white text-base">আপনার কার্ট খালি আছে</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                ডোমেইন সার্চ করুন অথবা হোস্টিং প্যাকেজ থেকে আপনার পছন্দের প্যাকেজ বেছে নিন।
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow"
              >
                ডোমেইন বা হোস্টিং ব্রাউজ করুন
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3 group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-800 text-blue-400 mt-0.5 shrink-0">
                    {item.type === 'domain' ? (
                      <Globe className="w-4 h-4" />
                    ) : (
                      <HardDrive className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-white">{item.name}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>বিলিং: {item.billingCycle === 'yearly' ? '১ বছর' : '১ মাস'}</span>
                      {item.domainName && <span>• {item.domainName}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="font-black text-sm text-white">
                    ৳{item.price.toLocaleString('bn-BD')}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 transition"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>সাবটোটাল</span>
                <span className="font-semibold text-slate-200">৳{cartTotal.toLocaleString('bn-BD')}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>ভ্যাট / ট্যাক্স (০%)</span>
                <span className="font-semibold text-emerald-400">৳০</span>
              </div>
              <div className="flex items-center justify-between text-sm sm:text-base font-bold text-white pt-2 border-t border-slate-800">
                <span>সর্বমোট প্রদেয়</span>
                <span className="text-blue-400 text-lg sm:text-xl font-black">
                  ৳{cartTotal.toLocaleString('bn-BD')}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onOpenCheckout();
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition flex items-center justify-center gap-2"
              >
                <span>চেকআউট ও পেমেন্ট করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={clearCart}
                className="w-full py-2 text-center text-xs text-slate-500 hover:text-slate-300 transition"
              >
                কার্ট পরিষ্কার করুন
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>বিকাশ, নগদ, রকেট এবং ব্যাংক পেমেন্ট সাপোর্ট</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
