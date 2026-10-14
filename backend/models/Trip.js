const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  destination: { type: String, required: true }, // e.g. "Tokyo, Japan"
  country: { type: String, default: 'Japan' },
  startDate: { type: String, required: true }, // e.g. "2025-04-02"
  endDate: { type: String, required: true }, // e.g. "2025-04-06"
  datesFormatted: { type: String, default: 'Apr 2 – 6, 2025' },
  travelers: { type: Number, default: 2 },
  travelersText: { type: String, default: '2 People' },
  nights: { type: Number, default: 5 },
  totalBudget: { type: Number, default: 3680 },
  airport: { type: String, default: 'NRT (Narita International Airport)' },
  airportCode: { type: String, default: 'NRT' },
  coverImage: { type: String, default: '/images/mount_fuji.jpg' },
  status: { type: String, enum: ['upcoming', 'active', 'completed'], default: 'upcoming' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.models.Trip || mongoose.model('Trip', tripSchema);
