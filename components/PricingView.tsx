'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context';
import { Search, ShoppingCart, Globe, CheckCircle2, ArrowRight } from 'lucide-react';

export default function PricingView() {
  const { domainPrices, addToCart, setIsCartOpen } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'সকল এক্সটেনশন' },
    { id: 'popular', label: 'জনপ্রিয়' },
    { id: 'technology', label: 'টেকনোলজি' },
    { id: 'ecommerce', label: 'ই-কমার্স' },
    { id: 'country', label: 'কান্ট্রি TLD' },
  ];

  const filtered = domainPrices.filter(p => {
    const matchSearch = p.tld.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'all' ? true : p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleBuy = (tld: string, price: number) => {
    addToCart({
      type: 'domain',
      name: `ডোমেইন রেজিস্ট্রেশন (${tld})`,
      domainName: `mybrand${tld}`,
      billingCycle: 'yearly',
      price,
      currency: 'BDT',
    });
    setIsCartOpen(true);
  };

  return (
    <div className="py-12 bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            সকল ডোমেইন এক্সটেনশনের{' '}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
              অফিশিয়াল মূল্য তালিকা
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            স্বচ্ছ মূল্যনীতি — কোনো গোপন চার্জ নেই। ফ্রি DNS ও ২৪/৭ সাপোর্ট অন্তর্ভুক্ত।
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition ${
                  selectedCategory === c.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder=".com, .xyz, tech..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4">TLD</th>
                <th className="p-4">বিবরণ</th>
                <th className="p-4">১ বছর রেজিস্ট্রেশন</th>
                <th className="p-4">রিনিউয়াল ফি</th>
                <th className="p-4">হোস্টিং বান্ডেল ডিসকাউন্ট</th>
                <th className="p-4 text-right">পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-850/50 transition">
                  <td className="p-4 font-mono font-black text-white text-base">
                    {item.tld}
                  </td>
                  <td className="p-4 text-slate-300 font-medium">
                    {item.description}
                  </td>
                  <td className="p-4 font-black text-white text-sm">
                    ৳{item.registrationPrice.toLocaleString('bn-BD')}
                  </td>
                  <td className="p-4 text-slate-300">
                    ৳{item.renewalPrice.toLocaleString('bn-BD')}
                  </td>
                  <td className="p-4">
                    {item.hostingBundlePrice ? (
                      <span className="text-emerald-400 font-semibold">
                        ৳{item.hostingBundlePrice.toLocaleString('bn-BD')} (সাশ্রয়ী)
                      </span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleBuy(item.tld, item.registrationPrice)}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition"
                    >
                      অর্ডার করুন
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
