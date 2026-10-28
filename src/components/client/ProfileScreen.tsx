import React, { useState } from 'react';
import {
  User,
  Package,
  Heart,
  Bell,
  Settings,
  ShieldCheck,
  ChevronRight,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Edit2,
  Lock,
  Sparkles,
  MapPin,
  Phone,
  AlertCircle
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { Logo } from '../common/Logo';

interface ProfileScreenProps {
  orders: Order[];
  favoritesCount: number;
  onNavigateToFavorites: () => void;
  onOpenAdminPortal: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  orders,
  favoritesCount,
  onNavigateToFavorites,
  onOpenAdminPortal
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'settings'>('orders');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Editable profile state
  const [userName, setUserName] = useState<string>('Gulbahor Rahimova');
  const [userPhone, setUserPhone] = useState<string>('+998 90 345 67 89');
  const [userRegion, setUserRegion] = useState<string>('Toshkent shahri');
  const [userDistrict, setUserDistrict] = useState<string>('Chilonzor tumani');
  const [userAddress, setUserAddress] = useState<string>('Qatortol ko‘chasi, 24-uy, 8-xonadon');
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);

  // Admin PIN modal
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Yangi':
        return { bg: 'bg-[#E5F7FF] text-[#0096C7] border-[#00B8F5]/30', icon: Clock };
      case 'To‘lov kutilmoqda':
        return { bg: 'bg-[#FFF7D6] text-[#B45309] border-[#FFD76A]/40', icon: Clock };
      case 'To‘lov tekshirilmoqda':
        return { bg: 'bg-[#EDE9FE] text-[#7C3AED] border-[#A78BFA]/30', icon: Clock };
      case 'Tasdiqlangan':
        return { bg: 'bg-[#E6FBF0] text-[#059669] border-[#9BE7C4]/40', icon: CheckCircle };
      case 'Tayyorlanmoqda':
        return { bg: 'bg-[#E5F7FF] text-[#0096C7] border-[#00B8F5]/30', icon: Package };
      case 'Yetkazilmoqda':
        return { bg: 'bg-[#EDE9FE] text-[#7C3AED] border-[#A78BFA]/30', icon: Truck };
      case 'Yetkazilgan':
        return { bg: 'bg-[#E6FBF0] text-[#059669] border-[#9BE7C4]/40', icon: CheckCircle };
      case 'Bekor qilingan':
        return { bg: 'bg-[#FFE5F2] text-[#FF4FA3] border-[#FF4FA3]/30', icon: XCircle };
      default:
        return { bg: 'bg-slate-100 text-slate-700 border-slate-200', icon: Clock };
    }
  };

  const handleAdminPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '2026' || pinInput === 'admin') {
      setIsAdminPinModalOpen(false);
      setPinInput('');
      setPinError('');
      onOpenAdminPortal();
    } else {
      setPinError('Noto‘g‘ri PIN kod! Standart kod: 2026');
    }
  };

  return (
    <div className="pb-28 pt-4 select-none min-h-screen bg-slate-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        {/* 1. Profile Header Card with Rich Colorful Gradient */}
        <div className="bg-gradient-to-r from-[#00B8F5] via-[#A78BFA] to-[#FF4FA3] rounded-3xl p-6 text-white shadow-[0_10px_25px_-5px_rgba(0,184,245,0.3)] relative overflow-hidden">
        {/* Whimsical background circles */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />

        <div className="flex items-center gap-3.5 relative z-10">
          {/* Avatar with Cute Mascot Ring */}
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/50 shadow-inner shrink-0">
            <span className="text-2xl">👩‍👧</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="font-black text-base sm:text-lg leading-tight truncate">
                {userName}
              </h2>
              <span className="w-2 h-2 rounded-full bg-[#FFD76A] animate-ping" />
            </div>
            <p className="text-xs text-sky-100 font-mono mt-0.5">{userPhone}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="bg-white/25 text-white text-[9px] font-black px-2 py-0.5 rounded-full tracking-wider uppercase backdrop-blur-xs">
                Doimiy Xaridor
              </span>
              <span className="bg-[#FFD76A] text-slate-900 text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs">
                5% Keshbek
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all active:scale-90 border border-white/30 shadow-xs"
            title="Tahrirlash"
          >
            <Edit2 className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Profile Edit Card (if opened) */}
      {isEditingProfile && (
        <div className="bg-white p-4 rounded-3xl border border-[#00B8F5]/20 shadow-sm space-y-3 text-xs animate-slideDown">
          <h4 className="font-extrabold text-slate-800 text-sm">
            Shaxsiy ma’lumotlarni tahrirlash
          </h4>
          <div>
            <label className="block text-slate-600 mb-1 font-bold">Ism va Familiya:</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-[#00B8F5]"
            />
          </div>
          <div>
            <label className="block text-slate-600 mb-1 font-bold">Telefon raqami:</label>
            <input
              type="tel"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-hidden focus:border-[#00B8F5]"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-600 mb-1 font-bold">Viloyat:</label>
              <input
                type="text"
                value={userRegion}
                onChange={(e) => setUserRegion(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-bold">Tuman:</label>
              <input
                type="text"
                value={userDistrict}
                onChange={(e) => setUserDistrict(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-600 mb-1 font-bold">Aniq manzil:</label>
            <input
              type="text"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
            />
          </div>
          <button
            onClick={() => setIsEditingProfile(false)}
            className="w-full bg-gradient-to-r from-[#00B8F5] to-[#0096C7] text-white font-extrabold py-2.5 rounded-xl text-xs transition-all shadow-md active:scale-95"
          >
            Saqlash
          </button>
        </div>
      )}

      {/* Segment Navigation Tabs */}
      <div className="grid grid-cols-2 gap-2 bg-white p-1 rounded-2xl border border-slate-200/80 shadow-xs">
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-2.5 rounded-xl text-xs font-black transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95 ${
            activeTab === 'orders'
              ? 'bg-[#E5F7FF] text-[#0096C7] shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4 text-[#00B8F5]" />
          <span>Buyurtmalar ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`py-2.5 rounded-xl text-xs font-black transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95 ${
            activeTab === 'settings'
              ? 'bg-[#FFE5F2] text-[#FF4FA3] shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4 text-[#FF4FA3]" />
          <span>Sozlamalar</span>
        </button>
      </div>

      {/* ORDERS LIST VIEW */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 p-5 space-y-2.5 shadow-xs">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-extrabold text-sm text-slate-700">Buyurtmalar tarixi bo‘sh</h4>
              <p className="text-xs text-slate-400">
                Siz hali birorta ham bolalar kiyimi xarid qilmadingiz.
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const badge = getStatusBadge(order.status);
              const IconComp = badge.icon;
              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="bg-white p-4 rounded-3xl border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,184,245,0.08)] transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-black text-xs text-slate-800">
                        #{order.orderNumber}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-medium">
                        {order.createdAt}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black border ${badge.bg}`}
                    >
                      <IconComp className="w-3.5 h-3.5" />
                      <span>{order.status}</span>
                    </div>
                  </div>

                  {/* Thumbnails preview */}
                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="relative shrink-0">
                        <img
                          src={it.image}
                          alt={it.productName}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                        />
                        {it.quantity > 1 && (
                          <span className="absolute -bottom-1 -right-1 bg-slate-900 text-white text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                            x{it.quantity}
                          </span>
                        )}
                      </div>
                    ))}
                    <div className="flex-1 text-right">
                      <span className="text-[11px] text-slate-500 block">Jami summa:</span>
                      <span className="text-xs sm:text-sm font-black text-[#0096C7]">
                        {order.totalAmount.toLocaleString('uz-UZ')} UZS
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                    <span>To‘lov: <b className="text-slate-700">{order.paymentMethod}</b></span>
                    <span className="text-[#0096C7] font-bold flex items-center gap-0.5">
                      Kuzatish <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* SETTINGS VIEW */}
      {activeTab === 'settings' && (
        <div className="space-y-3">
          {/* Notifications toggle */}
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E5F7FF] text-[#00B8F5] flex items-center justify-center shadow-xs">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-slate-800">Push Bildirishnomalar</h4>
                <p className="text-[11px] text-slate-400">Aksiyalar va buyurtma yangiliklari</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-5 h-5 accent-[#00B8F5] cursor-pointer"
            />
          </div>

          {/* Social login ready card */}
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs space-y-2">
            <h4 className="font-extrabold text-xs text-slate-800">Kirish va Xavfsizlik</h4>
            <p className="text-[11px] text-slate-500">
              Telefon raqami (SMS tasdiqlash), Google va Apple orqali tezkor kirish arxitekturasi faol.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="bg-[#E5F7FF] text-[#0096C7] border border-[#00B8F5]/30 px-3 py-1 rounded-xl text-[10px] font-black">
                📱 +998 (Ulangan)
              </span>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-xl text-[10px] font-bold">
                Google ID (Tayyor)
              </span>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-xl text-[10px] font-bold">
                Apple ID (Tayyor)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-t-[36px] sm:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-slideUp">
            <div className="p-4 bg-gradient-to-r from-[#00B8F5] to-[#0096C7] text-white flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm">
                  Buyurtma #{selectedOrder.orderNumber}
                </h3>
                <span className="text-[10px] text-sky-100">{selectedOrder.createdAt}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3.5 text-xs text-slate-700">
              {/* Timeline Track */}
              <div className="p-3.5 bg-[#E5F7FF]/50 rounded-2xl border border-[#00B8F5]/20 space-y-2">
                <div className="flex items-center justify-between font-black text-slate-800">
                  <span>Hozirgi holat:</span>
                  <span className="text-[#0096C7]">{selectedOrder.status}</span>
                </div>
                <div className="grid grid-cols-4 gap-1 pt-1 text-[9px] text-center font-bold">
                  <div
                    className={`py-1.5 rounded-lg ${
                      ['Yangi', 'To‘lov tekshirilmoqda', 'Tasdiqlangan', 'Tayyorlanmoqda', 'Yetkazilmoqda', 'Yetkazilgan'].includes(
                        selectedOrder.status
                      )
                        ? 'bg-[#00B8F5] text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    Qabul
                  </div>
                  <div
                    className={`py-1.5 rounded-lg ${
                      ['Tasdiqlangan', 'Tayyorlanmoqda', 'Yetkazilmoqda', 'Yetkazilgan'].includes(
                        selectedOrder.status
                      )
                        ? 'bg-[#00B8F5] text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    Tasdiq
                  </div>
                  <div
                    className={`py-1.5 rounded-lg ${
                      ['Tayyorlanmoqda', 'Yetkazilmoqda', 'Yetkazilgan'].includes(
                        selectedOrder.status
                      )
                        ? 'bg-[#00B8F5] text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    Yig‘ilmoqda
                  </div>
                  <div
                    className={`py-1.5 rounded-lg ${
                      selectedOrder.status === 'Yetkazilgan'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    Yetkazildi
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                <span className="font-extrabold text-slate-800">Xarid qilingan tovarlar:</span>
                {selectedOrder.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-2 bg-slate-50 rounded-2xl border border-slate-100"
                  >
                    <img
                      src={it.image}
                      alt={it.productName}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 text-xs truncate">
                        {it.productName}
                      </h4>
                      <div className="text-[10px] text-slate-500">
                        {it.color} • {it.size} • {it.quantity} dona
                      </div>
                    </div>
                    <div className="font-black text-xs text-slate-900">
                      {it.totalPrice.toLocaleString('uz-UZ')} UZS
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery details */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
                <div className="font-bold text-slate-800 mb-1">Yetkazib berish manzili:</div>
                <div>👤 {selectedOrder.customerName} ({selectedOrder.customerPhone})</div>
                <div>📍 {selectedOrder.region}, {selectedOrder.district}</div>
                <div>🏠 {selectedOrder.address}</div>
                {selectedOrder.notes && <div>📝 Izoh: {selectedOrder.notes}</div>}
              </div>

              {/* Payment Details */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>To‘lov tizimi:</span>
                  <span className="text-[#0096C7] font-black">{selectedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>To‘lov holati:</span>
                  <span className="font-bold text-slate-800">{selectedOrder.paymentStatus}</span>
                </div>
                {selectedOrder.paymentTransactionId && (
                  <div className="flex justify-between text-slate-600 font-mono">
                    <span>Tranzaksiya:</span>
                    <span>{selectedOrder.paymentTransactionId}</span>
                  </div>
                )}
                {selectedOrder.paymentReceiptUrl && (
                  <div className="pt-2">
                    <span className="font-bold text-slate-700 block mb-1">Yuklangan chek:</span>
                    <img
                      src={selectedOrder.paymentReceiptUrl}
                      alt="Payment receipt"
                      className="w-24 h-24 rounded-xl object-cover border border-slate-200"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 15. SECTION REQUIREMENT:
          "Administrator paneliga kirish tugmasi profilning eng pastida saqlansin." */}
      <div className="pt-4 border-t border-slate-200/80">
        <button
          onClick={() => setIsAdminPinModalOpen(true)}
          className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:opacity-95 text-white font-black py-3.5 rounded-2xl shadow-md flex items-center justify-center gap-2 text-xs transition-all active:scale-98"
        >
          <ShieldCheck className="w-4 h-4 text-[#FF4FA3]" />
          <span>Administrator Kirish (Admin Panel)</span>
        </button>
        <p className="text-[10px] text-slate-400 text-center mt-1 font-medium">
          Faqat do‘kon ma’murlari va sotuvchilari uchun (Standart PIN: 2026)
        </p>
      </div>

      {/* Admin PIN Dialog */}
      {isAdminPinModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4 animate-pop">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-[#E5F7FF] text-[#00B8F5] mx-auto flex items-center justify-center shadow-xs">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-black text-sm text-slate-800">
                Administrator Kirish
              </h3>
              <p className="text-[11px] text-slate-500">
                Xavfsiz PIN kodni kiriting (Standart test PIN: 2026)
              </p>
            </div>

            {pinError && (
              <div className="bg-red-50 text-red-600 text-xs p-2.5 rounded-xl flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <form onSubmit={handleAdminPinSubmit} className="space-y-3">
              <input
                type="password"
                maxLength={8}
                autoFocus
                placeholder="PIN kod (2026)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full text-center tracking-widest text-lg font-mono font-bold bg-slate-50 border border-slate-200 rounded-2xl py-2.5 focus:outline-hidden focus:border-[#00B8F5]"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdminPinModalOpen(false);
                    setPinInput('');
                    setPinError('');
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs active:scale-95 transition-all"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#00B8F5] to-[#0096C7] text-white font-black py-2.5 rounded-xl text-xs transition-all shadow-md active:scale-95"
                >
                  Kirish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
