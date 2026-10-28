import React, { useState } from 'react';
import { Send, CheckCircle2, Shield, Bell, Check, X, RefreshCw, Smartphone } from 'lucide-react';
import { AdminSettings, Order } from '../../../types';
import { storageService } from '../../../services/storageService';

interface TelegramSectionProps {
  settings: AdminSettings;
  orders: Order[];
}

export const TelegramSection: React.FC<TelegramSectionProps> = ({
  settings,
  orders
}) => {
  const [botToken, setBotToken] = useState<string>(settings.telegram.botToken);
  const [chatId, setChatId] = useState<string>(settings.telegram.chatId);
  const [channelUsername, setChannelUsername] = useState<string>(
    settings.telegram.channelUsername || '@mittivoy_bolalar'
  );
  const [notifyOrder, setNotifyOrder] = useState<boolean>(settings.telegram.notifyOnNewOrder);
  const [notifyPayment, setNotifyPayment] = useState<boolean>(settings.telegram.notifyOnPayment);
  const [notifyLowStock, setNotifyLowStock] = useState<boolean>(settings.telegram.notifyOnLowStock);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [testSent, setTestSent] = useState<boolean>(false);

  const telegramLogs = storageService.getTelegramMessages();

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveSettings({
      ...settings,
      telegram: {
        botToken,
        chatId,
        channelUsername,
        notifyOnNewOrder: notifyOrder,
        notifyOnPayment: notifyPayment,
        notifyOnLowStock: notifyLowStock,
        allowInlineApproval: true
      }
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSendTestMessage = () => {
    setTestSent(true);
    storageService.getTelegramMessages().unshift({
      id: `tg-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      text: '🤖 <b>MITTIVOY BOT:</b> Aloqa muvaffaqiyatli o‘rnatildi! Tizim yangi buyurtmalar va to‘lov cheklarini ushbu chatga avtomatik yuboradi.',
      status: 'delivered'
    });
    setTimeout(() => setTestSent(false), 3000);
  };

  const handleInlineAction = (orderId: string, action: 'approve_order' | 'reject_order' | 'approve_payment') => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    if (action === 'approve_order') {
      storageService.updateOrderStatus(orderId, 'Tasdiqlangan');
    } else if (action === 'reject_order') {
      storageService.updateOrderStatus(orderId, 'Bekor qilingan');
    } else if (action === 'approve_payment') {
      storageService.updateOrderStatus(orderId, 'Tasdiqlangan', 'Tasdiqlandi');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Send className="w-5 h-5 text-sky-500" />
            <span>13. Telegram Bot Integratsiyasi</span>
          </h2>
          <p className="text-xs text-slate-500">
            Buyurtma va to‘lov bildirishnomalarini Telegram orqali qabul qilish va inline tugmalar bilan boshqarish
          </p>
        </div>

        <button
          onClick={handleSendTestMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{testSent ? 'Sinov xabari yuborildi!' : 'Botni Sinash'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Settings Configuration Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 p-5 rounded-3xl space-y-4 shadow-xs">
          <h3 className="font-bold text-sm text-slate-800">Bot Sozlamalari (API & Chat ID)</h3>

          <form onSubmit={handleSaveSettings} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Bot Token (@BotFather orqali olingan):
              </label>
              <input
                type="text"
                required
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono text-xs focus:outline-none focus:border-sky-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Xavfsizlik: Token server muhitida saqlanadi va mijoz kodiga oshkor etilmaydi.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Admin Chat ID / Guruh ID:
                </label>
                <input
                  type="text"
                  required
                  value={chatId}
                  onChange={(e) => setChatId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Kanal Usernamesi (ixtiyoriy):
                </label>
                <input
                  type="text"
                  value={channelUsername}
                  onChange={(e) => setChannelUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Notification triggers */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="font-bold text-slate-800 text-xs block">
                Telegramga yuboriladigan xabarlar:
              </span>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={notifyOrder}
                  onChange={(e) => setNotifyOrder(e.target.checked)}
                  className="w-4 h-4 accent-sky-500"
                />
                <span>Yangi buyurtma tushganda darhol xabar berish</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={notifyPayment}
                  onChange={(e) => setNotifyPayment(e.target.checked)}
                  className="w-4 h-4 accent-sky-500"
                />
                <span>To‘lov cheki yuklanganda xabar berish</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={notifyLowStock}
                  onChange={(e) => setNotifyLowStock(e.target.checked)}
                  className="w-4 h-4 accent-sky-500"
                />
                <span>Omborda tovar soni kam qolganda ogohlantirish</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSaved ? 'Sozlamalar Saqlandi!' : 'Sozlamalarni Saqlash'}</span>
            </button>
          </form>
        </div>

        {/* Telegram Bot Live Stream & Inline Button Simulator */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col justify-between space-y-3 shadow-md">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">MITTIVOY Bot Stream</h4>
                  <span className="text-[10px] text-emerald-400 font-mono">@mittivoy_bot • onlayn</span>
                </div>
              </div>
            </div>

            {/* Telegram simulated messages feed */}
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {telegramLogs.map((log) => {
                const linkedOrder = orders.find((o) => o.id === log.orderId);
                return (
                  <div
                    key={log.id}
                    className="bg-slate-800/90 border border-slate-700 p-3 rounded-2xl space-y-2 text-xs shadow-sm"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Telegram Bot Xabari</span>
                      <span>{log.date}</span>
                    </div>

                    <div
                      className="text-slate-100 text-xs whitespace-pre-line leading-relaxed font-sans"
                      dangerouslySetInnerHTML={{ __html: log.text }}
                    />

                    {/* Inline Approval Buttons Simulation */}
                    {linkedOrder && (
                      <div className="pt-2 border-t border-slate-700 space-y-1.5">
                        <span className="text-[10px] text-slate-300 block font-semibold">
                          Inline Boshqaruv Tugmalari:
                        </span>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            onClick={() => handleInlineAction(linkedOrder.id, 'approve_order')}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-all"
                          >
                            <Check className="w-3 h-3" />
                            <span>Buyurtmani Tasdiqlash</span>
                          </button>
                          <button
                            onClick={() => handleInlineAction(linkedOrder.id, 'reject_order')}
                            className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-all"
                          >
                            <X className="w-3 h-3" />
                            <span>Rad Etish</span>
                          </button>
                        </div>
                        {linkedOrder.paymentStatus === 'Tekshirilmoqda' && (
                          <button
                            onClick={() => handleInlineAction(linkedOrder.id, 'approve_payment')}
                            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold text-[10px] py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all"
                          >
                            <span>💳 To‘lovni Tasdiqlash</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
