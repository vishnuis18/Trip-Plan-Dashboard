import React from 'react';
import { Headset, ArrowRight } from 'lucide-react';

export const AssistanceCard = () => {
  return (
    <div className="rounded-3xl bg-[#121927]/90 border border-white/[0.08] p-5 shadow-xl backdrop-blur-md">
      <div className="flex items-start gap-3.5 mb-3">
        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
          <Headset className="w-4 h-4 text-slate-300" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white leading-tight">Need assistance?</h4>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
            Our team is here to help you.
          </p>
        </div>
      </div>

      <a
        href="mailto:support@tripplan.app?subject=TripPlan%20Support%20Inquiry"
        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#18233C] hover:bg-[#1F2C4C] border border-white/10 text-slate-200 hover:text-white text-xs font-semibold transition-all group"
      >
        <span>Contact support</span>
        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
      </a>
    </div>
  );
};
