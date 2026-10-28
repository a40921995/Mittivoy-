import React from 'react';
import { X, Bell, CheckCheck, Sparkles, Package, Tag } from 'lucide-react';
import { AppNotification } from '../../types';

interface NotificationsModalProps {
  notifications: AppNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="p-4 bg-sky-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-white" />
            <h3 className="font-bold text-sm">Bildirishnomalar</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] text-sky-100 hover:text-white flex items-center gap-1 font-medium"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>O‘qilgan deb belgilash</span>
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto space-y-2.5 text-xs text-slate-700">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Bell className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p>Yangi bildirishnomalar mavjud emas</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onMarkAsRead(n.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  n.isRead
                    ? 'bg-white border-slate-100 text-slate-600'
                    : 'bg-sky-50/60 border-sky-200 text-slate-900 font-medium'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                    {n.type === 'order' ? (
                      <Package className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    ) : n.type === 'discount' ? (
                      <Tag className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    )}
                    <span>{n.title}</span>
                  </div>
                  <span className="text-[9px] text-slate-400 shrink-0">{n.date}</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  {n.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
