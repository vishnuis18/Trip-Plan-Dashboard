const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { getSeedData } = require('../data/seedData');

// Mongoose Models
const User = require('../models/User');
const Trip = require('../models/Trip');
const Activity = require('../models/Activity');
const Expense = require('../models/Expense');
const SavedPlace = require('../models/SavedPlace');
const Notification = require('../models/Notification');

const DATA_FILE = path.join(__dirname, '..', 'data', 'db_store.json');

class StorageService {
  constructor() {
    this.isMongoConnected = false;
    this.memoryData = null;
  }

  async init() {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tripplan';
    try {
      // Attempt connection with short timeout so it doesn't hang if no local mongod
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 2000,
        connectTimeoutMS: 2000
      });
      this.isMongoConnected = true;
      console.log('✅ Connected to MongoDB successfully.');
      await this.seedMongoIfNeeded();
    } catch (err) {
      this.isMongoConnected = false;
      console.log('ℹ️ Local MongoDB daemon not detected, using intelligent persistent JSON/Memory Store.');
      this.initFileStore();
    }
  }

  ensureLoaded() {
    if (!this.isMongoConnected && fs.existsSync(DATA_FILE)) {
      try {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.memoryData = JSON.parse(raw);
      } catch (e) {
        console.error('Error reloading db_store.json:', e);
      }
    }
  }

  initFileStore() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.memoryData = JSON.parse(raw);
      } else {
        const seed = getSeedData();
        this.memoryData = {
          users: seed.defaultUser ? [seed.defaultUser] : [],
          trips: seed.defaultTrip ? [seed.defaultTrip] : [],
          activities: seed.defaultActivities || [],
          expenses: seed.defaultExpenses || [],
          savedPlaces: seed.defaultSavedPlaces || [],
          notifications: seed.defaultNotifications || [],
          neighborhoods: seed.defaultNeighborhoods || []
        };
        this.saveFileStore();
      }
    } catch (e) {
      console.error('Error initializing file store, creating fresh seed:', e);
      const seed = getSeedData();
      this.memoryData = {
        users: seed.defaultUser ? [seed.defaultUser] : [],
        trips: seed.defaultTrip ? [seed.defaultTrip] : [],
        activities: seed.defaultActivities || [],
        expenses: seed.defaultExpenses || [],
        savedPlaces: seed.defaultSavedPlaces || [],
        notifications: seed.defaultNotifications || [],
        neighborhoods: seed.defaultNeighborhoods || []
      };
      this.saveFileStore();
    }
  }

  saveFileStore() {
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.memoryData, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error persisting to db_store.json:', err);
    }
  }

  async seedMongoIfNeeded() {
    try {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('🌱 Seeding MongoDB with Tokyo sample data...');
        const seed = getSeedData();
        await User.create(seed.defaultUser);
        await Trip.create(seed.defaultTrip);
        await Activity.insertMany(seed.defaultActivities);
        await Expense.insertMany(seed.defaultExpenses);
        await SavedPlace.insertMany(seed.defaultSavedPlaces);
        await Notification.insertMany(seed.defaultNotifications);
        console.log('✅ Seed completed successfully in MongoDB.');
      }
    } catch (e) {
      console.error('Seed MongoDB error:', e);
    }
  }

  // --- Users ---
  async findUserByEmail(email) {
    if (this.isMongoConnected) {
      return await User.findOne({ email: email.toLowerCase() });
    }
    this.ensureLoaded();
    return this.memoryData.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  async findUserById(id) {
    if (this.isMongoConnected) {
      return await User.findById(id).select('-password');
    }
    this.ensureLoaded();
    const u = this.memoryData.users.find(u => String(u._id) === String(id));
    if (!u) return null;
    const { password, ...rest } = u;
    return rest;
  }

  async createUser(userData) {
    if (this.isMongoConnected) {
      return await User.create(userData);
    }
    this.ensureLoaded();
    const newUser = {
      _id: 'user_' + Date.now(),
      plan: 'Free Plan',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      currency: 'USD',
      theme: 'dark',
      ...userData,
      createdAt: new Date().toISOString()
    };
    this.memoryData.users.push(newUser);
    this.saveFileStore();
    return newUser;
  }

  async updateUser(id, updateData) {
    if (this.isMongoConnected) {
      return await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    }
    this.ensureLoaded();
    const idx = this.memoryData.users.findIndex(u => String(u._id) === String(id));
    if (idx !== -1) {
      this.memoryData.users[idx] = { ...this.memoryData.users[idx], ...updateData };
      this.saveFileStore();
      const { password, ...rest } = this.memoryData.users[idx];
      return rest;
    }
    return null;
  }

  // --- Trips ---
  async getTripsByUser(userId) {
    if (this.isMongoConnected) {
      const query = userId 
        ? { $or: [{ userId }, { userId: '660000000000000000000001' }] } 
        : {};
      return await Trip.find(query).sort({ createdAt: -1 });
    }
    this.ensureLoaded();
    return this.memoryData.trips.filter(t => !userId || String(t.userId) === String(userId) || t.userId === '660000000000000000000001' || t.userId === 'all');
  }

  async getTripById(tripId) {
    if (this.isMongoConnected) {
      return await Trip.findById(tripId);
    }
    this.ensureLoaded();
    return this.memoryData.trips.find(t => String(t._id) === String(tripId));
  }

  async getActiveTrip(userId) {
    if (this.isMongoConnected) {
      const query = userId 
        ? { $or: [{ userId }, { userId: '660000000000000000000001' }] } 
        : {};
      let trip = await Trip.findOne({ ...query, isActive: true });
      if (!trip) {
        trip = await Trip.findOne(query).sort({ createdAt: -1 });
      }
      return trip;
    }
    this.ensureLoaded();
    let trip = this.memoryData.trips.find(t => (!userId || String(t.userId) === String(userId) || t.userId === '660000000000000000000001' || t.userId === 'all') && t.isActive);
    if (!trip && this.memoryData.trips.length > 0) {
      trip = this.memoryData.trips[0];
    }
    return trip;
  }

  async createTrip(tripData) {
    if (this.isMongoConnected) {
      if (tripData.isActive) {
        await Trip.updateMany({ userId: tripData.userId }, { isActive: false });
      }
      return await Trip.create(tripData);
    }
    if (tripData.isActive) {
      this.memoryData.trips.forEach(t => {
        if (String(t.userId) === String(tripData.userId)) t.isActive = false;
      });
    }
    const newTrip = {
      _id: 'trip_' + Date.now(),
      datesFormatted: tripData.datesFormatted || `${tripData.startDate} - ${tripData.endDate}`,
      travelersText: `${tripData.travelers || 2} People`,
      nights: tripData.nights || 5,
      totalBudget: Number(tripData.totalBudget) || 3000,
      coverImage: tripData.coverImage || '/images/mount_fuji.jpg',
      status: 'upcoming',
      isActive: true,
      dayTabs: [
        { day: 1, label: 'Day 1', sublabel: 'Arrival' },
        { day: 2, label: 'Day 2', sublabel: 'Explore' },
        { day: 3, label: 'Day 3', sublabel: 'Highlights' }
      ],
      ...tripData,
      createdAt: new Date().toISOString()
    };
    this.memoryData.trips.push(newTrip);
    this.saveFileStore();
    return newTrip;
  }

  async updateTrip(tripId, updateData) {
    if (this.isMongoConnected) {
      if (updateData.isActive) {
        const trip = await Trip.findById(tripId);
        if (trip) {
          await Trip.updateMany({ userId: trip.userId }, { isActive: false });
        }
      }
      return await Trip.findByIdAndUpdate(tripId, updateData, { new: true });
    }
    const idx = this.memoryData.trips.findIndex(t => String(t._id) === String(tripId));
    if (idx !== -1) {
      if (updateData.isActive) {
        this.memoryData.trips.forEach(t => {
          if (String(t.userId) === String(this.memoryData.trips[idx].userId)) t.isActive = false;
        });
      }
      this.memoryData.trips[idx] = { ...this.memoryData.trips[idx], ...updateData };
      this.saveFileStore();
      return this.memoryData.trips[idx];
    }
    return null;
  }

  async deleteTrip(tripId) {
    if (this.isMongoConnected) {
      await Activity.deleteMany({ tripId });
      await Expense.deleteMany({ tripId });
      return await Trip.findByIdAndDelete(tripId);
    }
    const idx = this.memoryData.trips.findIndex(t => String(t._id) === String(tripId));
    if (idx !== -1) {
      const deleted = this.memoryData.trips.splice(idx, 1)[0];
      this.memoryData.activities = this.memoryData.activities.filter(a => String(a.tripId) !== String(tripId));
      this.memoryData.expenses = this.memoryData.expenses.filter(e => String(e.tripId) !== String(tripId));
      this.saveFileStore();
      return deleted;
    }
    return null;
  }

  // --- Activities ---
  async getActivitiesByTrip(tripId, day) {
    if (this.isMongoConnected) {
      const query = { tripId };
      if (day !== undefined && day !== null) query.day = Number(day);
      return await Activity.find(query).sort({ time: 1 });
    }
    this.ensureLoaded();
    let list = this.memoryData.activities.filter(a => String(a.tripId) === String(tripId));
    if (day !== undefined && day !== null) {
      list = list.filter(a => Number(a.day) === Number(day));
    }
    return list;
  }

  async createActivity(activityData) {
    if (this.isMongoConnected) {
      return await Activity.create(activityData);
    }
    const newAct = {
      _id: 'act_' + Date.now() + Math.random().toString(36).substring(2, 6),
      color: activityData.color || '#3B82F6',
      duration: activityData.duration || '60m',
      ...activityData,
      completed: false,
      createdAt: new Date().toISOString()
    };
    this.memoryData.activities.push(newAct);
    this.saveFileStore();
    return newAct;
  }

  async updateActivity(activityId, updateData) {
    if (this.isMongoConnected) {
      return await Activity.findByIdAndUpdate(activityId, updateData, { new: true });
    }
    const idx = this.memoryData.activities.findIndex(a => String(a._id) === String(activityId));
    if (idx !== -1) {
      this.memoryData.activities[idx] = { ...this.memoryData.activities[idx], ...updateData };
      this.saveFileStore();
      return this.memoryData.activities[idx];
    }
    return null;
  }

  async deleteActivity(activityId) {
    if (this.isMongoConnected) {
      return await Activity.findByIdAndDelete(activityId);
    }
    const idx = this.memoryData.activities.findIndex(a => String(a._id) === String(activityId));
    if (idx !== -1) {
      const deleted = this.memoryData.activities.splice(idx, 1)[0];
      this.saveFileStore();
      return deleted;
    }
    return null;
  }

  // --- Expenses ---
  async getExpensesByTrip(tripId) {
    if (this.isMongoConnected) {
      return await Expense.find({ tripId }).sort({ createdAt: -1 });
    }
    this.ensureLoaded();
    return this.memoryData.expenses.filter(e => String(e.tripId) === String(tripId));
  }

  async createExpense(expenseData) {
    if (this.isMongoConnected) {
      return await Expense.create(expenseData);
    }
    this.ensureLoaded();
    const newExp = {
      _id: 'exp_' + Date.now(),
      amount: Number(expenseData.amount) || 0,
      paymentMethod: expenseData.paymentMethod || 'Credit Card',
      date: expenseData.date || new Date().toISOString().split('T')[0],
      ...expenseData,
      createdAt: new Date().toISOString()
    };
    this.memoryData.expenses.push(newExp);
    this.saveFileStore();
    return newExp;
  }

  async updateExpense(expenseId, updateData) {
    if (this.isMongoConnected) {
      return await Expense.findByIdAndUpdate(expenseId, updateData, { new: true });
    }
    this.ensureLoaded();
    const idx = this.memoryData.expenses.findIndex(e => String(e._id) === String(expenseId));
    if (idx !== -1) {
      this.memoryData.expenses[idx] = { ...this.memoryData.expenses[idx], ...updateData };
      this.saveFileStore();
      return this.memoryData.expenses[idx];
    }
    return null;
  }

  async deleteExpense(expenseId) {
    if (this.isMongoConnected) {
      return await Expense.findByIdAndDelete(expenseId);
    }
    this.ensureLoaded();
    const idx = this.memoryData.expenses.findIndex(e => String(e._id) === String(expenseId));
    if (idx !== -1) {
      const deleted = this.memoryData.expenses.splice(idx, 1)[0];
      this.saveFileStore();
      return deleted;
    }
    return null;
  }

  // --- Saved Places ---
  async getSavedPlaces(userId) {
    if (this.isMongoConnected) {
      return await SavedPlace.find({ userId }).sort({ createdAt: -1 });
    }
    this.ensureLoaded();
    return this.memoryData.savedPlaces.filter(p => !userId || String(p.userId) === String(userId) || p.userId === 'all');
  }

  async createSavedPlace(placeData) {
    if (this.isMongoConnected) {
      return await SavedPlace.create(placeData);
    }
    this.ensureLoaded();
    const newPlace = {
      _id: 'saved_' + Date.now(),
      rating: placeData.rating || 4.8,
      reviewsCount: placeData.reviewsCount || 1000,
      ...placeData,
      createdAt: new Date().toISOString()
    };
    this.memoryData.savedPlaces.push(newPlace);
    this.saveFileStore();
    return newPlace;
  }

  async deleteSavedPlace(placeId) {
    if (this.isMongoConnected) {
      return await SavedPlace.findByIdAndDelete(placeId);
    }
    this.ensureLoaded();
    const idx = this.memoryData.savedPlaces.findIndex(p => String(p._id) === String(placeId));
    if (idx !== -1) {
      const deleted = this.memoryData.savedPlaces.splice(idx, 1)[0];
      this.saveFileStore();
      return deleted;
    }
    return null;
  }

  // --- Neighborhoods / Explore ---
  getNeighborhoods() {
    this.ensureLoaded();
    return this.memoryData?.neighborhoods || [];
  }

  // --- Notifications ---
  async getNotifications(userId) {
    if (this.isMongoConnected) {
      return await Notification.find({ userId }).sort({ createdAt: -1 });
    }
    this.ensureLoaded();
    return this.memoryData.notifications.filter(n => !userId || String(n.userId) === String(userId));
  }

  async markNotificationRead(id) {
    if (this.isMongoConnected) {
      return await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    }
    const notif = this.memoryData.notifications.find(n => String(n._id) === String(id));
    if (notif) {
      notif.read = true;
      this.saveFileStore();
    }
    return notif;
  }
}

const storage = new StorageService();
module.exports = storage;
