import React from 'react';
import { Globe, ShoppingBag, Truck, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { Order } from '../../../types';

interface OnlineSalesSectionProps {
  orders: Order[];
}

export const OnlineSalesSection: React.FC<OnlineSalesSectionProps> = ({ orders }) => {
  const onlineOrders = orders.filter((o) => o.isOnline);

  const deliveredCount = onlineOrders.filter((o) => o.status === 'Yetkazilgan').length;
  const inTransitCount = onlineOrders.filter((o) => o.status === 'Yetkazilmoqda' || o.status === 'Tayyorlanmoqda').length;
  const totalRevenue = onlineOrders
    .filter((o) => o.status !== 'Bekor qilingan')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-800">5. Onlayn Savdo Ko‘rsatkichlari</h2>
          <p className="text-xs text-slate-500">
            Mobil ilova orqali tushgan buyurtmalar, kuryer jo‘natmalari va viloyatlar taqsimoti
          </p>
        </div>
        <span className="bg-sky-50 text-sky-700 border border-sky-200 text-xs px-3 py-1 rounded-xl font-bold">
          {onlineOrders.length} ta onlayn buyurtma
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-1 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold">Onlayn Savdo Tushumi</span>
          <div className="text-xl font-black text-sky-600 font-mono">
            {totalRevenue.toLocaleString('uz-UZ')} UZS
          </div>
          <span className="text-[10px] text-slate-400">Mobil savdo aylanmasi</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-1 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold">Yetkazish Jarayonida</span>
          <div className="text-xl font-black text-purple-600">
            {inTransitCount} ta buyurtma
          </div>
          <span className="text-[10px] text-slate-400">Kuryer va ombor yig‘uvida</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-1 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold">Muvaffaqiyatli Yetkazildi</span>
          <div className="text-xl font-black text-emerald-600">
            {deliveredCount} ta buyurtma
          </div>
          <span className="text-[10px] text-slate-400">Mijozlar qabul qilib olgan</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 text-xs font-bold text-slate-800 bg-[#F8FAFC]">
          Onlayn Buyurtmalar Jo‘natma Ro‘yxati
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-500">
              <tr>
                <th className="p-3.5 font-semibold">Raqam</th>
                <th className="p-3.5 font-semibold">Mijoz</th>
                <th className="p-3.5 font-semibold">Viloyat va Manzil</th>
                <th className="p-3.5 font-semibold">Summa</th>
                <th className="p-3.5 font-semibold">To‘lov</th>
                <th className="p-3.5 font-semibold">Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {onlineOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-mono font-bold text-slate-800">#{ord.orderNumber}</td>
                  <td className="p-3.5">
                    <span className="font-bold text-slate-800 block">{ord.customerName}</span>
                    <span className="font-mono text-[10px] text-slate-400">{ord.customerPhone}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="text-slate-700 block">{ord.region}</span>
                    <span className="text-[10px] text-slate-400">{ord.district}, {ord.address}</span>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-sky-600">
                    {ord.totalAmount.toLocaleString('uz-UZ')} UZS
                  </td>
                  <td className="p-3.5 text-slate-600">{ord.paymentMethod}</td>
                  <td className="p-3.5">
                    <span className="bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
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
