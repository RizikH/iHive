const express = require('express');
const router = express.Router();
const collabController = require('../controllers/collabController');
const authenticate = require('../middleware/authMiddleware');


// 🔐 Protected Routes
router.get('/:ideaId', authenticate, collabController.getCollabs);
router.post('/', authenticate, collabController.addCollab);
router.delete('/', authenticate, collabController.removeCollab);
router.put('/', authenticate, collabController.updateCollab);

module.exports = router;