const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  plan: { type: String, enum: ['Free Plan', 'Pro Plan', 'free', 'pro'], default: 'Free Plan' },
  avatar: { type: String, default: '' },
  currency: { type: String, default: 'USD' },
  homeCurrency: { type: String, default: 'USD' },
  homeAirport: { type: String, default: '' },
  theme: { type: String, default: 'dark' },
  preferences: {
    pace: { type: String, enum: ['relaxed', 'balanced', 'packed'], default: 'balanced' },
    budgetLevel: { type: String, enum: ['budget', 'mid', 'luxury'], default: 'mid' },
    interests: [{ type: String }]
  },
  aiUsage: {
    month: { type: String, default: () => new Date().toISOString().slice(0, 7) },
    callsCount: { type: Number, default: 0 },
    costUsd: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
