import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Layers, Check } from 'lucide-react';
import { CategoryItem, GenderType } from '../../../types';
import { storageService } from '../../../services/storageService';

interface CategoriesSectionProps {
  categories: CategoryItem[];
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categories }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [name, setName] = useState<string>('');
  const [gender, setGender] = useState<GenderType | 'barchasi'>('barchasi');

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setGender('barchasi');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setName(cat.name);
    setGender(cat.gender);
    setIsModalOpen(true);
  };

  const handleToggleActive = (cat: CategoryItem) => {
    storageService.saveCategory({
      ...cat,
      isActive: !cat.isActive
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Kategoriyani o‘chirishni tasdiqlaysizmi?')) {
      storageService.deleteCategory(id);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    storageService.saveCategory({
      id: editingCategory ? editingCategory.id : `cat-${Date.now()}`,
      name,
      iconName: 'Layers',
      itemCount: editingCategory ? editingCategory.itemCount : 0,
      gender,
      isActive: editingCategory ? editingCategory.isActive : true
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">3. Kategoriyalar Boshqaruvi</h2>
          <p className="text-xs text-slate-500">
            Katalog bo‘limlari, ko‘rsatish/yashirish va yangi toifalar yaratish
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-md flex items-center gap-1.5 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Kategoriya Qo‘shish</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`p-4 rounded-2xl border transition-all ${
              cat.isActive
                ? 'bg-white border-slate-200 shadow-xs'
                : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">{cat.name}</h4>
                  <span className="text-[11px] text-slate-400 block">
                    Jins: {cat.gender === 'ogil' ? 'O‘g‘il bolalar' : cat.gender === 'qiz' ? 'Qiz bolalar' : 'Barchasi'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleToggleActive(cat)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    cat.isActive
                      ? 'text-emerald-600 hover:bg-emerald-50'
                      : 'text-slate-400 hover:bg-slate-100'
                  }`}
                  title={cat.isActive ? 'Yashirish' : 'Faollashtirish'}
                >
                  {cat.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                  title="Tahrirlash"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  title="O‘chirish"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm text-slate-800">
              {editingCategory ? 'Kategoriyani Tahrirlash' : 'Yangi Kategoriya Qo‘shish'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Kategoriya Nomi:</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan, Pajamalar yoki Bodiylar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Tegishli Jins:</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-sky-500"
                >
                  <option value="barchasi">Barchasi (Uniseks)</option>
                  <option value="ogil">O‘g‘il bolalar</option>
                  <option value="qiz">Qiz bolalar</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 rounded-xl shadow-md"
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
