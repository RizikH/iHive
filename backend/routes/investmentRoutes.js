const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investmentController');

// Route to get all investments for a given idea
router.get('/:idea_id', investmentController.getInvestments);

// Route to create a new investment
router.post('/', investmentController.createInvestment);

// Get all investments by a specific user
router.get('/user/:user_id', investmentController.getInvestmentsByUser);

router.get('/entrepreneur/:user_id', investmentController.getEntrepreneurInvestments);

router.put('/:investment_id', investmentController.updateStatus);


module.exports = router;
