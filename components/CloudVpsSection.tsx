'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context';
import { Cpu, Server, Check, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export default function CloudVpsSection() {
  const { products, locations, addToCart, setIsCartOpen } = useApp();
  const [selectedLocation, setSelectedLocation] = useState(locations[0].id);

  const vpsProducts = products.filter(p => p.category === 'vps');

  const handleOrderVps = (vps: any) => {
    const loc = locations.find(l => l.id === selectedLocation) || locations[0];
    const bdtPrice = Math.round(vps.monthlyPrice * 120);

    addToCart({
      type: 'vps',
      name: `${vps.name} (${loc.city}, ${loc.country})`,
      billingCycle: 'monthly',
      price: bdtPrice,
      currency: 'BDT',
      productId: vps.id,
      details: {
        cpu: vps.features[0],
        ram: vps.features[1],
        storage: vps.features[2],
      },
    });

    setIsCartOpen(true);
  };

  return (
    <section className="py-16 sm:py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span>হাই-স্পিড ক্লাউড ইনফ্রাস্ট্রাকচার ও রুট এক্সেস</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            ডেডিকেটেড রিসোর্স সমৃদ্ধ{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              ক্লাউড VPS সার্ভার
            </span>
          </h2>

          <p className="text-sm text-slate-300">
            সম্পূর্ণ রুট এক্সেস, ডেডিকেটেড IPv4, NVMe স্টোরেজ এবং পছন্দসই গ্লোবাল ডাটা সেন্টার লোকেশন।
          </p>

          {/* Location Picker */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>ডাটা সেন্টার লোকেশন:</span>
            </span>
            {locations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelectedLocation(loc.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                  selectedLocation === loc.id
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>{loc.flag}</span>
                <span>{loc.city}</span>
              </button>
            ))}
          </div>
        </div>

        {/* VPS Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vpsProducts.map((vps) => {
            const bdtPrice = Math.round(vps.monthlyPrice * 120);

            return (
              <div
                key={vps.id}
                className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div>
                  {vps.badge && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 mb-2">
                      {vps.badge}
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-white">{vps.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{vps.shortDescription}</p>

                  <div className="mt-4 pb-4 border-b border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">
                        ${vps.monthlyPrice}
                      </span>
                      <span className="text-xs text-slate-400">/মাস</span>
                    </div>
                    <p className="text-[11px] text-cyan-400 mt-1">
                      ≈ ৳{bdtPrice.toLocaleString('bn-BD')} BDT (বিকাশে পরিশোধযোগ্য)
                    </p>
                  </div>

                  <div className="mt-4 space-y-2">
                    {vps.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4">
                  <button
                    onClick={() => handleOrderVps(vps)}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-700 hover:border-cyan-500"
                  >
                    <span>সার্ভার অর্ডার করুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
