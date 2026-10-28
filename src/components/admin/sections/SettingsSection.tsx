import React, { useState } from 'react';
import {
  Settings,
  Shield,
  CreditCard,
  Save,
  CheckCircle2,
  Database,
  RotateCcw,
  Download,
  UploadCloud
} from 'lucide-react';
import { AdminSettings } from '../../../types';
import { storageService } from '../../../services/storageService';

interface SettingsSectionProps {
  settings: AdminSettings;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ settings }) => {
  const [storeName, setStoreName] = useState<string>(settings.storeName);
  const [storePhone, setStorePhone] = useState<string>(settings.storePhone);
  const [storeAddress, setStoreAddress] = useState<string>(settings.storeAddress);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(settings.lowStockThreshold);
  const [clickCardNumber, setClickCardNumber] = useState<string>(settings.clickCardNumber);
  const [clickMerchantId, setClickMerchantId] = useState<string>(settings.clickMerchantId);
  const [paynetCardNumber, setPaynetCardNumber] = useState<string>(settings.paynetCardNumber);
  const [paynetMerchantId, setPaynetMerchantId] = useState<string>(settings.paynetMerchantId);
  const [adminPin, setAdminPin] = useState<string>(settings.adminPin);

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveSettings({
      ...settings,
      storeName,
      storePhone,
      storeAddress,
      lowStockThreshold: Number(lowStockThreshold),
      clickCardNumber,
      clickMerchantId,
      paynetCardNumber,
      paynetMerchantId,
      adminPin
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      products: storageService.getProducts(),
      categories: storageService.getCategories(),
      banners: storageService.getBanners(),
      orders: storageService.getOrders(),
      offlineSales: storageService.getOfflineSales(),
      expenses: storageService.getExpenses(),
      movements: storageService.getInventoryMovements(),
      reviews: storageService.getReviews(),
      settings: storageService.getSettings()
    };

    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(backupData, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `MITTIVOY_Backup_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
  };

  const handleResetDemo = () => {
    if (confirm('Barcha ma’lumotlarni dastlabki demo holatiga qaytarishni tasdiqlaysizmi?')) {
      storageService.resetToFactoryDemo();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-sky-500" />
            <span>15. Tizim Sozlamalari</span>
          </h2>
          <p className="text-xs text-slate-500">
            Do‘kon rekvizitlari, Click/Paynet to‘lov hisoblari, PIN kod va ma’lumotlar bazasi zaxira nusxasi
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-2xl flex items-center gap-2 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Barcha sozlamalar muvaffaqiyatli saqlandi!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Store Information */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-4 text-xs shadow-xs">
          <h3 className="font-bold text-sm text-slate-800">Do‘kon Ma’lumotlari</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Do‘kon Nomi:</label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Aloqa Telefoni:</label>
              <input
                type="text"
                required
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Do‘kon Manzili:</label>
            <input
              type="text"
              required
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">
              Kam qolgan tovar ogohlantirish chegarasi (dona):
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(Number(e.target.value))}
              className="w-full sm:w-48 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-none focus:border-sky-500 font-bold"
            />
          </div>
        </div>

        {/* Click & Paynet Payment Cards */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-4 text-xs shadow-xs">
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-sky-500" />
            <span>To‘lov Rekvizitlari (Click va Paynet)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Click */}
            <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-100 space-y-2.5">
              <span className="font-black text-sky-600 text-xs block">CLICK REKVIZITLARI</span>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Click Karta Raqami:</label>
                <input
                  type="text"
                  required
                  value={clickCardNumber}
                  onChange={(e) => setClickCardNumber(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono font-bold focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Click Merchant ID:</label>
                <input
                  type="text"
                  value={clickMerchantId}
                  onChange={(e) => setClickMerchantId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Paynet */}
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2.5">
              <span className="font-black text-emerald-600 text-xs block">PAYNET REKVIZITLARI</span>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Paynet Karta Raqami:</label>
                <input
                  type="text"
                  required
                  value={paynetCardNumber}
                  onChange={(e) => setPaynetCardNumber(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono font-bold focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Paynet Terminal ID:</label>
                <input
                  type="text"
                  value={paynetMerchantId}
                  onChange={(e) => setPaynetMerchantId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security & Admin PIN */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-3 text-xs shadow-xs">
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <Shield className="w-4 h-4 text-pink-500" />
            <span>Xavfsizlik & Kirish PIN Kodi</span>
          </h3>

          <div className="max-w-xs">
            <label className="block text-slate-600 font-semibold mb-1">
              Admin Panel PIN Kodi (Standart: 2026):
            </label>
            <input
              type="password"
              maxLength={8}
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono text-base font-bold text-center tracking-widest focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Save button */}
        <button
          type="submit"
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 text-xs"
        >
          <Save className="w-4 h-4" />
          <span>Barcha Sozlamalarni Saqlash</span>
        </button>
      </form>

      {/* Database Backup & Factory Reset */}
      <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-3 text-xs shadow-xs">
        <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
          <Database className="w-4 h-4 text-amber-500" />
          <span>Ma’lumotlar Bazasi Zaxirasi & Tiklash</span>
        </h3>
        <p className="text-slate-500 text-[11px]">
          Barcha tovarlar, buyurtmalar, kassa operatsiyalari va mijozlar ma’lumotlarini JSON fayl qilib yuklab oling yoki boshlang‘ich demo holatiga qaytaring.
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            onClick={handleExportBackup}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all text-xs"
          >
            <Download className="w-4 h-4 text-sky-600" />
            <span>JSON Nusxasini Yuklab Olish (Backup)</span>
          </button>

          <button
            onClick={handleResetDemo}
            className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all text-xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Dastlabki Demo Holatiga Qaytarish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
