const express = require('express');
const router = express.Router();
const collabController = require('../controllers/collabController');
const authenticate = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

// ✅ NEW: Get current user info from token
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

router.use(authRateLimiter);

// 🔐 Protected Routes
router.get('/:ideaId', authenticate, collabController.getCollabs);
router.post('/', authenticate, collabController.addCollab);
router.delete('/', authenticate, collabController.removeCollab);
router.put('/', authenticate, collabController.updateCollab);

module.exports = router;