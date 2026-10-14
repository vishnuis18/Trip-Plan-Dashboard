const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  day: { type: Number, required: true }, // e.g. 1, 2, 3...
  time: { type: String, required: true }, // e.g. "02:00 PM"
  title: { type: String, required: true }, // e.g. "Arrive NRT, Narita Express to Shinjuku"
  duration: { type: String, default: '60m' }, // e.g. "90m"
  location: { type: String, default: '' },
  category: { type: String, default: 'transit' }, // transit, accommodation, sightseeing, food, nightlife, other
  notes: { type: String, default: '' },
  color: { type: String, default: '#3B82F6' }, // blue, yellow, green, orange, red, etc.
  completed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.models.Activity || mongoose.model('Activity', activitySchema);
