import React from 'react';
import { Home, Sparkles, Plane, Wallet, Compass } from 'lucide-react';

export const MobileBottomNav = ({ activeTab, setActiveTab }) => {
  const items = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'ai', label: 'Plan with AI', icon: Sparkles, isAi: true },
    { id: 'trips', label: 'Trips', icon: Plane },
    { id: 'budget', label: 'Budget', icon: Wallet },
    { id: 'explore', label: 'Explore', icon: Compass }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0E17]/95 backdrop-blur-xl border-t border-white/10 px-3 py-2 flex items-center justify-around safe-area-pb shadow-2xl">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all relative ${
              isActive
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-200 active:scale-95'
            }`}
          >
            {item.isAi ? (
              <div className={`p-1.5 rounded-xl ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md shadow-purple-500/30' 
                  : 'bg-white/5 text-purple-400'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
            ) : (
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-blue-400 absolute -bottom-1 left-1/2 -translate-x-1/2 shadow-sm shadow-blue-400" />
                )}
              </div>
            )}
            <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-white font-bold' : 'text-slate-400'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
