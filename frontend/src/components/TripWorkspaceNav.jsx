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
    // { id: 'journal', label: 'Journal', icon: BookOpen }
  ];

  return (
    <div className="w-full bg-[#121927]/90 backdrop-blur-md border-b border-white/[0.08] px-6 py-2.5 sticky top-16 z-10 overflow-x-auto scrollbar-none trip-workspace-nav">
      <div className="flex items-center gap-2 min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeWorkspaceTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveWorkspaceTab(tab.id)}
              className={`workspace-tab-btn flex items-center gap-2 px-4 py-2 rounded-xl text-xs transition-all cursor-pointer select-none outline-none focus:outline-none ${
                isActive
                  ? 'workspace-tab-active bg-blue-600 text-white font-bold shadow-md shadow-blue-500/25 border border-blue-500'
                  : 'workspace-tab-inactive text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent font-medium'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
