const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  plan: { type: String, default: 'Free Plan' },
  avatar: { type: String, default: '' },
  currency: { type: String, default: 'USD' },
  theme: { type: String, default: 'dark' }
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
