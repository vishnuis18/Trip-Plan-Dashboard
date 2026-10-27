const storage = require('../services/storage');

exports.getTrips = async (req, res) => {
  try {
    const userId = req.user?.id || '660000000000000000000001';
    const trips = await storage.getTripsByUser(userId);
    res.json({ trips });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ message: 'Error retrieving trips' });
  }
};

exports.getActiveTrip = async (req, res) => {
  try {
    const userId = req.user?.id || '660000000000000000000001';
    let trip = await storage.getActiveTrip(userId);
    if (!trip) {
      return res.json({
        trip: null,
        activities: [],
        expenses: [],
        neighborhoods: storage.getNeighborhoods ? storage.getNeighborhoods() : [],
        budgetSummary: {
          totalBudget: 0,
          totalSpent: 0,
          remainingBudget: 0,
          categoryBreakdown: []
        }
      });
    }

    // Get activities and expenses for this trip to compute live summary
    const activities = await storage.getActivitiesByTrip(trip._id);
    const expenses = await storage.getExpensesByTrip(trip._id);
    const neighborhoods = storage.getNeighborhoods();

    // Compute budget summary
    const totalSpent = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const totalBudget = Number(trip.totalBudget) || 3680;
    const remainingBudget = totalBudget - totalSpent;

    // Group expenses by category
    const categories = ['Flights', 'Hotels', 'Food', 'Activities', 'Transport', 'Other'];
    const categoryTotals = {};
    categories.forEach(cat => categoryTotals[cat] = 0);
    expenses.forEach(exp => {
      if (categoryTotals[exp.category] !== undefined) {
        categoryTotals[exp.category] += Number(exp.amount) || 0;
      } else {
        categoryTotals['Other'] += Number(exp.amount) || 0;
      }
    });

    const categoryBreakdown = categories.map(cat => {
      const amount = categoryTotals[cat];
      const percentage = totalSpent > 0 ? ((amount / totalSpent) * 100).toFixed(1) + '%' : '0%';
      return {
        category: cat,
        amount,
        percentage
      };
    });

    res.json({
      trip,
      activities,
      expenses,
      neighborhoods,
      budgetSummary: {
        totalBudget,
        totalSpent,
        remainingBudget,
        currency: 'USD',
        categoryBreakdown
      }
    });
  } catch (error) {
    console.error('Get active trip error:', error);
    res.status(500).json({ message: 'Error retrieving active trip' });
  }
};

exports.getTripById = async (req, res) => {
  try {
    const trip = await storage.getTripById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    const activities = await storage.getActivitiesByTrip(trip._id);
    const expenses = await storage.getExpensesByTrip(trip._id);
    res.json({ trip, activities, expenses });
  } catch (error) {
    console.error('Get trip by id error:', error);
    res.status(500).json({ message: 'Error retrieving trip' });
  }
};

exports.getSharedTrip = async (req, res) => {
  try {
    const { slugOrId } = req.params;
    let trip = await storage.getTripById(slugOrId);
    if (!trip) {
      trip = await storage.getActiveTrip();
    }
    if (!trip) {
      return res.status(404).json({ message: 'Shared trip not found' });
    }
    const activities = await storage.getActivitiesByTrip(trip._id);
    res.json({
      trip,
      activities,
      isReadOnly: true,
      sharedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get shared trip error:', error);
    res.status(500).json({ message: 'Error retrieving shared trip' });
  }
};

exports.createTrip = async (req, res) => {
  try {
    const userId = req.user?.id || '660000000000000000000001';
    const {
      title,
      destination,
      startDate,
      endDate,
      travelers,
      nights,
      totalBudget,
      airport,
      airportCode,
      coverImage,
      isActive
    } = req.body;

    if (!destination || !startDate || !endDate) {
      return res.status(400).json({ message: 'Destination, start date, and end date are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const calculatedNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const daysCount = calculatedNights + 1;

    // Format dates string (e.g. "Apr 2 – 6, 2025")
    const startFormatted = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endFormatted = end.toLocaleDateString('en-US', { day: 'numeric', year: 'numeric' });
    const datesFormatted = `${startFormatted} – ${endFormatted}`;

    // Auto-select smart cover image if not provided
    let smartCover = coverImage;
    if (!smartCover) {
      const destLower = destination.toLowerCase();
      if (destLower.includes('kyoto')) smartCover = '/images/arashiyama.jpg';
      else if (destLower.includes('shibuya')) smartCover = '/images/shibuya.jpg';
      else if (destLower.includes('paris')) smartCover = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=80';
      else smartCover = '/images/mount_fuji.jpg';
    }

    // Generate dynamic dayTabs
    const dynamicDayTabs = Array.from({ length: daysCount }, (_, i) => ({
      day: i + 1,
      label: `Day ${i + 1}`,
      sublabel: i === 0 ? 'Arrival' : i === daysCount - 1 ? 'Departure' : `Explore`
    }));

    const newTrip = await storage.createTrip({
      userId,
      title: title || `${destination} Trip`,
      destination,
      startDate,
      endDate,
      datesFormatted,
      travelers: Number(travelers) || 2,
      travelersText: `${Number(travelers) || 2} People`,
      nights: Number(nights) || calculatedNights,
      totalBudget: Number(totalBudget) || 3000,
      currency: req.body.currency || 'USD',
      airport: airport || 'Nearest International Airport',
      airportCode: airportCode || 'AIR',
      coverImage: smartCover,
      dayTabs: req.body.dayTabs && req.body.dayTabs.length > 0 ? req.body.dayTabs : dynamicDayTabs,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({ message: 'Trip created successfully', trip: newTrip });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ message: 'Error creating trip' });
  }
};

exports.updateTrip = async (req, res) => {
  try {
    const updated = await storage.updateTrip(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json({ message: 'Trip updated successfully', trip: updated });
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({ message: 'Error updating trip' });
  }
};

exports.setActiveTrip = async (req, res) => {
  try {
    const updated = await storage.updateTrip(req.params.id, { isActive: true });
    if (!updated) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json({ message: 'Active trip changed successfully', trip: updated });
  } catch (error) {
    console.error('Set active trip error:', error);
    res.status(500).json({ message: 'Error setting active trip' });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    const deleted = await storage.deleteTrip(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json({ message: 'Trip deleted successfully', trip: deleted });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ message: 'Error deleting trip' });
  }
};
