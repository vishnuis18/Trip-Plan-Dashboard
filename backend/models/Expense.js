const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Flights', 'Hotels', 'Food', 'Activities', 'Transport', 'Other']
  },
  amount: { type: Number, required: true },
  description: { type: String, default: '' },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  paymentMethod: { type: String, default: 'Credit Card' }
}, { timestamps: true });

module.exports = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);
