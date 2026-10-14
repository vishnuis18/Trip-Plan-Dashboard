const mongoose = require('mongoose');

const savedPlaceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  placeName: { type: String, required: true },
  location: { type: String, required: true }, // e.g. "Tokyo, Japan"
  neighborhood: { type: String, default: '' },
  category: { type: String, default: 'Sightseeing' },
  tag: { type: String, default: 'Trending' },
  image: { type: String, default: '' },
  rating: { type: Number, default: 4.8 },
  reviewsCount: { type: Number, default: 1240 },
  description: { type: String, default: '' },
  notes: { type: String, default: '' },
  estimatedCost: { type: String, default: '$25' },
  mapUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.models.SavedPlace || mongoose.model('SavedPlace', savedPlaceSchema);
