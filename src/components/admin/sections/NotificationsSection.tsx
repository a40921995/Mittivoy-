import React, { useState } from 'react';
import { Bell, Send, CheckCircle2, Tag, Sparkles, Package } from 'lucide-react';
import { AppNotification } from '../../../types';
import { storageService } from '../../../services/storageService';

interface NotificationsSectionProps {
  notifications: AppNotification[];
}

export const NotificationsSection: React.FC<NotificationsSectionProps> = ({
  notifications
}) => {
  const [title, setTitle] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [type, setType] = useState<AppNotification['type']>('discount');
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    storageService.addNotification({
      title,
      message,
      type
    });

    setTitle('');
    setMessage('');
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Bell className="w-5 h-5 text-sky-500" />
            <span>14. Push Bildirishnomalar Tarqatish (Expo Notifications)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Mijozlar telefonlariga aksiyalar, chegirmalar va tizimli e’lonlarni tarqatish markazi
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Broadcast Form */}
        <div className="lg:col-span-6 bg-white border border-slate-200 p-5 rounded-3xl space-y-4 shadow-xs">
          <h3 className="font-bold text-sm text-slate-800">Yangi Bildirishnoma Yuborish</h3>

          {sentSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-2xl flex items-center gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Bildirishnoma barcha mijozlarga muvaffaqiyatli tarqatildi!</span>
            </div>
          )}

          <form onSubmit={handleBroadcast} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Bildirishnoma Turi:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'discount', label: '🌸 Chegirma', icon: Tag },
                  { id: 'new_product', label: '✨ Yangi Tovar', icon: Sparkles },
                  { id: 'system', label: '📢 Tizimli', icon: Bell }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id as any)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 ${
                      type === t.id
                        ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Sarlavha (Title):
              </label>
              <input
                type="text"
                required
                placeholder="Masalan, Bahorgi 30% Chegirma Boshlandi! 🌸"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Xabar Matni (Message):
              </label>
              <textarea
                required
                rows={3}
                placeholder="Mijozlar ekranida ko‘rinadigan xabar matni..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-98"
            >
              <Send className="w-4 h-4" />
              <span>Barcha Mijozlarga Tarqatish</span>
            </button>
          </form>
        </div>

        {/* History / Sent Logs */}
        <div className="lg:col-span-6 bg-white border border-slate-200 p-5 rounded-3xl space-y-4 shadow-xs">
          <h3 className="font-bold text-sm text-slate-800">Yuborilgan Bildirishnomalar Tarixi</h3>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs">{n.title}</span>
                  <span className="text-[10px] text-slate-400">{n.date}</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
                <span className="text-[9px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md inline-block uppercase font-bold">
                  {n.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
