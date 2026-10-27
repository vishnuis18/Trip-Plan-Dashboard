const API_BASE = '/api';

export const getAuthToken = () => {
  return localStorage.getItem('tripplan_token');
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('tripplan_token', token);
  } else {
    localStorage.removeItem('tripplan_token');
  }
};

const request = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
};

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request('/auth/me'),
  updateProfile: (profileData) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),

  // Trips
  getTrips: () => request('/trips'),
  getActiveTrip: () => request('/trips/active'),
  getTripById: (id) => request(`/trips/${id}`),
  getSharedTrip: (slugOrId) => request(`/trips/share/${slugOrId}`),
  createTrip: (tripData) => request('/trips', { method: 'POST', body: JSON.stringify(tripData) }),
  updateTrip: (id, tripData) => request(`/trips/${id}`, { method: 'PUT', body: JSON.stringify(tripData) }),
  setActiveTrip: (id) => request(`/trips/${id}/activate`, { method: 'PUT' }),
  deleteTrip: (id) => request(`/trips/${id}`, { method: 'DELETE' }),

  // Activities
  getActivities: (tripId, day) => request(`/trips/${tripId}/activities${day ? `?day=${day}` : ''}`),
  createActivity: (tripId, activityData) => request(`/trips/${tripId}/activities`, { method: 'POST', body: JSON.stringify(activityData) }),
  updateActivity: (tripId, activityId, activityData) => request(`/trips/${tripId}/activities/${activityId}`, { method: 'PUT', body: JSON.stringify(activityData) }),
  deleteActivity: (tripId, activityId) => request(`/trips/${tripId}/activities/${activityId}`, { method: 'DELETE' }),

  // Expenses
  getExpenses: (tripId) => request(`/trips/${tripId}/expenses`),
  createExpense: (tripId, expenseData) => request(`/trips/${tripId}/expenses`, { method: 'POST', body: JSON.stringify(expenseData) }),
  updateExpense: (tripId, expenseId, expenseData) => request(`/trips/${tripId}/expenses/${expenseId}`, { method: 'PUT', body: JSON.stringify(expenseData) }),
  deleteExpense: (tripId, expenseId) => request(`/trips/${tripId}/expenses/${expenseId}`, { method: 'DELETE' }),

  // Saved Places
  getSavedPlaces: () => request('/saved-places'),
  createSavedPlace: (placeData) => request('/saved-places', { method: 'POST', body: JSON.stringify(placeData) }),
  deleteSavedPlace: (id) => request(`/saved-places/${id}`, { method: 'DELETE' }),

  // Explore
  getExploreCatalog: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/explore${query ? `?${query}` : ''}`);
  },

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),

  // AI Co-Planner
  generateItineraryAI: (params) => request('/ai/generate-itinerary', { method: 'POST', body: JSON.stringify(params) }),
  swapActivityAI: (params) => request('/ai/swap-activity', { method: 'POST', body: JSON.stringify(params) }),
  getAIChecklist: (params) => request('/ai/checklist', { method: 'POST', body: JSON.stringify(params) }),
};
