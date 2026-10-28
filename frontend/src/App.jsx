import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { TripProvider, useTrip } from './context/TripContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Trips } from './pages/Trips';
import { Explore } from './pages/Explore';
import { Budget } from './pages/Budget';
import { ItineraryPage } from './pages/ItineraryPage';
import { SavedPlaces } from './pages/SavedPlaces';
import { Settings } from './pages/Settings';
import { PlanWithAIPage } from './pages/PlanWithAIPage';
import { SharedTripView } from './pages/SharedTripView';
import { LoginPage } from './pages/LoginPage';
import { FXPage } from './pages/FXPage';

// Modals
import { AddTripModal } from './components/modals/AddTripModal';
import { AddActivityModal } from './components/modals/AddActivityModal';
import { AddExpenseModal } from './components/modals/AddExpenseModal';
import { QuickSearchModal } from './components/modals/QuickSearchModal';
import { AuthModal } from './components/modals/AuthModal';
import { DocumentsModal } from './components/modals/DocumentsModal';

const MainLayout = () => {
  const isShareUrl = window.location.pathname.startsWith('/share');
  const shareId = isShareUrl ? window.location.pathname.split('/share/')[1] : null;
  const isLoginUrl = window.location.pathname === '/login';

  const [activeTab, setActiveTab] = useState(isShareUrl ? 'share' : isLoginUrl ? 'login' : 'dashboard');
  const { activeModal } = useTrip();

  // If viewing shared link, render dedicated clean public view
  if (activeTab === 'share') {
    return (
      <SharedTripView
        slugOrId={shareId}
        onBackToApp={() => {
          window.history.pushState({}, '', '/');
          setActiveTab('dashboard');
        }}
      />
    );
  }

  // If viewing dedicated login page, render beautiful full-screen auth page
  if (activeTab === 'login') {
    return (
      <LoginPage
        onSuccess={() => {
          window.history.pushState({}, '', '/');
          setActiveTab('dashboard');
        }}
        onBack={() => {
          window.history.pushState({}, '', '/');
          setActiveTab('dashboard');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E17] text-slate-100 flex overflow-x-hidden font-sans">
      {/* Fixed Left Sidebar matching reference image */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0B0E17]">
        <Navbar setActiveTab={setActiveTab} onSearchChange={(q) => console.log('Search:', q)} />

        <main className="flex-1 pb-20 md:pb-16">
          {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
          {activeTab === 'ai' && <PlanWithAIPage setActiveTab={setActiveTab} />}
          {activeTab === 'trips' && <Trips setActiveTab={setActiveTab} />}
          {activeTab === 'explore' && <Explore />}
          {activeTab === 'budget' && <Budget />}
          {activeTab === 'fx' && <FXPage setActiveTab={setActiveTab} />}
          {activeTab === 'itinerary' && <ItineraryPage />}
          {activeTab === 'saved' && <SavedPlaces setActiveTab={setActiveTab} />}
          {activeTab === 'settings' && <Settings setActiveTab={setActiveTab} />}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (<768px) */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Global Modals */}
      {activeModal === 'addTrip' && <AddTripModal />}
      {activeModal === 'addActivity' && <AddActivityModal />}
      {activeModal === 'addExpense' && <AddExpenseModal />}
      {activeModal === 'search' && <QuickSearchModal setActiveTab={setActiveTab} />}
      {activeModal === 'auth' && <AuthModal />}
      {activeModal === 'documents' && <DocumentsModal />}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <MainLayout />
      </TripProvider>
    </AuthProvider>
  );
}
