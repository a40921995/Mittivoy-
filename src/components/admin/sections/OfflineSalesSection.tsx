import React, { useState } from 'react';
import {
  Store,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  Wifi,
  WifiOff,
  RefreshCw,
  Search,
  Receipt,
  CreditCard,
  User,
  AlertCircle
} from 'lucide-react';
import { Product, OfflineSale, OrderItem } from '../../../types';
import { storageService } from '../../../services/storageService';

interface OfflineSalesSectionProps {
  products: Product[];
  offlineSales: OfflineSale[];
  isOffline: boolean;
  onToggleOffline: () => void;
}

export const OfflineSalesSection: React.FC<OfflineSalesSectionProps> = ({
  products,
  offlineSales,
  isOffline,
  onToggleOffline
}) => {
  const [activeTab, setActiveTab] = useState<'pos' | 'history'>('pos');
  const [search, setSearch] = useState<string>('');
  const [cashierName, setCashierName] = useState<string>('Feruza (Kassir 1)');
  const [customerName, setCustomerName] = useState<string>('Do‘konga tashrif buyuruvchi');
  const [paymentMethod, setPaymentMethod] = useState<'Click' | 'Paynet' | 'Terminal POS'>('Click');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [cartItems, setCartItems] = useState<
    Array<{
      product: Product;
      variantId: string;
      color: string;
      size: string;
      quantity: number;
      price: number;
      stock: number;
    }>
  >([]);

  const [syncStatusMessage, setSyncStatusMessage] = useState<string>('');

  const unsyncedCount = offlineSales.filter((s) => !s.synced).length;

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddToCart = (product: Product, variantId: string) => {
    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant || variant.stock <= 0) {
      alert('Ushbu o‘lcham omborda qolmagan!');
      return;
    }

    const existingIndex = cartItems.findIndex(
      (item) => item.product.id === product.id && item.variantId === variantId
    );

    if (existingIndex >= 0) {
      const cur = cartItems[existingIndex];
      if (cur.quantity >= variant.stock) {
        alert(`Omborda faqat ${variant.stock} dona mavjud!`);
        return;
      }
      const updated = [...cartItems];
      updated[existingIndex].quantity += 1;
      setCartItems(updated);
    } else {
      setCartItems([
        ...cartItems,
        {
          product,
          variantId,
          color: variant.color,
          size: variant.size,
          quantity: 1,
          price: product.discountPrice || product.sellingPrice,
          stock: variant.stock
        }
      ]);
    }
  };

  const handleUpdateQty = (index: number, qty: number) => {
    if (qty <= 0) {
      setCartItems(cartItems.filter((_, i) => i !== index));
      return;
    }
    const item = cartItems[index];
    if (qty > item.stock) {
      alert(`Omborda faqat ${item.stock} dona mavjud!`);
      return;
    }
    const updated = [...cartItems];
    updated[index].quantity = qty;
    setCartItems(updated);
  };

  const handleRemove = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const totalAmount = subtotal - discountAmount;

  const handleCompleteSale = () => {
    if (cartItems.length === 0) {
      alert('Savat bo‘sh!');
      return;
    }

    const totalCost = cartItems.reduce(
      (sum, item) => sum + item.product.costPrice * item.quantity,
      0
    );

    const saleItems: OrderItem[] = cartItems.map((i) => ({
      productId: i.product.id,
      productName: i.product.name,
      productCode: i.product.code,
      image: i.product.mainImage,
      color: i.color,
      size: i.size,
      quantity: i.quantity,
      unitPrice: i.price,
      totalPrice: i.price * i.quantity,
      costPrice: i.product.costPrice
    }));

    const newSale = storageService.createOfflineSale({
      cashierName,
      customerName,
      items: saleItems,
      subtotal,
      discount: discountAmount,
      totalAmount,
      totalCost,
      paymentMethod
    });

    // If simulated offline, mark as not yet synced
    if (isOffline) {
      newSale.synced = false;
      const sales = storageService.getOfflineSales();
      const s = sales.find((x) => x.id === newSale.id);
      if (s) s.synced = false;
      localStorage.setItem('mittivoy_offline_sales', JSON.stringify(sales));
    }

    setCartItems([]);
    alert(`Savdo muvaffaqiyatli yakunlandi! Chek #${newSale.receiptNumber}`);
  };

  const handleSyncSales = () => {
    const result = storageService.syncPendingOfflineSales();
    setSyncStatusMessage(
      `${result.syncedCount} ta oflayn savdo server bilan sinxronlashtirildi. Zaxira to‘qnashuvlari aniqlanmadi.`
    );
    setTimeout(() => setSyncStatusMessage(''), 4000);
  };

  return (
    <div className="space-y-5">
      {/* Header with offline indicator & sync */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>7. Oflayn Savdo (Kassa POS)</span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 border ${
                isOffline
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
              <span>{isOffline ? 'Oflayn Rejim' : 'Onlayn Tarmoq'}</span>
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Jismoniy do‘konda savdo qilish, kassa cheklari va oflayn tranzaksiyalar sinxronizatsiyasi
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unsyncedCount > 0 && (
            <button
              onClick={handleSyncSales}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md animate-pulse"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{unsyncedCount} ta sinxronlanmagan</span>
            </button>
          )}

          <button
            onClick={onToggleOffline}
            className={`font-semibold text-xs px-3 py-2 rounded-xl border transition-all ${
              isOffline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-xs'
            }`}
          >
            {isOffline ? 'Tarmoqni ulash' : 'Oflaynni sinash'}
          </button>
        </div>
      </div>

      {syncStatusMessage && (
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center gap-2 text-xs text-emerald-800">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncStatusMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('pos')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'pos'
              ? 'bg-sky-500 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Kassa Terminali</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'history'
              ? 'bg-sky-500 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Kassa Tarixi ({offlineSales.length})</span>
        </button>
      </div>

      {activeTab === 'pos' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Product Selection Grid */}
          <div className="lg:col-span-7 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Mahsulot nomi yoki shtrix-kod / SKU..."
                className="w-full bg-white border border-slate-200 text-slate-800 text-xs pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-sky-500 shadow-xs"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[550px] overflow-y-auto pr-1">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-slate-200 p-2.5 rounded-2xl space-y-2 hover:border-sky-400 hover:shadow-xs transition-all"
                >
                  <img
                    src={p.mainImage}
                    alt={p.name}
                    className="w-full aspect-square rounded-xl object-cover border border-slate-100"
                  />
                  <div>
                    <span className="font-mono text-[9px] text-sky-600 font-bold block">{p.code}</span>
                    <h4 className="font-bold text-xs text-slate-800 truncate leading-tight">
                      {p.name}
                    </h4>
                    <span className="font-mono font-bold text-slate-900 text-xs block pt-0.5">
                      {(p.discountPrice || p.sellingPrice).toLocaleString('uz-UZ')} UZS
                    </span>
                  </div>

                  {/* Size buttons */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {p.variants.map((v) => (
                      <button
                        key={v.id}
                        disabled={v.stock <= 0}
                        onClick={() => handleAddToCart(p, v.id)}
                        className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold transition-all ${
                          v.stock <= 0
                            ? 'bg-slate-100 text-slate-400 line-through'
                            : 'bg-slate-100 hover:bg-sky-500 text-slate-700 hover:text-white'
                        }`}
                        title={`${v.color} - ${v.stock} dona qoldi`}
                      >
                        {v.size.split(' ')[0]} ({v.stock})
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: POS Cart & Checkout Register */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-sky-500" />
                  <h3 className="font-bold text-sm text-slate-800">Chek Rasmiylashtirish</h3>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {cartItems.length} ta tovar
                </span>
              </div>

              {/* Cashier & Customer Info */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-600 font-medium block mb-0.5">
                    Kassir:
                  </label>
                  <input
                    type="text"
                    value={cashierName}
                    onChange={(e) => setCashierName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-600 font-medium block mb-0.5">
                    Xaridor:
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {cartItems.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs italic">
                    Tovarlar tanlanmadi. Chap tomondan mahsulot o‘lchamini bosing.
                  </div>
                ) : (
                  cartItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-slate-800 text-xs block truncate">
                          {item.product.name}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {item.color} • {item.size}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
                          <button
                            onClick={() => handleUpdateQty(idx, item.quantity - 1)}
                            className="w-5 h-5 rounded bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs"
                          >
                            -
                          </button>
                          <span className="w-5 text-center font-bold text-xs text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQty(idx, item.quantity + 1)}
                            className="w-5 h-5 rounded bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-mono font-bold text-sky-600 text-xs w-16 text-right">
                          {(item.price * item.quantity).toLocaleString('uz-UZ')}
                        </span>

                        <button
                          onClick={() => handleRemove(idx)}
                          className="text-slate-400 hover:text-rose-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Discount and Payment method */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Do‘kon chegirmasi (%):</span>
                  <div className="flex gap-1">
                    {[0, 5, 10, 15, 20].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDiscountPercent(d)}
                        className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
                          discountPercent === d
                            ? 'bg-sky-500 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {d}%
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-slate-600 font-medium block mb-1">To‘lov usuli:</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['Click', 'Paynet', 'Terminal POS'] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`py-1.5 px-1 rounded-xl text-xs font-bold text-center border transition-all ${
                          paymentMethod === method
                            ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Total and Complete Sale button */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-700">Jami To‘lov:</span>
                <span className="text-xl font-black text-sky-600 font-mono">
                  {totalAmount.toLocaleString('uz-UZ')} UZS
                </span>
              </div>

              <button
                disabled={cartItems.length === 0}
                onClick={handleCompleteSale}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-bold py-3 rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Savdoni Yakunlash va Chek Chiqarish</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* TAB 2: Offline Sales History */
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="p-3.5 font-semibold">Chek #</th>
                  <th className="p-3.5 font-semibold">Sana</th>
                  <th className="p-3.5 font-semibold">Kassir / Xaridor</th>
                  <th className="p-3.5 font-semibold">Tovarlar</th>
                  <th className="p-3.5 font-semibold">To‘lov Usuli</th>
                  <th className="p-3.5 font-semibold">Jami Summa</th>
                  <th className="p-3.5 font-semibold">Holati</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {offlineSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-mono font-bold text-slate-800">
                      #{sale.receiptNumber}
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono">{sale.createdAt}</td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-800 block">{sale.cashierName}</span>
                      <span className="text-[10px] text-slate-400">{sale.customerName}</span>
                    </td>
                    <td className="p-3.5 text-slate-600">
                      {sale.items.map((i) => `${i.productName} (${i.size}) x${i.quantity}`).join(', ')}
                    </td>
                    <td className="p-3.5 font-semibold text-slate-700">{sale.paymentMethod}</td>
                    <td className="p-3.5 font-mono font-black text-sky-600">
                      {sale.totalAmount.toLocaleString('uz-UZ')} UZS
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          sale.synced
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {sale.synced ? 'Sinxronlangan' : 'Oflayn (Navbatda)'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
