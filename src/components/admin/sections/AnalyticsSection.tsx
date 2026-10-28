import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  PieChart,
  DollarSign,
  ArrowUpRight,
  Package,
  Store,
  Globe
} from 'lucide-react';
import { Order, OfflineSale, Product, Expense } from '../../../types';

interface AnalyticsSectionProps {
  orders: Order[];
  offlineSales: OfflineSale[];
  products: Product[];
  expenses: Expense[];
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  orders,
  offlineSales,
  products,
  expenses
}) => {
  const [period, setPeriod] = useState<'kunlik' | 'haftalik' | 'oylik' | 'yillik'>('oylik');

  // Calculations
  const validOrders = orders.filter((o) => o.status !== 'Bekor qilingan');
  const cancelledOrders = orders.filter((o) => o.status === 'Bekor qilingan');

  const onlineRevenue = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const offlineRevenue = offlineSales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalRevenue = onlineRevenue + offlineRevenue;

  const onlineCost = validOrders.reduce((sum, o) => sum + o.totalCost, 0);
  const offlineCost = offlineSales.reduce((sum, s) => sum + s.totalCost, 0);
  const totalCOGS = onlineCost + offlineCost;

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalCOGS - totalExpenses;

  const totalSoldUnits =
    validOrders.reduce(
      (sum, o) => sum + o.items.reduce((iSum, i) => iSum + i.quantity, 0),
      0
    ) +
    offlineSales.reduce(
      (sum, s) => sum + s.items.reduce((iSum, i) => iSum + i.quantity, 0),
      0
    );

  // Warehouse total valuation
  const inventoryValuation = products.reduce((sum, p) => {
    const pStock = p.variants.reduce((vSum, v) => vSum + v.stock, 0);
    return sum + pStock * p.costPrice;
  }, 0);

  // Top products
  const productSalesMap = new Map<string, { name: string; code: string; count: number; totalUZS: number }>();
  validOrders.forEach((o) => {
    o.items.forEach((it) => {
      const cur = productSalesMap.get(it.productId) || {
        name: it.productName,
        code: it.productCode,
        count: 0,
        totalUZS: 0
      };
      cur.count += it.quantity;
      cur.totalUZS += it.totalPrice;
      productSalesMap.set(it.productId, cur);
    });
  });
  offlineSales.forEach((s) => {
    s.items.forEach((it) => {
      const cur = productSalesMap.get(it.productId) || {
        name: it.productName,
        code: it.productCode,
        count: 0,
        totalUZS: 0
      };
      cur.count += it.quantity;
      cur.totalUZS += it.totalPrice;
      productSalesMap.set(it.productId, cur);
    });
  });

  const topProducts = Array.from(productSalesMap.values()).sort((a, b) => b.count - a.count);

  // Export to CSV Function
  const handleExportCSV = () => {
    const headers = ['Tur', 'Raqam', 'Sana', 'Mijoz', 'Summa_UZS', 'Tannarx_UZS', 'To‘lov_Usuli', 'Holati'];
    const rows = [
      ...validOrders.map((o) => [
        'Onlayn',
        o.orderNumber,
        o.createdAt,
        `"${o.customerName}"`,
        o.totalAmount,
        o.totalCost,
        o.paymentMethod,
        `"${o.status}"`
      ]),
      ...offlineSales.map((s) => [
        'Oflayn',
        s.receiptNumber,
        s.createdAt,
        `"${s.customerName || 'Kassa'}"`,
        s.totalAmount,
        s.totalCost,
        s.paymentMethod,
        '"Yakunlandi"'
      ])
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MITTIVOY_Savdo_Hisoboti_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>10. Biznes Analitika & Statistika</span>
          </h2>
          <p className="text-xs text-slate-500">
            Tushum, tannarx, xarajatlar va hisoblangan sof foyda grafikalari
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Period filter */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
            {(
              [
                { id: 'kunlik', label: 'Bugun' },
                { id: 'haftalik', label: 'Hafta' },
                { id: 'oylik', label: 'Oy' },
                { id: 'yillik', label: 'Yil' }
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  period === p.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* CSV Export Button */}
          <button
            onClick={handleExportCSV}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-3.5 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Excel / CSV</span>
          </button>
        </div>
      </div>

      {/* Main Financial KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Revenue */}
        <div className="bg-white border border-slate-200 p-4 rounded-3xl space-y-1 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold block">Umumiy Tushum:</span>
          <div className="text-xl font-black text-slate-900 font-mono">
            {totalRevenue.toLocaleString('uz-UZ')} UZS
          </div>
          <div className="text-[10px] text-slate-400 pt-1">
            Onlayn va Oflayn savdolar
          </div>
        </div>

        {/* COGS (Tannarxi) */}
        <div className="bg-white border border-slate-200 p-4 rounded-3xl space-y-1 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold block">Mahsulot Tannarxi:</span>
          <div className="text-xl font-black text-amber-600 font-mono">
            {totalCOGS.toLocaleString('uz-UZ')} UZS
          </div>
          <div className="text-[10px] text-slate-400 pt-1">
            Sotilgan tovarlar tannarxi
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white border border-slate-200 p-4 rounded-3xl space-y-1 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold block">Do‘kon Xarajatlari:</span>
          <div className="text-xl font-black text-pink-600 font-mono">
            {totalExpenses.toLocaleString('uz-UZ')} UZS
          </div>
          <div className="text-[10px] text-slate-400 pt-1">
            Ijara, maosh, reklama, kirim
          </div>
        </div>

        {/* Calculated Net Profit */}
        <div className="bg-white border border-slate-200 p-4 rounded-3xl space-y-1 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold block">Sof Foyda:</span>
          <div
            className={`text-xl font-black font-mono ${
              netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {netProfit.toLocaleString('uz-UZ')} UZS
          </div>
          <div className="text-[10px] text-emerald-600 font-medium pt-1">
            Sof rentabellik: {totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Visual Analytics Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 1. Revenue Breakdown Card */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-4 shadow-xs">
          <h3 className="font-bold text-sm text-slate-800 flex items-center justify-between">
            <span>Moliyaviy Taqsimot (Grafik)</span>
            <span className="text-xs text-sky-600 font-mono font-bold">100%</span>
          </h3>

          <div className="space-y-3 text-xs">
            {/* Revenue bar */}
            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>Tushum</span>
                <span className="font-mono font-bold text-slate-900">
                  {totalRevenue.toLocaleString('uz-UZ')} UZS
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            {/* COGS bar */}
            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>Tannarx (Chiqim)</span>
                <span className="font-mono font-bold text-amber-600">
                  {totalCOGS.toLocaleString('uz-UZ')} UZS (
                  {totalRevenue > 0 ? Math.round((totalCOGS / totalRevenue) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{
                    width: `${totalRevenue > 0 ? (totalCOGS / totalRevenue) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            {/* Expenses bar */}
            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>Operatsion Xarajatlar</span>
                <span className="font-mono font-bold text-pink-600">
                  {totalExpenses.toLocaleString('uz-UZ')} UZS (
                  {totalRevenue > 0 ? Math.round((totalExpenses / totalRevenue) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-pink-500 rounded-full"
                  style={{
                    width: `${totalRevenue > 0 ? (totalExpenses / totalRevenue) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            {/* Net profit bar */}
            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>Sof Foyda (Foydalaniladigan)</span>
                <span className="font-mono font-bold text-emerald-600">
                  {netProfit.toLocaleString('uz-UZ')} UZS
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{
                    width: `${totalRevenue > 0 ? Math.max(0, (netProfit / totalRevenue) * 100) : 0}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Channel Split: Online vs Offline */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-4 shadow-xs">
          <h3 className="font-bold text-sm text-slate-800">
            Savdo Kanallari: Onlayn va Oflayn
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-sky-600">
                <Globe className="w-4 h-4" />
                <span className="font-bold">Onlayn Ilova</span>
              </div>
              <div className="text-base font-black text-slate-900 font-mono">
                {onlineRevenue.toLocaleString('uz-UZ')} UZS
              </div>
              <span className="text-[10px] text-slate-400 block">
                {validOrders.length} ta buyurtma ({totalRevenue > 0 ? Math.round((onlineRevenue / totalRevenue) * 100) : 0}%)
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600">
                <Store className="w-4 h-4" />
                <span className="font-bold">Oflayn Kassa</span>
              </div>
              <div className="text-base font-black text-slate-900 font-mono">
                {offlineRevenue.toLocaleString('uz-UZ')} UZS
              </div>
              <span className="text-[10px] text-slate-400 block">
                {offlineSales.length} ta chek ({totalRevenue > 0 ? Math.round((offlineRevenue / totalRevenue) * 100) : 0}%)
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
            <div className="flex justify-between text-slate-600">
              <span>Sotilgan jami kiyimlar soni:</span>
              <span className="font-bold text-slate-800">{totalSoldUnits} dona</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Bekor qilingan buyurtmalar:</span>
              <span className="font-bold text-rose-600">{cancelledOrders.length} ta</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Ombordagi mavjud tovarlar qiymati:</span>
              <span className="font-mono font-bold text-sky-600">
                {inventoryValuation.toLocaleString('uz-UZ')} UZS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Selling Products List */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 shadow-xs">
        <h3 className="font-bold text-sm text-slate-800">Eng Ko‘p Sotilgan Modellar</h3>
        <div className="space-y-2">
          {topProducts.slice(0, 5).map((p, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-sky-50 text-sky-600 font-bold flex items-center justify-center text-xs">
                  {idx + 1}
                </span>
                <div>
                  <span className="font-bold text-slate-800 text-xs block">{p.name}</span>
                  <span className="font-mono text-[10px] text-slate-400">{p.code}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-bold text-slate-800 text-xs block">
                  {p.count} dona sotildi
                </span>
                <span className="font-mono text-sky-600 text-[11px] font-bold">
                  {p.totalUZS.toLocaleString('uz-UZ')} UZS
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
