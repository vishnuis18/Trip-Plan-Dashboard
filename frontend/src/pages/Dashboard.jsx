import React, { useState } from 'react';
import { TripWorkspaceNav } from '../components/TripWorkspaceNav';
import { TripBanner } from '../components/TripBanner';
import { WeatherWidget } from '../components/WeatherWidget';
import { CurrencyConverterWidget } from '../components/CurrencyConverterWidget';
import { DayTabs } from '../components/DayTabs';
import { ItineraryCard } from '../components/ItineraryCard';
import { BudgetBreakdownCard } from '../components/BudgetBreakdownCard';
import { NeighborhoodGuide } from '../components/NeighborhoodGuide';
import { TripSummary } from '../components/TripSummary';
import { QuickActions } from '../components/QuickActions';
import { InspirationCard } from '../components/InspirationCard';
import { AssistanceCard } from '../components/AssistanceCard';

// Workspace Tabs
import { ItineraryPage } from './ItineraryPage';
import { Budget } from './Budget';
import { TripMapTab } from './trip-tabs/TripMapTab';
import { TripDocsTab } from './trip-tabs/TripDocsTab';
import { TripPackingTab } from './trip-tabs/TripPackingTab';
import { TripMembersTab } from './trip-tabs/TripMembersTab';
import { TripJournalTab } from './trip-tabs/TripJournalTab';
import { useTrip } from '../context/TripContext';

export const Dashboard = ({ setActiveTab, onSelectNeighborhood }) => {
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState('overview');
  const { activeTrip } = useTrip();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Inside-a-Trip Workspace Navigation Bar */}
      <TripWorkspaceNav 
        activeWorkspaceTab={activeWorkspaceTab} 
        setActiveWorkspaceTab={setActiveWorkspaceTab}
        activeTrip={activeTrip}
      />

      {/* Tab 1: Overview (Original 100% Pixel-Perfect Reference Dashboard with Live Integrations) */}
      {activeWorkspaceTab === 'overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 p-6 max-w-[1600px] mx-auto w-full">
          {/* Center Column: Main Dashboard Content (approx 8.5 cols) */}
          <div className="xl:col-span-8 2xl:col-span-9 flex flex-col gap-6">
            {/* Mount Fuji Hero Banner with Departure Countdown */}
            <TripBanner onTripCardClick={() => setActiveTab('trips')} />

            {/* Live Destination Weather Forecast Strip (Open-Meteo) */}
            <WeatherWidget />

            {/* Day Selector Tabs */}
            <DayTabs />

            {/* Arrivals & Itinerary Timeline */}
            <ItineraryCard onExploreClick={() => setActiveTab('explore')} />

            {/* Budget Breakdown */}
            <BudgetBreakdownCard onViewBudgetClick={() => setActiveWorkspaceTab('budget')} />

            {/* Neighborhood Guide */}
            <NeighborhoodGuide 
              onViewAllClick={() => setActiveTab('explore')}
              onSelectNeighborhood={(n) => {
                if (onSelectNeighborhood) onSelectNeighborhood(n);
                setActiveTab('explore');
              }}
            />
          </div>

          {/* Right Column: Trip Summary, Live FX Converter, Quick Actions, Inspiration */}
          <div className="xl:col-span-4 2xl:col-span-3 flex flex-col gap-6">
            <TripSummary onViewDetailsClick={() => setActiveTab('trips')} />
            
            {/* Live FX Exchange Rate Converter (Frankfurter ECB) - High Z-Index for Dropdown Stacking */}
            <div className="relative z-30">
              <CurrencyConverterWidget />
            </div>

            <div className="relative z-10">
              <QuickActions 
                setActiveTab={(tab) => {
                  if (['itinerary', 'budget'].includes(tab)) {
                    setActiveWorkspaceTab(tab);
                  } else {
                    setActiveTab(tab);
                  }
                }} 
              />
            </div>
            <InspirationCard onExploreClick={() => setActiveTab('explore')} />
            <AssistanceCard />
          </div>
        </div>
      )}

      {/* Tab 2: Full Itinerary */}
      {activeWorkspaceTab === 'itinerary' && (
        <div className="w-full">
          <ItineraryPage />
        </div>
      )}

      {/* Tab 3: Interactive Map */}
      {activeWorkspaceTab === 'map' && (
        <div className="w-full">
          <TripMapTab />
        </div>
      )}

      {/* Tab 4: Budget Ledger */}
      {activeWorkspaceTab === 'budget' && (
        <div className="w-full">
          <Budget />
        </div>
      )}

      {/* Tab 5: Bookings & Docs Vault */}
      {activeWorkspaceTab === 'docs' && (
        <div className="w-full">
          <TripDocsTab />
        </div>
      )}

      {/* Tab 6: Packing Checklist */}
      {activeWorkspaceTab === 'packing' && (
        <div className="w-full">
          <TripPackingTab />
        </div>
      )}

      {/* Tab 7: Members & Collaboration */}
      {activeWorkspaceTab === 'members' && (
        <div className="w-full">
          <TripMembersTab />
        </div>
      )}

      {/* Tab 8: Post-Trip / Daily Journal (Commented out) */}
      {/* {activeWorkspaceTab === 'journal' && (
        <div className="w-full">
          <TripJournalTab />
        </div>
      )} */}
    </div>
  );
};
