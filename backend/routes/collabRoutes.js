const express = require('express');
const router = express.Router();
const controller = require('../controllers/collabController');
const authenticate = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

router.use(rateLimiter);
router.use(authenticate);

router.get('/:ideaId', controller.getCollabs);
router.post('/', controller.addCollab);
router.put('/:ideaId/:userId', controller.updateCollab);
router.delete('/:ideaId/:userId', controller.removeCollab);

module.exports = router;
