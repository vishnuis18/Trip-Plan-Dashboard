import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/apiClient';
import confetti from 'canvas-confetti';

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [activeTrip, setActiveTrip] = useState(null);
  const [trips, setTrips] = useState([]);
  const [activities, setActivities] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budgetSummary, setBudgetSummary] = useState(null);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [activeModal, setActiveModal] = useState(null);
  const [modalPayload, setModalPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch active trip with its summary, activities, expenses & neighborhoods
      let activeRes = null;
      try {
        activeRes = await api.getActiveTrip();
      } catch (e) {
        // No active trip found is expected when starting fresh
      }

      if (activeRes?.trip) {
        setActiveTrip(activeRes.trip);
        setActivities(activeRes.activities || []);
        setExpenses(activeRes.expenses || []);
        setBudgetSummary(activeRes.budgetSummary);
        setNeighborhoods(activeRes.neighborhoods || []);
      } else {
        setActiveTrip(null);
        setActivities([]);
        setExpenses([]);
        setBudgetSummary(null);
        setNeighborhoods(activeRes?.neighborhoods || []);
      }

      // Fetch all trips for sidebar badge count & trip switching
      const tripsRes = await api.getTrips();
      if (tripsRes?.trips) {
        setTrips(tripsRes.trips);
      }

      // Fetch saved places
      const savedRes = await api.getSavedPlaces();
      if (savedRes?.places) {
        setSavedPlaces(savedRes.places);
      }

      // Fetch notifications
      const notifRes = await api.getNotifications();
      if (notifRes?.notifications) {
        setNotifications(notifRes.notifications);
      }
    } catch (err) {
      console.error('Error loading trip data from backend:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Switch Active Trip
  const switchTrip = async (tripId) => {
    try {
      await api.setActiveTrip(tripId);
      await loadData();
    } catch (err) {
      console.error('Error switching trip:', err);
    }
  };

  // Create Trip
  const createTrip = async (tripData) => {
    try {
      const res = await api.createTrip(tripData);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      await loadData();
      return { success: true, trip: res.trip };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Delete Trip
  const deleteTrip = async (tripId) => {
    try {
      await api.deleteTrip(tripId);
      await loadData();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Add Activity
  const addActivity = async (activityData) => {
    if (!activeTrip?._id) return;
    try {
      const res = await api.createActivity(activeTrip._id, {
        ...activityData,
        day: activityData.day || selectedDay
      });
      setActivities((prev) => [...prev, res.activity]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Edit Activity
  const editActivity = async (activityId, updateData) => {
    if (!activeTrip?._id) return;
    try {
      const res = await api.updateActivity(activeTrip._id, activityId, updateData);
      setActivities((prev) =>
        prev.map((act) => (String(act._id) === String(activityId) ? res.activity : act))
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Delete Activity
  const deleteActivity = async (activityId) => {
    if (!activeTrip?._id) return;
    try {
      await api.deleteActivity(activeTrip._id, activityId);
      setActivities((prev) => prev.filter((act) => String(act._id) !== String(activityId)));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Add Expense
  const addExpense = async (expenseData) => {
    if (!activeTrip?._id) return;
    try {
      await api.createExpense(activeTrip._id, expenseData);
      // Reload active trip to recompute live totals and percentages
      const activeRes = await api.getActiveTrip();
      if (activeRes?.trip) {
        setExpenses(activeRes.expenses || []);
        setBudgetSummary(activeRes.budgetSummary);
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Delete Expense
  const deleteExpense = async (expenseId) => {
    if (!activeTrip?._id) return;
    try {
      await api.deleteExpense(activeTrip._id, expenseId);
      const activeRes = await api.getActiveTrip();
      if (activeRes?.trip) {
        setExpenses(activeRes.expenses || []);
        setBudgetSummary(activeRes.budgetSummary);
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Toggle Save Place
  const toggleSavePlace = async (place) => {
    const isSaved = savedPlaces.some(
      (p) => p.placeName.toLowerCase() === (place.name || place.placeName).toLowerCase()
    );

    try {
      if (isSaved) {
        const existing = savedPlaces.find(
          (p) => p.placeName.toLowerCase() === (place.name || place.placeName).toLowerCase()
        );
        if (existing?._id) {
          await api.deleteSavedPlace(existing._id);
          setSavedPlaces((prev) => prev.filter((p) => p._id !== existing._id));
        }
      } else {
        const newPlaceData = {
          placeName: place.name || place.placeName,
          location: place.city ? `${place.city}, ${place.country}` : place.location || '',
          neighborhood: place.neighborhood || '',
          category: place.category || 'Sightseeing',
          tag: place.tag || 'Saved',
          image: place.image || '',
          rating: place.rating || 4.8,
          description: place.description || '',
          estimatedCost: place.price || place.estimatedCost || '$25'
        };
        const res = await api.createSavedPlace(newPlaceData);
        setSavedPlaces((prev) => [res.place, ...prev]);
        confetti({
          particleCount: 40,
          spread: 45,
          origin: { y: 0.7 }
        });
      }
    } catch (err) {
      console.error('Error toggling save place:', err);
    }
  };

  // Filter activities by current day
  const currentDayActivities = activities.filter((act) => Number(act.day) === Number(selectedDay));

  const openModal = (modalName, payload = null) => {
    setActiveModal(modalName);
    setModalPayload(payload);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalPayload(null);
  };

  return (
    <TripContext.Provider
      value={{
        activeTrip,
        trips,
        activities,
        currentDayActivities,
        expenses,
        budgetSummary,
        neighborhoods,
        savedPlaces,
        notifications,
        selectedDay,
        setSelectedDay,
        activeModal,
        modalPayload,
        openModal,
        closeModal,
        loading,
        searchQuery,
        setSearchQuery,
        switchTrip,
        createTrip,
        deleteTrip,
        addActivity,
        editActivity,
        deleteActivity,
        addExpense,
        deleteExpense,
        toggleSavePlace,
        refreshData: loadData
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => useContext(TripContext);
