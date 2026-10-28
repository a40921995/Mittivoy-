import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  DollarSign,
  AlertTriangle,
  Store,
  Globe,
  ArrowRight,
  Clock,
  CheckCircle,
  CreditCard,
  Users,
  Receipt,
  Warehouse
} from 'lucide-react';
import { Order, OfflineSale, Product, Expense } from '../../../types';
import { AdminSection } from '../AdminLayout';

interface DashboardSectionProps {
  orders: Order[];
  offlineSales: OfflineSale[];
  products: Product[];
  expenses: Expense[];
  onNavigate: (section: AdminSection) => void;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  orders,
  offlineSales,
  products,
  expenses,
  onNavigate
}) => {
  // Financial Calculations
  const onlineRevenue = orders
    .filter((o) => o.status !== 'Bekor qilingan')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const offlineRevenue = offlineSales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalRevenue = onlineRevenue + offlineRevenue;

  const onlineCost = orders
    .filter((o) => o.status !== 'Bekor qilingan')
    .reduce((sum, o) => sum + o.totalCost, 0);

  const offlineCost = offlineSales.reduce((sum, s) => sum + s.totalCost, 0);
  const totalCost = onlineCost + offlineCost;

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalCost - totalExpenses;

  // Pending actions
  const pendingOrders = orders.filter((o) => o.status === 'Yangi' || o.status === 'To‘lov tekshirilmoqda');
  const pendingPayments = orders.filter((o) => o.paymentStatus === 'Tekshirilmoqda');

  // Low stock calculation
  let lowStockVariantsCount = 0;
  let totalStockCount = 0;
  products.forEach((p) => {
    p.variants.forEach((v) => {
      totalStockCount += v.stock;
      if (v.stock <= 3) lowStockVariantsCount++;
    });
  });

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            1. Boshqaruv Paneli (Dashboard)
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            MITTIVOY do‘konining umumiy moliyaviy ko‘rsatkichlari va tezkor nazorat markazi
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Tizim Faol & Himoyalangan
          </span>
        </div>
      </div>

      {/* Urgent Action Alerts */}
      {(pendingPayments.length > 0 || lowStockVariantsCount > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {pendingPayments.length > 0 && (
            <div
              onClick={() => onNavigate('payments')}
              className="bg-[#FFE5F2] border border-[#FF4FA3]/30 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-pink-100/70 transition-colors shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FF4FA3] text-white flex items-center justify-center shadow-xs">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900">
                    {pendingPayments.length} ta to‘lov cheki tekshiruv kutilmoqda!
                  </h4>
                  <p className="text-[11px] text-pink-700 font-medium">
                    Click / Paynet orqali skrinshot yuklangan buyurtmalar
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#FF4FA3]" />
            </div>
          )}

          {lowStockVariantsCount > 0 && (
            <div
              onClick={() => onNavigate('inventory')}
              className="bg-[#FFF7D6] border border-[#FFD76A]/60 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-amber-100/70 transition-colors shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFD76A] text-slate-900 flex items-center justify-center shadow-xs">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900">
                    {lowStockVariantsCount} ta o‘lchamda kam qoldiq (&le;3 dona)
                  </h4>
                  <p className="text-[11px] text-amber-800 font-medium">
                    Omborga tezkor tovar kirimi qo‘shish tavsiya etiladi
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-700" />
            </div>
          )}
        </div>
      )}

      {/* 5 Distinct Color KPI Cards as requested:
          1. Daromad / Sof Foyda: Yashil (#9BE7C4 / #059669)
          2. Buyurtmalar: Ko‘k (#00B8F5 / #0284C7)
          3. Xarajatlar: Pushti (#FF4FA3 / #E11D48)
          4. Ombor: Binafsha (#A78BFA / #7C3AED)
          5. Kam qolgan: Sariq (#FFD76A / #D97706)
      */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* 1. Daromad (Yashil) */}
        <div className="bg-white border-2 border-[#9BE7C4] p-4 rounded-3xl shadow-xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600">Umumiy Daromad</span>
            <div className="w-8 h-8 rounded-xl bg-[#E6FBF0] text-[#059669] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base sm:text-lg font-black text-slate-900 font-mono">
            {totalRevenue.toLocaleString('uz-UZ')} <span className="text-[10px] text-slate-500 font-normal">UZS</span>
          </div>
          <div className="text-[10px] text-emerald-700 font-bold bg-[#E6FBF0] px-2 py-0.5 rounded-md inline-block">
            Sof Foyda: {netProfit.toLocaleString('uz-UZ')} UZS
          </div>
        </div>

        {/* 2. Buyurtmalar (Ko‘k) */}
        <div className="bg-white border-2 border-[#00B8F5] p-4 rounded-3xl shadow-xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600">Buyurtmalar</span>
            <div className="w-8 h-8 rounded-xl bg-[#E5F7FF] text-[#0096C7] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base sm:text-lg font-black text-slate-900">
            {orders.length} <span className="text-xs text-slate-500 font-normal">ta</span>
          </div>
          <div className="text-[10px] text-[#0096C7] font-bold bg-[#E5F7FF] px-2 py-0.5 rounded-md inline-block">
            {pendingOrders.length} ta tekshiruvda
          </div>
        </div>

        {/* 3. Xarajatlar (Pushti) */}
        <div className="bg-white border-2 border-[#FF4FA3] p-4 rounded-3xl shadow-xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600">Xarajatlar</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFE5F2] text-[#FF4FA3] flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base sm:text-lg font-black text-slate-900 font-mono">
            {totalExpenses.toLocaleString('uz-UZ')} <span className="text-[10px] text-slate-500 font-normal">UZS</span>
          </div>
          <div className="text-[10px] text-pink-700 font-bold bg-[#FFE5F2] px-2 py-0.5 rounded-md inline-block">
            {expenses.length} ta yozuv
          </div>
        </div>

        {/* 4. Ombor Qoldig‘i (Binafsha) */}
        <div className="bg-white border-2 border-[#A78BFA] p-4 rounded-3xl shadow-xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600">Ombor Zaxirasi</span>
            <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center">
              <Warehouse className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base sm:text-lg font-black text-slate-900">
            {totalStockCount} <span className="text-xs text-slate-500 font-normal">dona</span>
          </div>
          <div className="text-[10px] text-purple-700 font-bold bg-[#EDE9FE] px-2 py-0.5 rounded-md inline-block">
            {products.length} xil model
          </div>
        </div>

        {/* 5. Kam Qolganlar (Sariq) */}
        <div className="bg-white border-2 border-[#FFD76A] p-4 rounded-3xl shadow-xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600">Kam Qolgan Tovar</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF7D6] text-[#B45309] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base sm:text-lg font-black text-slate-900">
            {lowStockVariantsCount} <span className="text-xs text-slate-500 font-normal">ta</span>
          </div>
          <div className="text-[10px] text-amber-800 font-bold bg-[#FFF7D6] px-2 py-0.5 rounded-md inline-block">
            &le;3 dona qoldi
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-sm text-slate-900">Tezkor Boshqaruv Tugmalari</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <button
            onClick={() => onNavigate('offline_sales')}
            className="p-4 bg-white hover:bg-[#E6FBF0] border border-slate-200 rounded-2xl flex flex-col items-center gap-2 transition-all active:scale-95 shadow-xs"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#E6FBF0] text-[#059669] flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900 text-center">Oflayn Kassa (POS)</span>
          </button>

          <button
            onClick={() => onNavigate('products')}
            className="p-4 bg-white hover:bg-[#E5F7FF] border border-slate-200 rounded-2xl flex flex-col items-center gap-2 transition-all active:scale-95 shadow-xs"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#E5F7FF] text-[#00B8F5] flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900 text-center">+ Yangi Mahsulot</span>
          </button>

          <button
            onClick={() => onNavigate('inventory')}
            className="p-4 bg-white hover:bg-[#FFF7D6] border border-slate-200 rounded-2xl flex flex-col items-center gap-2 transition-all active:scale-95 shadow-xs"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#FFF7D6] text-[#B45309] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900 text-center">Omborga Kirim</span>
          </button>

          <button
            onClick={() => onNavigate('telegram')}
            className="p-4 bg-white hover:bg-[#EDE9FE] border border-slate-200 rounded-2xl flex flex-col items-center gap-2 transition-all active:scale-95 shadow-xs"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900 text-center">Telegram Bot</span>
          </button>
        </div>
      </div>

      {/* Recent Orders Overview Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm text-slate-900">So‘nggi Buyurtmalar</h3>
          <button
            onClick={() => onNavigate('orders')}
            className="text-xs text-[#0096C7] hover:text-[#00B8F5] font-extrabold flex items-center gap-1"
          >
            <span>Barchasi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold">
                <th className="pb-3">Buyurtma</th>
                <th className="pb-3">Mijoz</th>
                <th className="pb-3">Summa</th>
                <th className="pb-3">To‘lov</th>
                <th className="pb-3">Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.slice(0, 5).map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 font-mono font-bold text-slate-900">
                    #{ord.orderNumber}
                  </td>
                  <td className="py-3 font-medium text-slate-800">{ord.customerName}</td>
                  <td className="py-3 font-mono font-black text-[#0096C7]">
                    {ord.totalAmount.toLocaleString('uz-UZ')} UZS
                  </td>
                  <td className="py-3 font-bold text-slate-700">{ord.paymentMethod}</td>
                  <td className="py-3">
                    <span className="bg-[#E5F7FF] text-[#0096C7] border border-[#00B8F5]/30 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                      {ord.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
