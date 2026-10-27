import React from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Map, 
  Wallet, 
  FileText, 
  CheckSquare, 
  Users, 
  BookOpen 
} from 'lucide-react';

export const TripWorkspaceNav = ({ activeWorkspaceTab, setActiveWorkspaceTab, activeTrip }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'itinerary', label: 'Itinerary', icon: CalendarDays },
    { id: 'map', label: 'Map', icon: Map },
    { id: 'budget', label: 'Budget', icon: Wallet },
    { id: 'docs', label: 'Bookings & Docs', icon: FileText },
    { id: 'packing', label: 'Packing', icon: CheckSquare },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'journal', label: 'Journal', icon: BookOpen }
  ];

  return (
    <div className="w-full bg-[#121927]/80 backdrop-blur-md border-b border-white/[0.08] px-6 py-2 sticky top-16 z-10 overflow-x-auto scrollbar-none trip-workspace-nav">
      <div className="flex items-center gap-1.5 min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeWorkspaceTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveWorkspaceTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
