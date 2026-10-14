const express = require('express');
const router = express.Router();
const exploreController = require('../controllers/exploreController');

router.get('/', exploreController.getExploreCatalog);

module.exports = router;
