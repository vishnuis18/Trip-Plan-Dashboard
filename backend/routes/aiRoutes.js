const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// AI Co-Planner endpoints
router.post('/generate-itinerary', aiController.generateItinerary);
router.post('/swap-activity', aiController.swapActivity);
router.post('/checklist', aiController.getAIChecklist);

module.exports = router;
