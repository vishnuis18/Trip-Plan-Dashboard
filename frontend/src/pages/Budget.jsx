import React from 'react';
import { 
  Wallet, 
  Plus, 
  Trash2, 
  DollarSign, 
  TrendingUp, 
  Plane, 
  Hotel, 
  Utensils, 
  Ticket, 
  Car, 
  MoreHorizontal 
} from 'lucide-react';
import { useTrip } from '../context/TripContext';

export const Budget = () => {
  const { expenses, budgetSummary, activeTrip, deleteExpense, openModal } = useTrip();

  const totalBudget = activeTrip?.totalBudget || 0;
  const totalSpent = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const remaining = Math.max(0, totalBudget - totalSpent);
  const spentPercent = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;

  const categoryIcons = {
    Flights: Plane,
    Hotels: Hotel,
    Food: Utensils,
    Activities: Ticket,
    Transport: Car,
    Other: MoreHorizontal,
  };

  const categoryColors = {
    Flights: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    Hotels: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    Food: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    Activities: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    Transport: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    Other: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
  };

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.08]">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Budget & Expenses</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {activeTrip?.destination ? `${activeTrip.destination} Financial Overview & Tracking` : 'Financial Overview & Tracking'}
          </p>
        </div>

        <button
          onClick={() => openModal('addExpense')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Budget Card */}
        <div className="p-5 rounded-3xl bg-[#121927] border border-white/[0.08] shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">Total Trip Budget</span>
            <span className="text-2xl font-bold font-mono text-white">
              ${totalBudget.toLocaleString()}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        {/* Total Spent Card */}
        <div className="p-5 rounded-3xl bg-[#121927] border border-white/[0.08] shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">Total Amount Spent</span>
            <span className="text-2xl font-bold font-mono text-amber-400">
              ${totalSpent.toLocaleString()}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Remaining Budget Card */}
        <div className="p-5 rounded-3xl bg-[#121927] border border-white/[0.08] shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">Remaining Balance</span>
            <span className={`text-2xl font-bold font-mono ${remaining > 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
              ${remaining.toLocaleString()}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Progress & Category Cards */}
      <div className="p-6 rounded-3xl bg-[#121927] border border-white/[0.08] shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Budget Utilization: {spentPercent}% Spent
          </span>
          <span className="text-xs font-mono text-slate-400">
            ${totalSpent.toLocaleString()} of ${totalBudget.toLocaleString()}
          </span>
        </div>

        {/* Multi-color Progress bar */}
        <div className="w-full h-3 rounded-full bg-slate-800/80 overflow-hidden flex">
          <div
            style={{ width: `${spentPercent}%` }}
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-700"
          />
        </div>

        {/* Category breakdown pills */}
        {budgetSummary?.categoryBreakdown && budgetSummary.categoryBreakdown.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            {budgetSummary.categoryBreakdown.map((cat) => {
              const Icon = categoryIcons[cat.category] || MoreHorizontal;
              const style = categoryColors[cat.category] || categoryColors.Other;
              return (
                <div
                  key={cat.category}
                  className={`p-3 rounded-2xl border ${style} flex flex-col justify-between`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold">{cat.category}</span>
                    <Icon className="w-3.5 h-3.5 opacity-80" />
                  </div>
                  <div>
                    <span className="text-sm font-bold font-mono block">${cat.amount}</span>
                    <span className="text-[10px] opacity-80 font-mono">{cat.percentage}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 pt-2">No category expenses logged yet.</p>
        )}
      </div>

      {/* Detailed Expenses Table */}
      <div className="rounded-3xl bg-[#121927] border border-white/[0.08] shadow-xl overflow-hidden">
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Expense Records</h3>
          <span className="text-xs text-slate-400 font-mono">{expenses.length} transactions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.02] text-slate-400 font-semibold border-b border-white/[0.06]">
              <tr>
                <th className="py-3 px-5">Category</th>
                <th className="py-3 px-5">Description</th>
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5">Payment Method</th>
                <th className="py-3 px-5 text-right">Amount</th>
                <th className="py-3 px-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No expense records found. Click 'Add Expense' above to start tracking.
                  </td>
                </tr>
              ) : (
                expenses.map((exp) => {
                const Icon = categoryIcons[exp.category] || MoreHorizontal;
                return (
                  <tr key={exp._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-blue-400">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold text-white">{exp.category}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-slate-300 font-medium">{exp.description || '—'}</td>
                    <td className="py-3.5 px-5 text-slate-400 font-mono">{exp.date}</td>
                    <td className="py-3.5 px-5 text-slate-400">{exp.paymentMethod || 'Credit Card'}</td>
                    <td className="py-3.5 px-5 text-right font-bold text-white font-mono">
                      ${Number(exp.amount).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <button
                        onClick={() => deleteExpense(exp._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Expense"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
