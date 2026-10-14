const storage = require('../services/storage');

exports.getExpenses = async (req, res) => {
  try {
    const { tripId } = req.params;
    const expenses = await storage.getExpensesByTrip(tripId);
    const trip = await storage.getTripById(tripId);

    const totalSpent = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const totalBudget = trip ? Number(trip.totalBudget) || 3680 : 3680;
    const remaining = totalBudget - totalSpent;

    const categories = ['Flights', 'Hotels', 'Food', 'Activities', 'Transport', 'Other'];
    const categoryTotals = {};
    categories.forEach(cat => categoryTotals[cat] = 0);

    expenses.forEach(exp => {
      if (categoryTotals[exp.category] !== undefined) {
        categoryTotals[exp.category] += Number(exp.amount) || 0;
      } else {
        categoryTotals['Other'] += Number(exp.amount) || 0;
      }
    });

    const categoryBreakdown = categories.map(cat => {
      const amount = categoryTotals[cat];
      const percentage = totalSpent > 0 ? ((amount / totalSpent) * 100).toFixed(1) + '%' : '0%';
      return {
        category: cat,
        amount,
        percentage
      };
    });

    res.json({
      expenses,
      summary: {
        totalBudget,
        totalSpent,
        remaining,
        categoryBreakdown
      }
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ message: 'Error retrieving expenses' });
  }
};

exports.createExpense = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { category, amount, description, date, paymentMethod } = req.body;

    if (!category || amount === undefined || amount === null) {
      return res.status(400).json({ message: 'Category and amount are required' });
    }

    const expense = await storage.createExpense({
      tripId,
      category,
      amount: Number(amount),
      description: description || '',
      date: date || new Date().toISOString().split('T')[0],
      paymentMethod: paymentMethod || 'Credit Card'
    });

    res.status(201).json({ message: 'Expense added successfully', expense });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ message: 'Error adding expense' });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const updated = await storage.updateExpense(expenseId, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json({ message: 'Expense updated successfully', expense: updated });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ message: 'Error updating expense' });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const deleted = await storage.deleteExpense(expenseId);
    if (!deleted) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted successfully', expense: deleted });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ message: 'Error deleting expense' });
  }
};
