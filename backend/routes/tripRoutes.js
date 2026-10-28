const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const activityController = require('../controllers/activityController');
const expenseController = require('../controllers/expenseController');
const { optionalAuthMiddleware } = require('../middleware/authMiddleware');

router.use(optionalAuthMiddleware);

// All trips
router.get('/', tripController.getTrips);
router.get('/active', tripController.getActiveTrip);
router.get('/share/:slugOrId', tripController.getSharedTrip);
router.get('/:id', tripController.getTripById);
router.post('/', tripController.createTrip);
router.put('/:id', tripController.updateTrip);
router.put('/:id/activate', tripController.setActiveTrip);
router.delete('/:id', tripController.deleteTrip);

// Nested activities for a trip
router.get('/:tripId/activities', activityController.getActivities);
router.post('/:tripId/activities', activityController.createActivity);
router.put('/:tripId/activities/:activityId', activityController.updateActivity);
router.delete('/:tripId/activities/:activityId', activityController.deleteActivity);

// Nested expenses for a trip
router.get('/:tripId/expenses', expenseController.getExpenses);
router.post('/:tripId/expenses', expenseController.createExpense);
router.put('/:tripId/expenses/:expenseId', expenseController.updateExpense);
router.delete('/:tripId/expenses/:expenseId', expenseController.deleteExpense);

module.exports = router;
