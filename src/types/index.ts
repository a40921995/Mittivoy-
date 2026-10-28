export type GenderType = 'ogil' | 'qiz' | 'uniseks';

export type AgeGroupType = '1-3' | '4-6' | '7-9' | '10-12' | '13-15';

export type CategoryType =
  | 'Futbolkalar'
  | 'Ko‘ylaklar'
  | 'Shimlar'
  | 'Kurtkalar'
  | 'Sport kiyimlari'
  | 'Dvoykalar'
  | 'Kostyumlar'
  | 'Qishki kiyimlar'
  | 'Yozgi kiyimlar'
  | 'Poyabzallar'
  | 'Aksessuarlar';

export interface ProductVariant {
  id: string;
  color: string;
  colorHex: string;
  size: string; // e.g. "86 (1-2 yosh)", "98 (2-3 yosh)", "110", "128", etc.
  stock: number;
  soldCount: number;
  barcode?: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  userPhoneMasked: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  isVerifiedPurchase: boolean;
  photoUrl?: string;
  approved: boolean;
}

export interface Product {
  id: string;
  code: string; // SKU code e.g. "MT-1042"
  name: string;
  description: string;
  category: CategoryType | string;
  gender: GenderType;
  ageGroup: AgeGroupType;
  costPrice: number; // Tannarxi (UZS)
  sellingPrice: number; // Sotuv narxi (UZS)
  discountPrice?: number; // Chegirma narxi (UZS)
  images: string[];
  mainImage: string;
  rating: number;
  reviewCount: number;
  variants: ProductVariant[];
  fabric?: string; // e.g. "100% Paxta (Turkiya)"
  isNewArrival?: boolean;
  isBestseller?: boolean;
  isRecommended?: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string; // cart item unique id
  product: Product;
  variantId: string;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  price: number;
}

export type OrderStatus =
  | 'Yangi'
  | 'To‘lov kutilmoqda'
  | 'To‘lov tekshirilmoqda'
  | 'Tasdiqlangan'
  | 'Tayyorlanmoqda'
  | 'Yetkazilmoqda'
  | 'Yetkazilgan'
  | 'Bekor qilingan';

export type PaymentMethod = 'Click' | 'Paynet';

export type PaymentStatus = 'Kutilmoqda' | 'Tekshirilmoqda' | 'Tasdiqlandi' | 'Rad etildi';

export interface OrderItem {
  productId: string;
  productName: string;
  productCode: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  costPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "MT-2026-9812"
  customerName: string;
  customerPhone: string;
  region: string;
  district: string;
  address: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  totalCost: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentReceiptUrl?: string;
  paymentTransactionId?: string;
  paymentNote?: string;
  createdAt: string;
  updatedAt: string;
  isOnline: boolean;
}

export interface OfflineSale {
  id: string;
  receiptNumber: string;
  cashierName: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  totalCost: number;
  paymentMethod: 'Click' | 'Paynet' | 'Terminal POS';
  customerName?: string;
  customerPhone?: string;
  createdAt: string;
  synced: boolean;
  conflictWarning?: string;
}

export interface InventoryMovement {
  id: string;
  date: string;
  productCode: string;
  productName: string;
  variantInfo: string;
  type: 'Kirim' | 'Sotuv (Onlayn)' | 'Sotuv (Oflayn)' | 'Qaytarish' | 'Tuzatish';
  quantityChange: number;
  remainingStock: number;
  note?: string;
  performedBy: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  category:
    | 'Mahsulot xaridi'
    | 'Yetkazib berish'
    | 'Ijara'
    | 'Ish haqi'
    | 'Reklama'
    | 'Kommunal to‘lovlar'
    | 'Boshqa';
  note?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  imageUrl: string;
  linkCategory?: string;
  isActive: boolean;
  order: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  iconName: string;
  imageUrl?: string;
  itemCount: number;
  gender: GenderType | 'barchasi';
  isActive: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  type: 'order' | 'discount' | 'new_product' | 'system';
  targetUrl?: string;
}

export interface TelegramSettings {
  botToken: string;
  chatId: string;
  channelUsername?: string;
  notifyOnNewOrder: boolean;
  notifyOnPayment: boolean;
  notifyOnLowStock: boolean;
  allowInlineApproval: boolean;
}

export interface AdminSettings {
  storeName: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  lowStockThreshold: number;
  clickMerchantId: string;
  clickServiceId: string;
  clickCardNumber: string;
  paynetMerchantId: string;
  paynetTerminalId: string;
  paynetCardNumber: string;
  telegram: TelegramSettings;
  allowPushNotifications: boolean;
  adminPin: string;
}
