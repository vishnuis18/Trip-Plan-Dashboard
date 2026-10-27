const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  paidBy: { type: String, default: 'Self' },
  category: { 
    type: String, 
    required: true,
    enum: ['Flights', 'Hotels', 'Food', 'Activities', 'Transport', 'Other']
  },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  amountInTripCurrency: { type: Number, default: 0 },
  description: { type: String, default: '' },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  paymentMethod: { type: String, default: 'Credit Card' },
  receiptUrl: { type: String, default: '' },
  splitBetween: [{
    userId: { type: String },
    userName: { type: String },
    share: { type: Number, default: 1 }
  }]
}, { timestamps: true });

module.exports = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);
