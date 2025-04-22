const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chatController');

// Route to get all messages in a given room
router.get('/:roomId/messages', ChatController.getMessages);

// Route to send a new message
router.post('/send', ChatController.sendMessage);

router.post('/get-dm-room', ChatController.getOrCreateDMRoom);

router.get('/:roomId/receiver', ChatController.getReceiverInfo);

router.get('/contacts/:userId', ChatController.getContacts);

module.exports = router; // Export router to be used in server.js

