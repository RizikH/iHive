const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chatController');

// Route to get all messages in a given room
router.get('/:roomId/messages', ChatController.getMessages);

// Route to send a new message
router.post('/send', ChatController.sendMessage);

module.exports = router; // Export router to be used in server.js

