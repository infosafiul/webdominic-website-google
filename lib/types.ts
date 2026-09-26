export interface DomainPrice {
  id: number;
  tld: string;
  registrationPrice: number;
  hostingBundlePrice?: number;
  hostingWebsiteBundlePrice?: number;
  renewalPrice: number;
  transferPrice: number;
  currency: 'BDT' | 'USD';
  description: string;
  category: string;
  popular?: boolean;
}

export interface HostingProduct {
  id: number;
  category: 'hosting' | 'business_hosting' | 'vps' | 'dedicated' | 'reseller' | 'email' | 'security' | 'service' | 'storage';
  slug: string;
  name: string;
  shortDescription: string;
  monthlyPrice: number;
  yearlyPrice?: number;
  currency: 'BDT' | 'USD';
  features: string[];
  badge?: string;
  sortOrder: number;
}

export interface ServerLocation {
  id: number;
  region: string;
  country: string;
  city: string;
  flag: string;
}

export interface CartItem {
  id: string;
  type: 'domain' | 'hosting' | 'vps' | 'reseller' | 'service';
  name: string;
  domainName?: string;
  billingCycle: 'monthly' | 'yearly';
  price: number;
  currency: 'BDT' | 'USD';
  productId?: number;
  details?: {
    tld?: string;
    isTransfer?: boolean;
    nameservers?: string[];
    storage?: string;
    ram?: string;
    cpu?: string;
  };
}

export interface OrderItem {
  id: string;
  type: string;
  name: string;
  domainName?: string;
  price: number;
  currency: 'BDT' | 'USD';
  billingCycle: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  total: number;
  currency: 'BDT' | 'USD';
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  fulfillmentStatus: 'awaiting_payment' | 'processing' | 'active';
  paymentMethod: 'bkash' | 'nagad' | 'rocket' | 'bank' | 'wallet';
  transactionId?: string;
  senderNumber?: string;
  items: OrderItem[];
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId?: string;
  userId: number;
  customerName: string;
  customerEmail: string;
  title: string;
  items: { description: string; amount: number }[];
  subtotal: number;
  total: number;
  currency: 'BDT' | 'USD';
  status: 'unpaid' | 'paid' | 'overdue' | 'cancelled';
  dueAt: string;
  paidAt?: string;
  paymentMethod?: string;
  transactionId?: string;
  createdAt: string;
  isRecurring?: boolean;
  recurringForType?: 'domain' | 'service';
  recurringItemId?: string;
  adjustedFromWallet?: boolean;
}

export interface CustomerDomain {
  id: string;
  userId: number;
  domainName: string;
  registrationDate: string;
  expiryDate: string;
  status: 'active' | 'expiring_soon' | 'expired' | 'pending';
  renewalPrice: number;
  currency: 'BDT' | 'USD';
  autoRenew: boolean;
  autoRenewFromWallet?: boolean;
  recurringBillGenerated?: boolean;
  recurringInvoiceId?: string;
  lastReminderSentAt?: string;
  registeredYears?: number;
  domainLock: boolean;
  nameservers: string[];
  registrarName: string;
}

export interface CustomerService {
  id: string;
  userId: number;
  productId: number;
  serviceName: string;
  serviceType: string;
  domainName: string;
  status: 'active' | 'pending' | 'suspended' | 'expired';
  activatedAt: string;
  expiresAt: string;
  renewalPrice: number;
  currency: 'BDT' | 'USD';
  renewalCycle: 'monthly' | 'yearly';
  autoRenewFromWallet?: boolean;
  recurringBillGenerated?: boolean;
  recurringInvoiceId?: string;
  lastReminderSentAt?: string;
  cpanelUrl?: string;
  username?: string;
}

export interface WalletTransaction {
  id: string;
  userId: number;
  customerName?: string;
  type: 'topup' | 'deduction' | 'refund';
  amount: number;
  currency: 'BDT' | 'USD';
  description: string;
  referenceId?: string; // invoiceId, orderId, or domainId
  paymentMethod?: string; // bkash, nagad, rocket, bank, wallet_balance
  transactionId?: string;
  status: 'completed' | 'pending' | 'rejected';
  balanceAfter?: number;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: number;
  customerName: string;
  subject: string;
  category: 'Billing' | 'Domain' | 'Hosting' | 'Technical';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'open' | 'answered' | 'customer_reply' | 'closed';
  createdAt: string;
  updatedAt: string;
  messages: {
    id: string;
    sender: 'customer' | 'admin';
    senderName: string;
    message: string;
    createdAt: string;
  }[];
}

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: 'client' | 'admin';
  accountBalance: number;
  address?: string;
}

export interface CustomHostingRequest {
  id: string;
  userId: number;
  customerName: string;
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
  status: 'submitted' | 'under_review' | 'quoted' | 'approved' | 'rejected';
  createdAt: string;
}

// Zip archive explorer types
export interface ZipItem {
  id: string;
  name: string;
  path: string;
  isDir: boolean;
  size: number;
  compressedSize?: number;
  date: Date;
  extension: string;
  category: 'code' | 'image' | 'document' | 'audio' | 'data' | 'archive' | 'other';
  depth: number;
}

export interface ArchiveInfo {
  id: string;
  fileName: string;
  fileSize: number;
  totalUncompressedSize: number;
  totalCompressedSize: number;
  fileCount: number;
  folderCount: number;
  uploadedAt: Date;
  items: ZipItem[];
  rawZipInstance: any;
}

export type FileCategory = 'all' | 'code' | 'image' | 'document' | 'audio' | 'data' | 'other';

export interface PreviewData {
  item: ZipItem;
  content?: string;
  blobUrl?: string;
  isBinary?: boolean;
  mimeType?: string;
  linesCount?: number;
}
