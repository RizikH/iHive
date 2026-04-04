const express = require('express');
const router = express.Router();
const controller = require('../controllers/tagController');
const authenticate = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

router.use(rateLimiter);

router.get('/all', controller.getAllTags);
router.get('/search', controller.searchByName);
router.delete('/:id', authenticate, controller.deleteTag);

module.exports = router;
