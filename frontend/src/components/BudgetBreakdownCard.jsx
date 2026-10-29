import React from 'react';
import { 
  PieChart, 
  Plane, 
  Hotel, 
  Utensils, 
  Ticket, 
  Car, 
  MoreHorizontal, 
  Plus
} from 'lucide-react';
import { useTrip } from '../context/TripContext';

export const BudgetBreakdownCard = ({ onViewBudgetClick }) => {
  const { budgetSummary, activeTrip, openModal } = useTrip();

  const totalBudget = activeTrip?.totalBudget || 0;
  const breakdown = budgetSummary?.categoryBreakdown || [];

  const categoryConfigs = {
    Flights: {
      icon: Plane,
      color: '#3B82F6',
      iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      barColor: '#3B82F6'
    },
    Hotels: {
      icon: Hotel,
      color: '#10B981',
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      barColor: '#10B981'
    },
    Food: {
      icon: Utensils,
      color: '#F59E0B',
      iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      barColor: '#F59E0B'
    },
    Activities: {
      icon: Ticket,
      color: '#8B5CF6',
      iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      barColor: '#8B5CF6'
    },
    Transport: {
      icon: Car,
      color: '#06B6D4',
      iconBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
      barColor: '#06B6D4'
    },
    Other: {
      icon: MoreHorizontal,
      color: '#64748B',
      iconBg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
      barColor: '#64748B'
    }
  };

  return (
    <div className="budget-breakdown-card rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200/80 dark:border-white/[0.06] gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FF5B45]/10 border border-[#FF5B45]/20 flex items-center justify-center text-[#FF5B45] shrink-0">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
              Budget Breakdown
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Categorized travel expenses & allocations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider leading-none">
              Total Budget
            </span>
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-mono mt-0.5 block">
              ${totalBudget.toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => openModal('addExpense')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FF644E] to-[#FF4538] hover:from-[#FF553E] hover:to-[#FF3628] text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all cursor-pointer transform hover:scale-[1.02] active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {breakdown.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xs text-slate-400 mb-2">No expenses recorded yet.</p>
          <button
            onClick={() => openModal('addExpense')}
            className="text-xs text-[#FF5B45] hover:underline inline-flex items-center gap-1 font-semibold"
          >
            <Plus className="w-3 h-3" /> Log your first expense
          </button>
        </div>
      ) : (
        <>
          {/* Multi-segment Progress Bar with Smooth Segmented Track */}
          <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800/80 p-0.5 gap-0.5 mb-5 shadow-inner">
            {breakdown.map((item) => {
              const cfg = categoryConfigs[item.category] || categoryConfigs.Other;
              const pctVal = parseFloat(item.percentage) || 0;
              if (pctVal <= 0) return null;
              return (
                <div
                  key={item.category}
                  style={{ width: `${pctVal}%`, backgroundColor: cfg.barColor }}
                  className="h-full rounded-full transition-all duration-700"
                  title={`${item.category}: ${item.percentage} ($${item.amount})`}
                />
              );
            })}
          </div>

          {/* 6 Category Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {breakdown.map((item) => {
              const cfg = categoryConfigs[item.category] || categoryConfigs.Other;
              const Icon = cfg.icon;
              const pctNumber = Math.round(parseFloat(item.percentage) || 0);

              return (
                <div
                  key={item.category}
                  onClick={onViewBudgetClick}
                  className="budget-cat-card flex flex-col justify-between p-3 rounded-2xl cursor-pointer group"
                  title={`View ${item.category} expenses`}
                >
                  {/* Top row: Icon & Percentage badge */}
                  <div className="flex items-center justify-between gap-1">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${cfg.iconBg} transition-transform group-hover:scale-110 duration-200`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400 font-mono">
                      {pctNumber}%
                    </span>
                  </div>

                  {/* Bottom section: Category name & bold amount */}
                  <div className="mt-2.5">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block truncate group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                      {item.category}
                    </span>
                    <span className="text-sm font-black text-slate-900 dark:text-white font-mono mt-0.5 block">
                      ${item.amount?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
