const express = require('express');
const router = express.Router();
const ideaController = require('../controllers/ideaController');

// Get all ideas
router.get('/', ideaController.getAllIdeas);

// Create a new idea
router.post('/', ideaController.createIdea);

// Get an idea by ID
router.get('/:id', ideaController.getIdeaById);

// Update an idea by ID
router.put('/:id', ideaController.updateIdea);

// Delete an idea by ID
router.delete('/:id', ideaController.deleteIdea);

// Search for ideas With similar Title or exact
router.get('/search/:title', ideaController.searchName);

module.exports = router;