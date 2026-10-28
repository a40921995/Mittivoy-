import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Check,
  X,
  Layers,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Product, ProductVariant, CategoryItem, GenderType, AgeGroupType } from '../../../types';
import { storageService } from '../../../services/storageService';

interface ProductsSectionProps {
  products: Product[];
  categories: CategoryItem[];
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  products,
  categories
}) => {
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('barchasi');
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [code, setCode] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('Dvoykalar');
  const [gender, setGender] = useState<GenderType>('uniseks');
  const [ageGroup, setAgeGroup] = useState<AgeGroupType>('1-3');
  const [costPrice, setCostPrice] = useState<number>(90000);
  const [sellingPrice, setSellingPrice] = useState<number>(160000);
  const [discountPrice, setDiscountPrice] = useState<string>('');
  const [mainImage, setMainImage] = useState<string>('');
  const [fabric, setFabric] = useState<string>('100% Paxta (Turkiya)');
  const [variants, setVariants] = useState<ProductVariant[]>([
    { id: 'v-new-1', color: 'Osmonrang', colorHex: '#7dd3fc', size: '86 (1-2 yosh)', stock: 10, soldCount: 0 },
    { id: 'v-new-2', color: 'Och Pushti', colorHex: '#f472b6', size: '92 (2-3 yosh)', stock: 8, soldCount: 0 }
  ]);

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      selectedCategory === 'barchasi' || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setCode(`MT-${Math.floor(1000 + Math.random() * 9000)}`);
    setName('');
    setDescription('');
    setCategory(categories[0]?.name || 'Dvoykalar');
    setGender('uniseks');
    setAgeGroup('1-3');
    setCostPrice(90000);
    setSellingPrice(160000);
    setDiscountPrice('');
    setMainImage('https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80');
    setFabric('100% Organik Paxta');
    setVariants([
      { id: `v-${Date.now()}-1`, color: 'Osmonrang', colorHex: '#7dd3fc', size: '86 (1-2 yosh)', stock: 10, soldCount: 0 },
      { id: `v-${Date.now()}-2`, color: 'Och Pushti', colorHex: '#f472b6', size: '92 (2-3 yosh)', stock: 8, soldCount: 0 }
    ]);
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setCode(prod.code);
    setName(prod.name);
    setDescription(prod.description);
    setCategory(prod.category);
    setGender(prod.gender);
    setAgeGroup(prod.ageGroup);
    setCostPrice(prod.costPrice);
    setSellingPrice(prod.sellingPrice);
    setDiscountPrice(prod.discountPrice ? prod.discountPrice.toString() : '');
    setMainImage(prod.mainImage);
    setFabric(prod.fabric || '');
    setVariants(JSON.parse(JSON.stringify(prod.variants)));
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Rostdan ham ushbu mahsulotni o‘chirmoqchimisiz?')) {
      storageService.deleteProduct(id);
    }
  };

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        id: `v-${Date.now()}`,
        color: 'Moviy',
        colorHex: '#38bdf8',
        size: '104 (4 yosh)',
        stock: 5,
        soldCount: 0
      }
    ]);
  };

  const handleRemoveVariant = (variantId: string) => {
    if (variants.length <= 1) {
      alert('Kamida bitta variant (o‘lcham va rang) bo‘lishi shart!');
      return;
    }
    setVariants(variants.filter((v) => v.id !== variantId));
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !mainImage.trim()) {
      alert('Iltimos, barcha majburiy maydonlarni to‘ldiring!');
      return;
    }

    const newProd: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      code,
      name,
      description,
      category,
      gender,
      ageGroup,
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      mainImage,
      images: [mainImage],
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewCount: editingProduct ? editingProduct.reviewCount : 0,
      variants,
      fabric,
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString().split('T')[0]
    };

    storageService.saveProduct(newProd);
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">2. Mahsulotlar Boshqaruvi</h2>
          <p className="text-xs text-slate-500">
            Katalogdagi tovarlar, o‘lcham va rang variantlari, narxlar va fotosuratlar
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-md flex items-center gap-1.5 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Mahsulot Qo‘shish</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nomi yoki SKU kodi bo‘yicha qidiring..."
            className="w-full bg-white border border-slate-200 text-slate-800 text-xs pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-sky-500 placeholder-slate-400 shadow-xs"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white border border-slate-200 text-slate-700 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-sky-500 shadow-xs font-medium"
        >
          <option value="barchasi">Barcha kategoriyalar</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-500">
              <tr>
                <th className="p-3.5 font-semibold">Tovar</th>
                <th className="p-3.5 font-semibold">Kategoriya</th>
                <th className="p-3.5 font-semibold">Tannarx</th>
                <th className="p-3.5 font-semibold">Sotuv Narxi</th>
                <th className="p-3.5 font-semibold">Variantlar (Ombor)</th>
                <th className="p-3.5 font-semibold text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => {
                const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.mainImage}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                        />
                        <div>
                          <span className="font-mono font-bold text-sky-600 text-[10px] block">
                            {p.code}
                          </span>
                          <span className="font-bold text-slate-800 text-xs block leading-tight">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {p.ageGroup} yosh • {p.gender}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 text-slate-600 font-medium">{p.category}</td>

                    <td className="p-3.5 text-slate-500 font-mono">
                      {p.costPrice.toLocaleString('uz-UZ')} UZS
                    </td>

                    <td className="p-3.5">
                      <div className="font-black text-slate-900">
                        {(p.discountPrice || p.sellingPrice).toLocaleString('uz-UZ')} UZS
                      </div>
                      {p.discountPrice && (
                        <div className="text-[10px] text-slate-400 line-through">
                          {p.sellingPrice.toLocaleString('uz-UZ')} UZS
                        </div>
                      )}
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${
                          totalStock <= 5
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {totalStock} dona ({p.variants.length} variant)
                      </span>
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-sky-500 text-slate-600 hover:text-white transition-colors"
                          title="Tahrirlash"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-500 text-slate-600 hover:text-white transition-colors"
                          title="O‘chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-5 my-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-800">
                {editingProduct ? 'Mahsulotni Tahrirlash' : 'Yangi Mahsulot Qo‘shish'}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">SKU Kodi:</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono font-bold focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Kategoriya:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-sky-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nomi:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masalan, Bolalar uchun qalin paxtali dvoyka"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Jins:</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as GenderType)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-sky-500"
                  >
                    <option value="uniseks">Uniseks</option>
                    <option value="ogil">O‘g‘il bolalar</option>
                    <option value="qiz">Qiz bolalar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Yosh oralig‘i:</label>
                  <select
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value as AgeGroupType)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-sky-500"
                  >
                    <option value="1-3">1–3 yosh</option>
                    <option value="4-6">4–6 yosh</option>
                    <option value="7-9">7–9 yosh</option>
                    <option value="10-12">10–12 yosh</option>
                    <option value="13-15">13–15 yosh</option>
                  </select>
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Tannarxi (UZS):</label>
                  <input
                    type="number"
                    required
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Sotuv narxi (UZS):</label>
                  <input
                    type="number"
                    required
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Chegirma narxi (ixtiyoriy):</label>
                  <input
                    type="number"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    placeholder="Yo‘q"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Asosiy Rasm URL:</label>
                <input
                  type="url"
                  required
                  value={mainImage}
                  onChange={(e) => setMainImage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Tavsifi & Matosi:</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* VARIANTS (Color, Size, Stock) */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Rang va O‘lcham Variantlari (Ombor)
                  </span>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="text-sky-600 hover:text-sky-700 font-bold text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Variant qo‘shish</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {variants.map((v, idx) => (
                    <div
                      key={v.id || idx}
                      className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2 rounded-xl border border-slate-200"
                    >
                      <div className="col-span-4">
                        <input
                          type="text"
                          placeholder="Rang (Osmonrang)"
                          value={v.color}
                          onChange={(e) => {
                            const newV = [...variants];
                            newV[idx].color = e.target.value;
                            setVariants(newV);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 text-xs focus:outline-none focus:border-sky-500"
                        />
                      </div>
                      <div className="col-span-4">
                        <input
                          type="text"
                          placeholder="O‘lcham (92)"
                          value={v.size}
                          onChange={(e) => {
                            const newV = [...variants];
                            newV[idx].size = e.target.value;
                            setVariants(newV);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 text-xs focus:outline-none focus:border-sky-500"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          placeholder="Soni"
                          value={v.stock}
                          onChange={(e) => {
                            const newV = [...variants];
                            newV[idx].stock = Number(e.target.value);
                            setVariants(newV);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 text-xs font-mono font-bold focus:outline-none focus:border-sky-500"
                        />
                      </div>
                      <div className="col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(v.id)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition-all"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 rounded-xl transition-all shadow-md"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
