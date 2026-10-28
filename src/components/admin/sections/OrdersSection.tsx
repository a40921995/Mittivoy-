import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  Package,
  Truck,
  XCircle,
  Eye,
  FileText,
  MapPin,
  Phone,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { Order, OrderStatus, PaymentStatus } from '../../../types';
import { storageService } from '../../../services/storageService';

interface OrdersSectionProps {
  orders: Order[];
}

export const OrdersSection: React.FC<OrdersSectionProps> = ({ orders }) => {
  const [filterStatus, setFilterStatus] = useState<string>('barchasi');
  const [search, setSearch] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const statuses: OrderStatus[] = [
    'Yangi',
    'To‘lov kutilmoqda',
    'To‘lov tekshirilmoqda',
    'Tasdiqlangan',
    'Tayyorlanmoqda',
    'Yetkazilmoqda',
    'Yetkazilgan',
    'Bekor qilingan'
  ];

  const filteredOrders = orders.filter((o) => {
    const matchStatus = filterStatus === 'barchasi' || o.status === filterStatus;
    const matchSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search);
    return matchStatus && matchSearch;
  });

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    storageService.updateOrderStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        status: newStatus
      });
    }
  };

  const handleApprovePayment = (order: Order) => {
    storageService.updateOrderStatus(order.id, 'Tasdiqlangan', 'Tasdiqlandi');
    if (selectedOrder && selectedOrder.id === order.id) {
      setSelectedOrder({
        ...selectedOrder,
        status: 'Tasdiqlangan',
        paymentStatus: 'Tasdiqlandi'
      });
    }
  };

  const handleRejectPayment = (order: Order) => {
    storageService.updateOrderStatus(order.id, 'To‘lov kutilmoqda', 'Rad etildi');
    if (selectedOrder && selectedOrder.id === order.id) {
      setSelectedOrder({
        ...selectedOrder,
        status: 'To‘lov kutilmoqda',
        paymentStatus: 'Rad etildi'
      });
    }
  };

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">4. Buyurtmalar Boshqaruvi</h2>
          <p className="text-xs text-slate-500">
            Mijozlar buyurtmalari, holat boshqaruvi, to‘lov cheklari va yetkazib berish nazorati
          </p>
        </div>

        <span className="bg-sky-50 text-sky-700 border border-sky-200 text-xs px-3 py-1 rounded-xl font-bold">
          Jami {orders.length} ta buyurtma
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buyurtma raqami (#MT-...), mijoz ismi yoki telefon..."
            className="w-full bg-white border border-slate-200 text-slate-800 text-xs pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-sky-500 placeholder-slate-400 shadow-xs"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white border border-slate-200 text-slate-700 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-sky-500 shadow-xs font-medium"
        >
          <option value="barchasi">Barcha holatlar</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-500">
              <tr>
                <th className="p-3.5 font-semibold">Buyurtma</th>
                <th className="p-3.5 font-semibold">Mijoz / Telefon</th>
                <th className="p-3.5 font-semibold">Viloyat / Manzil</th>
                <th className="p-3.5 font-semibold">Summa</th>
                <th className="p-3.5 font-semibold">To‘lov Holati</th>
                <th className="p-3.5 font-semibold">Buyurtma Holati</th>
                <th className="p-3.5 font-semibold text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Buyurtmalar topilmadi
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5">
                      <span className="font-mono font-bold text-slate-800 block">
                        #{ord.orderNumber}
                      </span>
                      <span className="text-[10px] text-slate-400">{ord.createdAt}</span>
                    </td>

                    <td className="p-3.5">
                      <span className="font-bold text-slate-800 block">{ord.customerName}</span>
                      <span className="font-mono text-[11px] text-slate-500">
                        {ord.customerPhone}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className="text-slate-700 font-medium block">{ord.region}</span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[150px] block">
                        {ord.district}, {ord.address}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className="font-black text-sky-600 block">
                        {ord.totalAmount.toLocaleString('uz-UZ')} UZS
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {ord.items.length} xil tovar
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className="font-semibold text-slate-700 block">
                        {ord.paymentMethod}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                          ord.paymentStatus === 'Tasdiqlandi'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : ord.paymentStatus === 'Tekshirilmoqda'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <select
                        value={ord.status}
                        onChange={(e) =>
                          handleUpdateStatus(ord.id, e.target.value as OrderStatus)
                        }
                        className="bg-slate-50 border border-slate-200 text-slate-800 text-xs px-2.5 py-1.5 rounded-xl font-bold focus:outline-none focus:border-sky-500"
                      >
                        {statuses.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-sky-500 text-slate-600 hover:text-white transition-colors"
                        title="Batafsil ko‘rish"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Receipt Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-5 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-800">
                  Buyurtma #{selectedOrder.orderNumber}
                </h3>
                <span className="text-xs text-slate-400">{selectedOrder.createdAt}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Quick Action Payment Approval if pending */}
            {selectedOrder.paymentStatus === 'Tekshirilmoqda' && (
              <div className="bg-sky-50 border border-sky-200 p-3.5 rounded-2xl flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-xs text-sky-900">
                    To‘lov cheki tekshirilmoqda ({selectedOrder.paymentMethod})
                  </h4>
                  <p className="text-[11px] text-sky-700">
                    Tranzaksiya: {selectedOrder.paymentTransactionId || 'Trx raqami yo‘q'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprovePayment(selectedOrder)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all shadow-xs"
                  >
                    Tasdiqlash
                  </button>
                  <button
                    onClick={() => handleRejectPayment(selectedOrder)}
                    className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-2.5 py-1.5 rounded-xl transition-all"
                  >
                    Rad etish
                  </button>
                </div>
              </div>
            )}

            {/* Receipt Image if available */}
            {selectedOrder.paymentReceiptUrl && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-xs text-slate-800 block">
                  Yuklangan To‘lov Cheki Skrinshoti:
                </span>
                <div className="rounded-xl overflow-hidden border border-slate-200 max-h-56 bg-slate-100 flex items-center justify-center">
                  <img
                    src={selectedOrder.paymentReceiptUrl}
                    alt="Receipt"
                    className="max-h-56 object-contain"
                  />
                </div>
              </div>
            )}

            {/* Customer & Delivery */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
              <span className="font-bold text-slate-800 block">Mijoz va Manzil:</span>
              <div className="text-slate-700">
                👤 <b>{selectedOrder.customerName}</b> ({selectedOrder.customerPhone})
              </div>
              <div className="text-slate-500">
                📍 {selectedOrder.region}, {selectedOrder.district}, {selectedOrder.address}
              </div>
              {selectedOrder.notes && (
                <div className="text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                  📝 Izoh: {selectedOrder.notes}
                </div>
              )}
            </div>

            {/* Items */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-800">Buyurtma tarkibi:</span>
              <div className="space-y-1.5">
                {selectedOrder.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={it.image}
                        alt={it.productName}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <span className="font-bold text-slate-800 block text-xs">
                          {it.productName}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {it.color} • {it.size} • {it.quantity} dona
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-sky-600 text-xs">
                      {it.totalPrice.toLocaleString('uz-UZ')} UZS
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Tovarlar summasi:</span>
                <span>{selectedOrder.subtotal.toLocaleString('uz-UZ')} UZS</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Yetkazib berish:</span>
                <span>{selectedOrder.deliveryFee.toLocaleString('uz-UZ')} UZS</span>
              </div>
              <div className="flex justify-between font-bold text-slate-800 text-sm pt-1 border-t border-slate-200">
                <span>Jami to‘lov:</span>
                <span className="text-sky-600 font-mono">
                  {selectedOrder.totalAmount.toLocaleString('uz-UZ')} UZS
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
