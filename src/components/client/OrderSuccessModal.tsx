import React from 'react';
import { CheckCircle2, Copy, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { Order } from '../../types';
import { Logo } from '../common/Logo';

interface OrderSuccessModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onViewOrder: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  isOpen,
  onClose,
  onViewOrder
}) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-sky-100 text-center space-y-4 animate-scaleUp">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div>
          <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest">
            Xaridingiz uchun rahmat!
          </span>
          <h3 className="font-extrabold text-base text-slate-800 mt-0.5">
            Buyurtma Qabul Qilindi
          </h3>
          <div className="mt-2 inline-flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Buyurtma raqami:</span>
            <span className="font-mono font-bold text-slate-800 text-xs">
              #{order.orderNumber}
            </span>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-sky-50/70 p-3 rounded-2xl border border-sky-100 text-left text-xs space-y-1.5">
          <div className="flex justify-between font-bold text-slate-800">
            <span>To‘lov usuli:</span>
            <span className="text-sky-700">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between font-bold text-slate-800">
            <span>Jami summa:</span>
            <span className="text-sky-700">
              {order.totalAmount.toLocaleString('uz-UZ')} UZS
            </span>
          </div>
          <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-600">
            <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>
              Holat: <b>{order.status}</b>. Administrator to‘lovni tekshirib, buyurtmani tasdiqlaydi.
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => {
              onClose();
              onViewOrder();
            }}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <span>Buyurtmani Kuzatish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-xl text-xs transition-all"
          >
            Xaridni davom ettirish
          </button>
        </div>
      </div>
    </div>
  );
};
