import React, { useState } from 'react';
import {
  Warehouse,
  Plus,
  AlertTriangle,
  History,
  TrendingUp,
  Search,
  Package,
  ArrowDownLeft,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { Product, InventoryMovement } from '../../../types';
import { storageService } from '../../../services/storageService';

interface InventorySectionProps {
  products: Product[];
  movements: InventoryMovement[];
}

export const InventorySection: React.FC<InventorySectionProps> = ({
  products,
  movements
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'movements'>('inventory');
  const [search, setSearch] = useState<string>('');
  const [isRestockModalOpen, setIsRestockModalOpen] = useState<boolean>(false);

  // Restock form state
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [restockQty, setRestockQty] = useState<number>(10);
  const [restockNote, setRestockNote] = useState<string>('Yangi partiya kirimi');

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  // Flattened inventory variants
  const inventoryRows = products.flatMap((p) =>
    p.variants.map((v) => ({
      productId: p.id,
      productCode: p.code,
      productName: p.name,
      category: p.category,
      costPrice: p.costPrice,
      sellingPrice: p.discountPrice || p.sellingPrice,
      variantId: v.id,
      color: v.color,
      colorHex: v.colorHex,
      size: v.size,
      stock: v.stock,
      soldCount: v.soldCount || 0
    }))
  );

  const filteredRows = inventoryRows.filter((row) => {
    const q = search.toLowerCase();
    return (
      row.productName.toLowerCase().includes(q) ||
      row.productCode.toLowerCase().includes(q) ||
      row.color.toLowerCase().includes(q) ||
      row.size.toLowerCase().includes(q)
    );
  });

  const lowStockRows = inventoryRows.filter((r) => r.stock <= 3);

  const totalStockCount = inventoryRows.reduce((sum, r) => sum + r.stock, 0);
  const totalValuationCost = inventoryRows.reduce(
    (sum, r) => sum + r.stock * r.costPrice,
    0
  );
  const totalValuationRetail = inventoryRows.reduce(
    (sum, r) => sum + r.stock * r.sellingPrice,
    0
  );

  // Movements totals
  const totalInflow = movements
    .filter((m) => m.type.includes('Kirim'))
    .reduce((sum, m) => sum + m.quantityChange, 0);
  const totalOutflow = Math.abs(
    movements
      .filter((m) => m.type.includes('Sotuv'))
      .reduce((sum, m) => sum + m.quantityChange, 0)
  );

  const handleOpenRestock = (prodId?: string, varId?: string) => {
    if (prodId) setSelectedProductId(prodId);
    if (varId) setSelectedVariantId(varId);
    else if (prodId) {
      const prod = products.find((p) => p.id === prodId);
      if (prod && prod.variants[0]) setSelectedVariantId(prod.variants[0].id);
    }
    setIsRestockModalOpen(true);
  };

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !selectedVariantId || restockQty <= 0) return;

    storageService.addInventoryStock(
      selectedProductId,
      selectedVariantId,
      Number(restockQty),
      restockNote
    );

    setIsRestockModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">5. Ombor Boshqaruvi & Zaxira</h2>
          <p className="text-xs text-slate-500 font-medium">
            Har bir o‘lcham va rang bo‘yicha alohida qoldiq, kirim-chiqim nazorati va audit
          </p>
        </div>

        {/* Green Restock Button as requested */}
        <button
          onClick={() => handleOpenRestock()}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs px-4 py-2.5 rounded-2xl shadow-md flex items-center gap-1.5 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Omborga Kirim Qo‘shish</span>
        </button>
      </div>

      {/* KPI Cards: Total Stock, Valuation, Low Stock, Inflow/Outflow */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border-2 border-[#A78BFA] p-3.5 rounded-3xl shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-500 block">Jami Mahsulot</span>
          <div className="text-base font-black text-slate-900">{totalStockCount} dona</div>
          <span className="text-[9px] text-purple-700 font-bold bg-[#EDE9FE] px-1.5 py-0.2 rounded-md">
            {inventoryRows.length} variant
          </span>
        </div>

        <div className="bg-white border-2 border-slate-200 p-3.5 rounded-3xl shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-500 block">Ombor Qiymati (Tan)</span>
          <div className="text-xs font-black text-slate-800 font-mono">
            {totalValuationCost.toLocaleString('uz-UZ')} UZS
          </div>
          <span className="text-[9px] text-slate-500">Tannarx bo‘yicha</span>
        </div>

        <div className="bg-white border-2 border-[#00B8F5] p-3.5 rounded-3xl shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-500 block">Sotuv Qiymati</span>
          <div className="text-xs font-black text-[#0096C7] font-mono">
            {totalValuationRetail.toLocaleString('uz-UZ')} UZS
          </div>
          <span className="text-[9px] text-sky-700 font-bold bg-[#E5F7FF] px-1.5 py-0.2 rounded-md">
            Chakana sotuv
          </span>
        </div>

        <div className="bg-white border-2 border-[#FFD76A] p-3.5 rounded-3xl shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-500 block">Kam Qolgan Tovar</span>
          <div className="text-base font-black text-amber-600">{lowStockRows.length} ta</div>
          <span className="text-[9px] text-amber-800 font-bold bg-[#FFF7D6] px-1.5 py-0.2 rounded-md">
            &le;3 dona qoldi
          </span>
        </div>

        <div className="bg-white border-2 border-[#9BE7C4] p-3.5 rounded-3xl shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-500 block">Mahsulot Kirimi</span>
          <div className="text-base font-black text-emerald-600">+{totalInflow} dona</div>
          <span className="text-[9px] text-emerald-700 font-bold bg-[#E6FBF0] px-1.5 py-0.2 rounded-md">
            Jami qabul
          </span>
        </div>

        <div className="bg-white border-2 border-[#FF4FA3] p-3.5 rounded-3xl shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-500 block">Mahsulot Chiqimi</span>
          <div className="text-base font-black text-pink-600">-{totalOutflow} dona</div>
          <span className="text-[9px] text-pink-700 font-bold bg-[#FFE5F2] px-1.5 py-0.2 rounded-md">
            Sotilgan jami
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${
            activeTab === 'inventory'
              ? 'bg-[#E5F7FF] text-[#0096C7] shadow-xs border border-[#00B8F5]/30'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Warehouse className="w-4 h-4 text-[#00B8F5]" />
          <span>Ombor Qoldiqlari ({inventoryRows.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('movements')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${
            activeTab === 'movements'
              ? 'bg-[#E5F7FF] text-[#0096C7] shadow-xs border border-[#00B8F5]/30'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <History className="w-4 h-4 text-[#00B8F5]" />
          <span>Harakatlar Tarixi ({movements.length})</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#00B8F5]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tovar nomi, SKU, rang yoki o‘lcham bo‘yicha qidiring..."
          className="w-full bg-white border border-slate-200 rounded-2xl text-xs pl-10 pr-4 py-2.5 text-slate-800 focus:outline-hidden focus:border-[#00B8F5] shadow-xs"
        />
      </div>

      {/* TAB 1: Inventory Variants Grid & Table */}
      {activeTab === 'inventory' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-400 font-bold">
                <tr>
                  <th className="p-3.5">SKU / Mahsulot</th>
                  <th className="p-3.5">Rang</th>
                  <th className="p-3.5">O‘lcham</th>
                  <th className="p-3.5">Tannarx</th>
                  <th className="p-3.5">Sotuv Narxi</th>
                  <th className="p-3.5">Sotilgan</th>
                  <th className="p-3.5">Qoldiq</th>
                  <th className="p-3.5 text-right">Kirim</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRows.map((row) => (
                  <tr key={row.variantId} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5">
                      <span className="font-mono font-bold text-[#0096C7] text-[10px] block">
                        {row.productCode}
                      </span>
                      <span className="font-extrabold text-slate-900 text-xs block">
                        {row.productName}
                      </span>
                      <span className="text-[10px] text-slate-400">{row.category}</span>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5 font-medium">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-300"
                          style={{ backgroundColor: row.colorHex }}
                        />
                        <span>{row.color}</span>
                      </div>
                    </td>

                    <td className="p-3.5 font-black text-slate-900">{row.size}</td>

                    <td className="p-3.5 font-mono text-slate-500">
                      {row.costPrice.toLocaleString('uz-UZ')} UZS
                    </td>

                    <td className="p-3.5 font-mono font-bold text-slate-900">
                      {row.sellingPrice.toLocaleString('uz-UZ')} UZS
                    </td>

                    <td className="p-3.5 font-mono text-slate-500">
                      {row.soldCount} dona
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`font-mono font-black px-2.5 py-0.5 rounded-full text-xs ${
                          row.stock <= 3
                            ? 'bg-[#FFF7D6] text-amber-700 border border-[#FFD76A]'
                            : 'bg-[#E6FBF0] text-emerald-700 border border-[#9BE7C4]'
                        }`}
                      >
                        {row.stock} dona
                      </span>
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleOpenRestock(row.productId, row.variantId)}
                        className="bg-emerald-50 hover:bg-emerald-500 text-emerald-700 hover:text-white font-extrabold text-[11px] px-3 py-1.5 rounded-xl border border-emerald-200 transition-all active:scale-95"
                      >
                        + Kirim
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Movements Log */}
      {activeTab === 'movements' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-400 font-bold">
                <tr>
                  <th className="p-3.5">Sana</th>
                  <th className="p-3.5">Tovar</th>
                  <th className="p-3.5">Variant</th>
                  <th className="p-3.5">Harakat Turi</th>
                  <th className="p-3.5">O‘zgarish</th>
                  <th className="p-3.5">Qoldiq</th>
                  <th className="p-3.5">Izoh / Kim Tomonidan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {movements.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="p-3.5 text-slate-400 font-mono text-[11px]">{m.date}</td>
                    <td className="p-3.5">
                      <span className="font-mono text-[10px] text-[#0096C7] block">
                        {m.productCode}
                      </span>
                      <span className="font-bold text-slate-900 text-xs">{m.productName}</span>
                    </td>
                    <td className="p-3.5 text-slate-600 font-medium">{m.variantInfo}</td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                          m.type.includes('Kirim')
                            ? 'bg-[#E6FBF0] text-emerald-700'
                            : m.type.includes('Qaytarish')
                            ? 'bg-[#E5F7FF] text-[#0096C7]'
                            : 'bg-[#FFF7D6] text-amber-700'
                        }`}
                      >
                        {m.type}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono font-bold">
                      <span
                        className={
                          m.quantityChange > 0 ? 'text-emerald-600' : 'text-red-500'
                        }
                      >
                        {m.quantityChange > 0 ? `+${m.quantityChange}` : m.quantityChange} dona
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-900 font-black">
                      {m.remainingStock} dona
                    </td>
                    <td className="p-3.5 text-slate-500 text-[11px]">
                      <div>{m.note || '-'}</div>
                      <span className="text-[10px] text-slate-400">{m.performedBy}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Restock Kirim Modal */}
      {isRestockModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 space-y-4 shadow-2xl border border-slate-100 animate-pop">
            <h3 className="font-black text-sm text-slate-900">
              Omborga Tovar Kirimi Qo‘shish
            </h3>

            <form onSubmit={handleRestockSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Mahsulotni tanlang:
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    const prod = products.find((p) => p.id === e.target.value);
                    if (prod && prod.variants[0]) {
                      setSelectedVariantId(prod.variants[0].id);
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:border-[#00B8F5]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedProduct && (
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Rang va O‘lcham:
                  </label>
                  <select
                    value={selectedVariantId}
                    onChange={(e) => setSelectedVariantId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:border-[#00B8F5]"
                  >
                    {selectedProduct.variants.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.color} - {v.size} (Hozirgi qoldiq: {v.stock} dona)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Kirim soni (dona):
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={restockQty}
                  onChange={(e) => setRestockQty(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono font-bold focus:outline-hidden focus:border-[#00B8F5]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Izoh / Yuk hujjati:
                </label>
                <input
                  type="text"
                  value={restockNote}
                  onChange={(e) => setRestockNote(e.target.value)}
                  placeholder="Masalan, Yangi partiya kirimi..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:border-[#00B8F5]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRestockModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition-all active:scale-95"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-2.5 rounded-xl transition-all shadow-md active:scale-95"
                >
                  Kirimni Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
