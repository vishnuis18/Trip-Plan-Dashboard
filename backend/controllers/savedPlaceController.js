const storage = require('../services/storage');

exports.getSavedPlaces = async (req, res) => {
  try {
    const userId = req.user?.id;
    const places = await storage.getSavedPlaces(userId);
    res.json({ places });
  } catch (error) {
    console.error('Get saved places error:', error);
    res.status(500).json({ message: 'Error retrieving saved places' });
  }
};

exports.createSavedPlace = async (req, res) => {
  try {
    const userId = req.user?.id || '660000000000000000000001';
    const { placeName, location, neighborhood, category, tag, image, rating, description, notes, estimatedCost } = req.body;

    if (!placeName || !location) {
      return res.status(400).json({ message: 'Place name and location are required' });
    }

    const place = await storage.createSavedPlace({
      userId,
      placeName,
      location,
      neighborhood: neighborhood || '',
      category: category || 'Sightseeing',
      tag: tag || 'Saved',
      image: image || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
      rating: Number(rating) || 4.8,
      description: description || '',
      notes: notes || '',
      estimatedCost: estimatedCost || '$20'
    });

    res.status(201).json({ message: 'Place saved to bookmarks', place });
  } catch (error) {
    console.error('Create saved place error:', error);
    res.status(500).json({ message: 'Error saving place' });
  }
};

exports.deleteSavedPlace = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await storage.deleteSavedPlace(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Saved place not found' });
    }
    res.json({ message: 'Place removed from saved', place: deleted });
  } catch (error) {
    console.error('Delete saved place error:', error);
    res.status(500).json({ message: 'Error removing saved place' });
  }
};
