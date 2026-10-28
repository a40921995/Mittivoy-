import React, { useState } from 'react';
import { Users, Phone, MapPin, ShoppingBag, Search } from 'lucide-react';
import { Order } from '../../../types';

interface CustomersSectionProps {
  orders: Order[];
}

export const CustomersSection: React.FC<CustomersSectionProps> = ({ orders }) => {
  const [search, setSearch] = useState<string>('');

  // Extract distinct customers from orders
  const customerMap = new Map<
    string,
    {
      phone: string;
      name: string;
      region: string;
      district: string;
      ordersCount: number;
      totalSpent: number;
      lastOrderDate: string;
    }
  >();

  orders.forEach((o) => {
    const key = o.customerPhone;
    const existing = customerMap.get(key);
    if (existing) {
      existing.ordersCount += 1;
      existing.totalSpent += o.totalAmount;
      if (o.createdAt > existing.lastOrderDate) {
        existing.lastOrderDate = o.createdAt;
      }
    } else {
      customerMap.set(key, {
        phone: o.customerPhone,
        name: o.customerName,
        region: o.region,
        district: o.district,
        ordersCount: 1,
        totalSpent: o.totalAmount,
        lastOrderDate: o.createdAt
      });
    }
  });

  const customers = Array.from(customerMap.values()).filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.region.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-800">7. Mijozlar Ro‘yxati</h2>
          <p className="text-xs text-slate-500">
            Do‘kon xaridorlari, buyurtmalar soni, umumiy xarid qiymati (LTV) va aloqa ma’lumotlari
          </p>
        </div>
        <span className="bg-sky-50 text-sky-700 border border-sky-200 text-xs px-3 py-1 rounded-xl font-bold">
          {customers.length} nafar mijoz
        </span>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Mijoz ismi, telefon raqami yoki viloyat bo‘yicha qidiring..."
          className="w-full bg-white border border-slate-200 text-slate-800 text-xs pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-sky-500 shadow-xs placeholder-slate-400"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-500">
              <tr>
                <th className="p-3.5 font-semibold">Mijoz Ismi</th>
                <th className="p-3.5 font-semibold">Telefon Raqami</th>
                <th className="p-3.5 font-semibold">Hudud</th>
                <th className="p-3.5 font-semibold">Buyurtmalar</th>
                <th className="p-3.5 font-semibold">Umumiy Xarid</th>
                <th className="p-3.5 font-semibold">So‘nggi Faollik</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((c, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xs border border-sky-100">
                        {c.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-800 text-xs">{c.name}</span>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-slate-600 font-medium">{c.phone}</td>
                  <td className="p-3.5 text-slate-600">
                    {c.region}, {c.district}
                  </td>
                  <td className="p-3.5 font-bold text-slate-800">{c.ordersCount} ta</td>
                  <td className="p-3.5 font-mono font-bold text-sky-600">
                    {c.totalSpent.toLocaleString('uz-UZ')} UZS
                  </td>
                  <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                    {c.lastOrderDate}
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
