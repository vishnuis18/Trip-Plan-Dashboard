import React from 'react';
import { 
  PieChart, 
  Plane, 
  Hotel, 
  Utensils, 
  Ticket, 
  Car, 
  MoreHorizontal, 
  Plus,
  ArrowUpRight
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
      bgTint: 'bg-blue-500/10',
      borderTint: 'border-blue-500/30',
      textTint: 'text-blue-400',
      barColor: '#3B82F6'
    },
    Hotels: {
      icon: Hotel,
      color: '#10B981',
      bgTint: 'bg-emerald-500/10',
      borderTint: 'border-emerald-500/30',
      textTint: 'text-emerald-400',
      barColor: '#10B981'
    },
    Food: {
      icon: Utensils,
      color: '#F59E0B',
      bgTint: 'bg-amber-500/10',
      borderTint: 'border-amber-500/30',
      textTint: 'text-amber-400',
      barColor: '#F59E0B'
    },
    Activities: {
      icon: Ticket,
      color: '#8B5CF6',
      bgTint: 'bg-purple-500/10',
      borderTint: 'border-purple-500/30',
      textTint: 'text-purple-400',
      barColor: '#8B5CF6'
    },
    Transport: {
      icon: Car,
      color: '#06B6D4',
      bgTint: 'bg-cyan-500/10',
      borderTint: 'border-cyan-500/30',
      textTint: 'text-cyan-400',
      barColor: '#06B6D4'
    },
    Other: {
      icon: MoreHorizontal,
      color: '#64748B',
      bgTint: 'bg-slate-500/10',
      borderTint: 'border-slate-500/30',
      textTint: 'text-slate-400',
      barColor: '#64748B'
    }
  };

  return (
    <div className="rounded-3xl bg-[#121927]/90 border border-white/[0.08] p-6 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <PieChart className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">Budget Breakdown</h3>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-base font-bold text-white font-mono">
            ${totalBudget.toLocaleString()}
          </span>
          <button
            onClick={() => openModal('addExpense')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {breakdown.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-xs text-slate-400 mb-2">No expenses recorded yet.</p>
          <button
            onClick={() => openModal('addExpense')}
            className="text-xs text-emerald-400 hover:underline inline-flex items-center gap-1 font-semibold"
          >
            <Plus className="w-3 h-3" /> Log your first expense
          </button>
        </div>
      ) : (
        <>
          {/* Multi-segment Progress Bar */}
          <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-800/60 mb-5">
            {breakdown.map((item) => {
              const cfg = categoryConfigs[item.category] || categoryConfigs.Other;
              const pctVal = parseFloat(item.percentage) || 0;
              return (
                <div
                  key={item.category}
                  style={{ width: `${pctVal}%`, backgroundColor: cfg.barColor }}
                  className="h-full transition-all duration-700"
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
              return (
                <div
                  key={item.category}
                  onClick={onViewBudgetClick}
                  className={`flex items-center gap-2.5 p-2.5 rounded-2xl ${cfg.bgTint} border ${cfg.borderTint} hover:brightness-125 transition-all cursor-pointer`}
                >
                  <div className={`w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4 h-4 ${cfg.textTint}`} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-slate-200 block truncate">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 block whitespace-nowrap">
                      {item.percentage} · ${item.amount}
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
