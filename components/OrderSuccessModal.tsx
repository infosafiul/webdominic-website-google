'use client';

import React from 'react';
import { CheckCircle2, ArrowRight, Receipt, FileText, Globe } from 'lucide-react';
import { useApp } from '@/lib/context';

interface OrderSuccessModalProps {
  orderId: string | null;
  invoiceId: string | null;
  onClose: () => void;
}

export default function OrderSuccessModal({ orderId, invoiceId, onClose }: OrderSuccessModalProps) {
  const { orders, setActiveTab } = useApp();

  if (!orderId) return null;

  const order = orders.find(o => o.id === orderId);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xl">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div>
          <h3 className="text-xl font-black text-white">অর্ডার সফলভাবে গৃহীত হয়েছে!</h3>
          <p className="text-xs text-slate-300 mt-1">
            আপনার ডোমেইন ও হোস্টিং অর্ডার আইডি: <strong className="text-blue-400 font-mono">{order?.orderNumber || orderId}</strong>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-left space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">পেমেন্ট মাধ্যম:</span>
            <span className="font-bold text-white uppercase">{order?.paymentMethod}</span>
          </div>
          {order?.transactionId && (
            <div className="flex justify-between">
              <span className="text-slate-400">TrxID:</span>
              <span className="font-mono text-amber-400 font-bold">{order.transactionId}</span>
            </div>
          )}
          <div className="flex justify-between pt-1 border-t border-slate-800">
            <span className="text-slate-400">মোট পরিশোধিত:</span>
            <span className="font-bold text-emerald-400">৳{order?.total.toLocaleString('bn-BD')} BDT</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          আপনার ইনভয়েস প্রস্তুত হয়েছে। অ্যাডমিন দ্বারা ট্রানজেকশন যাচাই শেষে সার্ভিসটি সম্পূর্ণ সক্রিয় করা হবে। আপনি আপনার ইউজার ড্যাশবোর্ডে ডোমেইনের স্থিতি দেখতে পারবেন।
        </p>

        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={() => {
              onClose();
              setActiveTab('user_panel');
            }}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
          >
            <span>আমার ইউজার ড্যাশবোর্ডে যান</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            হোমপেজে ফিরে যান
          </button>
        </div>
      </div>
    </div>
  );
}
