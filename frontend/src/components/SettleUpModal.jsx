import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  CheckCircle2, 
  Coins, 
  Copy, 
  Check, 
  User, 
  ShieldCheck, 
  Sparkles,
  DollarSign
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { calculateSettleUp } from '../services/settleUpService';
import confetti from 'canvas-confetti';

export const SettleUpModal = ({ isOpen, onClose, members = [] }) => {
  const { expenses, activeTrip } = useTrip();
  const [settledTxIds, setSettledTxIds] = useState([]);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const defaultMembers = members.length > 0 ? members : [
    { name: 'Shihab' },
    { name: 'Aiden Vance' }
  ];

  const { balances, transactions } = calculateSettleUp(expenses, defaultMembers);

  const toggleSettle = (id) => {
    setSettledTxIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      if (!prev.includes(id)) {
        confetti({
          particleCount: 20,
          spread: 50,
          origin: { y: 0.6 }
        });
      }
      return next;
    });
  };

  const handleCopySummary = () => {
    const lines = [
      `💸 EXPENSE SETTLE-UP: ${activeTrip?.destination || 'Trip'}`,
      `Total Expenses: $${expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0)}`,
      '',
      '--- NET BALANCES ---',
      ...Object.entries(balances).map(
        ([person, net]) => `• ${person}: ${net >= 0 ? `+$${net}` : `-$${Math.abs(net)}`}`
      ),
      '',
      '--- TRANSFERS NEEDED ---',
      ...(transactions.length > 0
        ? transactions.map((t) => `• ${t.from} pays ${t.to} $${t.amount}`)
        : ['🎉 All settled! Nobody owes anything.'])
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const totalSpent = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-3xl bg-[#121927] border border-white/10 shadow-2xl p-6 relative flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 shrink-0">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Expense Settle-Up ("Who Owes Whom")</h3>
            <p className="text-xs text-slate-400">
              Optimal minimal transfers for {activeTrip?.destination || 'this trip'}
            </p>
          </div>
        </div>

        {/* Total Summary Strip */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-black/20 border border-white/[0.05]">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total Pool</span>
            <span className="text-base font-bold text-white font-mono mt-0.5 block">${totalSpent.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Transfers Needed</span>
            <span className="text-base font-bold text-emerald-400 font-mono mt-0.5 block">{transactions.length} payments</span>
          </div>
        </div>

        {/* Net Balances Section */}
        <div>
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Net Balances
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(balances).map(([person, net]) => {
              const isPositive = net >= 0;
              return (
                <div
                  key={person}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                    isPositive
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{person}:</span>
                  <span className="font-mono">{isPositive ? `+$${net}` : `-$${Math.abs(net)}`}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Minimal Transactions List */}
        <div>
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Suggested Settle-Up Transfers
          </h4>

          {transactions.length === 0 ? (
            <div className="py-8 text-center rounded-2xl bg-[#141B2D]/40 border border-white/[0.05] flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              <p className="text-sm font-semibold text-white">All expenses are square!</p>
              <p className="text-xs text-slate-400">Nobody currently owes money in this group.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {transactions.map((tx) => {
                const isSettled = settledTxIds.includes(tx.id);
                return (
                  <div
                    key={tx.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isSettled
                        ? 'bg-white/[0.02] border-white/[0.04] opacity-50'
                        : 'bg-[#18233C]/80 border-white/[0.08] hover:border-emerald-500/40 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="px-2.5 py-1 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold truncate">
                        {tx.from}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold truncate">
                        {tx.to}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-sm font-bold font-mono ${isSettled ? 'line-through text-slate-500' : 'text-white'}`}>
                        ${tx.amount.toFixed(2)}
                      </span>

                      <button
                        onClick={() => toggleSettle(tx.id)}
                        className={`p-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                          isSettled
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-white/5 text-slate-400 hover:text-white border-white/10 hover:bg-white/10'
                        }`}
                        title={isSettled ? 'Mark as Unpaid' : 'Mark as Settled'}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span className="text-[11px] hidden sm:inline">{isSettled ? 'Paid' : 'Settle'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white text-xs font-semibold border border-white/10 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
