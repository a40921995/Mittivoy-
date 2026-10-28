import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Warehouse,
  Globe,
  Store,
  Users,
  CreditCard,
  Receipt,
  BarChart3,
  MessageSquare,
  Image as ImageIcon,
  Send,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Shield
} from 'lucide-react';
import { Logo } from '../common/Logo';

export type AdminSection =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'orders'
  | 'inventory'
  | 'online_sales'
  | 'offline_sales'
  | 'customers'
  | 'payments'
  | 'expenses'
  | 'analytics'
  | 'reviews'
  | 'banners'
  | 'telegram'
  | 'notifications'
  | 'settings';

interface AdminLayoutProps {
  activeSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  onExitAdmin: () => void;
  pendingOrdersCount: number;
  pendingPaymentsCount: number;
  lowStockCount: number;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeSection,
  onSelectSection,
  onExitAdmin,
  pendingOrdersCount,
  pendingPaymentsCount,
  lowStockCount,
  children
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const menuItems: {
    id: AdminSection;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
  }[] = [
    { id: 'dashboard', label: '1. Boshqaruv paneli', icon: LayoutDashboard },
    { id: 'products', label: '2. Mahsulotlar', icon: Package },
    { id: 'categories', label: '3. Kategoriyalar', icon: Layers },
    {
      id: 'orders',
      label: '4. Buyurtmalar',
      icon: ShoppingBag,
      badge: pendingOrdersCount,
      badgeColor: 'bg-[#00B8F5]'
    },
    {
      id: 'inventory',
      label: '5. Ombor hisobi',
      icon: Warehouse,
      badge: lowStockCount,
      badgeColor: 'bg-[#FFD76A] text-slate-900'
    },
    { id: 'online_sales', label: '6. Onlayn savdo', icon: Globe },
    { id: 'offline_sales', label: '7. Oflayn savdo (POS)', icon: Store },
    { id: 'customers', label: '8. Mijozlar', icon: Users },
    {
      id: 'payments',
      label: '9. To‘lovlar',
      icon: CreditCard,
      badge: pendingPaymentsCount,
      badgeColor: 'bg-[#FF4FA3]'
    },
    { id: 'expenses', label: '10. Xarajatlar', icon: Receipt },
    { id: 'analytics', label: '11. Statistika & Analitika', icon: BarChart3 },
    { id: 'reviews', label: '12. Izohlar va reytinglar', icon: MessageSquare },
    { id: 'banners', label: '13. Bannerlar', icon: ImageIcon },
    { id: 'telegram', label: '14. Telegram bot', icon: Send },
    { id: 'notifications', label: '15. Bildirishnomalar', icon: Bell },
    { id: 'settings', label: '16. Sozlamalar', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col antialiased">
      {/* Modern Professional Light Navbar */}
      <header className="h-16 bg-white border-b border-slate-200/90 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40 shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Logo size="sm" isLight={false} showSubtitle={false} />
          <span className="hidden sm:inline bg-[#E5F7FF] text-[#0096C7] border border-[#00B8F5]/30 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Admin Boshqaruv
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Quick Exit to Mobile Store */}
          <button
            onClick={onExitAdmin}
            className="bg-gradient-to-r from-[#00B8F5] to-[#0096C7] hover:opacity-95 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Mobil Do‘konga Qaytish</span>
          </button>

          <button
            onClick={onExitAdmin}
            className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-500 transition-colors"
            title="Chiqish"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed md:static inset-y-16 left-0 w-64 bg-white border-r border-slate-200/90 flex flex-col z-30 transition-transform duration-300 md:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}
        >
          <div className="p-3.5 px-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">
            Boshqaruv Bo‘limlari (16)
          </div>

          <nav className="flex-1 overflow-y-auto px-2 space-y-1 pb-8 text-xs">
            {menuItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectSection(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all ${
                    isActive
                      ? 'bg-[#E5F7FF] text-[#0096C7] shadow-xs border border-[#00B8F5]/30'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <IconComp
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-[#00B8F5]' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[9px] font-black text-white px-2 py-0.5 rounded-full ${
                        item.badgeColor || 'bg-[#00B8F5]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Area in Light Professional Theme */}
        <main className="flex-1 bg-[#F8FAFC] overflow-y-auto p-4 sm:p-6 text-slate-800">
          <div className="max-w-6xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
