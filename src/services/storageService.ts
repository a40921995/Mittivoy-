import {
  Product,
  CategoryItem,
  Banner,
  ProductReview,
  Order,
  OfflineSale,
  Expense,
  AdminSettings,
  InventoryMovement,
  AppNotification,
  OrderStatus,
  PaymentStatus
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_BANNERS,
  INITIAL_REVIEWS,
  INITIAL_ORDERS,
  INITIAL_OFFLINE_SALES,
  INITIAL_EXPENSES,
  INITIAL_MOVEMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS
} from '../data/seedData';

type Listener = () => void;

class StorageService {
  private listeners: Listener[] = [];

  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(`mittivoy_${key}`);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.warn(`Error reading ${key} from localStorage`, e);
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`mittivoy_${key}`, JSON.stringify(value));
      this.notifyListeners();
    } catch (e) {
      console.warn(`Error saving ${key} to localStorage`, e);
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Listener callback error', err);
      }
    });
  }

  // --- Products ---
  public getProducts(): Product[] {
    return this.getItem<Product[]>('products', INITIAL_PRODUCTS);
  }

  public getProductById(id: string): Product | undefined {
    return this.getProducts().find((p) => p.id === id);
  }

  public saveProduct(product: Product): void {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.unshift(product);
    }
    this.setItem('products', products);
  }

  public deleteProduct(id: string): void {
    const products = this.getProducts().filter((p) => p.id !== id);
    this.setItem('products', products);
  }

  // --- Categories ---
  public getCategories(): CategoryItem[] {
    return this.getItem<CategoryItem[]>('categories', INITIAL_CATEGORIES);
  }

  public saveCategory(category: CategoryItem): void {
    const categories = this.getCategories();
    const index = categories.findIndex((c) => c.id === category.id);
    if (index >= 0) {
      categories[index] = category;
    } else {
      categories.push(category);
    }
    this.setItem('categories', categories);
  }

  public deleteCategory(id: string): void {
    const categories = this.getCategories().filter((c) => c.id !== id);
    this.setItem('categories', categories);
  }

  // --- Banners ---
  public getBanners(): Banner[] {
    return this.getItem<Banner[]>('banners', INITIAL_BANNERS);
  }

  public saveBanner(banner: Banner): void {
    const banners = this.getBanners();
    const index = banners.findIndex((b) => b.id === banner.id);
    if (index >= 0) {
      banners[index] = banner;
    } else {
      banners.push(banner);
    }
    this.setItem('banners', banners);
  }

  public deleteBanner(id: string): void {
    const banners = this.getBanners().filter((b) => b.id !== id);
    this.setItem('banners', banners);
  }

  // --- Reviews ---
  public getReviews(): ProductReview[] {
    return this.getItem<ProductReview[]>('reviews', INITIAL_REVIEWS);
  }

  public addReview(review: Omit<ProductReview, 'id' | 'date' | 'approved'>): ProductReview {
    const reviews = this.getReviews();
    const newReview: ProductReview = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      approved: true // by default visible or moderator flagged
    };
    reviews.unshift(newReview);
    this.setItem('reviews', reviews);

    // Update product rating average
    const productReviews = reviews.filter((r) => r.productId === review.productId && r.approved);
    const avg = productReviews.reduce((sum, r) => sum + r.rating, 0) / (productReviews.length || 1);
    const products = this.getProducts();
    const prod = products.find((p) => p.id === review.productId);
    if (prod) {
      prod.rating = parseFloat(avg.toFixed(1));
      prod.reviewCount = productReviews.length;
      this.setItem('products', products);
    }

    return newReview;
  }

  public toggleReviewApproval(reviewId: string): void {
    const reviews = this.getReviews();
    const review = reviews.find((r) => r.id === reviewId);
    if (review) {
      review.approved = !review.approved;
      this.setItem('reviews', reviews);
    }
  }

  public deleteReview(reviewId: string): void {
    const reviews = this.getReviews().filter((r) => r.id !== reviewId);
    this.setItem('reviews', reviews);
  }

  // --- Orders ---
  public getOrders(): Order[] {
    return this.getItem<Order[]>('orders', INITIAL_ORDERS);
  }

  public createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order {
    const orders = this.getOrders();
    const orderNumber = `MT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: now,
      updatedAt: now
    };

    // Decrement inventory variants
    this.deductInventoryForOrder(newOrder);

    orders.unshift(newOrder);
    this.setItem('orders', orders);

    // Create Telegram message and dispatch
    this.dispatchTelegramOrderAlert(newOrder);

    // Add push notification for customer
    this.addNotification({
      title: `Buyurtma qabul qilindi: ${orderNumber}`,
      message: `Hurmatli ${newOrder.customerName}, buyurtmangiz ro‘yxatga olindi. Holati: ${newOrder.status}.`,
      type: 'order'
    });

    return newOrder;
  }

  public updateOrderStatus(orderId: string, status: OrderStatus, paymentStatus?: PaymentStatus): void {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const previousStatus = order.status;
    order.status = status;
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }
    order.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);

    // If order is cancelled, return reserved stock back to warehouse!
    if (status === 'Bekor qilingan' && previousStatus !== 'Bekor qilingan') {
      this.returnInventoryForOrder(order);
    }

    this.setItem('orders', orders);

    // Notify customer
    this.addNotification({
      title: `Buyurtma holati yangilandi (${order.orderNumber})`,
      message: `Buyurtmangiz holati: "${status}" deb belgilandi.`,
      type: 'order'
    });
  }

  public updateOrderPaymentProof(orderId: string, transactionId: string, receiptUrl: string, note?: string): void {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    order.paymentTransactionId = transactionId;
    order.paymentReceiptUrl = receiptUrl;
    order.paymentNote = note;
    order.status = 'To‘lov tekshirilmoqda';
    order.paymentStatus = 'Tekshirilmoqda';
    order.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);

    this.setItem('orders', orders);
    this.dispatchTelegramPaymentAlert(order);
  }

  // Deduct variant stock
  private deductInventoryForOrder(order: Order): void {
    const products = this.getProducts();
    const movements = this.getInventoryMovements();
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    for (const item of order.items) {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        const variant = prod.variants.find((v) => v.color === item.color && v.size === item.size);
        if (variant) {
          variant.stock = Math.max(0, variant.stock - item.quantity);
          variant.soldCount = (variant.soldCount || 0) + item.quantity;

          movements.unshift({
            id: `mov-${Date.now()}-${Math.random()}`,
            date: now,
            productCode: item.productCode,
            productName: item.productName,
            variantInfo: `${item.color} - ${item.size}`,
            type: 'Sotuv (Onlayn)',
            quantityChange: -item.quantity,
            remainingStock: variant.stock,
            note: `Buyurtma #${order.orderNumber}`,
            performedBy: 'Tizim (Onlayn do‘kon)'
          });
        }
      }
    }

    this.setItem('products', products);
    this.setItem('movements', movements);
  }

  // Restore inventory on cancellation
  private returnInventoryForOrder(order: Order): void {
    const products = this.getProducts();
    const movements = this.getInventoryMovements();
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    for (const item of order.items) {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        const variant = prod.variants.find((v) => v.color === item.color && v.size === item.size);
        if (variant) {
          variant.stock += item.quantity;
          variant.soldCount = Math.max(0, (variant.soldCount || 0) - item.quantity);

          movements.unshift({
            id: `mov-${Date.now()}-${Math.random()}`,
            date: now,
            productCode: item.productCode,
            productName: item.productName,
            variantInfo: `${item.color} - ${item.size}`,
            type: 'Qaytarish',
            quantityChange: item.quantity,
            remainingStock: variant.stock,
            note: `Bekor qilingan buyurtma #${order.orderNumber}`,
            performedBy: 'Administrator'
          });
        }
      }
    }

    this.setItem('products', products);
    this.setItem('movements', movements);
  }

  // --- Offline Sales (POS) ---
  public getOfflineSales(): OfflineSale[] {
    return this.getItem<OfflineSale[]>('offline_sales', INITIAL_OFFLINE_SALES);
  }

  public createOfflineSale(saleData: Omit<OfflineSale, 'id' | 'receiptNumber' | 'createdAt' | 'synced'>): OfflineSale {
    const sales = this.getOfflineSales();
    const receiptNumber = `CHK-POS-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newSale: OfflineSale = {
      ...saleData,
      id: `pos-${Date.now()}`,
      receiptNumber,
      createdAt: now,
      synced: true
    };

    // Deduct stock for offline POS sale
    const products = this.getProducts();
    const movements = this.getInventoryMovements();

    for (const item of newSale.items) {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        const variant = prod.variants.find((v) => v.color === item.color && v.size === item.size);
        if (variant) {
          variant.stock = Math.max(0, variant.stock - item.quantity);
          variant.soldCount = (variant.soldCount || 0) + item.quantity;

          movements.unshift({
            id: `mov-${Date.now()}-${Math.random()}`,
            date: now,
            productCode: item.productCode,
            productName: item.productName,
            variantInfo: `${item.color} - ${item.size}`,
            type: 'Sotuv (Oflayn)',
            quantityChange: -item.quantity,
            remainingStock: variant.stock,
            note: `Oflayn kassada savdo #${receiptNumber}`,
            performedBy: newSale.cashierName
          });
        }
      }
    }

    this.setItem('products', products);
    this.setItem('movements', movements);

    sales.unshift(newSale);
    this.setItem('offline_sales', sales);

    return newSale;
  }

  public syncPendingOfflineSales(): { syncedCount: number; conflicts: string[] } {
    const sales = this.getOfflineSales();
    let syncedCount = 0;
    const conflicts: string[] = [];

    sales.forEach((s) => {
      if (!s.synced) {
        s.synced = true;
        syncedCount++;
      }
    });

    this.setItem('offline_sales', sales);
    return { syncedCount, conflicts };
  }

  // --- Inventory Movements ---
  public getInventoryMovements(): InventoryMovement[] {
    return this.getItem<InventoryMovement[]>('movements', INITIAL_MOVEMENTS);
  }

  public addInventoryStock(productId: string, variantId: string, quantityToAdd: number, note: string): void {
    const products = this.getProducts();
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const variant = prod.variants.find((v) => v.id === variantId);
    if (!variant) return;

    variant.stock += quantityToAdd;
    this.setItem('products', products);

    const movements = this.getInventoryMovements();
    movements.unshift({
      id: `mov-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      productCode: prod.code,
      productName: prod.name,
      variantInfo: `${variant.color} - ${variant.size}`,
      type: 'Kirim',
      quantityChange: quantityToAdd,
      remainingStock: variant.stock,
      note: note || 'Omborga tovar kirimi',
      performedBy: 'Administrator'
    });
    this.setItem('movements', movements);
  }

  // --- Expenses ---
  public getExpenses(): Expense[] {
    return this.getItem<Expense[]>('expenses', INITIAL_EXPENSES);
  }

  public saveExpense(expense: Expense): void {
    const expenses = this.getExpenses();
    const idx = expenses.findIndex((e) => e.id === expense.id);
    if (idx >= 0) {
      expenses[idx] = expense;
    } else {
      expenses.unshift(expense);
    }
    this.setItem('expenses', expenses);
  }

  public deleteExpense(id: string): void {
    const expenses = this.getExpenses().filter((e) => e.id !== id);
    this.setItem('expenses', expenses);
  }

  // --- Notifications ---
  public getNotifications(): AppNotification[] {
    return this.getItem<AppNotification[]>('notifications', INITIAL_NOTIFICATIONS);
  }

  public addNotification(notification: Omit<AppNotification, 'id' | 'date' | 'isRead'>): void {
    const notifs = this.getNotifications();
    const now = 'Bugun, ' + new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
    notifs.unshift({
      ...notification,
      id: `notif-${Date.now()}`,
      date: now,
      isRead: false
    });
    this.setItem('notifications', notifs);
  }

  public markNotificationAsRead(id: string): void {
    const notifs = this.getNotifications();
    const n = notifs.find((x) => x.id === id);
    if (n) {
      n.isRead = true;
      this.setItem('notifications', notifs);
    }
  }

  public markAllNotificationsAsRead(): void {
    const notifs = this.getNotifications().map((n) => ({ ...n, isRead: true }));
    this.setItem('notifications', notifs);
  }

  // --- Settings ---
  public getSettings(): AdminSettings {
    return this.getItem<AdminSettings>('settings', INITIAL_SETTINGS);
  }

  public saveSettings(settings: AdminSettings): void {
    this.setItem('settings', settings);
  }

  // --- Telegram Bot Simulator Stream ---
  public getTelegramMessages(): Array<{
    id: string;
    date: string;
    orderId?: string;
    text: string;
    status: 'delivered' | 'pending';
  }> {
    return this.getItem('telegram_logs', [
      {
        id: 'tg-1',
        date: '2026-03-24 10:30',
        orderId: 'ord-101',
        text: '🛍 Yangi Buyurtma #MT-2026-1049\n👤 Zarina Rahimova (+998 90 123 45 67)\n💵 Summa: 273,000 UZS\n💳 To‘lov: Click (To‘lov tekshirilmoqda)\n📍 Manzil: Toshkent sh., Yunusobod',
        status: 'delivered'
      }
    ]);
  }

  private dispatchTelegramOrderAlert(order: Order): void {
    const settings = this.getSettings();
    if (!settings.telegram.notifyOnNewOrder) return;

    const itemsSummary = order.items.map((i) => `• ${i.productName} (${i.color}, ${i.size}) x${i.quantity}`).join('\n');
    const text = `🛍 <b>YANGI BUYURTMA #${order.orderNumber}</b>\n\n👤 Mijoz: ${order.customerName}\n📞 Tel: ${order.customerPhone}\n📍 Manzil: ${order.region}, ${order.district}\n\n📦 <b>Tovarlar:</b>\n${itemsSummary}\n\n💰 <b>Jami:</b> ${order.totalAmount.toLocaleString('uz-UZ')} UZS\n💳 <b>To‘lov usuli:</b> ${order.paymentMethod}\n📊 <b>Holat:</b> ${order.status}`;

    const logs = this.getTelegramMessages();
    logs.unshift({
      id: `tg-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      orderId: order.id,
      text,
      status: 'delivered'
    });
    this.setItem('telegram_logs', logs);
  }

  private dispatchTelegramPaymentAlert(order: Order): void {
    const settings = this.getSettings();
    if (!settings.telegram.notifyOnPayment) return;

    const text = `💳 <b>TO‘LOV CHEKI YUKLANDI!</b>\n\nBuyurtma: #${order.orderNumber}\nMijoz: ${order.customerName}\nSumma: ${order.totalAmount.toLocaleString('uz-UZ')} UZS\nTo‘lov tizimi: ${order.paymentMethod}\nTranzaksiya: ${order.paymentTransactionId || 'Kiritilmagan'}\n\n<i>Admin panelda to‘lovni tasdiqlang yoki rad eting.</i>`;

    const logs = this.getTelegramMessages();
    logs.unshift({
      id: `tg-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      orderId: order.id,
      text,
      status: 'delivered'
    });
    this.setItem('telegram_logs', logs);
  }

  // --- Reset to Demo Data ---
  public resetToFactoryDemo(): void {
    this.setItem('products', INITIAL_PRODUCTS);
    this.setItem('categories', INITIAL_CATEGORIES);
    this.setItem('banners', INITIAL_BANNERS);
    this.setItem('reviews', INITIAL_REVIEWS);
    this.setItem('orders', INITIAL_ORDERS);
    this.setItem('offline_sales', INITIAL_OFFLINE_SALES);
    this.setItem('expenses', INITIAL_EXPENSES);
    this.setItem('movements', INITIAL_MOVEMENTS);
    this.setItem('notifications', INITIAL_NOTIFICATIONS);
    this.setItem('settings', INITIAL_SETTINGS);
  }
}

export const storageService = new StorageService();
