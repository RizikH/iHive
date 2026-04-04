const express = require('express');
const router = express.Router();
const controller = require('../controllers/chatController');
const authenticate = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

router.use(rateLimiter);
router.use(authenticate);

router.get('/contacts', controller.getContacts);
router.get('/:roomId/messages', controller.getMessages);
router.get('/:roomId/receiver', controller.getReceiverInfo);
router.post('/send', controller.sendMessage);
router.post('/dm-room', controller.getOrCreateDMRoom);

module.exports = router;
