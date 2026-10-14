const express = require('express');
const router = express.Router();
const savedPlaceController = require('../controllers/savedPlaceController');

router.get('/', savedPlaceController.getSavedPlaces);
router.post('/', savedPlaceController.createSavedPlace);
router.delete('/:id', savedPlaceController.deleteSavedPlace);

module.exports = router;
