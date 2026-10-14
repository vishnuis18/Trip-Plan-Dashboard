const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'Trip Notification' },
  message: { type: String, required: true },
  type: { type: String, default: 'info' }, // 'info', 'warning', 'success', 'reminder'
  read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
