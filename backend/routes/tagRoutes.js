const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');

// Get all ideas
router.get('/all', tagController.getAllIdeas);


module.exports = router;