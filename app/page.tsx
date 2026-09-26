'use client';

import React, { useState } from 'react';
import { AppProvider, useApp } from '@/lib/context';
import Navbar from '@/components/Navbar';
import HeroDomainSearch from '@/components/HeroDomainSearch';
import HostingCatalog from '@/components/HostingCatalog';
import CustomHostingBuilder from '@/components/CustomHostingBuilder';
import CloudVpsSection from '@/components/CloudVpsSection';
import AiSolutionsSection from '@/components/AiSolutionsSection';
import WhyChooseUsAndStats from '@/components/WhyChooseUsAndStats';
import PricingView from '@/components/PricingView';
import UserDashboard from '@/components/UserDashboard';
import AdminDashboard from '@/components/AdminDashboard';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import OrderSuccessModal from '@/components/OrderSuccessModal';
import Footer from '@/components/Footer';

function MainAppContent() {
  const { activeTab, setActiveTab, language } = useApp();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [successOrder, setSuccessOrder] = useState<{ orderId: string; invoiceId: string } | null>(null);

  const handleCheckoutSuccess = (orderId: string, invoiceId: string) => {
    setSuccessOrder({ orderId, invoiceId });
  };

  return (
    <div className="min-h-screen bg-[#040e21] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Global Brand Navbar with Mega Navigation */}
      <Navbar />

      {/* Main Dynamic View */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <HeroDomainSearch />
            <HostingCatalog />
            <CloudVpsSection />
            <AiSolutionsSection />
            <WhyChooseUsAndStats />
          </>
        )}

        {activeTab === 'domains' && (
          <div>
            <HeroDomainSearch />
            <PricingView />
          </div>
        )}

        {activeTab === 'hosting' && (
          <div>
            <HostingCatalog />
            <CustomHostingBuilder />
          </div>
        )}

        {activeTab === 'custom_hosting' && (
          <div className="py-6">
            <CustomHostingBuilder />
          </div>
        )}

        {activeTab === 'vps' && (
          <div className="py-6">
            <CloudVpsSection />
            <WhyChooseUsAndStats />
          </div>
        )}

        {activeTab === 'reseller' && (
          <div className="py-6">
            <HostingCatalog />
          </div>
        )}

        {activeTab === 'ai_solutions' && (
          <div>
            <AiSolutionsSection />
            <WhyChooseUsAndStats />
          </div>
        )}

        {activeTab === 'websites' && (
          <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                {language === 'bn' ? 'ওয়েবসাইট সলিউশন' : 'WEBSITE SERVICES'}
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
                {language === 'bn' ? 'আধুনিক ও রেসপনসিভ ওয়েবসাইট ডেভেলপমেন্ট' : 'Modern & Responsive Web Development'}
              </h1>
              <p className="text-sm text-slate-300">
                {language === 'bn'
                  ? 'ওয়ার্ডপ্রেস, উকমার্স, কাস্টম লারাভেল ও নেক্সট-জেএস ওয়েব অ্যাপ্লিকেশন ডিজাইন ও পরিচালনা।'
                  : 'WordPress, WooCommerce, custom React/Next.js and business web application development.'}
              </p>
            </div>
            <HostingCatalog />
          </div>
        )}

        {activeTab === 'business_email' && (
          <div className="py-8">
            <AiSolutionsSection />
          </div>
        )}

        {activeTab === 'security' && (
          <div className="py-8">
            <WhyChooseUsAndStats />
          </div>
        )}

        {activeTab === 'pricing' && <PricingView />}

        {activeTab === 'user_panel' && <UserDashboard />}

        {activeTab === 'admin_panel' && <AdminDashboard />}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Slide-over Cart */}
      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />

      {/* Multi-Payment Gateway Checkout Modal (bKash, Nagad, Rocket, Wallet) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
      />

      {/* Order Success Confirmation Modal with Invoice details */}
      <OrderSuccessModal
        orderId={successOrder?.orderId || null}
        invoiceId={successOrder?.invoiceId || null}
        onClose={() => setSuccessOrder(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
