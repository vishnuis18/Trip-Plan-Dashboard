const getSeedData = () => {
  return {
    defaultUser: {
      _id: '660000000000000000000001',
      name: 'Alex Morgan',
      email: 'alex.morgan@tripplan.com',
      password: '$2a$10$oqOYGVQ9x7Xzr2rto/OPv.wLVGPYJ5Ax2Q4cSAzVf0N0S1.P8IV0.', // password123
      plan: 'Pro Plan',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      currency: 'USD',
      theme: 'dark'
    },
    defaultTrip: null,
    defaultActivities: [],
    defaultExpenses: [],
    defaultNeighborhoods: [],
    defaultSavedPlaces: [],
    defaultNotifications: []
  };
};

module.exports = { getSeedData };
