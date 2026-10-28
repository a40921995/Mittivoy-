import React, { useState } from 'react';
import { Plus, Trash2, Receipt, DollarSign, Calendar, Tag } from 'lucide-react';
import { Expense } from '../../../types';
import { storageService } from '../../../services/storageService';

interface ExpensesSectionProps {
  expenses: Expense[];
}

export const ExpensesSection: React.FC<ExpensesSectionProps> = ({ expenses }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [amount, setAmount] = useState<number>(500000);
  const [category, setCategory] = useState<Expense['category']>('Mahsulot xaridi');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState<string>('');

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  const categories: Expense['category'][] = [
    'Mahsulot xaridi',
    'Yetkazib berish',
    'Ijara',
    'Ish haqi',
    'Reklama',
    'Kommunal to‘lovlar',
    'Boshqa'
  ];

  const handleOpenAdd = () => {
    setTitle('');
    setAmount(500000);
    setCategory('Mahsulot xaridi');
    setDate(new Date().toISOString().split('T')[0]);
    setNote('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amount <= 0) return;

    storageService.saveExpense({
      id: `exp-${Date.now()}`,
      title,
      amount: Number(amount),
      category,
      date,
      note
    });

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Xarajat yozuvini o‘chirmoqchimisiz?')) {
      storageService.deleteExpense(id);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">9. Xarajatlar Hisobi</h2>
          <p className="text-xs text-slate-500">
            Mahsulot xaridi, ijara, ish haqi, reklama va boshqa do‘kon chiqimlari (Sof foydada hisoblanadi)
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-md flex items-center gap-1.5 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Xarajat Qo‘shish</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 p-5 rounded-3xl flex items-center justify-between shadow-xs">
        <div>
          <span className="text-[11px] text-slate-500 font-semibold">Jami Kiritilgan Xarajatlar:</span>
          <div className="text-2xl font-black text-pink-600 font-mono mt-0.5">
            {totalExpense.toLocaleString('uz-UZ')} UZS
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center border border-pink-100">
          <Receipt className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-500">
              <tr>
                <th className="p-3.5 font-semibold">Sana</th>
                <th className="p-3.5 font-semibold">Nomi / Maqsadi</th>
                <th className="p-3.5 font-semibold">Kategoriya</th>
                <th className="p-3.5 font-semibold">Summasi</th>
                <th className="p-3.5 font-semibold">Izoh</th>
                <th className="p-3.5 font-semibold text-right">O‘chirish</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-mono text-slate-400">{exp.date}</td>
                  <td className="p-3.5 font-bold text-slate-800 text-xs">{exp.title}</td>
                  <td className="p-3.5">
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-slate-200">
                      {exp.category}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-black text-pink-600">
                    {exp.amount.toLocaleString('uz-UZ')} UZS
                  </td>
                  <td className="p-3.5 text-slate-500 text-[11px]">{exp.note || '-'}</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="O‘chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm text-slate-800">Yangi Xarajat Qo‘shish</h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Xarajat Nomi:</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan, Reklama yoki Yetkazib berish haqi"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Summa (UZS):</label>
                <input
                  type="number"
                  required
                  min="1000"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono font-bold focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Kategoriya:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-sky-500"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Sanasi:</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Izoh (ixtiyoriy):</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Batafsil izoh..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-sky-500"
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
                  Qo‘shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
