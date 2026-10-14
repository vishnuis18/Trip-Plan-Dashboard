import React from 'react';
import { TripBanner } from '../components/TripBanner';
import { DayTabs } from '../components/DayTabs';
import { ItineraryCard } from '../components/ItineraryCard';
import { BudgetBreakdownCard } from '../components/BudgetBreakdownCard';
import { NeighborhoodGuide } from '../components/NeighborhoodGuide';
import { TripSummary } from '../components/TripSummary';
import { QuickActions } from '../components/QuickActions';
import { InspirationCard } from '../components/InspirationCard';
import { AssistanceCard } from '../components/AssistanceCard';

export const Dashboard = ({ setActiveTab, onSelectNeighborhood }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 p-6 max-w-[1600px] mx-auto">
      {/* Center Column: Main Dashboard Content (approx 8.5 cols) */}
      <div className="xl:col-span-8 2xl:col-span-9 flex flex-col gap-6">
        {/* Mount Fuji Hero Banner */}
        <TripBanner onTripCardClick={() => setActiveTab('trips')} />

        {/* Day Selector Tabs */}
        <DayTabs />

        {/* Arrivals & Itinerary Timeline */}
        <ItineraryCard onExploreClick={() => setActiveTab('explore')} />

        {/* Budget Breakdown */}
        <BudgetBreakdownCard onViewBudgetClick={() => setActiveTab('budget')} />

        {/* Neighborhood Guide */}
        <NeighborhoodGuide 
          onViewAllClick={() => setActiveTab('explore')}
          onSelectNeighborhood={(n) => {
            if (onSelectNeighborhood) onSelectNeighborhood(n);
            setActiveTab('explore');
          }}
        />
      </div>

      {/* Right Column: Trip Summary, Quick Actions, Inspiration (approx 3.5 cols) */}
      <div className="xl:col-span-4 2xl:col-span-3 flex flex-col gap-6">
        <TripSummary onViewDetailsClick={() => setActiveTab('trips')} />
        <QuickActions setActiveTab={setActiveTab} />
        <InspirationCard onExploreClick={() => setActiveTab('explore')} />
        <AssistanceCard />
      </div>
    </div>
  );
};
