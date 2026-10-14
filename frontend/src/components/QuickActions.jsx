import React from 'react';
import { 
  FileSpreadsheet, 
  Edit3, 
  Wallet, 
  FileText, 
  Calendar, 
  ChevronRight 
} from 'lucide-react';
import { useTrip } from '../context/TripContext';

export const QuickActions = ({ setActiveTab }) => {
  const { openModal, activeTrip, activities } = useTrip();

  const handleAddToCalendar = () => {
    if (!activeTrip) {
      openModal('addTrip');
      return;
    }
    // Generate .ics file for calendar import
    const tripName = activeTrip.destination || 'My Trip';
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//TripPlan//Travel Dashboard//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `SUMMARY:Trip to ${tripName}`,
      `DESCRIPTION:TripPlan adventure to ${tripName}. Total budget: $${activeTrip.totalBudget || 0}`,
      `LOCATION:${tripName}`,
      `DTSTART;VALUE=DATE:${(activeTrip.startDate || new Date().toISOString().split('T')[0]).replace(/-/g, '')}`,
      `DTEND;VALUE=DATE:${(activeTrip.endDate || new Date().toISOString().split('T')[0]).replace(/-/g, '')}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${tripName.replace(/[^a-zA-Z0-9]/g, '_')}_trip.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const actions = [
    {
      id: 'edit_itinerary',
      label: 'Edit Itinerary',
      icon: Edit3,
      onClick: () => setActiveTab ? setActiveTab('itinerary') : openModal('addActivity')
    },
    {
      id: 'manage_budget',
      label: 'Manage Budget',
      icon: Wallet,
      onClick: () => setActiveTab ? setActiveTab('budget') : openModal('addExpense')
    },
    {
      id: 'view_documents',
      label: 'View Documents',
      icon: FileText,
      onClick: () => openModal('documents')
    },
    {
      id: 'add_calendar',
      label: 'Add to Calendar',
      icon: Calendar,
      onClick: handleAddToCalendar
    }
  ];

  return (
    <div className="rounded-3xl bg-[#121927]/90 border border-white/[0.08] p-5 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-3 mb-2 border-b border-white/[0.06]">
        <FileSpreadsheet className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-bold text-white tracking-wide">Quick Actions</h3>
      </div>

      {/* Action Links */}
      <div className="flex flex-col gap-1">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={act.onClick}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.04] text-slate-300 hover:text-white transition-all group text-left"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                <span className="text-xs font-semibold">{act.label}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
