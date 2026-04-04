const express = require('express');
const router = express.Router();
const controller = require('../controllers/ideaController');
const authenticate = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

router.use(rateLimiter);

router.get('/', controller.getAllIdeas);
router.get('/public', controller.getPublicIdeaById);
router.get('/user/:id', authenticate, controller.getAllByUserId);
router.get('/search/title/:title', authenticate, controller.searchIdeasByTitle);
router.get('/search/id/:id', authenticate, controller.getIdeaById);
router.post('/search/tags', authenticate, controller.searchByTags);
router.post('/', authenticate, controller.createIdea);
router.put('/:id', authenticate, controller.updateIdea);
router.delete('/:id', authenticate, controller.deleteIdea);

module.exports = router;
