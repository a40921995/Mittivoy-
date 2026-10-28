/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Home,
  Grid,
  Heart,
  ShoppingCart,
  User,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import {
  Product,
  CategoryItem,
  Banner,
  ProductReview,
  Order,
  OfflineSale,
  Expense,
  InventoryMovement,
  AppNotification,
  CartItem,
  AdminSettings
} from './types';
import { storageService } from './services/storageService';
import { DeviceFrame, DeviceMode } from './components/common/DeviceFrame';
import { SplashScreen } from './components/common/SplashScreen';
import { Header } from './components/client/Header';
import { HomeScreen } from './components/client/HomeScreen';
import { CatalogScreen } from './components/client/CatalogScreen';
import { FavoritesScreen } from './components/client/FavoritesScreen';
import { CartScreen } from './components/client/CartScreen';
import { ProfileScreen } from './components/client/ProfileScreen';
import { ProductDetailModal } from './components/client/ProductDetailModal';
import { OrderSuccessModal } from './components/client/OrderSuccessModal';
import { NotificationsModal } from './components/client/NotificationsModal';
import { Footer } from './components/client/Footer';

// Admin Sections
import { AdminLayout, AdminSection } from './components/admin/AdminLayout';
import { DashboardSection } from './components/admin/sections/DashboardSection';
import { ProductsSection } from './components/admin/sections/ProductsSection';
import { CategoriesSection } from './components/admin/sections/CategoriesSection';
import { OrdersSection } from './components/admin/sections/OrdersSection';
import { InventorySection } from './components/admin/sections/InventorySection';
import { OnlineSalesSection } from './components/admin/sections/OnlineSalesSection';
import { OfflineSalesSection } from './components/admin/sections/OfflineSalesSection';
import { CustomersSection } from './components/admin/sections/CustomersSection';
import { PaymentsSection } from './components/admin/sections/PaymentsSection';
import { ExpensesSection } from './components/admin/sections/ExpensesSection';
import { AnalyticsSection } from './components/admin/sections/AnalyticsSection';
import { ReviewsSection } from './components/admin/sections/ReviewsSection';
import { BannersSection } from './components/admin/sections/BannersSection';
import { TelegramSection } from './components/admin/sections/TelegramSection';
import { NotificationsSection } from './components/admin/sections/NotificationsSection';
import { SettingsSection } from './components/admin/sections/SettingsSection';

export default function App() {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Device & Navigation state
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('iphone');
  const [isSimulatorMode, setIsSimulatorMode] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'home' | 'catalog' | 'favorites' | 'cart' | 'profile'>('home');
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState<boolean>(false);
  const [adminActiveSection, setAdminActiveSection] = useState<AdminSection>('dashboard');

  // Client store state
  const [products, setProducts] = useState<Product[]>(storageService.getProducts());
  const [categories, setCategories] = useState<CategoryItem[]>(storageService.getCategories());
  const [banners, setBanners] = useState<Banner[]>(storageService.getBanners());
  const [reviews, setReviews] = useState<ProductReview[]>(storageService.getReviews());
  const [orders, setOrders] = useState<Order[]>(storageService.getOrders());
  const [offlineSales, setOfflineSales] = useState<OfflineSale[]>(storageService.getOfflineSales());
  const [expenses, setExpenses] = useState<Expense[]>(storageService.getExpenses());
  const [movements, setMovements] = useState<InventoryMovement[]>(storageService.getInventoryMovements());
  const [notifications, setNotifications] = useState<AppNotification[]>(storageService.getNotifications());
  const [settings, setSettings] = useState<AdminSettings>(storageService.getSettings());

  // Interactive UI state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('mittivoy_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mittivoy_favorites');
      return saved ? JSON.parse(saved) : ['prod-1', 'prod-2'];
    } catch {
      return ['prod-1', 'prod-2'];
    }
  });

  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [placedOrderSuccess, setPlacedOrderSuccess] = useState<Order | null>(null);

  // Cart toast & badge animation
  const [cartToast, setCartToast] = useState<{ visible: boolean; message: string; image?: string }>({
    visible: false,
    message: ''
  });
  const [isCartBouncing, setIsCartBouncing] = useState<boolean>(false);

  // Catalog pre-filter
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState<string | undefined>();
  const [catalogGenderFilter, setCatalogGenderFilter] = useState<string | undefined>();

  // Subscribe to storage changes
  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      setProducts(storageService.getProducts());
      setCategories(storageService.getCategories());
      setBanners(storageService.getBanners());
      setReviews(storageService.getReviews());
      setOrders(storageService.getOrders());
      setOfflineSales(storageService.getOfflineSales());
      setExpenses(storageService.getExpenses());
      setMovements(storageService.getInventoryMovements());
      setNotifications(storageService.getNotifications());
      setSettings(storageService.getSettings());
    });
    return () => unsubscribe();
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('mittivoy_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('mittivoy_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Cart operations with animation triggers
  const handleAddToCart = (
    product: Product,
    variantId: string,
    color: string,
    size: string,
    quantity: number
  ) => {
    const existing = cartItems.find(
      (item) => item.product.id === product.id && item.variantId === variantId
    );

    const unitPrice = product.discountPrice || product.sellingPrice;

    if (existing) {
      setCartItems(
        cartItems.map((item) =>
          item.id === existing.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          id: `cart-${Date.now()}-${Math.random()}`,
          product,
          variantId,
          selectedColor: color,
          selectedSize: size,
          quantity,
          price: unitPrice
        }
      ]);
    }

    // Trigger cart badge bounce and toast
    setIsCartBouncing(true);
    setTimeout(() => setIsCartBouncing(false), 700);

    setCartToast({
      visible: true,
      message: `"${product.name}" savatga qo‘shildi! 🎉`,
      image: product.mainImage
    });
    setTimeout(() => {
      setCartToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleUpdateCartQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems(cartItems.filter((i) => i.id !== cartItemId));
    } else {
      setCartItems(
        cartItems.map((i) =>
          i.id === cartItemId ? { ...i, quantity: newQuantity } : i
        )
      );
    }
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    setCartItems(cartItems.filter((i) => i.id !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Toggle favorite
  const handleToggleFavorite = (productId: string) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter((id) => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsProductDetailOpen(true);
  };

  const handleDirectBuy = (
    product: Product,
    variantId: string,
    color: string,
    size: string,
    quantity: number
  ) => {
    handleAddToCart(product, variantId, color, size, quantity);
    setActiveTab('cart');
  };

  const handleAddReview = (reviewData: { rating: number; comment: string; userName: string }) => {
    if (!selectedProduct) return;
    storageService.addReview({
      productId: selectedProduct.id,
      userName: reviewData.userName,
      userPhoneMasked: '+998 90 *** ** **',
      rating: reviewData.rating,
      comment: reviewData.comment,
      isVerifiedPurchase: true
    });
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Yangi' || o.status === 'To‘lov tekshirilmoqda').length;
  const pendingPaymentsCount = orders.filter((o) => o.paymentStatus === 'Tekshirilmoqda').length;
  let lowStockCount = 0;
  products.forEach((p) => {
    p.variants.forEach((v) => {
      if (v.stock <= 3) lowStockCount++;
    });
  });

  // Render Admin Section
  const renderAdminSection = () => {
    switch (adminActiveSection) {
      case 'dashboard':
        return (
          <DashboardSection
            orders={orders}
            offlineSales={offlineSales}
            products={products}
            expenses={expenses}
            onNavigate={(sec) => setAdminActiveSection(sec)}
          />
        );
      case 'products':
        return <ProductsSection products={products} categories={categories} />;
      case 'categories':
        return <CategoriesSection categories={categories} />;
      case 'orders':
        return <OrdersSection orders={orders} />;
      case 'inventory':
        return <InventorySection products={products} movements={movements} />;
      case 'online_sales':
        return <OnlineSalesSection orders={orders} />;
      case 'offline_sales':
        return (
          <OfflineSalesSection
            products={products}
            offlineSales={offlineSales}
            isOffline={isOffline}
            onToggleOffline={() => setIsOffline(!isOffline)}
          />
        );
      case 'customers':
        return <CustomersSection orders={orders} />;
      case 'payments':
        return <PaymentsSection orders={orders} />;
      case 'expenses':
        return <ExpensesSection expenses={expenses} />;
      case 'analytics':
        return (
          <AnalyticsSection
            orders={orders}
            offlineSales={offlineSales}
            products={products}
            expenses={expenses}
          />
        );
      case 'reviews':
        return <ReviewsSection reviews={reviews} products={products} />;
      case 'banners':
        return <BannersSection banners={banners} />;
      case 'telegram':
        return <TelegramSection settings={settings} orders={orders} />;
      case 'notifications':
        return <NotificationsSection notifications={notifications} />;
      case 'settings':
        return <SettingsSection settings={settings} />;
      default:
        return (
          <DashboardSection
            orders={orders}
            offlineSales={offlineSales}
            products={products}
            expenses={expenses}
            onNavigate={(sec) => setAdminActiveSection(sec)}
          />
        );
    }
  };

  // If Admin Portal is open, render full admin layout in light SaaS theme
  if (isAdminPortalOpen) {
    return (
      <AdminLayout
        activeSection={adminActiveSection}
        onSelectSection={(sec) => setAdminActiveSection(sec)}
        onExitAdmin={() => setIsAdminPortalOpen(false)}
        pendingOrdersCount={pendingOrdersCount}
        pendingPaymentsCount={pendingPaymentsCount}
        lowStockCount={lowStockCount}
      >
        {renderAdminSection()}
      </AdminLayout>
    );
  }

  const cartItemsCount = cartItems.reduce((sum, it) => sum + it.quantity, 0);
  const cartSubtotal = cartItems.reduce((sum, it) => sum + it.price * it.quantity, 0);

  // Render client storefront content (reused in both web and simulator mode)
  const renderClientStoreContent = (isInSimulator = false) => (
    <div className="flex-1 flex flex-col bg-white min-h-full relative font-sans">
      {/* Animated Splash Screen */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* Global Cart Addition Toast */}
      {cartToast.visible && (
        <div className="fixed top-14 inset-x-4 z-50 max-w-md mx-auto flex items-center justify-between gap-3 bg-slate-900/95 text-white px-4 py-3 rounded-2xl shadow-xl border border-sky-400/40 backdrop-blur-md animate-pop">
          <div className="flex items-center gap-2.5 min-w-0">
            {cartToast.image && (
              <img
                src={cartToast.image}
                alt="Cart product"
                className="w-10 h-10 rounded-xl object-cover border border-white/20 shrink-0"
              />
            )}
            <div className="truncate text-xs">
              <span className="font-extrabold text-white block truncate">
                {cartToast.message}
              </span>
              <span className="text-[10px] text-sky-300">
                Savatda: {cartItemsCount} dona mahsulot
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setCartToast((prev) => ({ ...prev, visible: false }));
              setActiveTab('cart');
            }}
            className="bg-[#00B8F5] hover:bg-[#0096C7] text-white font-black text-xs px-3.5 py-1.5 rounded-xl shrink-0 transition-all active:scale-95 shadow-xs flex items-center gap-1 cursor-pointer"
          >
            <span>Savatga</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Responsive Header (sticky top) */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q && activeTab !== 'catalog') {
            setActiveTab('catalog');
          }
        }}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        favoritesCount={favorites.length}
        onNavigateToFavorites={() => setActiveTab('favorites')}
        cartCount={cartItemsCount}
        cartTotal={cartSubtotal}
        onNavigateToCart={() => setActiveTab('cart')}
        onNavigateToProfile={() => setActiveTab('profile')}
        onNavigateToHome={() => setActiveTab('home')}
        onNavigateToCatalog={(filter) => {
          setCatalogCategoryFilter(filter?.category);
          setCatalogGenderFilter(filter?.gender);
          setActiveTab('catalog');
        }}
        onQuickCategoryClick={(cat) => {
          setCatalogCategoryFilter(cat);
          setActiveTab('catalog');
        }}
        onOpenAdmin={() => setIsAdminPortalOpen(true)}
        activeTab={activeTab}
        isMobileFrameActive={isSimulatorMode}
        onToggleMobileFrame={() => setIsSimulatorMode(!isSimulatorMode)}
      />

      {/* Screen Content based on Active Tab */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'home' && (
          <HomeScreen
            banners={banners}
            categories={categories}
            products={products}
            onSelectProduct={handleOpenProduct}
            onNavigateToCatalog={(filter) => {
              setCatalogCategoryFilter(filter?.category);
              setCatalogGenderFilter(filter?.gender);
              setActiveTab('catalog');
            }}
            onToggleFavorite={handleToggleFavorite}
            onQuickAddToCart={(prod) => {
              setSelectedProduct(prod);
              setIsProductDetailOpen(true);
            }}
            favorites={favorites}
          />
        )}

        {activeTab === 'catalog' && (
          <CatalogScreen
            products={products}
            categories={categories}
            searchQuery={searchQuery}
            onSelectProduct={handleOpenProduct}
            onToggleFavorite={handleToggleFavorite}
            favorites={favorites}
            initialCategory={catalogCategoryFilter}
            initialGender={catalogGenderFilter}
            onQuickAddToCart={(prod) => {
              setSelectedProduct(prod);
              setIsProductDetailOpen(true);
            }}
          />
        )}

        {activeTab === 'favorites' && (
          <FavoritesScreen
            products={products}
            favorites={favorites}
            onSelectProduct={handleOpenProduct}
            onToggleFavorite={handleToggleFavorite}
            onNavigateToCatalog={() => setActiveTab('catalog')}
            onQuickAddToCart={(prod) => {
              setSelectedProduct(prod);
              setIsProductDetailOpen(true);
            }}
          />
        )}

        {activeTab === 'cart' && (
          <CartScreen
            items={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onOrderPlaced={(order) => {
              setPlacedOrderSuccess(order);
            }}
            onNavigateToCatalog={() => setActiveTab('catalog')}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileScreen
            orders={orders}
            favoritesCount={favorites.length}
            onNavigateToFavorites={() => setActiveTab('favorites')}
            onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
          />
        )}
      </div>

      {/* Mobile Sticky Bottom Navigation Tabs (Visible on mobile/tablet screens < lg) */}
      <nav className="lg:hidden sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 flex items-center justify-around select-none shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        {/* 1. Bosh sahifa */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-2xl transition-all duration-200 active:scale-90 ${
            activeTab === 'home'
              ? 'text-[#00B8F5] font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-colors ${
              activeTab === 'home' ? 'bg-[#E5F7FF]' : ''
            }`}
          >
            <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : ''}`} />
          </div>
          <span className="text-[10px]">Bosh sahifa</span>
        </button>

        {/* 2. Katalog */}
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-2xl transition-all duration-200 active:scale-90 ${
            activeTab === 'catalog'
              ? 'text-[#00B8F5] font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-colors ${
              activeTab === 'catalog' ? 'bg-[#E5F7FF]' : ''
            }`}
          >
            <Grid className={`w-5 h-5 ${activeTab === 'catalog' ? 'stroke-[2.5]' : ''}`} />
          </div>
          <span className="text-[10px]">Katalog</span>
        </button>

        {/* 3. Sevimlilar */}
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-2xl relative transition-all duration-200 active:scale-90 ${
            activeTab === 'favorites'
              ? 'text-[#FF4FA3] font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div
            className={`p-1 rounded-xl relative transition-colors ${
              activeTab === 'favorites' ? 'bg-[#FFE5F2]' : ''
            }`}
          >
            <Heart
              className={`w-5 h-5 ${
                activeTab === 'favorites' ? 'stroke-[2.5] fill-[#FF4FA3]' : ''
              }`}
            />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF4FA3] text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs">
                {favorites.length}
              </span>
            )}
          </div>
          <span className="text-[10px]">Sevimlilar</span>
        </button>

        {/* 4. Savat */}
        <button
          onClick={() => setActiveTab('cart')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-2xl relative transition-all duration-200 active:scale-90 ${
            activeTab === 'cart'
              ? 'text-[#00B8F5] font-black'
              : 'text-slate-500 hover:text-slate-800'
          } ${isCartBouncing ? 'animate-bounce-cart' : ''}`}
        >
          <div
            className={`p-1 rounded-xl relative transition-colors ${
              activeTab === 'cart' ? 'bg-[#E5F7FF]' : ''
            }`}
          >
            <ShoppingCart
              className={`w-5 h-5 ${activeTab === 'cart' ? 'stroke-[2.5]' : ''}`}
            />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#00B8F5] text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-pop">
                {cartItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Savat</span>
        </button>

        {/* 5. Profil */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-2xl transition-all duration-200 active:scale-90 ${
            activeTab === 'profile'
              ? 'text-[#00B8F5] font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-colors ${
              activeTab === 'profile' ? 'bg-[#E5F7FF]' : ''
            }`}
          >
            <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5]' : ''}`} />
          </div>
          <span className="text-[10px]">Profil</span>
        </button>
      </nav>

      {/* E-Commerce Footer */}
      <Footer
        onNavigateToCatalog={(filter) => {
          setCatalogCategoryFilter(filter?.category);
          setCatalogGenderFilter(filter?.gender);
          setActiveTab('catalog');
        }}
        onNavigateToFavorites={() => setActiveTab('favorites')}
        onNavigateToCart={() => setActiveTab('cart')}
        onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
      />

      {/* Product Details Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isProductDetailOpen}
        onClose={() => setIsProductDetailOpen(false)}
        onAddToCart={handleAddToCart}
        isFavorite={selectedProduct ? favorites.includes(selectedProduct.id) : false}
        onToggleFavorite={handleToggleFavorite}
        reviews={reviews}
        onAddReview={handleAddReview}
        onDirectBuy={handleDirectBuy}
      />

      {/* Order Success Celebratory Modal */}
      <OrderSuccessModal
        order={placedOrderSuccess}
        isOpen={!!placedOrderSuccess}
        onClose={() => setPlacedOrderSuccess(null)}
        onViewOrder={() => {
          setPlacedOrderSuccess(null);
          setActiveTab('profile');
        }}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        notifications={notifications}
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onMarkAsRead={(id) => storageService.markNotificationAsRead(id)}
        onMarkAllAsRead={() => storageService.markAllNotificationsAsRead()}
      />
    </div>
  );

  // If Mobile Simulator Mode is active, wrap inside DeviceFrame
  if (isSimulatorMode) {
    return (
      <DeviceFrame
        activeMode={deviceMode}
        onModeChange={(mode) => setDeviceMode(mode)}
        isOffline={isOffline}
        onToggleOffline={() => setIsOffline(!isOffline)}
        onOpenAdmin={() => setIsAdminPortalOpen(true)}
        isAdminOpen={isAdminPortalOpen}
        onReplaySplash={() => setShowSplash(true)}
      >
        {renderClientStoreContent(true)}
      </DeviceFrame>
    );
  }

  // DEFAULT MODE: Full-width modern responsive web store
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {renderClientStoreContent(false)}
    </div>
  );
}
