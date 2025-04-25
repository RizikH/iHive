const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chatController');
const authenticate = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

// ✅ NEW: Get current user info from token
const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
});

// Route to get all messages in a given room
router.get('/:roomId/messages', authRateLimiter, authenticate, ChatController.getMessages);

// Route to send a new message
router.post('/send', authRateLimiter, authenticate, ChatController.sendMessage);

router.post('/get-dm-room', authRateLimiter, authenticate, ChatController.getOrCreateDMRoom);

router.get('/:roomId/receiver', authRateLimiter, authenticate, ChatController.getReceiverInfo);

router.get('/contacts/:userId', authRateLimiter, authenticate, ChatController.getContacts);

module.exports = router; // Export router to be used in server.js
