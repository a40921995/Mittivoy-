import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  MapPin,
  CheckCircle,
  AlertCircle,
  UploadCloud,
  FileText,
  Clock
} from 'lucide-react';
import { CartItem, Order, PaymentMethod } from '../../types';
import { storageService } from '../../services/storageService';

interface CartScreenProps {
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onOrderPlaced: (order: Order) => void;
  onNavigateToCatalog: () => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderPlaced,
  onNavigateToCatalog
}) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  // Form Fields
  const [name, setName] = useState<string>('Gulbahor Rahimova');
  const [phone, setPhone] = useState<string>('+998 90 345 67 89');
  const [region, setRegion] = useState<string>('Toshkent shahri');
  const [district, setDistrict] = useState<string>('Chilonzor tumani');
  const [address, setAddress] = useState<string>('Qatortol ko‘chasi, 24-uy, 8-xonadon');
  const [notes, setNotes] = useState<string>('Eshik kodi: 145');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Click');
  const [transactionId, setTransactionId] = useState<string>('');
  const [receiptUrl, setReceiptUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const settings = storageService.getSettings();

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal >= 300000 || subtotal === 0 ? 0 : 25000;
  const totalAmount = subtotal + deliveryFee;

  const UZ_REGIONS = [
    'Toshkent shahri',
    'Toshkent viloyati',
    'Samarqand viloyati',
    'Farg‘ona viloyati',
    'Andijon viloyati',
    'Namangan viloyati',
    'Buxoro viloyati',
    'Xorazm viloyati',
    'Qashqadaryo viloyati',
    'Surxondaryo viloyati',
    'Jizzax viloyati',
    'Sirdaryo viloyati',
    'Navoiy viloyati',
    'Qoraqalpog‘iston Respublikasi'
  ];

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (items.length === 0) return;

    // Check inventory stock before finalizing
    for (const item of items) {
      const prod = storageService.getProductById(item.product.id);
      if (prod) {
        const variant = prod.variants.find((v) => v.id === item.variantId);
        if (!variant || variant.stock < item.quantity) {
          setErrorMessage(
            `Kechirasiz, "${item.product.name} (${item.selectedSize})" dan omborda faqat ${
              variant?.stock || 0
            } dona qolgan.`
          );
          return;
        }
      }
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Create new Order
      const totalCost = items.reduce(
        (sum, item) => sum + item.product.costPrice * item.quantity,
        0
      );

      const orderItems = items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        productCode: i.product.code,
        image: i.product.mainImage,
        color: i.selectedColor,
        size: i.selectedSize,
        quantity: i.quantity,
        unitPrice: i.price,
        totalPrice: i.price * i.quantity,
        costPrice: i.product.costPrice
      }));

      const newOrder = storageService.createOrder({
        customerName: name,
        customerPhone: phone,
        region,
        district,
        address,
        notes,
        items: orderItems,
        subtotal,
        deliveryFee,
        discount: 0,
        totalAmount,
        totalCost,
        status: receiptUrl || transactionId ? 'To‘lov tekshirilmoqda' : 'To‘lov kutilmoqda',
        paymentMethod,
        paymentStatus: receiptUrl || transactionId ? 'Tekshirilmoqda' : 'Kutilmoqda',
        paymentReceiptUrl: receiptUrl,
        paymentTransactionId: transactionId,
        paymentNote: `${paymentMethod} orqali buyurtma berildi`,
        isOnline: true
      });

      onClearCart();
      setIsSubmitting(false);
      setIsCheckoutOpen(false);
      onOrderPlaced(newOrder);
    }, 600);
  };

  const handleSimulateReceiptUpload = () => {
    // Provide realistic payment check snapshot for user
    const sampleReceipts = [
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=600&q=80'
    ];
    const picked = sampleReceipts[Math.floor(Math.random() * sampleReceipts.length)];
    setReceiptUrl(picked);
    if (!transactionId) {
      setTransactionId(`${paymentMethod.toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`);
    }
  };

  return (
    <div className="pb-24 pt-4 select-none min-h-screen bg-slate-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">Xarid Savati</h1>
            <p className="text-xs sm:text-sm text-slate-500">{items.length} ta mahsulot tanlangan</p>
          </div>
          {items.length > 0 && (
            <button
              onClick={onClearCart}
              className="text-xs text-[#FF4FA3] hover:text-pink-700 font-bold transition-colors cursor-pointer"
            >
              Savatni tozalash
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-100 shadow-xs space-y-4 max-w-md mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-[#E5F7FF] text-[#00B8F5] mx-auto flex items-center justify-center">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="font-black text-lg text-slate-900">Savatingiz hozircha bo‘sh</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Katalogdan farzandingiz uchun eng qulay, 100% paxtali va chiroyli kiyimlarni tanlang.
            </p>
            <button
              onClick={onNavigateToCatalog}
              className="bg-gradient-to-r from-[#00B8F5] to-[#0096C7] hover:from-[#0096C7] hover:to-[#00B8F5] text-white font-black text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-md inline-flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Xaridni boshlash</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left 2 Columns: Cart Items List */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow"
                >
                  <img
                    src={item.product.mainImage}
                    alt={item.product.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0"
                  />

                  <div className="flex-1 min-w-0 space-y-1 sm:space-y-1.5">
                    <span className="text-[10px] font-bold text-[#0096C7] uppercase tracking-wider block">
                      {item.product.category}
                    </span>
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                      {item.product.name}
                    </h4>
                    <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-600">
                      <span className="bg-slate-100 px-2 py-0.5 rounded-lg font-bold">
                        Rang: {item.selectedColor}
                      </span>
                      <span className="bg-[#E5F7FF] text-[#0096C7] px-2 py-0.5 rounded-lg font-bold">
                        O‘lcham: {item.selectedSize}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm font-black text-slate-900 pt-0.5">
                      {(item.price * item.quantity).toLocaleString('uz-UZ')} UZS
                    </div>
                  </div>

                  {/* Stepper & Delete */}
                  <div className="flex flex-col items-end justify-between h-20 sm:h-24 shrink-0">
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-slate-400 hover:text-[#FF4FA3] p-1.5 transition-colors cursor-pointer"
                      title="O‘chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1.5 bg-slate-100 rounded-xl p-1 border border-slate-200">
                      <button
                        disabled={item.quantity <= 1}
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-slate-700 font-bold disabled:opacity-40 cursor-pointer shadow-xs active:scale-90"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-black text-xs text-slate-900 w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-slate-700 font-bold cursor-pointer shadow-xs active:scale-90"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Delivery Guarantee Card */}
              <div className="bg-[#E5F7FF]/70 border border-[#00B8F5]/30 rounded-2xl p-4 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[#00B8F5] shrink-0" />
                <p className="text-xs text-sky-900 font-semibold leading-relaxed">
                  MITTIVOY kafolati: Agar kiyim o‘lchami mos kelmasa, 14 kun ichida bepul almashtirib beramiz!
                </p>
              </div>
            </div>

            {/* Right Column: Price Summary Card & Checkout Trigger */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-4 text-xs sticky top-28">
              <h4 className="font-black text-slate-900 text-sm pb-2 border-b border-slate-100">
                Buyurtma Hisobi
              </h4>
              <div className="space-y-2.5 text-slate-600 text-xs">
                <div className="flex justify-between">
                  <span>Mahsulotlar summasi:</span>
                  <span className="font-bold text-slate-900">{subtotal.toLocaleString('uz-UZ')} UZS</span>
                </div>
                <div className="flex justify-between">
                  <span>Yetkazib berish:</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-black">Bepul (300,000 UZS dan yuqori)</span>
                    ) : (
                      <span className="font-bold text-slate-900">{deliveryFee.toLocaleString('uz-UZ')} UZS</span>
                    )}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline font-bold">
                <span className="text-slate-900 text-sm">Jami to‘lov:</span>
                <span className="text-lg font-black text-[#00B8F5]">
                  {totalAmount.toLocaleString('uz-UZ')} UZS
                </span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full bg-gradient-to-r from-[#00B8F5] to-[#0096C7] hover:from-[#0096C7] hover:to-[#00B8F5] text-white font-black py-3.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer text-xs sm:text-sm"
              >
                <span>Buyurtma Rasmiylashtirish</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Click, Paynet va Naqd to‘lov xavfsiz</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CHECKOUT MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-slideUp">
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-sky-400 to-sky-500 text-white flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-white" />
                <h3 className="font-bold text-sm">Buyurtma va Yetkazib Berish</h3>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleCheckoutSubmit} className="p-4 overflow-y-auto space-y-4 text-xs">
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-xl flex items-center gap-2 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Recipient Details */}
              <div className="space-y-2.5">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                  1. Qabul Qiluvchi Ma’lumotlari
                </span>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Ism va Familiya:
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Telefon raqami (Aloqa uchun):
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-400 font-mono font-bold"
                  />
                </div>
              </div>

              {/* 2. Delivery Address */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                  2. Yetkazib Berish Manzili
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Viloyat:
                    </label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-400"
                    >
                      {UZ_REGIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Tuman / Shahar:
                    </label>
                    <input
                      type="text"
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Aniq manzil (ko‘cha, uy, xonadon):
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Kuryer uchun izoh (ixtiyoriy):
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Masalan, domofon kodi yoki yetkazish vaqti"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              {/* 3. Payment Method (Click & Paynet ONLY - NO CASH) */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                    3. To‘lov Tizimi (Click / Paynet)
                  </span>
                  <span className="text-[10px] bg-sky-100 text-sky-800 font-semibold px-2 py-0.5 rounded-full">
                    Naqd pulsiz to‘lov
                  </span>
                </div>

                {/* Method Switcher */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Click')}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                      paymentMethod === 'Click'
                        ? 'border-sky-500 bg-sky-50 text-sky-900 ring-2 ring-sky-200 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-black text-sm tracking-wide text-sky-600">CLICK</div>
                    <span className="text-[10px] text-slate-500">Ilova yoki Karta orqali</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Paynet')}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                      paymentMethod === 'Paynet'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-200 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-black text-sm tracking-wide text-emerald-600">PAYNET</div>
                    <span className="text-[10px] text-slate-500">Ilova yoki Terminal orqali</span>
                  </button>
                </div>

                {/* Merchant Details Box */}
                <div className="bg-gradient-to-br from-slate-50 to-sky-50/50 p-3.5 rounded-2xl border border-sky-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>Do‘kon rekvizitlari:</span>
                    <span className="text-sky-600 font-mono">
                      {paymentMethod === 'Click' ? 'Click Merchant' : 'Paynet Terminal'}
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Karta raqami:</span>
                      <span className="font-bold text-slate-800 select-all">
                        {paymentMethod === 'Click'
                          ? settings.clickCardNumber
                          : settings.paynetCardNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Qabul qiluvchi:</span>
                      <span className="font-bold text-slate-800">MITTIVOY MCHJ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">To‘lanadigan summa:</span>
                      <span className="font-bold text-sky-700">
                        {totalAmount.toLocaleString('uz-UZ')} UZS
                      </span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Yuqoridagi karta raqamiga {paymentMethod} orqali to‘lovni amalga oshirib, tranzaksiya raqamini yoki chek skrinshotini quyida taqdim eting. Administrator tekshirgach, buyurtma yuboriladi.
                  </p>
                </div>

                {/* Upload Receipt / Trx ID */}
                <div className="space-y-2">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Tranzaksiya / Chek raqami (ixtiyoriy):
                    </label>
                    <input
                      type="text"
                      placeholder="Masalan, CLK-881920 yoki PNT-4410"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      To‘lov cheki skrinshoti:
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <label className="flex-1 bg-white hover:bg-slate-50 border-2 border-dashed border-sky-300 rounded-xl p-2.5 flex items-center justify-center gap-2 text-sky-700 font-semibold transition-all cursor-pointer">
                        <UploadCloud className="w-4 h-4 text-sky-500" />
                        <span>
                          {receiptUrl ? 'Chekni almashtirish' : 'Telefondan chek tanlash'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                setReceiptUrl(reader.result as string);
                                if (!transactionId) {
                                  setTransactionId(`${paymentMethod.toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={handleSimulateReceiptUpload}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold px-3 py-2 rounded-xl transition-all cursor-pointer"
                      >
                        Namunaviy chek
                      </button>
                    </div>

                    {receiptUrl && (
                      <div className="mt-2 flex items-center gap-2 bg-emerald-50 border border-emerald-200 p-2 rounded-xl text-emerald-800">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-[11px] font-medium truncate">
                          Chek muvaffaqiyatli biriktirildi
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Final Submit Button */}
              <div className="pt-2 sticky bottom-0 bg-white">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold py-3 rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Clock className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  <span>
                    {isSubmitting
                      ? 'Rasmiylashtirilmoqda...'
                      : `Buyurtmani Tasdiqlash (${totalAmount.toLocaleString('uz-UZ')} UZS)`}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
