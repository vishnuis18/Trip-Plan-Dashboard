const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  day: { type: Number, required: true }, // e.g. 1, 2, 3...
  time: { type: String, required: true }, // e.g. "02:00 PM"
  title: { type: String, required: true }, // e.g. "Arrive NRT, Narita Express to Shinjuku"
  duration: { type: String, default: '60m' }, // e.g. "90m"
  durationMin: { type: Number, default: 60 },
  location: { type: String, default: '' },
  placeId: { type: String, default: '' },
  category: { type: String, default: 'transit' }, // transit, accommodation, sightseeing, food, nightlife, culture, shopping, other
  notes: { type: String, default: '' },
  color: { type: String, default: '#3B82F6' },
  costEstimate: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  locked: { type: Boolean, default: false }, // if true, AI will not swap
  source: { type: String, enum: ['user', 'ai'], default: 'user' },
  votes: [{
    userId: { type: String },
    value: { type: Number, default: 1 } // 1: thumbs up, -1: thumbs down
  }],
  status: { type: String, enum: ['planned', 'done', 'skipped'], default: 'planned' },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.models.Activity || mongoose.model('Activity', activitySchema);
