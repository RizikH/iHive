const express = require('express');
const router = express.Router();
const controller = require('../controllers/investmentController');
const authenticate = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

router.use(rateLimiter);
router.use(authenticate);

// Specific routes before parameterized routes
router.get('/user/:userId', controller.getInvestmentsByUser);
router.get('/entrepreneur/:userId', controller.getEntrepreneurInvestments);
router.get('/:ideaId', controller.getInvestmentsByIdea);
router.post('/', controller.createInvestment);
router.put('/:investmentId', controller.updateStatus);

module.exports = router;
