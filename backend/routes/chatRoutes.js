const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chatController');

router.get('/:roomId/messages', ChatController.getMessages);

module.exports = router;
