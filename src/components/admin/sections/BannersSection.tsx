import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import { Banner } from '../../../types';
import { storageService } from '../../../services/storageService';

interface BannersSectionProps {
  banners: Banner[];
}

export const BannersSection: React.FC<BannersSectionProps> = ({ banners }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const [title, setTitle] = useState<string>('');
  const [subtitle, setSubtitle] = useState<string>('');
  const [tag, setTag] = useState<string>('YANGI TO‘PLAM');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [linkCategory, setLinkCategory] = useState<string>('Dvoykalar');

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setTitle('');
    setSubtitle('');
    setTag('YANGI TO‘PLAM');
    setImageUrl('https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80');
    setLinkCategory('Dvoykalar');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: Banner) => {
    setEditingBanner(b);
    setTitle(b.title);
    setSubtitle(b.subtitle);
    setTag(b.tag);
    setImageUrl(b.imageUrl);
    setLinkCategory(b.linkCategory || 'Dvoykalar');
    setIsModalOpen(true);
  };

  const handleToggle = (b: Banner) => {
    storageService.saveBanner({
      ...b,
      isActive: !b.isActive
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Ushbu bannerni o‘chirmoqchimisiz?')) {
      storageService.deleteBanner(id);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    storageService.saveBanner({
      id: editingBanner ? editingBanner.id : `ban-${Date.now()}`,
      title,
      subtitle,
      tag,
      imageUrl,
      linkCategory,
      isActive: editingBanner ? editingBanner.isActive : true,
      order: editingBanner ? editingBanner.order : banners.length + 1
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-800">12. Bannerlar Boshqaruvi</h2>
          <p className="text-xs text-slate-500">
            Bosh sahifadagi reklama slaydlari, aksiyalar, fotosuratlar va sarlavhalar
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-md flex items-center gap-1.5 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Banner Qo‘shish</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map((b) => (
          <div
            key={b.id}
            className={`rounded-3xl border overflow-hidden flex flex-col justify-between transition-all ${
              b.isActive
                ? 'bg-white border-slate-200 shadow-xs'
                : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div className="relative aspect-16/9 w-full bg-slate-100">
              <img
                src={b.imageUrl}
                alt={b.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-[#FF4FA3] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase shadow-xs">
                {b.tag}
              </span>
            </div>

            <div className="p-4 space-y-2">
              <h4 className="font-bold text-sm text-slate-800">{b.title}</h4>
              <p className="text-xs text-slate-500">{b.subtitle}</p>
              {b.linkCategory && (
                <span className="text-[10px] text-sky-700 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-md inline-block font-semibold">
                  Kategoriya: {b.linkCategory}
                </span>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleToggle(b)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 border ${
                    b.isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {b.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{b.isActive ? 'Faol' : 'Nofaol'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-sky-500 text-slate-600 hover:text-white transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-500 text-slate-600 hover:text-white transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm text-slate-800">
              {editingBanner ? 'Bannerni Tahrirlash' : 'Yangi Banner Qo‘shish'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Sarlavha:</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan, Bahorgi 2026 To‘plami"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Quyi matn:</label>
                <input
                  type="text"
                  placeholder="Masalan, 100% paxtali kiyimlar"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Chegirma / Promo tegi:</label>
                <input
                  type="text"
                  placeholder="Masalan, AKSIYA yoki 30% CHEGIRMA"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Rasm URL:</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono text-[11px] focus:outline-none focus:border-sky-500"
                />
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
