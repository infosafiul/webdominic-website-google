'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DomainPrice,
  HostingProduct,
  ServerLocation,
  CartItem,
  Order,
  Invoice,
  CustomerDomain,
  CustomerService,
  SupportTicket,
  UserProfile,
  CustomHostingRequest,
  WalletTransaction
} from './types';
import {
  INITIAL_DOMAIN_PRICES,
  INITIAL_PRODUCTS,
  INITIAL_LOCATIONS,
  INITIAL_USERS,
  INITIAL_DOMAINS,
  INITIAL_SERVICES,
  INITIAL_INVOICES,
  INITIAL_ORDERS,
  INITIAL_TICKETS,
  INITIAL_SITE_SETTINGS,
  INITIAL_WALLET_TRANSACTIONS
} from './initial-data';

export type NavTabType =
  | 'home'
  | 'domains'
  | 'hosting'
  | 'vps'
  | 'reseller'
  | 'custom_hosting'
  | 'websites'
  | 'ai_solutions'
  | 'business_email'
  | 'security'
  | 'pricing'
  | 'cart'
  | 'user_panel'
  | 'admin_panel';

interface AppContextType {
  // Localization & Currency
  language: 'bn' | 'en';
  setLanguage: (lang: 'bn' | 'en') => void;
  currency: 'BDT' | 'USD';
  setCurrency: (curr: 'BDT' | 'USD') => void;
  formatPrice: (amountInBDT: number) => string;

  // Current session & role
  currentUser: UserProfile;
  switchUser: (role: 'client' | 'admin' | 'guest' | 'rahim' | number) => void;
  users: UserProfile[];

  // Data
  domainPrices: DomainPrice[];
  products: HostingProduct[];
  locations: ServerLocation[];
  orders: Order[];
  invoices: Invoice[];
  domains: CustomerDomain[];
  services: CustomerService[];
  tickets: SupportTicket[];
  customHostingRequests: CustomHostingRequest[];
  siteSettings: typeof INITIAL_SITE_SETTINGS;
  walletTransactions: WalletTransaction[];

  // Wallet & Balance Operations
  topUpWallet: (amount: number, method: string, trxId?: string, senderNumber?: string) => Promise<boolean>;
  payFromWallet: (invoiceId: string) => Promise<{ success: boolean; message: string }>;
  autoRenewServiceFromWallet: (serviceType: 'domain' | 'service', itemId: string) => Promise<{ success: boolean; message: string }>;
  toggleAutoRenewFromWallet: (serviceType: 'domain' | 'service', itemId: string) => void;
  adminAdjustWalletBalance: (userId: number, amount: number, note: string) => void;

  // Recurring Billing & Expiry Monitoring
  generateRecurringBill: (itemType: 'domain' | 'service', itemId: string) => Invoice;
  generateAllMonthlyRecurringBills: (targetMonthYear: string) => number;
  sendExpiryNotification: (itemType: 'domain' | 'service', itemId: string, channel: 'email' | 'whatsapp' | 'sms') => { success: boolean; message: string; channelUrl?: string };

  // Cart
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartTotal: number;

  // Domain search & availability
  checkDomainAvailability: (name: string) => { domain: string; available: boolean; price: number; tld: string }[];

  // Checkout & Ordering
  processCheckout: (paymentDetails: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    method: 'bkash' | 'nagad' | 'rocket' | 'bank' | 'wallet';
    transactionId?: string;
    senderNumber?: string;
    customNameservers?: string[];
  }) => Promise<{ success: boolean; orderId: string; invoiceId: string }>;

  // Custom Hosting Request
  submitCustomHostingRequest: (data: {
    domainName?: string;
    requestedStorageGb: number;
    requestedTransferGb?: number;
    bandwidthMode: 'standard' | 'high' | 'fair';
    requestedWebsites: number;
    requestedMailboxes?: number;
    controlPanel: 'cPanel' | 'AAA Hosting';
    managementType: 'managed' | 'fully_managed' | 'unmanaged';
    billingCycle: 'monthly' | 'yearly';
    budgetAmount?: number;
    budgetCurrency: 'BDT' | 'USD';
    requirements: string;
  }) => Promise<string>;

  // Domain Actions
  updateNameservers: (domainId: string, nameservers: string[]) => void;
  toggleDomainLock: (domainId: string) => void;
  toggleDomainAutoRenew: (domainId: string) => void;
  renewDomain: (domainId: string, years?: number) => void;

  // Invoicing & Payments
  payInvoice: (invoiceId: string, method: string, transactionId?: string) => Promise<boolean>;
  sendCustomBill: (billData: {
    userId: number;
    title: string;
    items: { description: string; amount: number }[];
    dueDate: string;
    currency?: 'BDT' | 'USD';
  }) => void;

  // Admin Actions
  approvePaymentAndOrder: (orderId: string) => void;
  rejectOrder: (orderId: string) => void;
  updateDomainPrice: (id: number, newPrice: Partial<DomainPrice>) => void;
  addTicketReply: (ticketId: string, message: string, sender: 'customer' | 'admin') => void;
  createSupportTicket: (ticket: { subject: string; category: SupportTicket['category']; priority: SupportTicket['priority']; message: string }) => void;
  
  // Navigation / Modal helpers
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<UserProfile[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('wdh_users');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_USERS;
  });
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[1]); // Default to Client Kamrul Hasan
  const [domainPrices, setDomainPrices] = useState<DomainPrice[]>(INITIAL_DOMAIN_PRICES);
  const [products] = useState<HostingProduct[]>(INITIAL_PRODUCTS);
  const [locations] = useState<ServerLocation[]>(INITIAL_LOCATIONS);
  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('wdh_orders');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_ORDERS;
  });
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('wdh_invoices');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_INVOICES;
  });
  const [domains, setDomains] = useState<CustomerDomain[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('wdh_domains');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_DOMAINS;
  });
  const [services, setServices] = useState<CustomerService[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('wdh_services');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_SERVICES;
  });
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('wdh_wallet_tx');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_WALLET_TRANSACTIONS;
  });
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [customHostingRequests, setCustomHostingRequests] = useState<CustomHostingRequest[]>([
    {
      id: 'chr-101',
      userId: 2,
      customerName: 'Kamrul Hasan',
      domainName: 'techbdcorp.com',
      requestedStorageGb: 120,
      requestedTransferGb: 3000,
      bandwidthMode: 'high',
      requestedWebsites: 1,
      requestedMailboxes: 25,
      controlPanel: 'cPanel',
      managementType: 'managed',
      billingCycle: 'monthly',
      budgetAmount: 4500,
      budgetCurrency: 'BDT',
      requirements: 'Need dedicated NVMe I/O performance for high-traffic WooCommerce store with redis object cache.',
      status: 'submitted',
      createdAt: '2026-09-20'
    }
  ]);
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [currency, setCurrency] = useState<'BDT' | 'USD'>('BDT');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTabType>('home');
  const [siteSettings] = useState(INITIAL_SITE_SETTINGS);

  // Helper to format price based on selected currency
  const formatPrice = (amountInBDT: number) => {
    if (currency === 'USD') {
      const usdVal = (amountInBDT / 118).toFixed(2);
      return `$${usdVal}`;
    }
    return `৳${amountInBDT.toLocaleString('en-US')}`;
  };

  const submitCustomHostingRequest = async (data: {
    domainName?: string;
    requestedStorageGb: number;
    requestedTransferGb?: number;
    bandwidthMode: 'standard' | 'high' | 'fair';
    requestedWebsites: number;
    requestedMailboxes?: number;
    controlPanel: 'cPanel' | 'AAA Hosting';
    managementType: 'managed' | 'fully_managed' | 'unmanaged';
    billingCycle: 'monthly' | 'yearly';
    budgetAmount?: number;
    budgetCurrency: 'BDT' | 'USD';
    requirements: string;
  }) => {
    const newId = `chr-${Date.now()}`;
    const newReq: CustomHostingRequest = {
      ...data,
      id: newId,
      userId: currentUser.id,
      customerName: currentUser.fullName,
      status: 'submitted',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCustomHostingRequests(prev => [newReq, ...prev]);
    return newId;
  };

  // Save changes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('wdh_orders', JSON.stringify(orders));
      localStorage.setItem('wdh_invoices', JSON.stringify(invoices));
      localStorage.setItem('wdh_domains', JSON.stringify(domains));
      localStorage.setItem('wdh_services', JSON.stringify(services));
      localStorage.setItem('wdh_users', JSON.stringify(users));
      localStorage.setItem('wdh_wallet_tx', JSON.stringify(walletTransactions));
    } catch {
      // Ignore
    }
  }, [orders, invoices, domains, services, users, walletTransactions]);

  const switchUser = (roleOrId: 'client' | 'admin' | 'guest' | 'rahim' | number) => {
    if (roleOrId === 'admin' || roleOrId === 1) {
      const adm = users.find(u => u.role === 'admin') || INITIAL_USERS[0];
      setCurrentUser(adm);
      setActiveTab('admin_panel');
    } else if (roleOrId === 'rahim' || roleOrId === 3) {
      const rahim = users.find(u => u.id === 3) || INITIAL_USERS[2];
      setCurrentUser(rahim);
      setActiveTab('user_panel');
    } else if (roleOrId === 'client' || roleOrId === 2) {
      const kamrul = users.find(u => u.id === 2) || INITIAL_USERS[1];
      setCurrentUser(kamrul);
      setActiveTab('user_panel');
    } else {
      // Guest
      setCurrentUser({
        id: 99,
        fullName: 'গেস্ট ভিজিটর',
        email: 'guest@example.com',
        phone: '',
        role: 'client',
        accountBalance: 0,
      });
      setActiveTab('home');
    }
  };

  // Cart operations
  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const id = `cart-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setCart((prev) => [...prev, { ...item, id }]);
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price, 0);

  // Check Domain availability against registered list
  const checkDomainAvailability = (input: string) => {
    const cleanName = input.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    const nameWithoutExt = cleanName.includes('.') ? cleanName.split('.')[0] : cleanName;

    const registeredNames = new Set([
      'google', 'facebook', 'youtube', 'bkash', 'wdhdomain', 'apple', 'microsoft',
      ...domains.map(d => d.domainName.toLowerCase().split('.')[0])
    ]);

    const targetTlds = ['.com', '.net', '.org', '.xyz', '.shop', '.me', '.tech', '.ai', '.store', '.online'];

    return targetTlds.map((tld) => {
      const fullDomain = `${nameWithoutExt}${tld}`;
      const isTaken = registeredNames.has(nameWithoutExt) && (tld === '.com' || tld === '.net');
      const pricing = domainPrices.find(p => p.tld === tld);
      return {
        domain: fullDomain,
        available: !isTaken,
        price: pricing ? pricing.registrationPrice : 1500,
        tld,
      };
    });
  };

  // Checkout process
  const processCheckout = async (paymentDetails: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    method: 'bkash' | 'nagad' | 'rocket' | 'bank' | 'wallet';
    transactionId?: string;
    senderNumber?: string;
    customNameservers?: string[];
  }) => {
    const orderNumber = `WDH-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString().split('T')[0];

    const orderItems = cart.map((c) => ({
      id: `ord-it-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      type: c.type,
      name: c.name,
      domainName: c.domainName,
      price: c.price,
      currency: c.currency,
      billingCycle: c.billingCycle,
    }));

    const isWallet = paymentDetails.method === 'wallet';
    const isAutoPaid = isWallet && currentUser.accountBalance >= cartTotal;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      userId: currentUser.id,
      customerName: paymentDetails.customerName || currentUser.fullName,
      customerEmail: paymentDetails.customerEmail || currentUser.email,
      customerPhone: paymentDetails.customerPhone || currentUser.phone,
      total: cartTotal,
      currency: 'BDT',
      status: isAutoPaid ? 'active' : 'pending',
      fulfillmentStatus: isAutoPaid ? 'active' : 'awaiting_payment',
      paymentMethod: paymentDetails.method,
      transactionId: paymentDetails.transactionId,
      senderNumber: paymentDetails.senderNumber,
      items: orderItems,
      createdAt: new Date().toLocaleString('bn-BD'),
    };

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber,
      orderId: newOrder.id,
      userId: currentUser.id,
      customerName: paymentDetails.customerName || currentUser.fullName,
      customerEmail: paymentDetails.customerEmail || currentUser.email,
      title: `Order #${orderNumber} (${cart.map(c => c.name).join(', ')})`,
      items: cart.map(c => ({ description: `${c.name} (${c.billingCycle === 'yearly' ? '১ বছর' : '১ মাস'})`, amount: c.price })),
      subtotal: cartTotal,
      total: cartTotal,
      currency: 'BDT',
      status: isAutoPaid ? 'paid' : 'unpaid',
      dueAt: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      paidAt: isAutoPaid ? now : undefined,
      paymentMethod: paymentDetails.method === 'bkash' ? 'bKash (বিকাশ)' : paymentDetails.method,
      transactionId: paymentDetails.transactionId,
      createdAt: now,
    };

    // If paid via wallet, deduct balance
    if (isAutoPaid) {
      setCurrentUser(prev => ({ ...prev, accountBalance: prev.accountBalance - cartTotal }));
    }

    // Auto-create domain & service entities if auto-paid or when admin approves
    if (isAutoPaid) {
      cart.forEach((item) => {
        if (item.type === 'domain' && item.domainName) {
          const exp = new Date();
          exp.setFullYear(exp.getFullYear() + 1);
          const newDomain: CustomerDomain = {
            id: `dom-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            userId: currentUser.id,
            domainName: item.domainName,
            registrationDate: now,
            expiryDate: exp.toISOString().split('T')[0],
            status: 'active',
            renewalPrice: item.price,
            currency: 'BDT',
            autoRenew: true,
            domainLock: true,
            nameservers: paymentDetails.customNameservers && paymentDetails.customNameservers.length > 0
              ? paymentDetails.customNameservers
              : ['ns1.wdhdomain.com', 'ns2.wdhdomain.com'],
            registrarName: 'WDH Automated Registry',
          };
          setDomains(prev => [newDomain, ...prev]);
        } else if (item.type === 'hosting' || item.type === 'vps' || item.type === 'reseller') {
          const exp = new Date();
          if (item.billingCycle === 'yearly') exp.setFullYear(exp.getFullYear() + 1);
          else exp.setMonth(exp.getMonth() + 1);

          const newService: CustomerService = {
            id: `srv-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            userId: currentUser.id,
            productId: item.productId || 1,
            serviceName: item.name,
            serviceType: item.type.toUpperCase(),
            domainName: item.domainName || 'primary-service',
            status: 'active',
            activatedAt: now,
            expiresAt: exp.toISOString().split('T')[0],
            renewalPrice: item.price,
            currency: item.currency,
            renewalCycle: item.billingCycle,
            cpanelUrl: 'https://cpanel.wdhdomain.com',
            username: `user${Math.floor(1000 + Math.random() * 9000)}`,
          };
          setServices(prev => [newService, ...prev]);
        }
      });
    }

    setOrders((prev) => [newOrder, ...prev]);
    setInvoices((prev) => [newInvoice, ...prev]);
    clearCart();
    setIsCartOpen(false);

    return { success: true, orderId: newOrder.id, invoiceId: newInvoice.id };
  };

  // Domain management actions
  const updateNameservers = (domainId: string, nameservers: string[]) => {
    setDomains((prev) =>
      prev.map((d) => (d.id === domainId ? { ...d, nameservers } : d))
    );
  };

  const toggleDomainLock = (domainId: string) => {
    setDomains((prev) =>
      prev.map((d) => (d.id === domainId ? { ...d, domainLock: !d.domainLock } : d))
    );
  };

  const toggleDomainAutoRenew = (domainId: string) => {
    setDomains((prev) =>
      prev.map((d) => (d.id === domainId ? { ...d, autoRenew: !d.autoRenew } : d))
    );
  };

  const renewDomain = (domainId: string, years = 1) => {
    const dom = domains.find((d) => d.id === domainId);
    if (!dom) return;

    // Create an invoice for renewal
    const invNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invNumber,
      userId: dom.userId,
      customerName: currentUser.fullName,
      customerEmail: currentUser.email,
      title: `Domain Renewal - ${dom.domainName} (${years} Year)`,
      items: [{ description: `${dom.domainName} ${years} Year Renewal`, amount: dom.renewalPrice * years }],
      subtotal: dom.renewalPrice * years,
      total: dom.renewalPrice * years,
      currency: dom.currency,
      status: 'unpaid',
      dueAt: dom.expiryDate,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setInvoices(prev => [newInvoice, ...prev]);
    alert(`ডোমেইন রিনিউ এর জন্য একটি ইনভয়েস (${invNumber}) তৈরি করা হয়েছে। ইনভয়েস পেজে গিয়ে পেমেন্ট সম্পন্ন করুন।`);
  };

  // Customer pays an unpaid invoice
  const payInvoice = async (invoiceId: string, method: string, transactionId?: string) => {
    const now = new Date().toISOString().split('T')[0];
    const targetInv = invoices.find(i => i.id === invoiceId);

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              status: 'paid',
              paidAt: now,
              paymentMethod: method,
              transactionId: transactionId || `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            }
          : inv
      )
    );

    // If invoice is for domain/service renewal, extend expiry by 1 year
    if (targetInv) {
      setDomains(prev => prev.map(d => {
        if (d.userId === targetInv.userId && (d.id === targetInv.recurringItemId || d.recurringInvoiceId === invoiceId || targetInv.title.includes(d.domainName))) {
          const nextExp = new Date(d.expiryDate);
          nextExp.setFullYear(nextExp.getFullYear() + 1);
          return {
            ...d,
            expiryDate: nextExp.toISOString().split('T')[0],
            status: 'active',
            recurringBillGenerated: false
          };
        }
        return d;
      }));

      setServices(prev => prev.map(s => {
        if (s.userId === targetInv.userId && (s.id === targetInv.recurringItemId || s.recurringInvoiceId === invoiceId || targetInv.title.includes(s.domainName))) {
          const nextExp = new Date(s.expiresAt);
          if (s.renewalCycle === 'yearly') nextExp.setFullYear(nextExp.getFullYear() + 1);
          else nextExp.setMonth(nextExp.getMonth() + 1);
          return {
            ...s,
            expiresAt: nextExp.toISOString().split('T')[0],
            status: 'active',
            recurringBillGenerated: false
          };
        }
        return s;
      }));
    }

    return true;
  };

  // Wallet operations
  const topUpWallet = async (amount: number, method: string, trxId?: string, senderNumber?: string) => {
    if (amount <= 0) return false;
    const newBalance = currentUser.accountBalance + amount;

    setCurrentUser(prev => ({ ...prev, accountBalance: newBalance }));
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, accountBalance: newBalance } : u));

    const methodLabel = method === 'bkash' ? 'bKash (বিকাশ)' : method === 'nagad' ? 'Nagad (নগদ)' : method === 'rocket' ? 'Rocket (রকেট)' : method;
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      userId: currentUser.id,
      customerName: currentUser.fullName,
      type: 'topup',
      amount,
      currency: 'BDT',
      description: `ওয়ালেট ব্যালেন্স টপ-আপ (${methodLabel})${senderNumber ? ` [প্রেরক: ${senderNumber}]` : ''}`,
      paymentMethod: methodLabel,
      transactionId: trxId || `TXN${Date.now()}`,
      status: 'completed',
      balanceAfter: newBalance,
      createdAt: new Date().toLocaleString('bn-BD')
    };

    setWalletTransactions(prev => [newTx, ...prev]);
    return true;
  };

  const payFromWallet = async (invoiceId: string) => {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv) return { success: false, message: 'ইনভয়েস খুঁজে পাওয়া যায়নি।' };
    if (currentUser.accountBalance < inv.total) {
      return {
        success: false,
        message: `ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই। প্রয়োজনীয় ৳${inv.total.toLocaleString()}, বর্তমান ব্যালেন্স ৳${currentUser.accountBalance.toLocaleString()}। অনুগ্রহ করে প্রথমে ওয়ালেট টপ-আপ করুন।`
      };
    }

    const now = new Date().toISOString().split('T')[0];
    const newBalance = currentUser.accountBalance - inv.total;

    // 1. Update user balance
    setCurrentUser(prev => ({ ...prev, accountBalance: newBalance }));
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, accountBalance: newBalance } : u));

    // 2. Mark invoice paid
    setInvoices(prev => prev.map(i => i.id === invoiceId ? {
      ...i,
      status: 'paid',
      paidAt: now,
      paymentMethod: 'Wallet Balance (ওয়ালেট ব্যালেন্স)',
      adjustedFromWallet: true
    } : i));

    // 3. Extend domain if renewal
    setDomains(prev => prev.map(d => {
      if (d.userId === currentUser.id && (d.id === inv.recurringItemId || d.recurringInvoiceId === invoiceId || inv.title.includes(d.domainName))) {
        const nextExp = new Date(d.expiryDate);
        nextExp.setFullYear(nextExp.getFullYear() + 1);
        return {
          ...d,
          expiryDate: nextExp.toISOString().split('T')[0],
          status: 'active',
          recurringBillGenerated: false
        };
      }
      return d;
    }));

    // 4. Extend service if renewal
    setServices(prev => prev.map(s => {
      if (s.userId === currentUser.id && (s.id === inv.recurringItemId || s.recurringInvoiceId === invoiceId || inv.title.includes(s.domainName))) {
        const nextExp = new Date(s.expiresAt);
        if (s.renewalCycle === 'yearly') nextExp.setFullYear(nextExp.getFullYear() + 1);
        else nextExp.setMonth(nextExp.getMonth() + 1);
        return {
          ...s,
          expiresAt: nextExp.toISOString().split('T')[0],
          status: 'active',
          recurringBillGenerated: false
        };
      }
      return s;
    }));

    // 5. Add Wallet Transaction
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      userId: currentUser.id,
      customerName: currentUser.fullName,
      type: 'deduction',
      amount: inv.total,
      currency: 'BDT',
      description: `সার্ভিস বিল অ্যাডজাস্টমেন্ট: ${inv.title} (${inv.invoiceNumber})`,
      referenceId: inv.id,
      paymentMethod: 'wallet_balance',
      status: 'completed',
      balanceAfter: newBalance,
      createdAt: new Date().toLocaleString('bn-BD')
    };
    setWalletTransactions(prev => [newTx, ...prev]);

    return {
      success: true,
      message: `ওয়ালেট ব্যালেন্স থেকে ৳${inv.total.toLocaleString()} সফলভাবে পরিশোধ করা হয়েছে এবং মেয়াদ ১ বছর বাড়ানো হয়েছে!`
    };
  };

  const autoRenewServiceFromWallet = async (serviceType: 'domain' | 'service', itemId: string) => {
    let targetItem: { name: string; price: number; userId: number } | null = null;
    if (serviceType === 'domain') {
      const d = domains.find(dom => dom.id === itemId);
      if (d) targetItem = { name: d.domainName, price: d.renewalPrice, userId: d.userId };
    } else {
      const s = services.find(srv => srv.id === itemId);
      if (s) targetItem = { name: s.serviceName, price: s.renewalPrice, userId: s.userId };
    }

    if (!targetItem) return { success: false, message: 'সার্ভিস পাওয়া যায়নি।' };
    if (currentUser.accountBalance < targetItem.price) {
      return {
        success: false,
        message: `ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই। প্রয়োজন ৳${targetItem.price.toLocaleString()}, বর্তমান ব্যালেন্স ৳${currentUser.accountBalance.toLocaleString()}। অনুগ্রহ করে টপ-আপ করুন।`
      };
    }

    const invNumber = `INV-${new Date().getFullYear()}-${Math.floor(2000 + Math.random() * 8000)}`;
    const now = new Date().toISOString().split('T')[0];
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invNumber,
      userId: targetItem.userId,
      customerName: currentUser.fullName,
      customerEmail: currentUser.email,
      title: `স্বয়ংক্রিয় রিনিউয়াল - ${targetItem.name}`,
      items: [{ description: `${targetItem.name} ১ বছর রিনিউয়াল ফি`, amount: targetItem.price }],
      subtotal: targetItem.price,
      total: targetItem.price,
      currency: 'BDT',
      status: 'paid',
      dueAt: now,
      paidAt: now,
      paymentMethod: 'Wallet Balance (ওয়ালেট অটো-অ্যাডজাস্ট)',
      isRecurring: true,
      recurringForType: serviceType,
      recurringItemId: itemId,
      adjustedFromWallet: true,
      createdAt: now
    };
    setInvoices(prev => [newInvoice, ...prev]);

    const newBalance = currentUser.accountBalance - targetItem.price;
    setCurrentUser(prev => ({ ...prev, accountBalance: newBalance }));
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, accountBalance: newBalance } : u));

    if (serviceType === 'domain') {
      setDomains(prev => prev.map(d => {
        if (d.id === itemId) {
          const nextExp = new Date(d.expiryDate);
          nextExp.setFullYear(nextExp.getFullYear() + 1);
          return { ...d, expiryDate: nextExp.toISOString().split('T')[0], status: 'active', recurringBillGenerated: false };
        }
        return d;
      }));
    } else {
      setServices(prev => prev.map(s => {
        if (s.id === itemId) {
          const nextExp = new Date(s.expiresAt);
          if (s.renewalCycle === 'yearly') nextExp.setFullYear(nextExp.getFullYear() + 1);
          else nextExp.setMonth(nextExp.getMonth() + 1);
          return { ...s, expiresAt: nextExp.toISOString().split('T')[0], status: 'active', recurringBillGenerated: false };
        }
        return s;
      }));
    }

    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      userId: currentUser.id,
      customerName: currentUser.fullName,
      type: 'deduction',
      amount: targetItem.price,
      currency: 'BDT',
      description: `ওয়ালেট অটো-রিনিউয়াল: ${targetItem.name}`,
      referenceId: newInvoice.id,
      paymentMethod: 'wallet_balance',
      status: 'completed',
      balanceAfter: newBalance,
      createdAt: new Date().toLocaleString('bn-BD')
    };
    setWalletTransactions(prev => [newTx, ...prev]);

    return {
      success: true,
      message: `${targetItem.name} সফলভাবে রিনিউ করা হয়েছে এবং ওয়ালেট থেকে ৳${targetItem.price.toLocaleString()} অ্যাডজাস্ট করা হয়েছে!`
    };
  };

  const toggleAutoRenewFromWallet = (serviceType: 'domain' | 'service', itemId: string) => {
    if (serviceType === 'domain') {
      setDomains(prev => prev.map(d => d.id === itemId ? { ...d, autoRenewFromWallet: !d.autoRenewFromWallet } : d));
    } else {
      setServices(prev => prev.map(s => s.id === itemId ? { ...s, autoRenewFromWallet: !s.autoRenewFromWallet } : s));
    }
  };

  const adminAdjustWalletBalance = (userId: number, amount: number, note: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updatedBal = Math.max(0, u.accountBalance + amount);
        if (currentUser.id === userId) {
          setCurrentUser(curr => ({ ...curr, accountBalance: updatedBal }));
        }
        return { ...u, accountBalance: updatedBal };
      }
      return u;
    }));

    const targetUser = users.find(u => u.id === userId);
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      userId,
      customerName: targetUser?.fullName || 'User',
      type: amount >= 0 ? 'topup' : 'deduction',
      amount: Math.abs(amount),
      currency: 'BDT',
      description: `অ্যাডমিন অ্যাডজাস্টমেন্ট: ${note}`,
      paymentMethod: 'Admin Override',
      status: 'completed',
      createdAt: new Date().toLocaleString('bn-BD')
    };
    setWalletTransactions(prev => [newTx, ...prev]);
  };

  // Recurring billing generator
  const generateRecurringBill = (itemType: 'domain' | 'service', itemId: string): Invoice => {
    let targetUser: UserProfile | undefined;
    let title = '';
    let itemDesc = '';
    let amount = 0;
    let dueDate = '';

    if (itemType === 'domain') {
      const dom = domains.find(d => d.id === itemId);
      if (!dom) throw new Error('Domain not found');
      targetUser = users.find(u => u.id === dom.userId);
      title = `বার্ষিক ডোমেইন রিকারিং বিল - ${dom.domainName}`;
      itemDesc = `${dom.domainName} (.${dom.domainName.split('.').pop()}) ১ বছর রিকারেন্ট রিনিউয়াল ফি [মেয়াদ: ${dom.expiryDate}]`;
      amount = dom.renewalPrice;
      dueDate = dom.expiryDate;
    } else {
      const srv = services.find(s => s.id === itemId);
      if (!srv) throw new Error('Service not found');
      targetUser = users.find(u => u.id === srv.userId);
      title = `হোস্টিং সার্ভিস রিকারিং বিল - ${srv.serviceName} (${srv.domainName})`;
      itemDesc = `${srv.serviceName} (${srv.renewalCycle === 'yearly' ? 'বাৎসরিক' : 'মাসিক'}) রিকারেন্ট বিল`;
      amount = srv.renewalPrice;
      dueDate = srv.expiresAt;
    }

    const now = new Date().toISOString().split('T')[0];
    const invNumber = `INV-${new Date().getFullYear()}-${Math.floor(2000 + Math.random() * 8000)}`;
    const newInvoice: Invoice = {
      id: `inv-rec-${Date.now()}`,
      invoiceNumber: invNumber,
      userId: targetUser?.id || 2,
      customerName: targetUser?.fullName || 'Client',
      customerEmail: targetUser?.email || 'client@example.com',
      title,
      items: [{ description: itemDesc, amount }],
      subtotal: amount,
      total: amount,
      currency: 'BDT',
      status: 'unpaid',
      dueAt: dueDate,
      createdAt: now,
      isRecurring: true,
      recurringForType: itemType,
      recurringItemId: itemId
    };

    setInvoices(prev => [newInvoice, ...prev]);

    if (itemType === 'domain') {
      setDomains(prev => prev.map(d => d.id === itemId ? { ...d, recurringBillGenerated: true, recurringInvoiceId: newInvoice.id } : d));
    } else {
      setServices(prev => prev.map(s => s.id === itemId ? { ...s, recurringBillGenerated: true, recurringInvoiceId: newInvoice.id } : s));
    }

    return newInvoice;
  };

  const generateAllMonthlyRecurringBills = (targetMonthYear: string): number => {
    let count = 0;
    domains.forEach(dom => {
      if (dom.expiryDate.startsWith(targetMonthYear) && !dom.recurringBillGenerated) {
        try {
          generateRecurringBill('domain', dom.id);
          count++;
        } catch {}
      }
    });

    services.forEach(srv => {
      if (srv.expiresAt.startsWith(targetMonthYear) && !srv.recurringBillGenerated) {
        try {
          generateRecurringBill('service', srv.id);
          count++;
        } catch {}
      }
    });

    return count;
  };

  const sendExpiryNotification = (itemType: 'domain' | 'service', itemId: string, channel: 'email' | 'whatsapp' | 'sms') => {
    let itemName = '';
    let expiryDate = '';
    let renewalPrice = 0;
    let clientUser: UserProfile | undefined;

    if (itemType === 'domain') {
      const d = domains.find(dom => dom.id === itemId);
      if (d) {
        itemName = d.domainName;
        expiryDate = d.expiryDate;
        renewalPrice = d.renewalPrice;
        clientUser = users.find(u => u.id === d.userId);
        setDomains(prev => prev.map(dom => dom.id === itemId ? { ...dom, lastReminderSentAt: new Date().toISOString().split('T')[0] } : dom));
      }
    } else {
      const s = services.find(srv => srv.id === itemId);
      if (s) {
        itemName = s.serviceName;
        expiryDate = s.expiresAt;
        renewalPrice = s.renewalPrice;
        clientUser = users.find(u => u.id === s.userId);
        setServices(prev => prev.map(srv => srv.id === itemId ? { ...srv, lastReminderSentAt: new Date().toISOString().split('T')[0] } : srv));
      }
    }

    const phone = clientUser?.phone?.replace(/[^0-9]/g, '') || '8801841440202';
    const cleanPhone = phone.startsWith('88') ? phone : `88${phone}`;
    const messageText = `আসসালামু আলাইকুম ${clientUser?.fullName || 'গ্রাহক'}, WebDominic থেকে আপনার ${itemName} সার্ভিসের মেয়াদ আগামী ${expiryDate} তারিখে শেষ হবে। নবায়ন ফি ৳${renewalPrice}। আপনার অ্যাকাউন্টে ব্যালেন্স থাকলে অটো-অ্যাডজাস্ট হবে অথবা ড্যাশবোর্ড থেকে bKash/Nagad এ পরিশোধ করুন: https://webdominic.com/client`;

    let channelUrl = '';
    if (channel === 'whatsapp') {
      channelUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
    }

    return {
      success: true,
      message: `${channel === 'email' ? 'ইমেইল' : channel === 'whatsapp' ? 'WhatsApp' : 'SMS'} নোটিফিকেশন সফলভাবে তৈরি ও পাঠানো হয়েছে!`,
      channelUrl
    };
  };

  // Admin sends custom bill/invoice to customer
  const sendCustomBill = (billData: {
    userId: number;
    title: string;
    items: { description: string; amount: number }[];
    dueDate: string;
    currency?: 'BDT' | 'USD';
  }) => {
    const targetUser = users.find(u => u.id === billData.userId) || currentUser;
    const invNum = `INV-${new Date().getFullYear()}-${Math.floor(2000 + Math.random() * 8000)}`;
    const subtotal = billData.items.reduce((s, it) => s + it.amount, 0);

    const newInvoice: Invoice = {
      id: `inv-custom-${Date.now()}`,
      invoiceNumber: invNum,
      userId: billData.userId,
      customerName: targetUser.fullName,
      customerEmail: targetUser.email,
      title: billData.title,
      items: billData.items,
      subtotal,
      total: subtotal,
      currency: billData.currency || 'BDT',
      status: 'unpaid',
      dueAt: billData.dueDate,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setInvoices((prev) => [newInvoice, ...prev]);
  };

  // Admin approves order & payment
  const approvePaymentAndOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const now = new Date().toISOString().split('T')[0];

    // Mark order active
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: 'active', fulfillmentStatus: 'active' }
          : o
      )
    );

    // Mark related invoice paid
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.orderId === orderId
          ? { ...inv, status: 'paid', paidAt: now }
          : inv
      )
    );

    // Auto provision services/domains from this order
    order.items.forEach((item) => {
      if (item.type === 'domain' && item.domainName) {
        const exp = new Date();
        exp.setFullYear(exp.getFullYear() + 1);
        const newDomain: CustomerDomain = {
          id: `dom-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          userId: order.userId,
          domainName: item.domainName,
          registrationDate: now,
          expiryDate: exp.toISOString().split('T')[0],
          status: 'active',
          renewalPrice: item.price,
          currency: item.currency,
          autoRenew: true,
          domainLock: true,
          nameservers: ['ns1.wdhdomain.com', 'ns2.wdhdomain.com'],
          registrarName: 'WDH Automated Registry',
        };
        setDomains(prev => [newDomain, ...prev]);
      } else if (item.type === 'hosting' || item.type === 'vps' || item.type === 'reseller') {
        const exp = new Date();
        if (item.billingCycle === 'yearly') exp.setFullYear(exp.getFullYear() + 1);
        else exp.setMonth(exp.getMonth() + 1);

        const newService: CustomerService = {
          id: `srv-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          userId: order.userId,
          productId: 1,
          serviceName: item.name,
          serviceType: item.type.toUpperCase(),
          domainName: item.domainName || 'primary-service',
          status: 'active',
          activatedAt: now,
          expiresAt: exp.toISOString().split('T')[0],
          renewalPrice: item.price,
          currency: item.currency,
          renewalCycle: (item.billingCycle as any) || 'monthly',
          cpanelUrl: 'https://cpanel.wdhdomain.com',
          username: `cpl_${Math.floor(1000 + Math.random() * 9000)}`,
        };
        setServices(prev => [newService, ...prev]);
      }
    });
  };

  const rejectOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' } : o))
    );
    setInvoices((prev) =>
      prev.map((inv) => (inv.orderId === orderId ? { ...inv, status: 'cancelled' } : inv))
    );
  };

  const updateDomainPrice = (id: number, newPrice: Partial<DomainPrice>) => {
    setDomainPrices((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...newPrice } : p))
    );
  };

  const addTicketReply = (ticketId: string, message: string, sender: 'customer' | 'admin') => {
    const senderName = sender === 'admin' ? 'Muhammad Safiul Azam (Support)' : currentUser.fullName;
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: sender === 'admin' ? 'answered' : 'customer_reply',
            updatedAt: new Date().toLocaleString('bn-BD'),
            messages: [
              ...t.messages,
              {
                id: `msg-${Date.now()}`,
                sender,
                senderName,
                message,
                createdAt: new Date().toLocaleString('bn-BD'),
              },
            ],
          };
        }
        return t;
      })
    );
  };

  const createSupportTicket = (ticket: {
    subject: string;
    category: SupportTicket['category'];
    priority: SupportTicket['priority'];
    message: string;
  }) => {
    const newTkt: SupportTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: currentUser.id,
      customerName: currentUser.fullName,
      subject: ticket.subject,
      category: ticket.category,
      priority: ticket.priority,
      status: 'open',
      createdAt: new Date().toLocaleString('bn-BD'),
      updatedAt: new Date().toLocaleString('bn-BD'),
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'customer',
          senderName: currentUser.fullName,
          message: ticket.message,
          createdAt: new Date().toLocaleString('bn-BD'),
        },
      ],
    };
    setTickets((prev) => [newTkt, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        formatPrice,
        currentUser,
        switchUser,
        users,
        domainPrices,
        products,
        locations,
        orders,
        invoices,
        domains,
        services,
        tickets,
        customHostingRequests,
        submitCustomHostingRequest,
        siteSettings,
        walletTransactions,
        topUpWallet,
        payFromWallet,
        autoRenewServiceFromWallet,
        toggleAutoRenewFromWallet,
        adminAdjustWalletBalance,
        generateRecurringBill,
        generateAllMonthlyRecurringBills,
        sendExpiryNotification,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartTotal,
        checkDomainAvailability,
        processCheckout,
        updateNameservers,
        toggleDomainLock,
        toggleDomainAutoRenew,
        renewDomain,
        payInvoice,
        sendCustomBill,
        approvePaymentAndOrder,
        rejectOrder,
        updateDomainPrice,
        addTicketReply,
        createSupportTicket,
        activeTab,
        setActiveTab,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
