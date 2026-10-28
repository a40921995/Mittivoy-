import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle,
  XCircle,
  RotateCcw,
  Eye,
  AlertCircle,
  Check,
  Search
} from 'lucide-react';
import { Order } from '../../../types';
import { storageService } from '../../../services/storageService';

interface PaymentsSectionProps {
  orders: Order[];
}

export const PaymentsSection: React.FC<PaymentsSectionProps> = ({ orders }) => {
  const [filter, setFilter] = useState<'barchasi' | 'kutilayotgan' | 'tasdiqlangan' | 'rad_etilgan'>('barchasi');
  const [inspectedOrder, setInspectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (filter === 'kutilayotgan') return o.paymentStatus === 'Tekshirilmoqda';
    if (filter === 'tasdiqlangan') return o.paymentStatus === 'Tasdiqlandi';
    if (filter === 'rad_etilgan') return o.paymentStatus === 'Rad etildi';
    return true;
  });

  const handleApprove = (order: Order) => {
    storageService.updateOrderStatus(order.id, 'Tasdiqlangan', 'Tasdiqlandi');
    if (inspectedOrder && inspectedOrder.id === order.id) {
      setInspectedOrder({
        ...inspectedOrder,
        status: 'Tasdiqlangan',
        paymentStatus: 'Tasdiqlandi'
      });
    }
  };

  const handleReject = (order: Order) => {
    storageService.updateOrderStatus(order.id, 'To‘lov kutilmoqda', 'Rad etildi');
    if (inspectedOrder && inspectedOrder.id === order.id) {
      setInspectedOrder({
        ...inspectedOrder,
        status: 'To‘lov kutilmoqda',
        paymentStatus: 'Rad etildi'
      });
    }
  };

  const handleRecheck = (order: Order) => {
    storageService.updateOrderStatus(order.id, 'To‘lov tekshirilmoqda', 'Tekshirilmoqda');
    if (inspectedOrder && inspectedOrder.id === order.id) {
      setInspectedOrder({
        ...inspectedOrder,
        status: 'To‘lov tekshirilmoqda',
        paymentStatus: 'Tekshirilmoqda'
      });
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-800">8. To‘lovlar Reestri (Click & Paynet)</h2>
          <p className="text-xs text-slate-500">
            Tranzaksiyalar, chek fotosuratlari, tasdiqlash va rad etish boshqaruvi
          </p>
        </div>

        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          {(
            [
              { id: 'barchasi', label: 'Barchasi' },
              { id: 'kutilayotgan', label: 'Kutilayotgan' },
              { id: 'tasdiqlangan', label: 'Tasdiqlangan' },
              { id: 'rad_etilgan', label: 'Rad etilgan' }
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === t.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-500">
              <tr>
                <th className="p-3.5 font-semibold">Buyurtma</th>
                <th className="p-3.5 font-semibold">Mijoz</th>
                <th className="p-3.5 font-semibold">To‘lov Tizimi</th>
                <th className="p-3.5 font-semibold">Tranzaksiya ID</th>
                <th className="p-3.5 font-semibold">Summa</th>
                <th className="p-3.5 font-semibold">Chek</th>
                <th className="p-3.5 font-semibold">Holati</th>
                <th className="p-3.5 font-semibold text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-mono font-bold text-slate-800">
                    #{ord.orderNumber}
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-slate-800 block">{ord.customerName}</span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {ord.customerPhone}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`font-black text-xs ${
                        ord.paymentMethod === 'Click' ? 'text-sky-600' : 'text-emerald-600'
                      }`}
                    >
                      {ord.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-600">
                    {ord.paymentTransactionId || '-'}
                  </td>
                  <td className="p-3.5 font-mono font-black text-slate-900">
                    {ord.totalAmount.toLocaleString('uz-UZ')} UZS
                  </td>
                  <td className="p-3.5">
                    {ord.paymentReceiptUrl ? (
                      <button
                        onClick={() => setInspectedOrder(ord)}
                        className="text-sky-600 hover:text-sky-700 underline font-semibold flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Chekni ko‘rish</span>
                      </button>
                    ) : (
                      <span className="text-slate-400 italic">Chek yo‘q</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        ord.paymentStatus === 'Tasdiqlandi'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : ord.paymentStatus === 'Tekshirilmoqda'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : ord.paymentStatus === 'Rad etildi'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleApprove(ord)}
                        className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white transition-colors"
                        title="To‘lovni tasdiqlash"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleReject(ord)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white transition-colors"
                        title="To‘lovni rad etish"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRecheck(ord)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-sky-500 text-slate-600 hover:text-white transition-colors"
                        title="Tekshiruvga qaytarish"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Receipt Modal */}
      {inspectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-800">
                To‘lov Cheki: #{inspectedOrder.orderNumber}
              </h3>
              <button
                onClick={() => setInspectedOrder(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Mijoz:</span>
                <span className="font-bold text-slate-800">
                  {inspectedOrder.customerName} ({inspectedOrder.customerPhone})
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Summa:</span>
                <span className="font-mono font-black text-sky-600 text-sm">
                  {inspectedOrder.totalAmount.toLocaleString('uz-UZ')} UZS
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>To‘lov usuli:</span>
                <span className="font-bold text-slate-800">{inspectedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tranzaksiya:</span>
                <span className="font-mono text-slate-800">
                  {inspectedOrder.paymentTransactionId || '-'}
                </span>
              </div>

              {inspectedOrder.paymentReceiptUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center max-h-72">
                  <img
                    src={inspectedOrder.paymentReceiptUrl}
                    alt="Receipt inspection"
                    className="max-h-72 object-contain"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleApprove(inspectedOrder)}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl transition-all shadow-xs"
                >
                  To‘lovni Tasdiqlash
                </button>
                <button
                  onClick={() => handleReject(inspectedOrder)}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-2.5 rounded-xl transition-all shadow-xs"
                >
                  Rad Etish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
