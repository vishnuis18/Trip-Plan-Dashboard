const storage = require('../services/storage');

exports.getActivities = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { day } = req.query;
    const activities = await storage.getActivitiesByTrip(tripId, day);
    res.json({ activities });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ message: 'Error retrieving activities' });
  }
};

exports.createActivity = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { day, time, title, duration, location, category, notes, color } = req.body;

    if (!day || !time || !title) {
      return res.status(400).json({ message: 'Day, time, and title are required' });
    }

    // Color palette based on category if not provided
    const categoryColors = {
      transit: '#3B82F6', // Blue
      accommodation: '#0284C7', // Sky Blue
      sightseeing: '#22C55E', // Green
      food: '#F97316', // Orange
      nightlife: '#EF4444', // Red
      culture: '#EAB308', // Amber
      shopping: '#A855F7' // Purple
    };

    const finalColor = color || categoryColors[category] || '#3B82F6';

    const activity = await storage.createActivity({
      tripId,
      day: Number(day),
      time,
      title,
      duration: duration || '60m',
      location: location || '',
      category: category || 'sightseeing',
      notes: notes || '',
      color: finalColor
    });

    res.status(201).json({ message: 'Activity added successfully', activity });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({ message: 'Error adding activity' });
  }
};

exports.updateActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const updated = await storage.updateActivity(activityId, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json({ message: 'Activity updated successfully', activity: updated });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({ message: 'Error updating activity' });
  }
};

exports.deleteActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const deleted = await storage.deleteActivity(activityId);
    if (!deleted) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json({ message: 'Activity deleted successfully', activity: deleted });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({ message: 'Error deleting activity' });
  }
};
